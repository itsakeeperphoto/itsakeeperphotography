import type { Config } from "@netlify/functions";
import { readCachedReviewSummary } from "../lib/gbp-review-summary";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

const noStoreHeaders = {
  ...JSON_HEADERS,
  "Cache-Control": "private, no-store",
};

const jsonResponse = (
  request: Request,
  value: Record<string, unknown>,
  init: { status: number; headers: Record<string, string> }
) =>
  new Response(request.method === "HEAD" ? null : JSON.stringify(value), {
    ...init,
    headers: { ...JSON_HEADERS, ...init.headers },
  });

export default async (request: Request) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return jsonResponse(
      request,
      { error: "Method not allowed" },
      {
        status: 405,
        headers: { ...noStoreHeaders, Allow: "GET, HEAD" },
      }
    );
  }

  try {
    const summary = await readCachedReviewSummary();
    if (!summary) {
      return jsonResponse(
        request,
        { available: false },
        { status: 404, headers: noStoreHeaders }
      );
    }

    const body = JSON.stringify({
      totalReviewCount: summary.totalReviewCount,
      averageRating: summary.averageRating,
      fetchedAt: summary.fetchedAt,
    });
    const headers = {
      ...JSON_HEADERS,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      "Netlify-CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    };

    return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
  } catch {
    console.error("Google Business Profile review summary cache is unavailable.");
    return jsonResponse(
      request,
      { available: false },
      { status: 503, headers: noStoreHeaders }
    );
  }
};

export const config: Config = {
  path: "/api/google-review-summary",
};
