import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * CONTACT page content. Structured fields matching the approved /contact page:
 * the hero heading, the form eyebrow, and the "Four Doors" section headings +
 * the four door labels.
 *
 * This is an editorial-copy Global ONLY. The contact forms, their fields and
 * validation, the /api/lead handler + Resend integration, and the door
 * colours/icons/order all stay code-controlled (see components/FourDoors.tsx and
 * components/forms/*). The door `key` values are fixed and map to those forms;
 * the CMS may only relabel each door — it can never add, remove, reorder, or
 * rewire a door, so it cannot break the contact flow.
 *
 * Drafts enabled → editors preview before publishing (see /api/preview).
 */
export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
  admin: {
    group: "Pages",
    description: "The /contact page. Save a draft and use Preview before publishing. The forms themselves are fixed.",
    preview: () => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/contact` : "/contact";
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
              { name: "headingBlock", type: "textarea", admin: { description: "The big heading. Use a line break for the two lines (e.g. “What should” / “we make matter next?”)." } },
              { name: "headingHighlight", type: "text", admin: { description: "Word in the heading shown highlighted cyan (e.g. “matter”)." } },
              { name: "formEyebrow", type: "text", admin: { description: "Small label above the form (e.g. “Tell us the problem”)." } },
            ] },
          ],
        },
        {
          label: "Four Doors",
          fields: [
            { name: "doors", type: "group", label: false, admin: { description: "The “What brings you to Geek?” section. You can relabel the four doors, but their forms and styling are fixed." }, fields: [
              { type: "row", fields: [
                { name: "eyebrow", type: "text", admin: { width: "50%", description: "e.g. “Four doors.”" } },
                { name: "heading", type: "text", admin: { width: "50%", description: "e.g. “What brings you to Geek?”" } },
              ] },
              { name: "items", type: "array", label: "Door labels", labels: { singular: "Door", plural: "Doors" },
                admin: { description: "One row per door. The Type selects which fixed door/form this labels; Title and Sub are the editable text." },
                fields: [
                  { name: "key", type: "select", required: true, options: [
                    { label: "For Clients — Build my brand", value: "client" },
                    { label: "For Creators — Work with brands", value: "creator" },
                    { label: "For Jobs — Work at Geek", value: "career" },
                    { label: "For Vendors / Partners — Work with Geek", value: "vendor" },
                  ], admin: { description: "Which fixed door this labels." } },
                  { type: "row", fields: [
                    { name: "title", type: "text", required: true, admin: { width: "50%", description: "e.g. “Build my brand.”" } },
                    { name: "sub", type: "text", required: true, admin: { width: "50%", description: "e.g. “For Clients.”" } },
                  ] },
                ],
              },
            ] },
          ],
        },
        {
          label: "SEO",
          admin: { description: "Optional — falls back to the site defaults, then the approved static values." },
          fields: [seoField({ hideLabel: true })],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePageHook({ tag: "contact-page", path: "/contact" })],
  },
};
