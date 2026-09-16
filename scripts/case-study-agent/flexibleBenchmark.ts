/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE BENCHMARK SCORECARD
 *
 * Evaluates a completed GoldStandardCaseStudyCandidate.
 *
 * IMPORTANT:
 *
 * This benchmark:
 * - does NOT call AI;
 * - does NOT rewrite the case study;
 * - does NOT change evidence;
 * - does NOT publish;
 * - does NOT decide human creative quality.
 *
 * Machine score:
 *   10 objective dimensions × 10 points = 100.
 *
 * Human review:
 *   deliberately separate and NOT included in machine score.
 */

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

/* ── Benchmark dimensions ─────────────────────────── */

export const FLEXIBLE_BENCHMARK_DIMENSIONS = [
  "source-integrity",
  "evidence-integrity",
  "reconciliation-safety",
  "portfolio-integrity",
  "architecture-coverage",
  "metric-utilisation",
  "media-utilisation",
  "cms-integrity",
  "deterministic-quality",
  "semantic-review",
] as const;

export type FlexibleBenchmarkDimensionId =
  typeof FLEXIBLE_BENCHMARK_DIMENSIONS[number];

export type FlexibleBenchmarkDimension = {
  id:
    FlexibleBenchmarkDimensionId;

  label:
    string;

  score:
    number;

  maxScore:
    10;

  passed:
    boolean;

  notes:
    string[];
};

export type FlexibleBenchmarkHumanReview = {
  /**
   * Human editorial / strategic judgments.
   *
   * These fields intentionally do not affect
   * the deterministic machine score.
   */
  narrativeCraft:
    number | null;

  strategicInsight:
    number | null;

  visualStorytelling:
    number | null;

  differentiation:
    number | null;

  reviewerNotes:
    string[];
};

export type FlexibleBenchmarkResult = {
  machineScore:
    number;

  maxMachineScore:
    100;

  machinePassed:
    boolean;

  dimensions:
    FlexibleBenchmarkDimension[];

  humanReview:
    FlexibleBenchmarkHumanReview;

  summary: {
    approvedSources:
      number;

    excludedSources:
      number;

    evidenceCandidates:
      number;

    finalClaims:
      number;

    publicationReadyClaims:
      number;

    chapters:
      number;

    designedSections:
      number;

    compiledSections:
      number;

    mediaAssets:
      number;

    deterministicQualityScore:
      number;

    semanticCriticScore:
      number;

    reconciliationAuditScore:
      number;
  };
};

/* ── Helpers ──────────────────────────────────────── */

function dimension(
  id:
    FlexibleBenchmarkDimensionId,
  label:
    string,
  checks:
    Array<{
      passed:
        boolean;

      note:
        string;
    }>,
): FlexibleBenchmarkDimension {
  const passedCount =
    checks.filter(
      (check) =>
        check.passed,
    ).length;

  const score =
    checks.length ===
      0
      ? 0
      : Math.round(
          (
            passedCount /
            checks.length
          ) *
            10,
        );

  return {
    id,
    label,
    score,
    maxScore:
      10,
    passed:
      score ===
      10,
    notes:
      checks
        .filter(
          (check) =>
            !check.passed,
        )
        .map(
          (check) =>
            check.note,
        ),
  };
}

/* ── Public deterministic benchmark ───────────────── */

export function benchmarkFlexibleCandidate(
  candidate:
    GoldStandardCaseStudyCandidate,
): FlexibleBenchmarkResult {
  const publicationReadyClaims =
    candidate.evidence.claims.filter(
      (claim) =>
        claim.publishable ===
          true &&
        claim.confidence !==
          "low",
    );

  const dimensions:
    FlexibleBenchmarkDimension[] =
    [];

  /* 1. Source / provenance integrity */

  dimensions.push(
    dimension(
      "source-integrity",
      "Source / provenance integrity",
      [
        {
          passed:
            candidate
              .sourceIntake
              .sources
              .length >
            0,

          note:
            "No approved source reached the Evidence Pipeline.",
        },

        {
          passed:
            candidate
              .sourceIntake
              .sources
              .every(
                (source) =>
                  Boolean(
                    source.id &&
                    source.kind &&
                    source.title &&
                    source.content,
                  ),
              ),

          note:
            "One or more approved sources lacks required identity/content metadata.",
        },

        {
          passed:
            candidate
              .sourceIntake
              .excluded
              .every(
                (excluded) =>
                  !candidate
                    .sourceIntake
                    .sources
                    .some(
                      (source) =>
                        source.id ===
                        excluded.id,
                    ),
              ),

          note:
            "An excluded source also appears in the approved extraction set.",
        },
      ],
    ),
  );

  /* 2. Evidence publication integrity */

  dimensions.push(
    dimension(
      "evidence-integrity",
      "Evidence publication integrity",
      [
        {
          passed:
            candidate
              .evidence
              .candidates
              .length >
            0,

          note:
            "Extractor produced no evidence candidates.",
        },

        {
          passed:
            candidate
              .evidence
              .claims
              .length >
            0,

          note:
            "Final evidence ledger is empty.",
        },

        {
          passed:
            candidate
              .evidence
              .claims
              .every(
                (claim) =>
                  claim.publishable !==
                    true ||
                  claim.confidence !==
                    "low",
              ),

          note:
            "A low-confidence claim is marked publication-ready.",
        },

        {
          passed:
            publicationReadyClaims
              .length >
            0,

          note:
            "No publication-ready evidence survives reconciliation.",
        },
      ],
    ),
  );

  /* 3. Conflict reconciliation safety */

  dimensions.push(
    dimension(
      "reconciliation-safety",
      "Conflict reconciliation safety",
      [
        {
          passed:
            candidate
              .evidence
              .reconciliationAuditResult
              .safeToContinue ===
            true,

          note:
            "Independent Reconciliation Auditor does not consider the ledger safe.",
        },

        {
          passed:
            candidate
              .evidence
              .reconciliationAuditResult
              .status !==
            "fail",

          note:
            "Independent Reconciliation Auditor returned fail.",
        },

        {
          passed:
            !candidate
              .evidence
              .reconciliationAuditResult
              .findings
              .some(
                (finding) =>
                  finding.severity ===
                  "error",
              ),

          note:
            "Reconciliation audit contains an error finding.",
        },
      ],
    ),
  );

  /* 4. Portfolio integrity */

  dimensions.push(
    dimension(
      "portfolio-integrity",
      "Portfolio relationship integrity",
      [
        {
          passed:
            Boolean(
              candidate
                .portfolio
                .projectHint
                .title &&
              candidate
                .portfolio
                .projectHint
                .slug,
            ),

          note:
            "Validated project identity is incomplete.",
        },

        {
          passed:
            Boolean(
              candidate
                .portfolio
                .relationships,
            ),

          note:
            "Validated portfolio relationships are missing.",
        },

        {
          passed:
            Array.isArray(
              candidate
                .portfolio
                .allowedContinuitySlugs,
            ),

          note:
            "Continuity allowlist is missing.",
        },
      ],
    ),
  );

  /* 5. Story architecture */

  dimensions.push(
    dimension(
      "architecture-coverage",
      "Story architecture coverage",
      [
        {
          passed:
            candidate
              .architecture
              .chapters
              .length >
            0,

          note:
            "Architect produced no chapters.",
        },

        {
          passed:
            candidate
              .architecture
              .chapters
              .every(
                (chapter) =>
                  Boolean(
                    chapter.id &&
                    chapter.role &&
                    chapter.purpose,
                  ),
              ),

          note:
            "One or more architecture chapters is incomplete.",
        },

        {
          passed:
            candidate
              .design
              .sections
              .length >=
            candidate
              .architecture
              .chapters
              .length,

          note:
            "Designed section count is smaller than architecture chapter count.",
        },
      ],
    ),
  );

  /* 6. Metric utilisation */

  const metricClaimIds =
    new Set(
      candidate
        .architecture
        .metricsPlan
        .map(
          (metric) =>
            metric.claimId,
        ),
    );

  const metricBindings =
    candidate
      .compiled
      .bindings
      .filter(
        (binding) =>
          binding.evidenceClaimIds.some(
            (claimId) =>
              metricClaimIds.has(
                claimId,
              ),
          ),
      );

  dimensions.push(
    dimension(
      "metric-utilisation",
      "Metric utilisation",
      [
        {
          passed:
            candidate
              .architecture
              .metricsPlan
              .length ===
              0 ||
            metricBindings.length >
              0,

          note:
            "Architect planned metrics but none are bound into compiled sections.",
        },

        {
          passed:
            candidate
              .architecture
              .metricsPlan
              .every(
                (metric) =>
                  publicationReadyClaims
                    .some(
                      (claim) =>
                        claim.id ===
                        metric.claimId,
                    ),
              ),

          note:
            "Architecture metric plan references evidence that is not publication-ready.",
        },
      ],
    ),
  );

  /* 7. Media utilisation */

  const designJson =
    JSON.stringify(
      candidate.design,
    );

  dimensions.push(
    dimension(
      "media-utilisation",
      "Media utilisation",
      [
        {
          passed:
            candidate
              .media
              .assets
              .length ===
              0 ||
            candidate
              .media
              .designerAssets
              .some(
                (asset) =>
                  designJson.includes(
                    asset.id,
                  ),
              ),

          note:
            "Trusted media exists but the Designer used none of it.",
        },

        {
          passed:
            candidate
              .media
              .designerAssets
              .length ===
            candidate
              .media
              .compilerAssets
              .length,

          note:
            "Designer and Compiler media projections do not represent the same trusted registry.",
        },
      ],
    ),
  );

  /* 8. CMS compilation integrity */

  const cmsJson =
    JSON.stringify(
      candidate
        .compiled
        .cmsSections,
    );

  dimensions.push(
    dimension(
      "cms-integrity",
      "CMS compilation integrity",
      [
        {
          passed:
            candidate
              .compiled
              .renderMode ===
            "flexible",

          note:
            "Compiled candidate is not Flexible render mode.",
        },

        {
          passed:
            candidate
              .compiled
              .cmsSections
              .length >
            0,

          note:
            "Compiler produced no CMS sections.",
        },

        {
          passed:
            !cmsJson.includes(
              '"claimId"',
            ) &&
            !cmsJson.includes(
              '"evidenceClaimIds"',
            ) &&
            !cmsJson.includes(
              '"assetId"',
            ) &&
            !cmsJson.includes(
              '"targetProjectSlug"',
            ),

          note:
            "Internal evidence/design identifiers leaked into CMS sections.",
        },

        {
          passed:
            candidate
              .compiled
              .bindings
              .length >
            0,

          note:
            "Compiler produced no internal evidence bindings.",
        },
      ],
    ),
  );

  /* 9. Deterministic quality */

  dimensions.push(
    dimension(
      "deterministic-quality",
      "Deterministic quality performance",
      [
        {
          passed:
            candidate
              .quality
              .draftReady ===
            true,

          note:
            "Flexible deterministic quality gate is not draft-ready.",
        },

        {
          passed:
            candidate
              .quality
              .status !==
            "fail",

          note:
            "Flexible deterministic quality gate failed.",
        },

        {
          passed:
            candidate
              .quality
              .score >=
            90,

          note:
            "Flexible deterministic quality score is below 90.",
        },
      ],
    ),
  );

  /* 10. Independent semantic review */

  dimensions.push(
    dimension(
      "semantic-review",
      "Independent semantic-review performance",
      [
        {
          passed:
            candidate
              .semanticCritic
              .draftReady ===
            true,

          note:
            "Independent Semantic Critic does not consider candidate draft-ready.",
        },

        {
          passed:
            candidate
              .semanticCritic
              .status !==
            "fail",

          note:
            "Independent Semantic Critic returned fail.",
        },

        {
          passed:
            !candidate
              .semanticCritic
              .findings
              .some(
                (finding) =>
                  finding.severity ===
                  "error",
              ),

          note:
            "Independent Semantic Critic contains an error finding.",
        },

        {
          passed:
            candidate
              .semanticCritic
              .score >=
            90,

          note:
            "Independent Semantic Critic score is below 90.",
        },
      ],
    ),
  );

  const machineScore =
    dimensions.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.score,
      0,
    );

  return {
    machineScore,

    maxMachineScore:
      100,

    /**
     * Machine PASS means every objective dimension
     * passes completely.
     *
     * Human approval is still required separately.
     */
    machinePassed:
      dimensions.every(
        (item) =>
          item.passed,
      ),

    dimensions,

    humanReview: {
      narrativeCraft:
        null,

      strategicInsight:
        null,

      visualStorytelling:
        null,

      differentiation:
        null,

      reviewerNotes:
        [],
    },

    summary: {
      approvedSources:
        candidate
          .sourceIntake
          .sources
          .length,

      excludedSources:
        candidate
          .sourceIntake
          .excluded
          .length,

      evidenceCandidates:
        candidate
          .evidence
          .candidates
          .length,

      finalClaims:
        candidate
          .evidence
          .claims
          .length,

      publicationReadyClaims:
        publicationReadyClaims
          .length,

      chapters:
        candidate
          .architecture
          .chapters
          .length,

      designedSections:
        candidate
          .design
          .sections
          .length,

      compiledSections:
        candidate
          .compiled
          .cmsSections
          .length,

      mediaAssets:
        candidate
          .media
          .assets
          .length,

      deterministicQualityScore:
        candidate
          .quality
          .score,

      semanticCriticScore:
        candidate
          .semanticCritic
          .score,

      reconciliationAuditScore:
        candidate
          .evidence
          .reconciliationAuditResult
          .score,
    },
  };
}
