import "server-only";
import { cache } from "react";
import type { Where } from "payload";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import {
  type EntityRef, type EntitySeo, type ProjectCard,
  adaptSeo, findEntityBySlug, findRelatedProjects, deriveRelations, projectToCard, routableSlugs, entityIsPublicRoutable,
} from "@/lib/cms/portfolio";
import type { Company as CmsCompany, Brand as CmsBrand } from "@/payload-types";

export type CompanyHub = {
  name: string;
  slug: string;
  shortSummary?: string;
  introduction?: string;
  logo?: string;
  website?: string;
  industries: EntityRef[];
  portfolioGroups: { group: string; brands: EntityRef[] }[];
  services: EntityRef[];
  solutions: EntityRef[];
  projects: ProjectCard[];
  seo: EntitySeo;
};

// No try/catch: no-entity/thin → null (404); infra error propagates → 5xx.
// cache() dedupes generateMetadata + page render into one read per request.
export function getCompany(slug: string, opts: { draft?: boolean } = {}): Promise<CompanyHub | null> {
  return loadCompany(slug, Boolean(opts.draft));
}
const loadCompany = cache(async (slug: string, draft: boolean): Promise<CompanyHub | null> => {
  const c = await findEntityBySlug<CmsCompany>("companies", slug, draft);
  if (!c) return null;
  if (!draft && !entityIsPublicRoutable("companies", c)) return null;
  const payload = await getPayloadClient();
  // Brands of this company — one query, used for grouping + project scope.
  const brandRes = await payload.find({ collection: "brands", where: draft ? { company: { equals: c.id } } : { and: [{ _status: { equals: "published" } }, { company: { equals: c.id } }] }, depth: 0, limit: 500, pagination: false, draft, overrideAccess: draft });
  const brandDocs = brandRes.docs as CmsBrand[];
  const brandIds = brandDocs.map((b) => b.id);
  // Projects where company matches OR brand is one of the company's brands.
  const where: Where = brandIds.length ? { or: [{ company: { equals: c.id } }, { brand: { in: brandIds } }] } : { company: { equals: c.id } };
  const projects = await findRelatedProjects(where, draft);
  const rel = deriveRelations(projects, { draft });
  // Portfolio groups from the company's own brands — but only brands whose hub
  // is routable (never a group link that 404s).
  const groups = new Map<string, EntityRef[]>();
  for (const b of brandDocs.filter((b) => draft || entityIsPublicRoutable("brands", b)).sort((a, z) => a.name.localeCompare(z.name))) {
    const g = b.portfolioGroup?.trim() || "Brands";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push({ slug: b.slug!, name: b.name });
  }
  const companyIndustries = (c.businessCategories ?? [])
    .filter((i) => draft || entityIsPublicRoutable("business-categories", i))
    .map((i) => (typeof i === "object" ? { slug: (i as { slug?: string }).slug!, name: (i as { name?: string }).name! } : null))
    .filter((x): x is EntityRef => !!x?.slug);
  return {
    name: c.name,
    slug: c.slug!,
    shortSummary: c.shortSummary ?? undefined,
    introduction: c.introduction ?? undefined,
    logo: resolveMedia(c.logo as never, c.legacyLogoSrc)?.src,
    website: c.website ?? undefined,
    industries: companyIndustries.length ? companyIndustries : rel.industries,
    portfolioGroups: [...groups.entries()].map(([group, brands]) => ({ group, brands })),
    services: rel.services,
    solutions: rel.solutions,
    projects: projects.map(projectToCard),
    seo: adaptSeo(c.seo),
  };
});

export const getCompanySlugs = unstable_cache(() => routableSlugs("companies"), ["portfolio-company-routable-slugs"], { tags: ["companies"], revalidate: 3600 });
