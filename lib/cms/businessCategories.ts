import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import { resolveMedia } from "@/lib/cms/media";
import { businessCategories as legacyIndustryTaxonomy } from "@/lib/work/taxonomy";
import {
  type EntityRef, type EntitySeo, type ProjectCard,
  adaptSeo, findEntityBySlug, findRelatedProjects, deriveRelations, projectToCard, routableSlugs, entityIsPublicRoutable,
} from "@/lib/cms/portfolio";
import type { BusinessCategory as CmsIndustry } from "@/payload-types";

// Valid values of the LEGACY `businessCategory` select (a Postgres enum). A slug
// outside this set must NOT be compared against the enum column — Postgres rejects
// it ("invalid input value for enum") and the query 500s. New industries beyond
// the legacy taxonomy simply rely on the `businessCategories` relationship.
const LEGACY_INDUSTRY_SLUGS = new Set(legacyIndustryTaxonomy.map((c) => c.slug));

export type IndustryHub = {
  name: string;
  slug: string;
  shortSummary?: string;
  introduction?: string;
  hero?: string;
  companies: EntityRef[];
  brands: EntityRef[];
  services: EntityRef[];
  solutions: EntityRef[];
  projects: ProjectCard[];
  seo: EntitySeo;
};

// No try/catch: a genuine "no entity" returns null (→ 404); a DB/infra error
// PROPAGATES so the route returns 5xx (retryable) rather than a false 404.
// cache() dedupes the generateMetadata + page render into one read per request.
export function getIndustry(slug: string, opts: { draft?: boolean } = {}): Promise<IndustryHub | null> {
  return loadIndustry(slug, Boolean(opts.draft));
}
const loadIndustry = cache(async (slug: string, draft: boolean): Promise<IndustryHub | null> => {
  const ind = await findEntityBySlug<CmsIndustry>("business-categories", slug, draft);
  if (!ind) return null; // entity does not exist
  if (!draft && !entityIsPublicRoutable("business-categories", ind)) return null; // thin/unpublished → no public page
  // Match projects tagged via the NEW relationship OR the LEGACY businessCategory
  // select — but only bridge to the legacy enum when this industry's slug is an
  // actual enum member (otherwise Postgres rejects the comparison and 500s).
  const or: Where[] = [{ businessCategories: { in: [ind.id] } }];
  if (ind.slug && LEGACY_INDUSTRY_SLUGS.has(ind.slug)) or.push({ businessCategory: { in: [ind.slug] } });
  const projects = await findRelatedProjects({ or }, draft);
  const rel = deriveRelations(projects, { draft });
  return {
    name: ind.name,
    slug: ind.slug!,
    shortSummary: ind.shortSummary ?? undefined,
    introduction: ind.introduction ?? undefined,
    hero: resolveMedia(ind.heroMedia as never, ind.heroLegacySrc)?.src,
    companies: rel.companies,
    brands: rel.brands,
    services: rel.services,
    solutions: rel.solutions,
    projects: projects.map(projectToCard),
    seo: adaptSeo(ind.seo),
  };
});

export const getIndustrySlugs = unstable_cache(() => routableSlugs("business-categories"), ["portfolio-industry-routable-slugs"], { tags: ["business-categories"], revalidate: 3600 });
