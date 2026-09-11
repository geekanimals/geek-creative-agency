/**
 * Central site config. Change the canonical host in ONE place (or via
 * NEXT_PUBLIC_SITE_URL) when migrating from the Vercel test URL to the final
 * Geek domain — metadata, sitemap, robots, canonicals and OG all read from here.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://geek-creative-agency.vercel.app"
).replace(/\/$/, "");

/** Real Geek social profiles (also feed JSON-LD sameAs). */
export const SOCIALS: { label: string; url: string }[] = [
  { label: "Instagram", url: "https://www.instagram.com/geekanimals" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/geekcreativeagency/" },
  { label: "YouTube", url: "https://www.youtube.com/user/GeekCreativeAgency" },
  { label: "X", url: "https://x.com/shortygeek" },
  { label: "Facebook", url: "https://www.facebook.com/WeGeek/" },
];

export const SITE = {
  url: SITE_URL,
  name: "Geek Creative Agency",
  short: "Geek",
  title: "Geek Creative Agency | We Build Brands. Then We Make Them Matter.",
  description:
    "Geek is a creative agency in India — strategy, creative, brand building, creator marketing, digital and media. We build brands, then we make them matter.",
  socials: SOCIALS,
};

/** True when running against a Vercel preview/staging host (never the prod canonical). */
export const IS_STAGING = /vercel\.app$/i.test(new URL(SITE_URL).hostname);

export const abs = (path: string): string => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
