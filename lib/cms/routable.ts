/**
 * Public-routability policy — the SINGLE source of truth for "does this entity
 * have a public landing page?" (distinct from "exists as taxonomy/relation").
 * Used by page render, sitemap, generateStaticParams, and every internal link so
 * we never emit a link to a page that will 404. An entity is routable when it is
 * published AND has substantive public content FOR ITS TYPE. Operates on a doc
 * populated to at least depth 1 (its own top-level fields present).
 *
 * Deliberately CONTENT-LED: internal Search Strategy and the Gold Standard
 * evidence layers (press / awards / FAQ) are NOT considered here, so an entity
 * carrying only SEO research or press metadata never becomes public-routable
 * (Phase 11.26, Section 28). Kept in a plain (non "server-only") module so it can
 * be unit-tested; portfolio.ts re-exports it for existing server-side callers.
 */
export function entityIsPublicRoutable(collection: string, doc: unknown): boolean {
  const d = doc as Record<string, unknown> | null | undefined;
  if (!d || typeof d !== "object") return false;
  if (typeof d._status === "string" && d._status !== "published") return false;
  if (!d.slug) return false;
  const has = (k: string) => typeof d[k] === "string" && (d[k] as string).trim().length > 0;
  const hasArr = (k: string) => Array.isArray(d[k]) && (d[k] as unknown[]).length > 0;
  switch (collection) {
    case "services": {
      const hero = d.hero as { heading?: string; shortSummary?: string } | undefined;
      return Boolean(hero?.heading || hero?.shortSummary) || has("introduction") || hasArr("capabilities") || has("approach");
    }
    case "business-categories":
    case "companies":
    case "brands":
    case "solutions":
      return has("introduction") || has("shortSummary");
    default:
      return false;
  }
}
