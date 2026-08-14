export const contentPageRoutes = {
  about: "/about/",
  branding: "/branding-photographer-tri-cities-wa/",
  contact: "/contact/",
  family: "/family-photographer-tri-cities-wa/",
  headshots: "/headshot-photographer-tri-cities-wa/",
  investment: "/investment/",
  journal: "/journal/",
  "journal-branding-vs-headshots": "/journal/branding-photos-vs-headshots/",
  "journal-family-locations": "/journal/family-photo-locations-tri-cities/",
  "journal-newborn-comparison": "/journal/in-home-vs-studio-newborn-photography/",
  "journal-senior-timing": "/journal/when-to-book-senior-pictures-tri-cities/",
  kennewick: "/kennewick-wa-photographer/",
  newborn: "/newborn-photographer-tri-cities-wa/",
  pasco: "/pasco-wa-photographer/",
  privacy: "/privacy/",
  reviews: "/reviews/",
  richland: "/richland-wa-photographer/",
  seniors: "/senior-photographer-tri-cities-wa/",
  "thank-you": "/thank-you/",
} as const;

export type ContentPageFilename = keyof typeof contentPageRoutes;

export const normalizeContentPageFilename = (filename: string) =>
  filename.replace(/\.json$/i, "").split("/").filter(Boolean).at(-1) || "";

export const resolveContentPageRoute = (filename: string) => {
  const normalized = normalizeContentPageFilename(filename);
  return contentPageRoutes[normalized as ContentPageFilename];
};
