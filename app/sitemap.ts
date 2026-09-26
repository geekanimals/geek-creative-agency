import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getWorkProjects } from "@/lib/cms/projects";
import { getIndustrySlugs } from "@/lib/cms/businessCategories";
import { getCompanySlugs } from "@/lib/cms/companies";
import { getBrandSlugs } from "@/lib/cms/brands";
import { getServiceSlugs } from "@/lib/cms/services";
import { getSolutionSlugs } from "@/lib/cms/solutions";

const asDate = (v: string | undefined): Date | undefined => {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Published projects = CMS-published ∪ static-published, deduped by slug (CMS
  // wins). Falls back to the static registry if the CMS is unavailable.
  const projects = (await getWorkProjects()).filter((p) => p.publishStatus === "published");
  // Public-routable portfolio hubs only (drafts + thin pages excluded by the getters).
  const [industries, companies, brands, services, solutions] = await Promise.all([
    getIndustrySlugs(), getCompanySlugs(), getBrandSlugs(), getServiceSlugs(), getSolutionSlugs(),
  ]);

  const core = ["/", "/work", "/what-we-do", "/about", "/creators", "/contact", "/privacy", "/terms"];

  // Core static pages: no lastModified (avoids falsely marking every URL as
  // changed on each deployment; these change with code, not a datable edit).
  const entries: MetadataRoute.Sitemap = core.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));

  // Case studies — real editorial updatedAt where available (CMS); static
  // entries have no reliable date, so omit rather than fabricate.
  for (const p of projects) {
    entries.push({ url: `${SITE_URL}/work/${p.slug}`, lastModified: asDate(p.updatedAt), changeFrequency: "monthly", priority: 0.8 });
  }
  // Portfolio hubs — derived pages (change when their projects change); omit
  // lastModified rather than stamp deployment time.
  const hubs: [string[], string][] = [
    [industries, "/industries"], [companies, "/companies"], [brands, "/brands"], [services, "/services"], [solutions, "/solutions"],
  ];
  for (const [slugs, prefix] of hubs) {
    for (const slug of slugs) {
      entries.push({ url: `${SITE_URL}${prefix}/${slug}`, changeFrequency: "monthly", priority: 0.6 });
    }
  }
  return entries;
}
