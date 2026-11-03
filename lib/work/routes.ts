/**
 * Work routes — short URLs that follow the path the visitor took:
 *
 *   /work                               all work
 *   /work/<story>                       a case study                /work/the-coolest-job
 *   /work/<value>                       work for one filter         /work/fmcg
 *   /work/<value>/<value>               filters stacked in the order picked
 *                                                                   /work/fmcg/doritos
 *   /work/<value>/.../<story>           a case study opened from that page
 *                                                                   /work/fmcg/doritos/doritos-for-the-bold
 *
 * At most one value per dimension (business category, brand, service, campaign
 * type): picking another value of the same dimension replaces it in place.
 *
 * Values from all four dimensions (business category, brand, service, campaign
 * type) share the /work/<value> space. When a value has the same slug as a case
 * study (e.g. brand "tanishq" and the story "tanishq"), the story wins: that brand
 * has one story, so /work/tanishq simply opens it. Every link is built here.
 */
import { CaseStudy } from "./types";
import { FilterKey } from "./taxonomy";
import { emptyFilters, filterGroups, filterProjects } from "./filters";

export type WorkDimension = {
  key: FilterKey;
  segment: string;
  label: string;
  plural: string;
  intro: string;
};

export const WORK_DIMENSIONS: WorkDimension[] = [
  {
    key: "category",
    segment: "category",
    label: "Business Category",
    plural: "Business Categories",
    intro: "Our work, grouped by the business we were building for.",
  },
  {
    key: "company",
    segment: "company",
    label: "Company",
    plural: "Companies",
    intro: "Our work, grouped by the company behind each brand.",
  },
  {
    key: "brand",
    segment: "brand",
    label: "Brand",
    plural: "Brands",
    intro: "Every brand we have built, launched or grown, and the work behind it.",
  },
  {
    key: "service",
    segment: "service",
    label: "Service",
    plural: "Services",
    intro: "Our work, grouped by what Geek actually did on it.",
  },
  {
    key: "campaign",
    segment: "campaign-type",
    label: "Campaign Type",
    plural: "Campaign Types",
    intro: "Our work, grouped by the kind of campaign or project it was.",
  },
];

export const dimensionByKey = (key: string): WorkDimension | undefined =>
  WORK_DIMENSIONS.find((d) => d.key === key);

/** /work/lays — the page for one filter value (or the story with that slug). */
export function workFilterHref(_key: FilterKey, slug: string): string {
  return `/work/${slug}`;
}

export type DimensionOption = {
  slug: string;
  label: string;
  href: string;
  count: number;
  cover?: string;
  coverNeed?: string;
};

/** Projects matching exactly one value of one dimension. */
export function projectsFor<T extends CaseStudy>(key: FilterKey, slug: string, list: T[]): T[] {
  return filterProjects({ ...emptyFilters(), [key]: [slug] }, list) as T[];
}

/**
 * All values of one dimension that at least one project uses, in taxonomy
 * order, with their project count and a cover image from the first project.
 */
export function dimensionOptions(key: FilterKey, list: CaseStudy[]): DimensionOption[] {
  const group = filterGroups(list).find((g) => g.key === key);
  if (!group) return [];
  // Give each card its own picture where possible: prefer a project whose image
  // has not already been used as a cover for an earlier option.
  const usedCovers = new Set<string>();
  return group.items
    .map((it) => {
      const matches = projectsFor(key, it.slug, list);
      const withImage =
        matches.find((p) => p.heroImage && !usedCovers.has(p.heroImage)) ??
        matches.find((p) => p.heroImage);
      if (withImage?.heroImage) usedCovers.add(withImage.heroImage);
      return {
        slug: it.slug,
        label: it.label,
        href: workFilterHref(key, it.slug),
        count: matches.length,
        cover: withImage?.heroImage,
        coverNeed: matches[0]?.heroImageNeed,
      };
    })
    .filter((o) => o.count > 0);
}

/** Every /work/<value> slug that is a filter page (not a story) — for static params and the sitemap. */
export function workValueSlugs(list: CaseStudy[]): string[] {
  const stories = new Set(list.map((p) => p.slug));
  const seen = new Set<string>();
  for (const d of WORK_DIMENSIONS) {
    for (const o of dimensionOptions(d.key, list)) {
      if (!stories.has(o.slug)) seen.add(o.slug);
    }
  }
  return [...seen];
}

/**
 * Old /work?brand=lays style links → the new route. Uses the first value of the
 * first filter found. Also accepts the
 * new segment name (?campaign-type=…). Returns null when there is nothing to map.
 */
export function legacyWorkHref(params: { get(key: string): string | null }): string | null {
  for (const d of WORK_DIMENSIONS) {
    const raw = params.get(d.key) ?? params.get(d.segment);
    const first = raw?.split(",").map((s) => s.trim()).find(Boolean);
    if (first) return workFilterHref(d.key, first);
  }
  return null;
}

// ── Stacked filter paths ────────────────────────────────────────────────────

export type PathFilter = { dimension: WorkDimension; option: DimensionOption };
export type ResolvedWorkPath = { filters: PathFilter[]; story: string | null };

/** A filter value by slug, in any dimension (no story check). */
function valueAnywhere(slug: string, list: CaseStudy[]): PathFilter | null {
  for (const d of WORK_DIMENSIONS) {
    const option = dimensionOptions(d.key, list).find((o) => o.slug === slug);
    if (option) return { dimension: d, option };
  }
  return null;
}

/**
 * Reads /work/<a>/<b>/... into filters (+ an optional story at the end).
 * Every segment except the last must be a filter value; the last one is a story
 * when a case study has that slug, otherwise a filter value. Two values of the
 * same dimension, or an unknown segment, → null (404).
 */
export function resolveWorkPath(segments: string[], list: CaseStudy[]): ResolvedWorkPath | null {
  if (segments.length === 0) return { filters: [], story: null };
  const last = segments[segments.length - 1];
  const isStory = list.some((p) => p.slug === last);
  const valueSegs = isStory ? segments.slice(0, -1) : segments;
  const filters: PathFilter[] = [];
  for (const seg of valueSegs) {
    const f = valueAnywhere(seg, list);
    if (!f || filters.some((x) => x.dimension.key === f.dimension.key)) return null;
    filters.push(f);
  }
  return { filters, story: isStory ? last : null };
}

/** URL for a list of filter slugs (in order). */
export const workPathHref = (slugs: string[]): string =>
  slugs.length ? `/work/${slugs.join("/")}` : "/work";

/** Projects matching every filter (AND across dimensions). */
export function projectsForFilters<T extends CaseStudy>(filters: PathFilter[], list: T[]): T[] {
  return filters.reduce((acc, f) => projectsFor(f.dimension.key, f.option.slug, acc), list);
}

/**
 * The filter bar for a page with `filters` already applied. Each option's link
 * keeps the current path: a new dimension is appended, the same dimension is
 * replaced in place, and the active value removes itself. Counts are what you
 * would get after clicking, so no option leads to an empty page.
 */
export function workPathMenu(filters: PathFilter[], list: CaseStudy[]) {
  const slugs = filters.map((f) => f.option.slug);
  return WORK_DIMENSIONS.map((d) => {
    const idx = filters.findIndex((f) => f.dimension.key === d.key);
    const others = filters.filter((f) => f.dimension.key !== d.key);
    const base = projectsForFilters(others, list);
    const items = dimensionOptions(d.key, base).map((o) => {
      const next = [...slugs];
      if (idx >= 0) next[idx] = o.slug;
      else next.push(o.slug);
      return { slug: o.slug, label: o.label, count: o.count, href: workPathHref(next) };
    });
    const active = idx >= 0 ? filters[idx].option.slug : null;
    const clearHref = idx >= 0 ? workPathHref(slugs.filter((_, i) => i !== idx)) : null;
    return { key: d.key, label: d.label, plural: d.plural, items, active, clearHref };
  });
}
