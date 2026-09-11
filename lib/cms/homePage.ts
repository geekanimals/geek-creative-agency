import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";
import type { HomePage as HomeDoc } from "@/payload-types";

function logCmsError(ctx: string, e: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static Home fallback:`, e instanceof Error ? e.message : e);
}

/** Payload Home Global → normalized model, filling every empty piece from the
 *  approved fallback so no section ever renders blank/broken. Per-field merge. */
function adaptHome(g: HomeDoc | null): HomePageModel {
  const F = HOME_FALLBACK;
  if (!g) return F;
  const principles = g.geekWay?.principles?.length
    ? g.geekWay.principles.map((p) => ({ title: p.title, body: p.body || "" })).filter((p) => p.title)
    : F.geekWay.principles;
  return {
    hero: {
      headingBlock: g.hero?.headingBlock || F.hero.headingBlock,
      headingHighlight: g.hero?.headingHighlight || F.hero.headingHighlight,
      subline: g.hero?.subline || F.hero.subline,
      ctaPrimary: { label: g.hero?.ctaPrimaryLabel || F.hero.ctaPrimary.label, href: g.hero?.ctaPrimaryHref || F.hero.ctaPrimary.href },
      ctaSecondary: { label: g.hero?.ctaSecondaryLabel || F.hero.ctaSecondary.label, href: g.hero?.ctaSecondaryHref || F.hero.ctaSecondary.href },
    },
    logoWall: {
      heading: g.logoWall?.heading || F.logoWall.heading,
      headingHighlight: g.logoWall?.headingHighlight || F.logoWall.headingHighlight,
    },
    build: {
      title: g.build?.title || F.build.title,
      sub: g.build?.sub || F.build.sub,
      trailing: g.build?.trailing || F.build.trailing,
    },
    create: {
      title: g.create?.title || F.create.title,
      sub: g.create?.sub || F.create.sub,
    },
    influence: {
      eyebrow: g.influence?.eyebrow || F.influence.eyebrow,
      heading: g.influence?.heading || F.influence.heading,
      sub: g.influence?.sub || F.influence.sub,
      list: g.influence?.list || F.influence.list,
      linkLabel: g.influence?.linkLabel || F.influence.linkLabel,
      linkHref: g.influence?.linkHref || F.influence.linkHref,
    },
    proof: {
      eyebrow: g.proof?.eyebrow || F.proof.eyebrow,
      sub: g.proof?.sub || F.proof.sub,
    },
    process: {
      heading: g.process?.heading || F.process.heading,
      headingHighlight: g.process?.headingHighlight || F.process.headingHighlight,
      trailing: g.process?.trailing || F.process.trailing,
    },
    builtByGeek: {
      eyebrow: g.builtByGeek?.eyebrow || F.builtByGeek.eyebrow,
      headingBlock: g.builtByGeek?.headingBlock || F.builtByGeek.headingBlock,
      headingCyan: g.builtByGeek?.headingCyan || F.builtByGeek.headingCyan,
      closing: g.builtByGeek?.closing || F.builtByGeek.closing,
      closingHighlight: g.builtByGeek?.closingHighlight || F.builtByGeek.closingHighlight,
    },
    geekWay: {
      title: g.geekWay?.title || F.geekWay.title,
      principles,
      finaleBlock: g.geekWay?.finaleBlock || F.geekWay.finaleBlock,
      finaleHighlight: g.geekWay?.finaleHighlight || F.geekWay.finaleHighlight,
      finaleSub: g.geekWay?.finaleSub || F.geekWay.finaleSub,
    },
    work: {
      title: g.work?.title || F.work.title,
      sub: g.work?.sub || F.work.sub,
    },
    seo: {
      metaTitle: g.seo?.metaTitle || undefined,
      metaDescription: g.seo?.metaDescription || undefined,
      ogImage: resolveMedia(g.seo?.ogImage as never)?.src,
      noindex: Boolean(g.seo?.noindex),
    },
  };
}

const rawHome = unstable_cache(
  async () => (await getPayloadClient()).findGlobal({ slug: "home-page", depth: 1 }),
  ["global-home-page"],
  { tags: ["home-page"], revalidate: 3600 },
);

export async function getHomePage(opts: { draft?: boolean } = {}): Promise<HomePageModel> {
  try {
    if (opts.draft) {
      const g = await (await getPayloadClient()).findGlobal({ slug: "home-page", draft: true, overrideAccess: true, depth: 1 });
      return adaptHome(g as HomeDoc);
    }
    return adaptHome((await rawHome()) as HomeDoc);
  } catch (e) {
    logCmsError("getHomePage", e);
    return HOME_FALLBACK;
  }
}
