/**
 * GOLD STANDARD CASE STUDY AGENT — SEMANTIC VERIFIER TESTS
 *
 * No network.
 * No Payload.
 * No database.
 *
 * Tests:
 * - supported
 * - partial
 * - unsupported
 * - malformed verifier output
 * - missing / duplicate / unknown claim IDs
 * - unsupportedElements invariants
 * - invalid input claims
 */

import {
  verifyClaims,
} from "./verifier";

import type {
  VerifiableClaim,
} from "./verifier";

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

function fakeClient(
  outputText: string | undefined,
) {
  return {
    responses: {
      create: async () => ({
        output_text:
          outputText,
      }),
    },
  } as never;
}

const CLAIMS:
  VerifiableClaim[] = [
    {
      id: "claim-supported",
      type: "metric",
      statement:
        "The campaign activated 500 creators.",
      support: [
        {
          sourceId:
            "source-report",
          excerpt:
            "The campaign activated 500 creators.",
        },
      ],
    },

    {
      id: "claim-partial",
      type: "narrative",
      statement:
        "The campaign activated 500 creators and generated strong long-term loyalty.",
      support: [
        {
          sourceId:
            "source-report",
          excerpt:
            "The campaign activated 500 creators.",
        },
      ],
    },

    {
      id: "claim-unsupported",
      type: "fact",
      statement:
        "The campaign increased sales by 25%.",
      support: [
        {
          sourceId:
            "source-report",
          excerpt:
            "The campaign activated 500 creators.",
        },
      ],
    },
  ];

async function main() {
  console.log(
    "Gold Standard Case Study Agent — semantic verifier tests\n",
  );

  /* ── 1. Valid mixed verdict batch ─────────────────────────────── */

  const valid =
    await verifyClaims(
      CLAIMS,
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-supported",
                  verdict:
                    "supported",
                  reason:
                    "The excerpt directly states the full claim.",
                  unsupportedElements:
                    [],
                },

                {
                  claimId:
                    "claim-partial",
                  verdict:
                    "partial",
                  reason:
                    "The excerpt supports the creator count but not long-term loyalty.",
                  unsupportedElements:
                    [
                      "generated strong long-term loyalty",
                    ],
                },

                {
                  claimId:
                    "claim-unsupported",
                  verdict:
                    "unsupported",
                  reason:
                    "The excerpt contains no sales evidence.",
                  unsupportedElements:
                    [
                      "increased sales by 25%",
                    ],
                },
              ],
            }),
          ),
      },
    );

  check(
    "valid verifier batch returns all results",
    valid.results.length === 3,
  );

  check(
    "supported verdict survives",
    valid.results.find(
      (result) =>
        result.claimId ===
        "claim-supported",
    )?.verdict === "supported",
  );

  check(
    "partial verdict survives",
    valid.results.find(
      (result) =>
        result.claimId ===
        "claim-partial",
    )?.verdict === "partial",
  );

  check(
    "unsupported verdict survives",
    valid.results.find(
      (result) =>
        result.claimId ===
        "claim-unsupported",
    )?.verdict === "unsupported",
  );

  check(
    "partial result preserves unsupported elements",
    valid.results.find(
      (result) =>
        result.claimId ===
        "claim-partial",
    )?.unsupportedElements.includes(
      "generated strong long-term loyalty",
    ) === true,
  );

  /* ── 2. Unknown claim ID ──────────────────────────────────────── */

  let unknownRejected = false;

  try {
    await verifyClaims(
      [CLAIMS[0]],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "model-invented-claim",
                  verdict:
                    "supported",
                  reason:
                    "Invented.",
                  unsupportedElements:
                    [],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    unknownRejected =
      error instanceof Error &&
      error.message.includes(
        "unknown claimId",
      );
  }

  check(
    "unknown verifier claim ID is rejected",
    unknownRejected,
  );

  /* ── 3. Missing expected claim ───────────────────────────────── */

  let missingRejected = false;

  try {
    await verifyClaims(
      CLAIMS.slice(0, 2),
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-supported",
                  verdict:
                    "supported",
                  reason:
                    "Supported.",
                  unsupportedElements:
                    [],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    missingRejected =
      error instanceof Error &&
      error.message.includes(
        "omitted claim",
      );
  }

  check(
    "omitted verifier claim is rejected",
    missingRejected,
  );

  /* ── 4. Duplicate claim ID ───────────────────────────────────── */

  let duplicateRejected = false;

  try {
    await verifyClaims(
      [CLAIMS[0]],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-supported",
                  verdict:
                    "supported",
                  reason:
                    "Supported.",
                  unsupportedElements:
                    [],
                },
                {
                  claimId:
                    "claim-supported",
                  verdict:
                    "supported",
                  reason:
                    "Duplicate.",
                  unsupportedElements:
                    [],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    duplicateRejected =
      error instanceof Error &&
      error.message.includes(
        "duplicate claimId",
      );
  }

  check(
    "duplicate verifier claim ID is rejected",
    duplicateRejected,
  );

  /* ── 5. Supported cannot have unsupported elements ───────────── */

  let supportedElementsRejected =
    false;

  try {
    await verifyClaims(
      [CLAIMS[0]],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-supported",
                  verdict:
                    "supported",
                  reason:
                    "Contradictory result.",
                  unsupportedElements:
                    [
                      "something missing",
                    ],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    supportedElementsRejected =
      error instanceof Error &&
      error.message.includes(
        "cannot contain unsupportedElements",
      );
  }

  check(
    "supported claim cannot list unsupported elements",
    supportedElementsRejected,
  );

  /* ── 6. Partial must identify unsupported elements ───────────── */

  let partialWithoutElementsRejected =
    false;

  try {
    await verifyClaims(
      [CLAIMS[1]],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-partial",
                  verdict:
                    "partial",
                  reason:
                    "Only partly supported.",
                  unsupportedElements:
                    [],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    partialWithoutElementsRejected =
      error instanceof Error &&
      error.message.includes(
        "must identify unsupportedElements",
      );
  }

  check(
    "partial claim must identify unsupported elements",
    partialWithoutElementsRejected,
  );

  /* ── 7. Unsupported must identify unsupported elements ───────── */

  let unsupportedWithoutElementsRejected =
    false;

  try {
    await verifyClaims(
      [CLAIMS[2]],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-unsupported",
                  verdict:
                    "unsupported",
                  reason:
                    "Unsupported.",
                  unsupportedElements:
                    [],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    unsupportedWithoutElementsRejected =
      error instanceof Error &&
      error.message.includes(
        "must identify unsupportedElements",
      );
  }

  check(
    "unsupported claim must identify unsupported elements",
    unsupportedWithoutElementsRejected,
  );

  /* ── 8. Invalid verdict ───────────────────────────────────────── */

  let invalidVerdictRejected = false;

  try {
    await verifyClaims(
      [CLAIMS[0]],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-supported",
                  verdict:
                    "probably",
                  reason:
                    "Bad enum.",
                  unsupportedElements:
                    [],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    invalidVerdictRejected =
      error instanceof Error &&
      error.message.includes(
        "invalid verdict",
      );
  }

  check(
    "invalid verifier verdict is rejected",
    invalidVerdictRejected,
  );

  /* ── 9. Empty reason ──────────────────────────────────────────── */

  let emptyReasonRejected = false;

  try {
    await verifyClaims(
      [CLAIMS[0]],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [
                {
                  claimId:
                    "claim-supported",
                  verdict:
                    "supported",
                  reason:
                    "",
                  unsupportedElements:
                    [],
                },
              ],
            }),
          ),
      },
    );
  } catch (error) {
    emptyReasonRejected =
      error instanceof Error &&
      error.message.includes(
        "no reason",
      );
  }

  check(
    "empty verifier reason is rejected",
    emptyReasonRejected,
  );

  /* ── 10. Invalid JSON ─────────────────────────────────────────── */

  let invalidJsonRejected = false;

  try {
    await verifyClaims(
      [CLAIMS[0]],
      {
        client:
          fakeClient(
            "{ definitely not json",
          ),
      },
    );
  } catch (error) {
    invalidJsonRejected =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "invalid verifier JSON is rejected",
    invalidJsonRejected,
  );

  /* ── 11. No output ───────────────────────────────────────────── */

  let noOutputRejected = false;

  try {
    await verifyClaims(
      [CLAIMS[0]],
      {
        client:
          fakeClient(
            undefined,
          ),
      },
    );
  } catch (error) {
    noOutputRejected =
      error instanceof Error &&
      error.message.includes(
        "no structured output",
      );
  }

  check(
    "missing verifier output is rejected",
    noOutputRejected,
  );

  /* ── 12. Input without support ───────────────────────────────── */

  let noSupportRejected = false;

  try {
    await verifyClaims(
      [
        {
          id:
            "claim-no-support",
          type:
            "fact",
          statement:
            "Unsupported input.",
          support:
            [],
        },
      ],
      {
        client:
          fakeClient(
            JSON.stringify({
              results: [],
            }),
          ),
      },
    );
  } catch (error) {
    noSupportRejected =
      error instanceof Error &&
      error.message.includes(
        "has no support excerpts",
      );
  }

  check(
    "claim without support is rejected before model call",
    noSupportRejected,
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
