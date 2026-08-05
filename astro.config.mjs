// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";
import tina from "@tinacms/astro/integration";
import { tinaAdminDevRedirect } from "@tinacms/astro/vite";
import agentationDev from "./src/integrations/agentation-dev.mjs";

const siteMode = process.env.SITE_MODE || process.env.PUBLICATION_MODE || "staging";
if (!new Set(["staging", "release"]).has(siteMode)) {
  throw new Error(`SITE_MODE must be "staging" or "release"; received "${siteMode}".`);
}

if (process.env.NETLIFY === "true") {
  const expectedMode =
    process.env.CONTEXT === "production" ? "release" : "staging";

  if (siteMode !== expectedMode) {
    throw new Error(
      `Netlify ${process.env.CONTEXT || "unknown"} context requires SITE_MODE=${expectedMode}; received ${siteMode}.`
    );
  }
}

const configuredOrigin = process.env.SITE_ORIGIN?.replace(/\/$/, "");
const siteOrigin =
  configuredOrigin ||
  (siteMode === "release"
    ? "https://www.itsakeeperphotography.com"
    : "https://itsakeeperphotography.netlify.app");

const deployTarget =
  process.env.DEPLOY_TARGET ||
  (process.env.VERCEL ? "vercel" : process.env.NETLIFY ? "netlify" : "node");

const adapter =
  deployTarget === "vercel"
    ? vercel()
    : deployTarget === "netlify"
      ? netlify()
      : node({ mode: "standalone" });

export default defineConfig({
  site: siteOrigin,
  output: "static",
  adapter,
  integrations: [tina(), agentationDev()],
  build: {
    inlineStylesheets: "always",
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tinaAdminDevRedirect()],
  },
});
