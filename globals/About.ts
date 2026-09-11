import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * ABOUT PAGE content. Structured fields that map 1:1 to the approved page's
 * sections — NOT a generic page builder. CMS owns the copy; React keeps the
 * design (cyan highlights, two-tone headings, the navy section, spacing, type).
 *
 * Drafts are enabled so an editor can save + PREVIEW About changes before they
 * go live (see /api/preview). Public reads return the published version; if none
 * exists or the CMS is unavailable, the page renders the approved static fallback.
 */
export const About: GlobalConfig = {
  slug: "about",
  label: "About Page",
  admin: {
    group: "Pages",
    description: "The /about page. Save a draft and use Preview to review before publishing.",
    preview: (_doc, { req }) => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/about` : "/about";
    },
  },
  versions: { drafts: true },
  access: { read: ({ req: { user } }) => (user ? true : { _status: { equals: "published" } }), update: isEditorUp, readVersions: isEditorUp },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "hero", type: "group", label: false, fields: [
              { type: "row", fields: [
                { name: "headingLine1", type: "text", admin: { width: "50%", description: "First line of the big heading (e.g. “Why”)." } },
                { name: "headingLine2", type: "text", admin: { width: "50%", description: "Second line — shown highlighted (e.g. “Geek”?)." } },
              ] },
              { name: "lead", type: "text", admin: { description: "The bold opening line under the heading." } },
              { name: "paragraphs", type: "array", label: "Intro paragraphs", labels: { singular: "Paragraph", plural: "Paragraphs" }, fields: [{ name: "text", type: "textarea" }] },
            ] },
          ],
        },
        {
          label: "Since 2008",
          fields: [
            { name: "evolution", type: "group", label: false, fields: [
              { name: "eyebrow", type: "text", admin: { description: "Small label above the era words (e.g. “Since 2008”)." } },
              { name: "eras", type: "array", label: "Era words", labels: { singular: "Era", plural: "Eras" }, admin: { description: "The evolution words; the last one is shown highlighted." }, fields: [{ name: "label", type: "text", required: true }] },
              { type: "row", fields: [
                { name: "headingMain", type: "text", admin: { width: "50%", description: "Heading, main part." } },
                { name: "headingMuted", type: "text", admin: { width: "50%", description: "Heading, muted second part." } },
              ] },
            ] },
          ],
        },
        {
          label: "We Win",
          fields: [
            { name: "win", type: "group", label: false, fields: [
              { name: "eyebrow", type: "text" },
              { type: "row", fields: [
                { name: "headingLine1", type: "text", admin: { width: "50%", description: "First line (e.g. “We win”)." } },
                { name: "headingLine2", type: "text", admin: { width: "50%", description: "Second line (e.g. “when you win.”)." } },
              ] },
              { name: "highlight", type: "text", admin: { description: "The word in the second line to highlight (e.g. “you”)." } },
              { name: "subcopy", type: "text" },
            ] },
          ],
        },
        {
          label: "The Geek Way",
          fields: [
            { name: "geekWay", type: "group", label: false, fields: [
              { name: "heading", type: "text" },
              { name: "principles", type: "array", labels: { singular: "Principle", plural: "Principles" }, admin: { description: "The numbered list; the last item is shown highlighted." }, fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "text" },
              ] },
            ] },
          ],
        },
        {
          label: "SEO",
          admin: { description: "Optional — falls back to the site defaults, then the approved static values." },
          fields: [
            seoField({ hideLabel: true, descriptions: { noindex: "Exclude this page from search indexing (rarely needed)." } }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePageHook({ tag: "about", path: "/about" })],
  },
};
