/**
 * Approved What We Do content as a normalized UI model + static fallback. The
 * page renders this exact shape whether the source is the `what-we-do` Global or
 * this fallback, so /what-we-do always renders even when the CMS/DB is down.
 *
 * The capability item words are curated MARKETING language (page content), not
 * the `services` project-taxonomy records — so they are embedded here, verbatim,
 * rather than related to Service records (whose labels differ). React owns all
 * design (cyan highlights, Band layout, the Process rail).
 */
export type WwdCapability = {
  label: string;
  items: string[];
  /** two lines, joined by "\n"; `highlight` (if set) is coloured cyan. */
  thought: string;
  thoughtHighlight?: string;
  linkLabel?: string;
  linkHref?: string;
};
export type WwdSeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };

export type WhatWeDoModel = {
  hero: { block1: string; block2: string; highlight: string; intro: string };
  capabilities: WwdCapability[];
  cta: { label: string; href: string };
  seo: WwdSeo;
};

export const WHAT_WE_DO_FALLBACK: WhatWeDoModel = {
  hero: {
    block1: "We don't start\nwith a service.",
    block2: "We start\nwith the problem.",
    highlight: "problem.",
    intro: "The answer might be a brand. An idea. A creator. A campaign. An experience. Or something that didn't exist yesterday.",
  },
  capabilities: [
    { label: "Build.", items: ["Brand Strategy", "Positioning", "Naming", "Identity", "Brand Launches"], thought: "Make something\nworth choosing." },
    { label: "Create.", items: ["Ideas", "Campaigns", "Content", "Films", "Experiences"], thought: "An ad gets seen.\nAn idea gets remembered." },
    { label: "Connect.", items: ["Social", "Culture", "Community", "Digital"], thought: "Be part of the\nconversation." },
    {
      label: "Influence.",
      items: ["Celebrity", "Macro", "Micro", "Nano", "UGC", "Regional"],
      thought: "1 or 1,000+.\nInfluence at scale.",
      thoughtHighlight: "Influence at scale.",
      linkLabel: "One Degree of Separation",
      linkHref: "/work?service=influencer-marketing",
    },
    { label: "Amplify.", items: ["Media", "Paid Social", "Distribution", "Performance"], thought: "Great work\ndeserves to travel." },
  ],
  cta: { label: "Tell us the problem", href: "/contact" },
  seo: {
    metaTitle: "What We Do — Geek Creative Agency",
    metaDescription: "We don't start with a service. We start with the problem. Build, Create, Connect, Influence, Amplify — from the big idea to the last mile.",
  },
};
