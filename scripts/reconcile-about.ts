/**
 * One-off, SAFE reconciliation: the initial About seed used curly apostrophes
 * (’) where the approved source uses straight ones ('). This updates the About
 * Global to the corrected fallback ONLY when the deviation is still present
 * (a curly U+2019 anywhere in the doc) — so it never overwrites genuine editor
 * changes. Run on Node 22 with env loaded.
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { ABOUT_FALLBACK as A } from "../lib/site/aboutFallback";

async function main() {
  const payload = await getPayload({ config });
  const current = await payload.findGlobal({ slug: "about", draft: true });
  const hasCurly = JSON.stringify(current ?? {}).includes("’");
  if (!hasCurly) {
    console.log("about: no curly apostrophes found → nothing to reconcile");
    process.exit(0);
  }
  await payload.updateGlobal({
    slug: "about",
    data: {
      hero: { headingLine1: A.hero.headingLine1, headingLine2: A.hero.headingLine2, lead: A.hero.lead, paragraphs: A.hero.paragraphs.map((text) => ({ text })) },
      evolution: { eyebrow: A.evolution.eyebrow, eras: A.evolution.eras.map((e) => ({ label: e.label })), headingMain: A.evolution.headingMain, headingMuted: A.evolution.headingMuted },
      win: { eyebrow: A.win.eyebrow, headingLine1: A.win.headingLine1, headingLine2: A.win.headingLine2, highlight: A.win.highlight, subcopy: A.win.subcopy },
      geekWay: { heading: A.geekWay.heading, principles: A.geekWay.principles.map((p) => ({ title: p.title, body: p.body })) },
      seo: { metaTitle: A.seo.metaTitle, metaDescription: A.seo.metaDescription },
      _status: "published",
    } as never,
  });
  console.log("about: apostrophes reconciled to approved source (straight ')");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
