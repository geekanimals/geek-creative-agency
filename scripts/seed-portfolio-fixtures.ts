/**
 * STAGING-ONLY fixtures that prove the portfolio relationship graph (Phase
 * 11.25). All entity/project fixtures are created as DRAFTS and clearly labelled
 * — they are NOT production content and are blocked from production by
 * assertStagingFixturesAllowed. They exercise the gold-standard graph:
 *
 *   FMCG → PepsiCo → Lay's → Influencer Marketing → IRM → Friends of Lay's
 *   FMCG → PepsiCo → Lay's → Influencer Marketing → Heartwork
 *
 * It ALSO backfills existing Services to _status=published (required after
 * enabling drafts on Services so the /work taxonomy + project service tags keep
 * working — service PAGES still stay hidden until they have editorial content).
 *
 * Run on Node 22:
 *   set -a; . ./.env; . ./.env.local; set +a
 *   PAYLOAD_DB_PUSH=true ALLOW_STAGING_FIXTURES=true npx tsx scripts/seed-portfolio-fixtures.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { assertStagingFixturesAllowed } from "./_guards";

async function main() {
  assertStagingFixturesAllowed("seed-portfolio-fixtures.ts");
  const payload = await getPayload({ config });
  const log = (m: string) => console.log(`  ${m}`);

  // ── Backfill: existing services → published (taxonomy must keep resolving) ──
  const svc = await payload.find({ collection: "services", where: {}, limit: 1000, pagination: false, draft: true });
  let backfilled = 0;
  for (const s of svc.docs as { id: number; _status?: string }[]) {
    if (s._status !== "published") { await payload.update({ collection: "services", id: s.id, data: { _status: "published" } as never }); backfilled++; }
  }
  log(`services backfilled to published: ${backfilled} (of ${svc.docs.length})`);

  const findId = async (collection: string, slug: string) => {
    // Check published (base row) first, then drafts — pre-existing published
    // rows may have no version entry and are missed by a drafts-only find.
    const pub = await payload.find({ collection: collection as never, where: { slug: { equals: slug } }, limit: 1, pagination: false });
    if (pub.docs[0]) return (pub.docs[0] as { id?: number }).id;
    const dr = await payload.find({ collection: collection as never, where: { slug: { equals: slug } }, limit: 1, pagination: false, draft: true });
    return (dr.docs[0] as { id?: number } | undefined)?.id;
  };
  const ensure = async (collection: string, slug: string, data: Record<string, unknown>, status: "draft" | "published" = "draft") => {
    const existing = await findId(collection, slug);
    if (existing) { log(`${collection}/${slug}: exists → skipped`); return existing; }
    const doc = await payload.create({ collection: collection as never, draft: status === "draft", data: { ...data, slug, _status: status } as never });
    log(`${collection}/${slug}: seeded (${status})`);
    return (doc as { id: number }).id;
  };

  // Influencer Marketing SERVICE must exist + be published (taxonomy row).
  const imService = (await findId("services", "influencer-marketing"))
    ?? (await ensure("services", "influencer-marketing", { label: "Influencer Marketing", order: 50 }, "published"));

  // Entities (DRAFT fixtures)
  const fmcg = await ensure("business-categories", "fmcg", { name: "FMCG", shortSummary: "STAGING FIXTURE — fast-moving consumer goods." });
  const pepsico = await ensure("companies", "pepsico", { name: "PepsiCo", shortSummary: "STAGING FIXTURE.", businessCategories: [fmcg] });
  const lays = await ensure("brands", "lays", { name: "Lay's", company: pepsico, portfolioGroup: "Foods", businessCategories: [fmcg], shortSummary: "STAGING FIXTURE." });
  await ensure("brands", "pepsi", { name: "Pepsi", company: pepsico, portfolioGroup: "Beverages", businessCategories: [fmcg], shortSummary: "STAGING FIXTURE." });
  const irm = await ensure("solutions", "influencer-relationship-management", {
    name: "Influencer Relationship Management", solutionType: "proprietary-ip", shortSummary: "STAGING FIXTURE — reusable IRM system.", relatedServices: [imService],
  });

  // Projects (DRAFT fixtures) — company derived from brand by the Project hook.
  await ensure("projects", "fixture-friends-of-lays", {
    title: "Friends of Lay's (fixture)", renderMode: "standard", projectKind: "ongoing-program",
    brand: lays, services: [imService], solutions: [irm], businessCategories: [fmcg], shortSummary: "STAGING FIXTURE.",
  });
  await ensure("projects", "fixture-heartwork", {
    title: "Heartwork (fixture)", renderMode: "standard", projectKind: "campaign",
    brand: lays, services: [imService], businessCategories: [fmcg], shortSummary: "STAGING FIXTURE.",
  });

  console.log("Portfolio fixtures complete.");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
