import type { Field, GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * INFLUENCE page (/influence) — Geek's influencer marketing A to Z, with the
 * Geek Influencer OS brand login. Opened from the "Influence." band on Home.
 * Every field is optional: empty → lib/site/influenceFallback.ts.
 */
const heads = (): Field => ({
  type: "row",
  fields: [
    { name: "eyebrow", type: "text", admin: { width: "50%" } },
    { name: "heading", type: "text", admin: { width: "50%" } },
  ],
});

const cards = (label: string, description?: string): Field => ({
  name: "items",
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  admin: description ? { description } : undefined,
  fields: [
    { type: "row", fields: [
      { name: "title", type: "text", required: true, admin: { width: "50%" } },
      { name: "tag", type: "text", admin: { width: "50%", description: "Small label (e.g. “Lay's · Barter”)." } },
    ] },
    { name: "body", type: "textarea", required: true },
    { name: "href", type: "text", admin: { description: "Optional link, e.g. /work/lays-heartwork" } },
  ],
});

const textList = (label: string): Field => ({
  name: "items",
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  fields: [{ name: "text", type: "text", required: true }],
});

export const InfluencePage: GlobalConfig = {
  slug: "influence-page",
  label: "Influence Page",
  admin: {
    group: "Pages",
    description: "The /influence page (opened from the “Influence.” section on Home). Save a draft and use Preview before publishing.",
    preview: () => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/influence` : "/influence";
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
              { name: "eyebrow", type: "text" },
              { name: "heading", type: "textarea", admin: { description: "Use line breaks for the wrapping." } },
              { name: "highlight", type: "text", admin: { description: "Part of the heading shown in cyan." } },
              { name: "intro", type: "textarea" },
              { type: "row", fields: [
                { name: "primaryLabel", type: "text", admin: { width: "50%" } },
                { name: "primaryHref", type: "text", admin: { width: "50%" } },
              ] },
              { type: "row", fields: [
                { name: "brandLoginLabel", type: "text", admin: { width: "50%" } },
                { name: "brandLoginHref", type: "text", admin: { width: "50%", description: "Geek Influencer OS brand login." } },
              ] },
            ] },
          ],
        },
        { label: "Creator tiers", fields: [{ name: "tiers", type: "group", label: false, fields: [{ name: "heading", type: "text" }, textList("Tier")] }] },
        { label: "Models", fields: [{ name: "models", type: "group", label: false, fields: [heads(), cards("Model")] }] },
        {
          label: "Process (A to Z)",
          fields: [
            { name: "steps", type: "group", label: false, fields: [
              heads(),
              { name: "closing", type: "text" },
              { name: "items", type: "array", labels: { singular: "Step", plural: "Steps" }, admin: { description: "Numbered automatically in this order." }, fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ] },
            ] },
          ],
        },
        {
          label: "Geek Influencer OS",
          fields: [
            { name: "platform", type: "group", label: false, fields: [
              { name: "eyebrow", type: "text" },
              { name: "heading", type: "textarea" },
              { name: "body", type: "textarea" },
              { name: "features", type: "array", labels: { singular: "Feature", plural: "Features" }, fields: [{ name: "text", type: "text", required: true }] },
              { type: "row", fields: [
                { name: "buttonLabel", type: "text", admin: { width: "50%" } },
                { name: "buttonHref", type: "text", admin: { width: "50%" } },
              ] },
              { type: "row", fields: [
                { name: "creatorLabel", type: "text", admin: { width: "50%" } },
                { name: "creatorHref", type: "text", admin: { width: "50%" } },
              ] },
            ] },
          ],
        },
        { label: "Hampers", fields: [{ name: "hampers", type: "group", label: false, fields: [heads(), { name: "intro", type: "textarea" }, cards("Hamper")] }] },
        { label: "Case studies", fields: [{ name: "stories", type: "group", label: false, fields: [heads(), cards("Story", "Story boxes. Add a link when the campaign has a case study on the site.")] }] },
        { label: "Brands list", fields: [{ name: "clients", type: "group", label: false, fields: [{ name: "heading", type: "text" }, textList("Brand")] }] },
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
        { label: "SEO", admin: { description: "Optional — falls back to the approved values." }, fields: [seoField({ hideLabel: true })] },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePageHook({ tag: "influence-page", path: "/influence" })],
  },
};
