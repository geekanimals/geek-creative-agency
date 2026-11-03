import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient, isCmsNotConfiguredError } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { BUILD_FALLBACK, type BuildPageModel } from "@/lib/site/buildFallback";

/* The Build Page global (globals/BuildPage.ts). Typed loosely so the page keeps
   working before `payload generate:types` runs; every empty field → fallback. */
type Doc = Record<string, any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any

function logCmsError(ctx: string, e: unknown) {
  if (isCmsNotConfiguredError(e)) return;
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static Build fallback:`, e instanceof Error ? e.message : e);
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);

function adapt(g: Doc): BuildPageModel {
  const F = BUILD_FALLBACK;
  if (!g) return F;
  const steps = (g.steps?.items ?? [])
    .filter((s: Doc) => str(s?.title) && str(s?.body))
    .map((s: Doc) => ({ title: s!.title, body: s!.body, linkLabel: str(s!.linkLabel), linkHref: str(s!.linkHref) }));
  const phases = (g.phases?.items ?? [])
    .filter((p: Doc) => str(p?.title))
    .map((p: Doc) => ({ label: str(p!.label) ?? "", title: p!.title, subtitle: str(p!.subtitle) ?? "", body: str(p!.body) ?? "" }));
  const portfolio = (g.portfolio?.items ?? []).map((i: Doc) => str(i?.name)).filter(Boolean) as string[];
  const caps = (g.capabilities?.items ?? []).map((i: Doc) => str(i?.text)).filter(Boolean) as string[];
  const stories = (g.showcase?.stories ?? [])
    .map((s: unknown) => (s && typeof s === "object" ? str((s as { slug?: string }).slug) : undefined))
    .filter(Boolean) as string[];
  const proof = (g.proof?.items ?? [])
    .filter((p: Doc) => str(p?.value) && str(p?.label))
    .map((p: Doc) => ({ value: p!.value, label: p!.label, href: str(p!.href) }));
  return {
    hero: {
      eyebrow: str(g.hero?.eyebrow) ?? F.hero.eyebrow,
      heading: str(g.hero?.heading) ?? F.hero.heading,
      highlight: str(g.hero?.highlight) ?? F.hero.highlight,
      intro: str(g.hero?.intro) ?? F.hero.intro,
    },
    phases: {
      eyebrow: str(g.phases?.eyebrow) ?? F.phases.eyebrow,
      heading: str(g.phases?.heading) ?? F.phases.heading,
      items: phases.length ? phases : F.phases.items,
    },
    steps: {
      eyebrow: str(g.steps?.eyebrow) ?? F.steps.eyebrow,
      heading: str(g.steps?.heading) ?? F.steps.heading,
      closing: str(g.steps?.closing) ?? F.steps.closing,
      items: steps.length ? steps : F.steps.items,
    },
    capabilities: { heading: str(g.capabilities?.heading) ?? F.capabilities.heading, items: caps.length ? caps : F.capabilities.items },
    showcase: {
      eyebrow: str(g.showcase?.eyebrow) ?? F.showcase.eyebrow,
      heading: str(g.showcase?.heading) ?? F.showcase.heading,
      storySlugs: stories.length ? stories : F.showcase.storySlugs,
    },
    portfolio: {
      heading: str(g.portfolio?.heading) ?? F.portfolio.heading,
      note: str(g.portfolio?.note) ?? F.portfolio.note,
      items: portfolio.length ? portfolio : F.portfolio.items,
    },
    proof: { eyebrow: str(g.proof?.eyebrow) ?? F.proof.eyebrow, heading: str(g.proof?.heading) ?? F.proof.heading, items: proof.length ? proof : F.proof.items },
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
  async () => (await getPayloadClient()).findGlobal({ slug: "build-page" as never, depth: 1 }),
  ["global-build-page"],
  { tags: ["build-page"], revalidate: 3600 },
);

export async function getBuildPage(opts: { draft?: boolean } = {}): Promise<BuildPageModel> {
  try {
    if (opts.draft) {
      const g = await (await getPayloadClient()).findGlobal({ slug: "build-page" as never, draft: true, overrideAccess: true, depth: 1 });
      return adapt(g as Doc);
    }
    return adapt((await raw()) as Doc);
  } catch (e) {
    logCmsError("getBuildPage", e);
    return BUILD_FALLBACK;
  }
}
