import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * CREATORS page content. Structured fields matching the approved recruitment
 * page (hero, "one degree", why-geek, join intro, SEO) — a singleton editorial
 * page, NOT a creator directory (there are no creator records on the page; the
 * mosaic is decorative and the registration form stays code-controlled).
 *
 * Drafts enabled → editors preview before publishing (see /api/preview).
 */
export const CreatorsPage: GlobalConfig = {
  slug: "creators-page",
  label: "Creators Page",
  admin: {
    group: "Pages",
    description: "The /creators page. Save a draft and use Preview before publishing.",
    preview: () => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/creators` : "/creators";
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
              { name: "headingBlock", type: "textarea", admin: { description: "Main heading. Use a line break for the two lines." } },
              { name: "headingHighlight", type: "text", admin: { description: "Part of the heading shown highlighted (e.g. “With great brands.”)." } },
              { name: "subline", type: "text" },
              { type: "row", fields: [
                { name: "ctaLabel", type: "text", admin: { width: "50%" } },
                { name: "ctaHref", type: "text", admin: { width: "50%", description: "e.g. #join (scrolls to the form) or another route." } },
              ] },
            ] },
          ],
        },
        {
          label: "One Degree",
          fields: [
            { name: "oneDegree", type: "group", label: false, fields: [
              { name: "heading", type: "textarea", admin: { description: "Use a line break for the two lines." } },
              { name: "body", type: "text" },
              { name: "opportunities", type: "array", labels: { singular: "Opportunity", plural: "Opportunities" }, fields: [{ name: "text", type: "text", required: true }] },
            ] },
          ],
        },
        {
          label: "Why Geek",
          fields: [
            { name: "whyGeek", type: "group", label: false, fields: [
              { name: "eyebrow", type: "text" },
              { name: "heading", type: "textarea", admin: { description: "Use line breaks for each line." } },
              { name: "headingHighlight", type: "text", admin: { description: "Line to highlight (e.g. “Real opportunities.”)." } },
            ] },
          ],
        },
        {
          label: "Join",
          fields: [
            { name: "join", type: "group", label: false, admin: { description: "Copy above the registration form (the form itself is fixed)." }, fields: [
              { name: "eyebrow", type: "text" },
              { name: "heading", type: "text" },
              { name: "subcopy", type: "text" },
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
    afterChange: [revalidatePageHook({ tag: "creators-page", path: "/creators" })],
  },
};
