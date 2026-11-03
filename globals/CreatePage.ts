import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * CREATE page (/create) — how Geek runs campaigns. Opened from the "Create."
 * band on the Home page. Every field is optional: anything left empty falls
 * back to the approved copy in lib/site/createFallback.ts.
 */
export const CreatePage: GlobalConfig = {
  slug: "create-page",
  label: "Create Page",
  admin: {
    group: "Pages",
    description: "The /create page (opened from the “Create.” section on Home). Save a draft and use Preview before publishing.",
    preview: () => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/create` : "/create";
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
              { name: "eyebrow", type: "text", admin: { description: "Small label above the heading (e.g. “Build.”)." } },
              { name: "heading", type: "textarea", admin: { description: "Big heading. Use line breaks for the wrapping." } },
              { name: "highlight", type: "text", admin: { description: "Part of the heading shown in cyan (e.g. “people choose.”)." } },
              { name: "intro", type: "textarea" },
            ] },
          ],
        },
        {
          label: "Campaign types",
          fields: [
            { name: "phases", type: "group", label: false, fields: [
              { type: "row", fields: [
                { name: "eyebrow", type: "text", admin: { width: "50%" } },
                { name: "heading", type: "text", admin: { width: "50%" } },
              ] },
              { name: "items", type: "array", labels: { singular: "Phase", plural: "Phases" }, fields: [
                { type: "row", fields: [
                  { name: "label", type: "text", admin: { width: "25%", description: "e.g. 01" } },
                  { name: "title", type: "text", required: true, admin: { width: "40%", description: "e.g. Creator challenges." } },
                  { name: "subtitle", type: "text", admin: { width: "35%", description: "e.g. Filters · dances · trends" } },
                ] },
                { name: "body", type: "textarea" },
              ] },
            ] },
          ],
        },
        {
          label: "Playbook (steps)",
          fields: [
            { name: "steps", type: "group", label: false, fields: [
              { type: "row", fields: [
                { name: "eyebrow", type: "text", admin: { width: "50%" } },
                { name: "heading", type: "text", admin: { width: "50%" } },
              ] },
              { name: "closing", type: "text", admin: { description: "Line under the steps." } },
              { name: "items", type: "array", label: "Steps", labels: { singular: "Step", plural: "Steps" }, admin: { description: "Numbered automatically (01, 02 …) in this order." }, fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
                { type: "row", fields: [
                  { name: "linkLabel", type: "text", admin: { width: "50%", description: "Optional — e.g. the case study name." } },
                  { name: "linkHref", type: "text", admin: { width: "50%", description: "e.g. /work/the-coolest-job" } },
                ] },
              ] },
            ] },
          ],
        },
        {
          label: "Creator tiers",
          fields: [
            { name: "capabilities", type: "group", label: false, fields: [
              { name: "heading", type: "text" },
              { name: "items", type: "array", labels: { singular: "Item", plural: "Items" }, fields: [{ name: "text", type: "text", required: true }] },
            ] },
          ],
        },
        {
          label: "Campaigns shown",
          fields: [
            { name: "showcase", type: "group", label: false, admin: { description: "Campaign case studies shown as cards. Empty → the default list." }, fields: [
              { type: "row", fields: [
                { name: "eyebrow", type: "text", admin: { width: "50%" } },
                { name: "heading", type: "text", admin: { width: "50%" } },
              ] },
              { name: "stories", type: "relationship", relationTo: "projects", hasMany: true, admin: { description: "Case studies to show." } },
            ] },
          ],
        },
        {
          label: "Tools & tracking",
          fields: [
            { name: "portfolio", type: "group", label: false, admin: { description: "What Geek tracks and reports on a campaign." }, fields: [
              { name: "heading", type: "text" },
              { name: "note", type: "text", admin: { description: "Small note under the list." } },
              { name: "items", type: "array", labels: { singular: "Item", plural: "Items" }, fields: [{ name: "name", type: "text", required: true }] },
            ] },
          ],
        },
        {
          label: "Numbers",
          fields: [
            { name: "proof", type: "group", label: false, admin: { description: "Only real numbers from a case study — link each one to its story." }, fields: [
              { type: "row", fields: [
                { name: "eyebrow", type: "text", admin: { width: "50%" } },
                { name: "heading", type: "text", admin: { width: "50%" } },
              ] },
              { name: "items", type: "array", labels: { singular: "Number", plural: "Numbers" }, fields: [
                { type: "row", fields: [
                  { name: "value", type: "text", required: true, admin: { width: "30%", description: "e.g. 421 ft" } },
                  { name: "label", type: "text", required: true, admin: { width: "70%" } },
                ] },
                { name: "href", type: "text", admin: { description: "Case study link, e.g. /work/high-ultra-lounge" } },
              ] },
            ] },
          ],
        },
        {
          label: "Call to action",
          fields: [
            { name: "cta", type: "group", label: false, fields: [
              { type: "row", fields: [
                { name: "heading", type: "textarea", admin: { width: "50%" } },
                { name: "highlight", type: "text", admin: { width: "50%" } },
              ] },
              { type: "row", fields: [
                { name: "label", type: "text", admin: { width: "50%" } },
                { name: "href", type: "text", admin: { width: "50%" } },
              ] },
              { type: "row", fields: [
                { name: "secondaryLabel", type: "text", admin: { width: "50%" } },
                { name: "secondaryHref", type: "text", admin: { width: "50%" } },
              ] },
            ] },
          ],
        },
        {
          label: "SEO",
          admin: { description: "Optional — falls back to the approved values." },
          fields: [seoField({ hideLabel: true })],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePageHook({ tag: "create-page", path: "/create" })],
  },
};
