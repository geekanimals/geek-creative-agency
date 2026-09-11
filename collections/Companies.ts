import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { goldStandardTabs } from "../fields/goldStandard";
import { revalidateEntityHooks } from "./revalidate";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * COMPANIES — corporate/client hubs. Public route: /companies/[slug]. Brands,
 * services, solutions and projects are DERIVED via reverse relationship queries
 * (brand.company / project.company / project.brand.company) — never duplicated.
 */
export const Companies: CollectionConfig = {
  slug: "companies",
  labels: { singular: "Company", plural: "Companies" },
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "_status", "updatedAt"],
    description: "Company hub pages at /companies/[slug]. Publish only when useful content exists.",
    preview: (doc) => {
      const slug = (doc as { slug?: string })?.slug;
      const secret = process.env.PREVIEW_SECRET;
      if (!slug) return null;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/companies/${encodeURIComponent(slug)}` : `/companies/${slug}`;
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
            { name: "name", type: "text", required: true, admin: { description: "e.g. “PepsiCo”." } },
            { name: "slug", type: "text", unique: true, index: true, admin: { description: "URL: /companies/<slug>. Auto-filled from name on create." } },
            { type: "row", fields: [
              { name: "logo", type: "upload", relationTo: "media", admin: { width: "50%" } },
              { name: "legacyLogoSrc", type: "text", admin: { width: "50%", description: "OR an existing /public/assets logo path." } },
            ] },
            { name: "website", type: "text", admin: { description: "Optional external website." } },
            { name: "shortSummary", type: "textarea" },
            { name: "introduction", type: "textarea", admin: { description: "The Geek–company relationship, in brief." } },
            { name: "businessCategories", type: "relationship", relationTo: "business-categories", hasMany: true, admin: { description: "Industries this company operates in." } },
          ],
        },
        { label: "SEO", admin: { description: "Optional — falls back to name/summary, then site defaults." }, fields: [seoField({ hideLabel: true })] },
        // Gold Standard: press + awards (corporate-level recognition), FAQ, and
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
    ...revalidateEntityHooks({ tag: "companies", routePrefix: "/companies" }),
  },
};
