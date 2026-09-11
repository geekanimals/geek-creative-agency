import "server-only";
import type { Where } from "payload";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { entityIsPublicRoutable } from "./routable";
import type {
  Project as CmsProject,
  Company as CmsCompany,
  Brand as CmsBrand,
  BusinessCategory as CmsIndustry,
  Service as CmsService,
  Solution as CmsSolution,
} from "@/payload-types";

/**
 * Shared query core for the portfolio relationship graph (Industries, Companies,
 * Brands, Services, Solutions). Hubs DERIVE their listings from a single
 * published-projects query (depth 1 so relationships populate in one round trip)
 * — nothing is duplicated onto the hub documents. On CMS failure, getters return
 * null/empty and the routes 404/degrade rather than crashing the site.
 */

export type EntityRef = { slug: string; name: string };
export type EntitySeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };
export type ProjectCard = {
  slug: string;
  title: string;
  brand?: string;
  company?: string;
  projectKind: string;
  heroImage?: string;
  services: string[]; // slugs
};

export function logCmsError(ctx: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; portfolio hub falling back:`, e instanceof Error ? e.message : e);
}

const idOf = (v: unknown): string | undefined =>
  v == null ? undefined : typeof v === "object" ? String((v as { id?: number | string }).id ?? "") || undefined : String(v);
const asObj = <T,>(v: unknown): T | undefined => (v && typeof v === "object" ? (v as T) : undefined);

function refOfIndustry(v: unknown): EntityRef | undefined {
  const o = asObj<CmsIndustry>(v);
  return o?.slug ? { slug: o.slug, name: o.name } : undefined;
}
function refOfService(v: unknown): EntityRef | undefined {
  const o = asObj<CmsService>(v);
  return o?.slug ? { slug: o.slug, name: o.label } : undefined;
}
function refOfSolution(v: unknown): EntityRef | undefined {
  const o = asObj<CmsSolution>(v);
  return o?.slug ? { slug: o.slug, name: o.name } : undefined;
}
function refOfBrand(v: unknown): (EntityRef & { company?: string; portfolioGroup?: string }) | undefined {
  const o = asObj<CmsBrand>(v);
  if (!o?.slug) return undefined;
  return { slug: o.slug, name: o.name, company: idOf(o.company), portfolioGroup: o.portfolioGroup ?? undefined };
}
function refOfCompany(v: unknown): EntityRef | undefined {
  const o = asObj<CmsCompany>(v);
  return o?.slug ? { slug: o.slug, name: o.name } : undefined;
}

export function projectToCard(p: CmsProject): ProjectCard {
  const brand = asObj<CmsBrand>(p.brand);
  const company = asObj<CmsCompany>(p.company);
  const hero = resolveMedia(p.heroMedia as never, p.heroLegacySrc);
  const services = Array.isArray(p.services) ? p.services.map((s) => asObj<CmsService>(s)?.slug).filter((x): x is string => !!x) : [];
  return {
    slug: p.slug,
    title: p.title,
    brand: brand?.name,
    company: company?.name,
    projectKind: (p.projectKind as string) || "campaign",
    heroImage: hero?.src,
    services,
  };
}

// Public-routability policy lives in a plain (non "server-only") module so it
// stays unit-testable; re-exported here as the canonical import for server code
// (imported above for this module's own internal use).
export { entityIsPublicRoutable };

/** Card-context Project projection — only the fields cards + relation derivation
 *  need. Avoids loading story bodies, flexible blocks, galleries, metrics, SEO. */
const CARD_PROJECT_SELECT = {
  slug: true, title: true, projectKind: true, heroMedia: true, heroLegacySrc: true,
  company: true, brand: true, services: true, businessCategories: true, solutions: true,
} as const;

/** One depth-1 query for projects matching `where`; relationships
 *  (company/brand/services/solutions/businessCategories) come back populated.
 *  Public (draft=false): published only. Preview (draft=true): includes drafts.
 *  Uses a card projection so full Project bodies are never loaded for hubs. */
export async function findRelatedProjects(where: Where, draft = false): Promise<CmsProject[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "projects",
    where: draft ? where : { and: [{ _status: { equals: "published" } }, where] },
    select: CARD_PROJECT_SELECT as never,
    depth: 1,
    limit: 500,
    pagination: false,
    draft,
    overrideAccess: draft,
  });
  return res.docs as CmsProject[];
}

/** Derive the distinct related entities referenced by a set of project docs.
 *  In public mode, non-routable (thin/unpublished) related entities are omitted
 *  so hubs never render internal links that would 404; in draft/preview all are
 *  kept. */
export function deriveRelations(projects: CmsProject[], opts: { draft?: boolean } = {}) {
  const draft = Boolean(opts.draft);
  const industries = new Map<string, EntityRef>();
  const services = new Map<string, EntityRef>();
  const solutions = new Map<string, EntityRef>();
  const brands = new Map<string, EntityRef & { company?: string; portfolioGroup?: string }>();
  const companies = new Map<string, EntityRef>();
  const ok = (collection: string, obj: unknown) => draft || entityIsPublicRoutable(collection, obj);
  for (const p of projects) {
    for (const i of (p.businessCategories ?? [])) { const r = refOfIndustry(i); if (r && ok("business-categories", i)) industries.set(r.slug, r); }
    for (const s of (p.services ?? [])) { const r = refOfService(s); if (r && ok("services", s)) services.set(r.slug, r); }
    for (const s of (p.solutions ?? [])) { const r = refOfSolution(s); if (r && ok("solutions", s)) solutions.set(r.slug, r); }
    const b = refOfBrand(p.brand); if (b && ok("brands", p.brand)) brands.set(b.slug, b);
    const c = refOfCompany(p.company); if (c && ok("companies", p.company)) companies.set(c.slug, c);
  }
  return {
    industries: [...industries.values()],
    services: [...services.values()],
    solutions: [...solutions.values()],
    brands: [...brands.values()],
    companies: [...companies.values()],
  };
}

export function adaptSeo(seo: { metaTitle?: string | null; metaDescription?: string | null; ogImage?: unknown; noindex?: boolean | null } | null | undefined): EntitySeo {
  return {
    metaTitle: seo?.metaTitle || undefined,
    metaDescription: seo?.metaDescription || undefined,
    ogImage: resolveMedia(seo?.ogImage as never)?.src,
    noindex: Boolean(seo?.noindex),
  };
}

/** Fetch a single published (or draft, when previewing) entity by slug. */
export async function findEntityBySlug<T>(collection: string, slug: string, draft: boolean): Promise<T | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: collection as never,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    draft,
    overrideAccess: draft,
    pagination: false,
  });
  const doc = res.docs[0] as (T & { _status?: string }) | undefined;
  if (doc && (draft || doc._status === "published")) return doc as T;
  return null;
}

/**
 * Slugs of PUBLIC-ROUTABLE entities (published AND substantive) for a
 * collection — for generateStaticParams + sitemap, so thin published entities
 * never become prerendered/indexed pages. Fail-open ([]) at BUILD time only:
 * generateStaticParams/sitemap must not crash the build on a transient error,
 * and dynamicParams=true still serves valid pages on demand. The logged warning
 * makes a broken build-time DB visible. (Runtime hub RENDER does NOT fail open —
 * see the per-entity getters.)
 */
export async function routableSlugs(collection: string): Promise<string[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: collection as never,
      where: { _status: { equals: "published" } },
      depth: 0,
      limit: 1000,
      pagination: false,
    });
    return res.docs
      .filter((d) => entityIsPublicRoutable(collection, d))
      .map((d) => (d as { slug?: string }).slug)
      .filter((s): s is string => !!s);
  } catch (e) {
    logCmsError(`routableSlugs(${collection}) [build-time, failing open]`, e);
    return [];
  }
}
