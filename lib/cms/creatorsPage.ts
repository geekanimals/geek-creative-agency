import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { CREATORS_FALLBACK, type CreatorsPageModel } from "@/lib/site/creatorsFallback";
import type { CreatorsPage as CreatorsDoc } from "@/payload-types";

function logCmsError(ctx: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static Creators fallback:`, e instanceof Error ? e.message : e);
}

/** Payload Creators Global → normalized model, filling empty pieces from the
 *  approved fallback so no section renders empty. */
function adaptCreators(g: CreatorsDoc | null): CreatorsPageModel {
  const F = CREATORS_FALLBACK;
  if (!g) return F;
  const opportunities = g.oneDegree?.opportunities?.length
    ? g.oneDegree.opportunities.map((o) => o.text).filter(Boolean)
    : F.oneDegree.opportunities;
  return {
    hero: {
      headingBlock: g.hero?.headingBlock || F.hero.headingBlock,
      headingHighlight: g.hero?.headingHighlight || F.hero.headingHighlight,
      subline: g.hero?.subline || F.hero.subline,
      ctaLabel: g.hero?.ctaLabel || F.hero.ctaLabel,
      ctaHref: g.hero?.ctaHref || F.hero.ctaHref,
    },
    oneDegree: {
      heading: g.oneDegree?.heading || F.oneDegree.heading,
      body: g.oneDegree?.body || F.oneDegree.body,
      opportunities,
    },
    whyGeek: {
      eyebrow: g.whyGeek?.eyebrow || F.whyGeek.eyebrow,
      heading: g.whyGeek?.heading || F.whyGeek.heading,
      headingHighlight: g.whyGeek?.headingHighlight || F.whyGeek.headingHighlight,
    },
    join: {
      eyebrow: g.join?.eyebrow || F.join.eyebrow,
      heading: g.join?.heading || F.join.heading,
      subcopy: g.join?.subcopy || F.join.subcopy,
    },
    seo: {
      metaTitle: g.seo?.metaTitle || undefined,
      metaDescription: g.seo?.metaDescription || undefined,
      ogImage: resolveMedia(g.seo?.ogImage as never)?.src,
      noindex: Boolean(g.seo?.noindex),
    },
  };
}

const rawCreators = unstable_cache(
  async () => (await getPayloadClient()).findGlobal({ slug: "creators-page", depth: 1 }),
  ["global-creators-page"],
  { tags: ["creators-page"], revalidate: 3600 },
);

export async function getCreatorsPage(opts: { draft?: boolean } = {}): Promise<CreatorsPageModel> {
  try {
    if (opts.draft) {
      const g = await (await getPayloadClient()).findGlobal({ slug: "creators-page", draft: true, overrideAccess: true, depth: 1 });
      return adaptCreators(g as CreatorsDoc);
    }
    return adaptCreators((await rawCreators()) as CreatorsDoc);
  } catch (e) {
    logCmsError("getCreatorsPage", e);
    return CREATORS_FALLBACK;
  }
}
