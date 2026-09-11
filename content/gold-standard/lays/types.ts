/**
 * GOLD STANDARD IMPORT PACK — shared types (Phase 11.29).
 *
 * Plain data describing the Lay's reference relationship graph. Consumed ONLY by
 * scripts/import-lays-gold-standard.ts, which writes Drafts through the Payload
 * Local API. These types mirror the FROZEN Phase 11.26 schema — no new fields.
 *
 * All records import as `_status: "draft"`. Relationships are resolved by SLUG at
 * import time, so this file never hardcodes database ids.
 */

export type SearchIntent = "informational" | "commercial" | "branded" | "transactional" | "mixed";

/** INTERNAL editorial group — staff-only, never rendered/exposed publicly. */
export type SearchStrategy = {
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: SearchIntent;
  targetMarket?: string;
  keywordResearchDate?: string; // ISO date
  relatedQuestions?: string[];
  preferredInternalAnchors?: string[];
  searchNotes?: string;
};

export type Faq = { question: string; answer: string };

export type PressSourceType =
  | "independent-editorial" | "official-brand" | "partner-ngo"
  | "campaign-archive" | "trade-publication" | "other";

export type Press = {
  publisher: string;
  headline: string;
  url: string;
  archiveUrl?: string;
  publicationDate?: string; // ISO date
  sourceType: PressSourceType;
  geekMentioned?: boolean;
  featured?: boolean;
  validationNote?: string;
};

export type Award = {
  awardBody: string;
  programName?: string;
  category?: string;
  result?: string;
  year?: number;
  url?: string;
  creditedOrganizations?: string[];
  geekCredited?: boolean;
  validationNote?: string;
};

export type Seo = { metaTitle?: string; metaDescription?: string; noindex?: boolean };

/* ── Entity records ─────────────────────────────────────────────────────── */

export type IndustryRecord = {
  slug: string;
  name: string;
  shortSummary?: string;
  introduction?: string;
  faqs?: Faq[];
  searchStrategy?: SearchStrategy;
  seo?: Seo;
};

export type CompanyRecord = {
  slug: string;
  name: string;
  shortSummary?: string;
  introduction?: string;
  website?: string;
  businessCategorySlugs?: string[];
  faqs?: Faq[];
  press?: Press[];
  awards?: Award[];
  searchStrategy?: SearchStrategy;
  seo?: Seo;
};

export type BrandRecord = {
  slug: string;
  name: string;
  companySlug: string;
  portfolioGroup?: string;
  shortSummary?: string;
  introduction?: string;
  businessCategorySlugs?: string[];
  faqs?: Faq[];
  press?: Press[];
  awards?: Award[];
  searchStrategy?: SearchStrategy;
  seo?: Seo;
};

export type Capability = { title: string; description?: string };

export type ServiceRecord = {
  slug: string;
  label: string;
  order?: number;
  hero?: { heading?: string; shortSummary?: string };
  introduction?: string;
  capabilities?: Capability[];
  approach?: string;
  faqs?: Faq[];
  searchStrategy?: SearchStrategy;
  seo?: Seo;
};

export type MethodologyStep = { title: string; description?: string };

export type SolutionRecord = {
  slug: string;
  name: string;
  solutionType?: "proprietary-ip" | "methodology" | "program-model" | "solution";
  shortSummary?: string;
  introduction?: string;
  relatedServiceSlugs?: string[];
  whatItSolves?: { heading?: string; body?: string };
  methodology?: MethodologyStep[];
  faqs?: Faq[];
  press?: Press[];
  searchStrategy?: SearchStrategy;
  seo?: Seo;
};

/* ── Project record ─────────────────────────────────────────────────────── */

/** A single `flexible` sections block we author in plain data (no Lexical). */
export type Section =
  | { blockType: "sectionIntro"; eyebrow?: string; heading: string; body?: string }
  | { blockType: "metrics"; heading?: string; items: { value: string; label: string; prefix?: string; suffix?: string; note?: string }[] }
  | { blockType: "quote"; quote: string; attribution?: string }
  | { blockType: "cta"; heading: string; body?: string; buttonLabel?: string; buttonHref?: string };

export type ProjectRecord = {
  slug: string;
  title: string;
  client?: string;
  year?: number;
  shortSummary?: string;
  cardSummary?: string;
  projectKind: "campaign" | "ongoing-program" | "platform" | "activation";
  renderMode?: "standard" | "flexible";
  heroLegacySrc?: string;
  companySlug?: string;
  brandSlug?: string;
  businessCategorySlugs?: string[];
  serviceSlugs?: string[];
  solutionSlugs?: string[];
  sections?: Section[];
  metrics?: { value: string; label: string; prefix?: string; suffix?: string; note?: string }[];
  faqs?: Faq[];
  press?: Press[];
  awards?: Award[];
  searchStrategy?: SearchStrategy;
  seo?: Seo;
};
