import type { QueryResult } from "@tinacms/astro/data";
import type { IslandRegistry } from "@tinacms/astro/experimental";
import HomepagePage from "../../components/HomepagePage.astro";
import EditorialPageRouter from "../../components/pages/EditorialPageRouter.astro";
import { editorialManifest } from "../page-manifest";
import { getContentPageTina, getHomepagePage } from "./data";
import { contentPageWrapper, homepageWrapper } from "./wrappers";

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
        page: data.contentPage,
        settings: data.settings,
        inquiry: data.homepage?.inquiry,
        kindWords: data.homepage?.kindWords,
        testimonials,
        journalPages,
      };
    },
  },
};
