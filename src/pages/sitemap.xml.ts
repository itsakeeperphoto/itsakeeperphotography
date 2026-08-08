import type { APIRoute } from "astro";
import { pageManifest } from "../lib/page-manifest";
import { isRelease, siteOrigin } from "../lib/site-environment";
import { createSitemapEntries, serializeSitemap } from "../lib/sitemap";

export const prerender = true;

export const GET: APIRoute = () => {
  const entries = isRelease ? createSitemapEntries(pageManifest, siteOrigin) : [];
  const body = serializeSitemap(entries);

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": isRelease
        ? "public, max-age=0, s-maxage=3600"
        : "no-store",
    },
  });
};
