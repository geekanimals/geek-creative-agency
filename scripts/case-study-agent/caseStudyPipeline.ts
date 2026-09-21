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

import {
  loadCaseStudyAgentMemory,
} from "./caseStudyAgentMemory";

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
  generateFlexibleSeo,
} from "./flexibleSeo";

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
  FlexibleSeoResult,
} from "./flexibleSeo";

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

  /**
   * Optional SEO-model override.
   *
   * SEO remains downstream of the completed case-study
   * intelligence pipeline.
   */
  seoModel?: string;
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

  seoClient?: OpenAI;
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

  /**
   * Additive discoverability layer generated only after
   * the normal case-study Semantic Critic is draft-ready.
   */
  seo:
    FlexibleSeoResult;
};

/* ── Public orchestrator ────────────────────────────── */


/* SEO-safe public-story projection */

/**
 * Convert the finished Flexible design into reader-visible
 * text for the downstream SEO Agent.
 *
 * Internal evidence bindings, media identifiers, provenance
 * and continuity targets never cross this boundary.
 *
 * CTA/navigation sections are deliberately excluded so copy
 * about another project cannot distort the current project's
 * search positioning.
 */
function buildSeoStoryText(
  design:
    FlexibleCaseStudyDesign,
): string[] {
  const text:
    string[] =
      [];

  const add = (
    value:
      string | null | undefined,
  ) => {
    if (
      typeof value ===
        "string" &&
      value.trim()
    ) {
      text.push(
        value.trim(),
      );
    }
  };

  for (
    const section of
    design.sections
  ) {
    switch (
      section.blockType
    ) {
      case "sectionIntro":
        add(
          section.eyebrow,
        );

        add(
          section.heading,
        );

        add(
          section.body,
        );

        break;

      case "richText":
        add(
          section.body,
        );

        break;

      case "mediaBlock":
        /*
         * Pure media.
         * Asset identity must not reach SEO.
         */
        break;

      case "fullBleedMedia":
        add(
          section.overlayHeading,
        );

        break;

      case "splitContent":
        add(
          section.body,
        );

        break;

      case "mediaGallery":
        add(
          section.heading,
        );

        break;

      case "metrics":
        add(
          section.heading,
        );

        for (
          const item of
          section.items
        ) {
          const value =
            (
              item.prefix ??
              ""
            ) +
            item.value +
            (
              item.suffix ??
              ""
            );

          add(
            value +
            " - " +
            item.label +
            (
              item.note
                ? " - " +
                  item.note
                : ""
            ),
          );
        }

        break;

      case "quote":
        add(
          section.quote,
        );

        add(
          section.attribution,
        );

        break;

      case "cta":
        /*
         * Continuity/navigation content belongs to another
         * project's discovery context.
         */
        break;
    }
  }

  return text;
}

export async function buildCaseStudyCandidate(
  request:
    BuildCaseStudyCandidateRequest,
  options:
    BuildCaseStudyCandidateOptions = {},
): Promise<GoldStandardCaseStudyCandidate> {
  loadCaseStudyAgentMemory();

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
    const findingDetails =
      semanticCritic.findings
        .map(
          (finding) => {
            const sections =
              finding.sectionIds.length > 0
                ? finding.sectionIds.join(", ")
                : "none";

            const claims =
              finding.claimIds.length > 0
                ? finding.claimIds.join(", ")
                : "none";

            return [
              finding.id,
              `[${finding.severity}/${finding.category}]`,
              finding.message,
              `sections: ${sections}`,
              `claims: ${claims}`,
            ].join(" | ");
          },
        )
        .join(" || ");

    throw new Error(
      `Case Study Pipeline failed Semantic Critic: ${findingDetails || "unknown semantic error"}`,
    );
  }

  /**
   * PHASE 7 — ADDITIVE SEO / AEO LAYER
   *
   * This happens only after:
   * - trusted evidence;
   * - portfolio validation;
   * - architecture;
   * - design;
   * - compilation;
   * - deterministic quality;
   * - independent Semantic Critic.
   *
   * SEO cannot rewrite any upstream output.
   */
  const seoProject =
    portfolio
      .projectHint;

  if (
    !seoProject.title?.trim() ||
    !seoProject.slug?.trim()
  ) {
    throw new Error(
      "Case Study Pipeline requires validated project title and slug before SEO generation.",
    );
  }

  const publishableSeoClaims =
    evidence.claims
      .filter(
        (claim) =>
          claim.publishable &&
          claim.confidence !==
            "low",
      )
      .map(
        (claim) => ({
          id:
            claim.id,

          type:
            claim.type,

          statement:
            claim.statement,
        }),
      );

  const seo =
    await generateFlexibleSeo(
      {
        project: {
          title:
            seoProject.title,

          slug:
            seoProject.slug,

          client:
            seoProject.client,

          year:
            seoProject.year,

          location:
            seoProject.location,
        },

        publishableClaims:
          publishableSeoClaims,

        storyText:
          buildSeoStoryText(
            design,
          ),

        model:
          request.seoModel,
      },
      {
        client:
          options.seoClient,
      },
    );

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

    seo,
  };
}
