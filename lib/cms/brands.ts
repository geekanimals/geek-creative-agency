import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { resolveMedia } from "@/lib/cms/media";
import {
  type EntityRef, type EntitySeo, type ProjectCard,
  adaptSeo, findEntityBySlug, findRelatedProjects, deriveRelations, projectToCard, routableSlugs, entityIsPublicRoutable,
} from "@/lib/cms/portfolio";
import type { Brand as CmsBrand, Company as CmsCompany } from "@/payload-types";

export type BrandHub = {
  name: string;
  slug: string;
  shortSummary?: string;
  introduction?: string;
  logo?: string;
  hero?: string;
  company?: EntityRef;
  portfolioGroup?: string;
  industries: EntityRef[];
  services: EntityRef[];
  solutions: EntityRef[];
  programs: ProjectCard[];   // ongoing-program / platform
  campaigns: ProjectCard[];  // campaign
  activations: ProjectCard[]; // activation
  seo: EntitySeo;
};

// No try/catch: no-entity → null (404); infra error propagates → 5xx.
// cache() dedupes generateMetadata + page render into one read per request.
export function getBrand(slug: string, opts: { draft?: boolean } = {}): Promise<BrandHub | null> {
  return loadBrand(slug, Boolean(opts.draft));
}
const loadBrand = cache(async (slug: string, draft: boolean): Promise<BrandHub | null> => {
  const b = await findEntityBySlug<CmsBrand>("brands", slug, draft);
  if (!b) return null;
  if (!draft && !entityIsPublicRoutable("brands", b)) return null;
  const projects = await findRelatedProjects({ brand: { equals: b.id } }, draft);
  const rel = deriveRelations(projects, { draft });
  // Parent company link only if the company hub is routable.
  const company = b.company && typeof b.company === "object" && (draft || entityIsPublicRoutable("companies", b.company))
    ? { slug: (b.company as CmsCompany).slug!, name: (b.company as CmsCompany).name }
    : undefined;
  const brandIndustries = (b.businessCategories ?? [])
    .filter((i) => draft || entityIsPublicRoutable("business-categories", i))
    .map((i) => (typeof i === "object" ? { slug: (i as { slug?: string }).slug!, name: (i as { name?: string }).name! } : null))
    .filter((x): x is EntityRef => !!x?.slug);
  const cards = projects.map(projectToCard);
  return {
    name: b.name,
    slug: b.slug!,
    shortSummary: b.shortSummary ?? undefined,
    introduction: b.introduction ?? undefined,
    logo: resolveMedia(b.logo as never, b.legacyLogoSrc)?.src,
    hero: resolveMedia(b.heroMedia as never, b.heroLegacySrc)?.src,
    company,
    portfolioGroup: b.portfolioGroup ?? undefined,
    industries: brandIndustries.length ? brandIndustries : rel.industries,
    services: rel.services,
    solutions: rel.solutions,
    programs: cards.filter((c) => c.projectKind === "ongoing-program" || c.projectKind === "platform"),
    campaigns: cards.filter((c) => c.projectKind === "campaign"),
    activations: cards.filter((c) => c.projectKind === "activation"),
    seo: adaptSeo(b.seo),
  };
});

export const getBrandSlugs = unstable_cache(() => routableSlugs("brands"), ["portfolio-brand-routable-slugs"], { tags: ["brands"], revalidate: 3600 });
