import { defineConfig } from "tinacms";
import type { TinaField } from "tinacms";

/*
 * TinaCMS schema for It's A Keeper Photography.
 *
 * DESIGN LOCKDOWN: this schema exposes CONTENT ONLY — words and photos.
 * Colors, fonts, spacing and layout live in src/styles/styles.css and are
 * intentionally not editable here, so nothing the client changes can break
 * the design.
 */

// Runs on the branch Tina Cloud is connected to; falls back to main locally.
const branch =
  process.env.TINA_PUBLIC_BRANCH ||
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "main";

/** An image field plus its required alt-text companion. */
const imageWithAlt = (
  name: string,
  label: string,
  photoHint: string
): TinaField[] => [
  {
    type: "image",
    name,
    label,
    required: true,
    description: photoHint,
  },
  {
    type: "string",
    name: `${name}Alt`,
    label: `${label} — describe this photo`,
    required: true,
    description:
      "One short sentence describing what's in the photo, as if telling a friend on the phone (e.g. “A mom holding her baby in evening light”). This helps people who can't see the photo, and helps Google.",
    ui: { validate: maxChars(160) },
  },
];

/** Friendly max-length validator so long text can't break the layout. */
function maxChars(limit: number) {
  return (value?: string) => {
    if (value && value.length > limit) {
      return `Please keep this under ${limit} characters (currently ${value.length}).`;
    }
  };
}

const visibilityToggle: TinaField = {
  type: "boolean",
  name: "visible",
  label: "Show this section on the site",
  description: "Turn this off to temporarily hide the whole section.",
};

const pageLinkFields: TinaField[] = [
  { type: "string", name: "label", label: "Link text", required: true },
  { type: "string", name: "href", label: "Destination", required: true },
  { type: "boolean", name: "external", label: "External link" },
];

const pageItemFields: TinaField[] = [
  { type: "string", name: "eyebrow", label: "Small label" },
  { type: "string", name: "heading", label: "Heading" },
  { type: "string", name: "detail", label: "Small detail", ui: { component: "textarea" } },
  { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
  { type: "string", name: "quote", label: "Quotation", ui: { component: "textarea" } },
  { type: "string", name: "attribution", label: "Attribution" },
  { type: "image", name: "image", label: "Photograph" },
  { type: "string", name: "imageAlt", label: "Photograph description" },
  { type: "object", name: "links", label: "Links", list: true, fields: pageLinkFields },
];

const pageSectionFields: TinaField[] = [
  { type: "string", name: "id", label: "Section ID", required: true },
  {
    type: "string",
    name: "kind",
    label: "Composition",
    required: true,
    options: ["prose", "split", "steps", "faq", "quote", "reviews", "locations", "services", "comparison", "checklist", "article-list", "form"],
  },
  {
    type: "string",
    name: "tone",
    label: "Surface tone",
    required: true,
    options: ["umber", "walnut", "earth", "olive", "sand", "ivory"],
  },
  { type: "string", name: "eyebrow", label: "Small label" },
  { type: "string", name: "heading", label: "Heading" },
  { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
  { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
  { type: "object", name: "items", label: "Section entries", list: true, fields: pageItemFields },
  { type: "image", name: "image", label: "Primary photograph" },
  { type: "string", name: "imageAlt", label: "Primary photograph description" },
  { type: "image", name: "secondaryImage", label: "Overlapping photograph" },
  { type: "string", name: "secondaryImageAlt", label: "Overlapping photograph description" },
  { type: "string", name: "scriptLine", label: "Short handwritten phrase" },
  { type: "object", name: "links", label: "Links", list: true, fields: pageLinkFields },
];

export default defineConfig({
  branch,

  // Tina Cloud credentials. Leave unset for local editing — everything still
  // works, edits just save straight to the files on your computer.
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      /* ------------------------------------------------------------------ */
      /* Site settings (singleton)                                           */
      /* ------------------------------------------------------------------ */
      {
        name: "settings",
        label: "Business Info & Settings",
        path: "content/settings",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "string",
            name: "businessName",
            label: "Business name",
            required: true,
            ui: { validate: maxChars(60) },
          },
          ...imageWithAlt(
            "logo",
            "Logo",
            "Your logo image, shown in the header and footer."
          ),
          {
            type: "string",
            name: "footerTagline",
            label: "Short line under the logo in the footer",
            ui: { component: "textarea", validate: maxChars(140) },
          },
          {
            type: "string",
            name: "phone",
            label: "Phone number",
            required: true,
            description: "Shown exactly as you type it, e.g. (509) 948-7322.",
            ui: { validate: maxChars(20) },
          },
          {
            type: "string",
            name: "email",
            label: "Email address",
            required: true,
          },
          {
            type: "object",
            name: "address",
            label: "Legacy studio address (not published)",
            description: "Retained only for internal records. The public site displays Lisa's Richland service area, not a street address or map pin.",
            fields: [
              { type: "string", name: "street", label: "Street" },
              { type: "string", name: "city", label: "City" },
              { type: "string", name: "state", label: "State (2 letters)", ui: { validate: maxChars(2) } },
              { type: "string", name: "zip", label: "ZIP code", ui: { validate: maxChars(10) } },
            ],
          },
          {
            type: "string",
            name: "serviceAreas",
            label: "Cities you serve",
            list: true,
            description:
              "Shown in the footer, separated by dots (e.g. Richland · Kennewick · Pasco). 2 to 5 cities.",
            ui: {
              min: 2,
              max: 5,
            },
          },
          {
            type: "object",
            name: "social",
            label: "Social & Google links",
            fields: [
              { type: "string", name: "instagram", label: "Instagram page (full link)" },
              { type: "string", name: "facebook", label: "Facebook page (full link)" },
              {
                type: "string",
                name: "googleProfile",
                label: "Google reviews link",
                description: "Use Lisa's direct Google Business Profile review link only. Never paste a Maps search URL containing a street address.",
              },
            ],
          },
          ...imageWithAlt(
            "seoImage",
            "Sharing photo",
            "The photo shown when someone shares your site on Facebook, iMessage, etc. A wide horizontal photo works best."
          ),
          {
            type: "object",
            name: "advanced",
            label: "Search engine info (set up by your web team — safe to ignore)",
            fields: [
              {
                type: "string",
                name: "siteUrl",
                label: "Website address",
                description: "Leave as is unless the domain changes.",
              },
              {
                type: "string",
                name: "businessDescription",
                label: "Business description for Google",
                ui: { component: "textarea", validate: maxChars(300) },
              },
              { type: "string", name: "founderName", label: "Owner's name" },
              { type: "number", name: "latitude", label: "Map latitude" },
              { type: "number", name: "longitude", label: "Map longitude" },
              {
                type: "string",
                name: "services",
                label: "Services listed for Google",
                list: true,
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      /* Homepage (singleton)                                                */
      /* ------------------------------------------------------------------ */
      {
        name: "homepage",
        label: "Homepage",
        path: "content/homepage",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "object",
            name: "seo",
            label: "Google search listing",
            description: "How your page appears in Google search results.",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title in Google results",
                required: true,
                description:
                  "The blue headline in Google. Best kept under 60 characters so it doesn't get cut off.",
                ui: { validate: maxChars(70) },
              },
              {
                type: "string",
                name: "description",
                label: "Description in Google results",
                required: true,
                description:
                  "The grey text under the headline in Google. Best kept between 120 and 155 characters.",
                ui: { component: "textarea", validate: maxChars(165) },
              },
            ],
          },

          {
            type: "object",
            name: "hero",
            label: "Big photo at the top",
            fields: [
              visibilityToggle,
              ...imageWithAlt(
                "image",
                "Photo",
                "The large photo at the very top of the page. A wide horizontal photo works best."
              ),
              {
                type: "string",
                name: "heading",
                label: "Main headline",
                required: true,
                ui: { validate: maxChars(60) },
              },
              {
                type: "string",
                name: "scriptLine",
                label: "Handwritten-style line",
                required: true,
                description: "The short cursive line under the headline.",
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "subhead",
                label: "Introduction under the headline",
                ui: { component: "textarea", validate: maxChars(280) },
              },
              { type: "string", name: "primaryCtaLabel", label: "Primary button text" },
              { type: "string", name: "primaryCtaHref", label: "Primary button destination" },
              { type: "string", name: "secondaryCtaLabel", label: "Secondary button text" },
              { type: "string", name: "secondaryCtaHref", label: "Secondary button destination" },
              {
                type: "string",
                name: "trustBar",
                label: "Trust line",
                ui: { component: "textarea", validate: maxChars(180) },
              },
            ],
          },

          {
            type: "object",
            name: "why",
            label: "“A session with Lisa” — your promise",
            fields: [
              visibilityToggle,
              {
                type: "string",
                name: "eyebrow",
                label: "Small label above the heading",
                required: true,
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "headingLine1",
                label: "Heading — first line",
                required: true,
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "headingLine2",
                label: "Heading — second line",
                ui: { validate: maxChars(30) },
              },
              {
                type: "string",
                name: "paragraph",
                label: "Paragraph",
                required: true,
                ui: { component: "textarea", validate: maxChars(320) },
              },
              {
                type: "string",
                name: "reassurance",
                label: "Reassurance paragraph",
                ui: { component: "textarea", validate: maxChars(520) },
              },
              {
                type: "string",
                name: "buttonLabel",
                label: "Button text",
                required: true,
                ui: { validate: maxChars(25) },
              },
              {
                type: "string",
                name: "scriptLine",
                label: "Handwritten-style line next to the photos",
                ui: { validate: maxChars(35) },
              },
              ...imageWithAlt(
                "rearImage",
                "Back photo",
                "The arched photo that sits behind. A vertical photo works best."
              ),
              ...imageWithAlt(
                "frontImage",
                "Front photo",
                "The photo that overlaps in front. A vertical photo works best."
              ),
            ],
          },

          {
            type: "object",
            name: "sessions",
            label: "Session types (the four photo cards)",
            fields: [
              visibilityToggle,
              {
                type: "string",
                name: "eyebrow",
                label: "Small label above the heading",
                required: true,
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "heading",
                label: "Heading",
                required: true,
                ui: { validate: maxChars(45) },
              },
              {
                type: "string",
                name: "intro",
                label: "Short introduction",
                ui: { component: "textarea", validate: maxChars(180) },
              },
              {
                type: "object",
                name: "cards",
                label: "Cards",
                list: true,
                ui: {
                  min: 3,
                  max: 5,
                  itemProps: (item?: { label?: string }) => ({
                    label: item?.label || "New card",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Name on the card (also appears in the top menu)",
                    required: true,
                    ui: { validate: maxChars(20) },
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Photo",
                    description: "A vertical photo works best. Leave empty until Lisa supplies and approves the matching service photograph.",
                  },
                  { type: "string", name: "imageAlt", label: "Describe this photo" },
                  {
                    type: "string",
                    name: "link",
                    label: "Where the card goes",
                    description:
                      "Leave as #inquire so the card opens the planner. Your web team can change this if needed.",
                  },
                  {
                    type: "string",
                    name: "prefill",
                    label: "Planner choice to pre-select",
                    description:
                      "When someone clicks this card, the planner opens with this session type already chosen. Must match one of the choices in the planner's first question exactly (e.g. Senior, Family, Couple, Newborn).",
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Short service description",
                    ui: { component: "textarea", validate: maxChars(240) },
                  },
                ],
              },
            ],
          },

          {
            type: "object",
            name: "photoBreak",
            label: "Wide photo with a cursive phrase",
            fields: [
              visibilityToggle,
              ...imageWithAlt(
                "image",
                "Photo",
                "The full-width photo between sections. A wide horizontal photo works best."
              ),
              {
                type: "string",
                name: "scriptPhrase",
                label: "Cursive phrase on the photo",
                required: true,
                ui: { validate: maxChars(45) },
              },
              {
                type: "string",
                name: "srHeading",
                label: "Hidden title for screen readers",
                description:
                  "Not shown on screen — read aloud by screen readers and seen by Google. A plain description of the photo section.",
                ui: { validate: maxChars(80) },
              },
              { type: "string", name: "heading", label: "Visible heading" },
              { type: "string", name: "paragraph", label: "Local introduction", ui: { component: "textarea" } },
              { type: "string", name: "buttonLabel", label: "Guide link text" },
              { type: "string", name: "buttonHref", label: "Guide link destination" },
            ],
          },

          {
            type: "object",
            name: "meetLisa",
            label: "Meet Lisa — your story",
            fields: [
              visibilityToggle,
              {
                type: "string",
                name: "eyebrow",
                label: "Small label above the heading",
                required: true,
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "headingLine1",
                label: "Heading — first line",
                required: true,
                ui: { validate: maxChars(30) },
              },
              {
                type: "string",
                name: "headingLine2",
                label: "Heading — second line",
                ui: { validate: maxChars(30) },
              },
              {
                type: "string",
                name: "story",
                label: "Your story",
                required: true,
                ui: { component: "textarea", validate: maxChars(400) },
              },
              {
                type: "string",
                name: "credit",
                label: "Second paragraph (highlights)",
                ui: { component: "textarea", validate: maxChars(400) },
              },
              ...imageWithAlt(
                "portrait",
                "Your portrait",
                "A vertical photo of you works best."
              ),
            ],
          },

          {
            type: "object",
            name: "howItWorks",
            label: "How a session works (the four steps)",
            fields: [
              visibilityToggle,
              {
                type: "string",
                name: "eyebrow",
                label: "Small label above the heading",
                required: true,
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "heading",
                label: "Heading",
                required: true,
                ui: { validate: maxChars(45) },
              },
              {
                type: "string",
                name: "intro",
                label: "Short intro sentence",
                ui: { component: "textarea", validate: maxChars(160) },
              },
              {
                type: "object",
                name: "steps",
                label: "The four steps",
                list: true,
                description: "The design fits exactly four steps.",
                ui: {
                  min: 4,
                  max: 4,
                  itemProps: (item?: { title?: string }) => ({
                    label: item?.title || "New step",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Step title",
                    required: true,
                    ui: { validate: maxChars(25) },
                  },
                  {
                    type: "string",
                    name: "sentence",
                    label: "One sentence about this step",
                    required: true,
                    ui: { component: "textarea", validate: maxChars(160) },
                  },
                ],
              },
              { type: "string", name: "buttonLabel", label: "Experience link text" },
              { type: "string", name: "buttonHref", label: "Experience link destination" },
            ],
          },

          {
            type: "object",
            name: "kindWords",
            label: "Kind words (reviews section)",
            description:
              "The quotes themselves live under “Kind Words (Testimonials)” in the menu on the left.",
            fields: [
              visibilityToggle,
              {
                type: "string",
                name: "eyebrow",
                label: "Small label above the heading",
                required: true,
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "heading",
                label: "Heading",
                required: true,
                ui: { validate: maxChars(45) },
              },
              {
                type: "string",
                name: "reviewsLine",
                label: "Google reviews line",
                description: "Fallback link text only. The published homepage replaces it with the current Google review count from the daily GBP sync.",
                ui: { validate: maxChars(60) },
              },
              { type: "string", name: "buttonHref", label: "Reviews page destination" },
            ],
          },

          {
            type: "object",
            name: "faq",
            label: "Questions families ask",
            fields: [
              visibilityToggle,
              { type: "string", name: "eyebrow", label: "Small label" },
              { type: "string", name: "heading", label: "Heading", required: true },
              {
                type: "object",
                name: "items",
                label: "Questions and answers",
                list: true,
                fields: [
                  { type: "string", name: "question", label: "Question", required: true },
                  { type: "string", name: "answer", label: "Answer", required: true, ui: { component: "textarea" } },
                ],
              },
            ],
          },

          {
            type: "object",
            name: "inquiry",
            label: "“Plan your golden hour” — the planner",
            fields: [
              visibilityToggle,
              {
                type: "string",
                name: "eyebrow",
                label: "Small label above the heading",
                required: true,
                ui: { validate: maxChars(35) },
              },
              {
                type: "string",
                name: "heading",
                label: "Big invitation heading",
                required: true,
                ui: { validate: maxChars(45) },
              },
              {
                type: "string",
                name: "scriptLine",
                label: "Handwritten-style line",
                ui: { validate: maxChars(45) },
              },
              {
                type: "string",
                name: "supportLine",
                label: "Reassuring sentence under the heading",
                ui: { component: "textarea", validate: maxChars(140) },
              },
              {
                type: "string",
                name: "buttonLabel",
                label: "Start button text",
                required: true,
                ui: { validate: maxChars(25) },
              },
              ...imageWithAlt(
                "backgroundImage",
                "Background photo",
                "The photo behind the invitation. A wide horizontal photo works best."
              ),
              {
                type: "object",
                name: "stepSession",
                label: "Question 1 — session type",
                fields: [
                  {
                    type: "string",
                    name: "question",
                    label: "Question",
                    required: true,
                    ui: { validate: maxChars(60) },
                  },
                  {
                    type: "object",
                    name: "options",
                    label: "Photo choices",
                    list: true,
                    description: "The design fits exactly five choices.",
                    ui: {
                      min: 5,
                      max: 5,
                      itemProps: (item?: { label?: string }) => ({
                        label: item?.label || "New choice",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "label",
                        label: "Choice name",
                        required: true,
                        ui: { validate: maxChars(20) },
                      },
                      {
                        type: "image",
                        name: "image",
                        label: "Photo",
                        required: true,
                        description: "A small photo shown on the choice card.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "stepSeason",
                label: "Question 2 — season",
                fields: [
                  {
                    type: "string",
                    name: "question",
                    label: "Question",
                    required: true,
                    ui: { validate: maxChars(60) },
                  },
                  {
                    type: "string",
                    name: "note",
                    label: "Note under the choices",
                    ui: { component: "textarea", validate: maxChars(140) },
                  },
                  {
                    type: "object",
                    name: "options",
                    label: "Photo choices",
                    list: true,
                    description: "The design fits exactly five choices.",
                    ui: {
                      min: 5,
                      max: 5,
                      itemProps: (item?: { label?: string }) => ({
                        label: item?.label || "New choice",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "label",
                        label: "Choice name",
                        required: true,
                        ui: { validate: maxChars(20) },
                      },
                      {
                        type: "image",
                        name: "image",
                        label: "Photo",
                        required: true,
                        description: "A small photo shown on the choice card.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "stepLocation",
                label: "Question 3 — location",
                fields: [
                  {
                    type: "string",
                    name: "question",
                    label: "Question",
                    required: true,
                    ui: { validate: maxChars(60) },
                  },
                  {
                    type: "object",
                    name: "options",
                    label: "Choices",
                    list: true,
                    description: "The design fits exactly three choices.",
                    ui: {
                      min: 3,
                      max: 3,
                      itemProps: (item?: { title?: string }) => ({
                        label: item?.title || "New choice",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "Choice title",
                        required: true,
                        ui: { validate: maxChars(40) },
                      },
                      {
                        type: "string",
                        name: "detail",
                        label: "Small line under the title",
                        required: true,
                        ui: { validate: maxChars(70) },
                      },
                      {
                        type: "string",
                        name: "value",
                        label: "What Lisa sees in the inquiry",
                        description:
                          "The wording saved with the inquiry. Usually the same as the title.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "stepStory",
                label: "Question 4 — their story",
                fields: [
                  {
                    type: "string",
                    name: "question",
                    label: "Question",
                    required: true,
                    ui: { validate: maxChars(60) },
                  },
                  {
                    type: "string",
                    name: "fieldLabel",
                    label: "Prompt above the text box",
                    required: true,
                    ui: { component: "textarea", validate: maxChars(120) },
                  },
                  {
                    type: "string",
                    name: "placeholder",
                    label: "Grey hint text inside the box",
                    ui: { component: "textarea", validate: maxChars(120) },
                  },
                ],
              },
              {
                type: "object",
                name: "stepContact",
                label: "Question 5 — contact details",
                fields: [
                  {
                    type: "string",
                    name: "question",
                    label: "Question",
                    required: true,
                    ui: { validate: maxChars(60) },
                  },
                  {
                    type: "string",
                    name: "privacyNote",
                    label: "Reassuring note under the fields",
                    ui: { component: "textarea", validate: maxChars(140) },
                  },
                ],
              },
              {
                type: "object",
                name: "confirmation",
                label: "Thank-you message (after sending)",
                fields: [
                  {
                    type: "string",
                    name: "scriptLine",
                    label: "Handwritten-style line",
                    ui: { validate: maxChars(30) },
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Heading",
                    required: true,
                    ui: { validate: maxChars(45) },
                  },
                  {
                    type: "string",
                    name: "message",
                    label: "Message",
                    required: true,
                    description:
                      "Your phone number is added automatically after this message.",
                    ui: { component: "textarea", validate: maxChars(260) },
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Photo next to the message",
                    required: true,
                    description: "A vertical photo works best.",
                  },
                ],
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      /* Search-facing and utility pages                                     */
      /* ------------------------------------------------------------------ */
      {
        name: "contentPage",
        label: "Site Pages",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) => document.route || "/",
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "route", label: "Route", required: true },
          {
            type: "string",
            name: "family",
            label: "Page family",
            required: true,
            options: ["service", "trust", "city", "journal-hub", "article", "utility"],
          },
          {
            type: "string",
            name: "contentStatus",
            label: "Publication readiness",
            required: true,
            options: ["draft", "ready"],
            description: "Only change to ready after facts, media, links and QA have all been approved.",
          },
          {
            type: "string",
            name: "searchVisibility",
            label: "Search visibility",
            required: true,
            options: ["index", "noindex"],
          },
          {
            type: "string",
            name: "schemaType",
            label: "Structured data type",
            required: true,
            options: ["WebPage", "Service", "AboutPage", "ContactPage", "CollectionPage", "Article"],
          },
          {
            type: "string",
            name: "signature",
            label: "Signature composition device",
            required: true,
            options: ["arch", "overlap", "crossing-line"],
          },
          { type: "string", name: "title", label: "Search title", required: true },
          { type: "string", name: "description", label: "Search description", required: true, ui: { component: "textarea" } },
          {
            type: "object",
            name: "hero",
            label: "Page opening",
            required: true,
            fields: [
              {
                type: "string",
                name: "tone",
                label: "Opening tone",
                required: true,
                options: ["umber", "walnut", "earth", "olive", "sand", "ivory"],
              },
              { type: "string", name: "eyebrow", label: "Small label" },
              { type: "string", name: "heading", label: "Main heading", required: true },
              { type: "string", name: "intro", label: "Introduction", ui: { component: "textarea" } },
              { type: "string", name: "scriptLine", label: "Short handwritten phrase" },
              { type: "image", name: "image", label: "Primary photograph" },
              { type: "string", name: "imageAlt", label: "Primary photograph description" },
              { type: "image", name: "secondaryImage", label: "Overlapping photograph" },
              { type: "string", name: "secondaryImageAlt", label: "Overlapping photograph description" },
              { type: "object", name: "links", label: "Opening links", list: true, fields: pageLinkFields },
            ],
          },
          { type: "object", name: "sections", label: "Page sections", list: true, fields: pageSectionFields },
          {
            type: "object",
            name: "finalCta",
            label: "Final invitation",
            fields: [
              {
                type: "string",
                name: "tone",
                label: "Surface tone",
                required: true,
                options: ["umber", "walnut", "earth", "olive", "sand", "ivory"],
              },
              { type: "string", name: "eyebrow", label: "Small label" },
              { type: "string", name: "heading", label: "Heading", required: true },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Background photograph" },
              { type: "string", name: "imageAlt", label: "Background photograph description" },
              { type: "object", name: "link", label: "Final link", fields: pageLinkFields },
            ],
          },
          {
            type: "string",
            name: "pending",
            label: "Unresolved facts and media",
            list: true,
            description: "Never render these notes. Resolve them before changing this page to ready.",
            ui: { component: "textarea" },
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      /* Journal portfolio pages                                             */
      /* ------------------------------------------------------------------ */
      {
        name: "journalPage",
        label: "Journal Pages",
        path: "content/journal-pages",
        format: "json",
        indexes: [
          {
            name: "order",
            fields: [{ name: "order" }],
          },
        ],
        ui: {
          router: () => "/portfolio/",
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "number",
            name: "order",
            label: "Page order",
            required: true,
            description:
              "Controls where this page appears in the journal. Use each number once.",
            ui: {
              validate: (value?: number) => {
                if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > 6) {
                  return "Use a whole number from 1 through 6.";
                }
              },
            },
          },
          {
            type: "string",
            name: "title",
            label: "Page title (optional)",
            description: "A short handwritten-style heading for this page.",
            ui: { validate: maxChars(40) },
          },
          {
            type: "string",
            name: "tapeStyle",
            label: "Tape preset",
            required: true,
            description:
              "Choose one of the approved tape treatments. The colors and styling stay locked to the site design.",
            options: [
              { label: "Soft sage", value: "sage" },
              { label: "Warm oatmeal", value: "oatmeal" },
              { label: "Natural sand", value: "sand" },
            ],
            ui: { component: "select" },
          },
          {
            type: "string",
            name: "layout",
            label: "Photo layout preset",
            required: true,
            description:
              "Choose an approved arrangement. Photo positions, spacing and decoration are handled automatically.",
            options: [
              { label: "Feature photo + note", value: "hero-note" },
              { label: "Offset pair", value: "offset-pair" },
              { label: "Story grid", value: "story-grid" },
              { label: "Tall stack", value: "tall-stack" },
            ],
            ui: { component: "select" },
          },
          {
            type: "object",
            name: "photos",
            label: "Photos",
            list: true,
            required: true,
            description: "Add between two and four photographs to this page.",
            ui: {
              min: 2,
              max: 4,
              itemProps: (item?: { caption?: string; alt?: string }) => ({
                label: item?.caption || item?.alt || "New photo",
              }),
            },
            fields: [
              {
                type: "image",
                name: "image",
                label: "Photo",
                required: true,
              },
              {
                type: "string",
                name: "alt",
                label: "Describe this photo",
                required: true,
                description:
                  "One specific sentence describing the people, setting and moment for visitors who cannot see the image.",
                ui: { validate: maxChars(160) },
              },
              {
                type: "string",
                name: "caption",
                label: "Caption (optional)",
                ui: { validate: maxChars(60) },
              },
              {
                type: "datetime",
                name: "date",
                label: "Date (optional)",
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      /* Testimonials                                                        */
      /* ------------------------------------------------------------------ */
      {
        name: "testimonial",
        label: "Kind Words (Testimonials)",
        path: "content/testimonials",
        format: "json",
        indexes: [
          {
            name: "order",
            fields: [{ name: "order" }],
          },
        ],
        ui: {
          itemProps: (item?: { name?: string; sessionType?: string }) => ({
            label: [item?.name, item?.sessionType].filter(Boolean).join(" · ") || "New kind word",
          }),
        },
        fields: [
          {
            type: "number",
            name: "order",
            label: "Display order",
            required: true,
            description: "Controls the order of the review photographs on the homepage.",
            ui: {
              validate: (value?: number) => {
                if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > 6) {
                  return "Use a whole number from 1 through 6.";
                }
              },
            },
          },
          {
            type: "string",
            name: "quote",
            label: "The quote",
            required: true,
            description: "The client's words, preserved exactly as supplied.",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "name",
            label: "Who said it",
            description: "Leave empty when the client's name has not been supplied.",
            ui: { validate: maxChars(40) },
          },
          {
            type: "string",
            name: "sessionType",
            label: "Session type or theme",
            required: true,
            description: "Shown after the name, e.g. “senior session” or “patience”.",
            ui: { validate: maxChars(30) },
          },
          {
            type: "image",
            name: "image",
            label: "Session photograph",
            required: true,
          },
          {
            type: "string",
            name: "imageAlt",
            label: "Session photograph description",
            required: true,
            ui: { validate: maxChars(160) },
          },
          {
            type: "boolean",
            name: "featured",
            label: "Show on the homepage",
            description:
              "The homepage shows the first six kind words that have this turned on.",
          },
        ],
      },
    ],
  },
});
