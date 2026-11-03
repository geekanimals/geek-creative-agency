import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { CaseStudy, Stat } from "@/lib/work/types";
import type { RenderMode, FlagshipRendererKey } from "@/lib/work/renderers";
import { isFlagshipKey } from "@/lib/work/renderers";
import { projects as staticProjects, projectBySlug as staticBySlug, isPublished as staticIsPublished } from "@/lib/work/projects";
import { resolveMedia } from "@/lib/cms/media";
import { getPayloadClient, isCmsNotConfiguredError } from "@/lib/cms/payload";
import { entityIsPublicRoutable } from "@/lib/cms/portfolio";
import type { Project as CmsProject, Service as CmsService, Media as CmsMedia } from "@/payload-types";
import { resolveVideo } from "@/lib/cms/video";

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
  if (isCmsNotConfiguredError(e)) return; // CMS off → static content, no noise
  // eslint-disable-next-line no-console
  // Show the real database reason (e.cause) instead of the whole generated SQL query.
  const cause = e instanceof Error && e.cause instanceof Error ? e.cause.message : undefined;
  const msg = e instanceof Error ? e.message.split("\nparams:")[0] : String(e);
  console.error(
    `[cms] ${context} failed; falling back to static registry:`,
    cause ?? (msg.length > 300 ? `${msg.slice(0, 300)}…` : msg),
  );
}

/* ── static entry → ResolvedProject (infers render mode from the registry) ── */
function fromStatic(p: CaseStudy): ResolvedProject {
  const flagship = p.slug === "high-ultra-lounge";
  return {
    ...p,
    renderMode: flagship ? "flagship" : ((p as any).renderMode as RenderMode) || "standard",
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
    ...companyOf(doc.company),
    project: doc.title,
    year: doc.year ?? undefined,
    businessCategory: (doc.businessCategory ?? []) as string[],
    services,
    campaignTypes: (doc.campaignTypes ?? []) as string[],
    heroImage: hero?.src,
    brandLogo: resolveMedia((doc as unknown as { brandLogo?: never }).brandLogo)?.src,
    // Hero video: the admin "Hero video" (upload or YouTube) wins over the older path field.
    ...((): { heroVideo?: string; heroVideoMobile?: string; heroYoutube?: string } => {
      const v = resolveVideo((doc as unknown as { heroVideoMedia?: never }).heroVideoMedia);
      if (v?.kind === "youtube") return { heroYoutube: v.youtubeId };
      if (v?.kind === "file") return { heroVideo: v.src, heroVideoMobile: v.mobileSrc };
      return { heroVideo: doc.heroVideo ?? undefined };
    })(),
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
/** Parent company for the /work "Company" filter (any status, so a brand never loses it). */
function companyOf(v: unknown): { company?: string; companySlug?: string } {
  if (!v || typeof v !== "object" || !("slug" in v)) return {};
  const o = v as Record<string, string>;
  return o.slug ? { company: o.name || o.slug, companySlug: o.slug } : {};
}

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
async function findPublishedProjects() {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "projects",
    where: { _status: { equals: "published" } },
    depth: 1,
    limit: 200,
    pagination: false,
  });
}

/**
 * Published CMS stories, already mapped. Cached across requests (tag "projects")
 * so pages don't re-run the heavy Supabase query on every visit — saving a story
 * in the admin clears it (collections/revalidateProject.ts). Errors are thrown,
 * never cached. A failed query is retried once (momentary pool hiccup).
 */
const cachedCmsProjects = unstable_cache(
  async (): Promise<ResolvedProject[]> => {
    let res;
    try {
      res = await findPublishedProjects();
    } catch (first) {
      if (isCmsNotConfiguredError(first)) throw first;
      await new Promise((r) => setTimeout(r, 400));
      res = await findPublishedProjects();
    }
    return res.docs.map(fromCms);
  },
  ["cms-published-projects"],
  { tags: ["projects"], revalidate: 3600 },
);

/** Deduped per request (React `cache`) on top of the cross-request cache. */
export const getWorkProjects = cache(async function getWorkProjects(): Promise<ResolvedProject[]> {
  // Only published static entries reach /work — no "coming soon" tiles.
  const staticResolved = staticProjects.filter(staticIsPublished).map(fromStatic);
  let cms: ResolvedProject[] = [];
  try {
    cms = await cachedCmsProjects();
  } catch (e) {
    logCmsError("getWorkProjects", e);
    return staticResolved; // static-only fallback
  }
  const bySlug = new Map<string, ResolvedProject>();
  for (const p of staticResolved) bySlug.set(p.slug, p);
  for (const c of cms) bySlug.set(c.slug, c); // CMS wins
  // Static-only stories inherit the company of the same brand from the CMS.
  const companyByBrand = new Map<string, { company?: string; companySlug?: string }>();
  for (const c of cms) if (c.companySlug) companyByBrand.set(c.brandSlug, { company: c.company, companySlug: c.companySlug });
  return [...bySlug.values()].map((p) =>
    p.companySlug || !companyByBrand.has(p.brandSlug) ? p : { ...p, ...companyByBrand.get(p.brandSlug) },
  );
});

/**
 * Resolve a single project by slug. CMS-first (published, or draft when
 * `draft`), then merges deep static content for flagship projects the CMS does
 * not fully model, then falls back to the static registry.
 */
async function findProjectDoc(slug: string, draft: boolean): Promise<CmsProject | null> {
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
  return (res.docs[0] as CmsProject) ?? null;
}

/** Published single-story read, cached across requests + deduped per request
 *  (metadata + page). Cleared by tag "projects" when a story is saved. */
const cachedProjectDoc = cache((slug: string) =>
  unstable_cache(() => findProjectDoc(slug, false), ["cms-project-doc", slug], {
    tags: ["projects"],
    revalidate: 3600,
  })(),
);

export async function getProjectBySlug(
  slug: string,
  opts: {
    draft?: boolean;
    requireCmsDraft?: boolean;
  } = {},
): Promise<ResolvedProject | null> {
  const draft = Boolean(opts.draft);
  const requireCmsDraft = Boolean(opts.requireCmsDraft);
  try {
    const doc = draft ? await findProjectDoc(slug, true) : await cachedProjectDoc(slug);
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
  /**
   * Authorised draft preview must show the exact CMS draft.
   * Never silently substitute the static registry.
   */
  if (draft && requireCmsDraft) {
    return null;
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
