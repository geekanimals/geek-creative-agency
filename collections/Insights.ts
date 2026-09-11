import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { insightCategories } from "../lib/insights";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * INSIGHTS — the editorial article Collection (repeatable content, like
 * Projects). Payload owns the article content; React owns the presentation
 * (the /insights grid + the /insights/[slug] template are unchanged).
 *
 * Deliberately NOT modelled: no Authors collection (all pieces are Geek
 * editorial — the byline is the Geek organisation), no Categories/Tags
 * collections (the 6 categories are a small stable controlled set → a select
 * whose values match lib/insights `insightCategories`, so the existing filter
 * keeps working), no featured flag (the Insights UI has no featured treatment),
 * and no manual reading-time (derived from the body — see lib/cms/insights.ts).
 *
 * Drafts enabled → editors preview before publishing (see /api/preview). Public
 * reads return published only; the frontend keeps the approved static articles
 * as a fallback so no live URL disappears mid-migration.
 */
export const Insights: CollectionConfig = {
  slug: "insights",
  labels: { singular: "Insight", plural: "Insights" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishDate", "_status", "updatedAt"],
    description: "Editorial articles for /insights. Save a draft and use Preview before publishing.",
    preview: (doc) => {
      const slug = (doc as { slug?: string })?.slug;
      const secret = process.env.PREVIEW_SECRET;
      if (!slug) return null;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/insights/${encodeURIComponent(slug)}` : `/insights/${slug}`;
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
            { name: "title", type: "text", required: true, admin: { description: "Article title (shown as the headline and card title)." } },
            {
              name: "slug",
              type: "text",
              unique: true,
              index: true,
              admin: { description: "URL segment: /insights/<slug>. Auto-filled from the title on create; keep it stable after publishing to preserve backlinks." },
            },
            { name: "excerpt", type: "textarea", admin: { description: "Standfirst / dek — the summary shown under the title and on the card." } },
            { name: "publishDate", type: "date", admin: { description: "Original publication date. Drives ordering, SEO and the sitemap.", date: { pickerAppearance: "dayOnly" } } },
            { type: "row", fields: [
              { name: "heroMedia", type: "upload", relationTo: "media", admin: { width: "50%", description: "Hero / card image (CMS upload). Or use the legacy path." } },
              { name: "heroLegacySrc", type: "text", admin: { width: "50%", description: "OR an existing /public/assets image path." } },
            ] },
          ],
        },
        {
          label: "Content",
          fields: [
            { name: "body", type: "richText", admin: { description: "Article body — headings, paragraphs, lists, links, quotes." } },
          ],
        },
        {
          label: "Taxonomy",
          fields: [
            { name: "category", type: "select", required: true, options: insightCategories.map((c) => ({ label: c.label, value: c.slug })), admin: { description: "Editorial category (drives the /insights filter)." } },
          ],
        },
        {
          label: "SEO",
          admin: { description: "Optional — sensible defaults derive from the title, excerpt and hero image." },
          fields: [seoField({ hideLabel: true, descriptions: { metaTitle: "Falls back to “<title> | Geek Insights”.", metaDescription: "Falls back to the excerpt." } })],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        // Auto-slug from title only when empty (on create); otherwise normalise
        // whatever the editor typed. Never silently rewrite an existing slug.
        if (!data.slug && typeof data.title === "string" && data.title.trim()) {
          data.slug = slugify(data.title);
        } else if (typeof data.slug === "string" && data.slug.trim()) {
          data.slug = slugify(data.slug);
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        try {
          const { revalidateTag, revalidatePath } = await import("next/cache");
          revalidateTag("insights", "max");
          revalidatePath("/insights");
          if (doc?.slug) revalidatePath(`/insights/${doc.slug}`);
          // Slug changed → also refresh the OLD path so the moved URL updates.
          if (previousDoc?.slug && previousDoc.slug !== doc?.slug) revalidatePath(`/insights/${previousDoc.slug}`);
        } catch {
          /* not in a request/render context (seed/CLI) — ignore */
        }
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const { revalidateTag, revalidatePath } = await import("next/cache");
          revalidateTag("insights", "max");
          revalidatePath("/insights");
          if (doc?.slug) revalidatePath(`/insights/${doc.slug}`);
        } catch {
          /* ignore */
        }
      },
    ],
  },
};
