import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient, isCmsNotConfiguredError } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { resolveVideo } from "@/lib/cms/video";
import { HOME_FALLBACK, type HomeCard, type HomePageModel } from "@/lib/site/homeFallback";
import type { HomePage as HomeDoc } from "@/payload-types";

function logCmsError(ctx: string, e: unknown) {
  if (isCmsNotConfiguredError(e)) return; // CMS off → static content, no noise
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static Home fallback:`, e instanceof Error ? e.message : e);
}

/* New list fields (cards, stats, steps, stories) are read loosely until
   payload-types is regenerated. Empty list in the admin → the code defaults. */
type Row = Record<string, unknown>;
const rows = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]) : []);
const txt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const img = (v: unknown) => resolveMedia(v as never)?.src;
const list = <T,>(items: T[], fallback: T[]) => (items.length ? items : fallback);

function picCards(v: unknown, keyPrefix: string): HomeCard[] {
  return rows(v)
    .filter((r) => txt(r.title) && txt(r.href))
    .map((r, i) => ({
      key: `${keyPrefix}-${i}-${txt(r.title)}`,
      href: txt(r.href) as string,
      src: img(r.image),
      brand: txt(r.title) as string,
      project: txt(r.line) ?? txt(r.kicker),
      blurb: txt(r.blurb),
    }));
}

/** Case studies picked for "The Work." (relationship, populated at depth 1). */
function workCards(v: unknown): HomeCard[] {
  return rows(v)
    .filter((p) => txt(p.slug) && p._status !== "draft")
    .map((p) => ({
      key: p.slug as string,
      href: `/work/${p.slug}`,
      src: img(p.heroMedia) ?? txt(p.heroLegacySrc),
      brand: txt(p.client) ?? (p.title as string),
      project: p.title as string,
    }));
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
      // `logos` array is new (read loosely until payload-types is regenerated)
      logos: (((g.logoWall as unknown as { logos?: { name?: string | null; logo?: unknown }[] })?.logos) ?? [])
        .filter((l) => l?.name)
        .map((l) => ({ name: l.name as string, logo: resolveMedia(l.logo as never)?.src })),
    },
    build: {
      title: g.build?.title || F.build.title,
      sub: g.build?.sub || F.build.sub,
      trailing: g.build?.trailing || F.build.trailing,
      buttonLabel: g.build?.buttonLabel || F.build.buttonLabel,
      cards: list(picCards((g as unknown as Record<string, Row | undefined>).build?.cards, "build"), F.build.cards),
    },
    create: {
      title: g.create?.title || F.create.title,
      sub: g.create?.sub || F.create.sub,
      buttonLabel: g.create?.buttonLabel || F.create.buttonLabel,
      cards: list(picCards((g as unknown as Record<string, Row | undefined>).create?.cards, "create"), F.create.cards),
    },
    influence: {
      eyebrow: g.influence?.eyebrow || F.influence.eyebrow,
      heading: g.influence?.heading || F.influence.heading,
      sub: g.influence?.sub || F.influence.sub,
      list: g.influence?.list || F.influence.list,
      linkLabel: g.influence?.linkLabel || F.influence.linkLabel,
      linkHref: g.influence?.linkHref || F.influence.linkHref,
      buttonLabel: (g.influence as { buttonLabel?: string | null } | undefined)?.buttonLabel || F.influence.buttonLabel,
    },
    proof: {
      eyebrow: g.proof?.eyebrow || F.proof.eyebrow,
      sub: g.proof?.sub || F.proof.sub,
      cases: list(
        rows((g as unknown as Record<string, Row | undefined>).proof?.cases)
          .filter((c) => txt(c.brand))
          .map((c) => ({
            brand: c.brand as string,
            src: img(c.image),
            href: txt(c.href),
            stats: rows(c.stats)
              .filter((st) => typeof st.value === "number" && txt(st.label))
              .map((st) => ({ value: st.value as number, suffix: txt(st.suffix), label: st.label as string })),
          }))
          .filter((c) => c.stats.length),
        F.proof.cases,
      ),
    },
    process: {
      heading: g.process?.heading || F.process.heading,
      headingHighlight: g.process?.headingHighlight || F.process.headingHighlight,
      trailing: g.process?.trailing || F.process.trailing,
      steps: list(rows((g as unknown as Record<string, Row | undefined>).process?.steps).map((st) => txt(st.label)).filter(Boolean) as string[], F.process.steps),
    },
    builtByGeek: {
      eyebrow: g.builtByGeek?.eyebrow || F.builtByGeek.eyebrow,
      headingBlock: g.builtByGeek?.headingBlock || F.builtByGeek.headingBlock,
      headingCyan: g.builtByGeek?.headingCyan || F.builtByGeek.headingCyan,
      closing: g.builtByGeek?.closing || F.builtByGeek.closing,
      closingHighlight: g.builtByGeek?.closingHighlight || F.builtByGeek.closingHighlight,
      stories: list(picCards((g as unknown as Record<string, Row | undefined>).builtByGeek?.stories, "bbg"), F.builtByGeek.stories),
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
      cards: list(workCards((g as unknown as Record<string, Row | undefined>).work?.stories), F.work.cards),
    },
    mediaChanged: (() => {
      // New group — read loosely until payload-types is regenerated.
      type Era = { pre?: string | null; post?: string | null; label?: string | null; href?: string | null; image?: unknown; video?: never; animated?: boolean | null };
      const mc = (g as unknown as { mediaChanged?: { eras?: Era[]; finaleKicker?: string | null; finaleWord?: string | null } }).mediaChanged;
      const eras = (mc?.eras ?? [])
        .filter((e) => e?.pre && e?.post)
        .map((e) => ({
          pre: e.pre as string,
          post: e.post as string,
          label: e.label || `${e.pre} ${e.post}`,
          src: resolveMedia(e.image as never)?.src,
          video: resolveVideo(e.video) ?? undefined,
          href: e.href || undefined,
          transitional: Boolean(e.animated),
        }));
      return {
        eras: eras.length ? eras : F.mediaChanged.eras,
        finaleKicker: mc?.finaleKicker || F.mediaChanged.finaleKicker,
        finaleWord: mc?.finaleWord || F.mediaChanged.finaleWord,
      };
    })(),
    videos: (() => {
      // `videos` is added by fields/video.ts; read loosely until payload-types is regenerated.
      // Each section's own video (Hero / Build / Built by Geek tabs) wins; the old
      // hidden "videos" group is the fallback so earlier uploads keep playing.
      const v = (g as unknown as { videos?: Record<string, never> }).videos;
      const own = (section: unknown) => (section as { video?: never } | null | undefined)?.video;
      return {
        hero: resolveVideo(own(g.hero)) ?? resolveVideo(v?.hero),
        build: resolveVideo(own(g.build)) ?? resolveVideo(v?.build),
        builtByGeek: resolveVideo(own(g.builtByGeek)) ?? resolveVideo(v?.builtByGeek),
      };
    })(),
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
