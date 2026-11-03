/**
 * Only what a work tile shows. WorkExplorer is a client component, so whatever
 * it receives is shipped to the browser — sending whole case studies made /work
 * pages ~0.5 MB of HTML. Keep this in sync with components/work/list/WorkTile.jsx.
 */
export const tileFields = (p) => ({
  slug: p.slug,
  brand: p.brand,
  project: p.project,
  businessCategory: p.businessCategory,
  heroImage: p.heroImage ?? null,
  heroImageNeed: p.heroImageNeed ?? null,
});
