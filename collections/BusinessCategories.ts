import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { goldStandardTabs } from "../fields/goldStandard";
import { revalidateEntityHooks } from "./revalidate";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * BUSINESS CATEGORIES / INDUSTRIES — vertical discovery + commercial SEO hubs.
 * Public route: /industries/[slug]. Editorial content only; all listings
 * (companies, brands, services, solutions, projects) are DERIVED from
 * relationships at query time — never duplicated here.
 */
export const BusinessCategories: CollectionConfig = {
  slug: "business-categories",
  labels: { singular: "Industry", plural: "Industries" },
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "_status", "updatedAt"],
    description: "Industry/vertical hub pages at /industries/[slug]. Publish only when useful content exists.",
    preview: (doc) => {
      const slug = (doc as { slug?: string })?.slug;
      const secret = process.env.PREVIEW_SECRET;
      if (!slug) return null;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/industries/${encodeURIComponent(slug)}` : `/industries/${slug}`;
    },
  },
  versions: { drafts: true },
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
          label: "Overview",
          fields: [
            { name: "name", type: "text", required: true, admin: { description: "e.g. “FMCG”." } },
            { name: "slug", type: "text", unique: true, index: true, admin: { description: "URL: /industries/<slug>. Auto-filled from name on create." } },
            { name: "shortSummary", type: "textarea", admin: { description: "One-line positioning used on cards and hero." } },
            { name: "introduction", type: "textarea", admin: { description: "Editorial positioning of Geek's work in this industry." } },
            { type: "row", fields: [
              { name: "heroMedia", type: "upload", relationTo: "media", admin: { width: "50%" } },
              { name: "heroLegacySrc", type: "text", admin: { width: "50%", description: "OR an existing /public/assets path." } },
            ] },
          ],
        },
        { label: "SEO", admin: { description: "Optional — falls back to name/summary, then site defaults." }, fields: [seoField({ hideLabel: true })] },
        // Gold Standard: FAQ (public) + Search Strategy (internal). No press/awards
        // — an industry hub has no campaign-specific coverage of its own.
        ...goldStandardTabs({ faqs: true, searchStrategy: true }),
      ],
    },
  ],
  hooks: {
    beforeValidate: [({ data }) => {
      if (!data) return data;
      if (!data.slug && typeof data.name === "string" && data.name.trim()) data.slug = slugify(data.name);
      else if (typeof data.slug === "string" && data.slug.trim()) data.slug = slugify(data.slug);
      return data;
    }],
    ...revalidateEntityHooks({ tag: "business-categories", routePrefix: "/industries" }),
  },
};
