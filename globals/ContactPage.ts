import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * CONTACT page content. Tabs follow the /contact page top to bottom: hero +
 * form eyebrow, the offices with Google Maps, then the "Four Doors" headings
 * and door labels.
 *
 * This is an editorial-copy Global ONLY. The contact forms, their fields and
 * validation, the /api/lead handler + Resend integration, and the door
 * colours/icons/order all stay code-controlled (see components/doors/doors.jsx and
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
              { name: "formEyebrow", type: "text", admin: { hidden: true, description: "No longer shown — the Contact page has no form now (the Four Doors open each form)." } },
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
          label: "Offices & Map",
          fields: [
            { name: "offices", type: "group", label: false, admin: { description: "The office cards with a Google Map on the Contact page. Tapping a card opens the location in Google Maps. Leave the list empty to show the default offices." }, fields: [
              { type: "row", fields: [
                { name: "eyebrow", type: "text", admin: { width: "50%", description: "e.g. “The G spot.”" } },
                { name: "heading", type: "text", admin: { width: "50%", description: "e.g. “Come say hi.”" } },
              ] },
              { name: "items", type: "array", label: "Offices", labels: { singular: "Office", plural: "Offices" }, fields: [
                { type: "row", fields: [
                  { name: "city", type: "text", required: true, admin: { width: "30%", description: "e.g. “Bangalore”" } },
                  { name: "address", type: "textarea", required: true, admin: { width: "70%", description: "Full address, shown on the card." } },
                ] },
                { name: "mapQuery", type: "text", label: "Google Maps search (optional)", admin: { description: "What the map should search for, if the address alone lands in the wrong spot — e.g. “Geek Creative Agency, HMT Layout, Bengaluru” or a Google Maps place name. Empty → the address is used." } },
              ] },
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
