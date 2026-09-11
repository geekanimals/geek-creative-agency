import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import {
  type Article,
  articles as staticArticles,
  articleBySlug as staticBySlug,
  visibleArticles as staticVisible,
  publishedArticles as staticPublished,
  isProd,
} from "@/lib/insights";
import type { Insight as CmsInsight, Media as CmsMedia } from "@/payload-types";

/** Lexical body value as generated for the Insight collection. */
type LexicalBody = NonNullable<CmsInsight["body"]>;

/**
 * Resolved article = the existing static Article shape (what the cards + detail
 * template already consume) plus an optional Lexical `bodyRich` for CMS pieces
 * and the source tag. Everything downstream renders one shape.
 */
export type ResolvedInsight = Article & { bodyRich?: LexicalBody; source: "cms" | "static" };

function logCmsError(context: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${context} failed; falling back to static Insights:`, e instanceof Error ? e.message : e);
}

const fromStatic = (a: Article): ResolvedInsight => ({ ...a, source: "static" });

/* ── reading time: derive from the Lexical body (≈200 wpm, min 1) ─────────── */
function lexicalText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: unknown; children?: unknown[] };
  let out = typeof n.text === "string" ? `${n.text} ` : "";
  if (Array.isArray(n.children)) for (const c of n.children) out += lexicalText(c);
  return out;
}
function readingMinutes(body: LexicalBody | undefined): number | undefined {
  if (!body?.root) return undefined;
  const words = lexicalText(body.root).trim().split(/\s+/).filter(Boolean).length;
  return words ? Math.max(1, Math.round(words / 200)) : undefined;
}

/* ── CMS doc → ResolvedInsight ────────────────────────────────────────────── */
function fromCms(doc: CmsInsight, opts: { withBody?: boolean } = {}): ResolvedInsight {
  const hero = resolveMedia(doc.heroMedia as CmsMedia | number | null | undefined, doc.heroLegacySrc);
  const og = resolveMedia(doc.seo?.ogImage as CmsMedia | number | null | undefined);
  const body = opts.withBody ? (doc.body as LexicalBody | undefined) : undefined;
  return {
    slug: doc.slug ?? String(doc.id),
    title: doc.title,
    category: doc.category,
    dek: doc.excerpt ?? undefined,
    date: doc.publishDate ?? undefined,
    readMins: opts.withBody ? readingMinutes(body) : undefined,
    heroImage: hero?.src,
    ogImage: og?.src,
    seoTitle: doc.seo?.metaTitle ?? undefined,
    metaDescription: doc.seo?.metaDescription ?? undefined,
    bodyRich: body,
    publishStatus: doc._status === "published" ? "published" : "draft",
    source: "cms",
  };
}

/* Card fields only — never pull the (large) Lexical body for the list view.
 * `_status` is required so published/draft is classified correctly. */
const CARD_SELECT = {
  title: true, slug: true, excerpt: true, category: true,
  heroMedia: true, heroLegacySrc: true, publishDate: true, _status: true,
} as const;

/**
 * Unified Insights index: the approved static articles (in prod: published
 * only; in dev: all placeholders) with PUBLISHED CMS articles overriding by
 * slug, plus CMS-only articles, newest published first. On any CMS error, falls
 * back to the pure static list so /insights never goes down. Body is NOT loaded.
 */
const cachedIndex = unstable_cache(
  async (): Promise<ResolvedInsight[]> => {
    const staticList = (isProd ? staticPublished() : staticVisible()).map(fromStatic);
    let cms: ResolvedInsight[] = [];
    try {
      const payload = await getPayloadClient();
      const res = await payload.find({
        collection: "insights",
        where: { _status: { equals: "published" } },
        select: CARD_SELECT as unknown as Record<string, true>,
        depth: 1,
        limit: 500,
        pagination: false,
      });
      cms = res.docs.map((d) => fromCms(d as CmsInsight));
    } catch (e) {
      logCmsError("getInsightsIndex", e);
      return sortByDate(staticList);
    }
    const bySlug = new Map<string, ResolvedInsight>();
    for (const a of staticList) bySlug.set(a.slug, a);
    for (const c of cms) bySlug.set(c.slug, c); // CMS published wins by slug
    return sortByDate([...bySlug.values()]);
  },
  ["insights-index"],
  { tags: ["insights"], revalidate: 3600 },
);

function sortByDate(list: ResolvedInsight[]): ResolvedInsight[] {
  return [...list].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function getInsightsIndex(): Promise<ResolvedInsight[]> {
  return cachedIndex();
}

/** Count of publicly published articles (CMS published ∪ static published). */
export async function getPublishedInsightsCount(): Promise<number> {
  try {
    const list = await cachedIndex();
    return list.filter((a) => a.publishStatus === "published").length;
  } catch {
    return staticPublished().length;
  }
}

/**
 * Resolve a single article by slug. CMS-first (published, or draft when `draft`
 * and preview is authorised upstream), else the static registry. A CMS
 * draft-only piece does NOT hide a static published article: the non-draft path
 * queries published only, so it falls through to static.
 */
export async function getInsightBySlug(slug: string, opts: { draft?: boolean } = {}): Promise<ResolvedInsight | null> {
  const draft = Boolean(opts.draft);
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "insights",
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
      draft,
      overrideAccess: draft, // preview is gated upstream by a validated secret
      pagination: false,
    });
    const doc = res.docs[0] as CmsInsight | undefined;
    if (doc && (draft || doc._status === "published")) return fromCms(doc, { withBody: true });
  } catch (e) {
    logCmsError(`getInsightBySlug(${slug})`, e);
  }
  const s = staticBySlug(slug);
  return s ? fromStatic(s) : null;
}

/** All routable slugs (static ∪ published CMS) for generateStaticParams. */
export async function getAllInsightSlugs(includeDrafts = false): Promise<string[]> {
  const slugs = new Set<string>((includeDrafts ? staticArticles : staticPublished()).map((a) => a.slug));
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "insights",
      where: includeDrafts ? {} : { _status: { equals: "published" } },
      select: { slug: true } as unknown as Record<string, true>,
      depth: 0,
      limit: 1000,
      pagination: false,
    });
    for (const d of res.docs) if (d.slug) slugs.add(d.slug as string);
  } catch (e) {
    logCmsError("getAllInsightSlugs", e);
  }
  return [...slugs];
}
