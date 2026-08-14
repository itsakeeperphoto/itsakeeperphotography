export type PageFamily =
  | "service"
  | "trust"
  | "city"
  | "journal-hub"
  | "article"
  | "utility";

export type ContentStatus = "draft" | "ready";
export type SearchVisibility = "index" | "noindex";
export type SchemaType =
  | "WebPage"
  | "Service"
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage"
  | "Article";

export type SurfaceTone = "umber" | "walnut" | "earth" | "olive" | "sand" | "ivory";
export type SignatureDevice = "arch" | "overlap" | "crossing-line";
export type SectionKind =
  | "prose"
  | "split"
  | "steps"
  | "faq"
  | "quote"
  | "reviews"
  | "locations"
  | "services"
  | "comparison"
  | "checklist"
  | "article-list"
  | "form";

/** Tina adds this source pointer only while a document is open in visual editing. */
export interface TinaEditableSource {
  _content_source?: {
    queryId: string;
    path: Array<string | number>;
  };
}

export interface PageLink extends TinaEditableSource {
  label: string;
  href: string;
  external?: boolean;
}

export interface PageItem extends TinaEditableSource {
  eyebrow?: string;
  heading?: string;
  detail?: string;
  paragraphs?: string[];
  quote?: string;
  attribution?: string;
  image?: string;
  imageAlt?: string;
  links?: PageLink[];
}

export interface PageSection extends TinaEditableSource {
  id: string;
  kind: SectionKind;
  tone: SurfaceTone;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  paragraphs?: string[];
  items?: PageItem[];
  image?: string;
  imageAlt?: string;
  secondaryImage?: string;
  secondaryImageAlt?: string;
  scriptLine?: string;
  links?: PageLink[];
}

export interface EditorialPageData extends TinaEditableSource {
  route: `/${string}`;
  family: PageFamily;
  contentStatus: ContentStatus;
  searchVisibility: SearchVisibility;
  schemaType: SchemaType;
  signature: SignatureDevice;
  title: string;
  description: string;
  hero: TinaEditableSource & {
    tone: SurfaceTone;
    eyebrow?: string;
    heading: string;
    intro?: string;
    scriptLine?: string;
    image?: string;
    imageAlt?: string;
    secondaryImage?: string;
    secondaryImageAlt?: string;
    links?: PageLink[];
  };
  sections: PageSection[];
  finalCta?: TinaEditableSource & {
    tone: SurfaceTone;
    eyebrow?: string;
    heading: string;
    paragraphs?: string[];
    image?: string;
    imageAlt?: string;
    link?: PageLink;
  };
  pending: string[];
}

export interface PageManifestEntry {
  id: string;
  path: `/${string}`;
  contentPath?: string;
  family: PageFamily | "home";
  contentStatus: ContentStatus;
  searchVisibility: SearchVisibility;
  schemaType: SchemaType;
  sitemap: boolean;
  llms: boolean;
  /**
   * Date of the most recent substantial change to the published page.
   * Required by the sitemap generator whenever a route becomes indexable.
   */
  lastModified?: `${number}-${number}-${number}`;
  primaryRoute: boolean;
  signature: SignatureDevice;
  title: string;
  summary: string;
}
