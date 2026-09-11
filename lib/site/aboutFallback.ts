/**
 * Approved About-page content as a normalized UI model + static fallback. The
 * About component renders this exact shape whether the source is Payload (the
 * `about` Global) or this fallback — so React stays independent of CMS schema,
 * and /about always renders even when the CMS/DB is unavailable or empty.
 *
 * Content is the CURRENT approved copy, verbatim. React still owns all design:
 * the cyan highlights, two-tone headings, navy section, spacing and typography.
 */
export type AboutEra = { label: string };
export type AboutPrinciple = { title: string; body: string };
export type AboutSeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };

export type AboutModel = {
  hero: { headingLine1: string; headingLine2: string; lead: string; paragraphs: string[] };
  evolution: { eyebrow: string; eras: AboutEra[]; headingMain: string; headingMuted: string };
  win: { eyebrow: string; headingLine1: string; headingLine2: string; highlight: string; subcopy: string };
  geekWay: { heading: string; principles: AboutPrinciple[] };
  seo: AboutSeo;
};

export const ABOUT_FALLBACK: AboutModel = {
  hero: {
    headingLine1: "Why",
    headingLine2: "“Geek”?",
    lead: "Because the world doesn't stand still.",
    paragraphs: [
      "And neither do we.",
      "Being Geek means staying curious, staying updated, and never assuming yesterday's answer will solve tomorrow's problem.",
    ],
  },
  evolution: {
    eyebrow: "Since 2008",
    eras: [{ label: "Web." }, { label: "Interactive." }, { label: "Social." }, { label: "Mobile." }, { label: "Creators." }, { label: "Next?" }],
    headingMain: "The media changed.",
    headingMuted: "We changed with it.",
  },
  win: {
    eyebrow: "The one thing that didn't change",
    headingLine1: "We win",
    headingLine2: "when you win.",
    highlight: "you",
    subcopy: "Your success is critical to our own.",
  },
  geekWay: {
    heading: "The Geek Way.",
    principles: [
      { title: "Stay Curious.", body: "There's always something new to learn." },
      { title: "Stay Updated.", body: "Yesterday's playbook won't win tomorrow." },
      { title: "Brand First.", body: "The channel is never the strategy." },
      { title: "Ideas Matter.", body: "People remember ideas, not deliverables." },
      { title: "Make It Matter.", body: "Attention without impact isn't enough." },
      { title: "We Win When You Win.", body: "Your success is critical to our own." },
    ],
  },
  seo: {
    metaTitle: "About Geek — Why “Geek”?",
    metaDescription: "Since 2008. The media changed — we changed with it. Being Geek means staying curious, staying updated, and winning when you win.",
  },
};
