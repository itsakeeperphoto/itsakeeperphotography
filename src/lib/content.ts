import settingsJson from "../../content/settings/index.json";
import homepageJson from "../../content/homepage/index.json";

export const settings = settingsJson;
export const homepage = homepageJson;

export interface Testimonial {
  quote: string;
  name?: string;
  sessionType: string;
  order: number;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

const testimonialModules = import.meta.glob<{ default: Testimonial }>(
  "../../content/testimonials/*.json",
  { eager: true }
);

export const testimonials: Testimonial[] = Object.keys(testimonialModules)
  .sort()
  .map((key) => testimonialModules[key].default)
  .sort((a, b) => a.order - b.order);

/** The homepage review rail shows at most six featured client stories. */
export const featuredTestimonials = testimonials
  .filter((t) => t.featured)
  .slice(0, 6);

/** "(509) 948-7322" -> "+15099487322" for tel: links. */
export function telHref(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

/** "#anchor" ids derived from card labels so nav links and cards stay in sync. */
export function slugify(label: string): string {
  return (label || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Label used for each service offer in the LocalBusiness JSON-LD
 * (kept as in the original hand-written schema). Change per client.
 */
export const OFFER_AREA_SERVED = "Tri-Cities, Washington";
