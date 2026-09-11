import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  type EntityRef, type EntitySeo, type ProjectCard,
  adaptSeo, findEntityBySlug, findRelatedProjects, deriveRelations, projectToCard, routableSlugs, entityIsPublicRoutable,
} from "@/lib/cms/portfolio";
import type { Service as CmsService } from "@/payload-types";

export type ServiceHub = {
  label: string;
  slug: string;
  heading: string;
  shortSummary?: string;
  introduction?: string;
  capabilities: { title: string; description?: string }[];
  approach?: string;
  industries: EntityRef[];
  companies: EntityRef[];
  brands: EntityRef[];
  solutions: EntityRef[];
  projects: ProjectCard[];
  seo: EntitySeo;
};

// A service ROW is always published (for the /work taxonomy), but its /services
// PAGE only exists once it has real editorial content — routability is the
// single source of truth (entityIsPublicRoutable("services", …)). No try/catch:
// no-entity/thin → null (404); infra error propagates → 5xx.
// cache() dedupes generateMetadata + page render into one read per request.
export function getService(slug: string, opts: { draft?: boolean } = {}): Promise<ServiceHub | null> {
  return loadService(slug, Boolean(opts.draft));
}
const loadService = cache(async (slug: string, draft: boolean): Promise<ServiceHub | null> => {
  const s = await findEntityBySlug<CmsService>("services", slug, draft);
  if (!s) return null;
  if (!draft && !entityIsPublicRoutable("services", s)) return null; // thin public service page → hidden
  const projects = await findRelatedProjects({ services: { in: [s.id] } }, draft);
  const rel = deriveRelations(projects, { draft });
  return {
    label: s.label,
    slug: s.slug,
    heading: s.hero?.heading || s.label,
    shortSummary: s.hero?.shortSummary ?? undefined,
    introduction: s.introduction ?? undefined,
    capabilities: (s.capabilities ?? []).map((c) => ({ title: c.title, description: c.description ?? undefined })).filter((c) => c.title),
    approach: s.approach ?? undefined,
    industries: rel.industries,
    companies: rel.companies,
    brands: rel.brands,
    solutions: rel.solutions,
    projects: projects.map(projectToCard),
    seo: adaptSeo(s.seo),
  };
});

// Only services whose PAGE is routable (published + real content) — for sitemap
// + generateStaticParams; routableSlugs applies entityIsPublicRoutable.
export const getServiceSlugs = unstable_cache(() => routableSlugs("services"), ["portfolio-service-routable-slugs"], { tags: ["services"], revalidate: 3600 });
