import type { Field } from "payload";
import { fieldIsAnyStaff } from "../access/roles";

/**
 * GEEK GOLD STANDARD — reusable editorial field builders (Phase 11.26).
 *
 * These build the PUBLICATION-SAFE structured fields the Gold Standard case-study
 * format needs, plus one INTERNAL editorial group. They are shared across the
 * portfolio collections so the shapes stay identical (and agent-writable):
 *
 *   searchStrategyField()  → `searchStrategy` group  — INTERNAL SEO/AEO research.
 *                            Hidden from the public API via field-level access;
 *                            never rendered publicly. Does NOT output meta-keywords.
 *   pressCoverageField()   → `pressCoverage` array   — public external validation.
 *   awardsField()          → `awards` array          — public recognition.
 *   faqsField()            → `faqs` array            — public AEO / reader FAQ.
 *
 * `goldStandardTabs()` composes the admin tabs for a collection from these, so a
 * collection only declares which layers it wants. Field NAMES are stable so the
 * future Case Study Agent can write them deterministically through Local/REST API.
 */

/** Admin help shown on the internal Search Strategy group. */
const SEARCH_STRATEGY_HELP =
  "Editorial guidance for SEO/AEO research. These fields do NOT directly output a " +
  "meta-keywords tag and are not publicly rendered unless explicitly mapped elsewhere.";

/** One tab object as accepted inside a `type: "tabs"` field. */
type Tab = Extract<Field, { type: "tabs" }>["tabs"][number];

/** Optional http(s) URL validator — allows empty; rejects non-http(s) or malformed. */
const optionalUrl = (value?: string | null): true | string => {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:" ? true : "Enter an http(s) URL.";
  } catch {
    return "Enter a valid URL (including https://).";
  }
};
/** Required http(s) URL validator. */
const requiredUrl = (value?: string | null): true | string =>
  value ? optionalUrl(value) : "A URL is required.";

/* ── SEARCH STRATEGY — INTERNAL (never public) ──────────────────────────── */

export function searchStrategyField(): Field {
  return {
    name: "searchStrategy",
    type: "group",
    label: "Search Strategy — Internal",
    // Field-level access: readable only by authenticated staff. Anonymous
    // public REST/GraphQL responses strip this group even on published docs.
    access: { read: fieldIsAnyStaff },
    admin: { description: SEARCH_STRATEGY_HELP },
    fields: [
      { name: "primaryKeyword", type: "text", admin: { description: "Single primary target phrase, e.g. “MyLaysRelationchip campaign”." } },
      { name: "secondaryKeywords", type: "text", hasMany: true, admin: { description: "Supporting keyword phrases (press Enter between them)." } },
      { type: "row", fields: [
        { name: "searchIntent", type: "select",
          // Shorten the generated enum's leaf (search_intent → intent) so the
          // versioned-table enum on the longest collection (business_categories,
          // with the drafts `_v_version_` prefix + `search_strategy` group path)
          // stays within Postgres's 63-char identifier limit. The function form
          // keeps the full table-qualified prefix, so names remain unique across
          // collections. The API/JSON key stays `searchIntent`.
          enumName: ({ tableName }: { tableName?: string }) => `enum_${tableName}_intent`,
          admin: { width: "50%", description: "Dominant intent for this entity/page." }, options: [
          { label: "Informational", value: "informational" },
          { label: "Commercial", value: "commercial" },
          { label: "Branded", value: "branded" },
          { label: "Transactional", value: "transactional" },
          { label: "Mixed", value: "mixed" },
        ] },
        { name: "targetMarket", type: "text", admin: { width: "50%", description: "e.g. “India”. Free text — not a normalized geography collection." } },
      ] },
      { name: "keywordResearchDate", type: "date", admin: { description: "When this research was captured.", date: { pickerAppearance: "dayOnly" } } },
      { name: "relatedQuestions", type: "text", hasMany: true, admin: { description: "Real search/AEO questions found during research. Can seed the FAQ editor." } },
      { name: "preferredInternalAnchors", type: "text", hasMany: true, admin: { description: "Editorial internal-linking hints only. NOT auto-injected as exact-match anchors." } },
      { name: "searchNotes", type: "textarea", admin: { description: "Internal strategy notes (SERP patterns, competitors, ambiguity, cannibalization, insight source). Never rendered publicly." } },
    ],
  };
}

/* ── PRESS & INDEPENDENT COVERAGE — PUBLIC ──────────────────────────────── */

export function pressCoverageField(): Field {
  return {
    name: "pressCoverage",
    type: "array",
    labels: { singular: "Press item", plural: "Press & Independent Coverage" },
    admin: { description: "External coverage. Distinguish coverage that mentions Geek from coverage that only validates the campaign." },
    fields: [
      { type: "row", fields: [
        { name: "publisher", type: "text", required: true, admin: { width: "50%", description: "e.g. “ET BrandEquity”." } },
        { name: "publicationDate", type: "date", admin: { width: "50%", date: { pickerAppearance: "dayOnly" } } },
      ] },
      { name: "headline", type: "text", required: true, admin: { description: "Original article title." } },
      { name: "url", type: "text", required: true, validate: requiredUrl, admin: { description: "Validated external URL." } },
      { name: "archiveUrl", type: "text", validate: optionalUrl, admin: { description: "Optional archive link (e.g. Wayback), for when the original may disappear." } },
      { type: "row", fields: [
        { name: "sourceType", type: "select", required: true, defaultValue: "independent-editorial", admin: { width: "60%" }, options: [
          { label: "Independent editorial", value: "independent-editorial" },
          { label: "Official brand", value: "official-brand" },
          { label: "Partner / NGO", value: "partner-ngo" },
          { label: "Campaign archive", value: "campaign-archive" },
          { label: "Trade publication", value: "trade-publication" },
          { label: "Other", value: "other" },
        ] },
        { name: "geekMentioned", type: "checkbox", admin: { width: "20%", description: "Geek is explicitly named/featured (NOT merely campaign coverage)." } },
        { name: "featured", type: "checkbox", admin: { width: "20%", description: "Surface prominently (keep to 3–4 strongest)." } },
      ] },
      { name: "validationNote", type: "textarea", admin: { description: "What this source substantiates, e.g. “Validates launch, 3,000+ micro-influencer scale and AR-filter activation.”" } },
      { name: "thumbnail", type: "upload", relationTo: "media", admin: { description: "Optional — ONLY a Media asset intentionally imported with acceptable rights. Never hotlink a publication's image." } },
    ],
  };
}

/* ── AWARDS & RECOGNITION — PUBLIC ──────────────────────────────────────── */

export function awardsField(): Field {
  return {
    name: "awards",
    type: "array",
    labels: { singular: "Award", plural: "Awards & Recognition" },
    admin: { description: "Industry recognition. Be precise about who was credited — an award for the campaign may credit the client/partners, not Geek." },
    fields: [
      { type: "row", fields: [
        { name: "awardBody", type: "text", required: true, admin: { width: "50%", description: "e.g. “MarCom Awards”." } },
        { name: "programName", type: "text", admin: { width: "50%", description: "e.g. “MarCom Awards 2021”." } },
      ] },
      { type: "row", fields: [
        { name: "category", type: "text", admin: { width: "40%", description: "e.g. “Integrated Marketing”. Optional." } },
        { name: "result", type: "text", admin: { width: "30%", description: "e.g. “Gold”." } },
        { name: "year", type: "number", admin: { width: "30%" } },
      ] },
      { name: "url", type: "text", validate: optionalUrl, admin: { description: "External source / archive." } },
      { name: "creditedOrganizations", type: "text", hasMany: true, admin: { description: "Organisations credited by this award (e.g. PepsiCo, Wunderman Thompson). May not include Geek." } },
      { name: "geekCredited", type: "checkbox", admin: { description: "Geek is explicitly credited by this award." } },
      { name: "validationNote", type: "textarea", admin: { description: "What this award validates." } },
    ],
  };
}

/* ── AEO / READER FAQ — PUBLIC ──────────────────────────────────────────── */

export function faqsField(): Field {
  return {
    name: "faqs",
    type: "array",
    labels: { singular: "Q&A", plural: "FAQ / Reader Questions" },
    admin: { description: "Genuinely useful reader questions with concise, evidence-backed answers. Not keyword spam." },
    fields: [
      { name: "question", type: "text", required: true },
      { name: "answer", type: "textarea", required: true, admin: { description: "Concise, accurate answer shown to readers." } },
    ],
  };
}

/* ── TAB COMPOSITION ────────────────────────────────────────────────────── */

export type GoldStandardOptions = {
  /** Public press coverage array. */
  press?: boolean;
  /** Public awards array. */
  awards?: boolean;
  /** Public FAQ / AEO array. */
  faqs?: boolean;
  /** Internal Search Strategy group. */
  searchStrategy?: boolean;
};

/**
 * Build the admin tabs a collection opts into. Public "Evidence & Recognition"
 * (press + awards) and "FAQ" come first; the INTERNAL "Search Strategy" tab is
 * last and visually separated from SEO publishing fields (Section 14). Spread the
 * result at the END of a collection's existing `tabs` array.
 */
export function goldStandardTabs(opts: GoldStandardOptions): Tab[] {
  const tabs: Tab[] = [];
  if (opts.press || opts.awards) {
    tabs.push({
      label: "Evidence & Recognition",
      description: "Public external validation. Only subsections with data are rendered on the page.",
      fields: [
        ...(opts.press ? [pressCoverageField()] : []),
        ...(opts.awards ? [awardsField()] : []),
      ],
    });
  }
  if (opts.faqs) {
    tabs.push({
      label: "FAQ",
      description: "Public reader questions (AEO). Rendered as an accessible FAQ section where supported.",
      fields: [faqsField()],
    });
  }
  if (opts.searchStrategy) {
    tabs.push({
      label: "Search Strategy — Internal",
      description: SEARCH_STRATEGY_HELP,
      fields: [searchStrategyField()],
    });
  }
  return tabs;
}
