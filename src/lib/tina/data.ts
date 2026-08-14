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

export const getContentPageTina = (pagePath: string) => {
  if (pagePath === "reviews.json") {
    return requestWithMetadata(
      client.queries.contentPageSite({
        pagePath,
        homepagePath: "index.json",
        settingsPath: "index.json",
        testimonialLimit: 50,
        journalPageLimit: 6,
      }),
      { priority: "primary" },
    );
  }

  if (pagePath === "contact.json") {
    return requestWithMetadata(
      client.queries.contentPageContact({
        pagePath,
        settingsPath: "index.json",
      }),
      { priority: "primary" },
    );
  }

  return requestWithMetadata(
    client.queries.contentPageBasic({ pagePath }),
    { priority: "primary" },
  );
};
