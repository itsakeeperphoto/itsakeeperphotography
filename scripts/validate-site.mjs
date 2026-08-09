import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const mode = process.env.SITE_MODE || process.env.PUBLICATION_MODE || "staging";
const root = process.cwd();
const output = existsSync(path.join(root, "dist", "client"))
  ? path.join(root, "dist", "client")
  : path.join(root, "dist");

const collectHtml = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(target)));
    else if (entry.name === "index.html") files.push(target);
  }
  return files;
};

const htmlFiles = (await collectHtml(output)).filter(
  (file) => !file.includes(`${path.sep}admin${path.sep}`)
);
const failures = [];
const internalTargetExists = (href) => {
  let pathname;
  try {
    pathname = decodeURIComponent(href.split(/[?#]/, 1)[0]);
  } catch {
    return false;
  }

  const relative = pathname.replace(/^\/+/, "");
  const candidates = pathname.endsWith("/")
    ? [path.join(output, relative, "index.html")]
    : [
        path.join(output, relative),
        path.join(output, relative, "index.html"),
        path.join(output, `${relative}.html`),
      ];

  const outputRoot = path.resolve(output);
  return candidates.some((candidate) => {
    const resolved = path.resolve(candidate);
    return resolved.startsWith(`${outputRoot}${path.sep}`) && existsSync(resolved);
  });
};
const indexableReleaseFiles = new Set([
  "index.html",
  `family-photographer-tri-cities-wa${path.sep}index.html`,
  `richland-wa-photographer${path.sep}index.html`,
  `journal${path.sep}family-photo-locations-tri-cities${path.sep}index.html`,
  `portfolio${path.sep}index.html`,
]);

for (const file of htmlFiles) {
  const relative = path.relative(output, file);
  const source = await readFile(file, "utf8");
  const withoutComments = source.replace(/<!--[\s\S]*?-->/g, "");
  const main = withoutComments.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
  const internalAnchors = [...main.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/#"));

  const brokenInternalAnchors = [
    ...new Set(internalAnchors.filter((href) => !internalTargetExists(href))),
  ];
  if (brokenInternalAnchors.length) {
    failures.push(
      `${relative}: broken internal body links (${brokenInternalAnchors.join(", ")})`
    );
  }
  if (/\[(?:PENDIENTE|VALIDAR|FECHA)|CONTENT PENDING/i.test(withoutComments)) {
    failures.push(`${relative}: unresolved placeholder leaked into rendered HTML`);
  }
  if (/62 Canyon St|maps\/search\/\?api=1/i.test(withoutComments)) {
    failures.push(`${relative}: private street address or address-bearing map URL leaked`);
  }
  if (/\/api\/inquiry|It’s A Keeper inquiry payload|data-placeholder-handler/i.test(withoutComments)) {
    failures.push(`${relative}: placeholder inquiry handler remains`);
  }
  if (mode === "staging" && !/<meta name="robots" content="noindex, nofollow, noarchive"/i.test(source)) {
    failures.push(`${relative}: staging robots directive is missing`);
  }
  if (mode === "staging" && !/href="https:\/\/itsakeeperphotography\.netlify\.app(?:\/|[^\"]*\/)"/i.test(source)) {
    failures.push(`${relative}: staging canonical does not use the Netlify foundation origin`);
  }
  if (mode === "release") {
    const shouldIndex = indexableReleaseFiles.has(relative);
    const expectedRobots = shouldIndex
      ? /<meta name="robots" content="index, follow, max-image-preview:large"/i
      : /<meta name="robots" content="noindex, nofollow, noarchive"/i;
    if (!expectedRobots.test(source)) {
      failures.push(`${relative}: release robots state does not match content readiness`);
    }
    if (!/href="https:\/\/www\.itsakeeperphotography\.com(?:\/|[^\"]*\/)"/i.test(source)) {
      failures.push(`${relative}: release canonical does not use the custom-domain origin`);
    }
  }
  if (
    !["index.html", `portfolio${path.sep}index.html`].includes(relative) &&
    !/data-signature-device="(?:arch|overlap|crossing-line)"/.test(source)
  ) {
    failures.push(`${relative}: signature composition marker is missing`);
  }
}

const homepage = await readFile(path.join(output, "index.html"), "utf8");
const contact = await readFile(path.join(output, "contact", "index.html"), "utf8");
for (const [label, formName, source] of [
  ["homepage", "session-inquiry", homepage],
  ["contact", "session-estimate", contact],
]) {
  const formPattern = new RegExp(
    `<form\\b[^>]*name="${formName}"[^>]*method="post"[^>]*action="/thank-you/"[^>]*data-netlify="true"`,
    "i",
  );
  if (!formPattern.test(source)) {
    failures.push(`${label}: statically detectable Netlify form is missing`);
  }
  if (
    !source.includes(`name="form-name" value="${formName}"`) ||
    !/name="bot-field"/.test(source)
  ) {
    failures.push(`${label}: Netlify form name or honeypot is missing`);
  }
}

if (htmlFiles.length !== 21) failures.push(`expected 21 public HTML routes; found ${htmlFiles.length}`);

const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
const robots = await readFile(path.join(output, "robots.txt"), "utf8");
const llms = await readFile(path.join(output, "llms.txt"), "utf8");
const headers = await readFile(path.join(output, "_headers"), "utf8");

if (mode === "staging") {
  if (/<url>/.test(sitemap)) failures.push("sitemap.xml: staging sitemap must be empty");
  if (!/staging preview/i.test(llms) || /\/family-photographer-tri-cities-wa\//.test(llms)) {
    failures.push("llms.txt: staging citation gate is incorrect");
  }
  if (!/X-Robots-Tag: noindex, nofollow, noarchive/.test(headers)) {
    failures.push("_headers: staging global X-Robots-Tag is missing");
  }
} else {
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedSitemapUrls = [
    "https://www.itsakeeperphotography.com/",
    "https://www.itsakeeperphotography.com/family-photographer-tri-cities-wa/",
    "https://www.itsakeeperphotography.com/richland-wa-photographer/",
    "https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/",
    "https://www.itsakeeperphotography.com/portfolio/",
  ];
  if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedSitemapUrls)) {
    failures.push(`sitemap.xml: release membership is ${sitemapUrls.join(", ") || "empty"}`);
  }
  if (!/Sitemap: https:\/\/www\.itsakeeperphotography\.com\/sitemap\.xml/.test(robots)) {
    failures.push("robots.txt: release sitemap declaration is missing");
  }
  const llmsUrls = [...llms.matchAll(/\]\((https:\/\/www\.itsakeeperphotography\.com\/[^)]*)\)/g)]
    .map((match) => match[1]);
  const expectedLlmsUrls = [
    "https://www.itsakeeperphotography.com/",
    "https://www.itsakeeperphotography.com/family-photographer-tri-cities-wa/",
    "https://www.itsakeeperphotography.com/richland-wa-photographer/",
    "https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/",
  ];
  if (JSON.stringify(llmsUrls) !== JSON.stringify(expectedLlmsUrls)) {
    failures.push(`llms.txt: release membership is ${llmsUrls.join(", ") || "empty"}`);
  }
  if (/^\/journal\/\*\s*$/m.test(headers)) {
    failures.push("_headers: broad /journal/* noindex rule must not block the published guide");
  }
  if (/^\/richland-wa-photographer\/\*\s*$/m.test(headers)) {
    failures.push("_headers: Richland noindex rule must not block the published city page");
  }
  for (const route of [
    "/contact/*",
    "/journal/",
    "/journal/when-to-book-senior-pictures-tri-cities/*",
    "/journal/in-home-vs-studio-newborn-photography/*",
    "/journal/branding-photos-vs-headshots/*",
    "/privacy/*",
    "/thank-you/*",
  ]) {
    const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const noindexRule = new RegExp(
      `^${escapedRoute}\\n  X-Robots-Tag: noindex, nofollow, noarchive$`,
      "m",
    );
    if (!noindexRule.test(headers)) {
      failures.push(`_headers: release noindex rule missing for ${route}`);
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} public routes in ${mode} mode.`);
}
