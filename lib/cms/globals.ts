import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { INSIGHTS_NAV_MIN } from "@/lib/insights";
import { getPublishedInsightsCount } from "@/lib/cms/insights";
import {
  NAV_FALLBACK, FOOTER_FALLBACK, SITE_SETTINGS_FALLBACK,
  type NavModel, type FooterModel, type SiteSettingsModel, type SeoModel,
} from "@/lib/site/fallbacks";
import type { Navigation as NavDoc, Footer as FooterDoc, SiteSetting } from "@/payload-types";

function logCmsError(ctx: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static fallback:`, e instanceof Error ? e.message : e);
}
const isExternal = (href: string) => /^https?:\/\//i.test(href);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ── adapters: Payload Global doc → normalized UI model (null if empty) ───── */
function adaptNav(g: NavDoc | null): NavModel | null {
  const items = (g?.items ?? [])
    .filter((i) => i.enabled !== false && i.label && i.href)
    .map((i) => ({ label: i.label as string, href: i.href as string, external: isExternal(i.href as string), newTab: Boolean(i.openInNewTab) }));
  if (!items.length) return null; // uninitialized/empty → caller falls back
  const cta = g?.cta?.label && g?.cta?.href ? { label: g.cta.label, href: g.cta.href } : undefined;
  return { items, cta };
}
function adaptFooter(g: FooterDoc | null): FooterModel | null {
  if (!g || (!g.tagline && !g.cta?.buttonLabel)) return null;
  return {
    cta: {
      headingPrefix: g.cta?.headingPrefix ?? FOOTER_FALLBACK.cta.headingPrefix,
      headingHighlight: g.cta?.headingHighlight ?? FOOTER_FALLBACK.cta.headingHighlight,
      headingSuffix: g.cta?.headingSuffix ?? FOOTER_FALLBACK.cta.headingSuffix,
      buttonLabel: g.cta?.buttonLabel ?? FOOTER_FALLBACK.cta.buttonLabel,
      buttonHref: g.cta?.buttonHref ?? FOOTER_FALLBACK.cta.buttonHref,
    },
    tagline: g.tagline ?? FOOTER_FALLBACK.tagline,
    copyrightText: g.copyrightText ?? undefined,
  };
}
function adaptSettings(g: SiteSetting | null): SiteSettingsModel | null {
  if (!g) return null;
  const socials = (g.socialLinks ?? [])
    .filter((s) => s.url && s.platform)
    .map((s) => ({ platform: s.platform as string, label: s.label || cap(s.platform as string), url: s.url as string }));
  const og = resolveMedia(g.seo?.defaultOgImage as never);
  const seo: SeoModel = {
    defaultTitle: g.seo?.defaultTitle || SITE_SETTINGS_FALLBACK.seo.defaultTitle,
    titleTemplate: g.seo?.titleTemplate || undefined,
    defaultDescription: g.seo?.defaultDescription || SITE_SETTINGS_FALLBACK.seo.defaultDescription,
    defaultOgImage: og?.src,
    orgName: g.seo?.orgName || SITE_SETTINGS_FALLBACK.seo.orgName,
  };
  const hasContent = g.name || socials.length || g.seo?.defaultTitle;
  if (!hasContent) return null;
  return {
    name: g.name || SITE_SETTINGS_FALLBACK.name,
    short: g.short || SITE_SETTINGS_FALLBACK.short,
    description: g.description || SITE_SETTINGS_FALLBACK.description,
    socials: socials.length ? socials : SITE_SETTINGS_FALLBACK.socials,
    seo,
  };
}

/* ── cached raw reads (tagged "globals"; invalidated on any Global change) ─── */
const rawNav = unstable_cache(async () => (await getPayloadClient()).findGlobal({ slug: "navigation" }), ["global-navigation"], { tags: ["globals"], revalidate: 3600 });
const rawFooter = unstable_cache(async () => (await getPayloadClient()).findGlobal({ slug: "footer" }), ["global-footer"], { tags: ["globals"], revalidate: 3600 });
const rawSettings = unstable_cache(async () => (await getPayloadClient()).findGlobal({ slug: "site-settings", depth: 1 }), ["global-site-settings"], { tags: ["globals"], revalidate: 3600 });

/** Preserve approved behaviour: Insights appears once 3+ articles are published
 *  (now counting CMS-published ∪ static-published articles). */
function withInsights(nav: NavModel, show: boolean): NavModel {
  if (!show || nav.items.some((i) => i.href === "/insights")) return nav;
  const items = [...nav.items];
  const contactIdx = items.findIndex((i) => i.href === "/contact");
  const insights = { label: "Insights", href: "/insights" };
  if (contactIdx >= 0) items.splice(contactIdx, 0, insights);
  else items.push(insights);
  return { ...nav, items };
}

/* ── public getters: CMS-first, static fallback, never throw ──────────────── */
export async function getNavigation(): Promise<NavModel> {
  let model = NAV_FALLBACK;
  try { const a = adaptNav((await rawNav()) as NavDoc); if (a) model = a; } catch (e) { logCmsError("getNavigation", e); }
  let show = false;
  try { show = (await getPublishedInsightsCount()) >= INSIGHTS_NAV_MIN; } catch (e) { logCmsError("getNavigation/insightsCount", e); }
  return withInsights(model, show);
}
export async function getFooter(): Promise<FooterModel> {
  try { return adaptFooter((await rawFooter()) as FooterDoc) ?? FOOTER_FALLBACK; } catch (e) { logCmsError("getFooter", e); return FOOTER_FALLBACK; }
}
export async function getSiteSettings(): Promise<SiteSettingsModel> {
  try { return adaptSettings((await rawSettings()) as SiteSetting) ?? SITE_SETTINGS_FALLBACK; } catch (e) { logCmsError("getSiteSettings", e); return SITE_SETTINGS_FALLBACK; }
}
export async function getGlobalSEO(): Promise<SeoModel> {
  return (await getSiteSettings()).seo;
}
