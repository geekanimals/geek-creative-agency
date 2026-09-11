/**
 * Seed representative INSIGHTS articles to prove the publishing architecture.
 *
 * The existing static Insights are dev-only placeholders (no real published
 * article exists to migrate), so these are clearly-labelled STAGING test pieces
 * — remove or replace them before any real Insights launch. They exercise every
 * path: basic prose, media + rich structure, a duplicate slug (CMS wins over a
 * static placeholder), and a draft (preview / draft-security).
 *
 * IDEMPOTENT: matches by slug and only CREATES missing pieces — never overwrites
 * editor changes on re-run. Publication dates are set explicitly (never the
 * migration timestamp) so ordering/SEO/sitemap reflect intended dates.
 *
 * Run on Node 22:
 *   set -a; . ./.env; . ./.env.local; set +a
 *   PAYLOAD_DB_PUSH=true npx tsx scripts/seed-insights.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { assertStagingFixturesAllowed } from "./_guards";

/* ── minimal Lexical builders (valid SerializedEditorState nodes) ─────────── */
const txt = (text: string) => ({ type: "text", text, format: 0, detail: 0, mode: "normal", style: "", version: 1 });
const p = (text: string) => ({ type: "paragraph", version: 1, direction: "ltr", format: "", indent: 0, children: [txt(text)] });
const h2 = (text: string) => ({ type: "heading", tag: "h2", version: 1, direction: "ltr", format: "", indent: 0, children: [txt(text)] });
const ul = (items: string[]) => ({
  type: "list", listType: "bullet", tag: "ul", start: 1, version: 1, direction: "ltr", format: "", indent: 0,
  children: items.map((t, i) => ({ type: "listitem", value: i + 1, version: 1, direction: "ltr", format: "", indent: 0, children: [txt(t)] })),
});
const quote = (text: string) => ({ type: "quote", version: 1, direction: "ltr", format: "", indent: 0, children: [txt(text)] });
const doc = (children: object[]) => ({ root: { type: "root", version: 1, direction: "ltr", format: "", indent: 0, children } });

type Seed = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishDate: string;
  heroLegacySrc?: string;
  body: object;
  status: "published" | "draft";
};

const SEEDS: Seed[] = [
  {
    slug: "state-of-the-creator-economy-2025",
    title: "Sample — The State of the Creator Economy",
    category: "creator-economy",
    excerpt: "STAGING TEST ARTICLE. A basic-prose piece proving the Insights publishing pipeline end to end.",
    publishDate: "2025-06-15",
    heroLegacySrc: "/assets/insights/creator-economy/hero.jpg",
    body: doc([
      p("This is a staging test article used to validate the Insights CMS. It contains only prose."),
      p("Creators are no longer a channel — they are the medium. Brands that treat the creator relationship as a long-term partnership outperform those that treat it as a media buy."),
      p("Replace this placeholder with real editorial before launch."),
    ]),
    status: "published",
  },
  {
    slug: "what-makes-a-brand-matter",
    title: "Sample — What Makes a Brand Matter",
    category: "brand-building",
    excerpt: "STAGING TEST ARTICLE. Richer structure — heading, list and a pull quote — plus a hero image.",
    publishDate: "2025-07-20",
    heroLegacySrc: "/assets/insights/brand-building/hero.jpg",
    body: doc([
      p("This staging test article exercises headings, lists, and a blockquote to prove rich-text rendering."),
      h2("Three things that make a brand matter"),
      ul(["A point of view worth remembering", "Consistency across every touchpoint", "The nerve to make something new"]),
      quote("Build the brand. Then make it matter."),
      p("Presentation is owned by React; only the words come from the CMS."),
    ]),
    status: "published",
  },
  {
    // Duplicate of a static placeholder slug → proves CMS wins by slug + dedupe.
    slug: "sample-geek-decoded",
    title: "Sample — Geek Decoded (CMS override)",
    category: "geek-decoded",
    excerpt: "STAGING TEST ARTICLE. Shares a slug with a static placeholder to prove the CMS copy wins and no duplicate card appears.",
    publishDate: "2025-08-01",
    body: doc([p("This CMS article shares a slug with a static placeholder. On /insights only this (published CMS) version should appear.")]),
    status: "published",
  },
  {
    // Draft → proves draft-security (anon 404, absent from index/sitemap) + preview.
    slug: "unpublished-preview-test",
    title: "Sample — Unpublished Preview Test",
    category: "whats-next",
    excerpt: "STAGING TEST DRAFT. Should be invisible to the public and visible only via secure Preview.",
    publishDate: "2025-08-10",
    body: doc([p("If you can read this at the public URL without a Preview token, draft security is broken.")]),
    status: "draft",
  },
];

async function main() {
  assertStagingFixturesAllowed("seed-insights.ts");
  const payload = await getPayload({ config });
  for (const s of SEEDS) {
    const existing = await payload.find({ collection: "insights", where: { slug: { equals: s.slug } }, limit: 1, pagination: false, draft: true });
    if (existing.docs.length) {
      console.log(`  insights/${s.slug}: exists → skipped`);
      continue;
    }
    await payload.create({
      collection: "insights",
      draft: s.status === "draft",
      data: {
        title: s.title,
        slug: s.slug,
        excerpt: s.excerpt,
        category: s.category,
        publishDate: s.publishDate,
        heroLegacySrc: s.heroLegacySrc,
        body: s.body,
        _status: s.status,
      } as never,
    });
    console.log(`  insights/${s.slug}: seeded (${s.status})`);
  }
  console.log("Insights seed complete.");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
