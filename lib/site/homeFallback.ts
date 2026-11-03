import type { VideoModel } from "@/lib/cms/video";
import { buildStories, createGallery, builtByGeek as builtByGeekStories, workWall } from "@/lib/data/work";
import { proof as proofCases } from "@/lib/data/proof";

/** A picture card on the homepage (Build / Create / Built by Geek / The Work). */
export type HomeCard = { key: string; href: string; src?: string; brand: string; project?: string; blurb?: string; tall?: boolean };
export type ProofCaseModel = { brand: string; src?: string; href?: string; stats: { value: number; suffix?: string; label: string }[] };

export type MediaEra = {
  pre: string;
  post: string;
  label: string;
  src?: string;
  video?: VideoModel;
  href?: string;
  transitional?: boolean;
};
/**
 * Approved Homepage editorial content as a normalized UI model + static
 * fallback. The Homepage renders this shape from the `home-page` Global or this
 * fallback, so `/` always renders — identically — even when the CMS/DB is
 * unavailable.
 *
 * This is a THIN orchestration layer: it holds only genuine editorial strings.
 * All art direction, motion, media, the curated work datasets (lib/data/work,
 * lib/data/proof, lib/data/clients) and the Four Doors stay code-controlled.
 * Strings are the exact approved copy (straight apostrophes, "\n" line breaks
 * where the layout depends on them) — do not normalise typography.
 */
export type HomeSeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };
export type HomeCta = { label: string; href: string };

export type HomePageModel = {
  hero: {
    headingBlock: string;
    headingHighlight: string;
    subline: string;
    ctaPrimary: HomeCta;
    ctaSecondary: HomeCta;
  };
  /** `logos`: clients managed on Home Page → Logos (empty = the built-in list in lib/data/clients.ts). */
  logoWall: { heading: string; headingHighlight: string; logos: { name: string; logo?: string }[] };
  build: { title: string; sub: string; trailing: string; buttonLabel: string; cards: HomeCard[] };
  create: { title: string; sub: string; buttonLabel: string; cards: HomeCard[] };
  influence: { eyebrow: string; heading: string; sub: string; list: string; linkLabel: string; linkHref: string; buttonLabel: string };
  proof: { eyebrow: string; sub: string; cases: ProofCaseModel[] };
  process: { heading: string; headingHighlight: string; trailing: string; steps: string[] };
  builtByGeek: { eyebrow: string; headingBlock: string; headingCyan: string; closing: string; closingHighlight: string; stories: HomeCard[] };
  geekWay: {
    title: string;
    principles: { title: string; body: string }[];
    finaleBlock: string;
    finaleHighlight: string;
    finaleSub: string;
  };
  work: { title: string; sub: string; cards: HomeCard[] };
  /** “The web changed …” strip under the hero. Each card shows an image or a
   *  video (admin: Home Page → Media changed); `transitional` = animated cyan card. */
  mediaChanged: { eras: MediaEra[]; finaleKicker: string; finaleWord: string };
  /** Homepage videos from the admin (upload or YouTube); null = use lib/video.ts / the image. */
  videos: { hero: VideoModel; build: VideoModel; builtByGeek: VideoModel };
  seo: HomeSeo;
};

export const HOME_FALLBACK: HomePageModel = {
  hero: {
    headingBlock: "We build brands.\nThen we make\nthem matter.",
    headingHighlight: "matter.",
    subline: "Strategy. Ideas. Culture. Creators. Media.",
    ctaPrimary: { label: "See Our Work", href: "/work" },
    ctaSecondary: { label: "Talk to Geek", href: "/contact" },
  },
  logoWall: {
    heading: "We've made a few friends along the way.",
    headingHighlight: "friends",
    logos: [],
  },
  build: {
    title: "Build.",
    sub: "From identity to experience.",
    trailing: "A brand launch people wanted to be part of.",
    buttonLabel: "See how we build",
    cards: buildStories.map((s) => ({ key: s.slug, href: s.href, src: s.src, brand: s.brand, project: s.project, blurb: s.blurb })),
  },
  create: {
    title: "Create.",
    sub: "An ad gets seen.\nAn idea gets shared.",
    buttonLabel: "See how we run campaigns",
    cards: createGallery.map((w) => ({ key: w.slug, href: `/work/${w.slug}`, src: w.src, brand: w.brand, project: w.project })),
  },
  influence: {
    eyebrow: "Influence.",
    heading: "1 or 1,000+",
    sub: "Influence at scale.",
    list: "Celebrity. Macro. Micro. Nano. UGC. Regional.",
    linkLabel: "One Degree of Separation",
    linkHref: "#proof",
    buttonLabel: "See how influence works",
  },
  proof: {
    eyebrow: "Proof.",
    sub: "The work, in numbers.",
    cases: proofCases.map((c) => ({
      brand: c.brand,
      src: c.src,
      href: c.brand === "Doritos" ? "/work/doritos" : "/work/lays-heartwork",
      stats: c.stats,
    })),
  },
  process: {
    heading: "From the big idea",
    headingHighlight: "to the last mile.",
    trailing: "We make it happen.",
    steps: ["Idea", "Design", "Create", "Influence", "Produce", "Pack", "Ship", "Activate", "Measure"],
  },
  builtByGeek: {
    eyebrow: "Built by Geek",
    headingBlock: "Sometimes,\nwe don't wait for a brief.",
    headingCyan: "We write our own.",
    closing: "We build what we believe should exist.",
    closingHighlight: "exist.",
    stories: builtByGeekStories.map((b) => ({
      key: b.slug,
      href: b.slug === "give-back-to-gurugram" ? "https://givebacktogurugram.com" : `/work/${b.slug}`,
      src: b.src,
      brand: b.brand,
      project: b.kicker,
    })),
  },
  geekWay: {
    title: "The Geek Way.",
    principles: [
      { title: "Stay curious.", body: "There's always something new to learn." },
      { title: "Stay updated.", body: "Yesterday's playbook won't win tomorrow." },
      { title: "Brand first.", body: "The channel is never the strategy." },
      { title: "Ideas matter.", body: "People remember ideas, not deliverables." },
      { title: "Make it matter.", body: "Attention without impact isn't enough." },
    ],
    finaleBlock: "We win\nwhen you win.",
    finaleHighlight: "We, you",
    finaleSub: "Your success is critical to our own.",
  },
  work: {
    title: "The Work.",
    sub: "Ideas that made an impact.",
    cards: workWall.map((w) => ({ key: w.slug, href: `/work/${w.slug}`, src: w.src, brand: w.brand, project: w.project, tall: w.tall })),
  },
  mediaChanged: {
    eras: [
      { pre: "The web", post: "changed.", label: "Web · Tanishq One", src: "/assets/work/tanishq/tanishq-one-range.jpg", href: "/work/tanishq" },
      { pre: "Social", post: "changed.", label: "Social · Fastrack × The Music Run", src: "/assets/work/fastrack/tmr-challenge.jpg", href: "/work/fastrack" },
      { pre: "Mobile", post: "changed.", label: "Mobile · Lyfe app launch", src: "/assets/work/lyfe/change-begins-now.jpg", href: "/work/lyfe" },
      { pre: "Creators", post: "changed everything.", label: "Creators · Doritos #BlameItOnCrunch", src: "/assets/work/doritos/doritos-blame-it-on-crunch/hero.jpg", href: "/influence" },
      { pre: "It'll", post: "change again.", label: "What's next", transitional: true },
      { pre: "Our job", post: "won't.", label: "Geek · Together for Gurugram", src: "/assets/work/give-back-to-gurugram/together-for-gurugram.png", href: "/about" },
    ],
    finaleKicker: "Make brands",
    finaleWord: "Matter.",
  },
  videos: { hero: null, build: null, builtByGeek: null },
  seo: {},
};
