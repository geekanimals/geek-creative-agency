/**
 * LAY'S GOLD STANDARD IMPORTER (Phase 11.29).
 * Run MANUALLY only (never during build or migration):
 *   export DATABASE_URL=... PAYLOAD_SECRET=...   # a clean, migration-managed DB
 *   npx tsx scripts/import-lays-gold-standard.ts
 *
 * Guarantees:
 *   • Payload Local API only.
 *   • DRAFTS ONLY — never publishes (create sets _status:draft; update uses draft:true).
 *   • Idempotent — upsert BY SLUG; a second run updates, never duplicates.
 *   • Deterministic relationship resolution by slug (no hardcoded ids).
 *   • Touches ONLY the slugs in the content pack — never the flagships or unrelated docs.
 *
 * The content pack (content/gold-standard/lays/*) is the reproducible handoff for
 * initial population. After import, Payload CMS is the editorial source of truth.
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { entities } from "../content/gold-standard/lays/entities";
import { projects } from "../content/gold-standard/lays/projects";
import type { SearchStrategy, Seo, Faq, Press, Award } from "../content/gold-standard/lays/types";

// Flagships are approved bespoke exceptions — this importer must never touch them.
const PROTECTED_SLUGS = new Set(["high-ultra-lounge", "the-coolest-job"]);

type Payload = Awaited<ReturnType<typeof getPayload>>;

const seo = (s?: Seo) => (s ? { metaTitle: s.metaTitle, metaDescription: s.metaDescription, noindex: Boolean(s.noindex) } : undefined);
const searchStrategy = (s?: SearchStrategy) => (s as Record<string, unknown> | undefined);
const faqs = (f?: Faq[]) => (f ?? []).map((x) => ({ question: x.question, answer: x.answer }));
const pressCoverage = (p?: Press[]) => (p ?? []).map((x) => ({ ...x }));
const awards = (a?: Award[]) => (a ?? []).map((x) => ({ ...x }));

/** Upsert by unique slug. Create → draft. Update → draft:true (never publishes). */
async function upsert(payload: Payload, collection: string, slug: string, data: Record<string, unknown>): Promise<number> {
  if (PROTECTED_SLUGS.has(slug)) throw new Error(`Refusing to touch protected flagship slug: ${slug}`);
  const found = await payload.find({ collection: collection as never, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true, draft: true });
  const existing = found.docs[0] as { id: number } | undefined;
  if (existing) {
    await payload.update({ collection: collection as never, id: existing.id, data: data as never, draft: true, overrideAccess: true });
    console.log(`  ~ updated ${collection}/${slug} (draft)`);
    return existing.id;
  }
  const created = await payload.create({ collection: collection as never, data: { ...data, _status: "draft" } as never, overrideAccess: true });
  console.log(`  + created ${collection}/${slug} (draft)`);
  return (created as { id: number }).id;
}

async function idBySlug(payload: Payload, collection: string, slug: string): Promise<number> {
  const r = await payload.find({ collection: collection as never, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true, draft: true });
  const doc = r.docs[0] as { id: number } | undefined;
  if (!doc) throw new Error(`Expected ${collection}/${slug} to exist after upsert`);
  return doc.id;
}
const idsBySlug = (payload: Payload, collection: string, slugs?: string[]) =>
  Promise.all((slugs ?? []).map((s) => idBySlug(payload, collection, s)));

async function main() {
  if (process.env.PAYLOAD_DB_PUSH === "true") throw new Error("Refusing to run with PAYLOAD_DB_PUSH=true. Use a migration-managed DB.");
  const payload = await getPayload({ config });
  console.log("Importing Lay's Gold Standard graph (DRAFTS ONLY)…\n");

  // 1) Industry
  const { fmcg, pepsico, lays, influencerMarketing, irm } = entities;
  console.log("Entities:");
  await upsert(payload, "business-categories", fmcg.slug, {
    name: fmcg.name, slug: fmcg.slug, shortSummary: fmcg.shortSummary, introduction: fmcg.introduction,
    faqs: faqs(fmcg.faqs), searchStrategy: searchStrategy(fmcg.searchStrategy), seo: seo(fmcg.seo),
  });
  const fmcgId = await idBySlug(payload, "business-categories", fmcg.slug);

  // 2) Company
  await upsert(payload, "companies", pepsico.slug, {
    name: pepsico.name, slug: pepsico.slug, website: pepsico.website, shortSummary: pepsico.shortSummary, introduction: pepsico.introduction,
    businessCategories: [fmcgId], faqs: faqs(pepsico.faqs), pressCoverage: pressCoverage(pepsico.press), awards: awards(pepsico.awards),
    searchStrategy: searchStrategy(pepsico.searchStrategy), seo: seo(pepsico.seo),
  });
  const pepsicoId = await idBySlug(payload, "companies", pepsico.slug);

  // 3) Brand
  await upsert(payload, "brands", lays.slug, {
    name: lays.name, slug: lays.slug, company: pepsicoId, portfolioGroup: lays.portfolioGroup,
    shortSummary: lays.shortSummary, introduction: lays.introduction, businessCategories: [fmcgId],
    faqs: faqs(lays.faqs), pressCoverage: pressCoverage(lays.press), awards: awards(lays.awards),
    searchStrategy: searchStrategy(lays.searchStrategy), seo: seo(lays.seo),
  });

  // 4) Service
  await upsert(payload, "services", influencerMarketing.slug, {
    label: influencerMarketing.label, slug: influencerMarketing.slug, order: influencerMarketing.order,
    hero: influencerMarketing.hero, introduction: influencerMarketing.introduction,
    capabilities: influencerMarketing.capabilities, approach: influencerMarketing.approach,
    faqs: faqs(influencerMarketing.faqs), searchStrategy: searchStrategy(influencerMarketing.searchStrategy), seo: seo(influencerMarketing.seo),
  });
  const imId = await idBySlug(payload, "services", influencerMarketing.slug);

  // 5) Solution
  await upsert(payload, "solutions", irm.slug, {
    name: irm.name, slug: irm.slug, solutionType: irm.solutionType, shortSummary: irm.shortSummary, introduction: irm.introduction,
    relatedServices: [imId], whatItSolves: irm.whatItSolves, methodology: irm.methodology,
    faqs: faqs(irm.faqs), pressCoverage: pressCoverage(irm.press), searchStrategy: searchStrategy(irm.searchStrategy), seo: seo(irm.seo),
  });

  // 6) Projects (resolve relationships by slug)
  console.log("\nProjects:");
  for (const p of projects) {
    const companyId = p.companySlug ? await idBySlug(payload, "companies", p.companySlug) : undefined;
    const brandId = p.brandSlug ? await idBySlug(payload, "brands", p.brandSlug) : undefined;
    const industryIds = await idsBySlug(payload, "business-categories", p.businessCategorySlugs);
    const serviceIds = await idsBySlug(payload, "services", p.serviceSlugs);
    const solutionIds = await idsBySlug(payload, "solutions", p.solutionSlugs);
    await upsert(payload, "projects", p.slug, {
      title: p.title, headline: p.headline, slug: p.slug, client: p.client, year: p.year,
      shortSummary: p.shortSummary, cardSummary: p.cardSummary,
      renderMode: p.renderMode ?? "flexible", projectKind: p.projectKind, heroLegacySrc: p.heroLegacySrc,
      company: companyId, brand: brandId, businessCategories: industryIds, services: serviceIds, solutions: solutionIds,
      sections: p.sections, metrics: p.metrics,
      faqs: faqs(p.faqs), pressCoverage: pressCoverage(p.press), awards: awards(p.awards),
      searchStrategy: searchStrategy(p.searchStrategy), seo: seo(p.seo),
    });
  }

  console.log(`\nDone. ${5 + projects.length} records upserted as DRAFTS. CMS is now the source of truth.`);
  process.exit(0);
}
main().catch((e) => { console.error("Import failed:", e instanceof Error ? e.message : e); process.exit(1); });
