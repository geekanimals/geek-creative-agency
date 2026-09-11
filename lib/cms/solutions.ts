import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  type EntityRef, type EntitySeo, type ProjectCard,
  adaptSeo, findEntityBySlug, findRelatedProjects, deriveRelations, projectToCard, routableSlugs, entityIsPublicRoutable,
} from "@/lib/cms/portfolio";
import type { Solution as CmsSolution, Service as CmsService } from "@/payload-types";

export type SolutionHub = {
  name: string;
  slug: string;
  solutionType?: string;
  shortSummary?: string;
  introduction?: string;
  whatItSolves?: { heading?: string; body?: string };
  methodology: { title: string; description?: string }[];
  relatedServices: EntityRef[];
  industries: EntityRef[];
  brands: EntityRef[];
  implementations: ProjectCard[];
  seo: EntitySeo;
};

// No try/catch: no-entity → null (404); infra error propagates → 5xx.
// cache() dedupes generateMetadata + page render into one read per request.
export function getSolution(slug: string, opts: { draft?: boolean } = {}): Promise<SolutionHub | null> {
  return loadSolution(slug, Boolean(opts.draft));
}
const loadSolution = cache(async (slug: string, draft: boolean): Promise<SolutionHub | null> => {
  const s = await findEntityBySlug<CmsSolution>("solutions", slug, draft);
  if (!s) return null;
  if (!draft && !entityIsPublicRoutable("solutions", s)) return null;
  const projects = await findRelatedProjects({ solutions: { in: [s.id] } }, draft);
  const rel = deriveRelations(projects, { draft });
  // Only link to routable Services (never an internal 404).
  const relatedServices = (s.relatedServices ?? [])
    .filter((sv) => draft || entityIsPublicRoutable("services", sv))
    .map((sv) => (typeof sv === "object" ? { slug: (sv as CmsService).slug, name: (sv as CmsService).label } : null))
    .filter((x): x is EntityRef => !!x?.slug);
  return {
    name: s.name,
    slug: s.slug!,
    solutionType: s.solutionType ?? undefined,
    shortSummary: s.shortSummary ?? undefined,
    introduction: s.introduction ?? undefined,
    whatItSolves: s.whatItSolves?.heading || s.whatItSolves?.body ? { heading: s.whatItSolves?.heading ?? undefined, body: s.whatItSolves?.body ?? undefined } : undefined,
    methodology: (s.methodology ?? []).map((m) => ({ title: m.title, description: m.description ?? undefined })).filter((m) => m.title),
    relatedServices,
    industries: rel.industries,
    brands: rel.brands,
    implementations: projects.map(projectToCard),
    seo: adaptSeo(s.seo),
  };
});

export const getSolutionSlugs = unstable_cache(() => routableSlugs("solutions"), ["portfolio-solution-routable-slugs"], { tags: ["solutions"], revalidate: 3600 });
