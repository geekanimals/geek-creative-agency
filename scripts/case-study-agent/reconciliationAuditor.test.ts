/**
 * GOLD STANDARD CASE STUDY AGENT
 * INDEPENDENT RECONCILIATION AUDITOR TESTS
 *
 * No network.
 * No CMS.
 * No database.
 *
 * Proves:
 * - missed conflicts can independently block progression;
 * - compatible scope differences are not automatically conflicts;
 * - historical comparisons may coexist with current results;
 * - partial / unsupported evidence cannot safely publish;
 * - low-confidence evidence cannot safely publish;
 * - unresolved conflicts cannot publish;
 * - conflict groups remain structurally valid;
 * - unsafe Reconciler requests remain visible even when overridden;
 * - withheld evidence remains visible to the Auditor;
 * - model findings are strictly validated;
 * - score / status are deterministic;
 * - inputs are not mutated.
 */

import {
  auditReconciliation,
} from "./reconciliationAuditor";

import type {
  ReconciliationAuditorRequest,
} from "./reconciliationAuditor";

import type {
  CandidateEvidenceClaim,
} from "./extractor";

import type {
  EvidenceClaim,
} from "./types";

import type {
  ClaimVerificationResult,
} from "./verificationSchema";

import type {
  ReconciliationAuditEntry,
} from "./reconciler";

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

type Capture = {
  calls: number;
  model?: string;
  input?: unknown;
};

function fakeClient(
  output: unknown,
  capture?: Capture,
) {
  return {
    responses: {
      create: async (
        input: any,
      ) => {
        if (capture) {
          capture.calls++;

          capture.model =
            input.model;

          capture.input =
            clone(input);
        }

        return {
          output_text:
            typeof output ===
            "string"
              ? output
              : JSON.stringify(
                  output,
                ),
        };
      },
    },
  } as any;
}

function candidate(
  id: string,
  statement: string,
): CandidateEvidenceClaim {
  return {
    id,

    type:
      "metric",

    statement,

    sourceIds: [
      `source-${id}`,
    ],

    support: [
      {
        sourceId:
          `source-${id}`,

        excerpt:
          statement,
      },
    ],
  };
}

function verification(
  claimId: string,
  verdict:
    | "supported"
    | "partial"
    | "unsupported" =
      "supported",
): ClaimVerificationResult {
  return {
    claimId,

    verdict,

    reason:
      verdict ===
      "supported"
        ? "The excerpt supports the full material meaning."
        : "The excerpt does not support the full material meaning.",

    unsupportedElements:
      verdict ===
      "supported"
        ? []
        : [
            "material scope",
          ],
  };
}

function reconciliation(
  claimId: string,
  options: {
    verifierVerdict?:
      | "supported"
      | "partial"
      | "unsupported";

    requestedDecision?:
      | "publish"
      | "withhold";

    requestedConfidence?:
      | "high"
      | "medium"
      | "low";

    conflictDisposition?:
      | "none"
      | "unresolved";

    conflictGroupId?:
      string;

    effectiveConfidence?:
      | "high"
      | "medium"
      | "low";

    publishable?:
      boolean;
  } = {},
): ReconciliationAuditEntry {
  return {
    claimId,

    verifierVerdict:
      options.verifierVerdict ??
      "supported",

    requestedDecision:
      options.requestedDecision ??
      "publish",

    requestedConfidence:
      options.requestedConfidence ??
      "high",

    conflictDisposition:
      options.conflictDisposition ??
      "none",

    conflictGroupId:
      options.conflictGroupId,

    reason:
      "Reconciliation decision.",

    effectiveConfidence:
      options.effectiveConfidence ??
      "high",

    publishable:
      options.publishable ??
      true,
  };
}

function finalClaim(
  source:
    CandidateEvidenceClaim,
  options: {
    confidence?:
      | "high"
      | "medium"
      | "low";

    publishable?:
      boolean;
  } = {},
): EvidenceClaim {
  return {
    id:
      source.id,

    type:
      source.type,

    statement:
      source.statement,

    sourceIds: [
      ...source.sourceIds,
    ],

    support:
      source.support.map(
        (item) => ({
          sourceId:
            item.sourceId,

          excerpt:
            item.excerpt,
        }),
      ),

    confidence:
      options.confidence ??
      "high",

    publishable:
      options.publishable ??
      true,

    note:
      "Reconciliation decision.",
  };
}

function baseRequest():
  ReconciliationAuditorRequest {
  const a =
    candidate(
      "metric-national",
      "The campaign activated 500 creators nationally in 2026.",
    );

  const b =
    candidate(
      "metric-delhi",
      "The campaign activated 200 creators in Delhi in 2026.",
    );

  return {
    candidates: [
      a,
      b,
    ],

    verification: {
      results: [
        verification(
          a.id,
        ),
        verification(
          b.id,
        ),
      ],
    },

    reconciliationAudit: [
      reconciliation(
        a.id,
      ),
      reconciliation(
        b.id,
      ),
    ],

    claims: [
      finalClaim(
        a,
      ),
      finalClaim(
        b,
      ),
    ],

    model:
      "reconciliation-auditor-model",
  };
}

const CLEAN_OUTPUT = {
  summary:
    "Reconciliation is semantically safe.",

  findings: [],
};

async function rejectedWith(
  request:
    ReconciliationAuditorRequest,
  modelOutput:
    unknown,
  expected:
    string,
): Promise<boolean> {
  try {
    await auditReconciliation(
      request,
      {
        client:
          fakeClient(
            modelOutput,
          ),
      },
    );

    return false;
  } catch (error) {
    return (
      error instanceof Error &&
      error.message.includes(
        expected,
      )
    );
  }
}

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Independent Reconciliation Auditor tests\n",
  );

  /* ── Clean compatible evidence ─────────────────── */

  const clean =
    await auditReconciliation(
      baseRequest(),
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "compatible scope differences may pass reconciliation audit",
    clean.status ===
      "pass" &&
    clean.safeToContinue ===
      true,
  );

  check(
    "clean reconciliation audit scores 100",
    clean.score ===
      100,
  );

  check(
    "clean audit contains no findings",
    clean.findings.length ===
      0,
  );

  /* ── Independent missed-conflict detection ─────── */

  const missedConflict =
    baseRequest();

  missedConflict
    .candidates[0]
    .statement =
    "The campaign activated 500 creators nationally in 2026.";

  missedConflict
    .candidates[0]
    .support[0]
    .excerpt =
    missedConflict
      .candidates[0]
      .statement;

  missedConflict
    .claims[0]
    .statement =
    missedConflict
      .candidates[0]
      .statement;

  missedConflict
    .claims[0]
    .support![0]
    .excerpt =
    missedConflict
      .candidates[0]
      .statement;

  missedConflict
    .candidates[1]
    .statement =
    "The campaign activated 700 creators nationally in 2026.";

  missedConflict
    .candidates[1]
    .support[0]
    .excerpt =
    missedConflict
      .candidates[1]
      .statement;

  missedConflict
    .claims[1]
    .statement =
    missedConflict
      .candidates[1]
      .statement;

  missedConflict
    .claims[1]
    .support![0]
    .excerpt =
    missedConflict
      .candidates[1]
      .statement;

  const missedConflictResult =
    await auditReconciliation(
      missedConflict,
      {
        client:
          fakeClient({
            summary:
              "A material numerical conflict was missed.",

            findings: [
              {
                id:
                  "national-total-conflict",

                category:
                  "missed-conflict",

                severity:
                  "error",

                message:
                  "Two publication-ready claims describe the same national 2026 creator total with incompatible values.",

                claimIds: [
                  "metric-national",
                  "metric-delhi",
                ],
              },
            ],
          }),
      },
    );

  check(
    "independent Auditor can block a missed numerical conflict",
    missedConflictResult.status ===
      "fail" &&
    missedConflictResult.safeToContinue ===
      false,
  );

  check(
    "one semantic reconciliation error scores 82",
    missedConflictResult.score ===
      82,
  );

  check(
    "missed conflict preserves both affected claim IDs",
    missedConflictResult
      .findings[0]
      ?.claimIds
      .join(",") ===
      "metric-national,metric-delhi",
  );

  /* ── Historical comparison is not automatically conflict ─ */

  const historical =
    baseRequest();

  historical
    .candidates[1]
    .statement =
    "A historical comparison recorded 700 creators in 2024.";

  historical
    .candidates[1]
    .support[0]
    .excerpt =
    historical
      .candidates[1]
      .statement;

  historical
    .claims[1]
    .statement =
    historical
      .candidates[1]
      .statement;

  historical
    .claims[1]
    .support![0]
    .excerpt =
    historical
      .candidates[1]
      .statement;

  const historicalResult =
    await auditReconciliation(
      historical,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "historical comparison may coexist with current result",
    historicalResult
      .safeToContinue ===
      true,
  );

  /* ── Unsafe partial publication ─────────────────── */

  const partialPublished =
    baseRequest();

  partialPublished
    .verification
    .results[0] =
    verification(
      "metric-national",
      "partial",
    );

  partialPublished
    .reconciliationAudit[0] =
    reconciliation(
      "metric-national",
      {
        verifierVerdict:
          "partial",

        requestedDecision:
          "publish",

        requestedConfidence:
          "high",

        effectiveConfidence:
          "high",

        publishable:
          true,
      },
    );

  const partialPublishedResult =
    await auditReconciliation(
      partialPublished,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "partial evidence published downstream is deterministically blocked",
    partialPublishedResult
      .findings
      .some(
        (item) =>
          item.category ===
            "unsafe-publication" &&
          item.severity ===
            "error",
      ),
  );

  /* ── Unsafe unsupported publication ─────────────── */

  const unsupportedPublished =
    baseRequest();

  unsupportedPublished
    .verification
    .results[0] =
    verification(
      "metric-national",
      "unsupported",
    );

  unsupportedPublished
    .reconciliationAudit[0] =
    reconciliation(
      "metric-national",
      {
        verifierVerdict:
          "unsupported",

        effectiveConfidence:
          "medium",

        publishable:
          true,
      },
    );

  unsupportedPublished
    .claims[0]
    .confidence =
    "medium";

  const unsupportedResult =
    await auditReconciliation(
      unsupportedPublished,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "unsupported evidence cannot safely publish",
    unsupportedResult
      .safeToContinue ===
      false,
  );

  /* ── Low-confidence publication ────────────────── */

  const lowPublished =
    baseRequest();

  lowPublished
    .reconciliationAudit[0]
    .effectiveConfidence =
    "low";

  lowPublished
    .claims[0]
    .confidence =
    "low";

  const lowPublishedResult =
    await auditReconciliation(
      lowPublished,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "low-confidence publication is blocked",
    lowPublishedResult
      .findings
      .some(
        (item) =>
          item.category ===
          "unsafe-confidence" &&
          item.severity ===
          "error",
      ),
  );

  /* ── Unresolved conflicts cannot publish ───────── */

  const unresolvedPublished =
    baseRequest();

  unresolvedPublished
    .reconciliationAudit[0] =
    reconciliation(
      "metric-national",
      {
        conflictDisposition:
          "unresolved",

        conflictGroupId:
          "creator-total-conflict",

        effectiveConfidence:
          "high",

        publishable:
          true,
      },
    );

  unresolvedPublished
    .reconciliationAudit[1] =
    reconciliation(
      "metric-delhi",
      {
        requestedDecision:
          "withhold",

        requestedConfidence:
          "low",

        conflictDisposition:
          "unresolved",

        conflictGroupId:
          "creator-total-conflict",

        effectiveConfidence:
          "low",

        publishable:
          false,
      },
    );

  unresolvedPublished
    .claims[1]
    .confidence =
    "low";

  unresolvedPublished
    .claims[1]
    .publishable =
    false;

  const unresolvedResult =
    await auditReconciliation(
      unresolvedPublished,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "unresolved conflict accidentally published is blocked",
    unresolvedResult
      .findings
      .some(
        (item) =>
          item.id ===
          "unresolved-conflict-published-metric-national",
      ),
  );

  /* ── Missing conflict group ─────────────────────── */

  const missingGroup =
    baseRequest();

  missingGroup
    .reconciliationAudit[0] =
    reconciliation(
      "metric-national",
      {
        requestedDecision:
          "withhold",

        requestedConfidence:
          "low",

        conflictDisposition:
          "unresolved",

        effectiveConfidence:
          "low",

        publishable:
          false,
      },
    );

  missingGroup
    .claims[0]
    .confidence =
    "low";

  missingGroup
    .claims[0]
    .publishable =
    false;

  const missingGroupResult =
    await auditReconciliation(
      missingGroup,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "unresolved conflict requires conflictGroupId",
    missingGroupResult
      .findings
      .some(
        (item) =>
          item.id ===
          "missing-conflict-group-metric-national",
      ),
  );

  /* ── Singleton conflict group ───────────────────── */

  const singleton =
    baseRequest();

  singleton
    .reconciliationAudit[0] =
    reconciliation(
      "metric-national",
      {
        requestedDecision:
          "withhold",

        requestedConfidence:
          "low",

        conflictDisposition:
          "unresolved",

        conflictGroupId:
          "singleton-group",

        effectiveConfidence:
          "low",

        publishable:
          false,
      },
    );

  singleton
    .claims[0]
    .confidence =
    "low";

  singleton
    .claims[0]
    .publishable =
    false;

  const singletonResult =
    await auditReconciliation(
      singleton,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "singleton conflict group is blocked",
    singletonResult
      .findings
      .some(
        (item) =>
          item.id ===
          "singleton-conflict-singleton-group",
      ),
  );

  /* ── Conflict group on non-conflict claim ───────── */

  const strayGroup =
    baseRequest();

  strayGroup
    .reconciliationAudit[0]
    .conflictGroupId =
    "unexpected-group";

  const strayGroupResult =
    await auditReconciliation(
      strayGroup,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "conflictGroupId without unresolved disposition is blocked",
    strayGroupResult
      .findings
      .some(
        (item) =>
          item.id ===
          "unexpected-conflict-group-metric-national",
      ),
  );

  /* ── Unsafe Reconciler request correctly overridden ─ */

  const overridden =
    baseRequest();

  overridden
    .verification
    .results[0] =
    verification(
      "metric-national",
      "partial",
    );

  overridden
    .reconciliationAudit[0] =
    reconciliation(
      "metric-national",
      {
        verifierVerdict:
          "partial",

        requestedDecision:
          "publish",

        requestedConfidence:
          "high",

        effectiveConfidence:
          "low",

        publishable:
          false,
      },
    );

  overridden
    .claims[0]
    .confidence =
    "low";

  overridden
    .claims[0]
    .publishable =
    false;

  const overriddenResult =
    await auditReconciliation(
      overridden,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "unsafe Reconciler publication request remains visible as warning",
    overriddenResult
      .findings
      .some(
        (item) =>
          item.id ===
          "unsafe-request-overridden-metric-national" &&
          item.severity ===
          "warning",
      ),
  );

  check(
    "unsafe confidence request remains visible as warning",
    overriddenResult
      .findings
      .some(
        (item) =>
          item.id ===
          "unsafe-confidence-overridden-metric-national" &&
          item.severity ===
          "warning",
      ),
  );

  check(
    "correctly overridden unsafe requests remain safe to continue",
    overriddenResult.status ===
      "partial" &&
    overriddenResult.safeToContinue ===
      true,
  );

  check(
    "two deterministic warnings score 88",
    overriddenResult.score ===
      88,
  );

  /* ── Final ledger mutation ──────────────────────── */

  const mutated =
    baseRequest();

  mutated.claims[0]
    .statement =
    "The campaign activated 5,000 creators nationally in 2026.";

  const mutatedResult =
    await auditReconciliation(
      mutated,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "Reconciler cannot rewrite extracted evidence",
    mutatedResult
      .findings
      .some(
        (item) =>
          item.id ===
          "ledger-mutation-metric-national",
      ),
  );

  /* ── Verifier verdict integrity ─────────────────── */

  const verifierMismatch =
    baseRequest();

  verifierMismatch
    .verification
    .results[0] =
    verification(
      "metric-national",
      "partial",
    );

  const verifierMismatchResult =
    await auditReconciliation(
      verifierMismatch,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "Reconciliation audit cannot misstate Verifier verdict",
    verifierMismatchResult
      .findings
      .some(
        (item) =>
          item.id ===
          "verifier-mismatch-metric-national",
      ),
  );

  /* ── Final state must match reconciliation audit ── */

  const finalMismatch =
    baseRequest();

  finalMismatch
    .claims[0]
    .publishable =
    false;

  const finalMismatchResult =
    await auditReconciliation(
      finalMismatch,
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
          ),
      },
    );

  check(
    "final ledger state must match reconciliation audit",
    finalMismatchResult
      .findings
      .some(
        (item) =>
          item.id ===
          "final-state-mismatch-metric-national",
      ),
  );

  /* ── Exact stage coverage ───────────────────────── */

  const missingVerification =
    baseRequest();

  missingVerification
    .verification
    .results.pop();

  check(
    "missing Verifier result is rejected before model audit",
    await rejectedWith(
      missingVerification,
      CLEAN_OUTPUT,
      "verification is missing claimId",
    ),
  );

  const unknownFinalClaim =
    baseRequest();

  unknownFinalClaim
    .claims[1]
    .id =
    "invented-claim";

  check(
    "unknown final evidence claim ID is rejected",
    await rejectedWith(
      unknownFinalClaim,
      CLEAN_OUTPUT,
      "final claims is missing claimId",
    ),
  );

  /* ── Withheld evidence remains visible to model ─── */

  const withheld =
    baseRequest();

  withheld
    .reconciliationAudit[1] =
    reconciliation(
      "metric-delhi",
      {
        requestedDecision:
          "withhold",

        requestedConfidence:
          "medium",

        effectiveConfidence:
          "medium",

        publishable:
          false,
      },
    );

  withheld
    .claims[1]
    .publishable =
    false;

  withheld
    .claims[1]
    .confidence =
    "medium";

  const capture:
    Capture = {
      calls: 0,
    };

  await auditReconciliation(
    withheld,
    {
      client:
        fakeClient(
          CLEAN_OUTPUT,
          capture,
        ),
    },
  );

  const capturedRequest =
    capture.input as any;

  const capturedUserContent =
    String(
      capturedRequest
        ?.input?.[1]
        ?.content ??
      "",
    );

  check(
    "Auditor receives withheld evidence rather than only publication-ready claims",
    capturedUserContent.includes(
      '"metric-delhi"',
    ) &&
    capturedUserContent.includes(
      '"publishable":false',
    ),
  );

  check(
    "Auditor model executes exactly once",
    capture.calls ===
      1,
  );

  check(
    "explicit Auditor model routes correctly",
    capture.model ===
      "reconciliation-auditor-model",
  );

  /* ── Strict model-output validation ─────────────── */

  check(
    "model cannot reference invented claim ID",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "Unsafe.",

        findings: [
          {
            id:
              "invented-reference",

            category:
              "missed-conflict",

            severity:
              "error",

            message:
              "Invented reference.",

            claimIds: [
              "metric-national",
              "invented-claim",
            ],
          },
        ],
      },
      "references unknown claimId",
    ),
  );

  check(
    "missed-conflict finding requires at least two claims",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "Unsafe.",

        findings: [
          {
            id:
              "single-claim-conflict",

            category:
              "missed-conflict",

            severity:
              "error",

            message:
              "Invalid conflict.",

            claimIds: [
              "metric-national",
            ],
          },
        ],
      },
      "must reference at least two claims",
    ),
  );

  check(
    "unsafe finding ID is rejected",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "Unsafe.",

        findings: [
          {
            id:
              "Bad Finding ID",

            category:
              "other",

            severity:
              "warning",

            message:
              "Invalid ID.",

            claimIds: [
              "metric-national",
            ],
          },
        ],
      },
      "safe lower-kebab-case ID",
    ),
  );

  check(
    "duplicate finding IDs are rejected",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "Unsafe.",

        findings: [
          {
            id:
              "duplicate-finding",

            category:
              "other",

            severity:
              "warning",

            message:
              "First.",

            claimIds: [
              "metric-national",
            ],
          },

          {
            id:
              "duplicate-finding",

            category:
              "other",

            severity:
              "warning",

            message:
              "Second.",

            claimIds: [
              "metric-delhi",
            ],
          },
        ],
      },
      "duplicate finding ID",
    ),
  );

  check(
    "invalid finding category is rejected",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "Unsafe.",

        findings: [
          {
            id:
              "bad-category",

            category:
              "invented-category",

            severity:
              "warning",

            message:
              "Invalid category.",

            claimIds: [
              "metric-national",
            ],
          },
        ],
      },
      "invalid category",
    ),
  );

  check(
    "invalid finding severity is rejected",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "Unsafe.",

        findings: [
          {
            id:
              "bad-severity",

            category:
              "other",

            severity:
              "critical",

            message:
              "Invalid severity.",

            claimIds: [
              "metric-national",
            ],
          },
        ],
      },
      "invalid severity",
    ),
  );

  check(
    "model cannot self-assign score",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "Safe.",

        score:
          100,

        findings: [],
      },
      "unknown field: score",
    ),
  );

  check(
    "empty Auditor summary is rejected",
    await rejectedWith(
      baseRequest(),
      {
        summary:
          "   ",

        findings: [],
      },
      "summary must be a non-empty string",
    ),
  );

  /* ── Empty evidence skips AI ────────────────────── */

  const emptyCapture:
    Capture = {
      calls: 0,
    };

  const emptyResult =
    await auditReconciliation(
      {
        candidates: [],

        verification: {
          results: [],
        },

        reconciliationAudit: [],

        claims: [],
      },
      {
        client:
          fakeClient(
            CLEAN_OUTPUT,
            emptyCapture,
          ),
      },
    );

  check(
    "empty evidence passes without unnecessary AI call",
    emptyResult.status ===
      "pass" &&
    emptyResult.score ===
      100 &&
    emptyCapture.calls ===
      0,
  );

  /* ── Input immutability ─────────────────────────── */

  const immutable =
    baseRequest();

  const immutableBefore =
    JSON.stringify(
      immutable,
    );

  await auditReconciliation(
    immutable,
    {
      client:
        fakeClient(
          CLEAN_OUTPUT,
        ),
    },
  );

  check(
    "Reconciliation Auditor does not mutate input",
    JSON.stringify(
      immutable,
    ) ===
      immutableBefore,
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
