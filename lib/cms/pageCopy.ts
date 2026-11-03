import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient, isCmsNotConfiguredError } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";

/**
 * Small editorial Globals that only hold text: the three door pages and the
 * /work headings. Every field falls back to the approved copy, so a CMS outage
 * or an empty field never blanks a page.
 */
type Seo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };
type RawSeo = { metaTitle?: string | null; metaDescription?: string | null; ogImage?: unknown; noindex?: boolean | null } | null | undefined;

const seoFrom = (s: RawSeo): Seo => ({
  metaTitle: s?.metaTitle || undefined,
  metaDescription: s?.metaDescription || undefined,
  ogImage: resolveMedia(s?.ogImage as never)?.src,
  noindex: Boolean(s?.noindex),
});

function logCmsError(ctx: string, e: unknown) {
  if (isCmsNotConfiguredError(e)) return;
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using approved fallback:`, e instanceof Error ? e.message : e);
}

async function readGlobal(slug: string, tag: string, draft?: boolean): Promise<Record<string, unknown> | null> {
  try {
    if (draft) {
      return (await (await getPayloadClient()).findGlobal({ slug: slug as never, draft: true, overrideAccess: true, depth: 1 })) as never;
    }
    const cached = unstable_cache(
      async () => (await getPayloadClient()).findGlobal({ slug: slug as never, depth: 1 }),
      [`global-${slug}`],
      { tags: [tag], revalidate: 3600 },
    );
    return (await cached()) as never;
  } catch (e) {
    logCmsError(`read ${slug}`, e);
    return null;
  }
}

/* ── Door pages ─────────────────────────────────────────────────────────── */
export type DoorKey = "client" | "career" | "vendor";
export type DoorCopy = { title?: string; intro: string; seo: Seo };

const DOOR_FALLBACK: Record<DoorKey, { intro: string }> = {
  client: {
    intro:
      "Tell us what you're building and where you want it to go. Our team reads every brief and gets back to you within 1–2 working days.",
  },
  career: {
    intro:
      "Want to build brands that matter? Tell us about yourself and upload your resume. Our team goes through every application and gets in touch if there's a fit.",
  },
  vendor: {
    intro:
      "Tell us what you do, where you work and the work you're proud of. Our team reviews every partner and gets back to you.",
  },
};

const DOOR_GLOBAL: Record<DoorKey, string> = {
  client: "build-my-brand-page",
  career: "careers-page",
  vendor: "partners-page",
};

export async function getDoorCopy(key: DoorKey, opts: { draft?: boolean } = {}): Promise<DoorCopy> {
  const slug = DOOR_GLOBAL[key];
  const d = ((await readGlobal(slug, slug, opts.draft)) ?? {}) as {
    title?: string | null;
    intro?: string | null;
    seo?: RawSeo;
  };
  return {
    title: d.title || undefined,
    intro: d.intro || DOOR_FALLBACK[key].intro,
    seo: seoFrom(d.seo),
  };
}

/* ── /work headings ─────────────────────────────────────────────────────── */
export type WorkPageCopy = { title: string; lede: string; exploreTitle: string; seo: Seo };

const WORK_FALLBACK = { title: "The Work.", lede: "Ideas that made an impact.", exploreTitle: "Explore All Work." };

export async function getWorkPageCopy(opts: { draft?: boolean } = {}): Promise<WorkPageCopy> {
  const g = (await readGlobal("work-page", "work-page", opts.draft)) as
    | { title?: string | null; lede?: string | null; exploreTitle?: string | null; seo?: RawSeo }
    | null;
  return {
    title: g?.title || WORK_FALLBACK.title,
    lede: g?.lede || WORK_FALLBACK.lede,
    exploreTitle: g?.exploreTitle || WORK_FALLBACK.exploreTitle,
    seo: seoFrom(g?.seo),
  };
}
