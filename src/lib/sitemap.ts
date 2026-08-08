import type { PageManifestEntry } from "../content/page-types";
import { normalizePath } from "./site-environment";

export interface SitemapEntry {
  loc: string;
  lastmod: string;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const isRealIsoDate = (value: string) => {
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
};

export const isSitemapCandidate = (entry: PageManifestEntry) =>
  entry.contentStatus === "ready" &&
  entry.searchVisibility === "index" &&
  entry.sitemap;

export const createSitemapEntries = (
  manifest: readonly PageManifestEntry[],
  origin: string
): SitemapEntry[] => {
  const base = new URL(`${origin.replace(/\/$/, "")}/`);
  if (base.protocol !== "https:") {
    throw new Error(`Sitemap origin must use HTTPS; received ${base.origin}.`);
  }

  const seen = new Set<string>();

  return manifest.filter(isSitemapCandidate).map((entry) => {
    if (!entry.lastModified || !isRealIsoDate(entry.lastModified)) {
      throw new Error(
        `Indexable route ${entry.path} needs a valid YYYY-MM-DD lastModified value.`
      );
    }

    const loc = new URL(normalizePath(entry.path), base).toString();
    if (seen.has(loc)) {
      throw new Error(`Duplicate canonical URL in sitemap manifest: ${loc}`);
    }
    seen.add(loc);

    return { loc, lastmod: entry.lastModified };
  });
};

export const serializeSitemap = (entries: readonly SitemapEntry[]) => {
  const urls = entries
    .map(
      ({ loc, lastmod }) =>
        [
          "  <url>",
          `    <loc>${escapeXml(loc)}</loc>`,
          `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
          "  </url>",
        ].join("\n")
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
};
