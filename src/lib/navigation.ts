export const primaryNavigation = [
  { label: "Seniors", href: "/senior-photographer-tri-cities-wa/" },
  { label: "Families", href: "/family-photographer-tri-cities-wa/" },
  { label: "Newborns", href: "/newborn-photographer-tri-cities-wa/" },
  { label: "Branding", href: "/branding-photographer-tri-cities-wa/" },
  { label: "Headshots", href: "/headshot-photographer-tri-cities-wa/" },
  { label: "Journal", href: "/journal/" },
  { label: "About", href: "/about/" },
  { label: "Reviews", href: "/reviews/" },
  { label: "Inquire", href: "/contact/", button: true },
] as const;

export const footerNavigation = {
  services: primaryNavigation.slice(0, 5),
  explore: [
    { label: "About", href: "/about/" },
    { label: "Reviews", href: "/reviews/" },
    { label: "Investment", href: "/investment/" },
    { label: "Journal", href: "/journal/" },
    { label: "Contact", href: "/contact/" },
    { label: "Privacy", href: "/privacy/" },
  ],
  guides: [
    { label: "Family Photo Locations", href: "/journal/family-photo-locations-tri-cities/" },
    { label: "When to Take Senior Pictures", href: "/journal/when-to-book-senior-pictures-tri-cities/" },
    { label: "In-Home vs Studio Newborn", href: "/journal/in-home-vs-studio-newborn-photography/" },
    { label: "Branding Photos vs Headshots", href: "/journal/branding-photos-vs-headshots/" },
  ],
  places: [
    { label: "Richland", href: "/richland-wa-photographer/" },
    { label: "Kennewick", href: "/kennewick-wa-photographer/" },
    { label: "Pasco", href: "/pasco-wa-photographer/" },
  ],
} as const;

export const isCurrentRoute = (currentPath: string, href: string) => {
  const normalize = (value: string) =>
    value === "/" ? "/" : `/${value.replace(/^\/+|\/+$/g, "")}/`;
  const current = normalize(currentPath);
  const destination = normalize(href);
  if (destination === "/journal/") return current.startsWith("/journal/");
  return current === destination;
};
