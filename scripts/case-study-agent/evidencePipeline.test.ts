/**
 * GOLD STANDARD CASE STUDY AGENT — EVIDENCE PIPELINE TESTS
 *
 * No real OpenAI calls.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves:
 *
 * trusted sources
 *   → Extractor
 *   → Verifier
 *   → Reconciler
 *   → EvidenceClaim ledger
 *
 * Also proves fail-closed sequencing and zero-claim fast path.
 */

import {
  buildEvidenceLedger,
} from "./evidencePipeline";

import type {
  BuildEvidenceLedgerRequest,
} from "./evidencePipeline";

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

type CallTracker = {
  order: string[];
  models: Record<string, string | undefined>;
};

function fakeClient(
  stage: string,
  outputText: string | undefined,
  tracker: CallTracker,
) {
  return {
    responses: {
      create: async (
        input: {
          model?: string;
        },
      ) => {
        tracker.order.push(
          stage,
        );

        tracker.models[stage] =
          input.model;

        return {
          output_text:
            outputText,
        };
      },
    },
  } as never;
}

const REQUEST: BuildEvidenceLedgerRequest = {
  sources: [
    {
      id:
        "geek-report",

      kind:
        "internal-document",

      title:
        "Geek campaign report",

      content:
        [
          "Geek tracked 1,058 creators activated.",
          "The historical value comparison was approximately ₹1.44Cr and was not audited ROI.",
        ].join("\n"),
    },

    {
      id:
        "wider-report",

      kind:
        "independent-editorial",

      title:
        "Wider campaign coverage",

      content:
        "The wider campaign generated 8M+ organic reach.",
    },
  ],

  extractorModel:
    "extractor-test-model",

  verifierModel:
    "verifier-test-model",

  reconcilerModel:
    "reconciler-test-model",

  reconciliationAuditorModel:
    "reconciliation-auditor-test-model",
};

const EXTRACTION_OUTPUT = {
  claims: [
    {
      id:
        "metric-creators",

      type:
        "metric",

      statement:
        "Geek tracked 1,058 creators activated.",

      sourceIds: [
        "geek-report",
      ],

      support: [
        {
          sourceId:
            "geek-report",

          excerpt:
            "Geek tracked 1,058 creators activated.",
        },
      ],
    },

    {
      id:
        "metric-wider-reach",

      type:
        "metric",

      statement:
        "The wider campaign generated 8M+ organic reach.",

      sourceIds: [
        "wider-report",
      ],

      support: [
        {
          sourceId:
            "wider-report",

          excerpt:
            "The wider campaign generated 8M+ organic reach.",
        },
      ],
    },

    {
      id:
        "claim-audited-roi",

      type:
        "metric",

      statement:
        "The campaign generated ₹1.44Cr audited ROI.",

      sourceIds: [
        "geek-report",
      ],

      support: [
        {
          sourceId:
            "geek-report",

          excerpt:
            "The historical value comparison was approximately ₹1.44Cr and was not audited ROI.",
        },
      ],
    },
  ],
};

const VERIFICATION_OUTPUT = {
  results: [
    {
      claimId:
        "metric-creators",

      verdict:
        "supported",

      reason:
        "The excerpt directly supports the activation figure.",

      unsupportedElements: [],
    },

    {
      claimId:
        "metric-wider-reach",

      verdict:
        "supported",

      reason:
        "The excerpt directly supports wider-campaign organic reach.",

      unsupportedElements: [],
    },

    {
      claimId:
        "claim-audited-roi",

      verdict:
        "unsupported",

      reason:
        "The source explicitly says the comparison was not audited ROI.",

      unsupportedElements: [
        "audited ROI",
      ],
    },
  ],
};

const RECONCILIATION_OUTPUT = {
  decisions: [
    {
      claimId:
        "metric-creators",

      decision:
        "publish",

      confidence:
        "high",

      conflictDisposition:
        "none",

      conflictGroupId:
        null,

      reason:
        "The exact Geek activation claim is fully supported and clearly scoped.",
    },

    {
      claimId:
        "metric-wider-reach",

      decision:
        "publish",

      confidence:
        "high",

      conflictDisposition:
        "none",

      conflictGroupId:
        null,

      reason:
        "The wider-campaign claim is fully supported and explicitly scoped.",
    },

    /**
     * Deliberately malicious / incorrect recommendation.
     *
     * Reconciler application code must still force this
     * unsupported claim to non-public + low confidence.
     */
    {
      claimId:
        "claim-audited-roi",

      decision:
        "publish",

      confidence:
        "high",

      conflictDisposition:
        "none",

      conflictGroupId:
        null,

      reason:
        "Attempted unsafe publication recommendation.",
    },
  ],
};

const RECONCILIATION_AUDITOR_OUTPUT = {
  summary:
    "The reconciled ledger is safe. Deterministic enforcement correctly withheld the unsupported ROI claim.",

  findings: [],
};

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Evidence Pipeline tests\n",
  );

  const requestBefore =
    JSON.stringify(
      REQUEST,
    );

  /* ── Successful complete pipeline ───────────────── */

  const tracker: CallTracker = {
    order: [],
    models: {},
  };

  const result =
    await buildEvidenceLedger(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            tracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            tracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            tracker,
          ),

        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify(
              RECONCILIATION_AUDITOR_OUTPUT,
            ),
            tracker,
          ),
      },
    );

  check(
    "complete evidence pipeline succeeds",
    result.claims.length ===
      3,
  );

  check(
    "pipeline executes Extractor → Verifier → Reconciler → Auditor in order",
    JSON.stringify(
      tracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
      ]),
  );

  check(
    "extractor model is routed correctly",
    tracker.models.extractor ===
      "extractor-test-model",
  );

  check(
    "verifier model is routed correctly",
    tracker.models.verifier ===
      "verifier-test-model",
  );

  check(
    "reconciler model is routed correctly",
    tracker.models.reconciler ===
      "reconciler-test-model",
  );

  check(
    "reconciliation Auditor model is routed correctly",
    tracker.models.auditor ===
      "reconciliation-auditor-test-model",
  );

  /* ── Candidate preservation ─────────────────────── */

  check(
    "pipeline exposes extracted candidate ledger",
    result.candidates.length ===
      3,
  );

  check(
    "candidate verbatim evidence survives pipeline",
    result.candidates[0]
      .support[0]
      .excerpt ===
      "Geek tracked 1,058 creators activated.",
  );

  /* ── Verification preservation ──────────────────── */

  check(
    "pipeline exposes independent verification results",
    result.verification
      .results.length ===
      3,
  );

  check(
    "unsupported verifier verdict survives pipeline",
    result.verification
      .results.find(
        (item) =>
          item.claimId ===
          "claim-audited-roi",
      )?.verdict ===
      "unsupported",
  );

  /* ── Final reconciled ledger ────────────────────── */

  const creators =
    result.claims.find(
      (claim) =>
        claim.id ===
        "metric-creators",
    );

  check(
    "supported reconciled claim becomes publishable",
    creators?.publishable ===
      true &&
      creators.confidence ===
        "high",
  );

  const wider =
    result.claims.find(
      (claim) =>
        claim.id ===
        "metric-wider-reach",
    );

  check(
    "separately scoped wider-campaign claim remains publishable",
    wider?.publishable ===
      true &&
      wider.statement ===
        "The wider campaign generated 8M+ organic reach.",
  );

  const unsafeRoi =
    result.claims.find(
      (claim) =>
        claim.id ===
        "claim-audited-roi",
    );

  check(
    "unsupported claim remains non-public despite malicious publish recommendation",
    unsafeRoi?.publishable ===
      false,
  );

  check(
    "unsupported claim is forced to low confidence",
    unsafeRoi?.confidence ===
      "low",
  );

  const unsafeAudit =
    result.reconciliationAudit.find(
      (entry) =>
        entry.claimId ===
        "claim-audited-roi",
    );

  check(
    "pipeline retains reconciliation audit trail",
    Boolean(
      unsafeAudit &&
      unsafeAudit.requestedDecision ===
        "publish" &&
      unsafeAudit.requestedConfidence ===
        "high" &&
      unsafeAudit.publishable ===
        false &&
      unsafeAudit.effectiveConfidence ===
        "low",
    ),
  );

  check(
    "independent reconciliation audit survives pipeline",
    result.reconciliationAuditResult
      .safeToContinue ===
      true,
  );

  check(
    "unsafe Reconciler recommendation is preserved as non-blocking audit warning",
    result.reconciliationAuditResult
      .status ===
      "partial" &&
    result.reconciliationAuditResult
      .findings
      .some(
        (finding) =>
          finding.id ===
          "unsafe-request-overridden-claim-audited-roi",
      ),
  );

  check(
    "reconciliation warning score remains deterministic",
    result.reconciliationAuditResult
      .score ===
      88,
  );

  /* ── Extractor failure stops downstream calls ───── */

  const extractorFailureTracker:
    CallTracker = {
      order: [],
      models: {},
    };

  const fabricatedExtraction =
    clone(
      EXTRACTION_OUTPUT,
    );

  fabricatedExtraction
    .claims[0]
    .support[0]
    .excerpt =
    "Geek activated more than 1,058 creators.";

  let extractorFailure =
    false;

  try {
    await buildEvidenceLedger(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              fabricatedExtraction,
            ),
            extractorFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            extractorFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            extractorFailureTracker,
          ),
      },
    );
  } catch (error) {
    extractorFailure =
      error instanceof Error &&
      error.message.includes(
        "not verbatim in trusted source",
      );
  }

  check(
    "fabricated extraction evidence fails pipeline",
    extractorFailure,
  );

  check(
    "extractor failure prevents Verifier and Reconciler calls",
    JSON.stringify(
      extractorFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
      ]),
  );

  /* ── Verifier failure stops reconciliation ──────── */

  const verifierFailureTracker:
    CallTracker = {
      order: [],
      models: {},
    };

  const badVerification =
    clone(
      VERIFICATION_OUTPUT,
    );

  badVerification
    .results[0]
    .claimId =
    "invented-claim";

  let verifierFailure =
    false;

  try {
    await buildEvidenceLedger(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            verifierFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              badVerification,
            ),
            verifierFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            verifierFailureTracker,
          ),
      },
    );
  } catch (error) {
    verifierFailure =
      error instanceof Error &&
      error.message.includes(
        "Semantic verifier returned unknown claimId",
      );
  }

  check(
    "invalid verifier result fails pipeline",
    verifierFailure,
  );

  check(
    "verifier failure prevents Reconciler call",
    JSON.stringify(
      verifierFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
      ]),
  );

  /* ── Reconciler failure propagates ──────────────── */

  const reconcilerFailureTracker:
    CallTracker = {
      order: [],
      models: {},
  };

  let reconcilerFailure =
    false;

  try {
    await buildEvidenceLedger(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            reconcilerFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            reconcilerFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            "{ invalid json",
            reconcilerFailureTracker,
          ),
      },
    );
  } catch (error) {
    reconcilerFailure =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "invalid Reconciler output fails complete pipeline",
    reconcilerFailure,
  );

  check(
    "Reconciler failure occurs only after Extractor and Verifier",
    JSON.stringify(
      reconcilerFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
      ]),
  );

  /* ── Reconciliation Auditor failure blocks ledger ─ */

  const auditorFailureTracker:
    CallTracker = {
      order: [],
      models: {},
    };

  let auditorFailure =
    false;

  let auditorFindingSurfaced =
    false;

  try {
    await buildEvidenceLedger(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            auditorFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            auditorFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            auditorFailureTracker,
          ),

        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify({
              summary:
                "A material conflict was missed.",

              findings: [
                {
                  id:
                    "missed-result-conflict",

                  category:
                    "missed-conflict",

                  severity:
                    "error",

                  message:
                    "Two result claims require independent conflict review.",

                  claimIds: [
                    "metric-creators",
                    "metric-wider-reach",
                  ],
                },
              ],
            }),
            auditorFailureTracker,
          ),
      },
    );
  } catch (error) {
    auditorFailure =
      error instanceof Error &&
      error.message.includes(
        "Evidence Pipeline failed Reconciliation Auditor",
      );

    auditorFindingSurfaced =
      error instanceof Error &&
      error.message.includes(
        "missed-result-conflict",
      );
  }

  check(
    "Reconciliation Auditor error blocks trusted evidence ledger",
    auditorFailure,
  );

  check(
    "Evidence Pipeline surfaces exact reconciliation Auditor finding ID",
    auditorFindingSurfaced,
  );

  check(
    "Auditor executes only after Extractor Verifier and Reconciler",
    JSON.stringify(
      auditorFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
      ]),
  );

  /* ── Zero-claim fast path ───────────────────────── */

  const zeroTracker:
    CallTracker = {
      order: [],
      models: {},
    };

  const zero =
    await buildEvidenceLedger(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify({
              claims: [],
            }),
            zeroTracker,
          ),
      },
    );

  check(
    "zero extracted claims produce empty trusted ledger",
    zero.candidates.length ===
      0 &&
      zero.verification.results.length ===
        0 &&
      zero.claims.length ===
        0 &&
      zero.reconciliationAudit.length ===
        0 &&
      zero.reconciliationAuditResult
        .status ===
        "pass" &&
      zero.reconciliationAuditResult
        .safeToContinue ===
        true &&
      zero.reconciliationAuditResult
        .score ===
        100,
  );

  check(
    "zero-claim fast path skips Verifier Reconciler and Auditor",
    JSON.stringify(
      zeroTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
      ]),
  );

  /* ── Input immutability ─────────────────────────── */

  check(
    "Evidence Pipeline does not mutate trusted request",
    JSON.stringify(
      REQUEST,
    ) ===
      requestBefore,
  );

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(
    fail === 0 ? 0 : 1,
  );
}

main().catch(
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
