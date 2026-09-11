import type { GlobalAfterChangeHook } from "payload";

/**
 * Shared afterChange hook for every Global: when site-wide chrome changes,
 * invalidate the cached global reads (tagged "globals") so Nav/Footer/SEO
 * refresh across the whole site. Wrapped so it is a harmless no-op outside a
 * request/render context (e.g. the seed/migrate CLI).
 */
export const revalidateGlobals: GlobalAfterChangeHook = async ({ doc }) => {
  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag("globals", "max");
  } catch {
    /* not in a request context — ignore */
  }
  return doc;
};
