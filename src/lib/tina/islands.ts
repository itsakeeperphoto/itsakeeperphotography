import type { QueryResult } from "@tinacms/astro/data";
import type { IslandRegistry } from "@tinacms/astro/experimental";
import HomepagePage from "../../components/HomepagePage.astro";
import EditorialPageRouter from "../../components/pages/EditorialPageRouter.astro";
import { editorialManifest } from "../page-manifest";
import { getContentPageTina, getHomepagePage } from "./data";
import { contentPageWrapper, homepageWrapper } from "./wrappers";

const normalizeContentPageLists = (page: Record<string, any> | undefined) => {
  if (!page) return page;

  page.pending ??= [];
  page.sections ??= [];
  if (page.hero) page.hero.links ??= [];
  if (page.finalCta) page.finalCta.paragraphs ??= [];

  for (const section of page.sections) {
    if (!section) continue;
    section.paragraphs ??= [];
    section.items ??= [];
    section.links ??= [];

    for (const item of section.items) {
      if (!item) continue;
      item.paragraphs ??= [];
      item.links ??= [];
    }
  }

  return page;
};

export const islands: IslandRegistry = {
  homepage: {
    fetch: () => getHomepagePage(),
    component: HomepagePage,
    wrapper: homepageWrapper,
    propsFromData: (result) => ({
      data: (result as QueryResult<Record<string, unknown>>).data,
    }),
  },
  contentPage: {
    fetch: (_request, params) => {
      const pagePath = params.get("path") || "";
      if (!editorialManifest.some((entry) => entry.contentPath === pagePath)) {
        return Promise.reject(new Error("Unknown content page path."));
      }
      return getContentPageTina(pagePath);
    },
    component: EditorialPageRouter,
    wrapper: contentPageWrapper,
    propsFromData: (result) => {
      const data = (result as QueryResult<Record<string, any>>).data;
      const page = normalizeContentPageLists(data.contentPage);
      const testimonials = (data.testimonialConnection?.edges || [])
        .map((edge: any) => edge?.node)
        .filter(Boolean)
        .filter((testimonial: any) => testimonial.featured)
        .sort((left: any, right: any) => (left.order ?? 0) - (right.order ?? 0))
        .slice(0, 10);
      const journalPages = (data.journalPageConnection?.edges || [])
        .map((edge: any) => edge?.node)
        .filter(Boolean);
      return {
        page,
        settings: data.settings,
        inquiry: data.homepage?.inquiry,
        kindWords: data.homepage?.kindWords,
        testimonials,
        journalPages,
      };
    },
  },
};
