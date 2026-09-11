/**
 * Approved static values for the site-wide chrome, as normalized UI models.
 * These are the SINGLE source of fallback truth: the frontend renders these when
 * a Global is missing, empty, malformed, or the CMS/DB is unavailable. The CMS
 * adapters (lib/cms/globals.ts) convert Payload Global docs into these same
 * shapes, so components never see raw Payload documents.
 *
 * Built ON TOP of lib/site.ts (SITE + SOCIALS) to avoid duplicating identity.
 */
import { SITE, SOCIALS } from "@/lib/site";

/* ── UI models the components consume ─────────────────────────────────────── */
export type NavItem = { label: string; href: string; external?: boolean; newTab?: boolean };
export type NavCta = { label: string; href: string };
export type NavModel = { items: NavItem[]; cta?: NavCta };

export type FooterCta = { headingPrefix: string; headingHighlight: string; headingSuffix: string; buttonLabel: string; buttonHref: string };
export type FooterModel = { cta: FooterCta; tagline: string; copyrightText?: string };

export type SocialLink = { platform: string; label: string; url: string };
export type SeoModel = { defaultTitle: string; titleTemplate?: string; defaultDescription: string; defaultOgImage?: string; orgName: string };
export type SiteSettingsModel = { name: string; short: string; description: string; socials: SocialLink[]; seo: SeoModel };

/* ── fallbacks (the current approved site, verbatim) ──────────────────────── */
export const NAV_FALLBACK: NavModel = {
  items: [
    { label: "Work", href: "/work" },
    { label: "What We Do", href: "/what-we-do" },
    { label: "About Geek", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "For Creators", href: "/creators" },
};

export const FOOTER_FALLBACK: FooterModel = {
  cta: {
    headingPrefix: "What should we make",
    headingHighlight: "matter",
    headingSuffix: "next?",
    buttonLabel: "Talk to Geek",
    buttonHref: "/contact",
  },
  tagline: "We build brands. Then we make them matter.",
  // copyrightText left undefined → component renders "© <year> Geek Creative Agency".
};

export const SITE_SETTINGS_FALLBACK: SiteSettingsModel = {
  name: SITE.name,
  short: SITE.short,
  description: SITE.description,
  socials: SOCIALS.map((s) => ({ platform: s.label.toLowerCase(), label: s.label, url: s.url })),
  seo: {
    defaultTitle: SITE.title,
    // titleTemplate intentionally empty: existing pages set complete titles, so a
    // template would double-brand them. Reserved for future use.
    titleTemplate: undefined,
    defaultDescription: SITE.description,
    orgName: SITE.name,
  },
};
