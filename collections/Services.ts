import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { goldStandardTabs } from "../fields/goldStandard";
import { revalidateEntityHooks } from "./revalidate";

/**
 * SERVICES — now FIRST-CLASS editorial + SEO landing pages (public route
 * /services/[slug]) AND the reusable Project taxonomy. The original taxonomy
 * fields (label, slug, order) and every existing Project→services relationship
 * are preserved unchanged; editorial fields + drafts were added on top.
 *
 * Read is published-only for anonymous users (so unpublished/thin service pages
 * and their draft editorial content never leak). Existing services are seeded/
 * backfilled to `published` so the /work filter (static taxonomy in
 * lib/work/taxonomy.ts) and existing project service tags keep working.
 */
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    group: "Taxonomy",
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "order", "_status"],
    description: "What Geek does. Doubles as a /services/[slug] SEO page — publish only when it has real content.",
    preview: (doc) => {
      const slug = (doc as { slug?: string })?.slug;
      const secret = process.env.PREVIEW_SECRET;
      if (!slug) return null;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/services/${encodeURIComponent(slug)}` : `/services/${slug}`;
    },
  },
  versions: { drafts: true },
  defaultSort: "order",
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: "published" } }),
    create: isEditorUp,
    update: isEditorUp,
    delete: isAdminOrOwner,
    readVersions: isEditorUp,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Taxonomy",
          fields: [
            { name: "label", type: "text", required: true, admin: { description: "Display name, e.g. “Influencer Marketing”." } },
            { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "Stable URL/filter value, e.g. “influencer-marketing”. Matches lib/work/taxonomy.ts. Do not change after launch." } },
            { name: "order", type: "number", defaultValue: 100, admin: { description: "Lower sorts first." } },
          ],
        },
        {
          label: "Editorial",
          admin: { description: "Optional — the /services/<slug> page stays effectively empty (keep it a Draft) until filled." },
          fields: [
            { name: "hero", type: "group", label: false, fields: [
              { name: "heading", type: "text", admin: { description: "Service page headline (falls back to the label)." } },
              { name: "shortSummary", type: "textarea" },
            ] },
            { name: "introduction", type: "textarea" },
            { name: "capabilities", type: "array", labels: { singular: "Capability", plural: "Capabilities" }, admin: { description: "Optional structured capabilities." }, fields: [
              { name: "title", type: "text", required: true },
              { name: "description", type: "textarea" },
            ] },
            { name: "approach", type: "textarea", admin: { description: "Optional — how Geek approaches this service." } },
          ],
        },
        { label: "SEO", admin: { description: "Optional — falls back to the label/summary, then site defaults." }, fields: [seoField({ hideLabel: true })] },
        // Gold Standard: FAQ (e.g. “What is barter influencer marketing?”) +
        // internal Search Strategy. No campaign-specific press/awards on a service.
        ...goldStandardTabs({ faqs: true, searchStrategy: true }),
      ],
    },
  ],
  hooks: {
    ...revalidateEntityHooks({ tag: "services", routePrefix: "/services" }),
  },
};
