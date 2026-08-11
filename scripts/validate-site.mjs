import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import {
  buildSafeXmp,
  validateImageSeoManifest,
} from "./lib/image-xmp.mjs";

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
const imageSeoManifest = validateImageSeoManifest(
  JSON.parse(
    await readFile(
      path.join(root, "config", "image-seo-metadata.json"),
      "utf8",
    ),
  ),
);

for (const [filename, asset] of Object.entries(imageSeoManifest.assets)) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.jpg$/.test(filename)) {
    failures.push(`${filename}: image SEO filename must be lowercase kebab-case`);
  }
  if (asset.description.length < 10 || asset.description.length > 125) {
    failures.push(`${filename}: image SEO description must be 10-125 characters`);
  }

  const sourcePath = path.join(root, "public", "uploads", filename);
  if (!existsSync(sourcePath)) {
    failures.push(`${filename}: image SEO source is missing`);
    continue;
  }

  const sourceStat = await stat(sourcePath);
  const sourceMetadata = await sharp(sourcePath).metadata();
  const expectedXmp = buildSafeXmp(imageSeoManifest, asset);
  if (
    sourceMetadata.format !== "jpeg" ||
    !sourceMetadata.width ||
    !sourceMetadata.height ||
    Math.max(sourceMetadata.width, sourceMetadata.height) > 2400 ||
    sourceStat.size > 700 * 1024 ||
    sourceMetadata.exif ||
    sourceMetadata.iptc ||
    sourceMetadata.icc ||
    sourceMetadata.orientation ||
    sourceMetadata.xmp?.toString() !== expectedXmp
  ) {
    failures.push(`${filename}: JPEG dimensions, weight or safe-XMP contract failed`);
  }

  const base = filename.replace(/\.jpg$/, "");
  for (const width of [400, 640, 960, 1440]) {
    const variantName = `${base}-${width}.webp`;
    const variantPath = path.join(root, "public", "uploads", variantName);
    if (!existsSync(variantPath)) {
      failures.push(`${variantName}: responsive WebP is missing`);
      continue;
    }
    const variantMetadata = await sharp(variantPath).metadata();
    if (
      variantMetadata.format !== "webp" ||
      variantMetadata.width !== width ||
      variantMetadata.exif ||
      variantMetadata.iptc ||
      variantMetadata.icc ||
      variantMetadata.orientation ||
      variantMetadata.xmp?.toString() !== expectedXmp
    ) {
      failures.push(`${variantName}: responsive safe-XMP contract failed`);
    }
  }
}
const homepageContent = JSON.parse(
  await readFile(path.join(root, "content", "homepage", "index.json"), "utf8"),
);
const homepageHeroContract = {
  image: "/uploads/kennewick-couple-open-field-golden-hour.jpg",
  imageAlt:
    "A couple laughing together while walking through an open field in warm evening light",
  desktopAvif:
    "/uploads/kennewick-couple-open-field-golden-hour-desktop.avif",
  desktopWebp:
    "/uploads/kennewick-couple-open-field-golden-hour-desktop.webp",
  mobileAvif:
    "/uploads/kennewick-couple-open-field-golden-hour-mobile.avif",
  mobileWebp:
    "/uploads/kennewick-couple-open-field-golden-hour-mobile.webp",
};
const homepageBiographyContract = {
  portrait: "/uploads/lisa-photographer-tricities.jpg",
  portraitAlt:
    "Lisa, owner of It’s A Keeper Photography, holding her camera in the Tri-Cities",
  printImage: "/uploads/about-lisa-camera-candid-black-white.jpg",
};
if (
  homepageContent.hero?.image !== homepageHeroContract.image ||
  homepageContent.hero?.imageAlt !== homepageHeroContract.imageAlt
) {
  failures.push("content/homepage/index.json: hero image contract is invalid");
}
if (
  homepageContent.meetLisa?.portrait !== homepageBiographyContract.portrait ||
  homepageContent.meetLisa?.portraitAlt !== homepageBiographyContract.portraitAlt ||
  homepageContent.meetLisa?.printImage !== homepageBiographyContract.printImage
) {
  failures.push("content/homepage/index.json: Meet Lisa image contract is invalid");
}
for (const asset of [
  homepageHeroContract.image,
  homepageHeroContract.desktopAvif,
  homepageHeroContract.desktopWebp,
  homepageHeroContract.mobileAvif,
  homepageHeroContract.mobileWebp,
  homepageBiographyContract.portrait,
  homepageBiographyContract.printImage,
]) {
  if (!existsSync(path.join(root, "public", asset.replace(/^\//, "")))) {
    failures.push(`content/homepage/index.json: missing approved image ${asset}`);
  }
}
for (const [asset, expectedDigest] of [
  [
    homepageHeroContract.image,
    "37cc4686f26b843e68b847ad033ed419fc668abd63d237040cd08fd845b0a43f",
  ],
  [
    homepageBiographyContract.printImage,
    "ac3bb02ffb4154555321271699a874c3632ca0941b0aa2cd5b00e0607b5db89e",
  ],
]) {
  const digest = createHash("sha256")
    .update(await readFile(path.join(root, "public", asset.replace(/^\//, ""))))
    .digest("hex");
  if (digest !== expectedDigest) {
    failures.push(`${asset}: approved Homepage source changed (${digest})`);
  }
}
const homepageSessionCards = [
  {
    label: "Seniors",
    image: "/uploads/senior-portrait-golden-hour-richland.jpg",
    imageAlt: "High school senior in a black dress photographed at golden hour in Richland",
  },
  {
    label: "Families",
    image: "/uploads/about-belief-family-golden-hour-tricities.jpg",
    imageAlt: "Parents holding their young child close in warm evening light",
  },
  {
    label: "Newborns",
    image: "/uploads/newborn-family-at-home-west-richland.jpg",
    imageAlt: "Parents and an older sister gathered around a sleeping newborn on a bed",
  },
  {
    label: "Branding",
    image: "/uploads/about-lisa-camera-portrait-tricities.jpg",
    imageAlt: "A photographer holding her camera during an outdoor portrait",
  },
  {
    label: "Headshots",
    image: "/uploads/review-lisa-griffith-headshot-tricities.jpg",
    imageAlt: "A man in a black shirt seated against a dark studio backdrop",
  },
];
const homepageSessionContract = (homepageContent.sessions?.cards || []).map(
  ({ label, image, imageAlt }) => ({ label, image, imageAlt }),
);
if (JSON.stringify(homepageSessionContract) !== JSON.stringify(homepageSessionCards)) {
  failures.push(
    "content/homepage/index.json: session-card images or alts differ from the approved five-card contract",
  );
}
if (new Set(homepageSessionCards.map((card) => card.image)).size !== homepageSessionCards.length) {
  failures.push("content/homepage/index.json: session-card images must be unique");
}
for (const card of homepageSessionCards) {
  if (!existsSync(path.join(root, "public", card.image.replace(/^\//, "")))) {
    failures.push(`content/homepage/index.json: missing session-card image ${card.image}`);
  }
}
const homepageSeniorDigest = createHash("sha256")
  .update(
    await readFile(
      path.join(root, "public", "uploads", "senior-portrait-golden-hour-richland.jpg"),
    ),
  )
  .digest("hex");
if (
  homepageSeniorDigest !==
  "1a85d3e4c31018b57001d63a2a782eee3fb037e92f054680d3030ed8dc8a679c"
) {
  failures.push(
    `public/uploads/senior-portrait-golden-hour-richland.jpg: protected Seniors image changed (${homepageSeniorDigest})`,
  );
}
const aboutSource = JSON.parse(
  await readFile(path.join(root, "content", "pages", "about.json"), "utf8"),
);
const aboutHeroDigest = createHash("sha256")
  .update(JSON.stringify(aboutSource.hero))
  .digest("hex");
if (
  aboutHeroDigest !==
  "89ff030fedfc6e042ffa325711f08e1b80df846634923976e3560d26cf0bdc73"
) {
  failures.push(
    `content/pages/about.json: protected hero subtree changed (${aboutHeroDigest})`,
  );
}
const aboutOriginSource = aboutSource.sections?.find(
  (section) => section.id === "it-started-with-my-own-children",
);
const aboutLessonsSource = aboutSource.sections?.find(
  (section) => section.id === "what-twenty-years-behind-the-camera-has-taught-me",
);
const aboutBeliefSource = aboutSource.sections?.find(
  (section) => section.id === "what-i-believe-you-deserve",
);
const aboutLessonPrints = (aboutLessonsSource?.items || [])
  .filter((item) => item.image)
  .slice(0, 3);
const [aboutHeroHeadingLead, aboutHeroHeadingTail] =
  aboutSource.hero.heading.split(" Behind ");
const aboutEffectiveHeroProps = {
  pageKey: "about",
  titleId: "about-hero-title",
  heading: aboutSource.hero.heading,
  headingLines: [
    aboutHeroHeadingLead,
    ...(aboutHeroHeadingTail ? [`Behind ${aboutHeroHeadingTail}`] : []),
  ],
  scriptLine: aboutSource.hero.scriptLine || "",
  intro: aboutSource.hero.intro,
  links: aboutSource.hero.links,
  backgroundImage: aboutSource.hero.image,
  backgroundAlt: aboutSource.hero.imageAlt,
  backgroundPosition: "50% 24%",
  mobileBackgroundPosition: "50% 24%",
  leftPrint: {
    src:
      aboutOriginSource?.secondaryImage ||
      aboutLessonPrints[0]?.image ||
      aboutBeliefSource?.image,
    objectPosition: "50% 45%",
  },
  rightPrint: {
    src: aboutLessonPrints[2]?.image || aboutBeliefSource?.image,
    objectPosition: "50% 48%",
  },
  paperEdgeColor: "var(--color-warm-ivory)",
};
const aboutEffectiveHeroDigest = createHash("sha256")
  .update(JSON.stringify(aboutEffectiveHeroProps))
  .digest("hex");
if (
  aboutEffectiveHeroDigest !==
  "035a9fac0a023b507ef96a3f5870c8530279ecc0570dfed609447e23eb99de81"
) {
  failures.push(
    `content/pages/about.json: protected effective hero props changed (${aboutEffectiveHeroDigest})`,
  );
}
const aboutComponentSource = await readFile(
  path.join(root, "src", "components", "pages", "AboutPage.astro"),
  "utf8",
);
const aboutHeroInvocation = aboutComponentSource.match(
  /<EditorialHero\b[\s\S]*?\n\s*\/>/,
)?.[0].trim() || "";
const aboutHeroInvocationDigest = createHash("sha256")
  .update(aboutHeroInvocation)
  .digest("hex");
if (
  aboutHeroInvocationDigest !==
  "8ddaf0424452d0e5bab30a198a4ef545070d63cedfe7808a87f1507a615eddc3"
) {
  failures.push(
    `src/components/pages/AboutPage.astro: protected EditorialHero invocation changed (${aboutHeroInvocationDigest})`,
  );
}
const newbornSource = JSON.parse(
  await readFile(path.join(root, "content", "pages", "newborn.json"), "utf8"),
);
const newbornProtectedContent = {
  hero: {
    value: newbornSource.hero,
    sha256: "699c9486f5e59f0b1d898943f0b062fb8251f8de6c1c2b60f53268bcc6d05e85",
  },
  process: {
    value: newbornSource.sections?.find(
      (section) => section.id === "newborn-session-process",
    ),
    sha256: "23dac799de1ec93127927a678e95fcc25d60da9dbd6c8835fc2cbf3d6e803ad3",
  },
};
for (const [region, contract] of Object.entries(newbornProtectedContent)) {
  const digest = createHash("sha256")
    .update(JSON.stringify(contract.value))
    .digest("hex");
  if (digest !== contract.sha256) {
    failures.push(
      `content/pages/newborn.json: protected ${region} subtree changed (${digest})`,
    );
  }
}
const decodeHtml = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_match, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&(amp|lt|gt|quot|apos|#39);/g, (entity) => ({
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&apos;": "'",
      "&#39;": "'",
    })[entity]);
const normalizedText = (value = "") =>
  decodeHtml(value.replace(/<[^>]*>/g, " "))
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const htmlAttribute = (tag, name) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(
    new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(["'])(.*?)\\1`, "i"),
  );
  return match ? decodeHtml(match[2]).trim() : null;
};
const hasHtmlAttribute = (tag, name) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)${escapedName}(?:\\s*=|\\s|/?>)`, "i").test(tag);
};
const sectionById = (source, id) => {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(
    new RegExp(
      `<section\\b(?=[^>]*\\bid=["']${escapedId}["'])[^>]*>([\\s\\S]*?)<\\/section>`,
      "i",
    ),
  )?.[1] || "";
};
const parseJsonLd = (source, relative) => {
  const schemas = [];
  for (const match of source.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      schemas.push(JSON.parse(match[1]));
    } catch {
      failures.push(`${relative}: JSON-LD must be valid JSON`);
    }
  }
  return schemas;
};
const nestedSchemaObjects = (value) => {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(nestedSchemaObjects);
  return [value, ...Object.values(value).flatMap(nestedSchemaObjects)];
};
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
const stylesheetCache = new Map();
const readInternalStylesheet = async (href) => {
  let pathname;
  try {
    const parsed = new URL(href, "https://static.invalid/");
    if (parsed.origin !== "https://static.invalid") return "";
    pathname = decodeURIComponent(parsed.pathname);
  } catch {
    return "";
  }

  const resolved = path.resolve(output, pathname.replace(/^\/+/, ""));
  const outputRoot = path.resolve(output);
  if (
    !resolved.startsWith(`${outputRoot}${path.sep}`) ||
    !resolved.endsWith(".css") ||
    !existsSync(resolved)
  ) {
    return "";
  }
  if (!stylesheetCache.has(resolved)) {
    stylesheetCache.set(resolved, await readFile(resolved, "utf8"));
  }
  return stylesheetCache.get(resolved);
};
const indexableReleaseFiles = new Set([
  "index.html",
  `family-photographer-tri-cities-wa${path.sep}index.html`,
  `newborn-photographer-tri-cities-wa${path.sep}index.html`,
  `about${path.sep}index.html`,
  `contact${path.sep}index.html`,
  `richland-wa-photographer${path.sep}index.html`,
  `kennewick-wa-photographer${path.sep}index.html`,
  `pasco-wa-photographer${path.sep}index.html`,
  `journal${path.sep}family-photo-locations-tri-cities${path.sep}index.html`,
  `portfolio${path.sep}index.html`,
]);
const expandedDirectoryLinkCounts = new Map([
  [`richland-wa-photographer${path.sep}index.html`, 9],
  [`kennewick-wa-photographer${path.sep}index.html`, 9],
  [`pasco-wa-photographer${path.sep}index.html`, 8],
]);
const pascoRelative = `pasco-wa-photographer${path.sep}index.html`;
const newbornRelative = `newborn-photographer-tri-cities-wa${path.sep}index.html`;
const aboutRelative = `about${path.sep}index.html`;
const serviceMediaContracts = new Map([
  [
    `branding-photographer-tri-cities-wa${path.sep}index.html`,
    {
      pageClass: "branding-page",
      minimumUnique: 10,
      maximumUses: 2,
      mosaicRange: [5, 9],
      triptychRange: [9, 12],
      images: [
        {
          src: "/uploads/branding-chef-kitchen-richland-wa.jpg",
          alt: "Chef smiling while stirring vegetables in a modern kitchen during a Richland branding session.",
        },
        {
          src: "/uploads/personal-branding-portrait-kitchen-west-richland-wa.jpg",
          alt: "",
        },
        { src: "/uploads/lisa-photographer-tricities.jpg", alt: "" },
        {
          src: "/uploads/business-owner-kitchen-branding-west-richland-wa.jpg",
          alt: "Business owner leaning on a kitchen counter during a West Richland personal branding session.",
        },
        {
          src: "/uploads/professional-headshot-man-blue-shirt-kennewick-wa.jpg",
          alt: "Smiling man in a blue shirt photographed against a warm stone backdrop in Kennewick.",
        },
        {
          src: "/uploads/pianist-creative-branding-portrait-richland-wa.jpg",
          alt: "Pianist seated beside sheet music in a layered creative portrait made in Richland.",
        },
        {
          src: "/uploads/chef-cooking-branding-action-richland-wa.jpg",
          alt: "Chef stirring vegetables on a stovetop during a Richland business branding session.",
        },
        {
          src: "/uploads/chef-saute-pan-branding-detail-richland-wa.jpg",
          alt: "",
        },
        {
          src: "/uploads/personal-branding-portrait-kitchen-west-richland-wa.jpg",
          alt: "",
        },
        {
          src: "/uploads/businesswoman-working-desk-richland-wa.jpg",
          alt: "Business owner writing at her desk during a Richland workplace branding session.",
        },
        {
          src: "/uploads/business-partners-office-portrait-richland-wa.jpg",
          alt: "Two business professionals posing together in their Richland office.",
        },
        {
          src: "/uploads/lisa-photographer-tricities.jpg",
          alt: "Lisa Weiss holding her camera for a professional portrait.",
        },
        {
          src: "/uploads/business-team-outside-office-kennewick-wa.jpg",
          alt: "",
        },
      ],
    },
  ],
  [
    `headshot-photographer-tri-cities-wa${path.sep}index.html`,
    {
      pageClass: "headshot-page",
      minimumUnique: 10,
      maximumUses: 2,
      teamsRange: [9, 11],
      images: [
        {
          src: "/uploads/business-professional-working-laptop-richland-wa.jpg",
          alt: "Business professional working at a laptop during a Richland branding session.",
        },
        {
          src: "/uploads/professional-headshot-woman-neutral-backdrop.jpg",
          alt: "",
        },
        {
          src: "/uploads/professional-headshot-woman-black-top-kennewick-wa.jpg",
          alt: "",
        },
        {
          src: "/uploads/investment-lisa-studio-portrait-camera.jpg",
          alt: "Lisa Weiss standing with her camera beside portable lights and reflectors.",
        },
        {
          src: "/uploads/professional-headshot-woman-blue-top-kennewick-wa.jpg",
          alt: "Smiling woman in a blue top photographed during a Kennewick team headshot session.",
        },
        {
          src: "/uploads/professional-headshot-woman-neutral-backdrop.jpg",
          alt: "Smiling woman with long blonde hair against a neutral studio backdrop.",
        },
        {
          src: "/uploads/professional-headshot-man-glasses-kennewick-wa.jpg",
          alt: "",
        },
        {
          src: "/uploads/personal-branding-portrait-sofa-west-richland-wa.jpg",
          alt: "Business owner seated on a black leather sofa during a West Richland branding portrait.",
        },
        {
          src: "/uploads/professional-headshot-man-blue-shirt-kennewick-wa.jpg",
          alt: "Smiling man in a blue shirt photographed against a warm stone backdrop in Kennewick.",
        },
        {
          src: "/uploads/professional-headshot-woman-black-top-kennewick-wa.jpg",
          alt: "Smiling woman in a black top photographed during a Kennewick team headshot session.",
        },
        {
          src: "/uploads/professional-headshot-man-glasses-kennewick-wa.jpg",
          alt: "Smiling man wearing glasses photographed during a Kennewick team headshot session.",
        },
        {
          src: "/uploads/about-lisa-photographing-tricities.jpg",
          alt: "Lisa Weiss photographing a portrait outdoors with her camera.",
        },
        {
          src: "/uploads/businesswoman-coffee-branding-portrait-richland-wa.jpg",
          alt: "Business professional holding a coffee cup during a relaxed Richland branding portrait.",
        },
        { src: "/uploads/business-team-meeting-richland-wa.jpg", alt: "" },
      ],
    },
  ],
]);
const aboutDirectionContract = `THESIS: Lisa's About page is a keeper archive of why and how she photographs; it refuses generic credential cards.
OWN-WORLD: Warm ivory, sand, olive, walnut and umber fields; arched portraits, square prints and one-pixel ledgers; no badges or decorative shadows.
STORY: Her children begin the work, the name and camera open the door, twenty years shape the method, and verified recognition earns the inquiry.
FIRST VIEWPORT: The existing hero remains exact; below its torn edge, Lisa's portrait arch faces the origin story and one line resolves into the name ledger.
FORM: User-approved A+C — Keeper Archive plus Through Her Lens — pinned 2026-08-10.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md`;
const activeCityGalleryContracts = new Map([
  [
    `richland-wa-photographer${path.sep}index.html`,
    {
      city: "Richland",
      pageKey: "richland",
      galleryId: "recent-richland-sessions",
      finalId: "richland-final",
      figureCount: 10,
      h2Texts: [
        "This Isn't a City I Travel To — It's Where I Live",
        "Twenty Years of Watching This Light",
        "What I Photograph in Richland",
        "Recent Richland Sessions",
        "Planning a Session Here",
        "Richland Questions",
        "Let's Find Your Light",
      ],
      internalAnchors: [
        "/about/",
        "/journal/family-photo-locations-tri-cities/",
        "/senior-photographer-tri-cities-wa/",
        "/family-photographer-tri-cities-wa/",
        "/newborn-photographer-tri-cities-wa/",
        "/branding-photographer-tri-cities-wa/",
        "/headshot-photographer-tri-cities-wa/",
        "/investment/",
        "/contact/",
      ],
      images: [
        {
          src: "/uploads/richland-couple-river-portrait.jpg",
          alt: "Couple standing together in shallow river water beneath leafy trees.",
        },
        {
          src: "/uploads/richland-couple-winter-field.jpg",
          alt: "Couple embracing in dry winter grass.",
        },
        {
          src: "/uploads/richland-mother-newborn-at-home.jpg",
          alt: "Mother holding a sleeping newborn beside a bed.",
        },
        {
          src: "/uploads/richland-family-field-black-white.jpg",
          alt: "Family of three standing together in a field in a black-and-white portrait.",
        },
        {
          src: "/uploads/richland-family-embrace-black-white.jpg",
          alt: "Family laughing together beneath bare trees in a black-and-white portrait.",
        },
        {
          src: "/uploads/richland-maternity-field-portrait.jpg",
          alt: "Expectant couple standing together in a sunlit field.",
        },
        {
          src: "/uploads/richland-senior-suit-portrait.jpg",
          alt: "High school senior in a dark suit leaning against a concrete column.",
        },
        {
          src: "/uploads/richland-senior-autumn-dress.jpg",
          alt: "High school senior in a dark dress standing among autumn leaves.",
        },
        {
          src: "/uploads/richland-senior-seated-golden-hour.jpg",
          alt: "High school senior with glasses seated in warm evening grass.",
        },
        {
          src: "/uploads/richland-senior-autumn-portrait.jpg",
          alt: "High school senior standing in front of golden autumn foliage.",
        },
      ],
    },
  ],
  [
    `kennewick-wa-photographer${path.sep}index.html`,
    {
      city: "Kennewick",
      pageKey: "kennewick",
      galleryId: "recent-kennewick-sessions",
      finalId: "kennewick-final",
      figureCount: 5,
      h2Texts: [
        "Ten Minutes From My Front Door",
        "If Light and Airy Isn't What You Pictured",
        "What Works Well in Kennewick",
        "What I Photograph in Kennewick",
        "Recent Kennewick Sessions",
        "Kennewick Questions",
        "Let's Plan Yours",
      ],
      internalAnchors: [
        "/about/",
        "/journal/family-photo-locations-tri-cities/",
        "/family-photographer-tri-cities-wa/",
        "/senior-photographer-tri-cities-wa/",
        "/family-photographer-tri-cities-wa/",
        "/newborn-photographer-tri-cities-wa/",
        "/branding-photographer-tri-cities-wa/",
        "/headshot-photographer-tri-cities-wa/",
        "/contact/",
      ],
      images: [
        {
          src: "/uploads/kennewick-couple-laughing-golden-hour.jpg",
          alt: "Couple laughing together in warm evening light beneath bare trees.",
        },
        {
          src: "/uploads/kennewick-senior-seated-autumn-portrait.jpg",
          alt: "High school senior with glasses seated in dry grass beneath autumn trees.",
        },
        {
          src: "/uploads/kennewick-senior-cowboy-rope-golden-hour.jpg",
          alt: "High school senior in a cowboy hat holding a rope in a golden field.",
        },
        {
          src: "/uploads/kennewick-senior-wood-wall-portrait.jpg",
          alt: "High school senior in a white sweatshirt leaning beside a weathered wooden post.",
        },
        {
          src: "/uploads/review-isabella-senior-golden-hour-tricities.jpg",
          alt: "High school senior surrounded by roses in warm evening light.",
        },
      ],
    },
  ],
]);

for (const file of htmlFiles) {
  const relative = path.relative(output, file);
  const source = await readFile(file, "utf8");
  const stylesheetHrefs = (source.match(/<link\b[^>]*>/gi) || [])
    .filter((tag) => htmlAttribute(tag, "rel")?.toLowerCase() === "stylesheet")
    .map((tag) => htmlAttribute(tag, "href"))
    .filter(Boolean);
  const linkedStylesheets = await Promise.all(
    stylesheetHrefs.map((href) => readInternalStylesheet(href)),
  );
  const pascoStylesheetHref = stylesheetHrefs.find((href) =>
    /(?:^|\/)pasco-page[^/]*\.css(?:[?#]|$)/i.test(href),
  );
  const aboutStylesheetHref = stylesheetHrefs.find((href) =>
    /(?:^|\/)about-page[^/]*\.css(?:[?#]|$)/i.test(href),
  );
  const linkedAboutCss = linkedStylesheets.some((css) => /\.about-page\b/.test(css));
  if (relative === pascoRelative) {
    if (!pascoStylesheetHref || !internalTargetExists(pascoStylesheetHref)) {
      failures.push(`${relative}: route-scoped Pasco stylesheet is missing or broken`);
    }
  } else if (pascoStylesheetHref || /\.pasco-page\s*\{/.test(source)) {
    failures.push(`${relative}: Pasco CSS leaked into an unrelated route`);
  }
  if (relative === aboutRelative) {
    const aboutCss = aboutStylesheetHref
      ? await readInternalStylesheet(aboutStylesheetHref)
      : "";
    if (
      !aboutStylesheetHref ||
      !internalTargetExists(aboutStylesheetHref) ||
      !/\.about-page\b/.test(aboutCss)
    ) {
      failures.push(`${relative}: route-scoped About stylesheet is missing or broken`);
    }
  } else if (aboutStylesheetHref || linkedAboutCss || /\.about-page\b/.test(source)) {
    failures.push(`${relative}: About CSS leaked into an unrelated route`);
  }
  const aboutDirectionComment = `<!--\n${aboutDirectionContract}\n-->`;
  if (relative === aboutRelative) {
    const bodyContent = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || "";
    if (
      !bodyContent.trimStart().startsWith(aboutDirectionComment) ||
      !source.includes("THESIS: Lisa's About page is a keeper archive") ||
      !source.includes("FINISH: unreviewed and undocumented is unfinished")
    ) {
      failures.push(`${relative}: About direction contract must be the first body child`);
    }
  } else if (
    source.includes("THESIS: Lisa's About page is a keeper archive") ||
    source.includes("FINISH: unreviewed and undocumented is unfinished")
  ) {
    failures.push(`${relative}: About direction contract leaked into an unrelated route`);
  }
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
  const expectedDirectoryLinkCount = expandedDirectoryLinkCounts.get(relative);
  if (expectedDirectoryLinkCount !== undefined) {
    if (internalAnchors.length !== expectedDirectoryLinkCount) {
      failures.push(
        `${relative}: expected exactly ${expectedDirectoryLinkCount} internal body links; found ${internalAnchors.length}`
      );
    }
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
  const serviceMediaContract = serviceMediaContracts.get(relative);
  if (serviceMediaContract) {
    if (
      !new RegExp(
        `<article\\b[^>]*class=["'][^"']*\\b${serviceMediaContract.pageClass}\\b`,
        "i",
      ).test(main)
    ) {
      failures.push(`${relative}: service page article class is missing`);
    }

    const imageTags = main.match(/<img\b[^>]*>/gi) || [];
    const images = imageTags.map((tag) => ({
      src: htmlAttribute(tag, "src") || "",
      alt: decodeHtml(htmlAttribute(tag, "alt") || "").trim(),
    }));
    const usage = new Map();
    for (const image of images) {
      usage.set(image.src, (usage.get(image.src) || 0) + 1);
    }
    const uniqueSources = new Set(images.map((image) => image.src));
    const overusedSources = [...usage.entries()]
      .filter(([, count]) => count > serviceMediaContract.maximumUses)
      .map(([src, count]) => `${src}×${count}`);
    const meaningfulAltsAreValid = images.every(
      ({ alt }) => !alt || (alt.length >= 10 && alt.length <= 125),
    );
    const modernSources = (main.match(
      /<source\b[^>]*type=["']image\/webp["'][^>]*>/gi,
    ) || []).length;

    if (JSON.stringify(images) !== JSON.stringify(serviceMediaContract.images)) {
      failures.push(`${relative}: rendered service image src+alt order changed`);
    }
    if (
      uniqueSources.size < serviceMediaContract.minimumUnique ||
      overusedSources.length ||
      images[0]?.src === images.at(-1)?.src ||
      !meaningfulAltsAreValid ||
      modernSources < images.length
    ) {
      failures.push(
        `${relative}: service media must keep ${serviceMediaContract.minimumUnique}+ unique sources, max ${serviceMediaContract.maximumUses} uses, distinct hero/final, valid alts and responsive WebP (${overusedSources.join(", ")})`,
      );
    }

    for (const image of images) {
      if (!image.src.startsWith("/uploads/") || !internalTargetExists(image.src)) {
        failures.push(`${relative}: missing service image ${image.src}`);
      }
    }

    if (serviceMediaContract.mosaicRange) {
      const [start, end] = serviceMediaContract.mosaicRange;
      if (new Set(images.slice(start, end).map((image) => image.src)).size !== end - start) {
        failures.push(`${relative}: Branding mosaic must use four distinct sources`);
      }
    }
    if (serviceMediaContract.triptychRange) {
      const [start, end] = serviceMediaContract.triptychRange;
      if (new Set(images.slice(start, end).map((image) => image.src)).size !== end - start) {
        failures.push(`${relative}: Branding audience triptych must use three distinct sources`);
      }
    }
    if (serviceMediaContract.teamsRange) {
      const [start, end] = serviceMediaContract.teamsRange;
      if (new Set(images.slice(start, end).map((image) => image.src)).size !== end - start) {
        failures.push(`${relative}: Headshot team proofs must use distinct sources`);
      }
    }
  }
  if (relative === aboutRelative) {
    const expectedOrigin = mode === "release"
      ? "https://www.itsakeeperphotography.com"
      : "https://itsakeeperphotography.netlify.app";
    const canonical = `${expectedOrigin}/about/`;
    const lisaId = `${expectedOrigin}/#lisa`;
    const businessId = `${expectedOrigin}/#business`;
    const expectedTitle = "Meet Lisa Weiss | Tri-Cities Photographer for 20 Years";
    const expectedDescription =
      "The story behind It's A Keeper Photography — twenty years of preserving Tri-Cities families' most meaningful moments, and the mom who picked up a camera first.";
    const expectedHeroImage =
      "/uploads/about-lisa-photographing-tricities.jpg";
    const expectedHeroImageAlt =
      "Lisa holding a camera to her face among dry grass and shrubs.";
    const expectedPersonDescription =
      "Professional senior, family and newborn photographer based in Richland, Washington, with over 20 years behind the camera and 14 years in business serving the Tri-Cities.";
    const expectedH2Texts = [
      "It Started With My Own Children",
      'Why "It\'s A Keeper"',
      "A Camera, a Scam, and a Door That Opened Anyway",
      "What Twenty Years Has Taught Me",
      "What I Believe You Deserve",
      "How I Photograph",
      "Lisa, Off Camera",
      "Experience & Recognition",
      "Let's Tell Your Story",
    ];
    const issuuUrl =
      "https://issuu.com/wpdigitalpublications/docs/tri_final2_augsept_19-july30_issuu";
    const expectedAnchorHrefs = [
      "#it-started-with-my-own-children",
      "/senior-photographer-tri-cities-wa/",
      "/investment/",
      issuuUrl,
      "/contact/",
    ];
    const expectedRootRoutes = [
      "/senior-photographer-tri-cities-wa/",
      "/investment/",
      "/contact/",
    ];
    const expectedKnowsAbout = [
      "senior portrait photography",
      "family photography",
      "newborn photography",
      "branding photography",
      "professional headshots",
      "natural light photography",
      "golden hour portraiture",
    ];
    const expectedSameAs = [
      "https://www.instagram.com/itsakeeperphoto/",
      "https://www.facebook.com/10210306464689688",
    ];

    const titleText = normalizedText(
      source.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "",
    );
    const descriptionTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "description",
    );
    const descriptionText = htmlAttribute(descriptionTag || "", "content") || "";
    if (titleText !== expectedTitle) {
      failures.push(`${relative}: title must match the approved About metadata`);
    }
    if (descriptionText !== expectedDescription) {
      failures.push(`${relative}: description must match the approved About metadata`);
    }
    if (!source.includes(`<link rel="canonical" href="${canonical}">`)) {
      failures.push(`${relative}: canonical must match the About route exactly`);
    }
    if (!/data-content-status=["']ready["']/i.test(main)) {
      failures.push(`${relative}: About must render with ready content status`);
    }
    if (
      aboutSource.contentStatus !== "ready" ||
      aboutSource.searchVisibility !== "index" ||
      aboutSource.title !== expectedTitle ||
      aboutSource.description !== expectedDescription ||
      aboutSource.hero.image !== expectedHeroImage ||
      aboutSource.hero.imageAlt !== expectedHeroImageAlt
    ) {
      failures.push(`${relative}: source publication state or metadata differs from v2`);
    }

    const h1Texts = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((match) => normalizedText(match[1]));
    const h2Texts = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((match) => normalizedText(match[1]));
    if (
      JSON.stringify(h1Texts) !==
      JSON.stringify(["Meet Lisa — The Heart Behind It's A Keeper"])
    ) {
      failures.push(`${relative}: H1 must match the protected About hero heading`);
    }
    if (JSON.stringify(h2Texts) !== JSON.stringify(expectedH2Texts)) {
      failures.push(`${relative}: expected the approved nine About H2 headings in order`);
    }

    const anchorTags = main.match(/<a\b[^>]*>/gi) || [];
    const anchorHrefs = anchorTags
      .map((tag) => htmlAttribute(tag, "href"))
      .filter(Boolean);
    const rootRouteHrefs = anchorHrefs.filter(
      (href) => href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/#"),
    );
    const externalAnchorTags = anchorTags.filter((tag) => {
      const href = htmlAttribute(tag, "href") || "";
      try {
        return new URL(href, canonical).origin !== expectedOrigin;
      } catch {
        return false;
      }
    });
    if (JSON.stringify(anchorHrefs) !== JSON.stringify(expectedAnchorHrefs)) {
      failures.push(`${relative}: body links differ from the approved hero/internal/Issuu map`);
    }
    if (JSON.stringify(rootRouteHrefs) !== JSON.stringify(expectedRootRoutes)) {
      failures.push(`${relative}: root-route links must be Seniors, Investment, Contact in order`);
    }
    const issuuAnchor = externalAnchorTags[0] || "";
    const issuuRel = (htmlAttribute(issuuAnchor, "rel") || "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (
      externalAnchorTags.length !== 1 ||
      htmlAttribute(issuuAnchor, "href") !== issuuUrl ||
      htmlAttribute(issuuAnchor, "target") !== "_blank" ||
      !issuuRel.includes("noopener") ||
      issuuRel.includes("nofollow")
    ) {
      failures.push(
        `${relative}: the single external Issuu anchor must open safely without nofollow`,
      );
    }

    const hero = main.match(
      /<header\b(?=[^>]*data-editorial-hero-page=["']about["'])[^>]*>([\s\S]*?)<\/header>/i,
    )?.[1] || "";
    const heroBackgroundImageTag = hero.match(/<img\b[^>]*>/i)?.[0] || "";
    const heroAnchorTags = hero.match(/<a\b[^>]*>/gi) || [];
    if (
      htmlAttribute(heroBackgroundImageTag, "src") !== expectedHeroImage ||
      htmlAttribute(heroBackgroundImageTag, "alt") !== expectedHeroImageAlt
    ) {
      failures.push(`${relative}: About hero background image or alt changed`);
    }
    if (
      heroAnchorTags.length !== 1 ||
      htmlAttribute(heroAnchorTags[0], "href") !==
        "#it-started-with-my-own-children"
    ) {
      failures.push(`${relative}: protected hero hash link changed`);
    }

    const visibleAboutText = normalizedText(main);
    const approvedSourceText = JSON.stringify({
      hero: aboutSource.hero,
      sections: aboutSource.sections,
      finalCta: aboutSource.finalCta,
    });
    const unsafeClaims = [
      /96\s*(?:\+\s*)?five[- ]star/i,
      /\bgrammy\b/i,
      /\bhealth\s+(?:challenge|condition|issue|journey|struggle)s?\b/i,
      /\b(?:chronic|medical)\s+(?:condition|issue|diagnosis)\b/i,
      /\baward(?:-winning)?\b/i,
      /\bcertif(?:ied|ication|ications)\b/i,
      /\b(?:professional\s+)?memberships?\b/i,
      /\binsur(?:ed|ance)\b/i,
    ];
    if (
      unsafeClaims.some(
        (pattern) => pattern.test(visibleAboutText) || pattern.test(approvedSourceText),
      )
    ) {
      failures.push(`${relative}: an unverified About claim leaked into source or HTML`);
    }
    if (
      (Array.isArray(aboutSource.pending) &&
        aboutSource.pending.some((item) => String(item).trim())) ||
      /\[(?:PENDIENTE|PENDING|VALIDAR|FECHA|INSERT|PLACEHOLDER|PRICE|DATE|URL|LINK|NUMBER|CONFIRM|NAME|si se publica)[^\]]*\]|CONTENT PENDING/i.test(
        `${visibleAboutText}\n${approvedSourceText}`,
      )
    ) {
      failures.push(`${relative}: About source or HTML contains an unresolved placeholder`);
    }

    const schemas = parseJsonLd(source, relative);
    const schemaObjects = schemas.flatMap(nestedSchemaObjects);
    const aboutPages = schemas.filter((schema) => schema?.["@type"] === "AboutPage");
    const people = schemas.filter((schema) => schema?.["@type"] === "Person");
    const businesses = schemas.filter(
      (schema) => schema?.["@type"] === "LocalBusiness",
    );
    const personObjects = schemaObjects.filter(
      (schema) => schema?.["@type"] === "Person",
    );
    const breadcrumbs = schemas.filter(
      (schema) => schema?.["@type"] === "BreadcrumbList",
    );
    const prohibitedTopLevelTypes = new Set([
      "Service",
      "FAQPage",
      "Review",
      "AggregateRating",
    ]);
    if (schemas.some((schema) => prohibitedTopLevelTypes.has(schema?.["@type"]))) {
      failures.push(`${relative}: About must not emit Service, FAQ, Review, or rating schema`);
    }
    if (
      schemaObjects.some(
        (schema) =>
          [
            "Review",
            "AggregateRating",
            "GeoCoordinates",
            "EducationalOccupationalCredential",
          ].includes(schema?.["@type"]) ||
          Object.keys(schema).some((key) =>
            [
              "award",
              "awards",
              "credential",
              "hascredential",
              "memberof",
              "streetaddress",
              "latitude",
              "longitude",
            ].includes(key.toLowerCase()),
          ),
      ) ||
      /google[^"}]{0,40}(?:placeholder|profile|review)/i.test(JSON.stringify(schemas))
    ) {
      failures.push(
        `${relative}: About schema contains an unsafe address, geo, award, rating, or Google placeholder`,
      );
    }

    const aboutPage = aboutPages[0];
    if (
      aboutPages.length !== 1 ||
      aboutPage?.["@id"] !== `${canonical}#webpage` ||
      aboutPage?.url !== canonical ||
      aboutPage?.name !== expectedTitle ||
      aboutPage?.description !== expectedDescription ||
      aboutPage?.about?.["@id"] !== lisaId ||
      aboutPage?.mainEntity?.["@id"] !== lisaId
    ) {
      failures.push(`${relative}: AboutPage must canonically identify Lisa as about/mainEntity`);
    }

    const person = people[0];
    const uniquePersonIds = [...new Set(personObjects.map((item) => item?.["@id"]))];
    const homeAddress = person?.homeLocation?.address;
    if (
      people.length !== 1 ||
      personObjects.length !== 1 ||
      businesses.length !== 1 ||
      businesses[0]?.founder?.["@id"] !== lisaId ||
      Object.hasOwn(businesses[0]?.founder || {}, "@type") ||
      JSON.stringify(uniquePersonIds) !== JSON.stringify([lisaId]) ||
      personObjects.some((item) => item?.["@id"] !== lisaId) ||
      person?.name !== "Lisa Weiss" ||
      person?.jobTitle !== "Professional Photographer" ||
      person?.description !== expectedPersonDescription ||
      person?.worksFor?.["@id"] !== businessId ||
      person?.homeLocation?.["@type"] !== "Place" ||
      person?.homeLocation?.name !== "Richland, Washington" ||
      homeAddress?.["@type"] !== "PostalAddress" ||
      homeAddress?.addressLocality !== "Richland" ||
      homeAddress?.addressRegion !== "WA" ||
      homeAddress?.addressCountry !== "US" ||
      JSON.stringify(person?.knowsAbout) !== JSON.stringify(expectedKnowsAbout) ||
      person?.knowsLanguage !== "en" ||
      JSON.stringify(person?.sameAs) !== JSON.stringify(expectedSameAs) ||
      person?.subjectOf?.["@type"] !== "Article" ||
      person?.subjectOf?.name !== "Cover feature: Lisa Weiss" ||
      person?.subjectOf?.isPartOf?.["@type"] !== "Periodical" ||
      person?.subjectOf?.isPartOf?.name !== "Tri-Cities MOM Magazine" ||
      person?.subjectOf?.datePublished !== "2019-08" ||
      person?.subjectOf?.url !== issuuUrl
    ) {
      failures.push(`${relative}: the canonical Lisa Person entity differs from approved facts`);
    }

    const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
    if (
      breadcrumbs.length !== 1 ||
      breadcrumbItems.length !== 2 ||
      breadcrumbItems[0]?.["@type"] !== "ListItem" ||
      breadcrumbItems[0]?.position !== 1 ||
      breadcrumbItems[0]?.name !== "Home" ||
      breadcrumbItems[0]?.item !== `${expectedOrigin}/` ||
      breadcrumbItems[1]?.["@type"] !== "ListItem" ||
      breadcrumbItems[1]?.position !== 2 ||
      breadcrumbItems[1]?.name !== "About Lisa" ||
      breadcrumbItems[1]?.item !== canonical
    ) {
      failures.push(`${relative}: BreadcrumbList must resolve Home to About Lisa`);
    }
  }
  if (relative === newbornRelative) {
    const expectedOrigin = mode === "release"
      ? "https://www.itsakeeperphotography.com"
      : "https://itsakeeperphotography.netlify.app";
    const canonical = `${expectedOrigin}/newborn-photographer-tri-cities-wa/`;
    const schemas = parseJsonLd(source, relative);
    const h1Texts = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((match) => normalizedText(match[1]));
    const h2Texts = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((match) => normalizedText(match[1]));
    const expectedH2Texts = [
      "The Short Answer: I Come to You",
      "These Days Go So Fast",
      "What Your Newborn Session Looks Like",
      "When to Book — and Why It's Probably Not Too Late",
      "Twenty Years of Watching Them Grow Up",
      "Newborn Session Questions",
      "Expecting? Let's Talk Early",
    ];
    const expectedFaqQuestions = [
      "Where do newborn sessions take place?",
      "When should newborn photos be taken?",
      "Do you use props or a studio setup?",
      "What if my baby cries the whole time?",
      "Is my house too small or too dark?",
      "Can we include siblings, grandparents or pets?",
      "What should we wear?",
      "How long until we see the photos?",
    ];
    const expectedInternalAnchors = [
      "/contact/",
      "/journal/in-home-vs-studio-newborn-photography/",
      "/family-photographer-tri-cities-wa/",
      "/contact/",
    ];

    if (!source.includes(`<link rel="canonical" href="${canonical}">`)) {
      failures.push(`${relative}: canonical must match the Newborn route exactly`);
    }
    if (!/data-content-status=["']ready["']/i.test(main)) {
      failures.push(`${relative}: Newborn must render with ready content status`);
    }
    if (
      JSON.stringify(h1Texts) !==
      JSON.stringify(["Newborn Photographer in the Tri-Cities, WA"])
    ) {
      failures.push(
        `${relative}: H1 must be exactly "Newborn Photographer in the Tri-Cities, WA"`,
      );
    }
    if (JSON.stringify(h2Texts) !== JSON.stringify(expectedH2Texts)) {
      failures.push(`${relative}: expected the approved seven H2 headings in order`);
    }
    if (JSON.stringify(internalAnchors) !== JSON.stringify(expectedInternalAnchors)) {
      failures.push(`${relative}: internal body links differ from the approved four-link map`);
    }

    const faq = withoutComments.match(
      /<section\b(?=[^>]*aria-labelledby=["']newborn-session-questions-title["'])[^>]*>([\s\S]*?)<\/section>/i,
    )?.[1] || "";
    const visibleFaq = [...faq.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/gi)]
      .map((match) => {
        const attributes = match[1];
        const detail = match[2];
        const summary = detail.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || "";
        const question = summary.match(
          /<span\b(?=[^>]*role=["']heading["'])[^>]*>([\s\S]*?)<\/span>/i,
        )?.[1] || summary;
        const answer = detail.replace(/[\s\S]*?<\/summary>/i, "");
        return {
          hidden: /\bhidden\b|aria-hidden=["']true["']/i.test(attributes),
          question: normalizedText(question),
          answer: normalizedText(answer),
        };
      });
    const faqSchemas = schemas.filter((schema) => schema?.["@type"] === "FAQPage");
    const faqEntities = faqSchemas[0]?.mainEntity || [];
    if (
      visibleFaq.length !== 8 ||
      visibleFaq.some((item) => item.hidden) ||
      JSON.stringify(visibleFaq.map((item) => item.question)) !==
        JSON.stringify(expectedFaqQuestions) ||
      faqSchemas.length !== 1 ||
      faqEntities.length !== 8 ||
      visibleFaq.some(
        (item, index) =>
          faqEntities[index]?.["@type"] !== "Question" ||
          faqEntities[index]?.acceptedAnswer?.["@type"] !== "Answer" ||
          item.question !== faqEntities[index]?.name ||
          item.answer !== faqEntities[index]?.acceptedAnswer?.text,
      )
    ) {
      failures.push(
        `${relative}: eight visible FAQ disclosures must match the eight approved FAQPage Questions 1:1`,
      );
    }

    const serviceSchemas = schemas.filter((schema) => schema?.["@type"] === "Service");
    const services = serviceSchemas[0];
    const serviceCities = Array.isArray(services?.areaServed)
      ? services.areaServed.map((area) => area?.name)
      : [];
    if (
      serviceSchemas.length !== 1 ||
      services?.["@id"] !== `${canonical}#service` ||
      services?.name !== "Newborn Photography" ||
      services?.serviceType !== "In-home newborn and baby photography" ||
      services?.description !==
        "Gentle, unhurried in-home newborn photography sessions photographed at the baby's pace using natural light, without props or studio setups. Serving Richland, Kennewick and Pasco, Washington." ||
      services?.provider?.["@id"] !== `${expectedOrigin}/#business` ||
      JSON.stringify(serviceCities) !== JSON.stringify(["Richland", "Kennewick", "Pasco"]) ||
      services?.url !== canonical ||
      services?.mainEntityOfPage?.["@id"] !== `${canonical}#webpage`
    ) {
      failures.push(`${relative}: Newborn Service schema differs from the approved scope`);
    }

    const webPages = schemas.filter((schema) => schema?.["@type"] === "WebPage");
    if (
      webPages.length !== 1 ||
      webPages[0]?.["@id"] !== `${canonical}#webpage` ||
      webPages[0]?.url !== canonical
    ) {
      failures.push(`${relative}: Newborn must emit one canonical WebPage schema`);
    }
    const breadcrumbs = schemas.filter((schema) => schema?.["@type"] === "BreadcrumbList");
    const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
    if (
      breadcrumbs.length !== 1 ||
      breadcrumbItems.length !== 2 ||
      breadcrumbItems[0]?.position !== 1 ||
      breadcrumbItems[0]?.name !== "Home" ||
      breadcrumbItems[0]?.item !== `${expectedOrigin}/` ||
      breadcrumbItems[1]?.position !== 2 ||
      breadcrumbItems[1]?.name !== "Newborn Photography" ||
      breadcrumbItems[1]?.item !== canonical
    ) {
      failures.push(`${relative}: BreadcrumbList must resolve Home to Newborn Photography`);
    }

    const approvedImageSources = [
      "/uploads/family-newborn-sunset-tricities.jpg",
      "/uploads/newborn-portrait-with-mother-richland.jpg",
      "/uploads/family-newborn-connection-richland.jpg",
      "/uploads/richland-mother-newborn-at-home.jpg",
      "/uploads/newborn-family-at-home-west-richland.jpg",
      "/uploads/family-newborn-at-home-tricities.jpg",
      "/uploads/family-with-baby-golden-hour-embrace-tricities.jpg",
      "/uploads/family-with-baby-black-white-tricities.jpg",
      "/uploads/maternity-waiting-to-welcome-tricities.jpg",
    ];
    const imageSources = [...main.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)]
      .map((match) => match[1]);
    const uniqueImageSources = [...new Set(imageSources)];
    if (
      approvedImageSources.some((asset) => !uniqueImageSources.includes(asset)) ||
      uniqueImageSources.some((asset) => !approvedImageSources.includes(asset))
    ) {
      failures.push(
        `${relative}: image sources must stay within the literal approved Newborn asset allowlist`,
      );
    }
  }
  if (
    [
      `richland-wa-photographer${path.sep}index.html`,
      `kennewick-wa-photographer${path.sep}index.html`,
      pascoRelative,
    ].includes(relative)
  ) {
    const schemas = parseJsonLd(source, relative);
    const serviceSchemas = schemas.filter((schema) => schema?.["@type"] === "Service");
    const unsafeSchema = schemas
      .flatMap(nestedSchemaObjects)
      .some((schema) =>
        Object.hasOwn(schema, "streetAddress") ||
        Object.hasOwn(schema, "latitude") ||
        Object.hasOwn(schema, "longitude") ||
        ["Review", "AggregateRating", "GeoCoordinates"].includes(schema["@type"]) ||
        schema.addressLocality === "Pasco",
      );
    if (unsafeSchema) {
      failures.push(
        `${relative}: city schema must not expose a Pasco address, coordinates, Review, or AggregateRating`
      );
    }
    if (relative === `richland-wa-photographer${path.sep}index.html` && serviceSchemas.length) {
      failures.push(
        `${relative}: Richland must not emit a top-level Service schema`
      );
    }
    const expectedServiceCity = relative === `kennewick-wa-photographer${path.sep}index.html`
      ? "Kennewick"
      : relative === pascoRelative
        ? "Pasco"
        : null;
    if (expectedServiceCity) {
      const service = serviceSchemas[0];
      const expectedOrigin = mode === "release"
        ? "https://www.itsakeeperphotography.com"
        : "https://itsakeeperphotography.netlify.app";
      const expectedServiceCanonical = `${expectedOrigin}/${expectedServiceCity.toLowerCase()}-wa-photographer/`;
      if (
        serviceSchemas.length !== 1 ||
        service?.["@id"] !== `${expectedServiceCanonical}#service` ||
        service?.name !== `${expectedServiceCity} Portrait Photography` ||
        service?.serviceType !== "Portrait photography" ||
        service?.provider?.["@id"] !== `${expectedOrigin}/#business` ||
        service?.areaServed?.["@type"] !== "City" ||
        service?.areaServed?.name !== expectedServiceCity ||
        service?.areaServed?.containedInPlace?.["@type"] !== "State" ||
        service?.areaServed?.containedInPlace?.name !== "Washington" ||
        service?.url !== expectedServiceCanonical
      ) {
        failures.push(
          `${relative}: ${expectedServiceCity} Service schema does not match the approved local scope`,
        );
      }
    }

    const activeCityGallery = activeCityGalleryContracts.get(relative);
    if (activeCityGallery) {
      const h2Texts = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
        .map((match) => normalizedText(match[1]));
      if (JSON.stringify(h2Texts) !== JSON.stringify(activeCityGallery.h2Texts)) {
        failures.push(
          `${relative}: expected the approved seven ${activeCityGallery.city} H2 headings in order`,
        );
      }
      const mainAnchorHrefs = [...main.matchAll(
        /<a\b[^>]*href=["']([^"']+)["']/gi,
      )].map((match) => match[1]);
      if (
        JSON.stringify(mainAnchorHrefs) !==
          JSON.stringify(activeCityGallery.internalAnchors)
      ) {
        failures.push(
          `${relative}: internal body links differ from the approved nine-link map`,
        );
      }

      const hero = main.match(
        new RegExp(
          `<header\\b(?=[^>]*data-editorial-hero-page=["']${activeCityGallery.pageKey}["'])[^>]*>([\\s\\S]*?)<\\/header>`,
          "i",
        ),
      )?.[1] || "";
      const heroButtons = hero.match(/<button\b[^>]*data-hero-cta[^>]*>/gi) || [];
      if (
        heroButtons.length !== 1 ||
        !new RegExp(
          `data-hero-scroll-target=["']${activeCityGallery.finalId}["']`,
          "i",
        ).test(heroButtons[0]) ||
        !new RegExp(
          `aria-controls=["']${activeCityGallery.finalId}["']`,
          "i",
        ).test(heroButtons[0]) ||
        /<a\b/i.test(hero)
      ) {
        failures.push(
          `${relative}: hero must preserve one local-scroll button to #${activeCityGallery.finalId} and no anchor`,
        );
      }

      const gallery = sectionById(main, activeCityGallery.galleryId);
      const galleryFigures = [...gallery.matchAll(
        /<figure\b[^>]*>([\s\S]*?)<\/figure>/gi,
      )].map((match) => match[1]);
      const galleryImages = [...gallery.matchAll(/<img\b[^>]*>/gi)].map((match) => ({
        src: match[0].match(/\bsrc=["']([^"']+)["']/i)?.[1] || "",
        alt: decodeHtml(match[0].match(/\balt=["']([^"']*)["']/i)?.[1] || "").trim(),
      }));
      const galleryCaptions = [...gallery.matchAll(
        /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/gi,
      )].map((match) => normalizedText(match[1]));
      const figuresHaveOneImageAndCaption = galleryFigures.every((figure) =>
        (figure.match(/<img\b/gi) || []).length === 1 &&
        (figure.match(/<figcaption\b/gi) || []).length === 1
      );
      if (
        galleryFigures.length !== activeCityGallery.figureCount ||
        galleryImages.length !== activeCityGallery.figureCount ||
        galleryCaptions.length !== activeCityGallery.figureCount ||
        galleryCaptions.some((caption) => !caption) ||
        !figuresHaveOneImageAndCaption ||
        (gallery.match(/<a\b/gi) || []).length !== 0 ||
        new Set(galleryImages.map((image) => image.src)).size !==
          activeCityGallery.figureCount ||
        galleryImages.some((image) => !image.alt) ||
        JSON.stringify(galleryImages) !== JSON.stringify(activeCityGallery.images)
      ) {
        failures.push(
          `${relative}: recent gallery must render exactly ${activeCityGallery.figureCount} approved figure/image/caption triples, unique literal src+alt pairs, and zero anchors`,
        );
      }
    }

    if (relative === pascoRelative) {
      const expectedOrigin = mode === "release"
        ? "https://www.itsakeeperphotography.com"
        : "https://itsakeeperphotography.netlify.app";
      const canonical = `${expectedOrigin}/pasco-wa-photographer/`;
      if (!source.includes(`<link rel="canonical" href="${canonical}">`)) {
        failures.push(`${relative}: canonical must match the Pasco route exactly`);
      }
      if (!/data-content-status=["']ready["']/i.test(main)) {
        failures.push(`${relative}: Pasco must render with ready content status`);
      }
      const h1Texts = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
        .map((match) => normalizedText(match[1]));
      const h2Texts = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
        .map((match) => normalizedText(match[1]));
      const expectedH2Texts = [
        "The Most Underrated Light in the Tri-Cities",
        "Where Two Rivers Meet",
        "Farmland, Rows and Long Horizons",
        "What I Photograph in Pasco",
        "Recent Pasco Sessions",
        "Seasons in Pasco",
        "Pasco Questions",
        "Let's Find Your Light",
      ];
      if (JSON.stringify(h1Texts) !== JSON.stringify(["Pasco, WA Photographer"])) {
        failures.push(`${relative}: H1 must be exactly \"Pasco, WA Photographer\"`);
      }
      if (JSON.stringify(h2Texts) !== JSON.stringify(expectedH2Texts)) {
        failures.push(`${relative}: expected the approved eight H2 headings in order`);
      }

      const expectedInternalAnchors = [
        "/about/",
        "/journal/family-photo-locations-tri-cities/",
        "/senior-photographer-tri-cities-wa/",
        "/family-photographer-tri-cities-wa/",
        "/newborn-photographer-tri-cities-wa/",
        "/branding-photographer-tri-cities-wa/",
        "/headshot-photographer-tri-cities-wa/",
        "/contact/",
      ];
      if (JSON.stringify(internalAnchors) !== JSON.stringify(expectedInternalAnchors)) {
        failures.push(`${relative}: internal body links differ from the approved eight-link map`);
      }

      const hero = main.match(
        /<header\b(?=[^>]*data-editorial-hero-page=["']pasco["'])[^>]*>([\s\S]*?)<\/header>/i,
      )?.[1] || "";
      const heroButtons = hero.match(/<button\b[^>]*data-hero-cta[^>]*>/gi) || [];
      if (
        heroButtons.length !== 1 ||
        !/data-hero-scroll-target=["']pasco-final["']/i.test(heroButtons[0]) ||
        /<a\b/i.test(hero)
      ) {
        failures.push(`${relative}: hero must use one local-scroll button and no anchor`);
      }

      const directory = sectionById(main, "pasco-session-directory");
      const directoryHrefs = [...directory.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)]
        .map((match) => match[1]);
      if (
        directoryHrefs.length !== 5 ||
        JSON.stringify(directoryHrefs) !== JSON.stringify(expectedInternalAnchors.slice(2, 7))
      ) {
        failures.push(`${relative}: Pasco service directory must contain five approved linked rows`);
      }

      const gallery = sectionById(main, "recent-pasco-sessions");
      const galleryFigureCount = (gallery.match(/<figure\b/gi) || []).length;
      const galleryImages = [...gallery.matchAll(/<img\b[^>]*>/gi)].map((match) => ({
        src: match[0].match(/\bsrc=["']([^"']+)["']/i)?.[1] || "",
        alt: decodeHtml(match[0].match(/\balt=["']([^"']*)["']/i)?.[1] || "").trim(),
      }));
      const expectedGallerySources = [
        "/uploads/pasco-family-mother-children-golden-hour.jpg",
        "/uploads/pasco-family-group-golden-field.jpg",
        "/uploads/pasco-extended-family-walking-golden-field.jpg",
        "/uploads/pasco-senior-airplane-portrait.jpg",
        "/uploads/pasco-senior-black-dress-foliage.jpg",
        "/uploads/pasco-senior-seated-golden-field.jpg",
        "/uploads/pasco-senior-pine-portrait.jpg",
        "/uploads/pasco-senior-wildflower-portrait.jpg",
        "/uploads/pasco-senior-floral-dress-field.jpg",
        "/uploads/pasco-senior-white-dress-seated-portrait.jpg",
      ];
      if (
        galleryFigureCount !== 10 ||
        galleryImages.length !== 10 ||
        new Set(galleryImages.map((image) => image.src)).size !== 10 ||
        galleryImages.some((image) => !image.alt) ||
        JSON.stringify(galleryImages.map((image) => image.src)) !==
          JSON.stringify(expectedGallerySources)
      ) {
        failures.push(
          `${relative}: recent gallery must render the ten verified, unique photographs with alt text`,
        );
      }

      const faq = sectionById(main, "pasco-questions");
      const visibleFaq = [...faq.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)]
        .map((match) => {
          const detail = match[1];
          const summary = detail.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || "";
          const h3 = summary.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1];
          const answer = detail.replace(/[\s\S]*?<\/summary>/i, "");
          return {
            question: normalizedText(h3 || summary),
            answer: normalizedText(answer),
          };
        });
      const faqSchemas = schemas.filter((schema) => schema?.["@type"] === "FAQPage");
      const faqEntities = faqSchemas[0]?.mainEntity || [];
      if (
        visibleFaq.length !== 4 ||
        faqSchemas.length !== 1 ||
        faqEntities.length !== 4 ||
        visibleFaq.some(
          (item, index) =>
            faqEntities[index]?.["@type"] !== "Question" ||
            faqEntities[index]?.acceptedAnswer?.["@type"] !== "Answer" ||
            item.question !== faqEntities[index]?.name ||
            item.answer !== faqEntities[index]?.acceptedAnswer?.text,
        )
      ) {
        failures.push(`${relative}: four visible FAQ entries must match four FAQPage entities`);
      }

      const webPages = schemas.filter((schema) => schema?.["@type"] === "WebPage");
      const breadcrumbs = schemas.filter((schema) => schema?.["@type"] === "BreadcrumbList");
      const webPage = webPages[0];
      const breadcrumb = breadcrumbs[0];
      const breadcrumbItems = breadcrumb?.itemListElement || [];
      if (
        webPages.length !== 1 ||
        webPage?.spatialCoverage?.["@type"] !== "City" ||
        webPage?.spatialCoverage?.name !== "Pasco" ||
        webPage?.spatialCoverage?.containedInPlace?.["@type"] !== "State" ||
        webPage?.spatialCoverage?.containedInPlace?.name !== "Washington"
      ) {
        failures.push(`${relative}: WebPage spatialCoverage must be Pasco, Washington`);
      }
      if (
        breadcrumbs.length !== 1 ||
        breadcrumbItems.length !== 2 ||
        breadcrumbItems[0]?.position !== 1 ||
        breadcrumbItems[0]?.name !== "Home" ||
        breadcrumbItems[0]?.item !== `${expectedOrigin}/` ||
        breadcrumbItems[1]?.position !== 2 ||
        breadcrumbItems[1]?.name !== "Pasco Photographer" ||
        breadcrumbItems[1]?.item !== canonical
      ) {
        failures.push(`${relative}: BreadcrumbList must resolve Home to Pasco Photographer`);
      }
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
const contactContent = JSON.parse(
  await readFile(path.join(root, "content", "pages", "contact.json"), "utf8"),
);
const contactCalculatorScript = await readFile(
  path.join(root, "src", "scripts", "session-price-calculator.ts"),
  "utf8",
);
const runtimeManifestSource = await readFile(
  path.join(root, "src", "lib", "page-manifest.ts"),
  "utf8",
);
const mirrorManifestSource = await readFile(
  path.join(root, "page-manifest.ts"),
  "utf8",
);
if (runtimeManifestSource !== mirrorManifestSource) {
  failures.push("page-manifest.ts: root mirror must exactly match src/lib/page-manifest.ts");
}
const homepageHero = sectionById(homepage, "home");
const homepageHeroImageTags = [...homepageHero.matchAll(/<img\b[^>]*>/gi)].map(
  (match) => match[0],
);
const homepageHeroSourceTags = [
  ...homepageHero.matchAll(/<source\b[^>]*>/gi),
].map((match) => match[0]);
const expectedHeroSources = [
  {
    srcset: homepageHeroContract.desktopAvif,
    media: "(min-width: 768px)",
    type: "image/avif",
  },
  {
    srcset: homepageHeroContract.mobileAvif,
    media: "(max-width: 767px)",
    type: "image/avif",
  },
  {
    srcset: homepageHeroContract.mobileWebp,
    media: "(max-width: 767px)",
    type: "image/webp",
  },
  {
    srcset: homepageHeroContract.desktopWebp,
    media: "(min-width: 768px)",
    type: "image/webp",
  },
];
if (homepageHeroImageTags.length !== 1) {
  failures.push(`homepage: expected one hero image; found ${homepageHeroImageTags.length}`);
} else {
  const tag = homepageHeroImageTags[0];
  if (
    htmlAttribute(tag, "src") !== homepageHeroContract.image ||
    htmlAttribute(tag, "alt") !== homepageHeroContract.imageAlt ||
    htmlAttribute(tag, "loading") !== "eager" ||
    htmlAttribute(tag, "fetchpriority") !== "high" ||
    htmlAttribute(tag, "decoding") !== "sync" ||
    Number(htmlAttribute(tag, "width")) !== 2400 ||
    Number(htmlAttribute(tag, "height")) !== 1600
  ) {
    failures.push("homepage: hero image attributes are invalid");
  }
}
if (
  homepageHeroSourceTags.length !== expectedHeroSources.length ||
  !expectedHeroSources.every((expected) =>
    homepageHeroSourceTags.some(
      (tag) =>
        htmlAttribute(tag, "srcset") === expected.srcset &&
        htmlAttribute(tag, "media") === expected.media &&
        htmlAttribute(tag, "type") === expected.type,
    ),
  )
) {
  failures.push("homepage: responsive hero source contract is invalid");
}
for (const expected of [
  {
    href: homepageHeroContract.mobileAvif,
    media: "(max-width: 767px)",
  },
  {
    href: homepageHeroContract.desktopAvif,
    media: "(min-width: 768px)",
  },
]) {
  const preloadPattern = new RegExp(
    `<link\\b(?=[^>]*\\brel="preload")(?=[^>]*\\bas="image")(?=[^>]*\\bhref="${expected.href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}")(?=[^>]*\\bmedia="${expected.media.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}")[^>]*>`,
    "i",
  );
  if (!preloadPattern.test(homepage)) {
    failures.push(`homepage: missing responsive hero preload ${expected.href}`);
  }
}
const homepageBiography = sectionById(homepage, "meet-lisa");
const homepageBiographyImageTags = [
  ...homepageBiography.matchAll(/<img\b[^>]*>/gi),
].map((match) => match[0]);
if (homepageBiographyImageTags.length !== 2) {
  failures.push(
    `homepage: expected two Meet Lisa images; found ${homepageBiographyImageTags.length}`,
  );
} else {
  const [portraitTag, printTag] = homepageBiographyImageTags;
  if (
    htmlAttribute(portraitTag, "src") !== homepageBiographyContract.portrait ||
    htmlAttribute(portraitTag, "alt") !== homepageBiographyContract.portraitAlt ||
    htmlAttribute(portraitTag, "loading") !== "lazy" ||
    htmlAttribute(printTag, "src") !== homepageBiographyContract.printImage ||
    !["", null].includes(htmlAttribute(printTag, "alt")) ||
    htmlAttribute(printTag, "loading") !== "lazy"
  ) {
    failures.push("homepage: Meet Lisa portrait or decorative print is invalid");
  }
}
if (
  !/<div\b(?=[^>]*\bdata-biography-print)(?=[^>]*\baria-hidden="true")[^>]*>/i.test(
    homepageBiography,
  )
) {
  failures.push("homepage: Meet Lisa print must remain decorative and aria-hidden");
}
if (
  !homepageBiography.includes(
    "/uploads/about-lisa-camera-candid-black-white-400.webp",
  ) ||
  !homepageBiography.includes(
    "/uploads/about-lisa-camera-candid-black-white-640.webp",
  )
) {
  failures.push("homepage: Meet Lisa print responsive sources are missing");
}
const homepageSessions = sectionById(homepage, "sessions");
const homepageSessionImageTags = [
  ...homepageSessions.matchAll(/<img\b[^>]*>/gi),
].map((match) => match[0]);
if (homepageSessionImageTags.length !== homepageSessionCards.length) {
  failures.push(
    `homepage: expected ${homepageSessionCards.length} rendered session-card images; found ${homepageSessionImageTags.length}`,
  );
} else {
  homepageSessionImageTags.forEach((tag, index) => {
    const expected = homepageSessionCards[index];
    const width = Number(htmlAttribute(tag, "width"));
    const height = Number(htmlAttribute(tag, "height"));
    if (
      htmlAttribute(tag, "src") !== expected.image ||
      htmlAttribute(tag, "alt") !== expected.imageAlt ||
      htmlAttribute(tag, "loading") !== "lazy" ||
      !Number.isFinite(width) ||
      width <= 0 ||
      !Number.isFinite(height) ||
      height <= 0
    ) {
      failures.push(`homepage: ${expected.label} session-card image contract is invalid`);
    }
  });
}
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

const contactFormMatches = [
  ...contact.matchAll(
    /<form\b(?=[^>]*\bname=["']session-estimate["'])[^>]*>[\s\S]*?<\/form>/gi,
  ),
].map((match) => match[0]);
if (contactFormMatches.length !== 1) {
  failures.push(
    `contact: expected exactly one session-estimate form; found ${contactFormMatches.length}`,
  );
} else {
  const formSource = contactFormMatches[0];
  const formTag = formSource.match(/^<form\b[^>]*>/i)?.[0] || "";
  if (
    htmlAttribute(formTag, "name") !== "session-estimate" ||
    htmlAttribute(formTag, "method")?.toLowerCase() !== "post" ||
    htmlAttribute(formTag, "action") !== "/thank-you/" ||
    htmlAttribute(formTag, "data-netlify") !== "true" ||
    htmlAttribute(formTag, "netlify-honeypot") !== "bot-field" ||
    !hasHtmlAttribute(formTag, "data-session-estimate-form")
  ) {
    failures.push("contact: Netlify form action, method, detection or fallback contract is invalid");
  }

  const inputTags = [...formSource.matchAll(/<input\b[^>]*>/gi)].map(
    (match) => match[0],
  );
  const textareaTags = [...formSource.matchAll(/<textarea\b[^>]*>/gi)].map(
    (match) => match[0],
  );
  const inputByName = (name) =>
    inputTags.find((tag) => htmlAttribute(tag, "name") === name) || "";
  const textareaByName = (name) =>
    textareaTags.find((tag) => htmlAttribute(tag, "name") === name) || "";
  const formNameField = inputByName("form-name");
  const botField = inputByName("bot-field");
  const nameField = inputByName("name");
  const emailField = inputByName("email");
  const phoneField = inputByName("phone");
  const preferredTimingField = inputByName("preferred_timing");
  const storyField = textareaByName("story");
  const estimatedTotalField = inputByName("estimated_total");

  if (
    htmlAttribute(formNameField, "type") !== "hidden" ||
    htmlAttribute(formNameField, "value") !== "session-estimate" ||
    !botField ||
    htmlAttribute(botField, "tabindex") !== "-1"
  ) {
    failures.push("contact: hidden form-name or honeypot field is invalid");
  }
  if (
    htmlAttribute(nameField, "type") !== "text" ||
    !hasHtmlAttribute(nameField, "required") ||
    htmlAttribute(emailField, "type") !== "email" ||
    !hasHtmlAttribute(emailField, "required") ||
    htmlAttribute(phoneField, "type") !== "tel" ||
    !hasHtmlAttribute(phoneField, "required") ||
    !storyField ||
    !hasHtmlAttribute(storyField, "required")
  ) {
    failures.push("contact: name, email, phone and story must be required contact fields");
  }
  if (
    htmlAttribute(preferredTimingField, "type") !== "text" ||
    hasHtmlAttribute(preferredTimingField, "required")
  ) {
    failures.push("contact: preferred timing must exist and remain optional");
  }
  if (
    [nameField, emailField, phoneField, preferredTimingField, storyField].some(
      (field) => !hasHtmlAttribute(field, "data-contact-field"),
    )
  ) {
    failures.push("contact: contact-field markers are incomplete");
  }
  if (
    htmlAttribute(estimatedTotalField, "type") !== "hidden" ||
    htmlAttribute(estimatedTotalField, "name") !== "estimated_total" ||
    htmlAttribute(estimatedTotalField, "data-estimate-field") !== "estimated_total"
  ) {
    failures.push("contact: hidden estimated_total field is missing");
  }

  const submitButtons = [
    ...formSource.matchAll(
      /<button\b(?=[^>]*\bdata-estimate-submit(?:\s|=|>))[^>]*>([\s\S]*?)<\/button>/gi,
    ),
  ];
  if (
    submitButtons.length !== 1 ||
    htmlAttribute(submitButtons[0]?.[0]?.match(/^<button\b[^>]*>/i)?.[0] || "", "type") !==
      "submit" ||
    normalizedText(submitButtons[0]?.[1] || "") !== "Send My Estimate to Lisa"
  ) {
    failures.push("contact: submit CTA must be exactly “Send My Estimate to Lisa”");
  }
}

const receiptMatch = contact.match(
  /(<aside\b(?=[^>]*\bdata-estimate-receipt(?:\s|=|>))[^>]*>)([\s\S]*?)<\/aside>/i,
);
const desktopTotalMatch = contact.match(
  /(<strong\b(?=[^>]*\bdata-estimate-total(?:\s|=|>))[^>]*>)([\s\S]*?)<\/strong>/i,
);
const mobileBarMatch = contact.match(
  /(<div\b(?=[^>]*\bdata-mobile-estimate-bar(?:\s|=|>))[^>]*>)([\s\S]*?)<\/div>/i,
);
const mobileTotalMatch = contact.match(
  /(<strong\b(?=[^>]*\bdata-mobile-estimate-total(?:\s|=|>))[^>]*>)([\s\S]*?)<\/strong>/i,
);
const totalLiveMatch = contact.match(
  /(<p\b(?=[^>]*\bdata-total-live(?:\s|=|>))[^>]*>)([\s\S]*?)<\/p>/i,
);
const receiptTag = receiptMatch?.[1] || "";
const receiptSource = receiptMatch?.[2] || "";
const desktopTotalTag = desktopTotalMatch?.[1] || "";
const mobileBarTag = mobileBarMatch?.[1] || "";
const mobileTotalTag = mobileTotalMatch?.[1] || "";
const totalLiveTag = totalLiveMatch?.[1] || "";
if (
  !receiptTag ||
  !desktopTotalTag ||
  !mobileBarTag ||
  !mobileTotalTag ||
  [receiptTag, desktopTotalTag, mobileBarTag, mobileTotalTag].some(
    (tag) =>
      hasHtmlAttribute(tag, "hidden") ||
      htmlAttribute(tag, "aria-hidden") === "true" ||
      /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(
        htmlAttribute(tag, "style") || "",
      ),
  )
) {
  failures.push("contact: the receipt and desktop/mobile totals must be present and visible in SSR HTML");
}
if (
  normalizedText(desktopTotalMatch?.[2] || "") !== "$160" ||
  normalizedText(mobileTotalMatch?.[2] || "") !== "$160" ||
  htmlAttribute(totalLiveTag, "aria-live") !== "polite" ||
  htmlAttribute(totalLiveTag, "aria-atomic") !== "true" ||
  normalizedText(totalLiveMatch?.[2] || "") !== "Estimated total $160."
) {
  failures.push("contact: SSR totals and initial polite live announcement must be $160");
}
for (const marker of [
  "data-receipt-service",
  "data-receipt-package",
  "data-receipt-people",
  "data-receipt-collection",
  "data-receipt-addons",
]) {
  if (!receiptSource.includes(marker)) {
    failures.push(`contact: visible receipt is missing ${marker}`);
  }
}
if (
  normalizedText(mobileBarMatch?.[2] || "") !==
  "Estimated total $160 Review estimate"
) {
  failures.push("contact: mobile SSR estimate bar copy or initial total is invalid");
}

const forbiddenContactMarkup = [
  [/\bdata-estimate-state\b/i, "estimate state attribute"],
  [/\bdata-submission-state\b/i, "submission state attribute"],
  [/\bdata-estimate-lock\b/i, "locked receipt element"],
  [/\bdata-estimate-details\b/i, "gated receipt wrapper"],
  [/\bdata-estimate-success\b/i, "AJAX success element"],
  [/\bdata-estimate-error\b/i, "AJAX error element"],
  [/\bdata-finish-estimate\b/i, "finish-and-reveal control"],
  [/\bdata-mobile-estimate-lock\b/i, "mobile locked-total element"],
  [/\bdata-mobile-estimate-label\b/i, "mobile gate label"],
  [/\bdata-receipt-title\b/i, "gate focus target"],
  [/\bdata-receipt-eyebrow\b/i, "gate eyebrow target"],
  [/\bcontact_gate_/i, "contact_gate_ marker"],
  [/\bestimate_revealed\b/i, "estimate_revealed marker"],
  [/\brevealEstimate\b/, "revealEstimate marker"],
  [/\bsubmission_id\b/i, "submission_id field"],
];
for (const [pattern, label] of forbiddenContactMarkup) {
  if (pattern.test(contact)) {
    failures.push(`contact: forbidden ${label} remains`);
  }
}

const forbiddenContactScript = [
  [/\bfetch\s*\(/, "fetch submission"],
  [/\bFormData\b/, "FormData serialization"],
  [/\bURLSearchParams\b/, "URLSearchParams serialization"],
  [/\.preventDefault\s*\(/, "submit interception"],
  [/\bAbortController\b/, "AbortController submission gate"],
  [/\bcontact_gate_/i, "contact_gate_ analytics"],
  [/\bestimate_revealed\b/i, "estimate_revealed analytics"],
  [/\brevealEstimate\b/, "revealEstimate gate"],
  [/\bsubmission_id\b/i, "submission_id state"],
];
for (const [pattern, label] of forbiddenContactScript) {
  if (pattern.test(contactCalculatorScript)) {
    failures.push(`contact calculator: forbidden ${label} remains`);
  }
}

const contactExpectedOrigin =
  mode === "release"
    ? "https://www.itsakeeperphotography.com"
    : "https://itsakeeperphotography.netlify.app";
const contactCanonical = `${contactExpectedOrigin}/contact/`;
const contactMain = contact
  .replace(/<!--[\s\S]*?-->/g, "")
  .match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
const contactTitle = normalizedText(
  contact.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "",
);
const contactDescriptionTag = (contact.match(/<meta\b[^>]*>/gi) || []).find(
  (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "description",
);
const contactRobotsTag = (contact.match(/<meta\b[^>]*>/gi) || []).find(
  (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "robots",
);
const expectedContactRobots =
  mode === "release"
    ? "index, follow, max-image-preview:large"
    : "noindex, nofollow, noarchive";
if (
  contactContent.contentStatus !== "ready" ||
  contactContent.searchVisibility !== "index" ||
  contactContent.schemaType !== "ContactPage" ||
  !/data-content-status=["']ready["']/i.test(contactMain) ||
  contactTitle !== contactContent.title ||
  htmlAttribute(contactDescriptionTag || "", "content") !== contactContent.description ||
  htmlAttribute(contactRobotsTag || "", "content") !== expectedContactRobots ||
  !contact.includes(`<link rel="canonical" href="${contactCanonical}">`)
) {
  failures.push("contact: source state, metadata, canonical or robots contract is invalid");
}

const contactSchemas = parseJsonLd(contact, `contact${path.sep}index.html`);
const contactPages = contactSchemas.filter(
  (schema) => schema?.["@type"] === "ContactPage",
);
const contactBreadcrumbs = contactSchemas.filter(
  (schema) => schema?.["@type"] === "BreadcrumbList",
);
const topLevelContactServices = contactSchemas.filter(
  (schema) => schema?.["@type"] === "Service",
);
const contactPageSchema = contactPages[0];
const contactBreadcrumbItems = contactBreadcrumbs[0]?.itemListElement || [];
if (
  contactPages.length !== 1 ||
  contactPageSchema?.["@id"] !== `${contactCanonical}#webpage` ||
  contactPageSchema?.url !== contactCanonical ||
  contactPageSchema?.name !== contactContent.title ||
  contactPageSchema?.description !== contactContent.description ||
  contactPageSchema?.isPartOf?.["@id"] !== `${contactExpectedOrigin}/#website` ||
  contactPageSchema?.about?.["@id"] !== `${contactExpectedOrigin}/#business`
) {
  failures.push("contact: canonical ContactPage schema graph is invalid");
}
if (
  contactBreadcrumbs.length !== 1 ||
  contactBreadcrumbItems.length !== 2 ||
  contactBreadcrumbItems[0]?.position !== 1 ||
  contactBreadcrumbItems[0]?.name !== "Home" ||
  contactBreadcrumbItems[0]?.item !== `${contactExpectedOrigin}/` ||
  contactBreadcrumbItems[1]?.position !== 2 ||
  contactBreadcrumbItems[1]?.name !== "Session Pricing Estimate" ||
  contactBreadcrumbItems[1]?.item !== contactCanonical ||
  topLevelContactServices.length !== 0
) {
  failures.push("contact: BreadcrumbList or no-invented-Service schema contract is invalid");
}

if (htmlFiles.length !== 21) failures.push(`expected 21 public HTML routes; found ${htmlFiles.length}`);

const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
const robots = await readFile(path.join(output, "robots.txt"), "utf8");
const llms = await readFile(path.join(output, "llms.txt"), "utf8");
const headers = await readFile(path.join(output, "_headers"), "utf8");
const netlifyHeaderBlocks = [];
let activeHeaderBlock = null;
for (const line of headers.split(/\r?\n/)) {
  if (!line.trim()) continue;
  if (!/^\s/.test(line)) {
    activeHeaderBlock = { pattern: line.trim(), headers: new Map() };
    netlifyHeaderBlocks.push(activeHeaderBlock);
    continue;
  }
  if (!activeHeaderBlock) continue;
  const separator = line.indexOf(":");
  if (separator < 0) continue;
  const name = line.slice(0, separator).trim().toLowerCase();
  const value = line.slice(separator + 1).trim();
  const values = activeHeaderBlock.headers.get(name) || [];
  values.push(value);
  activeHeaderBlock.headers.set(name, values);
}
const netlifyPatternMatches = (pattern, requestPath) => {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replaceAll("*", ".*");
  return new RegExp(`^${escaped}$`).test(requestPath);
};
const routeHeaderValues = (requestPath, name) =>
  netlifyHeaderBlocks
    .filter((block) => netlifyPatternMatches(block.pattern, requestPath))
    .flatMap((block) => block.headers.get(name.toLowerCase()) || []);

if (mode === "staging") {
  if (
    /<url>/.test(sitemap) ||
    !/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">\s*<\/urlset>/.test(
      sitemap,
    )
  ) {
    failures.push("sitemap.xml: staging sitemap must be an empty valid urlset");
  }
  const expectedStagingLlms =
    "# It's A Keeper Photography — staging\n\n> This build is a noindex staging preview. It is not approved for citation.\n";
  if (llms !== expectedStagingLlms) {
    failures.push("llms.txt: staging citation gate is incorrect");
  }
  const globalRobots = netlifyHeaderBlocks
    .filter((block) => block.pattern === "/*")
    .flatMap((block) => block.headers.get("x-robots-tag") || []);
  if (!globalRobots.includes("noindex, nofollow, noarchive")) {
    failures.push("_headers: staging global X-Robots-Tag is missing");
  }
} else {
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedSitemapUrls = [
    "https://www.itsakeeperphotography.com/",
    "https://www.itsakeeperphotography.com/family-photographer-tri-cities-wa/",
    "https://www.itsakeeperphotography.com/newborn-photographer-tri-cities-wa/",
    "https://www.itsakeeperphotography.com/about/",
    "https://www.itsakeeperphotography.com/contact/",
    "https://www.itsakeeperphotography.com/richland-wa-photographer/",
    "https://www.itsakeeperphotography.com/kennewick-wa-photographer/",
    "https://www.itsakeeperphotography.com/pasco-wa-photographer/",
    "https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/",
    "https://www.itsakeeperphotography.com/portfolio/",
  ];
  if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedSitemapUrls)) {
    failures.push(`sitemap.xml: release membership is ${sitemapUrls.join(", ") || "empty"}`);
  }
  const pascoSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/pasco-wa-photographer\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-09<\/lastmod>/.test(pascoSitemapEntry)) {
    failures.push("sitemap.xml: Pasco lastmod must be 2026-08-09");
  }
  const newbornSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/newborn-photographer-tri-cities-wa\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-10<\/lastmod>/.test(newbornSitemapEntry)) {
    failures.push("sitemap.xml: Newborn lastmod must be 2026-08-10");
  }
  const aboutSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/about\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-10<\/lastmod>/.test(aboutSitemapEntry)) {
    failures.push("sitemap.xml: About lastmod must be 2026-08-10");
  }
  const contactSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/contact\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-11<\/lastmod>/.test(contactSitemapEntry)) {
    failures.push("sitemap.xml: Contact lastmod must be 2026-08-11");
  }
  if (!/Sitemap: https:\/\/www\.itsakeeperphotography\.com\/sitemap\.xml/.test(robots)) {
    failures.push("robots.txt: release sitemap declaration is missing");
  }
  const llmsUrls = [...llms.matchAll(/\]\((https:\/\/www\.itsakeeperphotography\.com\/[^)]*)\)/g)]
    .map((match) => match[1]);
  const expectedLlmsUrls = [
    "https://www.itsakeeperphotography.com/",
    "https://www.itsakeeperphotography.com/family-photographer-tri-cities-wa/",
    "https://www.itsakeeperphotography.com/newborn-photographer-tri-cities-wa/",
    "https://www.itsakeeperphotography.com/about/",
    "https://www.itsakeeperphotography.com/contact/",
    "https://www.itsakeeperphotography.com/richland-wa-photographer/",
    "https://www.itsakeeperphotography.com/kennewick-wa-photographer/",
    "https://www.itsakeeperphotography.com/pasco-wa-photographer/",
    "https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/",
  ];
  if (JSON.stringify(llmsUrls) !== JSON.stringify(expectedLlmsUrls)) {
    failures.push(`llms.txt: release membership is ${llmsUrls.join(", ") || "empty"}`);
  }
  const expectedAboutLlmsLine =
    "- [Meet Lisa Weiss | Tri-Cities Photographer for 20 Years](https://www.itsakeeperphotography.com/about/): Meet Lisa Weiss, the Richland photographer behind It's A Keeper Photography, with twenty years behind the camera and fourteen years in business.";
  if (!llms.includes(expectedAboutLlmsLine)) {
    failures.push("llms.txt: About title or v2 summary differs from the manifest contract");
  }
  const expectedContactLlmsLine =
    "- [Session Pricing Estimate | It's A Keeper Photography](https://www.itsakeeperphotography.com/contact/): Build a personalized photography session pricing estimate, then plan the details with Lisa.";
  if (!llms.includes(expectedContactLlmsLine)) {
    failures.push("llms.txt: Contact title or summary differs from the manifest contract");
  }
  if (/^\/journal\/\*\s*$/m.test(headers)) {
    failures.push("_headers: broad /journal/* noindex rule must not block the published guide");
  }
  if (/^\/richland-wa-photographer\/\*\s*$/m.test(headers)) {
    failures.push("_headers: Richland noindex rule must not block the published city page");
  }
  if (/^\/kennewick-wa-photographer\/\*\s*$/m.test(headers)) {
    failures.push("_headers: Kennewick noindex rule must not block the published city page");
  }
  if (/^\/pasco-wa-photographer\/\*\s*$/m.test(headers)) {
    failures.push("_headers: Pasco noindex rule must not block the published city page");
  }
  if (/^\/newborn-photographer-tri-cities-wa\/\*\s*$/m.test(headers)) {
    failures.push("_headers: Newborn noindex rule must not block the published service page");
  }
  if (
    routeHeaderValues("/about/", "x-robots-tag")
      .some((value) => /(?:^|,)\s*noindex(?:\s*,|$)/i.test(value))
  ) {
    failures.push("_headers: About noindex rule must not block the published trust page");
  }
  if (
    routeHeaderValues("/contact/", "x-robots-tag")
      .some((value) => /(?:^|,)\s*noindex(?:\s*,|$)/i.test(value))
  ) {
    failures.push("_headers: Contact noindex rule must not block the published estimate page");
  }
  for (const route of [
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
