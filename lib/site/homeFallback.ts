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
  logoWall: { heading: string; headingHighlight: string };
  build: { title: string; sub: string; trailing: string };
  create: { title: string; sub: string };
  influence: { eyebrow: string; heading: string; sub: string; list: string; linkLabel: string; linkHref: string };
  proof: { eyebrow: string; sub: string };
  process: { heading: string; headingHighlight: string; trailing: string };
  builtByGeek: { eyebrow: string; headingBlock: string; headingCyan: string; closing: string; closingHighlight: string };
  geekWay: {
    title: string;
    principles: { title: string; body: string }[];
    finaleBlock: string;
    finaleHighlight: string;
    finaleSub: string;
  };
  work: { title: string; sub: string };
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
  },
  build: {
    title: "Build.",
    sub: "From identity to experience.",
    trailing: "A brand launch people wanted to be part of.",
  },
  create: {
    title: "Create.",
    sub: "An ad gets seen.\nAn idea gets shared.",
  },
  influence: {
    eyebrow: "Influence.",
    heading: "1 or 1,000+",
    sub: "Influence at scale.",
    list: "Celebrity. Macro. Micro. Nano. UGC. Regional.",
    linkLabel: "One Degree of Separation",
    linkHref: "#proof",
  },
  proof: {
    eyebrow: "Proof.",
    sub: "The work, in numbers.",
  },
  process: {
    heading: "From the big idea",
    headingHighlight: "to the last mile.",
    trailing: "We make it happen.",
  },
  builtByGeek: {
    eyebrow: "Built by Geek",
    headingBlock: "Sometimes,\nwe don't wait for a brief.",
    headingCyan: "We write our own.",
    closing: "We build what we believe should exist.",
    closingHighlight: "exist.",
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
    finaleHighlight: "you",
    finaleSub: "Your success is critical to our own.",
  },
  work: {
    title: "The Work.",
    sub: "Ideas that made an impact.",
  },
  seo: {},
};
