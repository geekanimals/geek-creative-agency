import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";
import { sectionBlocks } from "../fields/sections";
import { seoField } from "../fields/seoFields";
import { goldStandardTabs } from "../fields/goldStandard";
import { FLAGSHIP_RENDERER_KEYS } from "../lib/work/renderers";
import { businessCategories, campaignTypes } from "../lib/work/taxonomy";
import { revalidateProjectAndHubs } from "./revalidateProject";

const toOptions = (items: { slug: string; label: string }[]) => items.map((t) => ({ label: t.label, value: t.slug }));

/**
 * PROJECTS / CASE STUDIES — the first editorial CMS collection.
 *
 * Hybrid: Payload owns the structured data; React owns the art direction.
 * `renderMode` selects how a project renders:
 *   standard  → shared editorial template (challenge/insight/idea/execution…)
 *   flexible  → CMS-managed `sections` blocks
 *   flagship  → a developer-allowlisted bespoke React renderer (flagshipRendererKey)
 *
 * Drafts + versions are enabled; public queries return published only. Existing
 * static /public/assets keep working (media fields accept a legacy path).
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "client", "renderMode", "featured", "_status"],
    description: "Case studies. Drafts stay private; publish to go live. Existing /public/assets paths keep working.",
    // "Preview" button → secure draft-preview route (secret injected server-side).
    preview: (doc) => {
      const slug = (doc as { slug?: string })?.slug;
      if (!slug) return null;
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&slug=${encodeURIComponent(slug)}` : null;
    },
  },
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  access: {
    // Public read is restricted to PUBLISHED docs; drafts require auth. This is
    // the anonymous-facing gate that keeps unpublished work from leaking.
    read: ({ req: { user } }) => (user ? true : { _status: { equals: "published" } }),
    create: isEditorUp,
    update: isEditorUp,
    delete: isAdminOrOwner,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ── OVERVIEW ──────────────────────────────────────────────────────
        {
          label: "Overview",
          fields: [
            { name: "title", type: "text", required: true, admin: { description: "Project name shown as the case-study title." } },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              index: true,
              admin: { description: "URL segment: /work/<slug>. Lowercase, hyphenated." },
            },
            { type: "row", fields: [
              { name: "client", type: "text", admin: { width: "50%", description: "Brand / client name." } },
              { name: "year", type: "number", admin: { width: "25%" } },
              { name: "location", type: "text", admin: { width: "25%" } },
            ] },
            { name: "shortSummary", type: "textarea", admin: { description: "One-line summary used at the top of the case study." } },
            { name: "cardSummary", type: "text", admin: { description: "Shorter line for the /work card (falls back to shortSummary)." } },
            { type: "row", fields: [
              {
                name: "renderMode",
                type: "select",
                required: true,
                defaultValue: "standard",
                admin: { width: "50%", description: "How this project renders. Flagship = bespoke developer renderer." },
                options: [
                  { label: "Standard (shared editorial template)", value: "standard" },
                  { label: "Flexible (CMS content sections)", value: "flexible" },
                  { label: "Flagship (bespoke React renderer)", value: "flagship" },
                ],
              },
              {
                name: "flagshipRendererKey",
                type: "select",
                admin: {
                  width: "50%",
                  description: "Which developer-built renderer to use (flagship only).",
                  condition: (data) => data?.renderMode === "flagship",
                },
                options: FLAGSHIP_RENDERER_KEYS.map((k) => ({ label: k, value: k })),
              },
            ] },
            { type: "row", fields: [
              { name: "heroMedia", type: "upload", relationTo: "media", admin: { width: "50%", description: "Hero/card image (CMS). Or use heroLegacySrc." } },
              { name: "heroLegacySrc", type: "text", admin: { width: "50%", description: "OR existing /public/assets hero path." } },
            ] },
            { name: "heroVideo", type: "text", admin: { description: "Optional hero video path/URL." } },
            { name: "projectKind", type: "select", defaultValue: "campaign", options: [
              { label: "Campaign", value: "campaign" },
              { label: "Ongoing program", value: "ongoing-program" },
              { label: "Platform", value: "platform" },
              { label: "Activation", value: "activation" },
            ], admin: { description: "What the work IS (separate from Render Mode, which is how it's PRESENTED). Programs vs campaigns group differently on the Brand hub." } },
            { type: "row", fields: [
              { name: "featured", type: "checkbox", admin: { width: "33%", description: "Show in Featured Stories." } },
              { name: "order", type: "number", defaultValue: 100, admin: { width: "33%", description: "Lower sorts first in the grid." } },
            ] },
          ],
        },
        // ── TAXONOMY ──────────────────────────────────────────────────────
        {
          label: "Taxonomy",
          fields: [
            { name: "services", type: "relationship", relationTo: "services", hasMany: true, admin: { description: "What Geek did (reusable Services taxonomy). Also powers the /work Service filter." } },
            { name: "campaignTypes", type: "select", hasMany: true, options: toOptions(campaignTypes) },
            // ── Portfolio relationship graph (Phase 11.25) ──────────────────
            { name: "businessCategories", type: "relationship", relationTo: "business-categories", hasMany: true, admin: { description: "Industries (relationship). Preferred source of truth; the legacy select below is kept for back-compat." } },
            { type: "row", fields: [
              { name: "company", type: "relationship", relationTo: "companies", admin: { width: "50%", description: "Client company. Optional — corporate-level projects may set only this." } },
              { name: "brand", type: "relationship", relationTo: "brands", admin: { width: "50%", description: "Brand. Optional. If set, its company must match Company (auto-filled when Company is empty)." } },
            ] },
            { name: "solutions", type: "relationship", relationTo: "solutions", hasMany: true, admin: { description: "Geek Solution(s) / IP this project implements (optional, e.g. IRM)." } },
            { name: "businessCategory", type: "select", hasMany: true, options: toOptions(businessCategories), admin: { description: "LEGACY industry select — kept for back-compat; prefer the Industries relationship above. Not removed." } },
          ],
        },
        // ── STORY (standard mode) ─────────────────────────────────────────
        {
          label: "Story",
          admin: { description: "Structured story for Standard mode. Optional — Flexible/Flagship projects can leave these empty." },
          fields: [
            { name: "headline", type: "text", admin: { description: "Big case-study headline (falls back to title)." } },
            { name: "challenge", type: "group", fields: [
              { name: "question", type: "text" },
              { name: "copy", type: "textarea" },
            ] },
            { name: "insight", type: "textarea" },
            { name: "idea", type: "group", fields: [
              { name: "statement", type: "text" },
              { name: "copy", type: "textarea" },
            ] },
            { name: "execution", type: "textarea", admin: { description: "Execution narrative (plain). Rich modular layouts belong in the Sections tab." } },
            { name: "outcome", type: "textarea", admin: { description: "Why it mattered / result (no invented metrics)." } },
            { name: "quote", type: "group", fields: [
              { name: "text", type: "textarea" },
              { name: "attribution", type: "text" },
            ] },
          ],
        },
        // ── METRICS ───────────────────────────────────────────────────────
        {
          label: "Metrics",
          admin: { description: "Verified figures only. Never invent metrics." },
          fields: [
            { name: "metrics", type: "array", labels: { singular: "Metric", plural: "Metrics" }, fields: [
              { type: "row", fields: [
                { name: "value", type: "text", required: true, admin: { width: "40%", description: "e.g. 27.5M+" } },
                { name: "label", type: "text", required: true, admin: { width: "60%" } },
              ] },
              { type: "row", fields: [
                { name: "prefix", type: "text", admin: { width: "33%" } },
                { name: "suffix", type: "text", admin: { width: "33%" } },
                { name: "note", type: "text", admin: { width: "34%" } },
              ] },
            ] },
          ],
        },
        // ── SECTIONS (flexible mode) ──────────────────────────────────────
        {
          label: "Sections",
          admin: { description: "Modular content blocks for Flexible mode.", condition: (data) => data?.renderMode === "flexible" },
          fields: [
            { name: "sections", type: "blocks", blocks: sectionBlocks, admin: { description: "Content sections. React decides the exact styling." } },
          ],
        },
        // ── SEO ───────────────────────────────────────────────────────────
        {
          label: "SEO",
          admin: { description: "Optional — sensible defaults derive from the project." },
          fields: [
            seoField({
              descriptions: {
                metaTitle: "Falls back to “<title> — <client> | Geek”.",
                metaDescription: "Falls back to the short summary.",
                noindex: "Exclude from indexing (rarely needed).",
              },
            }),
          ],
        },
        // ── GOLD STANDARD (Phase 11.26) ───────────────────────────────────
        // Evidence & Recognition (press + awards) + FAQ are PUBLIC and render on
        // standard/flexible pages. Search Strategy is INTERNAL (hidden from the
        // public API, never rendered). Flagship renderers ignore these unless
        // explicitly wired — High Ultra / Coolest Job stay untouched.
        ...goldStandardTabs({ press: true, awards: true, faqs: true, searchStrategy: true }),
      ],
    },
  ],
  hooks: {
    // Validate the flagship contract server-side: flagship requires a valid
    // allowlisted key; non-flagship must not carry one.
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (data.renderMode === "flagship") {
          if (!data.flagshipRendererKey || !(FLAGSHIP_RENDERER_KEYS as readonly string[]).includes(data.flagshipRendererKey)) {
            throw new Error("Flagship projects require a valid flagshipRendererKey from the developer allowlist.");
          }
        } else if (data.flagshipRendererKey) {
          data.flagshipRendererKey = null; // clear stray key on non-flagship modes
        }
        return data;
      },
      // Company/Brand consistency: a Brand belongs to one Company. If a Brand is
      // set, derive Company from it when Company is empty, or reject a mismatch.
      // Corporate-level projects (Company only, no Brand) are allowed.
      async ({ data, req }) => {
        if (!data?.brand) return data;
        const brandId = typeof data.brand === "object" ? (data.brand as { id?: number | string }).id : data.brand;
        if (brandId == null) return data;
        const brand = await req.payload.findByID({ collection: "brands", id: brandId as number, depth: 0, draft: true }).catch(() => null);
        const brandCompany = brand && (typeof brand.company === "object" ? (brand.company as { id?: number | string } | null)?.id : brand.company);
        if (brandCompany == null) return data; // brand has no company yet — nothing to enforce
        const projectCompany = typeof data.company === "object" ? (data.company as { id?: number | string } | null)?.id : data.company;
        if (projectCompany == null) {
          data.company = brandCompany; // derive
        } else if (String(projectCompany) !== String(brandCompany)) {
          throw new Error("Project Company does not match the selected Brand's Company. Leave Company empty to derive it from the Brand, or pick the matching Company.");
        }
        return data;
      },
    ],
    // On-demand revalidation: publishing/updating/deleting a project refreshes
    // /work, the project route (old + new slug), and every affected portfolio
    // hub (old + new Industries/Company/Brand/Services/Solutions). Safe no-op
    // outside a request context (e.g. the migrate/seed CLI).
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        await revalidateProjectAndHubs(req.payload, doc as Record<string, unknown>, previousDoc as Record<string, unknown>);
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await revalidateProjectAndHubs(req.payload, doc as Record<string, unknown>, doc as Record<string, unknown>);
      },
    ],
  },
};
