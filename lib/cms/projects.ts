import "server-only";
import type { CaseStudy, Stat } from "@/lib/work/types";
import type { RenderMode, FlagshipRendererKey } from "@/lib/work/renderers";
import { isFlagshipKey } from "@/lib/work/renderers";
import { projects as staticProjects, projectBySlug as staticBySlug } from "@/lib/work/projects";
import { resolveMedia } from "@/lib/cms/media";
import { getPayloadClient } from "@/lib/cms/payload";
import { entityIsPublicRoutable } from "@/lib/cms/portfolio";
import type { Project as CmsProject, Service as CmsService, Media as CmsMedia } from "@/payload-types";

/**
 * Resolved project = the shared CaseStudy shape the renderers consume, plus the
 * render-mode metadata used to dispatch. Whether a project comes from the CMS or
 * the static registry, everything downstream sees this one shape.
 */
export type ProjectRef = { slug: string; name: string };

/* ── Gold Standard public evidence shapes (Phase 11.26) ────────────────────
 * Publication-safe projections consumed by the Evidence & Recognition and FAQ
 * renderers. Internal `searchStrategy` is intentionally NOT surfaced here — it
 * is never rendered publicly. */
export type PressSourceType =
  | "independent-editorial" | "official-brand" | "partner-ngo"
  | "campaign-archive" | "trade-publication" | "other";
export type PressItem = {
  publisher: string;
  headline: string;
  url: string;
  archiveUrl?: string;
  publicationDate?: string;
  sourceType: PressSourceType;
  geekMentioned: boolean;
  featured: boolean;
  validationNote?: string;
  thumbnail?: string;
};
export type AwardItem = {
  awardBody: string;
  programName?: string;
  category?: string;
  result?: string;
  year?: number;
  url?: string;
  creditedOrganizations: string[];
  geekCredited: boolean;
  validationNote?: string;
};
export type FaqItem = { question: string; answer: string };

export type ResolvedProject = CaseStudy & {
  renderMode: RenderMode;
  flagshipRendererKey?: FlagshipRendererKey;
  sections?: CmsProject["sections"];
  metricsList?: { value: string; label: string; prefix?: string; suffix?: string; note?: string }[];
  source: "cms" | "static";
  updatedAt?: string; // editorial last-modified (CMS only) — for sitemap lastModified
  // Portfolio relationship graph (Phase 11.25) — for internal linking + agent
  // ingestion. Empty for static/flagship-static projects.
  projectKind?: string;
  industries?: ProjectRef[];
  companyRef?: ProjectRef;
  brandRef?: ProjectRef;
  solutionRefs?: ProjectRef[];
  serviceRefs?: ProjectRef[];
  // Gold Standard public evidence (CMS only; empty for static/flagship-static).
  press?: PressItem[];
  awards?: AwardItem[];
  faqs?: FaqItem[];
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Never let a CMS failure crash a page — log it, callers fall back to static. */
function logCmsError(context: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${context} failed; falling back to static registry:`, e instanceof Error ? e.message : e);
}

/* ── static entry → ResolvedProject (infers render mode from the registry) ── */
function fromStatic(p: CaseStudy): ResolvedProject {
  const flagship = p.slug === "high-ultra-lounge";
  return {
    ...p,
    renderMode: flagship ? "flagship" : "standard",
    flagshipRendererKey: flagship ? "high-ultra-lounge" : undefined,
    source: "static",
  };
}

/* ── CMS doc → ResolvedProject ────────────────────────────────────────────── */
function fromCms(doc: CmsProject): ResolvedProject {
  const services = Array.isArray(doc.services)
    ? doc.services.map((s) => (typeof s === "object" && s ? (s as CmsService).slug : String(s))).filter(Boolean)
    : [];
  const hero = resolveMedia(doc.heroMedia as CmsMedia | number | null | undefined, doc.heroLegacySrc);
  const og = resolveMedia(doc.seo?.ogImage as CmsMedia | number | null | undefined);
  const metricsList = (doc.metrics ?? []).map((m) => ({
    value: m.value, label: m.label, prefix: m.prefix ?? undefined, suffix: m.suffix ?? undefined, note: m.note ?? undefined,
  }));
  const stats: Stat[] | undefined = metricsList.length
    ? metricsList.map((m) => ({ value: `${m.prefix ?? ""}${m.value}${m.suffix ?? ""}`, label: m.label }))
    : undefined;

  const renderMode = (doc.renderMode ?? "standard") as RenderMode;
  const key = isFlagshipKey(doc.flagshipRendererKey) ? doc.flagshipRendererKey : undefined;

  return {
    slug: doc.slug,
    brand: doc.client || doc.title,
    brandSlug: doc.client ? slugify(doc.client) : doc.slug,
    project: doc.title,
    year: doc.year ?? undefined,
    businessCategory: (doc.businessCategory ?? []) as string[],
    services,
    campaignTypes: (doc.campaignTypes ?? []) as string[],
    heroImage: hero?.src,
    heroVideo: doc.heroVideo ?? undefined,
    headline: doc.headline || doc.title,
    oneLineSummary: doc.shortSummary ?? "",
    challenge: doc.challenge?.question ? { question: doc.challenge.question, copy: doc.challenge.copy ?? undefined } : undefined,
    insight: doc.insight ? { copy: doc.insight } : undefined,
    idea: doc.idea?.statement ? { statement: doc.idea.statement, copy: doc.idea.copy ?? undefined } : undefined,
    whyItMattered: doc.outcome ?? undefined,
    quote: doc.quote?.text ? { text: doc.quote.text, attribution: doc.quote.attribution ?? undefined } : undefined,
    stats,
    publishStatus: doc._status === "published" ? "published" : "draft",
    featured: Boolean(doc.featured),
    seoTitle: doc.seo?.metaTitle ?? undefined,
    metaDescription: doc.seo?.metaDescription ?? undefined,
    ogImage: og?.src,
    cardSummary: doc.cardSummary ?? undefined,
    renderMode,
    flagshipRendererKey: key,
    sections: doc.sections,
    metricsList,
    source: "cms",
    updatedAt: doc.updatedAt ?? undefined,
    projectKind: (doc.projectKind as string) ?? "campaign",
    // Refs used for internal DISCOVERY LINKS (ProjectDiscovery) — gated to
    // PUBLIC-ROUTABLE entities only, so a project page never links to a hub that
    // would 404. `services` (slugs, above) stays complete for /work filtering.
    industries: relRefs(doc.businessCategories, "business-categories", "name"),
    companyRef: singleRef(doc.company, "companies", "name"),
    brandRef: singleRef(doc.brand, "brands", "name"),
    solutionRefs: relRefs(doc.solutions, "solutions", "name"),
    serviceRefs: relRefs(doc.services, "services", "label"),
    press: mapPress(doc.pressCoverage),
    awards: mapAwards(doc.awards),
    faqs: mapFaqs(doc.faqs),
  } as ResolvedProject;
}

/* ── Gold Standard evidence mappers (CMS doc → publication-safe shapes) ───── */
function mapPress(rows: CmsProject["pressCoverage"]): PressItem[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r) => r && r.publisher && r.headline && r.url)
    .map((r) => ({
      publisher: r.publisher,
      headline: r.headline,
      url: r.url,
      archiveUrl: r.archiveUrl ?? undefined,
      publicationDate: r.publicationDate ?? undefined,
      sourceType: (r.sourceType ?? "independent-editorial") as PressItem["sourceType"],
      geekMentioned: Boolean(r.geekMentioned),
      featured: Boolean(r.featured),
      validationNote: r.validationNote ?? undefined,
      thumbnail: resolveMedia(r.thumbnail as CmsMedia | number | null | undefined)?.src,
    }));
}
function mapAwards(rows: CmsProject["awards"]): AwardItem[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r) => r && r.awardBody)
    .map((r) => ({
      awardBody: r.awardBody,
      programName: r.programName ?? undefined,
      category: r.category ?? undefined,
      result: r.result ?? undefined,
      year: r.year ?? undefined,
      url: r.url ?? undefined,
      creditedOrganizations: Array.isArray(r.creditedOrganizations) ? r.creditedOrganizations.filter(Boolean) : [],
      geekCredited: Boolean(r.geekCredited),
      validationNote: r.validationNote ?? undefined,
    }));
}
function mapFaqs(rows: CmsProject["faqs"]): FaqItem[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r) => r && r.question && r.answer)
    .map((r) => ({ question: r.question, answer: r.answer }));
}

/** Map a populated hasMany relationship to {slug,name} refs, keeping only
 *  public-routable entities (skips unpopulated ids + thin/unpublished). */
function relRefs(v: unknown, collection: string, nameKey: "name" | "label"): ProjectRef[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => refFrom(x, collection, nameKey))
    .filter((r): r is ProjectRef => !!r);
}
/** Map a populated single relationship to a routable {slug,name} ref. */
function singleRef(v: unknown, collection: string, nameKey: "name" | "label"): ProjectRef | undefined {
  return refFrom(v, collection, nameKey) ?? undefined;
}
function refFrom(x: unknown, collection: string, nameKey: "name" | "label"): ProjectRef | null {
  if (!x || typeof x !== "object" || !("slug" in x)) return null; // unpopulated id → skip
  if (!entityIsPublicRoutable(collection, x)) return null; // thin/unpublished → no link
  const o = x as Record<string, string>;
  return o.slug ? { slug: o.slug, name: o[nameKey] ?? o.name ?? o.slug } : null;
}

/**
 * The unified project list for /work: static registry with PUBLISHED CMS
 * projects overriding by slug, plus CMS-only projects appended. On any CMS
 * error, falls back to the pure static registry so /work never goes down.
 */
export async function getWorkProjects(): Promise<ResolvedProject[]> {
  const staticResolved = staticProjects.map(fromStatic);
  let cms: ResolvedProject[] = [];
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "projects",
      where: { _status: { equals: "published" } },
      depth: 1,
      limit: 200,
      pagination: false,
    });
    cms = res.docs.map(fromCms);
  } catch (e) {
    logCmsError("getWorkProjects", e);
    return staticResolved; // static-only fallback
  }
  const bySlug = new Map<string, ResolvedProject>();
  for (const p of staticResolved) bySlug.set(p.slug, p);
  for (const c of cms) bySlug.set(c.slug, c); // CMS wins
  return [...bySlug.values()];
}

/**
 * Resolve a single project by slug. CMS-first (published, or draft when
 * `draft`), then merges deep static content for flagship projects the CMS does
 * not fully model, then falls back to the static registry.
 */
export async function getProjectBySlug(slug: string, opts: { draft?: boolean } = {}): Promise<ResolvedProject | null> {
  const draft = Boolean(opts.draft);
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
      draft,
      overrideAccess: draft, // draft preview is gated upstream (validated secret)
      pagination: false,
    });
    const doc = res.docs[0];
    if (doc && (draft || doc._status === "published")) {
      let resolved = fromCms(doc);
      // Transitional flagship hybrid: keep deep static content (e.g. The Coolest
      // Job's execution blocks) that the CMS envelope does not model, so bespoke
      // renderers stay visually identical while the envelope becomes editable.
      if (resolved.renderMode === "flagship") {
        const s = staticBySlug(slug);
        if (s) resolved = { ...s, ...resolved, execution: resolved.execution ?? s.execution, gallery: resolved.gallery ?? s.gallery };
      }
      return resolved;
    }
  } catch (e) {
    logCmsError(`getProjectBySlug(${slug})`, e);
  }
  const s = staticBySlug(slug);
  return s ? fromStatic(s) : null;
}

/** All routable slugs (static ∪ published CMS) for generateStaticParams. */
export async function getAllProjectSlugs(includeDrafts = false): Promise<string[]> {
  const slugs = new Set<string>(staticProjects.map((p) => p.slug));
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "projects",
      where: includeDrafts ? {} : { _status: { equals: "published" } },
      depth: 0,
      limit: 500,
      pagination: false,
    });
    for (const d of res.docs) slugs.add(d.slug);
  } catch (e) {
    logCmsError("getAllProjectSlugs", e);
  }
  return [...slugs];
}
