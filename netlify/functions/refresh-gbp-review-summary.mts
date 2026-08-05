import type { Config } from "@netlify/functions";
import {
  fetchGbpReviewSummary,
  writeCachedReviewSummary,
} from "../lib/gbp-review-summary";

export default async () => {
  try {
    const summary = await fetchGbpReviewSummary();
    await writeCachedReviewSummary(summary);
    console.log("Google Business Profile review summary refreshed successfully.");
    return new Response(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown refresh error";
    console.error(`Google Business Profile review summary refresh failed: ${message}`);
    return Response.json({ ok: false }, { status: 500 });
  }
};

export const config: Config = {
  schedule: "@daily",
};
