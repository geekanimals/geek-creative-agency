import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { goldStandardTabs } from "../fields/goldStandard";
import { revalidateEntityHooks } from "./revalidate";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * SOLUTIONS / GEEK IP — reusable methodologies, systems, programs or productized
 * solutions (e.g. Influencer Relationship Management). Public route:
 * /solutions/[slug]. Distinct from a SERVICE (what Geek sells) and from a
 * PROJECT (a brand-specific implementation). Related services are an explicit
 * relationship; industries/brands/implementations are DERIVED from Projects.
 */
export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: { singular: "Solution", plural: "Solutions" },
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "solutionType", "_status", "updatedAt"],
    description: "Geek solution / IP hub pages at /solutions/[slug]. Publish only when useful content exists.",
    preview: (doc) => {
      const slug = (doc as { slug?: string })?.slug;
      const secret = process.env.PREVIEW_SECRET;
      if (!slug) return null;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/solutions/${encodeURIComponent(slug)}` : `/solutions/${slug}`;
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
            { name: "name", type: "text", required: true, admin: { description: "e.g. “Influencer Relationship Management”." } },
            { name: "slug", type: "text", unique: true, index: true, admin: { description: "URL: /solutions/<slug>. Auto-filled from name on create." } },
            { name: "solutionType", type: "select", defaultValue: "solution", options: [
              { label: "Proprietary IP", value: "proprietary-ip" },
              { label: "Methodology", value: "methodology" },
              { label: "Program model", value: "program-model" },
              { label: "Solution", value: "solution" },
            ], admin: { description: "What kind of reusable asset this is." } },
            { name: "shortSummary", type: "textarea" },
            { name: "introduction", type: "textarea" },
            { name: "relatedServices", type: "relationship", relationTo: "services", hasMany: true, admin: { description: "Service(s) this solution is part of / related to (e.g. Influencer Marketing)." } },
          ],
        },
        {
          label: "What It Solves",
          fields: [
            { name: "whatItSolves", type: "group", label: false, fields: [
              { name: "heading", type: "text" },
              { name: "body", type: "textarea" },
            ] },
          ],
        },
        {
          label: "Methodology",
          fields: [
            { name: "methodology", type: "array", labels: { singular: "Step", plural: "Steps" }, admin: { description: "Optional structured methodology steps." }, fields: [
              { name: "title", type: "text", required: true },
              { name: "description", type: "textarea" },
            ] },
          ],
        },
        { label: "SEO", admin: { description: "Optional — falls back to name/summary, then site defaults." }, fields: [seoField({ hideLabel: true })] },
        // Gold Standard: press (independent validation of the solution/IP) + FAQ
        // (e.g. “What is Influencer Relationship Management?”) + internal Search
        // Strategy. Awards attach to campaigns/brands, not the abstract solution.
        ...goldStandardTabs({ press: true, faqs: true, searchStrategy: true }),
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
    ...revalidateEntityHooks({ tag: "solutions", routePrefix: "/solutions" }),
  },
};
