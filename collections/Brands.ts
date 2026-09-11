import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { goldStandardTabs } from "../fields/goldStandard";
import { revalidateEntityHooks } from "./revalidate";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * BRANDS — consumer-facing brand hubs. Public route: /brands/[slug]. A brand
 * belongs to one Company and carries a simple editorial `portfolioGroup`
 * (e.g. "Foods" / "Beverages") used to group brands on the Company hub — NOT a
 * separate PortfolioDivision collection. Programs vs campaigns are distinguished
 * on the Project via `projectKind`; work lists are DERIVED, never duplicated.
 */
export const Brands: CollectionConfig = {
  slug: "brands",
  labels: { singular: "Brand", plural: "Brands" },
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    defaultColumns: ["name", "company", "portfolioGroup", "_status", "updatedAt"],
    description: "Brand hub pages at /brands/[slug]. Publish only when useful content exists.",
    preview: (doc) => {
      const slug = (doc as { slug?: string })?.slug;
      const secret = process.env.PREVIEW_SECRET;
      if (!slug) return null;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/brands/${encodeURIComponent(slug)}` : `/brands/${slug}`;
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
            { name: "name", type: "text", required: true, admin: { description: "e.g. “Lay's”." } },
            { name: "slug", type: "text", unique: true, index: true, admin: { description: "URL: /brands/<slug>. Auto-filled from name on create." } },
            { type: "row", fields: [
              { name: "company", type: "relationship", relationTo: "companies", admin: { width: "50%", description: "Parent company (e.g. PepsiCo)." } },
              { name: "portfolioGroup", type: "text", admin: { width: "50%", description: "Simple grouping on the Company hub, e.g. “Foods” or “Beverages”." } },
            ] },
            { type: "row", fields: [
              { name: "logo", type: "upload", relationTo: "media", admin: { width: "50%" } },
              { name: "legacyLogoSrc", type: "text", admin: { width: "50%", description: "OR an existing /public/assets logo path." } },
            ] },
            { name: "shortSummary", type: "textarea" },
            { name: "introduction", type: "textarea" },
            { type: "row", fields: [
              { name: "heroMedia", type: "upload", relationTo: "media", admin: { width: "50%" } },
              { name: "heroLegacySrc", type: "text", admin: { width: "50%", description: "OR an existing /public/assets path." } },
            ] },
            { name: "businessCategories", type: "relationship", relationTo: "business-categories", hasMany: true, admin: { description: "Industries this brand belongs to (usually inherited from its company, but set explicitly here)." } },
          ],
        },
        { label: "SEO", admin: { description: "Optional — falls back to name/summary, then site defaults." }, fields: [seoField({ hideLabel: true })] },
        // Gold Standard: press + awards (brand-level recognition), FAQ, and
        // internal Search Strategy.
        ...goldStandardTabs({ press: true, awards: true, faqs: true, searchStrategy: true }),
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
    ...revalidateEntityHooks({ tag: "brands", routePrefix: "/brands" }),
  },
};
