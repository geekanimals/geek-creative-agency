/**
 * Approved Creators page content as a normalized UI model + static fallback.
 * The page renders this shape from the `creators-page` Global or this fallback,
 * so /creators always renders even when the CMS/DB is unavailable.
 *
 * The decorative creator mosaic and the registration <CreatorForm> stay
 * code-controlled; CMS owns only the editorial copy around them.
 */
export type CreatorsSeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };

export type CreatorsPageModel = {
  hero: { headingBlock: string; headingHighlight: string; subline: string; ctaLabel: string; ctaHref: string };
  oneDegree: { heading: string; body: string; opportunities: string[] };
  whyGeek: { eyebrow: string; heading: string; headingHighlight: string };
  join: { eyebrow: string; heading: string; subcopy: string };
  seo: CreatorsSeo;
};

export const CREATORS_FALLBACK: CreatorsPageModel = {
  hero: {
    headingBlock: "Make great work.\nWith great brands.",
    headingHighlight: "With great brands.",
    subline: "Join the Geek Creator Network.",
    ctaLabel: "Join now",
    ctaHref: "#join",
  },
  oneDegree: {
    heading: "One degree\nof separation.",
    body: "One opportunity can lead to another.",
    opportunities: ["Paid Campaigns", "Barter Campaigns", "UGC", "Brand Launches", "Events", "Celebrity Campaigns", "Regional Campaigns"],
  },
  whyGeek: {
    eyebrow: "Why Geek?",
    heading: "Real brands.\nReal campaigns.\nReal opportunities.",
    headingHighlight: "Real opportunities.",
  },
  join: {
    eyebrow: "Join the network",
    heading: "Tell us about you.",
    subcopy: "No login. No dashboard. Just great work with great brands.",
  },
  seo: {
    metaTitle: "For Creators — Join the Geek Creator Network",
    metaDescription: "Make great work with great brands. Real brands, real campaigns, real opportunities. Join the Geek Creator Network.",
  },
};
