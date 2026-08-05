import { getStore } from "@netlify/blobs";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GBP_API_ROOT = "https://mybusiness.googleapis.com/v4";
const CACHE_STORE_NAME = "google-business-profile";
const CACHE_KEY_PREFIX = "review-summary";
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10_000;

export interface GbpReviewSummary {
  totalReviewCount: number;
  averageRating: number;
  fetchedAt: string;
  expiresAt: string;
}

interface GbpCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accountId: string;
  locationId: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const requiredEnvironmentValue = (name: keyof NodeJS.ProcessEnv) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const resourceId = (value: string, resourceName: "accounts" | "locations") => {
  const parts = value.replace(/^\/+|\/+$/g, "").split("/");
  const resourceIndex = parts.lastIndexOf(resourceName);

  if (resourceIndex >= 0 && resourceIndex === parts.length - 2 && parts[resourceIndex + 1]) {
    return parts[resourceIndex + 1];
  }

  if (parts.length === 1 && parts[0]) return parts[0];
  throw new Error(`Invalid ${resourceName} resource identifier`);
};

const getCredentials = (): GbpCredentials => ({
  clientId: requiredEnvironmentValue("GBP_OAUTH_CLIENT_ID"),
  clientSecret: requiredEnvironmentValue("GBP_OAUTH_CLIENT_SECRET"),
  refreshToken: requiredEnvironmentValue("GBP_OAUTH_REFRESH_TOKEN"),
  accountId: resourceId(requiredEnvironmentValue("GBP_ACCOUNT_ID"), "accounts"),
  locationId: resourceId(requiredEnvironmentValue("GBP_LOCATION_ID"), "locations"),
});

const cacheNamespace = () => {
  const context = process.env.CONTEXT?.trim() || (process.env.NETLIFY ? "production" : "local");
  const branch = context === "production" ? "" : process.env.BRANCH?.trim();
  const namespace = branch ? `${context}-${branch}` : context;
  return namespace.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 48) || "local";
};

const reviewSummaryStore = () =>
  getStore({
    name: CACHE_STORE_NAME,
    consistency: "strong",
  });

const reviewSummaryKey = () => `${CACHE_KEY_PREFIX}/${cacheNamespace()}`;

const numericValue = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && /^\d+(?:\.\d+)?$/.test(value)) return Number(value);
  return Number.NaN;
};

const parseApiSummary = (value: unknown) => {
  if (!isRecord(value)) throw new Error("Google Business Profile returned an invalid response");

  const totalReviewCount = numericValue(value.totalReviewCount);
  const averageRating = numericValue(value.averageRating);

  if (!Number.isSafeInteger(totalReviewCount) || totalReviewCount < 0) {
    throw new Error("Google Business Profile returned an invalid review count");
  }

  if (!Number.isFinite(averageRating) || averageRating < 0 || averageRating > 5) {
    throw new Error("Google Business Profile returned an invalid average rating");
  }

  return { totalReviewCount, averageRating };
};

const isReviewSummary = (value: unknown): value is GbpReviewSummary => {
  if (!isRecord(value)) return false;

  const { totalReviewCount, averageRating, fetchedAt, expiresAt } = value;
  return (
    Number.isSafeInteger(totalReviewCount) &&
    (totalReviewCount as number) >= 0 &&
    typeof averageRating === "number" &&
    Number.isFinite(averageRating) &&
    averageRating >= 0 &&
    averageRating <= 5 &&
    typeof fetchedAt === "string" &&
    Number.isFinite(Date.parse(fetchedAt)) &&
    typeof expiresAt === "string" &&
    Number.isFinite(Date.parse(expiresAt))
  );
};

const requestJson = async (url: string, init: RequestInit) => {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`Upstream request failed with status ${response.status}`);

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new Error("Upstream request returned invalid JSON");
  }
};

export const fetchGbpReviewSummary = async (): Promise<GbpReviewSummary> => {
  const credentials = getCredentials();
  const tokenPayload = await requestJson(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const accessToken = isRecord(tokenPayload) ? tokenPayload.access_token : undefined;
  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("Google OAuth returned an invalid access token response");
  }

  const accountId = encodeURIComponent(credentials.accountId);
  const locationId = encodeURIComponent(credentials.locationId);
  const reviewPayload = await requestJson(
    `${GBP_API_ROOT}/accounts/${accountId}/locations/${locationId}/reviews?pageSize=1`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const parsed = parseApiSummary(reviewPayload);
  const fetchedAt = new Date();

  return {
    ...parsed,
    fetchedAt: fetchedAt.toISOString(),
    expiresAt: new Date(fetchedAt.getTime() + CACHE_MAX_AGE_MS).toISOString(),
  };
};

export const writeCachedReviewSummary = async (summary: GbpReviewSummary) => {
  await reviewSummaryStore().setJSON(reviewSummaryKey(), summary);
};

export const readCachedReviewSummary = async (): Promise<GbpReviewSummary | null> => {
  const summary = (await reviewSummaryStore().get(reviewSummaryKey(), {
    type: "json",
    consistency: "strong",
  })) as unknown;

  if (!isReviewSummary(summary)) return null;
  const fetchedAt = Date.parse(summary.fetchedAt);
  const expiresAt = Date.parse(summary.expiresAt);
  if (expiresAt <= fetchedAt || expiresAt - fetchedAt > CACHE_MAX_AGE_MS) return null;
  if (expiresAt <= Date.now() || Date.now() - fetchedAt > CACHE_MAX_AGE_MS) return null;
  return summary;
};
