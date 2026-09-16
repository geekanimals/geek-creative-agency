/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE BENCHMARK TESTS
 *
 * No AI.
 * No network.
 * No CMS.
 * No database.
 *
 * Proves:
 * - clean candidate receives 100/100;
 * - every benchmark dimension is independently visible;
 * - evidence/reconciliation/CMS/quality/critic weaknesses reduce score;
 * - machine PASS requires all objective dimensions to pass;
 * - human review stays separate from machine score;
 * - benchmark never mutates the candidate.
 */

import {
  benchmarkFlexibleCandidate,
  FLEXIBLE_BENCHMARK_DIMENSIONS,
} from "./flexibleBenchmark";

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

let pass = 0;
let fail = 0;

function check(
  name: string,
  condition: boolean,
) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    pass++;
  } else {
    console.log(`  ✗ ${name}`);
    fail++;
  }
}

function clone<T>(
  value: T,
): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
}

function dimensionScore(
  result: ReturnType<
    typeof benchmarkFlexibleCandidate
  >,
  id:
    typeof FLEXIBLE_BENCHMARK_DIMENSIONS[number],
): number {
  return (
    result.dimensions.find(
      (item) =>
        item.id ===
        id,
    )?.score ??
    -1
  );
}

/**
 * Compact runtime fixture.
 *
 * The benchmark deliberately reads only the finished
 * candidate surfaces it is responsible for evaluating.
 */
function cleanCandidate():
  GoldStandardCaseStudyCandidate {
  return {
    sourceIntake: {
      sources: [
        {
          id:
            "source-report",

          kind:
            "internal-document",

          title:
            "Campaign Report",

          content:
            "The campaign activated 500 creators.",
        },
      ],

      excluded: [
        {
          id:
            "pending-note",

          status:
            "pending",

          reason:
            "Pending operator approval.",
        },
      ],
    },

    evidence: {
      candidates: [
        {
          id:
            "metric-creators",

          type:
            "metric",

          statement:
            "The campaign activated 500 creators.",

          sourceIds: [
            "source-report",
          ],

          support: [
            {
              sourceId:
                "source-report",

              excerpt:
                "The campaign activated 500 creators.",
            },
          ],
        },
      ],

      verification: {
        claims: [],
      },

      claims: [
        {
          id:
            "metric-creators",

          type:
            "metric",

          statement:
            "The campaign activated 500 creators.",

          sourceIds: [
            "source-report",
          ],

          support: [
            {
              sourceId:
                "source-report",

              excerpt:
                "The campaign activated 500 creators.",
            },
          ],

          confidence:
            "high",

          publishable:
            true,

          note:
            "Supported.",
        },
      ],

      reconciliationAudit: [],

      reconciliationAuditResult: {
        status:
          "pass",

        safeToContinue:
          true,

        score:
          100,

        summary:
          "Reconciliation is safe.",

        findings: [],
      },
    },

    portfolio: {
      projectHint: {
        title:
          "Sample Campaign",

        slug:
          "sample-campaign",
      },

      relationships: {
        companySlug:
          "sample-company",

        brandSlug:
          "sample-brand",

        businessCategorySlugs: [
          "fmcg",
        ],

        serviceSlugs: [
          "influencer-marketing",
        ],
      },

      solutions: [],

      continuity: {
        previousProjectSlug:
          null,

        nextProjectSlug:
          null,
      },

      allowedContinuitySlugs: [],
    },

    media: {
      assets: [],

      designerAssets: [],

      compilerAssets: [],
    },

    architecture: {
      narrativeThesis:
        "Creator participation made the campaign measurable.",

      storyStrategy:
        "Lead with the mechanic and prove participation.",

      renderModeRecommendation:
        "flexible",

      chapters: [
        {
          id:
            "results",

          role:
            "results",

          headingDirection:
            "Participation at scale",

          purpose:
            "Show the verified campaign result.",

          evidenceClaimIds: [
            "metric-creators",
          ],

          metricClaimIds: [
            "metric-creators",
          ],

          mediaRole:
            null,

          toneRecommendation:
            "precise",
        },
      ],

      metricsPlan: [
        {
          claimId:
            "metric-creators",

          role:
            "primary-result",

          placement:
            "results",

          scopeNote:
            null,
        },
      ],

      mediaPlan: [],

      continuityPlan:
        null,

      ctaPlan: {
        type:
          "none",

        targetProjectSlug:
          null,

        rationale:
          "No trusted continuation is configured.",
      },

      rationale:
        "Flexible presentation supports the evidence structure.",
    },

    design: {
      renderMode:
        "flexible",

      sections: [
        {
          id:
            "results-metrics",

          chapterId:
            "results",

          blockType:
            "metrics",

          heading:
            "Campaign results",

          items: [
            {
              claimId:
                "metric-creators",

              value:
                "500",

              label:
                "Creators activated",

              note:
                null,
            },
          ],

          evidenceClaimIds: [
            "metric-creators",
          ],
        },
      ],
    },

    compiled: {
      renderMode:
        "flexible",

      cmsSections: [
        {
          blockType:
            "metrics",

          heading:
            "Campaign results",

          items: [
            {
              value:
                "500",

              label:
                "Creators activated",

              note:
                null,
            },
          ],
        },
      ],

      bindings: [
        {
          sectionId:
            "results-metrics",

          chapterId:
            "results",

          blockType:
            "metrics",

          evidenceClaimIds: [
            "metric-creators",
          ],
        },
      ],
    },

    quality: {
      status:
        "pass",

      draftReady:
        true,

      score:
        100,

      issues: [],
    },

    semanticCritic: {
      status:
        "pass",

      draftReady:
        true,

      score:
        100,

      summary:
        "No semantic issues found.",

      findings: [],
    },
  } as unknown as GoldStandardCaseStudyCandidate;
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible Benchmark tests\n",
  );

  const candidate =
    cleanCandidate();

  const before =
    JSON.stringify(
      candidate,
    );

  const result =
    benchmarkFlexibleCandidate(
      candidate,
    );

  /* ── Clean benchmark ───────────────────────────── */

  check(
    "clean Gold Standard candidate scores 100/100",
    result.machineScore ===
      100,
  );

  check(
    "clean Gold Standard candidate receives machine PASS",
    result.machinePassed ===
      true,
  );

  check(
    "benchmark exposes exactly ten objective dimensions",
    result.dimensions.length ===
      10,
  );

  check(
    "benchmark dimension IDs remain canonical",
    JSON.stringify(
      result.dimensions.map(
        (item) =>
          item.id,
      ),
    ) ===
      JSON.stringify(
        FLEXIBLE_BENCHMARK_DIMENSIONS,
      ),
  );

  check(
    "every clean benchmark dimension scores 10/10",
    result.dimensions.every(
      (item) =>
        item.score ===
          10 &&
        item.passed ===
          true,
    ),
  );

  check(
    "human narrative review starts explicitly unscored",
    result
      .humanReview
      .narrativeCraft ===
      null &&
    result
      .humanReview
      .strategicInsight ===
      null &&
    result
      .humanReview
      .visualStorytelling ===
      null &&
    result
      .humanReview
      .differentiation ===
      null,
  );

  check(
    "benchmark summary preserves source counts",
    result
      .summary
      .approvedSources ===
      1 &&
    result
      .summary
      .excludedSources ===
      1,
  );

  check(
    "benchmark summary preserves evidence counts",
    result
      .summary
      .evidenceCandidates ===
      1 &&
    result
      .summary
      .finalClaims ===
      1 &&
    result
      .summary
      .publicationReadyClaims ===
      1,
  );

  check(
    "benchmark summary preserves design counts",
    result
      .summary
      .chapters ===
      1 &&
    result
      .summary
      .designedSections ===
      1 &&
    result
      .summary
      .compiledSections ===
      1,
  );

  check(
    "benchmark summary preserves independent audit scores",
    result
      .summary
      .deterministicQualityScore ===
      100 &&
    result
      .summary
      .semanticCriticScore ===
      100 &&
    result
      .summary
      .reconciliationAuditScore ===
      100,
  );

  /* ── Evidence integrity attack ─────────────────── */

  const unsafeEvidence =
    cleanCandidate();

  unsafeEvidence
    .evidence
    .claims[0]
    .confidence =
    "low";

  const unsafeEvidenceResult =
    benchmarkFlexibleCandidate(
      unsafeEvidence,
    );

  check(
    "published low-confidence evidence reduces evidence score",
    dimensionScore(
      unsafeEvidenceResult,
      "evidence-integrity",
    ) <
      10,
  );

  check(
    "published low-confidence evidence prevents machine PASS",
    unsafeEvidenceResult
      .machinePassed ===
      false,
  );

  /* ── Source boundary attack ────────────────────── */

  const sourceOverlap =
    cleanCandidate();

  sourceOverlap
    .sourceIntake
    .excluded
    .push({
      id:
        "source-report",

      status:
        "rejected",

      reason:
        "Invalid overlap test.",
    });

  const sourceOverlapResult =
    benchmarkFlexibleCandidate(
      sourceOverlap,
    );

  check(
    "approved/excluded source overlap reduces source-integrity score",
    dimensionScore(
      sourceOverlapResult,
      "source-integrity",
    ) <
      10,
  );

  /* ── Reconciliation attack ─────────────────────── */

  const unsafeReconciliation =
    cleanCandidate();

  unsafeReconciliation
    .evidence
    .reconciliationAuditResult =
    {
      status:
        "fail",

      safeToContinue:
        false,

      score:
        82,

      summary:
        "Material conflict remains.",

      findings: [
        {
          id:
            "missed-conflict",

          category:
            "missed-conflict",

          severity:
            "error",

          message:
            "Material conflict remains.",

          claimIds: [
            "metric-creators",
          ],
        },
      ],
    };

  const unsafeReconciliationResult =
    benchmarkFlexibleCandidate(
      unsafeReconciliation,
    );

  check(
    "failed Reconciliation Auditor collapses reconciliation dimension",
    dimensionScore(
      unsafeReconciliationResult,
      "reconciliation-safety",
    ) ===
      0,
  );

  check(
    "failed Reconciliation Auditor prevents machine PASS",
    unsafeReconciliationResult
      .machinePassed ===
      false,
  );

  /* ── Portfolio attack ──────────────────────────── */

  const missingPortfolio =
    cleanCandidate();

  (
    missingPortfolio
      .portfolio as any
  ).relationships =
    null;

  const missingPortfolioResult =
    benchmarkFlexibleCandidate(
      missingPortfolio,
    );

  check(
    "missing validated portfolio relationships reduces portfolio score",
    dimensionScore(
      missingPortfolioResult,
      "portfolio-integrity",
    ) <
      10,
  );

  /* ── Architecture attacks ──────────────────────── */

  const emptyArchitecture =
    cleanCandidate();

  emptyArchitecture
    .architecture
    .chapters =
    [];

  const emptyArchitectureResult =
    benchmarkFlexibleCandidate(
      emptyArchitecture,
    );

  check(
    "empty story architecture reduces architecture score",
    dimensionScore(
      emptyArchitectureResult,
      "architecture-coverage",
    ) <
      10,
  );

  const droppedChapter =
    cleanCandidate();

  droppedChapter
    .architecture
    .chapters
    .push(
      clone(
        droppedChapter
          .architecture
          .chapters[0],
      ),
    );

  droppedChapter
    .architecture
    .chapters[1]
    .id =
    "learning";

  const droppedChapterResult =
    benchmarkFlexibleCandidate(
      droppedChapter,
    );

  check(
    "Designer section coverage smaller than Architect chapter plan is detected",
    dimensionScore(
      droppedChapterResult,
      "architecture-coverage",
    ) <
      10,
  );

  /* ── Metric attacks ────────────────────────────── */

  const unboundMetric =
    cleanCandidate();

  unboundMetric
    .compiled
    .bindings[0]
    .evidenceClaimIds =
    [];

  const unboundMetricResult =
    benchmarkFlexibleCandidate(
      unboundMetric,
    );

  check(
    "planned metric absent from compiled bindings reduces metric score",
    dimensionScore(
      unboundMetricResult,
      "metric-utilisation",
    ) <
      10,
  );

  const unsafeMetric =
    cleanCandidate();

  unsafeMetric
    .evidence
    .claims[0]
    .publishable =
    false;

  const unsafeMetricResult =
    benchmarkFlexibleCandidate(
      unsafeMetric,
    );

  check(
    "metric plan referencing non-publication-ready evidence is detected",
    dimensionScore(
      unsafeMetricResult,
      "metric-utilisation",
    ) <
      10,
  );

  /* ── Media attacks ─────────────────────────────── */

  const unusedMedia =
    cleanCandidate();

  (
    unusedMedia
      .media
      .assets as any[]
  ).push({
    id:
      "asset-hero",
  });

  (
    unusedMedia
      .media
      .designerAssets as any[]
  ).push({
    id:
      "asset-hero",

    title:
      "Hero",
  });

  (
    unusedMedia
      .media
      .compilerAssets as any[]
  ).push({
    id:
      "asset-hero",

    legacySrc:
      "/assets/test/hero.jpg",
  });

  const unusedMediaResult =
    benchmarkFlexibleCandidate(
      unusedMedia,
    );

  check(
    "trusted media that is never used reduces media score",
    dimensionScore(
      unusedMediaResult,
      "media-utilisation",
    ) <
      10,
  );

  const mismatchedMedia =
    clone(
      unusedMedia,
    );

  mismatchedMedia
    .media
    .compilerAssets =
    [];

  const mismatchedMediaResult =
    benchmarkFlexibleCandidate(
      mismatchedMedia,
    );

  check(
    "mismatched Designer/Compiler media projections are detected",
    dimensionScore(
      mismatchedMediaResult,
      "media-utilisation",
    ) ===
      0,
  );

  /* ── CMS attacks ───────────────────────────────── */

  const cmsLeak =
    cleanCandidate();

  (
    cmsLeak
      .compiled
      .cmsSections[0] as any
  ).claimId =
    "metric-creators";

  const cmsLeakResult =
    benchmarkFlexibleCandidate(
      cmsLeak,
    );

  check(
    "internal claim ID leaking into CMS reduces CMS integrity score",
    dimensionScore(
      cmsLeakResult,
      "cms-integrity",
    ) <
      10,
  );

  const missingBindings =
    cleanCandidate();

  missingBindings
    .compiled
    .bindings =
    [];

  const missingBindingsResult =
    benchmarkFlexibleCandidate(
      missingBindings,
    );

  check(
    "missing internal compiler evidence bindings are detected",
    dimensionScore(
      missingBindingsResult,
      "cms-integrity",
    ) <
      10,
  );

  /* ── Deterministic quality attacks ─────────────── */

  const failedQuality =
    cleanCandidate();

  failedQuality
    .quality
    .draftReady =
    false;

  failedQuality
    .quality
    .status =
    "fail";

  const failedQualityResult =
    benchmarkFlexibleCandidate(
      failedQuality,
    );

  check(
    "deterministic quality failure reduces quality dimension",
    dimensionScore(
      failedQualityResult,
      "deterministic-quality",
    ) <
      10,
  );

  const weakQuality =
    cleanCandidate();

  weakQuality
    .quality
    .score =
    88;

  const weakQualityResult =
    benchmarkFlexibleCandidate(
      weakQuality,
    );

  check(
    "deterministic quality score below 90 prevents perfect benchmark",
    dimensionScore(
      weakQualityResult,
      "deterministic-quality",
    ) <
      10,
  );

  /* ── Semantic Critic attacks ───────────────────── */

  const criticFailure =
    cleanCandidate();

  criticFailure
    .semanticCritic =
    {
      status:
        "fail",

      draftReady:
        false,

      score:
        82,

      summary:
        "Evidence overreach detected.",

      findings: [
        {
          id:
            "overreach",

          category:
            "evidence-overreach",

          severity:
            "error",

          message:
            "Story exceeds evidence.",

          sectionIds: [
            "results-metrics",
          ],

          claimIds: [
            "metric-creators",
          ],
        },
      ],
    };

  const criticFailureResult =
    benchmarkFlexibleCandidate(
      criticFailure,
    );

  check(
    "Semantic Critic error reduces semantic-review dimension",
    dimensionScore(
      criticFailureResult,
      "semantic-review",
    ) <
      10,
  );

  check(
    "Semantic Critic error prevents machine PASS",
    criticFailureResult
      .machinePassed ===
      false,
  );

  const criticWarning =
    cleanCandidate();

  criticWarning
    .semanticCritic
    .status =
    "partial";

  criticWarning
    .semanticCritic
    .score =
    88;

  criticWarning
    .semanticCritic
    .findings =
    [
      {
        id:
          "repetition-warning",

        category:
          "repetition",

        severity:
          "warning",

        message:
          "Minor repetition.",

        sectionIds: [
          "results-metrics",
        ],

        claimIds: [],
      },
    ];

  const criticWarningResult =
    benchmarkFlexibleCandidate(
      criticWarning,
    );

  check(
    "Semantic Critic warning below 90 is visible in machine score",
    dimensionScore(
      criticWarningResult,
      "semantic-review",
    ) <
      10,
  );

  check(
    "non-perfect semantic dimension prevents machine PASS",
    criticWarningResult
      .machinePassed ===
      false,
  );

  /* ── Determinism / human boundary ──────────────── */

  const repeat =
    benchmarkFlexibleCandidate(
      cleanCandidate(),
    );

  check(
    "benchmark machine scoring is deterministic",
    repeat.machineScore ===
      result.machineScore &&
    JSON.stringify(
      repeat.dimensions,
    ) ===
      JSON.stringify(
        result.dimensions,
      ),
  );

  result
    .humanReview
    .narrativeCraft =
    1;

  result
    .humanReview
    .strategicInsight =
    10;

  check(
    "human review values do not rewrite machine score",
    result.machineScore ===
      100 &&
    result.machinePassed ===
      true,
  );

  check(
    "Flexible Benchmark does not mutate candidate",
    JSON.stringify(
      candidate,
    ) ===
      before,
  );

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(
    fail === 0
      ? 0
      : 1,
  );
}

main();
