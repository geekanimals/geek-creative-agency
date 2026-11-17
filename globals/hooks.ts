import type { GlobalAfterChangeHook } from "payload";

/**
 * Shared afterChange hook for every Global: when site-wide chrome changes,
 * invalidate the cached global reads (tagged "globals") so Nav/Footer/SEO
 * refresh across the whole site. Wrapped so it is a harmless no-op outside a
 * request/render context (e.g. the seed/migrate CLI).
 */
export const revalidateGlobals: GlobalAfterChangeHook = async ({ doc }) => {
  try {
    const { revalidateTag, revalidatePath } = await import("next/cache");
    revalidateTag("globals", "max");
    // Nav/footer/socials appear on every page: refresh every page now, not on
    // each page's next timed revalidation.
    revalidatePath("/", "layout");
  } catch {
    /* not in a request context — ignore */
  }
  return doc;
};
