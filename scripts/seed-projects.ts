/**
 * Dev/staging seed for the Projects CMS. IDEMPOTENT and SAFE:
 *   - creates records only when the slug does not already exist (never
 *     overwrites editor changes on re-run);
 *   - seeds the Services taxonomy, the two flagship envelopes (High Ultra Lounge,
 *     The Coolest Job) mirrored from the static registry, and standard/flexible/
 *     draft demo projects to prove the generic engine.
 * Run on Node 22 with env loaded:  set -a; . ./.env.local; set +a; npx tsx scripts/seed-projects.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { projectBySlug } from "../lib/work/projects";
import { services as serviceTaxonomy } from "../lib/work/taxonomy";
import { assertStagingFixturesAllowed } from "./_guards";

const lex = (text: string) => ({
  root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr" as const,
    children: [{ type: "paragraph", version: 1, format: "", indent: 0, direction: "ltr" as const,
      children: [{ type: "text", version: 1, text, format: 0, style: "", mode: "normal" as const, detail: 0 }] }] },
});

async function main() {
  assertStagingFixturesAllowed("seed-projects.ts");
  const payload = await getPayload({ config });
  const log = (m: string) => console.log(`  ${m}`);

  // ── Services taxonomy ──
  const serviceIdBySlug = new Map<string, number | string>();
  for (const s of serviceTaxonomy) {
    const found = await payload.find({ collection: "services", where: { slug: { equals: s.slug } }, limit: 1, pagination: false });
    if (found.docs[0]) { serviceIdBySlug.set(s.slug, found.docs[0].id); continue; }
    const created = await payload.create({ collection: "services", data: { label: s.label, slug: s.slug } });
    serviceIdBySlug.set(s.slug, created.id);
  }
  log(`services: ${serviceIdBySlug.size} present`);
  const svc = (slugs: string[]) => slugs.map((sl) => serviceIdBySlug.get(sl)).filter(Boolean) as (number | string)[];

  async function upsert(slug: string, build: () => Record<string, unknown>) {
    const existing = await payload.find({ collection: "projects", where: { slug: { equals: slug } }, limit: 1, pagination: false, draft: true });
    if (existing.docs[0]) { log(`project "${slug}": exists → skipped`); return; }
    await payload.create({ collection: "projects", data: build() as never });
    log(`project "${slug}": created`);
  }

  // ── Flagship: High Ultra Lounge (envelope mirrors static; renderer bespoke) ──
  const high = projectBySlug("high-ultra-lounge");
  if (high) await upsert("high-ultra-lounge", () => ({
    title: high.project, slug: "high-ultra-lounge", client: high.brand, year: high.year, location: "Bengaluru",
    renderMode: "flagship", flagshipRendererKey: "high-ultra-lounge",
    headline: high.headline, shortSummary: high.oneLineSummary,
    heroLegacySrc: high.heroImage, featured: true, order: 20,
    businessCategory: high.businessCategory, campaignTypes: high.campaignTypes, services: svc(high.services),
    seo: { metaTitle: high.seoTitle, metaDescription: high.metaDescription },
    _status: "published",
  }));

  // ── Flagship: The Coolest Job (envelope; execution stays code-controlled) ──
  const cj = projectBySlug("the-coolest-job");
  if (cj) await upsert("the-coolest-job", () => ({
    title: cj.project, slug: "the-coolest-job", client: cj.brand, year: cj.year,
    renderMode: "flagship", flagshipRendererKey: "the-coolest-job",
    headline: cj.headline, shortSummary: cj.oneLineSummary,
    heroLegacySrc: cj.heroImage, heroVideo: cj.heroVideo, featured: true, order: 10,
    businessCategory: cj.businessCategory, campaignTypes: cj.campaignTypes, services: svc(cj.services),
    seo: { metaTitle: cj.seoTitle, metaDescription: cj.metaDescription },
    _status: "published",
  }));

  const demoHero = "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg";

  // ── Standard demo (published) ──
  await upsert("cms-standard-demo", () => ({
    title: "Standard Mode Demo", slug: "cms-standard-demo", client: "Demo Client", year: 2026,
    renderMode: "standard", headline: "A STRUCTURED\nCASE STUDY,\nFROM THE CMS.",
    shortSummary: "Proving the shared editorial template renders end-to-end from Payload.",
    heroLegacySrc: demoHero, featured: false, order: 500,
    businessCategory: ["fmcg"], campaignTypes: ["social-campaign"], services: svc(["creative-strategy", "social-media"]),
    challenge: { question: "Can a normal project be built without touching code?", copy: "Editors choose Standard mode, fill the story, and publish." },
    insight: "Most case studies share the same spine: challenge, insight, idea, execution, outcome.",
    idea: { statement: "One predictable structure, many projects.", copy: "The shared React template renders it consistently." },
    outcome: "A repeatable editorial system that scales without developers.",
    metrics: [{ value: "3", label: "Render modes" }, { value: "9", label: "Flexible blocks" }],
    seo: { metaDescription: "Standard-mode CMS demo project." },
    _status: "published",
  }));

  // ── Flexible demo (published, with sections) ──
  await upsert("cms-flexible-demo", () => ({
    title: "Flexible Mode Demo", slug: "cms-flexible-demo", client: "Demo Studio", year: 2026,
    renderMode: "flexible", headline: "BUILT FROM\nCONTENT BLOCKS.",
    shortSummary: "Proving CMS-managed modular sections render as an editorial page.",
    heroLegacySrc: demoHero, featured: false, order: 501,
    businessCategory: ["lifestyle"], campaignTypes: ["digital-campaign"], services: svc(["digital", "content"]),
    sections: [
      { blockType: "sectionIntro", eyebrow: "How it works", heading: "Editors compose sections", body: "No developer needed for a flexible story." },
      { blockType: "richText", content: lex("This paragraph is authored in the CMS rich-text editor and rendered by React on the frontend.") },
      { blockType: "mediaBlock", legacySrc: demoHero, caption: "Legacy /public/assets image — no migration needed.", alt: "Rooftop venue at night" },
      { blockType: "metrics", heading: "The numbers", items: [{ value: "27.5M+", label: "Engagements" }, { value: "2,229", label: "Creators" }] },
      { blockType: "quote", quote: "The medium changed. Our job didn't: make brands matter.", attribution: "Geek" },
      { blockType: "cta", heading: "Make it matter.", body: "This closing block is fully CMS-driven.", buttonLabel: "See the work", buttonHref: "/work" },
    ],
    seo: { metaDescription: "Flexible-mode CMS demo project." },
    _status: "published",
  }));

  // ── Draft demo (NOT published — proves drafts never leak) ──
  await upsert("cms-draft-demo", () => ({
    title: "Draft Mode Demo", slug: "cms-draft-demo", client: "Unpublished Co", renderMode: "standard",
    headline: "THIS IS A DRAFT.", shortSummary: "Should never appear publicly on /work or its route.",
    heroLegacySrc: demoHero, businessCategory: ["retail"], _status: "draft",
  }));

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
