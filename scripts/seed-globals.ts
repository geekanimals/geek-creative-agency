/**
 * Seed the site Globals with the APPROVED current values (Navigation, Footer,
 * Site Settings). IDEMPOTENT + SAFE: only writes a Global that is still
 * uninitialized/empty — never overwrites editor changes on re-run. Reproduces
 * the approved static site exactly (no copy/order/social changes).
 * Run on Node 22:  set -a; . ./.env.local; set +a; PAYLOAD_DB_PUSH=true npx tsx scripts/seed-globals.ts
 * (PAYLOAD_DB_PUSH=true also dev-pushes the new globals tables to the DB.)
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { NAV_FALLBACK, FOOTER_FALLBACK, SITE_SETTINGS_FALLBACK } from "../lib/site/fallbacks";
import { ABOUT_FALLBACK } from "../lib/site/aboutFallback";
import { WHAT_WE_DO_FALLBACK } from "../lib/site/whatWeDoFallback";
import { CREATORS_FALLBACK } from "../lib/site/creatorsFallback";
import { CONTACT_FALLBACK } from "../lib/site/contactFallback";
import { HOME_FALLBACK } from "../lib/site/homeFallback";

async function main() {
  const payload = await getPayload({ config });
  const log = (m: string) => console.log(`  ${m}`);

  // Navigation
  const nav = await payload.findGlobal({ slug: "navigation" });
  if (!nav?.items?.length) {
    await payload.updateGlobal({
      slug: "navigation",
      data: {
        items: NAV_FALLBACK.items.map((i) => ({ label: i.label, href: i.href, enabled: true, openInNewTab: false })),
        cta: NAV_FALLBACK.cta,
      } as never,
    });
    log("navigation: seeded");
  } else log("navigation: exists → skipped");

  // Footer
  const footer = await payload.findGlobal({ slug: "footer" });
  if (!footer?.cta?.buttonLabel && !footer?.tagline) {
    await payload.updateGlobal({ slug: "footer", data: { cta: FOOTER_FALLBACK.cta, tagline: FOOTER_FALLBACK.tagline } as never });
    log("footer: seeded");
  } else log("footer: exists → skipped");

  // Site Settings
  const settings = await payload.findGlobal({ slug: "site-settings" });
  if (!settings?.name && !(settings?.socialLinks?.length)) {
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        name: SITE_SETTINGS_FALLBACK.name,
        short: SITE_SETTINGS_FALLBACK.short,
        description: SITE_SETTINGS_FALLBACK.description,
        socialLinks: SITE_SETTINGS_FALLBACK.socials.map((s) => ({ platform: s.platform, label: s.label, url: s.url })),
        seo: {
          defaultTitle: SITE_SETTINGS_FALLBACK.seo.defaultTitle,
          defaultDescription: SITE_SETTINGS_FALLBACK.seo.defaultDescription,
          orgName: SITE_SETTINGS_FALLBACK.seo.orgName,
        },
      } as never,
    });
    log("site-settings: seeded");
  } else log("site-settings: exists → skipped");

  // About page (drafts enabled → seed as PUBLISHED so /about shows CMS content)
  const about = await payload.findGlobal({ slug: "about", draft: true });
  if (!about?.hero?.headingLine1) {
    const A = ABOUT_FALLBACK;
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
    log("about: seeded (published)");
  } else log("about: exists → skipped");

  // What We Do page (drafts → seed PUBLISHED so /what-we-do shows CMS content)
  const wwd = await payload.findGlobal({ slug: "what-we-do", draft: true });
  if (!wwd?.hero?.block1) {
    const W = WHAT_WE_DO_FALLBACK;
    await payload.updateGlobal({
      slug: "what-we-do",
      data: {
        hero: { block1: W.hero.block1, block2: W.hero.block2, highlight: W.hero.highlight, intro: W.hero.intro },
        capabilities: W.capabilities.map((c) => ({
          label: c.label,
          items: c.items.map((text) => ({ text })),
          thought: c.thought,
          thoughtHighlight: c.thoughtHighlight,
          linkLabel: c.linkLabel,
          linkHref: c.linkHref,
        })),
        cta: W.cta,
        seo: { metaTitle: W.seo.metaTitle, metaDescription: W.seo.metaDescription },
        _status: "published",
      } as never,
    });
    log("what-we-do: seeded (published)");
  } else log("what-we-do: exists → skipped");

  // Creators page (drafts → seed PUBLISHED so /creators shows CMS content)
  const creators = await payload.findGlobal({ slug: "creators-page", draft: true });
  if (!creators?.hero?.headingBlock) {
    const C = CREATORS_FALLBACK;
    await payload.updateGlobal({
      slug: "creators-page",
      data: {
        hero: { headingBlock: C.hero.headingBlock, headingHighlight: C.hero.headingHighlight, subline: C.hero.subline, ctaLabel: C.hero.ctaLabel, ctaHref: C.hero.ctaHref },
        oneDegree: { heading: C.oneDegree.heading, body: C.oneDegree.body, opportunities: C.oneDegree.opportunities.map((text) => ({ text })) },
        whyGeek: { eyebrow: C.whyGeek.eyebrow, heading: C.whyGeek.heading, headingHighlight: C.whyGeek.headingHighlight },
        join: { eyebrow: C.join.eyebrow, heading: C.join.heading, subcopy: C.join.subcopy },
        seo: { metaTitle: C.seo.metaTitle, metaDescription: C.seo.metaDescription },
        _status: "published",
      } as never,
    });
    log("creators-page: seeded (published)");
  } else log("creators-page: exists → skipped");

  // Contact page (drafts → seed PUBLISHED so /contact shows CMS content)
  const contact = await payload.findGlobal({ slug: "contact-page", draft: true });
  if (!contact?.hero?.headingBlock) {
    const C = CONTACT_FALLBACK;
    await payload.updateGlobal({
      slug: "contact-page",
      data: {
        hero: { headingBlock: C.hero.headingBlock, headingHighlight: C.hero.headingHighlight, formEyebrow: C.hero.formEyebrow },
        doors: {
          eyebrow: C.doors.eyebrow,
          heading: C.doors.heading,
          items: C.doors.items.map((d) => ({ key: d.key, title: d.title, sub: d.sub })),
        },
        seo: { metaTitle: C.seo.metaTitle, metaDescription: C.seo.metaDescription },
        _status: "published",
      } as never,
    });
    log("contact-page: seeded (published)");
  } else log("contact-page: exists → skipped");

  // Home page (drafts → seed PUBLISHED so / shows CMS content)
  const home = await payload.findGlobal({ slug: "home-page", draft: true });
  if (!home?.hero?.headingBlock) {
    const H = HOME_FALLBACK;
    await payload.updateGlobal({
      slug: "home-page",
      data: {
        hero: {
          headingBlock: H.hero.headingBlock, headingHighlight: H.hero.headingHighlight, subline: H.hero.subline,
          ctaPrimaryLabel: H.hero.ctaPrimary.label, ctaPrimaryHref: H.hero.ctaPrimary.href,
          ctaSecondaryLabel: H.hero.ctaSecondary.label, ctaSecondaryHref: H.hero.ctaSecondary.href,
        },
        logoWall: { heading: H.logoWall.heading, headingHighlight: H.logoWall.headingHighlight },
        build: { title: H.build.title, sub: H.build.sub, trailing: H.build.trailing },
        create: { title: H.create.title, sub: H.create.sub },
        influence: { eyebrow: H.influence.eyebrow, heading: H.influence.heading, sub: H.influence.sub, list: H.influence.list, linkLabel: H.influence.linkLabel, linkHref: H.influence.linkHref },
        proof: { eyebrow: H.proof.eyebrow, sub: H.proof.sub },
        process: { heading: H.process.heading, headingHighlight: H.process.headingHighlight, trailing: H.process.trailing },
        builtByGeek: { eyebrow: H.builtByGeek.eyebrow, headingBlock: H.builtByGeek.headingBlock, headingCyan: H.builtByGeek.headingCyan, closing: H.builtByGeek.closing, closingHighlight: H.builtByGeek.closingHighlight },
        geekWay: { title: H.geekWay.title, principles: H.geekWay.principles.map((p) => ({ title: p.title, body: p.body })), finaleBlock: H.geekWay.finaleBlock, finaleHighlight: H.geekWay.finaleHighlight, finaleSub: H.geekWay.finaleSub },
        work: { title: H.work.title, sub: H.work.sub },
        _status: "published",
      } as never,
    });
    log("home-page: seeded (published)");
  } else log("home-page: exists → skipped");

  console.log("Globals seed complete.");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
