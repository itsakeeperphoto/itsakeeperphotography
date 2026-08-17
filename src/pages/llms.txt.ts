import type { APIRoute } from "astro";
import settings from "../../content/settings/index.json";
import { pageManifest } from "../lib/page-manifest";
import { isRelease, siteOrigin } from "../lib/site-environment";

export const prerender = true;

export const GET: APIRoute = () => {
  if (!isRelease) {
    return new Response(
      "# It's A Keeper Photography — staging\n\n> This build is a noindex staging preview. It is not approved for citation.\n",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const entries = pageManifest.filter(
    (entry) =>
      entry.contentStatus === "ready" &&
      entry.searchVisibility === "index" &&
      entry.llms
  );
  const sectionFor = (id: string) => {
    if (id === "home") return "Start here";
    if (["family", "seniors", "newborn", "branding", "headshots"].includes(id)) {
      return "Portrait services";
    }
    if (["about", "reviews", "investment", "contact"].includes(id)) {
      return "About and planning";
    }
    if (["richland", "kennewick", "pasco"].includes(id)) return "Local service areas";
    return "Journal and planning guides";
  };
  const sections = new Map<string, typeof entries>();
  for (const entry of entries) {
    const section = sectionFor(entry.id);
    sections.set(section, [...(sections.get(section) || []), entry]);
  }
  const fileLists = [...sections.entries()]
    .map(([section, sectionEntries]) => {
      const links = sectionEntries
        .map(
          (entry) =>
            `- [${entry.title}](${new URL(entry.path, `${siteOrigin}/`).toString()}): ${entry.summary}`,
        )
        .join("\n");
      return `## ${section}\n\n${links}`;
    })
    .join("\n\n");

  const body = `# It's A Keeper Photography\n\n> Warm, natural portrait photography by Lisa Weiss for families, seniors, newborns and businesses in Richland, Kennewick and Pasco, Washington.\n\nThis file lists only production pages approved for indexing and citation. Lisa photographs on location across the Tri-Cities; the website does not publish a private street address. Session details and estimates should be confirmed directly before booking.\n\nPhotographer: Lisa Weiss  \nBusiness: ${settings.businessName.replace(/’/g, "'")}  \nService area: Richland, Kennewick and Pasco, Washington  \nPhone: ${settings.phone}  \nEmail: ${settings.email}\n\n${fileLists}\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
