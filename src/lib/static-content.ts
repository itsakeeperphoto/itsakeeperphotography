import homepage from "../../content/homepage/index.json";
import settings from "../../content/settings/index.json";

const testimonialModules = import.meta.glob<{ default: Record<string, unknown> }>(
  "../../content/testimonials/*.json",
  { eager: true }
);

const journalModules = import.meta.glob<{ default: Record<string, unknown> }>(
  "../../content/journal-pages/*.json",
  { eager: true }
);

const nodes = (modules: Record<string, { default: Record<string, unknown> }>) =>
  Object.entries(modules)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([relativePath, module]) => ({
      node: {
        ...module.default,
        _sys: { relativePath: relativePath.split("/").at(-1) },
      },
    }));

export const getStaticHomepagePage = () => ({
  data: {
    homepage,
    settings,
    testimonialConnection: { edges: nodes(testimonialModules) },
  },
});

export const getStaticReviewsPage = () => ({
  data: {
    homepage,
    settings,
    testimonialConnection: { edges: nodes(testimonialModules) },
    journalPageConnection: { edges: nodes(journalModules) },
  },
});
