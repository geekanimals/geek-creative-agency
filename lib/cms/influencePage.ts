import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient, isCmsNotConfiguredError } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { INFLUENCE_FALLBACK, type InfluenceCard, type InfluencePageModel } from "@/lib/site/influenceFallback";

/* The Influence Page global (globals/InfluencePage.ts), typed loosely so the page
   works before `payload generate:types`; every empty field → fallback. */
type Doc = Record<string, any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any

function logCmsError(ctx: string, e: unknown) {
  if (isCmsNotConfiguredError(e)) return;
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static Influence fallback:`, e instanceof Error ? e.message : e);
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);
const texts = (rows: unknown, key = "text") =>
  (Array.isArray(rows) ? rows : []).map((r: Doc) => str(r?.[key])).filter(Boolean) as string[];
const cardList = (rows: unknown): InfluenceCard[] =>
  (Array.isArray(rows) ? rows : [])
    .filter((r: Doc) => str(r?.title) && str(r?.body))
    .map((r: Doc) => ({ title: r!.title, body: r!.body, tag: str(r!.tag), href: str(r!.href) }));
const or = <T,>(list: T[], fallback: T[]) => (list.length ? list : fallback);

function adapt(g: Doc): InfluencePageModel {
  const F = INFLUENCE_FALLBACK;
  if (!g) return F;
  const steps = (g.steps?.items ?? [])
    .filter((s: Doc) => str(s?.title) && str(s?.body))
    .map((s: Doc) => ({ title: s!.title, body: s!.body }));
  return {
    hero: {
      eyebrow: str(g.hero?.eyebrow) ?? F.hero.eyebrow,
      heading: str(g.hero?.heading) ?? F.hero.heading,
      highlight: str(g.hero?.highlight) ?? F.hero.highlight,
      intro: str(g.hero?.intro) ?? F.hero.intro,
      primaryLabel: str(g.hero?.primaryLabel) ?? F.hero.primaryLabel,
      primaryHref: str(g.hero?.primaryHref) ?? F.hero.primaryHref,
      brandLoginLabel: str(g.hero?.brandLoginLabel) ?? F.hero.brandLoginLabel,
      brandLoginHref: str(g.hero?.brandLoginHref) ?? F.hero.brandLoginHref,
    },
    tiers: { heading: str(g.tiers?.heading) ?? F.tiers.heading, items: or(texts(g.tiers?.items), F.tiers.items) },
    models: { eyebrow: str(g.models?.eyebrow) ?? F.models.eyebrow, heading: str(g.models?.heading) ?? F.models.heading, items: or(cardList(g.models?.items), F.models.items) },
    steps: {
      eyebrow: str(g.steps?.eyebrow) ?? F.steps.eyebrow,
      heading: str(g.steps?.heading) ?? F.steps.heading,
      closing: str(g.steps?.closing) ?? F.steps.closing,
      items: or(steps, F.steps.items),
    },
    platform: {
      eyebrow: str(g.platform?.eyebrow) ?? F.platform.eyebrow,
      heading: str(g.platform?.heading) ?? F.platform.heading,
      body: str(g.platform?.body) ?? F.platform.body,
      features: or(texts(g.platform?.features), F.platform.features),
      buttonLabel: str(g.platform?.buttonLabel) ?? F.platform.buttonLabel,
      buttonHref: str(g.platform?.buttonHref) ?? F.platform.buttonHref,
      creatorLabel: str(g.platform?.creatorLabel) ?? F.platform.creatorLabel,
      creatorHref: str(g.platform?.creatorHref) ?? F.platform.creatorHref,
    },
    hampers: {
      eyebrow: str(g.hampers?.eyebrow) ?? F.hampers.eyebrow,
      heading: str(g.hampers?.heading) ?? F.hampers.heading,
      intro: str(g.hampers?.intro) ?? F.hampers.intro,
      items: or(cardList(g.hampers?.items), F.hampers.items),
    },
    stories: { eyebrow: str(g.stories?.eyebrow) ?? F.stories.eyebrow, heading: str(g.stories?.heading) ?? F.stories.heading, items: or(cardList(g.stories?.items), F.stories.items) },
    clients: { heading: str(g.clients?.heading) ?? F.clients.heading, items: or(texts(g.clients?.items), F.clients.items) },
    cta: {
      heading: str(g.cta?.heading) ?? F.cta.heading,
      highlight: str(g.cta?.highlight) ?? F.cta.highlight,
      label: str(g.cta?.label) ?? F.cta.label,
      href: str(g.cta?.href) ?? F.cta.href,
      secondaryLabel: str(g.cta?.secondaryLabel) ?? F.cta.secondaryLabel,
      secondaryHref: str(g.cta?.secondaryHref) ?? F.cta.secondaryHref,
    },
    seo: {
      metaTitle: str(g.seo?.metaTitle) ?? F.seo.metaTitle,
      metaDescription: str(g.seo?.metaDescription) ?? F.seo.metaDescription,
      ogImage: resolveMedia(g.seo?.ogImage as never)?.src,
      noindex: Boolean(g.seo?.noindex),
    },
  };
}

const raw = unstable_cache(
  async () => (await getPayloadClient()).findGlobal({ slug: "influence-page" as never, depth: 1 }),
  ["global-influence-page"],
  { tags: ["influence-page"], revalidate: 3600 },
);

export async function getInfluencePage(opts: { draft?: boolean } = {}): Promise<InfluencePageModel> {
  try {
    if (opts.draft) {
      const g = await (await getPayloadClient()).findGlobal({ slug: "influence-page" as never, draft: true, overrideAccess: true, depth: 1 });
      return adapt(g as Doc);
    }
    return adapt((await raw()) as Doc);
  } catch (e) {
    logCmsError("getInfluencePage", e);
    return INFLUENCE_FALLBACK;
  }
}
