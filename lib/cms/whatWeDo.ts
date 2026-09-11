import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { WHAT_WE_DO_FALLBACK, type WhatWeDoModel } from "@/lib/site/whatWeDoFallback";
import type { WhatWeDo as WwdDoc } from "@/payload-types";

function logCmsError(ctx: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static What We Do fallback:`, e instanceof Error ? e.message : e);
}

/** Payload What We Do Global → normalized model, filling empty pieces from the
 *  approved fallback so no section renders empty. */
function adaptWwd(g: WwdDoc | null): WhatWeDoModel {
  const F = WHAT_WE_DO_FALLBACK;
  if (!g) return F;
  const caps = g.capabilities?.length
    ? g.capabilities.map((c) => ({
        label: c.label,
        items: (c.items ?? []).map((i) => i.text).filter(Boolean),
        thought: c.thought || "",
        thoughtHighlight: c.thoughtHighlight || undefined,
        linkLabel: c.linkLabel || undefined,
        linkHref: c.linkHref || undefined,
      }))
    : F.capabilities;
  return {
    hero: {
      block1: g.hero?.block1 || F.hero.block1,
      block2: g.hero?.block2 || F.hero.block2,
      highlight: g.hero?.highlight || F.hero.highlight,
      intro: g.hero?.intro || F.hero.intro,
    },
    capabilities: caps,
    cta: { label: g.cta?.label || F.cta.label, href: g.cta?.href || F.cta.href },
    seo: {
      metaTitle: g.seo?.metaTitle || undefined,
      metaDescription: g.seo?.metaDescription || undefined,
      ogImage: resolveMedia(g.seo?.ogImage as never)?.src,
      noindex: Boolean(g.seo?.noindex),
    },
  };
}

const rawWwd = unstable_cache(
  async () => (await getPayloadClient()).findGlobal({ slug: "what-we-do", depth: 1 }),
  ["global-what-we-do"],
  { tags: ["what-we-do"], revalidate: 3600 },
);

export async function getWhatWeDo(opts: { draft?: boolean } = {}): Promise<WhatWeDoModel> {
  try {
    if (opts.draft) {
      const g = await (await getPayloadClient()).findGlobal({ slug: "what-we-do", draft: true, overrideAccess: true, depth: 1 });
      return adaptWwd(g as WwdDoc);
    }
    return adaptWwd((await rawWwd()) as WwdDoc);
  } catch (e) {
    logCmsError("getWhatWeDo", e);
    return WHAT_WE_DO_FALLBACK;
  }
}
