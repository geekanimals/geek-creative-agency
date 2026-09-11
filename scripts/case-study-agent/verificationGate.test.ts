/**
 * GOLD STANDARD CASE STUDY AGENT — SEMANTIC VERIFICATION GATE TESTS
 *
 * Pure tests.
 *
 * No OpenAI.
 * No Payload.
 * No database.
 */

import {
  runSemanticVerificationGate,
  assertSemanticVerification,
} from "./verificationGate";

import type {
  EvidenceClaim,
} from "./types";

import type {
  ClaimVerificationBatch,
} from "./verificationSchema";

let passed = 0;
let failed = 0;

function check(
  name: string,
  condition: boolean,
) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    failed++;
  }
}

const CLAIMS: EvidenceClaim[] = [
  {
    id: "claim-supported",
    type: "fact",
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
    confidence: "high",
    publishable: true,
  },

  {
    id: "claim-partial",
    type: "narrative",
    statement:
      "The campaign activated 500 creators and created long-term loyalty.",
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
    confidence: "high",
    publishable: true,
  },

  {
    id: "claim-unsupported",
    type: "fact",
    statement:
      "The campaign increased sales by 25%.",
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
    confidence: "high",
    publishable: true,
  },

  {
    id: "claim-internal-only",
    type: "fact",
    statement:
      "An internal hypothesis that is not publication-ready.",
    sourceIds: [
      "source-report",
    ],
    support: [],
    confidence: "low",
    publishable: false,
  },
];

async function main() {
  console.log(
    "Gold Standard Case Study Agent — semantic verification gate tests\n",
  );

  /* ── 1. Fully supported public claims pass ─────────────────────── */

  const supportedOnlyClaims =
    [
      CLAIMS[0],
    ];

  const supportedBatch:
    ClaimVerificationBatch = {
      results: [
        {
          claimId:
            "claim-supported",
          verdict:
            "supported",
          reason:
            "The excerpt directly supports the full claim.",
          unsupportedElements:
            [],
        },
      ],
    };

  const supportedResult =
    runSemanticVerificationGate(
      supportedOnlyClaims,
      supportedBatch,
    );

  check(
    "fully supported publishable claim passes",
    supportedResult.pass === true,
  );

  check(
    "fully supported claim creates no gate issues",
    supportedResult.issues.length === 0,
  );

  /* ── 2. Partial public claim fails ─────────────────────────────── */

  const partialBatch:
    ClaimVerificationBatch = {
      results: [
        {
          claimId:
            "claim-partial",
          verdict:
            "partial",
          reason:
            "Creator activation is supported, but long-term loyalty is not.",
          unsupportedElements: [
            "created long-term loyalty",
          ],
        },
      ],
    };

  const partialResult =
    runSemanticVerificationGate(
      [
        CLAIMS[1],
      ],
      partialBatch,
    );

  check(
    "partial publishable claim fails closed",
    partialResult.pass === false,
  );

  check(
    "partial claim is surfaced as an issue",
    partialResult.issues.some(
      (issue) =>
        issue.claimId ===
          "claim-partial" &&
        issue.verdict ===
          "partial",
    ),
  );

  check(
    "partial claim preserves unsupported elements",
    partialResult.issues[0]
      ?.unsupportedElements
      .includes(
        "created long-term loyalty",
      ) === true,
  );

  /* ── 3. Unsupported public claim fails ────────────────────────── */

  const unsupportedBatch:
    ClaimVerificationBatch = {
      results: [
        {
          claimId:
            "claim-unsupported",
          verdict:
            "unsupported",
          reason:
            "The supplied excerpt contains no sales evidence.",
          unsupportedElements: [
            "increased sales by 25%",
          ],
        },
      ],
    };

  const unsupportedResult =
    runSemanticVerificationGate(
      [
        CLAIMS[2],
      ],
      unsupportedBatch,
    );

  check(
    "unsupported publishable claim fails closed",
    unsupportedResult.pass === false,
  );

  check(
    "unsupported claim is surfaced",
    unsupportedResult.issues.some(
      (issue) =>
        issue.claimId ===
          "claim-unsupported" &&
        issue.verdict ===
          "unsupported",
    ),
  );

  /* ── 4. Non-publishable claims do not block generation ───────── */

  const internalBatch:
    ClaimVerificationBatch = {
      results: [
        {
          claimId:
            "claim-internal-only",
          verdict:
            "unsupported",
          reason:
            "The hypothesis is not established.",
          unsupportedElements: [
            "internal hypothesis",
          ],
        },
      ],
    };

  const internalResult =
    runSemanticVerificationGate(
      [
        CLAIMS[3],
      ],
      internalBatch,
    );

  check(
    "unsupported non-publishable claim does not block generation",
    internalResult.pass === true,
  );

  check(
    "unsupported internal-only claim creates no public gate issue",
    internalResult.issues.length === 0,
  );

  /* ── 5. Missing verification result fails closed ──────────────── */

  const missingResult =
    runSemanticVerificationGate(
      [
        CLAIMS[0],
      ],
      {
        results: [],
      },
    );

  check(
    "publishable claim with no verifier result fails closed",
    missingResult.pass === false,
  );

  check(
    "missing verifier result becomes unsupported issue",
    missingResult.issues.some(
      (issue) =>
        issue.claimId ===
          "claim-supported" &&
        issue.verdict ===
          "unsupported",
    ),
  );

  /* ── 6. Mixed batch fails when any public claim fails ─────────── */

  const mixedBatch:
    ClaimVerificationBatch = {
      results: [
        {
          claimId:
            "claim-supported",
          verdict:
            "supported",
          reason:
            "Fully supported.",
          unsupportedElements:
            [],
        },

        {
          claimId:
            "claim-partial",
          verdict:
            "partial",
          reason:
            "Loyalty is not supported.",
          unsupportedElements: [
            "created long-term loyalty",
          ],
        },

        {
          claimId:
            "claim-unsupported",
          verdict:
            "unsupported",
          reason:
            "No sales evidence.",
          unsupportedElements: [
            "increased sales by 25%",
          ],
        },
      ],
    };

  const mixedResult =
    runSemanticVerificationGate(
      CLAIMS.slice(0, 3),
      mixedBatch,
    );

  check(
    "mixed public batch fails when any claim is not fully supported",
    mixedResult.pass === false,
  );

  check(
    "mixed batch surfaces both failing claims",
    mixedResult.issues.length === 2,
  );

  /* ── 7. assertSemanticVerification allows valid batch ─────────── */

  let supportedAssertionPassed =
    true;

  try {
    assertSemanticVerification(
      supportedOnlyClaims,
      supportedBatch,
    );
  } catch {
    supportedAssertionPassed =
      false;
  }

  check(
    "assertSemanticVerification allows fully supported claims",
    supportedAssertionPassed,
  );

  /* ── 8. assertSemanticVerification throws on partial claim ────── */

  let partialAssertionRejected =
    false;

  try {
    assertSemanticVerification(
      [
        CLAIMS[1],
      ],
      partialBatch,
    );
  } catch (error) {
    partialAssertionRejected =
      error instanceof Error &&
      error.message.includes(
        "Semantic evidence verification refused generation",
      ) &&
      error.message.includes(
        "claim-partial",
      ) &&
      error.message.includes(
        "created long-term loyalty",
      );
  }

  check(
    "assertSemanticVerification rejects partial public claim",
    partialAssertionRejected,
  );

  /* ── 9. assertSemanticVerification throws on unsupported claim ── */

  let unsupportedAssertionRejected =
    false;

  try {
    assertSemanticVerification(
      [
        CLAIMS[2],
      ],
      unsupportedBatch,
    );
  } catch (error) {
    unsupportedAssertionRejected =
      error instanceof Error &&
      error.message.includes(
        "claim-unsupported",
      ) &&
      error.message.includes(
        "unsupported",
      );
  }

  check(
    "assertSemanticVerification rejects unsupported public claim",
    unsupportedAssertionRejected,
  );

  /* ── Result ───────────────────────────────────────────────────── */

  console.log(
    `\n${failed === 0 ? "PASS" : "FAIL"} — ${passed} passed, ${failed} failed`,
  );

  process.exit(
    failed === 0 ? 0 : 1,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
