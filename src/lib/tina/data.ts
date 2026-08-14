import { requestWithMetadata } from "@tinacms/astro/data";
import client from "../../../tina/__generated__/client";

export const getHomepagePage = () =>
  requestWithMetadata(
    client.queries.homepagePage({
      homepagePath: "index.json",
      settingsPath: "index.json",
      testimonialLimit: 50,
    }),
    { priority: "primary" }
  );

export const getContentPageTina = (pagePath: string) =>
  requestWithMetadata(
    (client.queries as any).contentPageSite({
      pagePath,
      homepagePath: "index.json",
      settingsPath: "index.json",
      testimonialLimit: 50,
      journalPageLimit: 6,
    }),
    { priority: "primary" }
  );
