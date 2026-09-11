import type { GlobalAfterChangeHook } from "payload";

/**
 * Build an `afterChange` hook for a page-shaped Global that invalidates exactly
 * one cache tag and one path — the proven pattern shared by About, What We Do,
 * Creators and Contact.
 *
 * Revalidation failures (including running outside a request context, e.g. the
 * seed script or CLI) are logged but never thrown, so an editorial save is never
 * blocked by a cache-invalidation hiccup.
 */
export function revalidatePageHook({ tag, path }: { tag: string; path: string }): GlobalAfterChangeHook {
  return async ({ doc }) => {
    try {
      const { revalidateTag, revalidatePath } = await import("next/cache");
      revalidateTag(tag, "max");
      revalidatePath(path);
    } catch (e) {
      // Not in a request context, or revalidation failed — non-fatal, keep the save.
      // eslint-disable-next-line no-console
      console.warn(`[cms] revalidate skipped for tag "${tag}" (${path}):`, e instanceof Error ? e.message : e);
    }
    return doc;
  };
}
