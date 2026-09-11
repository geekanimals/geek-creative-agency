import type { Block, Field } from "payload";

/**
 * Reusable media picker for blocks: either a CMS-managed upload (Vercel Blob)
 * OR a legacy /public/assets path (so existing assets keep working without
 * migration). The renderer's resolveMedia() understands both.
 */
const mediaFields: Field[] = [
  { name: "media", type: "upload", relationTo: "media", admin: { description: "CMS media (Vercel Blob). Leave empty to use a legacy path instead." } },
  { name: "legacySrc", type: "text", admin: { description: "OR an existing /public/assets/… path (for legacy assets not yet in the CMS)." } },
  { name: "alt", type: "text", admin: { description: "Accessibility description (falls back to the media record's alt)." } },
  { name: "caption", type: "text" },
  { name: "credit", type: "text" },
];

/**
 * FLEXIBLE SECTIONS — a small set of content-semantic blocks (NOT pixel
 * layouts). React owns the exact styling. Kept intentionally restrained.
 */
export const sectionBlocks: Block[] = [
  {
    slug: "sectionIntro",
    labels: { singular: "Section Intro", plural: "Section Intros" },
    fields: [
      { name: "eyebrow", type: "text" },
      { name: "heading", type: "text", required: true },
      { name: "body", type: "textarea" },
    ],
  },
  {
    slug: "richText",
    labels: { singular: "Rich Text", plural: "Rich Text" },
    fields: [{ name: "content", type: "richText", required: true }],
  },
  {
    slug: "mediaBlock",
    labels: { singular: "Media", plural: "Media" },
    fields: [...mediaFields],
  },
  {
    slug: "fullBleedMedia",
    labels: { singular: "Full-Bleed Media", plural: "Full-Bleed Media" },
    fields: [...mediaFields, { name: "overlayHeading", type: "text", admin: { description: "Optional headline laid over the visual." } }],
  },
  {
    slug: "splitContent",
    labels: { singular: "Split Content", plural: "Split Content" },
    fields: [
      { name: "mediaSide", type: "select", defaultValue: "left", options: [
        { label: "Media left", value: "left" },
        { label: "Media right", value: "right" },
      ] },
      { name: "content", type: "richText", required: true },
      ...mediaFields,
    ],
  },
  {
    slug: "mediaGallery",
    labels: { singular: "Media Gallery", plural: "Media Galleries" },
    fields: [
      { name: "heading", type: "text" },
      { name: "items", type: "array", minRows: 1, fields: [...mediaFields] },
    ],
  },
  {
    slug: "metrics",
    labels: { singular: "Metrics", plural: "Metrics" },
    fields: [
      { name: "heading", type: "text" },
      {
        name: "items",
        type: "array",
        minRows: 1,
        labels: { singular: "Metric", plural: "Metrics" },
        fields: [
          { name: "value", type: "text", required: true, admin: { description: "e.g. 2,229 · 103M+ · 27.5M+" } },
          { name: "label", type: "text", required: true },
          { name: "prefix", type: "text" },
          { name: "suffix", type: "text" },
          { name: "note", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "quote",
    labels: { singular: "Quote", plural: "Quotes" },
    fields: [
      { name: "quote", type: "textarea", required: true },
      { name: "attribution", type: "text" },
    ],
  },
  {
    slug: "cta",
    labels: { singular: "Closing / CTA", plural: "Closing / CTAs" },
    fields: [
      { name: "heading", type: "text", required: true },
      { name: "body", type: "textarea" },
      { name: "buttonLabel", type: "text" },
      { name: "buttonHref", type: "text" },
    ],
  },
];
