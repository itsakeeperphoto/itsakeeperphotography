import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const failures = [];

const fail = (message) => failures.push(message);
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const jsonFiles = (relativeDirectory) =>
  fs
    .readdirSync(path.join(root, relativeDirectory))
    .filter((filename) => filename.endsWith(".json"))
    .sort();

const importTypeScript = async (relativePath) => {
  const result = await build({
    entryPoints: [path.join(root, relativePath)],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    logLevel: "silent",
  });
  const source = result.outputFiles[0]?.text;
  if (!source) throw new Error(`Unable to compile ${relativePath}.`);
  const encoded = Buffer.from(source).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
};

const [{ pageManifest }, { contentPageRoutes, resolveContentPageRoute }] =
  await Promise.all([
    importTypeScript("src/lib/page-manifest.ts"),
    importTypeScript("tina/content-page-routes.ts"),
  ]);

const expectedInventory = {
  "content/settings": 1,
  "content/homepage": 1,
  "content/pages": 19,
  "content/journal-pages": 6,
  "content/testimonials": 11,
};

for (const [directory, expectedCount] of Object.entries(expectedInventory)) {
  const actualCount = jsonFiles(directory).length;
  if (actualCount !== expectedCount) {
    fail(`${directory}: expected ${expectedCount} JSON documents, found ${actualCount}.`);
  }
}

const publicEntries = pageManifest;
if (publicEntries.length !== 20) {
  fail(`page manifest: expected 20 primary routes, found ${publicEntries.length}.`);
}

const contentEntries = pageManifest.filter((entry) => entry.contentPath);
const contentFiles = jsonFiles("content/pages");
if (contentEntries.length !== contentFiles.length) {
  fail(
    `content pages: manifest has ${contentEntries.length} documents but content/pages has ${contentFiles.length}.`,
  );
}

const manifestByContentPath = new Map(
  contentEntries.map((entry) => [entry.contentPath, entry]),
);

for (const filename of contentFiles) {
  const document = readJson(`content/pages/${filename}`);
  const entry = manifestByContentPath.get(filename);
  const stem = filename.replace(/\.json$/i, "");
  const editorRoute = resolveContentPageRoute(filename);

  if (!entry) {
    fail(`content/pages/${filename}: no page-manifest entry references this document.`);
    continue;
  }
  if (document.route !== entry.path) {
    fail(
      `content/pages/${filename}: document route ${document.route} does not match manifest ${entry.path}.`,
    );
  }
  if (editorRoute !== entry.path) {
    fail(
      `tina/content-page-routes.ts: ${filename} resolves to ${editorRoute || "nothing"}, expected ${entry.path}.`,
    );
  }
  if (!(stem in contentPageRoutes)) {
    fail(`tina/content-page-routes.ts: missing filename key ${stem}.`);
  }
}

for (const stem of Object.keys(contentPageRoutes)) {
  if (!contentFiles.includes(`${stem}.json`)) {
    fail(`tina/content-page-routes.ts: ${stem} has no matching content/pages document.`);
  }
}

const configSource = read("tina/config.ts");
const requiredConfigContracts = [
  ['name: "settings"', "settings collection"],
  ['name: "homepage"', "homepage collection"],
  ['name: "contentPage"', "contentPage collection"],
  ['name: "journalPage"', "journalPage collection"],
  ['name: "testimonial"', "testimonial collection"],
  ['resolveContentPageRoute(', "manifest-backed content-page router"],
  ['router: () => "/"', "Homepage/Settings preview router"],
  ['router: () => "/reviews/"', "Reviews preview router"],
  ['filename: { readonly: true }', "fixed document filenames"],
  ['isTitle: true', "readable document titles"],
  ['const hiddenSystemField = { component: "hidden" }', "hidden system fields"],
];

for (const [needle, label] of requiredConfigContracts) {
  if (!configSource.includes(needle)) {
    fail(`tina/config.ts: missing ${label}.`);
  }
}

for (const technicalName of [
  "route",
  "family",
  "contentStatus",
  "searchVisibility",
  "schemaType",
  "signature",
]) {
  const fieldPattern = new RegExp(
    `name:\\s*["']${technicalName}["'][\\s\\S]{0,360}?ui:\\s*hiddenSystemField`,
  );
  if (!fieldPattern.test(configSource)) {
    fail(`tina/config.ts: technical field ${technicalName} must remain hidden.`);
  }
}

if (
  !/name:\s*["']name["'][\s\S]{0,220}?required:\s*true[\s\S]{0,120}?isTitle:\s*true/.test(
    configSource,
  )
) {
  fail("tina/config.ts: testimonials must remain identifiable by required client name.");
}

const routerSource = read("src/components/pages/EditorialPageRouter.astro");
const expectedRenderers = new Map([
  ["/about/", "AboutPage"],
  ["/branding-photographer-tri-cities-wa/", "BrandingPage"],
  ["/contact/", "ContactPage"],
  ["/family-photographer-tri-cities-wa/", "FamilyPage"],
  ["/headshot-photographer-tri-cities-wa/", "HeadshotPage"],
  ["/investment/", "InvestmentPage"],
  ["/journal/", "JournalPage"],
  ["/journal/branding-photos-vs-headshots/", "BrandingHeadshotsArticlePage"],
  ["/journal/family-photo-locations-tri-cities/", "LocationsGuidePage"],
  ["/journal/in-home-vs-studio-newborn-photography/", "NewbornComparisonPage"],
  ["/journal/when-to-book-senior-pictures-tri-cities/", "SeniorTimingPage"],
  ["/kennewick-wa-photographer/", "KennewickPage"],
  ["/newborn-photographer-tri-cities-wa/", "NewbornPage"],
  ["/pasco-wa-photographer/", "PascoPage"],
  ["/reviews/", "ReviewsPage"],
  ["/richland-wa-photographer/", "RichlandPage"],
  ["/senior-photographer-tri-cities-wa/", "SeniorPage"],
  ["/thank-you/", "ThankYouPage"],
]);

for (const [route, component] of expectedRenderers) {
  if (!routerSource.includes(`props.page.route === "${route}"`)) {
    fail(`EditorialPageRouter.astro: missing route ${route}.`);
  }
  if (!routerSource.includes(`<${component} {...props} />`)) {
    fail(`EditorialPageRouter.astro: missing renderer ${component}.`);
  }
}
if (!routerSource.includes(": <ContentPage {...props} />")) {
  fail("EditorialPageRouter.astro: Privacy must retain the generic ContentPage fallback.");
}

const rendererFiles = [
  ...new Set([...expectedRenderers.values(), "ContentPage"]),
].map((component) => `src/components/pages/${component}.astro`);

for (const rendererFile of rendererFiles) {
  const source = read(rendererFile);
  if (!source.includes("tinaField")) {
    fail(`${rendererFile}: missing tinaField import/use.`);
  }
  if (!source.includes("data-tina-field")) {
    fail(`${rendererFile}: missing visual-editing field markers.`);
  }
}

const editorialHeroSource = read("src/components/pages/EditorialHero.astro");
if (
  !editorialHeroSource.includes("dataTinaField?: string") ||
  !editorialHeroSource.includes("data-tina-field={dataTinaField")
) {
  fail("EditorialHero.astro: missing its design-neutral Tina field marker contract.");
}

const journalRouteSource = read("src/pages/journal/[slug].astro");
if (!journalRouteSource.includes("<EditorialPageRouter page={page} settings={settings} />")) {
  fail("journal/[slug].astro: SSR and Tina refresh must share EditorialPageRouter.");
}

const tinaDataSource = read("src/lib/tina/data.ts");
for (const queryName of ["contentPageBasic", "contentPageContact", "contentPageSite"]) {
  if (!tinaDataSource.includes(`client.queries.${queryName}`)) {
    fail(`src/lib/tina/data.ts: missing ${queryName} loader.`);
  }
}
if (tinaDataSource.includes("client.queries as any")) {
  fail("src/lib/tina/data.ts: generated Tina queries must remain type-checked.");
}

const tinaIslandsSource = read("src/lib/tina/islands.ts");
if (
  !tinaIslandsSource.includes("normalizeContentPageLists") ||
  !tinaIslandsSource.includes("page.sections ??= []") ||
  !tinaIslandsSource.includes("item.links ??= []")
) {
  fail("src/lib/tina/islands.ts: nullable GraphQL lists must be normalized in place.");
}

for (const [rendererFile, nullableListGuard] of [
  ["src/components/pages/BrandingPage.astro", "links ?? []"],
  ["src/components/pages/HeadshotPage.astro", "links ?? []"],
]) {
  if (!read(rendererFile).includes(nullableListGuard)) {
    fail(`${rendererFile}: optional Tina GraphQL link lists must remain null-safe.`);
  }
}

if (failures.length) {
  console.error(`Tina editor validation failed with ${failures.length} issue(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  `Tina editor validation passed: 5 collections, 38 documents, ${publicEntries.length} public routes and ${rendererFiles.length} renderer contracts.`,
);
