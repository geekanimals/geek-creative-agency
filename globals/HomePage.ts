import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * HOMEPAGE content — a THIN orchestration Global. It holds only the editorial
 * copy for the approved homepage sections; React keeps ALL art direction, motion
 * and media, and the curated work datasets (lib/data/*) stay in code. This is
 * NOT a page builder: the section set and order are fixed by the design, so
 * fields map 1:1 to the real sections and cannot add/remove/reorder them.
 *
 * "The Media Changed", the creator mosaic, Proof metrics, the Work/Build/Create
 * card datasets and Four Doors are intentionally absent — they are art-directed
 * and/or media-coupled and remain code-controlled.
 *
 * Drafts enabled → editors preview before publishing (see /api/preview).
 */
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  admin: {
    group: "Pages",
    description: "The homepage ( / ). Editorial copy only — layout, motion and imagery are fixed. Save a draft and use Preview before publishing.",
    preview: () => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/` : "/";
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
              { name: "headingBlock", type: "textarea", admin: { description: "The big headline. Use line breaks for the three lines." } },
              { name: "headingHighlight", type: "text", admin: { description: "Word/phrase shown highlighted cyan (e.g. “matter.”)." } },
              { name: "subline", type: "text" },
              { type: "row", fields: [
                { name: "ctaPrimaryLabel", type: "text", admin: { width: "25%" } },
                { name: "ctaPrimaryHref", type: "text", admin: { width: "25%" } },
                { name: "ctaSecondaryLabel", type: "text", admin: { width: "25%" } },
                { name: "ctaSecondaryHref", type: "text", admin: { width: "25%" } },
              ] },
            ] },
          ],
        },
        {
          label: "Logos",
          fields: [
            { name: "logoWall", type: "group", label: false, admin: { description: "The client logo marquee heading (the logos themselves are fixed)." }, fields: [
              { name: "heading", type: "text" },
              { name: "headingHighlight", type: "text", admin: { description: "Word highlighted cyan (e.g. “friends”)." } },
            ] },
          ],
        },
        {
          label: "Build / Create / Influence",
          fields: [
            { name: "build", type: "group", admin: { description: "“Build.” band (the work cards are fixed)." }, fields: [
              { name: "title", type: "text" },
              { name: "sub", type: "text" },
              { name: "trailing", type: "text" },
            ] },
            { name: "create", type: "group", admin: { description: "“Create.” band. Use a line break in the sub for the two lines." }, fields: [
              { name: "title", type: "text" },
              { name: "sub", type: "textarea" },
            ] },
            { name: "influence", type: "group", admin: { description: "“Influence.” band (the creator mosaic is fixed)." }, fields: [
              { name: "eyebrow", type: "text" },
              { name: "heading", type: "text" },
              { name: "sub", type: "text" },
              { name: "list", type: "text", admin: { description: "e.g. “Celebrity. Macro. Micro. Nano. UGC. Regional.”" } },
              { type: "row", fields: [
                { name: "linkLabel", type: "text", admin: { width: "50%" } },
                { name: "linkHref", type: "text", admin: { width: "50%" } },
              ] },
            ] },
          ],
        },
        {
          label: "Proof / Process",
          fields: [
            { name: "proof", type: "group", admin: { description: "“Proof.” band (the metrics are fixed)." }, fields: [
              { name: "eyebrow", type: "text" },
              { name: "sub", type: "text" },
            ] },
            { name: "process", type: "group", admin: { description: "The process rail (the steps + icons are fixed)." }, fields: [
              { name: "heading", type: "text" },
              { name: "headingHighlight", type: "text", admin: { description: "Part of the heading highlighted cyan (e.g. “to the last mile.”)." } },
              { name: "trailing", type: "text", admin: { description: "e.g. “We make it happen.”" } },
            ] },
          ],
        },
        {
          label: "Built by Geek",
          fields: [
            { name: "builtByGeek", type: "group", label: false, admin: { description: "The dark “Built by Geek” section (the two stories are fixed)." }, fields: [
              { name: "eyebrow", type: "text" },
              { name: "headingBlock", type: "textarea", admin: { description: "Main heading. Use a line break for the two lines." } },
              { name: "headingCyan", type: "text", admin: { description: "The cyan line under the heading (e.g. “We write our own.”)." } },
              { name: "closing", type: "text", admin: { description: "The closing statement." } },
              { name: "closingHighlight", type: "text", admin: { description: "Word highlighted cyan (e.g. “exist.”)." } },
            ] },
          ],
        },
        {
          label: "The Geek Way",
          fields: [
            { name: "geekWay", type: "group", label: false, fields: [
              { name: "title", type: "text" },
              { name: "principles", type: "array", labels: { singular: "Principle", plural: "Principles" }, fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "text" },
              ] },
              { name: "finaleBlock", type: "textarea", admin: { description: "The big finale. Use a line break for the two lines (e.g. “We win” / “when you win.”)." } },
              { name: "finaleHighlight", type: "text", admin: { description: "Word highlighted cyan (e.g. “you”)." } },
              { name: "finaleSub", type: "text" },
            ] },
          ],
        },
        {
          label: "The Work",
          fields: [
            { name: "work", type: "group", label: false, admin: { description: "“The Work.” band heading (the work wall items are fixed)." }, fields: [
              { name: "title", type: "text" },
              { name: "sub", type: "text" },
            ] },
          ],
        },
        {
          label: "SEO",
          admin: { description: "Optional — falls back to the site defaults (Site Settings), then the approved static values." },
          fields: [seoField({ hideLabel: true })],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePageHook({ tag: "home-page", path: "/" })],
  },
};
