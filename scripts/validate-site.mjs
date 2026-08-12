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
const settingsContent = JSON.parse(
  await readFile(path.join(root, "content", "settings", "index.json"), "utf8"),
);
const reviewsGoogleReviewUrl = "https://g.page/r/CZnCWAWyBWnQEBM/review";
if (settingsContent.social?.googleProfile !== reviewsGoogleReviewUrl) {
  failures.push(
    "content/settings/index.json: Google reviews link must retain the user-confirmed public URL",
  );
}
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
const reviewsSource = JSON.parse(
  await readFile(path.join(root, "content", "pages", "reviews.json"), "utf8"),
);
const reviewsSectionIds = (reviewsSource.sections || []).map((section) => section.id);
if (
  reviewsSource.route !== "/reviews/" ||
  reviewsSource.contentStatus !== "ready" ||
  reviewsSource.searchVisibility !== "index" ||
  reviewsSource.schemaType !== "WebPage" ||
  reviewsSource.signature !== "arch" ||
  reviewsSource.title !== "Client Reviews | It's A Keeper Photography" ||
  reviewsSource.description !==
    "Read verified client stories from Tri-Cities families, seniors, couples and business clients photographed by Lisa Weiss." ||
  reviewsSource.hero?.heading !== "Client Reviews in the Tri-Cities" ||
  reviewsSource.hero?.intro !==
    "I could tell you what a session with me feels like — but the people who’ve stood in front of my camera say it better." ||
  JSON.stringify(reviewsSectionIds) !==
    JSON.stringify([
      "at-ease",
      "what-tri-cities-clients-remember",
      "the-photographs-behind-the-words",
      "leave-the-nerves-at-home",
    ]) ||
  !Array.isArray(reviewsSource.pending) ||
  reviewsSource.pending.length !== 0 ||
  reviewsSource.finalCta?.link?.href !== "/contact/"
) {
  failures.push(
    "content/pages/reviews.json: Reviews must retain its approved ready/index copy, section order, Contact CTA and empty pending contract",
  );
}
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
  `reviews${path.sep}index.html`,
  `contact${path.sep}index.html`,
  `richland-wa-photographer${path.sep}index.html`,
  `kennewick-wa-photographer${path.sep}index.html`,
  `pasco-wa-photographer${path.sep}index.html`,
  `journal${path.sep}index.html`,
  `journal${path.sep}family-photo-locations-tri-cities${path.sep}index.html`,
  `journal${path.sep}branding-photos-vs-headshots${path.sep}index.html`,
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
const reviewsRelative = `reviews${path.sep}index.html`;
const seniorTimingRelative =
  `journal${path.sep}when-to-book-senior-pictures-tri-cities${path.sep}index.html`;
const newbornComparisonRelative =
  `journal${path.sep}in-home-vs-studio-newborn-photography${path.sep}index.html`;
const brandingHeadshotsRelative =
  `journal${path.sep}branding-photos-vs-headshots${path.sep}index.html`;
const journalHubRelative = `journal${path.sep}index.html`;
const unpublishedJournalPaths = [
  "/journal/when-to-book-senior-pictures-tri-cities/",
  "/journal/in-home-vs-studio-newborn-photography/",
];
const publicSiteOrigins = new Set([
  "https://www.itsakeeperphotography.com",
  "https://itsakeeperphotography.netlify.app",
]);
const seniorTimingSource = JSON.parse(
  await readFile(
    path.join(root, "content", "pages", "journal-senior-timing.json"),
    "utf8",
  ),
);
const seniorTimingContract = {
  title: "When to Take Senior Pictures: A Photographer's Timeline",
  description:
    "When should you take senior pictures — and when is it too late? A 20-year senior photographer shares the real timeline, season by season, plus booking tips.",
  h1: ["When Should You Take Senior Pictures?"],
  h2: [
    "The Short Answer",
    "When Are You Supposed to Take Senior Pictures?",
    "Season by Season: What Each One Gives You",
    "When Is It Too Late to Take Senior Pictures?",
    "What's the Best Time of Day for Senior Pictures Outside?",
    "The Tri-Cities Booking Calendar (What Nobody Tells You)",
    "Quick Answers",
    "Whenever You Shoot, Make It Yours",
  ],
  h3: [
    "Spring of junior year",
    "Summer before senior year",
    "Early fall of senior year",
    "Winter",
    "Junior or senior year?",
    "Before or after getting braces off?",
    "Is winter too cold?",
  ],
  anchors: [
    {
      href: "/senior-photographer-tri-cities-wa/",
      label: "see how senior sessions work",
    },
    {
      href: "/senior-photographer-tri-cities-wa/",
      label: "See how senior sessions work",
    },
    {
      href: "/journal/family-photo-locations-tri-cities/",
      label: "Best places to take pictures in the Tri-Cities",
    },
    { href: "/contact/", label: "Check my calendar" },
  ],
  images: [
    {
      src: "/uploads/journal-senior-golden-hour-tricities.jpg",
      alt: "High school senior in a white dress standing among softly lit branches.",
    },
    {
      src: "/uploads/west-richland-senior-woodpile-portrait.jpg",
      alt: "",
    },
    { src: "/uploads/richland-senior-autumn-dress.jpg", alt: "" },
    {
      src: "/uploads/senior-session-summer-light-richland.jpg",
      alt: "High school senior in a white dress and tan hat standing in golden grass.",
    },
    {
      src: "/uploads/pasco-senior-white-dress-seated-portrait.jpg",
      alt: "High school senior in a white dress seated beneath leafy branches.",
    },
    {
      src: "/uploads/pasco-senior-airplane-portrait.jpg",
      alt: "High school senior in a white shirt leaning beside a small airplane.",
    },
    {
      src: "/uploads/richland-senior-autumn-portrait.jpg",
      alt: "High school senior standing in front of golden autumn foliage.",
    },
    {
      src: "/uploads/richland-senior-suit-portrait.jpg",
      alt: "High school senior in a dark suit leaning against a concrete column.",
    },
    {
      src: "/uploads/richland-senior-seated-golden-hour.jpg",
      alt: "High school senior with glasses seated in warm evening grass.",
    },
    {
      src: "/uploads/kennewick-senior-riverside-portrait.jpg",
      alt: "High school senior standing beside water beneath leafy branches.",
    },
    {
      src: "/uploads/about-story-senior-horse-tricities.jpg",
      alt: "High school senior walking with a paint horse across dry grass.",
    },
  ],
  quickAnswers: [
    {
      question: "Junior or senior year?",
      answer:
        "Either. Spring junior year or summer/fall senior year are both ideal.",
    },
    {
      question: "Before or after getting braces off?",
      answer:
        "After, if the timing is close — or we celebrate the smile you have now. Your call.",
    },
    {
      question: "Is winter too cold?",
      answer:
        "We plan around it: shorter sets, warm layers between shots, and light that's worth it.",
    },
  ],
  pending: [
    "[VALIDAR: fechas concretas de los distritos de Richland, Kennewick y Pasco — dato local que nadie más publica]",
    "[VALIDAR: si Lisa ofrece esto — Q54]",
    "[FECHA]",
  ],
};
const newbornComparisonSource = JSON.parse(
  await readFile(
    path.join(root, "content", "pages", "journal-newborn-comparison.json"),
    "utf8",
  ),
);
const pendingRegistrySource = await readFile(
  path.join(root, "src", "content", "pending.ts"),
  "utf8",
);
const newbornComparisonContract = {
  title: "In-Home vs. Studio Newborn Photography: How to Choose",
  description:
    "In-home or studio newborn photos? An honest comparison from a Tri-Cities newborn photographer — comfort, style, timing and what each session really feels like.",
  h1: ["In-Home vs. Studio Newborn Photography"],
  h2: [
    "The Short Answer",
    "What Is In-Home Newborn Photography?",
    "What Is Studio Newborn Photography?",
    "The Honest Comparison",
    "What About Outdoor Newborn Sessions?",
    "Which One Will You Treasure More?",
    "Common Questions",
    "Planning Your Baby's First Photos in the Tri-Cities",
  ],
  h3: [
    "Comfort (yours and baby's)",
    "Style of the photographs",
    "Timing and flexibility",
    "Preparation and effort",
    "When should I book newborn photos?",
    "Is my house too small or too dark for in-home photos?",
    "What if we missed the two-week window?",
  ],
  paragraphs: [
    "the honest comparison",
    "In-home or studio newborn photos? An honest comparison of comfort, style, timing and what each session really feels like.",
    "In-home newborn photography happens in your own house — natural light, your nursery, your everyday life with baby. Studio newborn photography happens in a photographer's controlled space, usually with posed setups, props and backdrops. Neither is \"better\"; they're different kinds of memories. Here's the honest comparison I walk every expecting family through.",
    "Also called a lifestyle newborn session, an in-home session documents your baby's real first days in the place where they're happening. Baby in the nursery you spent months preparing. Feeding in your favorite chair. Big siblings peeking into the bassinet. The window light in your own bedroom.",
    "Nothing is staged beyond gentle guidance — the photographer works with your home's light and your baby's rhythm. Pauses for feeding, soothing and diaper changes aren't interruptions; they're the session.",
    "Studio sessions are the posed, curled-baby portraits you've seen — baby wrapped and sleeping in a basket, on a backdrop, in themed setups. They require a controlled environment, specialized safety training for posing, and typically need to happen in the first two weeks, while babies are sleepy enough to curl.",
    "Done well, studio work is genuinely artful. It's also a different product: styled portraits of your baby, rather than documentation of your life with your baby.",
    "Studio is a context, not a photograph.",
    "Recovering from birth, you may not want to pack up a days-old baby and drive anywhere. At home, everything you need is within reach — snacks, changes of clothes, your own bathroom, your own couch. Studios counter with amenities and a \"handled-for-you\" experience. For most postpartum parents, home wins on comfort.",
    "Studio: polished, styled, timeless-formal. In-home: warm, personal, documentary — photographs where you can feel the season of life. Ask yourself which one you'll want on the wall in twenty years; that answer differs by family, and both are valid.",
    "Studio posing usually needs the first 10–14 days. In-home sessions are far more forgiving — beautiful at two weeks or two months, because they don't depend on a curled sleepy pose. If your baby is \"already too old\" for studio work, an in-home session isn't a consolation prize; it's arguably the more meaningful record.",
    "Studio: drive there, hand over the reins. In-home: no travel, but a little tidying — and only of the corners we'll actually use. (A good photographer needs one clean window, not a spotless house. Truly.)",
    "In the Tri-Cities, golden-hour outdoor sessions with a newborn are possible in mild months and make especially beautiful family sessions — baby in arms, siblings around, the river light doing its thing. Many families combine: intimate photos at home, then a short golden-hour family set when baby is a bit older.",
    "After twenty years of photographing families, here's what I've seen: the photographs families cry over a decade later are rarely the most styled ones. They're the ones with their people in their place — the nursery that got repainted, the house they moved away from, the way dad held the baby in that particular chair. Choose the session that preserves what you most want to remember.",
    "During your second or third trimester. Photographers hold flexible space around due dates — reaching out early means your spot is safe no matter when baby arrives.",
    "Almost never. One good window and a few honest square feet are enough — finding the light is the photographer's job, not yours.",
    "For in-home lifestyle photos, there's no missed window. Two months old is still brand new, still tiny, still worth documenting.",
    "If the in-home style speaks to you, that's the heart of how I photograph newborns across Richland, Kennewick and Pasco — gentle, unhurried, baby-led.",
  ],
  anchors: [
    {
      href: "/family-photographer-tri-cities-wa/",
      label: "Family Photography",
    },
    {
      href: "/newborn-photographer-tri-cities-wa/",
      label: "See how my newborn sessions work",
    },
    { href: "/contact/", label: "Expecting? Let's talk early" },
  ],
  images: [
    {
      src: "/uploads/richland-mother-newborn-at-home.jpg",
      alt: "A mother holding her sleeping newborn beside a bed.",
    },
    { src: "/uploads/newborn-family-at-home-west-richland.jpg", alt: "" },
    { src: "/uploads/newborn-portrait-with-mother-richland.jpg", alt: "" },
    {
      src: "/uploads/family-newborn-at-home-tricities.jpg",
      alt: "Parents and an older sister holding a sleeping newborn together on a bed.",
    },
    {
      src: "/uploads/family-newborn-sunset-tricities.jpg",
      alt: "A family gathered around a baby outdoors in warm evening light.",
    },
    {
      src: "/uploads/family-with-baby-golden-hour-embrace-tricities.jpg",
      alt: "Parents holding their baby close outdoors in warm evening light.",
    },
    {
      src: "/uploads/family-newborn-connection-richland.jpg",
      alt: "Parents standing close with their baby in warm evening light.",
    },
    {
      src: "/uploads/family-with-baby-black-white-tricities.jpg",
      alt: "A family holding a baby together outdoors in a black-and-white portrait.",
    },
    {
      src: "/uploads/maternity-waiting-to-welcome-tricities.jpg",
      alt: "An expecting couple standing together in warm sunset light.",
    },
  ],
  faq: [
    {
      question: "When should I book newborn photos?",
      answer:
        "During your second or third trimester. Photographers hold flexible space around due dates — reaching out early means your spot is safe no matter when baby arrives.",
    },
    {
      question: "Is my house too small or too dark for in-home photos?",
      answer:
        "Almost never. One good window and a few honest square feet are enough — finding the light is the photographer's job, not yours.",
    },
    {
      question: "What if we missed the two-week window?",
      answer:
        "For in-home lifestyle photos, there's no missed window. Two months old is still brand new, still tiny, still worth documenting.",
    },
  ],
  pending: [
    "[VALIDAR CON LISA]",
    "[VALIDAR: formato exacto que ofrece Lisa]",
    "[FECHA]",
  ],
};
const brandingHeadshotsSource = JSON.parse(
  await readFile(
    path.join(root, "content", "pages", "journal-branding-vs-headshots.json"),
    "utf8",
  ),
);
const brandingHeadshotsDirectionContract =
  "Branding vs. Headshots Versus Axis: shared EditorialHero; one headshot proof faces an asymmetric branding library across a central seam; semantic checklist, table and FAQ with verified photography only; no package promises, gradients, rounded cards, tape, splatter, badges or shadows.";
const brandingHeadshotsContract = {
  title: "Branding Photos vs. Headshots: What's the Difference?",
  description:
    "What are branding photos, how are they different from headshots, and which does your business need first? A working photographer's plain-English breakdown.",
  h1: ["Branding Photos vs. Headshots: What's the Difference?"],
  h2: [
    "The Short Answer",
    "What Are Branding Photos?",
    "What Is a Headshot?",
    "Side by Side: Branding Photos vs. Headshots",
    "Which Does Your Business Need First?",
    "What Happens in a Branding Session?",
    "Common Questions",
    "Show Them Who You Are",
  ],
  h3: [
    "Start with a headshot if…",
    "Start with a branding session if…",
    "The honest truth: most businesses end up with both",
    "What should I wear for branding photos?",
    "How often should branding photos be updated?",
    "Are branding photos worth it for a very small business?",
  ],
  sectionIds: [
    "the-short-answer",
    "what-are-branding-photos",
    "what-is-a-headshot",
    "side-by-side",
    "which-does-your-business-need-first",
    "what-happens-in-a-branding-session",
    "common-questions",
  ],
  sectionParagraphs: {
    "the-short-answer": [
      "A headshot is one great portrait of you. Branding photos are a full library of images about your business — you working, your space, your tools, your process, your personality. A headshot answers \"who is this person?\"; branding photos answer \"what would it be like to work with them?\" Most businesses eventually need both, but they solve different problems.",
    ],
    "what-are-branding-photos": [
      "Branding photos (sometimes called a personal branding session or custom business photography) are a planned collection of images built around your brand. A typical branding gallery includes:",
      "The point is variety and consistency: months of website, social, newsletter and press images that all look like your business.",
    ],
    "what-is-a-headshot": [
      "A headshot is a professional portrait — usually shoulders-up, clean background, focused entirely on you. It lives on LinkedIn, your company's team page, conference programs, proposals and anywhere your name appears. A great headshot is warm, confident and current (that last one matters — a ten-year-old headshot works against you).",
    ],
    "which-does-your-business-need-first": [
      "You mainly need to look credible and current — you work for a company, you're job hunting, or your face appears in bios and proposals more than in marketing.",
      "Your business is personal. Clients choose you — your style, your process, your story — and your marketing needs a steady supply of images that feel like you. If you're posting on social weekly and reusing the same three photos, you're overdue.",
      "Every branding session I photograph includes headshots — it's the natural starting point of the session. So if you're unsure, a branding session is the answer that covers both.",
    ],
    "what-happens-in-a-branding-session": [
      "With me, it starts with a strategy call: where will these images live, what do clients need to feel, what makes your business unmistakably yours. Then we shoot on location at your workspace or a Tri-Cities spot that fits your brand — guided the entire time, because feeling awkward in front of a camera at your own business is completely normal and completely fixable. You walk away with a warm, consistent library sized for real use.",
    ],
    "common-questions": [
      "Your brand's colors, your real working clothes, and one \"elevated\" option. We plan it together — the goal is recognizably you, one notch polished.",
      "Most businesses refresh once or twice a year as offers, seasons and spaces change. Headshots: every two to three years, or after any big change.",
      "Small businesses benefit most — you are the brand. In a community like the Tri-Cities, people hire the person they feel they already know, and branding photos are how they meet you before the first call.",
    ],
    "show-them-who-you-are": [
      "Whether you need one great headshot or a full brand library, the goal is the same: when someone finds your business, they should meet a real person they'd want to work with.",
    ],
  },
  checklist: [
    "Portraits of you that feel like your brand — not stiff, not generic",
    "You doing the work: hands, tools, process, craft",
    "Your space — studio, shop, office, or wherever the magic happens",
    "Details: products, textures, materials, the things clients notice",
    "Lifestyle moments that show the experience of working with you",
  ],
  comparisonRows: [
    ["What you get", "1–3 polished portraits", "A full library of varied images"],
    ["Focus", "You", "You + your work + your space + your story"],
    ["Session length", "Under an hour", "Half a day, typically"],
    ["Where it lives", "LinkedIn, team page, bios", "Website, social, marketing, press"],
    ["Refresh cycle", "Every 2–3 years", "1–2 times a year"],
    [
      "Best first step for",
      "Employees, job seekers, professionals",
      "Business owners, personal brands",
    ],
  ],
  anchors: [
    {
      href: "/branding-photographer-tri-cities-wa/",
      label: "Branding photography in the Tri-Cities",
    },
    {
      href: "/headshot-photographer-tri-cities-wa/",
      label: "Just need the headshot?",
    },
    { href: "/contact/", label: "Start planning" },
  ],
  images: [
    {
      src: "/uploads/branding-chef-kitchen-richland-wa.jpg",
      alt: "Chef smiling while stirring vegetables in a modern kitchen during a Richland branding session.",
    },
    { src: "/uploads/professional-headshot-woman-neutral-backdrop.jpg", alt: "" },
    { src: "/uploads/pianist-creative-branding-portrait-richland-wa.jpg", alt: "" },
    {
      src: "/uploads/business-professional-working-laptop-richland-wa.jpg",
      alt: "Business professional working at a laptop during a Richland branding session.",
    },
    {
      src: "/uploads/personal-branding-portrait-kitchen-west-richland-wa.jpg",
      alt: "Business owner standing beside a kitchen island during a West Richland branding session.",
    },
    {
      src: "/uploads/businesswoman-working-desk-richland-wa.jpg",
      alt: "Business owner writing at her desk during a Richland workplace branding session.",
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
      src: "/uploads/business-partners-office-portrait-richland-wa.jpg",
      alt: "Two business professionals posing together in their Richland office.",
    },
    {
      src: "/uploads/chef-saute-pan-branding-detail-richland-wa.jpg",
      alt: "Chef stirring vegetables in a pan during a close-up Richland branding photograph.",
    },
    { src: "/uploads/business-team-meeting-richland-wa.jpg", alt: "" },
  ],
  faq: [
    {
      question: "What should I wear for branding photos?",
      answer:
        "Your brand's colors, your real working clothes, and one \"elevated\" option. We plan it together — the goal is recognizably you, one notch polished.",
    },
    {
      question: "How often should branding photos be updated?",
      answer:
        "Most businesses refresh once or twice a year as offers, seasons and spaces change. Headshots: every two to three years, or after any big change.",
    },
    {
      question: "Are branding photos worth it for a very small business?",
      answer:
        "Small businesses benefit most — you are the brand. In a community like the Tri-Cities, people hire the person they feel they already know, and branding photos are how they meet you before the first call.",
    },
  ],
};
const journalHubSource = JSON.parse(
  await readFile(path.join(root, "content", "pages", "journal.json"), "utf8"),
);
if (
  journalHubSource.route !== "/journal/" ||
  journalHubSource.family !== "journal-hub" ||
  journalHubSource.contentStatus !== "ready" ||
  journalHubSource.searchVisibility !== "index" ||
  journalHubSource.schemaType !== "CollectionPage" ||
  journalHubSource.signature !== "overlap" ||
  journalHubSource.title !== "Photography Journal | Tips & Locations From Lisa" ||
  journalHubSource.description !==
    "First-hand planning advice from a Tri-Cities photographer — when to book, where to go, what to wear, and how to get photographs worth keeping forever." ||
  !Array.isArray(journalHubSource.pending) ||
  journalHubSource.pending.length !== 0
) {
  failures.push(
    "content/pages/journal.json: Journal hub must retain its approved metadata and ready/index CollectionPage contract without pending gates",
  );
}
const journalPlanningGuides = journalHubSource.sections
  ?.find((section) => section.id === "planning-guides");
const journalGuideByHeading = (heading) =>
  journalPlanningGuides?.items?.find((item) => item.heading === heading);
const journalLocationsGuide = journalGuideByHeading(
  "12 Best Places to Take Pictures in the Tri-Cities, WA",
);
const journalSeniorGuide = journalGuideByHeading(
  "When to Take Senior Pictures: A Tri-Cities Timeline",
);
const journalNewbornGuide = journalGuideByHeading(
  "In-Home vs. Studio Newborn Photography",
);
const journalBrandingGuide = journalGuideByHeading(
  "Branding Photos vs. Headshots: What Your Business Actually Needs",
);
if (
  journalLocationsGuide?.links?.length !== 1 ||
  journalLocationsGuide.links[0]?.href !==
    "/journal/family-photo-locations-tri-cities/" ||
  (journalSeniorGuide?.links?.length ?? 0) !== 0 ||
  (journalNewbornGuide?.links?.length ?? 0) !== 0 ||
  journalBrandingGuide?.links?.length !== 1 ||
  journalBrandingGuide.links[0]?.href !==
    "/journal/branding-photos-vs-headshots/" ||
  journalPlanningGuides?.links?.length !== 1 ||
  journalPlanningGuides.links[0]?.href !== "/portfolio/" ||
  journalHubSource.finalCta?.link?.href !== "/contact/"
) {
  failures.push(
    "content/pages/journal.json: Journal must link only Locations, Branding vs. Headshots, Portfolio and Contact; draft Senior/Newborn cards must have no links",
  );
}
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
const reviewsDirectionContract = `THESIS: Client words become photographic proof; Reviews refuses the generic testimonial grid.
OWN-WORLD: Ivory paper, umber and olive fields, real black-and-white photographs, square white mats, one portrait arch and one overlapping black-and-white print.
STORY: Visitors recognize deliberate ease, hear ten verified clients, turn through the work and then begin planning.
FIRST VIEWPORT: The shared EditorialHero fills the exact remaining viewport with a family embrace, two corner prints, centered promise and torn seam.
FORM: Candidate 5, Words Become Pictures / At Ease, on Purpose; seed c2ad8044; approved comp C.
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
  const seniorTimingStylesheetHref = stylesheetHrefs.find((href) =>
    /(?:^|\/)journal-senior-timing-page[^/]*\.css(?:[?#]|$)/i.test(href),
  );
  const newbornComparisonStylesheetHref = stylesheetHrefs.find((href) =>
    /(?:^|\/)journal-newborn-comparison-page[^/]*\.css(?:[?#]|$)/i.test(href),
  );
  const brandingHeadshotsStylesheetHref = stylesheetHrefs.find((href) =>
    /(?:^|\/)journal-branding-vs-headshots-page[^/]*\.css(?:[?#]|$)/i.test(href),
  );
  const linkedAboutCss = linkedStylesheets.some((css) => /\.about-page\b/.test(css));
  const linkedSeniorTimingCss = linkedStylesheets.some((css) =>
    /\.senior-timing-page\b/.test(css),
  );
  const linkedNewbornComparisonCss = linkedStylesheets.some((css) =>
    /\.newborn-comparison-page\b/.test(css),
  );
  const linkedBrandingHeadshotsCss = linkedStylesheets.some((css) =>
    /\.branding-headshots-page\b/.test(css),
  );
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
  if (relative === seniorTimingRelative) {
    const seniorTimingCss = seniorTimingStylesheetHref
      ? await readInternalStylesheet(seniorTimingStylesheetHref)
      : "";
    if (
      !seniorTimingStylesheetHref ||
      !internalTargetExists(seniorTimingStylesheetHref) ||
      !/\.senior-timing-page\b/.test(seniorTimingCss)
    ) {
      failures.push(
        `${relative}: route-scoped Senior Timing stylesheet is missing or broken`,
      );
    }
  } else if (
    seniorTimingStylesheetHref ||
    linkedSeniorTimingCss ||
    /\.senior-timing-page\s*\{/.test(source)
  ) {
    failures.push(`${relative}: Senior Timing CSS leaked into an unrelated route`);
  }
  if (relative === newbornComparisonRelative) {
    const newbornComparisonCss = newbornComparisonStylesheetHref
      ? await readInternalStylesheet(newbornComparisonStylesheetHref)
      : "";
    if (
      !newbornComparisonStylesheetHref ||
      !internalTargetExists(newbornComparisonStylesheetHref) ||
      !/\.newborn-comparison-page\b/.test(newbornComparisonCss)
    ) {
      failures.push(
        `${relative}: route-scoped Newborn Comparison stylesheet is missing or broken`,
      );
    }
  } else if (
    newbornComparisonStylesheetHref ||
    linkedNewbornComparisonCss ||
    /\.newborn-comparison-page\s*\{/.test(source)
  ) {
    failures.push(
      `${relative}: Newborn Comparison CSS leaked into an unrelated route`,
    );
  }
  if (relative === brandingHeadshotsRelative) {
    const brandingHeadshotsCss = brandingHeadshotsStylesheetHref
      ? await readInternalStylesheet(brandingHeadshotsStylesheetHref)
      : "";
    if (
      !brandingHeadshotsStylesheetHref ||
      !internalTargetExists(brandingHeadshotsStylesheetHref) ||
      !/\.branding-headshots-page\b/.test(brandingHeadshotsCss)
    ) {
      failures.push(
        `${relative}: route-scoped Branding vs. Headshots stylesheet is missing or broken`,
      );
    }
  } else if (
    brandingHeadshotsStylesheetHref ||
    linkedBrandingHeadshotsCss ||
    /\.branding-headshots-page\s*\{/.test(source)
  ) {
    failures.push(
      `${relative}: Branding vs. Headshots CSS leaked into an unrelated route`,
    );
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
    source.includes("THESIS: Lisa's About page is a keeper archive")
  ) {
    failures.push(`${relative}: About direction contract leaked into an unrelated route`);
  }
  const reviewsDirectionComment = `<!--\n${reviewsDirectionContract}\n-->`;
  if (relative === reviewsRelative) {
    const bodyContent = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || "";
    if (
      !bodyContent.trimStart().startsWith(reviewsDirectionComment) ||
      !source.includes("FORM: Candidate 5, Words Become Pictures / At Ease, on Purpose; seed c2ad8044")
    ) {
      failures.push(`${relative}: Reviews direction contract must be the first body child`);
    }
  } else if (source.includes("THESIS: Client words become photographic proof")) {
    failures.push(`${relative}: Reviews direction contract leaked into an unrelated route`);
  }
  if (relative === brandingHeadshotsRelative) {
    if (!source.includes(`<!--\n${brandingHeadshotsDirectionContract}\n-->`)) {
      failures.push(
        `${relative}: Branding vs. Headshots direction contract is missing`,
      );
    }
  } else if (source.includes("Branding vs. Headshots Versus Axis:")) {
    failures.push(
      `${relative}: Branding vs. Headshots direction contract leaked into an unrelated route`,
    );
  }
  const withoutComments = source.replace(/<!--[\s\S]*?-->/g, "");
  const main = withoutComments.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
  const documentAnchorHrefs = [
    ...withoutComments.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi),
  ].map((match) => match[1]);
  const normalizedDocumentInternalPaths = documentAnchorHrefs.flatMap((href) => {
    let url;
    try {
      url = new URL(href, "https://www.itsakeeperphotography.com/");
    } catch {
      return [];
    }
    if (!publicSiteOrigins.has(url.origin)) return [];
    return url.pathname === "/"
      ? ["/"]
      : [`/${url.pathname.replace(/^\/+|\/+$/g, "")}/`];
  });
  const internalAnchors = [...main.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/#"));
  if (indexableReleaseFiles.has(relative)) {
    const linkedUnpublishedJournalPaths = unpublishedJournalPaths.filter(
      (draftPath) =>
        normalizedDocumentInternalPaths.includes(draftPath),
    );
    if (linkedUnpublishedJournalPaths.length) {
      failures.push(
        `${relative}: ready/index route must not link unpublished Journal articles (${linkedUnpublishedJournalPaths.join(
          ", ",
        )})`,
      );
    }
  }
  if (relative === reviewsRelative) {
    const reviewAnchors = [...main.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .map((match) => ({
        href: match[1],
        label: decodeHtml(match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()),
        tag: match[0].slice(0, match[0].indexOf(">") + 1),
      }));
    const reviewAction = reviewAnchors[0];
    const contactAction = reviewAnchors[1];
    if (
      reviewAnchors.length !== 2 ||
      reviewAction?.href !== reviewsGoogleReviewUrl ||
      reviewAction?.label !== "Leave us a review" ||
      htmlAttribute(reviewAction?.tag || "", "target") !== "_blank" ||
      htmlAttribute(reviewAction?.tag || "", "rel") !== "noopener noreferrer" ||
      contactAction?.href !== "/contact/" ||
      contactAction?.label !== "Start planning your session" ||
      !/<span\b(?=[^>]*data-google-review-summary)[^>]*>/i.test(main) ||
      /kind-words__google[^>]*>[\s\S]*?<a\b[^>]*href=["']\/reviews\//i.test(main) ||
      /reviews-ease__rule/i.test(main) ||
      !/data-signature-device=["']arch["']/i.test(main) ||
      (main.match(/data-density=["']hard["']/gi) || []).length !== 6
    ) {
      failures.push(
        `${relative}: Reviews must retain the static proof summary, safe Google CTA, Contact CTA, arch composition and six hard 3D journal pages`,
      );
    }
  }
  if (relative === journalHubRelative) {
    const expectedOrigin = mode === "release"
      ? "https://www.itsakeeperphotography.com"
      : "https://itsakeeperphotography.netlify.app";
    const expectedJournalAnchors = [
      "/journal/family-photo-locations-tri-cities/",
      "/journal/branding-photos-vs-headshots/",
      "/portfolio/",
      "/contact/",
    ];
    if (
      JSON.stringify(internalAnchors) !== JSON.stringify(expectedJournalAnchors) ||
      unpublishedJournalPaths.some((href) => internalAnchors.includes(href))
    ) {
      failures.push(
        `${relative}: Journal body anchors must be Locations, Branding vs. Headshots, Portfolio and Contact only; draft articles must expose zero anchors`,
      );
    }
    if (
      !source.includes(`<link rel="canonical" href="${expectedOrigin}/journal/">`) ||
      !/data-content-status=["']ready["']/i.test(main)
    ) {
      failures.push(
        `${relative}: Journal hub must render its exact canonical and ready publication state`,
      );
    }
    const schemas = parseJsonLd(source, relative);
    const collectionPages = schemas.filter(
      (schema) => schema?.["@type"] === "CollectionPage",
    );
    const breadcrumbs = schemas.filter(
      (schema) => schema?.["@type"] === "BreadcrumbList",
    );
    const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
    const expectedBreadcrumbs = [
      { position: 1, name: "Home", item: `${expectedOrigin}/` },
      { position: 2, name: "Journal", item: `${expectedOrigin}/journal/` },
    ];
    if (
      collectionPages.length !== 1 ||
      collectionPages[0]?.url !== `${expectedOrigin}/journal/` ||
      collectionPages[0]?.["@id"] !== `${expectedOrigin}/journal/#webpage` ||
      breadcrumbs.length !== 1 ||
      breadcrumbs[0]?.["@id"] !== `${expectedOrigin}/journal/#breadcrumb` ||
      breadcrumbItems.length !== 2 ||
      breadcrumbItems.some(
        (item, index) =>
          item?.["@type"] !== "ListItem" ||
          item?.position !== expectedBreadcrumbs[index].position ||
          item?.name !== expectedBreadcrumbs[index].name ||
          item?.item !== expectedBreadcrumbs[index].item,
      )
    ) {
      failures.push(
        `${relative}: Journal must emit exactly one canonical CollectionPage and one Home → Journal BreadcrumbList`,
      );
    }
  }

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
  if (relative === seniorTimingRelative) {
    const expectedOrigin = mode === "release"
      ? "https://www.itsakeeperphotography.com"
      : "https://itsakeeperphotography.netlify.app";
    const canonical =
      `${expectedOrigin}/journal/when-to-book-senior-pictures-tri-cities/`;
    const expectedSectionIds = [
      "the-short-answer",
      "when-are-you-supposed-to-take-senior-pictures",
      "season-by-season",
      "when-is-it-too-late",
      "best-time-of-day",
      "tri-cities-booking-calendar",
      "quick-answers",
    ];
    const sourceSectionIds = (seniorTimingSource.sections || []).map(
      (section) => section.id,
    );
    if (
      seniorTimingSource.route !==
        "/journal/when-to-book-senior-pictures-tri-cities/" ||
      seniorTimingSource.family !== "article" ||
      seniorTimingSource.contentStatus !== "draft" ||
      seniorTimingSource.searchVisibility !== "noindex" ||
      seniorTimingSource.schemaType !== "Article" ||
      seniorTimingSource.signature !== "crossing-line" ||
      seniorTimingSource.title !== seniorTimingContract.title ||
      seniorTimingSource.description !== seniorTimingContract.description ||
      JSON.stringify(sourceSectionIds) !== JSON.stringify(expectedSectionIds) ||
      JSON.stringify(seniorTimingSource.pending) !==
        JSON.stringify(seniorTimingContract.pending)
    ) {
      failures.push(
        "content/pages/journal-senior-timing.json: draft state, section order, metadata or three pending facts changed",
      );
    }

    const titleText = normalizedText(
      source.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "",
    );
    const descriptionTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "description",
    );
    const robotsTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "robots",
    );
    const openGraphTypeTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "property")?.toLowerCase() === "og:type",
    );
    if (
      titleText !== seniorTimingContract.title ||
      htmlAttribute(descriptionTag || "", "content") !==
        seniorTimingContract.description ||
      htmlAttribute(robotsTag || "", "content") !==
        "noindex, nofollow, noarchive" ||
      htmlAttribute(openGraphTypeTag || "", "content") !== "article" ||
      !source.includes(`<link rel="canonical" href="${canonical}">`) ||
      !/data-content-status=["']draft["']/i.test(main) ||
      !/data-signature-device=["']crossing-line["']/i.test(main)
    ) {
      failures.push(
        `${relative}: title, description, canonical, article OG type or draft/noindex state is invalid`,
      );
    }

    const h1Texts = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((match) => normalizedText(match[1]));
    const h2Texts = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((match) => normalizedText(match[1]));
    const h3Texts = [...main.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
      .map((match) => normalizedText(match[1]));
    if (JSON.stringify(h1Texts) !== JSON.stringify(seniorTimingContract.h1)) {
      failures.push(`${relative}: Senior Timing must render exactly one approved H1`);
    }
    if (JSON.stringify(h2Texts) !== JSON.stringify(seniorTimingContract.h2)) {
      failures.push(`${relative}: Senior Timing must render the eight approved H2s in order`);
    }
    if (JSON.stringify(h3Texts) !== JSON.stringify(seniorTimingContract.h3)) {
      failures.push(`${relative}: Senior Timing must render the seven approved H3s in order`);
    }

    const bodyAnchors = [...main.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)]
      .map((match) => ({
        href: htmlAttribute(match[0], "href") || "",
        label: normalizedText(match[1]),
      }));
    if (
      JSON.stringify(bodyAnchors) !== JSON.stringify(seniorTimingContract.anchors) ||
      JSON.stringify(internalAnchors) !==
        JSON.stringify(seniorTimingContract.anchors.map((anchor) => anchor.href))
    ) {
      failures.push(
        `${relative}: internal body anchors must remain Senior, Senior, Locations and Contact in order`,
      );
    }

    const hero = main.match(
      /<header\b(?=[^>]*data-editorial-hero-page=["']journal["'])[^>]*>([\s\S]*?)<\/header>/i,
    )?.[1] || "";
    const heroButtons = [...hero.matchAll(
      /<button\b(?=[^>]*data-hero-cta)[^>]*>([\s\S]*?)<\/button>/gi,
    )];
    const heroPrints = [...hero.matchAll(
      /<figure\b(?=[^>]*data-hero-print=["'](?:left|right)["'])[^>]*>[\s\S]*?<\/figure>/gi,
    )].map((match) => match[0]);
    if (
      heroButtons.length !== 1 ||
      htmlAttribute(heroButtons[0]?.[0] || "", "data-hero-scroll-target") !==
        "the-short-answer" ||
      htmlAttribute(heroButtons[0]?.[0] || "", "aria-controls") !==
        "the-short-answer" ||
      normalizedText(heroButtons[0]?.[1] || "") !== "Read the timeline" ||
      /<a\b/i.test(hero) ||
      heroPrints.length !== 2 ||
      heroPrints.some(
        (print) => {
          const printImage = print.match(/<img\b[^>]*>/i)?.[0] || "";
          return (
            !/aria-hidden=["']true["']/i.test(print) ||
            !hasHtmlAttribute(printImage, "alt") ||
            (htmlAttribute(printImage, "alt") || "") !== ""
          );
        },
      )
    ) {
      failures.push(
        `${relative}: hero must use one local-scroll button, no anchor and two decorative prints`,
      );
    }

    const byline = main.match(
      /<div\b(?=[^>]*class=["'][^"']*\bsenior-timing-byline\b)[^>]*>([\s\S]*?)<\/div>/i,
    )?.[1] || "";
    const bylineSpans = [...byline.matchAll(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi)];
    const bylineValues = bylineSpans
      .filter((match) => !/aria-hidden=["']true["']/i.test(match[1]))
      .map((match) => normalizedText(match[2]));
    if (
      JSON.stringify(bylineValues) !==
        JSON.stringify([
          "By Lisa Weiss",
          "It's A Keeper Photography",
          "Richland, WA",
        ]) ||
      /<time\b|\b(?:19|20)\d{2}\b/i.test(byline)
    ) {
      failures.push(`${relative}: byline must identify Lisa, the studio and Richland without a date`);
    }

    const quickAnswers = sectionById(main, "quick-answers");
    const visibleQuickAnswers = [...quickAnswers.matchAll(
      /<details\b([^>]*)>([\s\S]*?)<\/details>/gi,
    )].map((match) => {
      const summary = match[2].match(
        /<summary\b[^>]*>([\s\S]*?)<\/summary>/i,
      )?.[1] || "";
      const answer = match[2].match(
        /<div\b(?=[^>]*class=["'][^"']*\bsenior-timing-faq__answer\b)[^>]*>([\s\S]*?)<\/div>/i,
      )?.[1] || "";
      return {
        hidden: /\bhidden\b|aria-hidden=["']true["']/i.test(match[1]),
        open: /(?:^|\s)open(?:\s|=|$)/i.test(match[1]),
        question: normalizedText(summary),
        answer: normalizedText(answer),
      };
    });
    if (
      visibleQuickAnswers.length !== 3 ||
      visibleQuickAnswers.some((item) => item.hidden) ||
      JSON.stringify(
        visibleQuickAnswers.map(({ question, answer }) => ({ question, answer })),
      ) !== JSON.stringify(seniorTimingContract.quickAnswers) ||
      JSON.stringify(visibleQuickAnswers.map((item) => item.open)) !==
        JSON.stringify([true, false, false])
    ) {
      failures.push(
        `${relative}: Quick Answers must expose three approved native disclosures`,
      );
    }

    const pictureBlocks = [...main.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi)]
      .map((match) => match[1]);
    const renderedImages = pictureBlocks.map((picture) => {
      const tag = picture.match(/<img\b[^>]*>/i)?.[0] || "";
      return {
        src: htmlAttribute(tag, "src") || "",
        alt: htmlAttribute(tag, "alt") || "",
        width: Number(htmlAttribute(tag, "width")),
        height: Number(htmlAttribute(tag, "height")),
        loading: htmlAttribute(tag, "loading"),
        decoding: htmlAttribute(tag, "decoding"),
        fetchpriority: htmlAttribute(tag, "fetchpriority"),
      };
    });
    if (
      JSON.stringify(renderedImages.map(({ src, alt }) => ({ src, alt }))) !==
        JSON.stringify(seniorTimingContract.images) ||
      new Set(renderedImages.map((image) => image.src)).size !== 11 ||
      renderedImages.filter((image) => image.alt).length !== 9
    ) {
      failures.push(`${relative}: rendered 11-image src+alt order changed`);
    }
    for (const [index, image] of renderedImages.entries()) {
      const picture = pictureBlocks[index] || "";
      const webpSources = (picture.match(/<source\b[^>]*>/gi) || [])
        .filter((tag) => htmlAttribute(tag, "type") === "image/webp");
      const responsivePaths = webpSources.flatMap((tag) =>
        (htmlAttribute(tag, "srcset") || "")
          .split(",")
          .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
          .filter(Boolean),
      );
      const sourcePath = path.join(root, "public", image.src.replace(/^\//, ""));
      let sourceDimensionsMatch = false;
      if (existsSync(sourcePath) && image.width > 0 && image.height > 0) {
        const metadata = await sharp(sourcePath).metadata();
        sourceDimensionsMatch =
          metadata.width === image.width && metadata.height === image.height;
      }
      if (
        image.loading !== (index < 3 ? "eager" : "lazy") ||
        image.decoding !== "async" ||
        (index === 0 ? image.fetchpriority !== "high" : image.fetchpriority === "high") ||
        !internalTargetExists(image.src) ||
        !sourceDimensionsMatch ||
        responsivePaths.length < 2 ||
        responsivePaths.some((asset) => !/\.webp$/i.test(asset) || !internalTargetExists(asset))
      ) {
        failures.push(
          `${relative}: image ${index + 1} violates loading, priority, intrinsic-size or responsive-WebP contract`,
        );
      }
    }

    const schemas = parseJsonLd(source, relative);
    const articles = schemas.filter((schema) => schema?.["@type"] === "Article");
    const faqSchemas = schemas.filter((schema) => schema?.["@type"] === "FAQPage");
    const breadcrumbs = schemas.filter(
      (schema) => schema?.["@type"] === "BreadcrumbList",
    );
    const topLevelServices = schemas.filter(
      (schema) => schema?.["@type"] === "Service",
    );
    const schemaObjects = schemas.flatMap(nestedSchemaObjects);
    const unsafeSchema = schemaObjects.some((schema) =>
      ["Review", "AggregateRating", "GeoCoordinates"].includes(schema?.["@type"]) ||
      Object.keys(schema).some((key) =>
        ["streetaddress", "latitude", "longitude"].includes(key.toLowerCase()) ||
        key.toLowerCase().startsWith("gps"),
      ),
    );
    const article = articles[0];
    const articleAbout = Array.isArray(article?.about)
      ? article.about.map((item) => [item?.["@type"], item?.name])
      : [];
    const articleCities = Array.isArray(article?.spatialCoverage)
      ? article.spatialCoverage.map((item) => item?.name)
      : [];
    if (
      articles.length !== 1 ||
      faqSchemas.length !== 1 ||
      breadcrumbs.length !== 1 ||
      topLevelServices.length !== 0 ||
      unsafeSchema ||
      article?.["@id"] !== `${canonical}#webpage` ||
      article?.url !== canonical ||
      article?.name !== seniorTimingContract.title ||
      article?.description !== seniorTimingContract.description ||
      article?.headline !== seniorTimingContract.title ||
      article?.author?.["@id"] !== `${expectedOrigin}/#lisa` ||
      article?.publisher?.["@id"] !== `${expectedOrigin}/#business` ||
      article?.image !==
        `${expectedOrigin}/uploads/journal-senior-golden-hour-tricities.jpg` ||
      article?.primaryImageOfPage?.url !==
        `${expectedOrigin}/uploads/journal-senior-golden-hour-tricities.jpg` ||
      article?.isPartOf?.["@id"] !== `${expectedOrigin}/#website` ||
      article?.mainEntityOfPage?.["@id"] !== canonical ||
      article?.inLanguage !== "en-US" ||
      Object.hasOwn(article || {}, "datePublished") ||
      Object.hasOwn(article || {}, "dateModified") ||
      JSON.stringify(articleAbout) !==
        JSON.stringify([
          ["Thing", "Senior pictures"],
          ["Place", "Tri-Cities, Washington"],
        ]) ||
      JSON.stringify(articleCities) !==
        JSON.stringify(["Richland", "Kennewick", "Pasco"]) ||
      article?.spatialCoverage?.[0]?.containedInPlace?.["@type"] !== "State" ||
      article?.spatialCoverage?.[0]?.containedInPlace?.name !== "Washington"
    ) {
      failures.push(
        `${relative}: Article/FAQ/Breadcrumb top-level schema or claim-safety contract is invalid`,
      );
    }

    const firstParagraph = (section) => normalizedText(
      section.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "",
    );
    const shortAnswerSection = sectionById(main, "the-short-answer");
    const tooLateSection = sectionById(main, "when-is-it-too-late");
    const goldenHourSection = sectionById(main, "best-time-of-day");
    const visibleFaqPairs = [
      {
        question: h1Texts[0],
        answer: firstParagraph(
          shortAnswerSection.match(
            /<div\b(?=[^>]*class=["'][^"']*\bsenior-timing-answer__arch\b)[^>]*>([\s\S]*?)<\/div>/i,
          )?.[1] || "",
        ),
      },
      {
        question: normalizedText(
          tooLateSection.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || "",
        ),
        answer: firstParagraph(tooLateSection),
      },
      {
        question: normalizedText(
          goldenHourSection.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || "",
        ),
        answer: firstParagraph(goldenHourSection),
      },
    ];
    const faqEntities = faqSchemas[0]?.mainEntity || [];
    if (
      faqEntities.length !== 3 ||
      visibleFaqPairs.some(
        (pair, index) =>
          faqEntities[index]?.["@type"] !== "Question" ||
          faqEntities[index]?.acceptedAnswer?.["@type"] !== "Answer" ||
          faqEntities[index]?.name !== pair.question ||
          faqEntities[index]?.acceptedAnswer?.text !== pair.answer,
      )
    ) {
      failures.push(
        `${relative}: FAQPage must map the three approved visible question/answer pairs 1:1`,
      );
    }

    const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
    const expectedBreadcrumbs = [
      { position: 1, name: "Home", item: `${expectedOrigin}/` },
      { position: 2, name: "Journal", item: `${expectedOrigin}/journal/` },
      { position: 3, name: "When to Take Senior Pictures", item: canonical },
    ];
    if (
      breadcrumbItems.length !== 3 ||
      breadcrumbItems.some(
        (item, index) =>
          item?.["@type"] !== "ListItem" ||
          item?.position !== expectedBreadcrumbs[index].position ||
          item?.name !== expectedBreadcrumbs[index].name ||
          item?.item !== expectedBreadcrumbs[index].item,
      )
    ) {
      failures.push(
        `${relative}: BreadcrumbList must resolve Home, Journal and the Senior Timing article`,
      );
    }
  }
  if (relative === newbornComparisonRelative) {
    const expectedOrigin = mode === "release"
      ? "https://www.itsakeeperphotography.com"
      : "https://itsakeeperphotography.netlify.app";
    const canonical =
      `${expectedOrigin}/journal/in-home-vs-studio-newborn-photography/`;
    const expectedSectionIds = [
      "the-short-answer",
      "what-is-in-home-newborn-photography",
      "what-is-studio-newborn-photography",
      "the-honest-comparison",
      "what-about-outdoor-newborn-sessions",
      "which-one-will-you-treasure-more",
      "common-questions",
    ];
    const sourceSectionIds = (newbornComparisonSource.sections || []).map(
      (section) => section.id,
    );
    if (
      newbornComparisonSource.route !==
        "/journal/in-home-vs-studio-newborn-photography/" ||
      newbornComparisonSource.family !== "article" ||
      newbornComparisonSource.contentStatus !== "draft" ||
      newbornComparisonSource.searchVisibility !== "noindex" ||
      newbornComparisonSource.schemaType !== "Article" ||
      newbornComparisonSource.signature !== "overlap" ||
      newbornComparisonSource.title !== newbornComparisonContract.title ||
      newbornComparisonSource.description !== newbornComparisonContract.description ||
      JSON.stringify(sourceSectionIds) !== JSON.stringify(expectedSectionIds) ||
      newbornComparisonSource.finalCta?.heading !==
        "Planning Your Baby's First Photos in the Tri-Cities" ||
      JSON.stringify(newbornComparisonSource.pending) !==
        JSON.stringify(newbornComparisonContract.pending)
    ) {
      failures.push(
        "content/pages/journal-newborn-comparison.json: draft state, complete section order, metadata or three pending facts changed",
      );
    }
    const registeredPending = [...pendingRegistrySource.matchAll(
      /^\/\/ CONTENT PENDING \[\/journal\/in-home-vs-studio-newborn-photography\/\]: (\[[^\n]+\])$/gm,
    )].map((match) => match[1]);
    if (
      JSON.stringify(registeredPending) !==
        JSON.stringify(newbornComparisonContract.pending)
    ) {
      failures.push(
        "src/content/pending.ts: Newborn Comparison must register the same three pending facts in source order",
      );
    }

    const titleText = normalizedText(
      source.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "",
    );
    const descriptionTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "description",
    );
    const robotsTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "robots",
    );
    const openGraphTypeTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "property")?.toLowerCase() === "og:type",
    );
    if (
      titleText !== newbornComparisonContract.title ||
      htmlAttribute(descriptionTag || "", "content") !==
        newbornComparisonContract.description ||
      htmlAttribute(robotsTag || "", "content") !==
        "noindex, nofollow, noarchive" ||
      htmlAttribute(openGraphTypeTag || "", "content") !== "article" ||
      !source.includes(`<link rel="canonical" href="${canonical}">`) ||
      !/data-content-status=["']draft["']/i.test(main) ||
      !/data-signature-device=["']overlap["']/i.test(main)
    ) {
      failures.push(
        `${relative}: title, description, canonical, article OG type or draft/noindex state is invalid`,
      );
    }

    const h1Texts = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((match) => normalizedText(match[1]));
    const h2Texts = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((match) => normalizedText(match[1]));
    const h3Texts = [...main.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
      .map((match) => normalizedText(match[1]));
    const paragraphTexts = [...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => normalizedText(match[1]));
    if (JSON.stringify(h1Texts) !== JSON.stringify(newbornComparisonContract.h1)) {
      failures.push(`${relative}: Newborn Comparison must render exactly one approved H1`);
    }
    if (JSON.stringify(h2Texts) !== JSON.stringify(newbornComparisonContract.h2)) {
      failures.push(
        `${relative}: Newborn Comparison must render the eight approved H2s in order`,
      );
    }
    if (JSON.stringify(h3Texts) !== JSON.stringify(newbornComparisonContract.h3)) {
      failures.push(
        `${relative}: Newborn Comparison must render the seven approved H3s in order`,
      );
    }
    if (
      JSON.stringify(paragraphTexts) !==
        JSON.stringify(newbornComparisonContract.paragraphs)
    ) {
      failures.push(
        `${relative}: Newborn Comparison definitive paragraph copy or order changed`,
      );
    }

    const bodyAnchors = [...main.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)]
      .map((match) => ({
        href: htmlAttribute(match[0], "href") || "",
        label: normalizedText(match[1]),
      }));
    if (
      JSON.stringify(bodyAnchors) !==
        JSON.stringify(newbornComparisonContract.anchors) ||
      JSON.stringify(internalAnchors) !==
        JSON.stringify(newbornComparisonContract.anchors.map((anchor) => anchor.href))
    ) {
      failures.push(
        `${relative}: internal body anchors must remain Family, Newborn and Contact in order`,
      );
    }

    const hero = main.match(
      /<header\b(?=[^>]*data-editorial-hero-page=["']journal["'])[^>]*>([\s\S]*?)<\/header>/i,
    )?.[1] || "";
    const heroButtons = [...hero.matchAll(
      /<button\b(?=[^>]*data-hero-cta)[^>]*>([\s\S]*?)<\/button>/gi,
    )];
    const heroPrints = [...hero.matchAll(
      /<figure\b(?=[^>]*data-hero-print=["'](?:left|right)["'])[^>]*>[\s\S]*?<\/figure>/gi,
    )].map((match) => match[0]);
    if (
      heroButtons.length !== 1 ||
      htmlAttribute(heroButtons[0]?.[0] || "", "data-hero-scroll-target") !==
        "the-short-answer" ||
      htmlAttribute(heroButtons[0]?.[0] || "", "aria-controls") !==
        "the-short-answer" ||
      normalizedText(heroButtons[0]?.[1] || "") !== "Read the comparison" ||
      /<a\b/i.test(hero) ||
      heroPrints.length !== 2 ||
      heroPrints.some((print) => {
        const printImage = print.match(/<img\b[^>]*>/i)?.[0] || "";
        return (
          !/aria-hidden=["']true["']/i.test(print) ||
          !hasHtmlAttribute(printImage, "alt") ||
          (htmlAttribute(printImage, "alt") || "") !== ""
        );
      })
    ) {
      failures.push(
        `${relative}: hero must use one local-scroll button, no anchor and two decorative prints`,
      );
    }

    const byline = main.match(
      /<div\b(?=[^>]*class=["'][^"']*\bnewborn-comparison-byline\b)[^>]*>([\s\S]*?)<\/div>/i,
    )?.[1] || "";
    const bylineSpans = [...byline.matchAll(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi)];
    const bylineValues = bylineSpans
      .filter((match) => !/aria-hidden=["']true["']/i.test(match[1]))
      .map((match) => normalizedText(match[2]));
    if (
      JSON.stringify(bylineValues) !==
        JSON.stringify([
          "By Lisa Weiss",
          "It's A Keeper Photography",
          "Richland, WA",
        ]) ||
      /<time\b|\b(?:19|20)\d{2}\b/i.test(byline)
    ) {
      failures.push(
        `${relative}: byline must identify Lisa, the business and Richland without a date`,
      );
    }

    const commonQuestions = sectionById(main, "common-questions");
    const visibleFaq = [...commonQuestions.matchAll(
      /<details\b([^>]*)>([\s\S]*?)<\/details>/gi,
    )].map((match) => {
      const summary = match[2].match(
        /<summary\b[^>]*>([\s\S]*?)<\/summary>/i,
      )?.[1] || "";
      const answer = match[2].match(
        /<div\b(?=[^>]*class=["'][^"']*\bnewborn-comparison-faq__answer\b)[^>]*>([\s\S]*?)<\/div>/i,
      )?.[1] || "";
      return {
        hidden: /\bhidden\b|aria-hidden=["']true["']/i.test(match[1]),
        open: /(?:^|\s)open(?:\s|=|$)/i.test(match[1]),
        question: normalizedText(summary),
        answer: normalizedText(answer),
      };
    });
    if (
      visibleFaq.length !== 3 ||
      visibleFaq.some((item) => item.hidden) ||
      JSON.stringify(
        visibleFaq.map(({ question, answer }) => ({ question, answer })),
      ) !== JSON.stringify(newbornComparisonContract.faq) ||
      JSON.stringify(visibleFaq.map((item) => item.open)) !==
        JSON.stringify([true, false, false])
    ) {
      failures.push(
        `${relative}: Common Questions must expose three approved native disclosures`,
      );
    }

    const pictureBlocks = [...main.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi)]
      .map((match) => match[1]);
    const renderedImages = pictureBlocks.map((picture) => {
      const tag = picture.match(/<img\b[^>]*>/i)?.[0] || "";
      return {
        src: htmlAttribute(tag, "src") || "",
        alt: htmlAttribute(tag, "alt") || "",
        width: Number(htmlAttribute(tag, "width")),
        height: Number(htmlAttribute(tag, "height")),
        loading: htmlAttribute(tag, "loading"),
        decoding: htmlAttribute(tag, "decoding"),
        fetchpriority: htmlAttribute(tag, "fetchpriority"),
      };
    });
    if (
      JSON.stringify(renderedImages.map(({ src, alt }) => ({ src, alt }))) !==
        JSON.stringify(newbornComparisonContract.images) ||
      new Set(renderedImages.map((image) => image.src)).size !== 9 ||
      renderedImages.filter((image) => image.alt).length !== 7
    ) {
      failures.push(`${relative}: rendered nine-image src+alt order changed`);
    }
    for (const [index, image] of renderedImages.entries()) {
      const picture = pictureBlocks[index] || "";
      const webpSources = (picture.match(/<source\b[^>]*>/gi) || [])
        .filter((tag) => htmlAttribute(tag, "type") === "image/webp");
      const responsivePaths = webpSources.flatMap((tag) =>
        (htmlAttribute(tag, "srcset") || "")
          .split(",")
          .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
          .filter(Boolean),
      );
      const sourcePath = path.join(root, "public", image.src.replace(/^\//, ""));
      let sourceDimensionsMatch = false;
      if (existsSync(sourcePath) && image.width > 0 && image.height > 0) {
        const metadata = await sharp(sourcePath).metadata();
        sourceDimensionsMatch =
          metadata.width === image.width && metadata.height === image.height;
      }
      if (
        image.loading !== (index < 3 ? "eager" : "lazy") ||
        image.decoding !== "async" ||
        (index === 0
          ? image.fetchpriority !== "high"
          : image.fetchpriority === "high") ||
        !internalTargetExists(image.src) ||
        !sourceDimensionsMatch ||
        responsivePaths.length < 2 ||
        responsivePaths.some(
          (asset) => !/\.webp$/i.test(asset) || !internalTargetExists(asset),
        )
      ) {
        failures.push(
          `${relative}: image ${index + 1} violates loading, priority, intrinsic-size or responsive-WebP contract`,
        );
      }
    }

    const schemas = parseJsonLd(source, relative);
    const articles = schemas.filter((schema) => schema?.["@type"] === "Article");
    const faqSchemas = schemas.filter((schema) => schema?.["@type"] === "FAQPage");
    const breadcrumbs = schemas.filter(
      (schema) => schema?.["@type"] === "BreadcrumbList",
    );
    const topLevelServices = schemas.filter(
      (schema) => schema?.["@type"] === "Service",
    );
    const schemaObjects = schemas.flatMap(nestedSchemaObjects);
    const unsafeSchema = schemaObjects.some((schema) =>
      ["Review", "AggregateRating", "GeoCoordinates"].includes(schema?.["@type"]) ||
      Object.keys(schema).some((key) =>
        ["streetaddress", "latitude", "longitude"].includes(key.toLowerCase()) ||
        key.toLowerCase().startsWith("gps"),
      ),
    );
    const article = articles[0];
    const articleAbout = Array.isArray(article?.about)
      ? article.about.map((item) => [item?.["@type"], item?.name])
      : [];
    const articleCities = Array.isArray(article?.spatialCoverage)
      ? article.spatialCoverage.map((item) => item?.name)
      : [];
    if (
      articles.length !== 1 ||
      faqSchemas.length !== 1 ||
      breadcrumbs.length !== 1 ||
      topLevelServices.length !== 0 ||
      unsafeSchema ||
      article?.["@id"] !== `${canonical}#webpage` ||
      article?.url !== canonical ||
      article?.name !== newbornComparisonContract.title ||
      article?.description !== newbornComparisonContract.description ||
      article?.headline !== newbornComparisonContract.title ||
      article?.author?.["@id"] !== `${expectedOrigin}/#lisa` ||
      article?.publisher?.["@id"] !== `${expectedOrigin}/#business` ||
      article?.image !==
        `${expectedOrigin}/uploads/richland-mother-newborn-at-home.jpg` ||
      article?.primaryImageOfPage?.url !==
        `${expectedOrigin}/uploads/richland-mother-newborn-at-home.jpg` ||
      article?.isPartOf?.["@id"] !== `${expectedOrigin}/#website` ||
      article?.mainEntityOfPage?.["@id"] !== canonical ||
      article?.inLanguage !== "en-US" ||
      Object.hasOwn(article || {}, "datePublished") ||
      Object.hasOwn(article || {}, "dateModified") ||
      JSON.stringify(articleAbout) !==
        JSON.stringify([
          ["Thing", "Newborn photography"],
          ["Place", "Tri-Cities, Washington"],
        ]) ||
      JSON.stringify(articleCities) !==
        JSON.stringify(["Richland", "Kennewick", "Pasco"]) ||
      article?.spatialCoverage?.[0]?.containedInPlace?.["@type"] !== "State" ||
      article?.spatialCoverage?.[0]?.containedInPlace?.name !== "Washington"
    ) {
      failures.push(
        `${relative}: Article/FAQ/Breadcrumb top-level schema or claim-safety contract is invalid`,
      );
    }

    const faqEntities = faqSchemas[0]?.mainEntity || [];
    if (
      faqEntities.length !== 3 ||
      newbornComparisonContract.faq.some(
        (pair, index) =>
          faqEntities[index]?.["@type"] !== "Question" ||
          faqEntities[index]?.acceptedAnswer?.["@type"] !== "Answer" ||
          faqEntities[index]?.name !== pair.question ||
          faqEntities[index]?.acceptedAnswer?.text !== pair.answer ||
          visibleFaq[index]?.question !== pair.question ||
          visibleFaq[index]?.answer !== pair.answer,
      )
    ) {
      failures.push(
        `${relative}: FAQPage must map the three visible question/answer pairs 1:1`,
      );
    }

    const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
    const expectedBreadcrumbs = [
      { position: 1, name: "Home", item: `${expectedOrigin}/` },
      { position: 2, name: "Journal", item: `${expectedOrigin}/journal/` },
      {
        position: 3,
        name: "In-Home vs. Studio Newborn Photography",
        item: canonical,
      },
    ];
    if (
      breadcrumbItems.length !== 3 ||
      breadcrumbItems.some(
        (item, index) =>
          item?.["@type"] !== "ListItem" ||
          item?.position !== expectedBreadcrumbs[index].position ||
          item?.name !== expectedBreadcrumbs[index].name ||
          item?.item !== expectedBreadcrumbs[index].item,
      )
    ) {
      failures.push(
        `${relative}: BreadcrumbList must resolve Home, Journal and the Newborn Comparison article`,
      );
    }
  }
  if (relative === brandingHeadshotsRelative) {
    const expectedOrigin = mode === "release"
      ? "https://www.itsakeeperphotography.com"
      : "https://itsakeeperphotography.netlify.app";
    const canonical =
      `${expectedOrigin}/journal/branding-photos-vs-headshots/`;
    const sourceSectionIds = (brandingHeadshotsSource.sections || []).map(
      (section) => section.id,
    );
    const registeredPending = [...pendingRegistrySource.matchAll(
      /^\/\/ CONTENT PENDING \[\/journal\/branding-photos-vs-headshots\/\]: (\[[^\n]+\])$/gm,
    )].map((match) => match[1]);
    if (
      brandingHeadshotsSource.route !==
        "/journal/branding-photos-vs-headshots/" ||
      brandingHeadshotsSource.family !== "article" ||
      brandingHeadshotsSource.contentStatus !== "ready" ||
      brandingHeadshotsSource.searchVisibility !== "index" ||
      brandingHeadshotsSource.schemaType !== "Article" ||
      brandingHeadshotsSource.signature !== "crossing-line" ||
      brandingHeadshotsSource.title !== brandingHeadshotsContract.title ||
      brandingHeadshotsSource.description !==
        brandingHeadshotsContract.description ||
      brandingHeadshotsSource.hero?.image !==
        "/uploads/branding-chef-kitchen-richland-wa.jpg" ||
      brandingHeadshotsSource.hero?.imageAlt !==
        "Chef smiling while stirring vegetables in a modern kitchen during a Richland branding session." ||
      JSON.stringify(sourceSectionIds) !==
        JSON.stringify(brandingHeadshotsContract.sectionIds) ||
      brandingHeadshotsSource.finalCta?.heading !== "Show Them Who You Are" ||
      brandingHeadshotsSource.finalCta?.image !==
        "/uploads/business-team-meeting-richland-wa.jpg" ||
      brandingHeadshotsSource.finalCta?.imageAlt !== "" ||
      JSON.stringify(brandingHeadshotsSource.pending) !== "[]" ||
      registeredPending.length !== 0
    ) {
      failures.push(
        "content/pages/journal-branding-vs-headshots.json: ready/index state, exact metadata, media, section order or empty pending contract changed",
      );
    }
    const brandingDefinitionSource = brandingHeadshotsSource.sections?.find(
      (section) => section.id === "what-are-branding-photos",
    );
    const headshotDefinitionSource = brandingHeadshotsSource.sections?.find(
      (section) => section.id === "what-is-a-headshot",
    );
    const comparisonSource = brandingHeadshotsSource.sections?.find(
      (section) => section.id === "side-by-side",
    );
    const processSource = brandingHeadshotsSource.sections?.find(
      (section) => section.id === "what-happens-in-a-branding-session",
    );
    const sourceImages = [
      [brandingHeadshotsSource.hero?.image, brandingHeadshotsSource.hero?.imageAlt],
      [
        brandingHeadshotsSource.hero?.secondaryImage,
        brandingHeadshotsSource.hero?.secondaryImageAlt,
      ],
      [brandingDefinitionSource?.image, brandingDefinitionSource?.imageAlt],
      [
        brandingDefinitionSource?.secondaryImage,
        brandingDefinitionSource?.secondaryImageAlt,
      ],
      [
        brandingDefinitionSource?.items?.[0]?.image,
        brandingDefinitionSource?.items?.[0]?.imageAlt,
      ],
      [headshotDefinitionSource?.image, headshotDefinitionSource?.imageAlt],
      [comparisonSource?.image, comparisonSource?.imageAlt],
      [comparisonSource?.secondaryImage, comparisonSource?.secondaryImageAlt],
      [processSource?.image, processSource?.imageAlt],
      [
        brandingHeadshotsSource.finalCta?.image,
        brandingHeadshotsSource.finalCta?.imageAlt,
      ],
    ].map(([src, alt]) => ({ src, alt }));
    const expectedSourceImages = brandingHeadshotsContract.images
      .filter((_image, index) => index !== 2)
      .map(({ src, alt }) => ({ src, alt }));
    if (JSON.stringify(sourceImages) !== JSON.stringify(expectedSourceImages)) {
      failures.push(
        "content/pages/journal-branding-vs-headshots.json: approved source media or alt order changed",
      );
    }

    const titleText = normalizedText(
      source.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "",
    );
    const descriptionTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "description",
    );
    const robotsTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "name")?.toLowerCase() === "robots",
    );
    const openGraphTypeTag = (source.match(/<meta\b[^>]*>/gi) || []).find(
      (tag) => htmlAttribute(tag, "property")?.toLowerCase() === "og:type",
    );
    const expectedRobots = mode === "release"
      ? "index, follow, max-image-preview:large"
      : "noindex, nofollow, noarchive";
    if (
      titleText !== brandingHeadshotsContract.title ||
      htmlAttribute(descriptionTag || "", "content") !==
        brandingHeadshotsContract.description ||
      htmlAttribute(robotsTag || "", "content") !== expectedRobots ||
      htmlAttribute(openGraphTypeTag || "", "content") !== "article" ||
      !source.includes(`<link rel="canonical" href="${canonical}">`) ||
      !/<article\b[^>]*class=["'][^"']*\bbranding-headshots-page\b/i.test(main) ||
      !/data-content-status=["']ready["']/i.test(main) ||
      !/data-signature-device=["']crossing-line["']/i.test(main)
    ) {
      failures.push(
        `${relative}: title, description, canonical, Article OG type or ready/index SSR state is invalid`,
      );
    }

    const h1Texts = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((match) => normalizedText(match[1]));
    const h2Texts = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((match) => normalizedText(match[1]));
    const h3Texts = [...main.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
      .map((match) => normalizedText(match[1]));
    if (JSON.stringify(h1Texts) !== JSON.stringify(brandingHeadshotsContract.h1)) {
      failures.push(
        `${relative}: Branding vs. Headshots must render exactly one approved H1`,
      );
    }
    if (JSON.stringify(h2Texts) !== JSON.stringify(brandingHeadshotsContract.h2)) {
      failures.push(
        `${relative}: Branding vs. Headshots must render the eight approved H2s in order`,
      );
    }
    if (JSON.stringify(h3Texts) !== JSON.stringify(brandingHeadshotsContract.h3)) {
      failures.push(
        `${relative}: comparison labels must remain table headers and the six approved H3s must remain in order`,
      );
    }

    const normalizedBrandingProse = (value = "") =>
      normalizedText(value).replace(/\s+([,.;:!?])/g, "$1");
    const sectionParagraphs = (id) => [
      ...sectionById(main, id).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi),
    ].map((match) => normalizedBrandingProse(match[1]));
    for (const [id, expectedParagraphs] of Object.entries(
      brandingHeadshotsContract.sectionParagraphs,
    )) {
      if (
        JSON.stringify(sectionParagraphs(id)) !==
          JSON.stringify(expectedParagraphs)
      ) {
        failures.push(
          `${relative}: definitive paragraph copy or order changed in #${id}`,
        );
      }
    }

    const brandingDefinition = sectionById(main, "what-are-branding-photos");
    const checklist = [...brandingDefinition.matchAll(
      /<li\b[^>]*>([\s\S]*?)<\/li>/gi,
    )].map((match) => normalizedText(match[1]));
    if (
      (brandingDefinition.match(/<ul\b/gi) || []).length !== 1 ||
      JSON.stringify(checklist) !==
        JSON.stringify(brandingHeadshotsContract.checklist)
    ) {
      failures.push(
        `${relative}: five branding examples must remain one semantic unordered list`,
      );
    }

    const comparison = sectionById(main, "side-by-side");
    const tables = [...comparison.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)];
    const table = tables[0]?.[1] || "";
    const columnHeaders = [...table.matchAll(
      /<thead\b[^>]*>[\s\S]*?<\/thead>/gi,
    )].flatMap((thead) =>
      [...thead[0].matchAll(/<th\b([^>]*)>([\s\S]*?)<\/th>/gi)].map(
        (match) => ({ attrs: match[1], text: normalizedText(match[2]) }),
      ),
    );
    const bodyRows = [...table.matchAll(
      /<tbody\b[^>]*>([\s\S]*?)<\/tbody>/gi,
    )].flatMap((tbody) =>
      [...tbody[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
        [...row[1].matchAll(/<(th|td)\b([^>]*)>([\s\S]*?)<\/\1>/gi)].map(
          (cell) => normalizedText(cell[3]),
        ),
      ),
    );
    const rowHeaders = [...table.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/gi)]
      .flatMap((tbody) => [...tbody[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)])
      .map((row) => row[1].match(/<th\b([^>]*)>/i)?.[1] || "");
    if (
      tables.length !== 1 ||
      columnHeaders.length !== 3 ||
      columnHeaders.at(-2)?.text !== "Headshot" ||
      columnHeaders.at(-1)?.text !== "Branding photos" ||
      columnHeaders.some(({ attrs }) => !/\bscope=["']col["']/i.test(attrs)) ||
      rowHeaders.length !== 6 ||
      rowHeaders.some((attrs) => !/\bscope=["']row["']/i.test(attrs)) ||
      JSON.stringify(bodyRows) !==
        JSON.stringify(brandingHeadshotsContract.comparisonRows)
    ) {
      failures.push(
        `${relative}: comparison must remain one accessible three-column table with six exact rows`,
      );
    }

    const shortAnswer = sectionById(main, "the-short-answer");
    const decision = sectionById(main, "which-does-your-business-need-first");
    const questions = sectionById(main, "common-questions");
    const strongTexts = [...shortAnswer.matchAll(
      /<strong\b[^>]*>([\s\S]*?)<\/strong>/gi,
    )].map((match) => normalizedText(match[1]));
    const emphasisTexts = [brandingDefinition, decision, questions].flatMap(
      (section) => [...section.matchAll(/<em\b[^>]*>([\s\S]*?)<\/em>/gi)]
        .map((match) => normalizedText(match[1])),
    );
    if (
      JSON.stringify(strongTexts) !==
        JSON.stringify([
          "A headshot is one great portrait of you.",
          "Branding photos are a full library of images about your business",
        ]) ||
      JSON.stringify(emphasisTexts) !==
        JSON.stringify(["look like your business", "is", "you", "are"])
    ) {
      failures.push(
        `${relative}: definitive strong and emphasis semantics changed`,
      );
    }

    const bodyAnchors = [...main.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)]
      .map((match) => ({
        href: htmlAttribute(match[0], "href") || "",
        label: normalizedText(
          match[1].replace(
            /<span\b[^>]*aria-hidden=["']true["'][^>]*>[\s\S]*?<\/span>/gi,
            "",
          ),
        ),
      }));
    if (
      JSON.stringify(bodyAnchors) !==
        JSON.stringify(brandingHeadshotsContract.anchors) ||
      JSON.stringify(internalAnchors) !==
        JSON.stringify(brandingHeadshotsContract.anchors.map((anchor) => anchor.href))
    ) {
      failures.push(
        `${relative}: internal body anchors must remain Branding, Headshots and Contact in order`,
      );
    }

    const hero = main.match(
      /<header\b(?=[^>]*data-editorial-hero-page=["']journal["'])[^>]*>([\s\S]*?)<\/header>/i,
    )?.[1] || "";
    const heroButtons = [...hero.matchAll(
      /<button\b(?=[^>]*data-hero-cta)[^>]*>([\s\S]*?)<\/button>/gi,
    )];
    const heroPrints = [...hero.matchAll(
      /<figure\b(?=[^>]*data-hero-print=["'](?:left|right)["'])[^>]*>[\s\S]*?<\/figure>/gi,
    )].map((match) => match[0]);
    if (
      heroButtons.length !== 1 ||
      htmlAttribute(heroButtons[0]?.[0] || "", "data-hero-scroll-target") !==
        "the-short-answer" ||
      htmlAttribute(heroButtons[0]?.[0] || "", "aria-controls") !==
        "the-short-answer" ||
      normalizedText(heroButtons[0]?.[1] || "") !== "Read the comparison" ||
      /<a\b/i.test(hero) ||
      heroPrints.length !== 2 ||
      heroPrints.some((print) => {
        const image = print.match(/<img\b[^>]*>/i)?.[0] || "";
        return (
          !/aria-hidden=["']true["']/i.test(print) ||
          !hasHtmlAttribute(image, "alt") ||
          (htmlAttribute(image, "alt") || "") !== ""
        );
      })
    ) {
      failures.push(
        `${relative}: hero must use one local-scroll button, no anchor and two decorative prints`,
      );
    }

    const byline = main.match(
      /<div\b(?=[^>]*class=["'][^"']*\bbranding-headshots-byline\b)[^>]*>([\s\S]*?)<\/div>/i,
    )?.[1] || "";
    const bylineValues = [...byline.matchAll(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi)]
      .filter((match) => !/aria-hidden=["']true["']/i.test(match[1]))
      .map((match) => normalizedText(match[2]));
    const publicationTime = byline.match(
      /<time\b([^>]*)>([\s\S]*?)<\/time>/i,
    );
    if (
      JSON.stringify(bylineValues) !==
        JSON.stringify([
          "By Lisa Weiss",
          "It's A Keeper Photography",
          "Richland, WA",
        ]) ||
      htmlAttribute(publicationTime?.[0] || "", "datetime") !== "2026-08-11" ||
      normalizedText(publicationTime?.[2] || "") !== "August 11, 2026"
    ) {
      failures.push(
        `${relative}: byline must identify Lisa, the business, Richland and the authorized publication date`,
      );
    }

    const visibleFaq = [...questions.matchAll(
      /<details\b([^>]*)>([\s\S]*?)<\/details>/gi,
    )].map((match) => ({
      hidden: /\bhidden\b|aria-hidden=["']true["']/i.test(match[1]),
      open: /(?:^|\s)open(?:\s|=|$)/i.test(match[1]),
      question: normalizedBrandingProse(
        match[2].match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || "",
      ),
      answer: normalizedBrandingProse(
        match[2].match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "",
      ),
    }));
    if (
      visibleFaq.length !== 3 ||
      visibleFaq.some((item) => item.hidden) ||
      JSON.stringify(
        visibleFaq.map(({ question, answer }) => ({ question, answer })),
      ) !== JSON.stringify(brandingHeadshotsContract.faq) ||
      JSON.stringify(visibleFaq.map((item) => item.open)) !==
        JSON.stringify([true, false, false])
    ) {
      failures.push(
        `${relative}: Common Questions must expose three exact native disclosures`,
      );
    }

    const pictureBlocks = [...main.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi)]
      .map((match) => match[1]);
    const renderedImages = pictureBlocks.map((picture) => {
      const tag = picture.match(/<img\b[^>]*>/i)?.[0] || "";
      return {
        src: htmlAttribute(tag, "src") || "",
        alt: htmlAttribute(tag, "alt") || "",
        width: Number(htmlAttribute(tag, "width")),
        height: Number(htmlAttribute(tag, "height")),
        loading: htmlAttribute(tag, "loading"),
        decoding: htmlAttribute(tag, "decoding"),
        fetchpriority: htmlAttribute(tag, "fetchpriority"),
      };
    });
    if (
      JSON.stringify(renderedImages.map(({ src, alt }) => ({ src, alt }))) !==
        JSON.stringify(brandingHeadshotsContract.images) ||
      new Set(renderedImages.map((image) => image.src)).size !== 11 ||
      renderedImages.filter((image) => image.alt).length !== 8
    ) {
      failures.push(
        `${relative}: rendered 11-image unique src+alt order or 8/3 informative/decorative split changed`,
      );
    }
    for (const [index, image] of renderedImages.entries()) {
      const picture = pictureBlocks[index] || "";
      const responsivePaths = (picture.match(/<source\b[^>]*>/gi) || [])
        .filter((tag) => htmlAttribute(tag, "type") === "image/webp")
        .flatMap((tag) =>
          (htmlAttribute(tag, "srcset") || "")
            .split(",")
            .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
            .filter(Boolean),
        );
      const sourcePath = path.join(root, "public", image.src.replace(/^\//, ""));
      let sourceDimensionsMatch = false;
      if (existsSync(sourcePath) && image.width > 0 && image.height > 0) {
        const metadata = await sharp(sourcePath).metadata();
        sourceDimensionsMatch =
          metadata.width === image.width && metadata.height === image.height;
      }
      if (
        image.loading !== (index < 3 ? "eager" : "lazy") ||
        image.decoding !== "async" ||
        (index === 0
          ? image.fetchpriority !== "high"
          : image.fetchpriority === "high") ||
        !internalTargetExists(image.src) ||
        !sourceDimensionsMatch ||
        responsivePaths.length < 2 ||
        responsivePaths.some(
          (asset) => !/\.webp$/i.test(asset) || !internalTargetExists(asset),
        )
      ) {
        failures.push(
          `${relative}: image ${index + 1} violates priority, loading, intrinsic-size or responsive-WebP contract`,
        );
      }
    }

    const finalSection = sectionById(main, "show-them-who-you-are");
    const finalFigure = finalSection.match(/<figure\b([^>]*)>[\s\S]*?<\/figure>/i);
    const finalImage = finalFigure?.[0].match(/<img\b[^>]*>/i)?.[0] || "";
    if (
      !finalFigure ||
      !/aria-hidden=["']true["']/i.test(finalFigure[1]) ||
      htmlAttribute(finalImage, "src") !==
        "/uploads/business-team-meeting-richland-wa.jpg" ||
      !hasHtmlAttribute(finalImage, "alt") ||
      (htmlAttribute(finalImage, "alt") || "") !== ""
    ) {
      failures.push(
        `${relative}: final team image must remain decorative and hidden from accessibility APIs`,
      );
    }

    const schemas = parseJsonLd(source, relative);
    const articles = schemas.filter((schema) => schema?.["@type"] === "Article");
    const faqSchemas = schemas.filter((schema) => schema?.["@type"] === "FAQPage");
    const breadcrumbs = schemas.filter(
      (schema) => schema?.["@type"] === "BreadcrumbList",
    );
    const topLevelServices = schemas.filter(
      (schema) => schema?.["@type"] === "Service",
    );
    const schemaObjects = schemas.flatMap(nestedSchemaObjects);
    const unsafeSchema = schemaObjects.some((schema) =>
      ["Review", "AggregateRating", "GeoCoordinates"].includes(schema?.["@type"]) ||
      Object.keys(schema).some((key) =>
        ["streetaddress", "latitude", "longitude"].includes(key.toLowerCase()) ||
        key.toLowerCase().startsWith("gps"),
      ),
    );
    const article = articles[0];
    const articleAbout = Array.isArray(article?.about)
      ? article.about.map((item) => [item?.["@type"], item?.name])
      : [];
    const articleCities = Array.isArray(article?.spatialCoverage)
      ? article.spatialCoverage.map((item) => item?.name)
      : [];
    if (
      articles.length !== 1 ||
      faqSchemas.length !== 1 ||
      breadcrumbs.length !== 1 ||
      topLevelServices.length !== 0 ||
      unsafeSchema ||
      article?.["@id"] !== `${canonical}#webpage` ||
      article?.url !== canonical ||
      article?.name !== brandingHeadshotsContract.title ||
      article?.description !== brandingHeadshotsContract.description ||
      article?.headline !== brandingHeadshotsContract.title ||
      article?.author?.["@id"] !== `${expectedOrigin}/#lisa` ||
      article?.publisher?.["@id"] !== `${expectedOrigin}/#business` ||
      article?.datePublished !== "2026-08-11" ||
      article?.dateModified !== "2026-08-11" ||
      article?.image !==
        `${expectedOrigin}/uploads/branding-chef-kitchen-richland-wa.jpg` ||
      article?.primaryImageOfPage?.url !==
        `${expectedOrigin}/uploads/branding-chef-kitchen-richland-wa.jpg` ||
      article?.isPartOf?.["@id"] !== `${expectedOrigin}/#website` ||
      article?.mainEntityOfPage?.["@id"] !== canonical ||
      article?.inLanguage !== "en-US" ||
      JSON.stringify(articleAbout) !==
        JSON.stringify([
          ["Thing", "Branding photography"],
          ["Thing", "Professional headshots"],
          ["Place", "Tri-Cities, Washington"],
        ]) ||
      JSON.stringify(articleCities) !==
        JSON.stringify(["Richland", "Kennewick", "Pasco"]) ||
      article?.spatialCoverage?.[0]?.containedInPlace?.["@type"] !== "State" ||
      article?.spatialCoverage?.[0]?.containedInPlace?.name !== "Washington" ||
      ["duration", "timeRequired", "offers", "price"].some((key) =>
        Object.hasOwn(article || {}, key),
      )
    ) {
      failures.push(
        `${relative}: canonical Article/FAQ/Breadcrumb publication or claim-safety contract is invalid`,
      );
    }

    const faqEntities = faqSchemas[0]?.mainEntity || [];
    if (
      faqEntities.length !== 3 ||
      brandingHeadshotsContract.faq.some(
        (pair, index) =>
          faqEntities[index]?.["@type"] !== "Question" ||
          faqEntities[index]?.acceptedAnswer?.["@type"] !== "Answer" ||
          faqEntities[index]?.name !== pair.question ||
          faqEntities[index]?.acceptedAnswer?.text !== pair.answer ||
          visibleFaq[index]?.question !== pair.question ||
          visibleFaq[index]?.answer !== pair.answer,
      )
    ) {
      failures.push(
        `${relative}: FAQPage must map the three visible Common Questions 1:1`,
      );
    }

    const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
    const expectedBreadcrumbs = [
      { position: 1, name: "Home", item: `${expectedOrigin}/` },
      { position: 2, name: "Journal", item: `${expectedOrigin}/journal/` },
      {
        position: 3,
        name: "Branding Photos vs. Headshots",
        item: canonical,
      },
    ];
    if (
      breadcrumbItems.length !== 3 ||
      breadcrumbItems.some(
        (item, index) =>
          item?.["@type"] !== "ListItem" ||
          item?.position !== expectedBreadcrumbs[index].position ||
          item?.name !== expectedBreadcrumbs[index].name ||
          item?.item !== expectedBreadcrumbs[index].item,
      )
    ) {
      failures.push(
        `${relative}: BreadcrumbList must resolve Home, Journal and Branding Photos vs. Headshots`,
      );
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
      failures.push(`${relative}: internal body links differ from the approved three-link map`);
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
const journalHubManifestBlock = runtimeManifestSource.match(
  /\{\s*id:\s*"journal",[\s\S]*?\n\s*\},/,
)?.[0] || "";
if (
  !/contentStatus:\s*"ready"/.test(journalHubManifestBlock) ||
  !/searchVisibility:\s*"index"/.test(journalHubManifestBlock) ||
  !/schemaType:\s*"CollectionPage"/.test(journalHubManifestBlock) ||
  !/sitemap:\s*true/.test(journalHubManifestBlock) ||
  !/llms:\s*true/.test(journalHubManifestBlock) ||
  !/lastModified:\s*"2026-08-11"/.test(journalHubManifestBlock) ||
  !/title:\s*"Photography Journal \| Tips & Locations From Lisa"/.test(
    journalHubManifestBlock,
  )
) {
  failures.push(
    "page-manifest.ts: Journal hub must retain ready/index CollectionPage gates, exact title and 2026-08-11 lastModified",
  );
}
const reviewsManifestBlock = runtimeManifestSource.match(
  /\{\s*id:\s*"reviews",[\s\S]*?\n\s*\},/,
)?.[0] || "";
if (
  !/contentStatus:\s*"ready"/.test(reviewsManifestBlock) ||
  !/searchVisibility:\s*"index"/.test(reviewsManifestBlock) ||
  !/schemaType:\s*"WebPage"/.test(reviewsManifestBlock) ||
  !/sitemap:\s*true/.test(reviewsManifestBlock) ||
  !/llms:\s*true/.test(reviewsManifestBlock) ||
  !/signature:\s*"arch"/.test(reviewsManifestBlock) ||
  !/lastModified:\s*"2026-08-12"/.test(reviewsManifestBlock) ||
  !/title:\s*"Client Reviews \| It's A Keeper Photography"/.test(
    reviewsManifestBlock,
  )
) {
  failures.push(
    "page-manifest.ts: Reviews must retain ready/index WebPage gates, exact title and 2026-08-12 lastModified",
  );
}
const newbornComparisonManifestBlock = runtimeManifestSource.match(
  /\{\s*id:\s*"newborn-comparison",[\s\S]*?\n\s*\},/,
)?.[0] || "";
if (
  !/contentStatus:\s*"draft"/.test(newbornComparisonManifestBlock) ||
  !/searchVisibility:\s*"noindex"/.test(newbornComparisonManifestBlock) ||
  !/schemaType:\s*"Article"/.test(newbornComparisonManifestBlock) ||
  !/sitemap:\s*true/.test(newbornComparisonManifestBlock) ||
  !/llms:\s*true/.test(newbornComparisonManifestBlock) ||
  !/title:\s*"In-Home vs\. Studio Newborn Photography: How to Choose"/.test(
    newbornComparisonManifestBlock,
  ) ||
  /lastModified:/.test(newbornComparisonManifestBlock)
) {
  failures.push(
    "page-manifest.ts: Newborn Comparison must retain draft/noindex Article gates, exact title and no lastModified",
  );
}
const brandingHeadshotsManifestBlock = runtimeManifestSource.match(
  /\{\s*id:\s*"branding-vs-headshots",[\s\S]*?\n\s*\},/,
)?.[0] || "";
if (
  !/contentStatus:\s*"ready"/.test(brandingHeadshotsManifestBlock) ||
  !/searchVisibility:\s*"index"/.test(brandingHeadshotsManifestBlock) ||
  !/schemaType:\s*"Article"/.test(brandingHeadshotsManifestBlock) ||
  !/sitemap:\s*true/.test(brandingHeadshotsManifestBlock) ||
  !/llms:\s*true/.test(brandingHeadshotsManifestBlock) ||
  !/lastModified:\s*"2026-08-11"/.test(brandingHeadshotsManifestBlock) ||
  !/title:\s*"Branding Photos vs\. Headshots: What's the Difference\?"/.test(
    brandingHeadshotsManifestBlock,
  )
) {
  failures.push(
    "page-manifest.ts: Branding vs. Headshots must retain ready/index Article gates, exact title and 2026-08-11 lastModified",
  );
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
const seniorTimingPublicationPath =
  "/journal/when-to-book-senior-pictures-tri-cities/";
const newbornComparisonPublicationPath =
  "/journal/in-home-vs-studio-newborn-photography/";
for (const [label, publicationPath] of [
  ["Senior Timing article", seniorTimingPublicationPath],
  ["Newborn Comparison article", newbornComparisonPublicationPath],
]) {
  if (sitemap.includes(publicationPath) || llms.includes(publicationPath)) {
    failures.push(
      `${label}: draft route must remain excluded from sitemap.xml and llms.txt`,
    );
  }
}
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
    "https://www.itsakeeperphotography.com/reviews/",
    "https://www.itsakeeperphotography.com/contact/",
    "https://www.itsakeeperphotography.com/richland-wa-photographer/",
    "https://www.itsakeeperphotography.com/kennewick-wa-photographer/",
    "https://www.itsakeeperphotography.com/pasco-wa-photographer/",
    "https://www.itsakeeperphotography.com/journal/",
    "https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/",
    "https://www.itsakeeperphotography.com/journal/branding-photos-vs-headshots/",
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
  const reviewsSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/reviews\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-12<\/lastmod>/.test(reviewsSitemapEntry)) {
    failures.push("sitemap.xml: Reviews lastmod must be 2026-08-12");
  }
  const contactSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/contact\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-11<\/lastmod>/.test(contactSitemapEntry)) {
    failures.push("sitemap.xml: Contact lastmod must be 2026-08-11");
  }
  const journalHubSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/journal\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-11<\/lastmod>/.test(journalHubSitemapEntry)) {
    failures.push("sitemap.xml: Journal hub lastmod must be 2026-08-11");
  }
  const brandingHeadshotsSitemapEntry = sitemap.match(
    /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/www\.itsakeeperphotography\.com\/journal\/branding-photos-vs-headshots\/<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/,
  )?.[0] || "";
  if (!/<lastmod>2026-08-11<\/lastmod>/.test(brandingHeadshotsSitemapEntry)) {
    failures.push(
      "sitemap.xml: Branding vs. Headshots lastmod must be 2026-08-11",
    );
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
    "https://www.itsakeeperphotography.com/reviews/",
    "https://www.itsakeeperphotography.com/contact/",
    "https://www.itsakeeperphotography.com/richland-wa-photographer/",
    "https://www.itsakeeperphotography.com/kennewick-wa-photographer/",
    "https://www.itsakeeperphotography.com/pasco-wa-photographer/",
    "https://www.itsakeeperphotography.com/journal/",
    "https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/",
    "https://www.itsakeeperphotography.com/journal/branding-photos-vs-headshots/",
  ];
  if (JSON.stringify(llmsUrls) !== JSON.stringify(expectedLlmsUrls)) {
    failures.push(`llms.txt: release membership is ${llmsUrls.join(", ") || "empty"}`);
  }
  const expectedAboutLlmsLine =
    "- [Meet Lisa Weiss | Tri-Cities Photographer for 20 Years](https://www.itsakeeperphotography.com/about/): Meet Lisa Weiss, the Richland photographer behind It's A Keeper Photography, with twenty years behind the camera and fourteen years in business.";
  if (!llms.includes(expectedAboutLlmsLine)) {
    failures.push("llms.txt: About title or v2 summary differs from the manifest contract");
  }
  const expectedReviewsLlmsLine =
    "- [Client Reviews | It's A Keeper Photography](https://www.itsakeeperphotography.com/reviews/): Read verified client stories from Tri-Cities families, seniors, couples and business clients photographed by Lisa Weiss.";
  if (!llms.includes(expectedReviewsLlmsLine)) {
    failures.push("llms.txt: Reviews title or summary differs from the manifest contract");
  }
  const expectedContactLlmsLine =
    "- [Session Pricing Estimate | It's A Keeper Photography](https://www.itsakeeperphotography.com/contact/): Build a personalized photography session pricing estimate, then plan the details with Lisa.";
  if (!llms.includes(expectedContactLlmsLine)) {
    failures.push("llms.txt: Contact title or summary differs from the manifest contract");
  }
  const expectedJournalHubLlmsLine =
    "- [Photography Journal | Tips & Locations From Lisa](https://www.itsakeeperphotography.com/journal/): First-hand portrait planning advice from a Tri-Cities photographer.";
  if (!llms.includes(expectedJournalHubLlmsLine)) {
    failures.push("llms.txt: Journal hub title or summary differs from the manifest contract");
  }
  const expectedBrandingHeadshotsLlmsLine =
    "- [Branding Photos vs. Headshots: What's the Difference?](https://www.itsakeeperphotography.com/journal/branding-photos-vs-headshots/): A plain-English comparison of branding photos and professional headshots.";
  if (!llms.includes(expectedBrandingHeadshotsLlmsLine)) {
    failures.push(
      "llms.txt: Branding vs. Headshots title or summary differs from the manifest contract",
    );
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
    routeHeaderValues("/reviews/", "x-robots-tag")
      .some((value) => /(?:^|,)\s*noindex(?:\s*,|$)/i.test(value))
  ) {
    failures.push("_headers: Reviews noindex rule must not block the published trust page");
  }
  if (
    routeHeaderValues("/contact/", "x-robots-tag")
      .some((value) => /(?:^|,)\s*noindex(?:\s*,|$)/i.test(value))
  ) {
    failures.push("_headers: Contact noindex rule must not block the published estimate page");
  }
  if (
    routeHeaderValues("/journal/", "x-robots-tag")
      .some((value) => /(?:^|,)\s*noindex(?:\s*,|$)/i.test(value))
  ) {
    failures.push("_headers: Journal hub noindex rule must not block the published collection");
  }
  if (
    routeHeaderValues(
      "/journal/branding-photos-vs-headshots/",
      "x-robots-tag",
    ).some((value) => /(?:^|,)\s*noindex(?:\s*,|$)/i.test(value))
  ) {
    failures.push(
      "_headers: Branding vs. Headshots noindex rule must not block the published article",
    );
  }
  for (const route of [
    "/journal/when-to-book-senior-pictures-tri-cities/*",
    "/journal/in-home-vs-studio-newborn-photography/*",
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
