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

/** Hostname of the canonical site, e.g. "www.geekcreativeagency.com". */
export const CANONICAL_HOST = new URL(SITE_URL).hostname.toLowerCase();

/**
 * True when the BUILD is a preview/staging build that must never be indexed:
 * a Vercel host, a "test." host, or NEXT_PUBLIC_NOINDEX=true.
 */
export const IS_STAGING =
  /vercel\.app$/i.test(CANONICAL_HOST) ||
  /(^|\.)test\./i.test(CANONICAL_HOST) ||
  process.env.NEXT_PUBLIC_NOINDEX === "true";

/**
 * True when a request's Host header is the canonical host. Any other host
 * serving the same build (test subdomain, server IP, apex without www) is
 * kept out of search results by robots.txt and an X-Robots-Tag header.
 */
export const isCanonicalHost = (host?: string | null): boolean =>
  !!host && host.split(":")[0].toLowerCase() === CANONICAL_HOST;

export const abs = (path: string): string => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
