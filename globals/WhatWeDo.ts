import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * WHAT WE DO page content. Structured fields mapping 1:1 to the approved page
 * (hero, capability bands, CTA) — NOT a page builder, and NOT related to the
 * `services` taxonomy (the capability words are curated marketing language whose
 * wording differs from the project-filter labels; relating them would corrupt
 * taxonomy). React keeps the design (cyan highlights, Band layout, Process rail).
 *
 * Drafts enabled → editors can preview before publishing (see /api/preview).
 */
export const WhatWeDo: GlobalConfig = {
  slug: "what-we-do",
  label: "What We Do Page",
  admin: {
    group: "Pages",
    description: "The /what-we-do page. Save a draft and use Preview before publishing.",
    preview: () => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/what-we-do` : "/what-we-do";
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
              { name: "block1", type: "textarea", admin: { description: "First heading block. Use line breaks for the intended wrapping." } },
              { name: "block2", type: "textarea", admin: { description: "Second heading block (muted)." } },
              { name: "highlight", type: "text", admin: { description: "Word in the second block shown highlighted (e.g. “problem.”)." } },
              { name: "intro", type: "textarea" },
            ] },
          ],
        },
        {
          label: "Capabilities",
          fields: [
            { name: "capabilities", type: "array", labels: { singular: "Capability", plural: "Capabilities" }, admin: { description: "The Build / Create / Connect / Influence / Amplify bands." }, fields: [
              { name: "label", type: "text", required: true, admin: { description: "e.g. “Build.”" } },
              { name: "items", type: "array", labels: { singular: "Item", plural: "Items" }, admin: { description: "The capability words listed under the label." }, fields: [{ name: "text", type: "text", required: true }] },
              { name: "thought", type: "textarea", admin: { description: "The big statement. Use a line break for the two lines." } },
              { name: "thoughtHighlight", type: "text", admin: { description: "Optional part of the statement to highlight cyan." } },
              { type: "row", fields: [
                { name: "linkLabel", type: "text", admin: { width: "50%", description: "Optional link under the statement." } },
                { name: "linkHref", type: "text", admin: { width: "50%" } },
              ] },
            ] },
          ],
        },
        {
          label: "CTA",
          fields: [
            { name: "cta", type: "group", label: false, admin: { description: "Page-specific button (separate from the global footer CTA)." }, fields: [
              { name: "label", type: "text" },
              { name: "href", type: "text" },
            ] },
          ],
        },
        {
          label: "SEO",
          fields: [seoField({ hideLabel: true })],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePageHook({ tag: "what-we-do", path: "/what-we-do" })],
  },
};
