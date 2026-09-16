/**
 * GOLD STANDARD CASE STUDY AGENT — FULL CASE STUDY PIPELINE
 *
 * trusted raw sources
 *   → Evidence Pipeline
 *   → Story Architect
 *   → Flexible Case Study Designer
 *   → Deterministic CMS Compiler
 *   → Gold Standard Candidate
 *
 * IMPORTANT:
 * - NO Payload write.
 * - NO database.
 * - NO CMS mutation.
 * - NO publishing.
 * - Human approval still comes later.
 */

import type OpenAI from "openai";

import {
  buildEvidenceLedger,
} from "./evidencePipeline";

import {
  buildGenerationSourcesFromManifest,
} from "./sourceIntake";

import {
  architectCaseStudy,
} from "./architect";

import {
  designCaseStudy,
} from "./designer";

import {
  compileFlexibleCaseStudy,
} from "./compiler";

import {
  runFlexibleQualityGate,
} from "./flexibleQualityGate";

import {
  critiqueCaseStudy,
} from "./semanticCritic";

import {
  buildTrustedPortfolioContext,
} from "./portfolioContext";

import {
  buildTrustedMediaContext,
} from "./mediaContext";

import type {
  EvidencePipelineResult,
} from "./evidencePipeline";

import type {
  CaseStudyDesignPlan,
} from "./architect";

import type {
  FlexibleCaseStudyDesign,
} from "./designer";

import type {
  CompiledFlexibleCaseStudy,
} from "./compiler";

import type {
  GenerationTaxonomy,
} from "./generator";

import type {
  QualityGateResult,
} from "./types";

import type {
  SemanticCriticResult,
} from "./semanticCritic";

import type {
  TrustedPortfolioContext,
  TrustedPortfolioSelection,
} from "./portfolioContext";

import type {
  TrustedMediaAssetInput,
  TrustedMediaContext,
} from "./mediaContext";

import type {
  TrustedSourceManifest,
} from "./sourceManifest";

import type {
  SourceIntakeResult,
} from "./sourceIntake";


/* ── Public request ─────────────────────────────────── */

export type BuildCaseStudyCandidateRequest = {
  /**
   * Operator-controlled, deterministically validated
   * source registry.
   *
   * Only entries with status=approved-for-extraction
   * may reach the Evidence Pipeline.
   */
  sourceManifest:
    TrustedSourceManifest;

  /**
   * Operator-controlled portfolio graph.
   *
   * Company, Brand, Industry, Service, Solution / IP and
   * continuity are validated deterministically after the
   * evidence ledger has been reconciled.
   *
   * AI does not assign these relationships.
   */
  portfolio: {
    taxonomy:
      GenerationTaxonomy;

    selection:
      TrustedPortfolioSelection;
  };

  /**
   * Trusted campaign media registry.
   *
   * The AI sees only semantic asset information.
   * The Compiler receives the trusted locator.
   */
  mediaAssets?:
    TrustedMediaAssetInput[];

  extractorModel?: string;

  verifierModel?: string;

  reconcilerModel?: string;

  reconciliationAuditorModel?: string;

  architectModel?: string;

  designerModel?: string;

  criticModel?: string;
};

/* ── Injectable clients for tests ───────────────────── */

export type BuildCaseStudyCandidateOptions = {
  extractorClient?: OpenAI;

  verifierClient?: OpenAI;

  reconcilerClient?: OpenAI;

  reconciliationAuditorClient?: OpenAI;

  architectClient?: OpenAI;

  designerClient?: OpenAI;

  criticClient?: OpenAI;
};

/* ── Final candidate package ────────────────────────── */

export type GoldStandardCaseStudyCandidate = {
  /**
   * Deterministic source-intake result.
   *
   * Includes approved GenerationSource records plus
   * the internal audit of pending/rejected exclusions.
   */
  sourceIntake:
    SourceIntakeResult;

  /**
   * Complete internal evidence pipeline result.
   */
  evidence:
    EvidencePipelineResult;

  /**
   * Deterministically validated portfolio graph.
   *
   * Includes Company, Brand, Industry, Service,
   * evidence-backed Solution / IP relationships
   * and explicit project continuity.
   */
  portfolio:
    TrustedPortfolioContext;

  /**
   * Deterministically validated trusted media registry.
   *
   * Full internal provenance is preserved here.
   * Designer and Compiler receive restricted projections.
   */
  media:
    TrustedMediaContext;

  /**
   * Story / chapter architecture.
   */
  architecture:
    CaseStudyDesignPlan;

  /**
   * Semantic Flexible page design.
   */
  design:
    FlexibleCaseStudyDesign;

  /**
   * Payload-compatible sections plus internal bindings.
   */
  compiled:
    CompiledFlexibleCaseStudy;

  /**
   * Independent deterministic Flexible quality audit.
   *
   * A candidate is returned only when draftReady=true.
   */
  quality:
    QualityGateResult;

  /**
   * Independent semantic review of the finished story.
   *
   * This audit cannot rewrite the case study.
   */
  semanticCritic:
    SemanticCriticResult;
};

/* ── Public orchestrator ────────────────────────────── */

export async function buildCaseStudyCandidate(
  request:
    BuildCaseStudyCandidateRequest,
  options:
    BuildCaseStudyCandidateOptions = {},
): Promise<GoldStandardCaseStudyCandidate> {
  const mediaAssets =
    request.mediaAssets ??
    [];

  /**
   * PHASE 1 — TRUSTED SOURCE INTAKE
   *
   * Pending and rejected registered material is excluded
   * before the Evidence Extractor can see it.
   */
  const sourceIntake =
    buildGenerationSourcesFromManifest(
      request.sourceManifest,
    );

  /**
   * A Gold Standard case study cannot begin when the
   * operator has approved zero sources for extraction.
   *
   * This check occurs BEFORE any AI call.
   */
  if (
    sourceIntake.sources.length ===
    0
  ) {
    throw new Error(
      "Case Study Pipeline requires at least one source approved-for-extraction.",
    );
  }

  /**
   * PHASE 2 — EVIDENCE
   *
   * Extract → Verify → Reconcile.
   */
  const evidence =
    await buildEvidenceLedger(
      {
        sources:
          sourceIntake.sources,

        extractorModel:
          request.extractorModel,

        verifierModel:
          request.verifierModel,

        reconcilerModel:
          request.reconcilerModel,

        reconciliationAuditorModel:
          request.reconciliationAuditorModel,
      },
      {
        extractorClient:
          options.extractorClient,

        verifierClient:
          options.verifierClient,

        reconcilerClient:
          options.reconcilerClient,

        reconciliationAuditorClient:
          options.reconciliationAuditorClient,
      },
    );

  /**
   * A case study cannot be designed from an empty
   * evidence ledger.
   */
  if (
    evidence.claims.length ===
    0
  ) {
    throw new Error(
      "Case Study Pipeline cannot build a candidate because the evidence ledger is empty.",
    );
  }

  /**
   * PHASE 2 — TRUSTED PORTFOLIO CONTEXT
   *
   * Resolve operator-controlled:
   * Company → Brand → Industry → Service → Solution / IP
   * plus previous / next project continuity.
   *
   * Solution relationships are checked against the
   * reconciled evidence ledger and cannot be inferred.
   */
  const portfolio =
    buildTrustedPortfolioContext({
      taxonomy:
        request.portfolio
          .taxonomy,

      selection:
        request.portfolio
          .selection,

      claims:
        evidence.claims,
    });

  const continuity =
    portfolio
      .allowedContinuitySlugs;

  /**
   * PHASE 3 — TRUSTED MEDIA CONTEXT
   *
   * Validate operator-supplied media against the
   * reconciled evidence ledger.
   *
   * Media may accompany evidence but cannot create,
   * upgrade or publish a factual claim.
   */
  const media =
    buildTrustedMediaContext({
      assets:
        mediaAssets,

      claims:
        evidence.claims,
    });

  /**
   * PHASE 4 — ARCHITECTURE
   *
   * Decide the story structure from reconciled evidence
   * and validated portfolio context.
   */
  const architecture =
    await architectCaseStudy(
      {
        claims:
          evidence.claims,

        projectHint:
          portfolio.projectHint,

        portfolioContext: {
          relationships:
            portfolio.relationships,

          solutions:
            portfolio.solutions,
        },

        allowedContinuitySlugs:
          continuity,

        model:
          request.architectModel,
      },
      {
        client:
          options.architectClient,
      },
    );

  /**
   * The new Designer / Compiler path currently builds
   * Flexible case studies only.
   *
   * Do not silently convert a Standard recommendation
   * into Flexible mode.
   */
  if (
    architecture
      .renderModeRecommendation !==
    "flexible"
  ) {
    throw new Error(
      "Case Study Pipeline requires Architect renderModeRecommendation=flexible before Designer execution.",
    );
  }

  /**
   * PHASE 3 — DESIGN
   *
   * Convert the approved architecture into semantic
   * Flexible sections.
   */
  const design =
    await designCaseStudy(
      {
        plan:
          architecture,

        claims:
          evidence.claims,

        mediaAssets:
          media.designerAssets,

        allowedContinuitySlugs:
          continuity,

        model:
          request.designerModel,
      },
      {
        client:
          options.designerClient,
      },
    );

  /**
   * PHASE 4 — DETERMINISTIC COMPILATION
   *
   * AI-generated semantic structures become
   * Payload-compatible section blocks.
   *
   * The Compiler alone resolves:
   * - trusted media locators;
   * - Lexical JSON;
   * - CTA /work/<slug> paths.
   */
  const compiled =
    compileFlexibleCaseStudy({
      design,

      mediaAssets:
        media.compilerAssets,

      allowedContinuitySlugs:
        continuity,
    });

  /**
   * PHASE 5 — INDEPENDENT FLEXIBLE QUALITY GATE
   *
   * Compilation alone is not enough.
   *
   * Re-audit evidence safety, bindings, metrics,
   * quotes, CTA integrity, ordering and CMS leakage.
   */
  const quality =
    runFlexibleQualityGate({
      claims:
        evidence.claims,

      architecture,

      design,

      compiled,
    });

  /**
   * Fail closed.
   *
   * Warnings may remain draftReady=true, matching the
   * repository's existing quality-gate convention.
   * Any error prevents a candidate from being returned.
   */
  if (!quality.draftReady) {
    const codes =
      quality.issues
        .map(
          (issue) =>
            issue.code,
        )
        .join(", ");

    throw new Error(
      `Case Study Pipeline failed Flexible quality gate: ${codes || "unknown quality error"}`,
    );
  }

  /**
   * PHASE 6 — INDEPENDENT SEMANTIC CRITIC
   *
   * The finished story is reviewed independently for:
   * - evidence overreach;
   * - scope clarity;
   * - narrative logic;
   * - strategic depth;
   * - repetition;
   * - omitted evidence;
   * - architecture fit;
   * - continuity integrity;
   * - metric interpretation.
   *
   * The Critic audits only. It cannot rewrite.
   */
  const semanticCritic =
    await critiqueCaseStudy(
      {
        claims:
          evidence.claims,

        architecture,

        design,

        model:
          request.criticModel,
      },
      {
        client:
          options.criticClient,
      },
    );

  /**
   * Fail closed on semantic errors.
   *
   * Warnings remain draftReady=true and continue
   * to human review, matching the quality convention.
   */
  if (!semanticCritic.draftReady) {
    const findingIds =
      semanticCritic.findings
        .map(
          (finding) =>
            finding.id,
        )
        .join(", ");

    throw new Error(
      `Case Study Pipeline failed Semantic Critic: ${findingIds || "unknown semantic error"}`,
    );
  }

  return {
    sourceIntake,

    evidence,

    portfolio,

    media,

    architecture,

    design,

    compiled,

    quality,

    semanticCritic,
  };
}
