/**
 * GOLD STANDARD CASE STUDY AGENT
 * FLEXIBLE REVIEW PACKAGE TESTS
 *
 * Pure tests only:
 * - no AI
 * - no CMS
 * - no database
 * - no network
 */

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

import {
  buildFlexibleReviewPackage,
  hashFlexibleCandidate,
  validateFlexibleReviewPackage,
} from "./flexibleReviewPackage";

/* ── Helpers ──────────────────────────────────────── */

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

function expectReject(
  name: string,
  fn: () => unknown,
  includes: string,
) {
  try {
    fn();

    console.log(`  ✗ ${name}`);
    fail++;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    if (
      message.includes(
        includes,
      )
    ) {
      console.log(`  ✓ ${name}`);
      pass++;
    } else {
      console.log(
        `  ✗ ${name} — unexpected error: ${message}`,
      );
      fail++;
    }
  }
}

/**
 * Rebuild an object with reversed key insertion order.
 * Arrays intentionally retain their order.
 */
function reverseObjectKeys(
  value: unknown,
): unknown {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value.map(
      (
        item,
      ) =>
        reverseObjectKeys(
          item,
        ),
    );
  }

  if (
    value !==
      null &&
    typeof value ===
      "object"
  ) {
    const record =
      value as
        Record<
          string,
          unknown
        >;

    const output:
      Record<
        string,
        unknown
      > = {};

    for (
      const key of
      Object.keys(
        record,
      ).reverse()
    ) {
      output[key] =
        reverseObjectKeys(
          record[key],
        );
    }

    return output;
  }

  return value;
}

/* ── Known-good 100/100 benchmark candidate ───────── */

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
  } as unknown as
    GoldStandardCaseStudyCandidate;
}

/* ── Tests ────────────────────────────────────────── */

function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible Review Package tests\n",
  );

  const candidate =
    cleanCandidate();

  const before =
    JSON.stringify(
      candidate,
    );

  /* 1. Deterministic SHA-256 */

  const hash1 =
    hashFlexibleCandidate(
      candidate,
    );

  const hash2 =
    hashFlexibleCandidate(
      clone(
        candidate,
      ),
    );

  check(
    "candidate hash is a SHA-256 hex digest",
    /^[a-f0-9]{64}$/.test(
      hash1,
    ),
  );

  check(
    "same candidate produces deterministic hash",
    hash1 ===
      hash2,
  );

  /* 2. Object property order must not affect hash */

  const reordered =
    reverseObjectKeys(
      candidate,
    ) as
      GoldStandardCaseStudyCandidate;

  check(
    "object property insertion order does not affect fingerprint",
    hashFlexibleCandidate(
      reordered,
    ) ===
      hash1,
  );

  /* 3. Material candidate mutation changes fingerprint */

  const changed =
    clone(
      candidate,
    );

  changed
    .portfolio
    .projectHint
    .title =
    "Changed Campaign";

  check(
    "material candidate change produces different fingerprint",
    hashFlexibleCandidate(
      changed,
    ) !==
      hash1,
  );

  /* 4. Build review package */

  const pkg =
    buildFlexibleReviewPackage(
      candidate,
    );

  check(
    "review package uses formatVersion 1",
    pkg.formatVersion ===
      1,
  );

  check(
    "review package stores exact candidate fingerprint",
    pkg.candidateHash ===
      hash1,
  );

  check(
    "review package contains detached candidate copy",
    pkg.candidate !==
      candidate &&
    JSON.stringify(
      pkg.candidate,
    ) ===
      JSON.stringify(
        candidate,
      ),
  );

  check(
    "review package attaches deterministic benchmark",
    pkg.benchmark
      .machineScore ===
      100 &&
    pkg.benchmark
      .machinePassed ===
      true,
  );

  check(
    "benchmark retains ten objective dimensions",
    pkg.benchmark
      .dimensions
      .length ===
      10,
  );

  check(
    "building review package does not mutate original candidate",
    JSON.stringify(
      candidate,
    ) ===
      before,
  );

  /* 5. Original mutation cannot mutate frozen review candidate */

  candidate
    .portfolio
    .projectHint
    .title =
    "Caller Mutated Later";

  check(
    "later caller mutation does not change review-package candidate",
    pkg.candidate
      .portfolio
      .projectHint
      .title ===
      "Sample Campaign",
  );

  /* 6. Valid round trip */

  const diskRoundTrip =
    JSON.parse(
      JSON.stringify(
        pkg,
      ),
    );

  const validated =
    validateFlexibleReviewPackage(
      diskRoundTrip,
    );

  check(
    "valid serialized review package passes verification",
    validated
      .candidateHash ===
      pkg.candidateHash,
  );

  /* 7. Tampered candidate */

  const tamperedCandidate =
    clone(
      pkg,
    );

  tamperedCandidate
    .candidate
    .portfolio
    .projectHint
    .title =
    "Tampered Campaign";

  expectReject(
    "tampered candidate is rejected",
    () =>
      validateFlexibleReviewPackage(
        tamperedCandidate,
      ),
    "fingerprint mismatch",
  );

  /* 8. Wrong but syntactically valid hash */

  const tamperedHash =
    clone(
      pkg,
    );

  tamperedHash.candidateHash =
    "0".repeat(
      64,
    );

  expectReject(
    "incorrect candidate hash is rejected",
    () =>
      validateFlexibleReviewPackage(
        tamperedHash,
      ),
    "fingerprint mismatch",
  );

  /* 9. Malformed hash */

  const malformedHash =
    clone(
      pkg,
    );

  malformedHash.candidateHash =
    "not-a-sha256";

  expectReject(
    "malformed candidate hash is rejected",
    () =>
      validateFlexibleReviewPackage(
        malformedHash,
      ),
    "invalid candidateHash",
  );

  /* 10. Tampered benchmark */

  const tamperedBenchmark =
    clone(
      pkg,
    );

  tamperedBenchmark
    .benchmark
    .machineScore =
    99;

  expectReject(
    "tampered benchmark is rejected",
    () =>
      validateFlexibleReviewPackage(
        tamperedBenchmark,
      ),
    "benchmark mismatch",
  );

  /* 11. Unsupported format version */

  const wrongVersion =
    clone(
      pkg,
    ) as any;

  wrongVersion
    .formatVersion =
    2;

  expectReject(
    "unsupported review-package version is rejected",
    () =>
      validateFlexibleReviewPackage(
        wrongVersion,
      ),
    "unsupported formatVersion",
  );

  /* 12. Missing candidate */

  const missingCandidate =
    clone(
      pkg,
    ) as any;

  delete missingCandidate
    .candidate;

  expectReject(
    "missing candidate is rejected",
    () =>
      validateFlexibleReviewPackage(
        missingCandidate,
      ),
    "missing candidate",
  );

  /* 13. Missing benchmark */

  const missingBenchmark =
    clone(
      pkg,
    ) as any;

  delete missingBenchmark
    .benchmark;

  expectReject(
    "missing benchmark is rejected",
    () =>
      validateFlexibleReviewPackage(
        missingBenchmark,
      ),
    "missing benchmark",
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
