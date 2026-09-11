/**
 * GOLD STANDARD CASE STUDY AGENT — INTERNAL CONTRACT
 *
 * This file describes the Agent's working package.
 *
 * IMPORTANT:
 * - Evidence / provenance / claim confidence stay OUTSIDE the public CMS.
 * - `project` contains publication-safe fields only.
 * - Agent output is always DRAFT-oriented.
 * - Flagship renderers are never agent-writable.
 */

import type {
  SearchStrategy,
  Faq,
  Press,
  Award,
  Seo,
} from "../../content/gold-standard/lays/types";

export type EvidenceSourceKind =
  | "user-provided"
  | "internal-document"
  | "official-brand"
  | "campaign-archive"
  | "independent-editorial"
  | "trade-publication"
  | "partner-ngo"
  | "website"
  | "social"
  | "other";

export type EvidenceSource = {
  id: string;
  kind: EvidenceSourceKind;
  title: string;
  url?: string;
  publisher?: string;
  publicationDate?: string;
  capturedAt?: string;
  notes?: string;
};

export type ClaimType =
  | "fact"
  | "metric"
  | "quote"
  | "relationship"
  | "award"
  | "press"
  | "narrative";

export type ClaimConfidence = "high" | "medium" | "low";

/**
 * Internal-only verbatim evidence binding.
 *
 * `excerpt` must be copied exactly from trusted GenerationSource content.
 * It never enters the public CMS.
 */
export type EvidenceSupport = {
  sourceId: string;
  excerpt: string;
};

export type EvidenceClaim = {
  id: string;
  type: ClaimType;
  statement: string;
  sourceIds: string[];

  /**
   * Exact passages supporting this claim.
   *
   * Optional at the package boundary so existing frozen benchmark packages
   * remain readable during migration.
   */
  support?: EvidenceSupport[];

  confidence: ClaimConfidence;

  /**
   * True only when the evidence is strong enough for public copy.
   * Low-confidence claims should normally remain false.
   */
  publishable: boolean;

  note?: string;
};

/**
 * Narrative sections that must be grounded in explicit evidence claims.
 *
 * These bindings are INTERNAL ONLY and never enter Payload.
 */
export type NarrativeField =
  | "challenge"
  | "insight"
  | "idea"
  | "execution"
  | "outcome";

export type NarrativeEvidenceBinding = {
  field: NarrativeField;

  /**
   * One or more evidence claims that support this narrative section.
   */
  claimIds: string[];
};

export type ProjectMetric = {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  note?: string;

  /**
   * Internal only. Used by the Agent quality gate and stripped before CMS write.
   */
  claimId?: string;
};

export type StandardCaseStudyDraft = {
  slug: string;
  title: string;

  client?: string;
  year?: number;
  location?: string;

  shortSummary?: string;
  cardSummary?: string;

  /**
   * Agent v1 writes only Standard projects.
   * Flexible can be added deliberately later.
   * Flagship is prohibited.
   */
  renderMode: "standard";

  projectKind:
    | "campaign"
    | "ongoing-program"
    | "platform"
    | "activation";

  heroLegacySrc?: string;

  // Relationship graph — always resolved by slug before CMS write.
  companySlug?: string;
  brandSlug?: string;
  businessCategorySlugs?: string[];
  serviceSlugs?: string[];
  solutionSlugs?: string[];

  // Standard renderer story.
  headline?: string;

  challenge?: {
    question?: string;
    copy?: string;
  };

  insight?: string;

  idea?: {
    statement?: string;
    copy?: string;
  };

  execution?: string;

  outcome?: string;

  quote?: {
    text?: string;
    attribution?: string;
  };

  metrics?: ProjectMetric[];

  // Gold Standard enrichment.
  faqs?: Faq[];
  press?: Press[];
  awards?: Award[];

  // Internal editorial SEO strategy.
  searchStrategy?: SearchStrategy;

  // Public SEO fields.
  seo?: Seo;
};

export type QualitySeverity = "error" | "warning" | "info";

export type QualityIssue = {
  code: string;
  severity: QualitySeverity;
  message: string;
  field?: string;
  claimId?: string;
};

export type QualityGateResult = {
  status: "pass" | "partial" | "fail";

  /**
   * This does NOT mean publish automatically.
   * It only means the draft satisfies the Agent's quality contract.
   */
  draftReady: boolean;

  score: number;
  issues: QualityIssue[];
};

export type CaseStudyAgentPackage = {
  schemaVersion: "1.0";

  generatedAt: string;

  project: StandardCaseStudyDraft;

  /**
   * Kept outside Payload.
   */
  evidence: {
    sources: EvidenceSource[];
    claims: EvidenceClaim[];

    /**
     * Internal evidence map for Challenge → Insight → Idea → Execution → Outcome.
     * Optional at the TypeScript boundary for backwards compatibility;
     * the Gold Standard quality gate will require complete bindings.
     */
    narrativeBindings?: NarrativeEvidenceBinding[];
  };

  quality: QualityGateResult;
};
