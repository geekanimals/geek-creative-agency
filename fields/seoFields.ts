import type { Field } from "payload";

/**
 * Canonical SEO field group, shared by every page-shaped Global (About, What We
 * Do, Creators, Contact) and the Projects collection.
 *
 * The field NAMES and TYPES are fixed — `seo.metaTitle` / `seo.metaDescription`
 * / `seo.ogImage` / `seo.noindex` — so extracting this factory changes NO
 * database schema and generates NO migration for the existing collections.
 * Only admin-only presentation (label visibility, help text) is configurable.
 */
type SeoFieldKey = "metaTitle" | "metaDescription" | "ogImage" | "noindex";

type SeoFieldsOptions = {
  /** Hide the group's own "SEO" label in the admin UI (page Globals use this). */
  hideLabel?: boolean;
  /** Optional admin help text on the group. */
  groupDescription?: string;
  /** Optional per-field admin help text, to preserve existing editor copy. */
  descriptions?: Partial<Record<SeoFieldKey, string>>;
};

const withDescription = (description?: string) =>
  description ? { admin: { description } } : {};

/** Build the shared `seo` group field. Structure is identical across callers;
 *  only admin presentation differs. */
export function seoField(opts: SeoFieldsOptions = {}): Field {
  const d = opts.descriptions ?? {};
  return {
    name: "seo",
    type: "group",
    ...(opts.hideLabel ? { label: false } : {}),
    ...(opts.groupDescription ? { admin: { description: opts.groupDescription } } : {}),
    fields: [
      { name: "metaTitle", type: "text", ...withDescription(d.metaTitle) },
      { name: "metaDescription", type: "textarea", ...withDescription(d.metaDescription) },
      { name: "ogImage", type: "upload", relationTo: "media" },
      { name: "noindex", type: "checkbox", ...withDescription(d.noindex) },
    ],
  };
}
