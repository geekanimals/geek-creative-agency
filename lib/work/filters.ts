import { CaseStudy } from "./types";
import { projects, publishedProjects } from "./projects";
import {
  TaxonomyItem,
  businessCategories,
  services,
  campaignTypes,
  FilterKey,
} from "./taxonomy";

export type Filters = Record<FilterKey, string[]>;

export const emptyFilters = (): Filters => ({
  category: [],
  brand: [],
  service: [],
  campaign: [],
});

/** Brands are derived from project data — never maintained as a second list. */
export function deriveBrands(list: CaseStudy[] = projects): TaxonomyItem[] {
  const map = new Map<string, string>();
  for (const p of list) if (!map.has(p.brandSlug)) map.set(p.brandSlug, p.brand);
  return [...map.entries()]
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export const brandLabelMap = (list?: CaseStudy[]): Record<string, string> =>
  Object.fromEntries(deriveBrands(list).map((b) => [b.slug, b.label]));

/** The four filter groups, in display order. Brand is derived at call time. */
export function filterGroups(list?: CaseStudy[]): { key: FilterKey; label: string; items: TaxonomyItem[] }[] {
  return [
    { key: "category", label: "Business Category", items: businessCategories },
    { key: "brand", label: "Brand", items: deriveBrands(list) },
    { key: "service", label: "Service", items: services },
    { key: "campaign", label: "Campaign Type", items: campaignTypes },
  ];
}

// ── URL <-> Filters (comma-separated values per key) ──────────────────────
type SP = { get(key: string): string | null };

export function parseFilters(sp: SP): Filters {
  const read = (k: string) =>
    (sp.get(k) ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return {
    category: read("category"),
    brand: read("brand"),
    service: read("service"),
    campaign: read("campaign"),
  };
}

export function serializeFilters(f: Filters): string {
  const params = new URLSearchParams();
  if (f.category.length) params.set("category", f.category.join(","));
  if (f.brand.length) params.set("brand", f.brand.join(","));
  if (f.service.length) params.set("service", f.service.join(","));
  if (f.campaign.length) params.set("campaign", f.campaign.join(","));
  return params.toString();
}

export const countActive = (f: Filters): number =>
  f.category.length + f.brand.length + f.service.length + f.campaign.length;

// ── Filtering: OR within a group, AND across groups ───────────────────────
const overlaps = (a: string[], b: string[]) => a.some((x) => b.includes(x));

export function filterProjects(f: Filters, list: CaseStudy[] = projects): CaseStudy[] {
  return list.filter((p) => {
    if (f.category.length && !overlaps(p.businessCategory, f.category)) return false;
    if (f.brand.length && !f.brand.includes(p.brandSlug)) return false;
    if (f.service.length && !overlaps(p.services, f.service)) return false;
    if (f.campaign.length && !overlaps(p.campaignTypes, f.campaign)) return false;
    return true;
  });
}

// ── Related work: weighted similarity (adjust weights in one place) ───────
export const RELATED_WEIGHTS = {
  sameBrand: 5,
  sameCategory: 4, // per shared category
  sameCampaignType: 3, // per shared campaign type
  sharedService: 1, // per shared service
};

export function relatedScore(a: CaseStudy, b: CaseStudy): number {
  const shared = (x: string[], y: string[]) => x.filter((v) => y.includes(v)).length;
  return (
    (a.brandSlug === b.brandSlug ? RELATED_WEIGHTS.sameBrand : 0) +
    RELATED_WEIGHTS.sameCategory * shared(a.businessCategory, b.businessCategory) +
    RELATED_WEIGHTS.sameCampaignType * shared(a.campaignTypes, b.campaignTypes) +
    RELATED_WEIGHTS.sharedService * shared(a.services, b.services)
  );
}

export function relatedProjects(current: CaseStudy, limit = 3, list: CaseStudy[] = publishedProjects()): CaseStudy[] {
  return list
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ p, score: relatedScore(current, p) }))
    // ties → prefer featured
    .sort((a, b) => b.score - a.score || Number(!!b.p.featured) - Number(!!a.p.featured))
    .slice(0, limit)
    .map((s) => s.p);
}

/**
 * Next project — a case study must NEVER recommend itself.
 * Priority: explicit `nextProject` (if published & not self) → highest-scoring
 * related published project → any other published project → undefined (which
 * makes the template hide the Next Project section entirely).
 */
export function nextProjectFor(current: CaseStudy, list: CaseStudy[] = publishedProjects()): CaseStudy | undefined {
  const others = list.filter((p) => p.slug !== current.slug);
  if (others.length === 0) return undefined; // no other published project → hide

  if (current.nextProject) {
    const explicit = others.find((p) => p.slug === current.nextProject);
    if (explicit) return explicit;
  }
  // highest-scoring related published project (already excludes self)
  const related = relatedProjects(current, 1, list);
  return related[0] ?? others[0];
}
