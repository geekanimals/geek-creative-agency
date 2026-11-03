import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient, isCmsNotConfiguredError } from "@/lib/cms/payload";
import { resolveMedia } from "@/lib/cms/media";
import { CONTACT_FALLBACK, type ContactPageModel, type ContactDoor, type ContactOffice } from "@/lib/site/contactFallback";
import type { ContactPage as ContactDoc } from "@/payload-types";

function logCmsError(ctx: string, e: unknown) {
  if (isCmsNotConfiguredError(e)) return; // CMS off → static content, no noise
  // eslint-disable-next-line no-console
  console.error(`[cms] ${ctx} failed; using static Contact fallback:`, e instanceof Error ? e.message : e);
}

/** Merge CMS door labels onto the canonical fallback doors. The four doors,
 *  their order and their keys always come from code (they map to fixed forms);
 *  the CMS can only override each door's title/sub. */
function adaptDoors(cms: ContactDoc["doors"]): ContactPageModel["doors"] {
  const F = CONTACT_FALLBACK.doors;
  const cmsItems = cms?.items ?? [];
  const byKey = new Map<string, { title?: string | null; sub?: string | null }>(
    cmsItems.filter((i) => i.key).map((i) => [i.key as string, { title: i.title, sub: i.sub }]),
  );
  const items: ContactDoor[] = F.items.map((f) => {
    const c = byKey.get(f.key);
    return { key: f.key, title: c?.title || f.title, sub: c?.sub || f.sub };
  });
  return {
    eyebrow: cms?.eyebrow || F.eyebrow,
    heading: cms?.heading || F.heading,
    items,
  };
}

/** CMS offices; an empty list in the admin falls back to the code offices. */
function adaptOffices(cms: ContactDoc["offices"]): ContactPageModel["offices"] {
  const F = CONTACT_FALLBACK.offices;
  const items: ContactOffice[] = (cms?.items ?? [])
    .filter((i) => i.city && i.address)
    .map((i) => ({ city: i.city as string, address: i.address as string, mapQuery: i.mapQuery || undefined }));
  return {
    eyebrow: cms?.eyebrow || F.eyebrow,
    heading: cms?.heading || F.heading,
    items: items.length ? items : F.items,
  };
}

/** Payload Contact Global → normalized model, filling empty pieces from the
 *  approved fallback so no section renders empty. */
function adaptContact(g: ContactDoc | null): ContactPageModel {
  const F = CONTACT_FALLBACK;
  if (!g) return F;
  return {
    hero: {
      headingBlock: g.hero?.headingBlock || F.hero.headingBlock,
      headingHighlight: g.hero?.headingHighlight || F.hero.headingHighlight,
      formEyebrow: g.hero?.formEyebrow || F.hero.formEyebrow,
    },
    doors: adaptDoors(g.doors),
    offices: adaptOffices(g.offices),
    seo: {
      metaTitle: g.seo?.metaTitle || undefined,
      metaDescription: g.seo?.metaDescription || undefined,
      ogImage: resolveMedia(g.seo?.ogImage as never)?.src,
      noindex: Boolean(g.seo?.noindex),
    },
  };
}

const rawContact = unstable_cache(
  async () => (await getPayloadClient()).findGlobal({ slug: "contact-page", depth: 1 }),
  ["global-contact-page"],
  { tags: ["contact-page"], revalidate: 3600 },
);

export async function getContactPage(opts: { draft?: boolean } = {}): Promise<ContactPageModel> {
  try {
    if (opts.draft) {
      const g = await (await getPayloadClient()).findGlobal({ slug: "contact-page", draft: true, overrideAccess: true, depth: 1 });
      return adaptContact(g as ContactDoc);
    }
    return adaptContact((await rawContact()) as ContactDoc);
  } catch (e) {
    logCmsError("getContactPage", e);
    return CONTACT_FALLBACK;
  }
}
