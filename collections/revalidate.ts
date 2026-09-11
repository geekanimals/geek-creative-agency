import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/**
 * Build afterChange/afterDelete hooks for a hub Collection that invalidate the
 * collection's cache tag plus the affected entity route (new and, on a slug
 * change, the old one). Failures are non-fatal (e.g. seed/CLI outside a request
 * context) so an editorial save is never blocked.
 *
 * `routePrefix` example: "/brands" → revalidates "/brands/<slug>".
 */
export function revalidateEntityHooks({ tag, routePrefix }: { tag: string; routePrefix: string }): {
  afterChange: CollectionAfterChangeHook[];
  afterDelete: CollectionAfterDeleteHook[];
} {
  return {
    afterChange: [
      async ({ doc, previousDoc }) => {
        try {
          const { revalidateTag, revalidatePath } = await import("next/cache");
          revalidateTag(tag, "max");
          if (doc?.slug) revalidatePath(`${routePrefix}/${doc.slug}`);
          if (previousDoc?.slug && previousDoc.slug !== doc?.slug) revalidatePath(`${routePrefix}/${previousDoc.slug}`);
        } catch {
          /* not in a request/render context — ignore */
        }
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const { revalidateTag, revalidatePath } = await import("next/cache");
          revalidateTag(tag, "max");
          if (doc?.slug) revalidatePath(`${routePrefix}/${doc.slug}`);
        } catch {
          /* ignore */
        }
      },
    ],
  };
}
