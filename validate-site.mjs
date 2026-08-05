import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { build as bundleWithEsbuild } from "esbuild";

const mode = process.env.SITE_MODE || process.env.PUBLICATION_MODE || "staging";
const root = process.cwd();
const output = existsSync(path.join(root, "dist", "client"))
  ? path.join(root, "dist", "client")
  : path.join(root, "dist");
const manifestBundle = await bundleWithEsbuild({
  entryPoints: [path.join(root, "src", "lib", "page-manifest.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  logLevel: "silent",
});
const manifestModuleUrl = `data:text/javascript;base64,${Buffer.from(
  manifestBundle.outputFiles[0].text
).toString("base64")}`;
const { pageManifest } = await import(manifestModuleUrl);

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
const outputFileForRoute = (route) =>
  route === "/"
    ? "index.html"
    : `${route.replace(/^\/+|\/+$/g, "").split("/").join(path.sep)}${path.sep}index.html`;
const indexableManifestEntries = pageManifest.filter(
  (entry) =>
    entry.contentStatus === "ready" &&
    entry.searchVisibility === "index" &&
    entry.sitemap
);
const indexableReleaseFiles = new Set(
  indexableManifestEntries.map((entry) => outputFileForRoute(entry.path))
);
const indexableReleaseCanonicals = new Set();

for (const entry of pageManifest) {
  if (entry.contentStatus === "draft" && entry.searchVisibility !== "noindex") {
    failures.push(`${entry.path}: draft manifest entries must remain noindex`);
  }
  if (
    entry.searchVisibility === "index" &&
    (entry.contentStatus !== "ready" || !entry.sitemap || !entry.lastModified)
  ) {
    failures.push(
      `${entry.path}: indexable manifest entries must be ready, sitemap-enabled, and dated`
    );
  }
  if (entry.contentPath) {
    const contentFile = path.join(root, "content", "pages", entry.contentPath);
    const content = JSON.parse(await readFile(contentFile, "utf8"));
    if (
      content.route !== entry.path ||
      content.contentStatus !== entry.contentStatus ||
      content.searchVisibility !== entry.searchVisibility
    ) {
      failures.push(`${entry.path}: content JSON publication state differs from the manifest`);
    }
  }
}

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
    const canonical = source.match(
      /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
    )?.[1];
    const expectedRobots = shouldIndex
      ? /<meta name="robots" content="index, follow, max-image-preview:large"/i
      : /<meta name="robots" content="noindex, nofollow, noarchive"/i;
    if (!expectedRobots.test(source)) {
      failures.push(`${relative}: release robots state does not match content readiness`);
    }
    if (!/href="https:\/\/www\.itsakeeperphotography\.com(?:\/|[^\"]*\/)"/i.test(source)) {
      failures.push(`${relative}: release canonical does not use the custom-domain origin`);
    }
    if (shouldIndex && canonical) indexableReleaseCanonicals.add(canonical);
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
const redirects = await readFile(path.join(output, "_redirects"), "utf8");
const noindexHeaderPatterns = headers
  .trim()
  .split(/\n(?=\/)/)
  .filter((block) => /X-Robots-Tag:\s*noindex/i.test(block))
  .map((block) => block.split("\n", 1)[0].trim());
const isNoindexedByNetlify = (pathname) =>
  noindexHeaderPatterns.some((pattern) => {
    if (!pattern.endsWith("*")) return pathname === pattern;
    return pathname.startsWith(pattern.slice(0, -1));
  });

const decodeXml = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
  (match) => {
    const loc = match[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    return {
      loc: loc ? decodeXml(loc.trim()) : "",
      lastmod: lastmod?.trim() || "",
    };
  }
);

if (!/^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(sitemap)) {
  failures.push("sitemap.xml: XML declaration is missing or invalid");
}
if (!/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(sitemap)) {
  failures.push("sitemap.xml: standard sitemap namespace is missing");
}
if (/<(?:priority|changefreq)>/i.test(sitemap)) {
  failures.push("sitemap.xml: deprecated priority/changefreq tags must not be emitted");
}

for (const rule of [
  "https://itsakeeperphotography.com/* https://www.itsakeeperphotography.com/:splat 301!",
  "http://itsakeeperphotography.com/* https://www.itsakeeperphotography.com/:splat 301!",
  "https://itsakeeperphotography.netlify.app/* https://www.itsakeeperphotography.com/:splat 301!",
  "http://itsakeeperphotography.netlify.app/* https://www.itsakeeperphotography.com/:splat 301!",
]) {
  if (!redirects.includes(rule)) {
    failures.push(`_redirects: canonical hostname rule is missing (${rule})`);
  }
}

if (mode === "staging") {
  if (/<url>/.test(sitemap)) failures.push("sitemap.xml: staging sitemap must be empty");
  if (!/staging preview/i.test(llms) || /https:\/\//i.test(llms)) {
    failures.push("llms.txt: staging citation gate is incorrect");
  }
  if (!noindexHeaderPatterns.includes("/*")) {
    failures.push("_headers: staging global X-Robots-Tag is missing");
  }
  if (/^Sitemap:/im.test(robots)) {
    failures.push("robots.txt: staging must not advertise a sitemap");
  }
} else {
  const sitemapUrls = sitemapEntries.map((entry) => entry.loc);
  const expectedSitemapUrls = indexableManifestEntries.map((entry) =>
    new URL(entry.path, "https://www.itsakeeperphotography.com/").toString()
  );
  const expectedLastmodByUrl = new Map(
    indexableManifestEntries.map((entry) => [
      new URL(entry.path, "https://www.itsakeeperphotography.com/").toString(),
      entry.lastModified,
    ])
  );
  const renderedIndexableCanonicals = [...indexableReleaseCanonicals].sort();
  if (
    JSON.stringify(renderedIndexableCanonicals) !==
    JSON.stringify([...expectedSitemapUrls].sort())
  ) {
    failures.push("release indexable canonicals do not match the page manifest");
  }
  const actualSorted = [...sitemapUrls].sort();
  const expectedSorted = [...expectedSitemapUrls].sort();
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    failures.push(
      `sitemap.xml: release membership is ${sitemapUrls.join(", ") || "empty"}; expected ${expectedSitemapUrls.join(", ") || "empty"}`
    );
  }
  if (new Set(sitemapUrls).size !== sitemapUrls.length) {
    failures.push("sitemap.xml: duplicate canonical URLs detected");
  }
  for (const entry of pageManifest) {
    const shouldIndex = indexableManifestEntries.some(
      (candidate) => candidate.path === entry.path
    );
    const headerNoindex = isNoindexedByNetlify(entry.path);
    if (shouldIndex && headerNoindex) {
      failures.push(`${entry.path}: release Netlify header conflicts with sitemap indexing`);
    }
    if (!shouldIndex && !headerNoindex) {
      failures.push(`${entry.path}: release noindex Netlify header is missing`);
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of sitemapEntries) {
    let parsed;
    try {
      parsed = new URL(entry.loc);
    } catch {
      failures.push(`sitemap.xml: invalid URL ${entry.loc || "(missing loc)"}`);
      continue;
    }
    if (
      parsed.protocol !== "https:" ||
      parsed.origin !== "https://www.itsakeeperphotography.com" ||
      parsed.search ||
      parsed.hash
    ) {
      failures.push(`sitemap.xml: non-canonical URL ${entry.loc}`);
    }
    if (parsed.pathname !== "/" && !parsed.pathname.endsWith("/")) {
      failures.push(`sitemap.xml: URL must use the canonical trailing slash (${entry.loc})`);
    }
    if (!internalTargetExists(parsed.pathname)) {
      failures.push(`sitemap.xml: URL has no generated HTML route (${entry.loc})`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod)) {
      failures.push(`sitemap.xml: ${entry.loc} is missing a YYYY-MM-DD lastmod`);
    } else if (entry.lastmod > today) {
      failures.push(`sitemap.xml: ${entry.loc} has a future lastmod (${entry.lastmod})`);
    } else if (entry.lastmod !== expectedLastmodByUrl.get(entry.loc)) {
      failures.push(
        `sitemap.xml: ${entry.loc} lastmod differs from the page manifest`
      );
    }
  }
  if (!/Sitemap: https:\/\/www\.itsakeeperphotography\.com\/sitemap\.xml/.test(robots)) {
    failures.push("robots.txt: release sitemap declaration is missing");
  }
  if (/^Disallow:\s*\/\s*$/im.test(robots)) {
    failures.push("robots.txt: release must not block the entire site");
  }
  const llmsUrls = [...llms.matchAll(/^- \[[^\]]+\]\((https:\/\/[^)]+)\):/gm)].map(
    (match) => match[1]
  );
  const expectedLlmsUrls = pageManifest
    .filter(
      (entry) =>
        entry.contentStatus === "ready" &&
        entry.searchVisibility === "index" &&
        entry.llms
    )
    .map((entry) =>
      new URL(entry.path, "https://www.itsakeeperphotography.com/").toString()
    );
  if (
    JSON.stringify([...llmsUrls].sort()) !==
    JSON.stringify([...expectedLlmsUrls].sort())
  ) {
    failures.push("llms.txt: release membership is incorrect");
  }
  if (!noindexHeaderPatterns.includes("/api/*")) {
    failures.push("_headers: release API noindex rule is missing");
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} public routes in ${mode} mode.`);
}
