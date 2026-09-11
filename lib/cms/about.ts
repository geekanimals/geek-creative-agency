import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { ABOUT_FALLBACK, type AboutModel } from "@/lib/site/aboutFallback";
import type { About as AboutDoc } from "@/payload-types";

function logCmsError(ctx: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static About fallback:`, e instanceof Error ? e.message : e);
}

/** Payload About Global → normalized AboutModel, filling any empty piece from
 *  the approved fallback so the design never shows an empty section. */
function adaptAbout(g: AboutDoc | null): AboutModel {
  const A = ABOUT_FALLBACK;
  if (!g) return A;
  return {
    hero: {
      headingLine1: g.hero?.headingLine1 || A.hero.headingLine1,
      headingLine2: g.hero?.headingLine2 || A.hero.headingLine2,
      lead: g.hero?.lead || A.hero.lead,
      paragraphs: g.hero?.paragraphs?.length ? g.hero.paragraphs.map((p) => p.text || "").filter(Boolean) : A.hero.paragraphs,
    },
    evolution: {
      eyebrow: g.evolution?.eyebrow || A.evolution.eyebrow,
      eras: g.evolution?.eras?.length ? g.evolution.eras.map((e) => ({ label: e.label })) : A.evolution.eras,
      headingMain: g.evolution?.headingMain || A.evolution.headingMain,
      headingMuted: g.evolution?.headingMuted || A.evolution.headingMuted,
    },
    win: {
      eyebrow: g.win?.eyebrow || A.win.eyebrow,
      headingLine1: g.win?.headingLine1 || A.win.headingLine1,
      headingLine2: g.win?.headingLine2 || A.win.headingLine2,
      highlight: g.win?.highlight || A.win.highlight,
      subcopy: g.win?.subcopy || A.win.subcopy,
    },
    geekWay: {
      heading: g.geekWay?.heading || A.geekWay.heading,
      principles: g.geekWay?.principles?.length ? g.geekWay.principles.map((p) => ({ title: p.title || "", body: p.body || "" })) : A.geekWay.principles,
    },
    seo: {
      metaTitle: g.seo?.metaTitle || undefined,
      metaDescription: g.seo?.metaDescription || undefined,
      ogImage: resolveMedia(g.seo?.ogImage as never)?.src,
      noindex: Boolean(g.seo?.noindex),
    },
  };
}

/** Published read, cached + tagged "about" (invalidated on About change). */
const rawAbout = unstable_cache(
  async () => (await getPayloadClient()).findGlobal({ slug: "about", depth: 1 }),
  ["global-about"],
  { tags: ["about"], revalidate: 3600 },
);

/**
 * About content. CMS-first, static fallback, never throws. In draft-preview mode
 * (validated upstream) it reads the latest DRAFT version, uncached.
 */
export async function getAbout(opts: { draft?: boolean } = {}): Promise<AboutModel> {
  try {
    if (opts.draft) {
      const g = await (await getPayloadClient()).findGlobal({ slug: "about", draft: true, overrideAccess: true, depth: 1 });
      return adaptAbout(g as AboutDoc);
    }
    return adaptAbout((await rawAbout()) as AboutDoc);
  } catch (e) {
    logCmsError("getAbout", e);
    return ABOUT_FALLBACK;
  }
}
