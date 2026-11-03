/**
 * /build page — how Geek takes a brand from zero to one people choose.
 * Normalized model + approved fallback copy. Admin: Pages → Build Page.
 * Nothing invented: see the Sources note above BUILD_FALLBACK.
 */
export type BuildStep = { title: string; body: string; linkLabel?: string; linkHref?: string };
export type BuildPhase = { label: string; title: string; subtitle: string; body: string };
export type BuildProof = { value: string; label: string; href?: string };
export type BuildSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  noindex?: boolean;
};

export type BuildPageModel = {
  hero: { eyebrow: string; heading: string; highlight: string; intro: string };
  phases: { eyebrow: string; heading: string; items: BuildPhase[] };
  steps: { eyebrow: string; heading: string; closing: string; items: BuildStep[] };
  capabilities: { heading: string; items: string[] };
  showcase: { eyebrow: string; heading: string; storySlugs: string[] };
  portfolio: { heading: string; note: string; items: string[] };
  proof: { eyebrow: string; heading: string; items: BuildProof[] };
  cta: {
    heading: string;
    highlight: string;
    label: string;
    href: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  seo: BuildSeo;
};

/* Sources (Geek's Drive archive, researched 2 Nov 2026): the three-phase model,
   "our mantra is to listen", the positioning components, "5-10 names", "3-5 most
   promising concepts" and the deliverables come from Geek's own branding
   proposals and credentials decks (Hop Box proposal, Jan 2022; Geek credentials).
   Brand examples are only work Geek actually did (High Ultra Lounge, Lyfe, Miller
   High Life) — proposal-only clients are deliberately left out. */
export const BUILD_FALLBACK: BuildPageModel = {
  hero: {
    eyebrow: "Build.",
    heading: "From zero\nto a brand\npeople choose.",
    highlight: "people choose.",
    intro:
      "A brand doesn't start with a logo. It starts with a reason to exist. We find that reason, give it a name, a face and a voice, launch it so people want in, and then keep building it long after the launch is over.",
  },
  phases: {
    eyebrow: "Our model",
    heading: "Three phases. One brand.",
    items: [
      {
        label: "Phase 01",
        title: "Brand Creation.",
        subtitle: "Concept & Identity",
        body: "Research, positioning, naming and the visual identity. Everything the brand needs before anyone sees it.",
      },
      {
        label: "Phase 02",
        title: "Brand Activation.",
        subtitle: "Launch & Rollout",
        body: "The launch plan and everything it needs: collateral, website, guidelines, signage, advertising and events.",
      },
      {
        label: "Phase 03",
        title: "Brand Building.",
        subtitle: "Marketing & Strategy",
        body: "Month after month: campaigns, social, content, community, search, influencers, PR, and a report on what worked.",
      },
    ],
  },
  steps: {
    eyebrow: "The 0 → 100 playbook",
    heading: "How we build a brand.",
    closing: "Listen. Measure. Engage. Repeat.",
    items: [
      {
        title: "Listen first.",
        body: "Before we do anything, our mantra is to listen. We sit with the founders and the people around the business to understand the vision, the goals, the customer and the market, before a single idea is put on paper.",
      },
      {
        title: "Audit the category.",
        body: "We study the competition in India and abroad, look at the brands that got it right, and find the gap nobody owns yet. It ends as a brand audit and a clear list of insights and opportunities.",
      },
      {
        title: "Decide what it stands for.",
        body: "Every positioning we write answers four questions: who is it for, where does it compete, what makes it different, and why should anyone believe it. For Lyfe, a goal-planning app, the answer became one line: Change Begins Now.",
        linkLabel: "Lyfe",
        linkHref: "/work/lyfe",
      },
      {
        title: "Name it.",
        body: "From a naming brief we explore creative directions, create a shortlist of 5–10 names and taglines, critique them internally, screen them for obvious trademark conflicts, and refine the one that fits. Lyfe even carried its idea inside the name: Live Young and Free Eternally.",
        linkLabel: "Lyfe",
        linkHref: "/work/lyfe",
      },
      {
        title: "Give it a face.",
        body: "The design brief comes straight from the positioning. We explore symbol, type, colour and graphic language, show the 3–5 strongest concepts working in the real world, and finish with the logo, colours, fonts and the reasons behind them. At High Ultra Lounge, the coloured accent from the logo became the building block of every piece of communication.",
        linkLabel: "High Ultra Lounge",
        linkHref: "/work/high-ultra-lounge",
      },
      {
        title: "Build the experience.",
        body: "A brand is more than a logo, so we design the places people meet it: packaging, signage, merchandising, retail spaces and the brand environment. At High, that meant event logos, menus, and an Instagram standee that turned the venue into a selfie spot.",
        linkLabel: "High Ultra Lounge",
        linkHref: "/work/high-ultra-lounge",
      },
      {
        title: "Launch it so people want in.",
        body: "Launch strategy, collateral, website and guidelines, then a launch people want to be part of. High opened with a teaser that asked “What gets you High?” without revealing the logo. Miller High Life entered India as The Coolest Job, a nationwide hunt for brand ambassadors.",
        linkLabel: "The Coolest Job",
        linkHref: "/work/the-coolest-job",
      },
      {
        title: "Keep building it.",
        body: "Opening day is where most agencies stop. We keep going with monthly campaign planning, social media, content, community, search, ads, influencers and online PR, all reported back. For High, the launch turned into a year-round calendar: Pink In The City, Full Moon Party, Sunday Brunch.",
        linkLabel: "High Ultra Lounge",
        linkHref: "/work/high-ultra-lounge",
      },
    ],
  },
  capabilities: {
    heading: "What we build.",
    items: [
      "Brand Audit",
      "Positioning",
      "Naming & Taglines",
      "Logo & Identity",
      "Packaging",
      "Brand Spaces",
      "Launch Strategy",
      "Websites",
      "Brand Guidelines",
      "Ongoing Marketing",
    ],
  },
  showcase: {
    eyebrow: "Built by Geek",
    heading: "Brands we've built.",
    storySlugs: ["lyfe", "the-biere-club", "sustainify"],
  },
  portfolio: {
    heading: "Brand launches & branding from our credentials.",
    note: "As listed in Geek's credentials.",
    items: [
      "Miller High Life",
      "High Ultra Lounge",
      "Sobha Dream Series",
      "New Indian Parent",
      "Lyfe",
      "Klenza",
    ],
  },
  proof: {
    eyebrow: "From the case studies",
    heading: "What building looked like.",
    items: [
      {
        value: "₹1,00,000+",
        label: "a month — the job offer that launched Miller High Life in India",
        href: "/work/the-coolest-job",
      },
      {
        value: "421 ft",
        label: "above Bengaluru, where High opened in 2014",
        href: "/work/high-ultra-lounge",
      },
      {
        value: "18",
        label: "campaigns planned in High's 2015–16 brand calendar",
        href: "/work/high-ultra-lounge",
      },
      {
        value: "200+",
        label: "contest entries in one week for Lyfe, before the app launched",
        href: "/work/lyfe",
      },
    ],
  },
  cta: {
    heading: "Got a brand\nto build?",
    highlight: "to build?",
    label: "Build my brand",
    href: "/build-my-brand",
    secondaryLabel: "See all brand work",
    secondaryHref: "/work/brand-building",
  },
  seo: {
    metaTitle: "How Geek Builds Brands from Zero — Geek Creative Agency",
    metaDescription:
      "Brand Creation, Activation and Building: positioning, naming, identity, launches and the marketing after. How Geek takes a brand from zero.",
  },
};
