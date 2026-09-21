/**
 * GOLD STANDARD CASE STUDY AGENT — EVIDENCE RECONCILER TESTS
 *
 * No real OpenAI call.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves:
 * - extracted evidence cannot be rewritten;
 * - partial / unsupported claims are forced non-public;
 * - unresolved conflicts are forced non-public;
 * - low-confidence claims cannot become public;
 * - different supported scopes may remain separately publishable;
 * - reconciliation decisions have exact claim coverage;
 * - conflict groups are structurally valid;
 * - trusted excerpts are revalidated before reconciliation.
 */

import {
  reconcileEvidence,
} from "./reconciler";

import type {
  ReconcileEvidenceRequest,
} from "./reconciler";

function fakeClient(
  outputText: string | undefined,
  capturedInputs:
    unknown[] = [],
) {
  return {
    responses: {
      create: async (
        input: unknown,
      ) => {
        capturedInputs.push(
          input,
        );

        return {
          output_text:
            outputText,
        };
      },
    },
  } as never;
}

function clone<T>(
  value: T,
): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
}

let pass = 0;
let fail = 0;

function check(
  name: string,
  condition: boolean,
) {
  if (condition) {
    console.log(
      `  ✓ ${name}`,
    );

    pass++;
  } else {
    console.log(
      `  ✗ ${name}`,
    );

    fail++;
  }
}

async function expectReject(
  name: string,
  request: ReconcileEvidenceRequest,
  output: unknown,
  expectedMessage: string,
) {
  let rejected = false;

  try {
    await reconcileEvidence(
      request,
      {
        client:
          fakeClient(
            JSON.stringify(
              output,
            ),
          ),
      },
    );
  } catch (error) {
    rejected =
      error instanceof Error &&
      error.message.includes(
        expectedMessage,
      );
  }

  check(
    name,
    rejected,
  );
}

const REQUEST: ReconcileEvidenceRequest = {
  sources: [
    {
      id:
        "current-geek-report",

      kind:
        "internal-document",

      title:
        "Current Geek activation report",

      content:
        [
          "Geek's final activation count was 1,058 creators.",
          "The historical value comparison was approximately ₹1.44Cr and was not audited ROI.",
          "Heartwork reused creators acquired through Smile Deke Dekho.",
        ].join("\n"),
    },

    {
      id:
        "older-geek-report",

      kind:
        "campaign-archive",

      title:
        "Older Geek activation report",

      content:
        "Geek's final activation count was 1,020 creators.",
    },

    {
      id:
        "wider-campaign-report",

      kind:
        "independent-editorial",

      title:
        "Wider campaign coverage",

      content:
        "The wider campaign generated 8M+ organic reach.",
    },
  ],

  claims: [
    {
      id:
        "metric-final-1058",

      type:
        "metric",

      statement:
        "Geek's final activation count was 1,058 creators.",

      sourceIds: [
        "current-geek-report",
      ],

      support: [
        {
          sourceId:
            "current-geek-report",

          excerpt:
            "Geek's final activation count was 1,058 creators.",
        },
      ],
    },

    {
      id:
        "metric-final-1020",

      type:
        "metric",

      statement:
        "Geek's final activation count was 1,020 creators.",

      sourceIds: [
        "older-geek-report",
      ],

      support: [
        {
          sourceId:
            "older-geek-report",

          excerpt:
            "Geek's final activation count was 1,020 creators.",
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
        "wider-campaign-report",
      ],

      support: [
        {
          sourceId:
            "wider-campaign-report",

          excerpt:
            "The wider campaign generated 8M+ organic reach.",
        },
      ],
    },

    {
      id:
        "fact-not-roi",

      type:
        "fact",

      statement:
        "The historical value comparison was approximately ₹1.44Cr and was not audited ROI.",

      sourceIds: [
        "current-geek-report",
      ],

      support: [
        {
          sourceId:
            "current-geek-report",

          excerpt:
            "The historical value comparison was approximately ₹1.44Cr and was not audited ROI.",
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
        "current-geek-report",
      ],

      support: [
        {
          sourceId:
            "current-geek-report",

          excerpt:
            "The historical value comparison was approximately ₹1.44Cr and was not audited ROI.",
        },
      ],
    },

    {
      id:
        "claim-causal-continuity",

      type:
        "narrative",

      statement:
        "Heartwork reused creators acquired through Smile Deke Dekho and caused the later creator programme.",

      sourceIds: [
        "current-geek-report",
      ],

      support: [
        {
          sourceId:
            "current-geek-report",

          excerpt:
            "Heartwork reused creators acquired through Smile Deke Dekho.",
        },
      ],
    },
  ],

  verification: {
    results: [
      {
        claimId:
          "metric-final-1058",

        verdict:
          "supported",

        reason:
          "The supplied excerpt directly supports the exact final activation figure.",

        unsupportedElements: [],
      },

      {
        claimId:
          "metric-final-1020",

        verdict:
          "supported",

        reason:
          "The supplied excerpt directly supports the exact final activation figure.",

        unsupportedElements: [],
      },

      {
        claimId:
          "metric-wider-reach",

        verdict:
          "supported",

        reason:
          "The supplied excerpt directly supports wider-campaign organic reach.",

        unsupportedElements: [],
      },

      {
        claimId:
          "fact-not-roi",

        verdict:
          "supported",

        reason:
          "The supplied excerpt directly establishes the historical comparison and the non-ROI qualifier.",

        unsupportedElements: [],
      },

      {
        claimId:
          "claim-audited-roi",

        verdict:
          "unsupported",

        reason:
          "The excerpt explicitly says the comparison was not audited ROI.",

        unsupportedElements: [
          "audited ROI",
        ],
      },

      {
        claimId:
          "claim-causal-continuity",

        verdict:
          "partial",

        reason:
          "Reuse of creators is supported, but causation of a later programme is not established.",

        unsupportedElements: [
          "caused the later creator programme",
        ],
      },
    ],
  },

  model:
    "fake-model",
};

const VALID_OUTPUT = {
  decisions: [
    {
      claimId:
        "metric-final-1058",

      decision:
        "withhold",

      confidence:
        "low",

      conflictDisposition:
        "unresolved",

      conflictGroupId:
        "final-activation-count",

      reason:
        "A second supported source reports a different final activation count for the same stated scope.",
    },

    {
      claimId:
        "metric-final-1020",

      decision:
        "withhold",

      confidence:
        "low",

      conflictDisposition:
        "unresolved",

      conflictGroupId:
        "final-activation-count",

      reason:
        "A second supported source reports a different final activation count for the same stated scope.",
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
        "The claim is fully supported and explicitly scoped to the wider campaign.",
    },

    {
      claimId:
        "fact-not-roi",

      decision:
        "publish",

      confidence:
        "high",

      conflictDisposition:
        "none",

      conflictGroupId:
        null,

      reason:
        "The source explicitly preserves the historical-comparison and non-ROI qualifier.",
    },

    {
      claimId:
        "claim-audited-roi",

      decision:
        "withhold",

      confidence:
        "low",

      conflictDisposition:
        "none",

      conflictGroupId:
        null,

      reason:
        "Independent verification found the audited-ROI assertion unsupported.",
    },

    {
      claimId:
        "claim-causal-continuity",

      decision:
        "withhold",

      confidence:
        "low",

      conflictDisposition:
        "none",

      conflictGroupId:
        null,

      reason:
        "Independent verification found the causal element only partially supported.",
    },
  ],
};

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Evidence Reconciler tests\n",
  );

  const requestBefore =
    JSON.stringify(
      REQUEST,
    );

  /* ── Valid reconciliation ────────────────────────── */

  const result =
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              VALID_OUTPUT,
            ),
        ),
      },
    );

  check(
    "valid reconciliation succeeds",
    result.claims.length ===
      REQUEST.claims.length,
  );

  check(
    "one audit entry exists per claim",
    result.audit.length ===
      REQUEST.claims.length,
  );

  /* ── Candidate evidence preservation ─────────────── */

  const wider =
    result.claims.find(
      (claim) =>
        claim.id ===
        "metric-wider-reach",
    );

  check(
    "claim statement survives reconciliation exactly",
    wider?.statement ===
      "The wider campaign generated 8M+ organic reach.",
  );

  check(
    "claim type survives reconciliation exactly",
    wider?.type ===
      "metric",
  );

  check(
    "source IDs survive reconciliation",
    wider?.sourceIds.length ===
      1 &&
      wider.sourceIds[0] ===
        "wider-campaign-report",
  );

  check(
    "verbatim support survives reconciliation exactly",
    wider?.support?.[0]
      ?.excerpt ===
      "The wider campaign generated 8M+ organic reach.",
  );

  /* ── Supported publication ───────────────────────── */

  check(
    "supported high-confidence wider-scope claim can publish",
    wider?.publishable ===
      true &&
      wider.confidence ===
        "high",
  );

  const notRoi =
    result.claims.find(
      (claim) =>
        claim.id ===
        "fact-not-roi",
    );

  check(
    "supported qualifier-preserving claim can publish",
    notRoi?.publishable ===
      true &&
      notRoi.confidence ===
        "high",
  );

  /* ── Conflict enforcement ────────────────────────── */

  const currentMetric =
    result.claims.find(
      (claim) =>
        claim.id ===
        "metric-final-1058",
    );

  const olderMetric =
    result.claims.find(
      (claim) =>
        claim.id ===
        "metric-final-1020",
    );

  check(
    "first unresolved conflicting claim is withheld",
    currentMetric?.publishable ===
      false &&
      currentMetric.confidence ===
        "low",
  );

  check(
    "second unresolved conflicting claim is withheld",
    olderMetric?.publishable ===
      false &&
      olderMetric.confidence ===
        "low",
  );

  const currentAudit =
    result.audit.find(
      (entry) =>
        entry.claimId ===
        "metric-final-1058",
    );

  check(
    "conflict audit preserves shared group",
    currentAudit
      ?.conflictGroupId ===
      "final-activation-count" &&
      currentAudit
        .conflictDisposition ===
        "unresolved",
  );

  /* ── Unsupported deterministic override ──────────── */

  const maliciousUnsupported =
    clone(VALID_OUTPUT);

  const unsupportedDecision =
    maliciousUnsupported
      .decisions.find(
        (decision) =>
          decision.claimId ===
          "claim-audited-roi",
      )!;

  unsupportedDecision.decision =
    "publish";

  unsupportedDecision.confidence =
    "high";

  const unsupportedResult =
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              maliciousUnsupported,
            ),
          ),
      },
    );

  const unsupportedClaim =
    unsupportedResult.claims.find(
      (claim) =>
        claim.id ===
        "claim-audited-roi",
    );

  check(
    "unsupported claim cannot publish even when Reconciler requests publish",
    unsupportedClaim?.publishable ===
      false,
  );

  check(
    "unsupported claim is deterministically forced to low confidence",
    unsupportedClaim?.confidence ===
      "low",
  );

  const unsupportedAudit =
    unsupportedResult.audit.find(
      (entry) =>
        entry.claimId ===
        "claim-audited-roi",
    );

  check(
    "audit preserves malicious requested decision separately from effective result",
    unsupportedAudit
      ?.requestedDecision ===
      "publish" &&
      unsupportedAudit
        .requestedConfidence ===
        "high" &&
      unsupportedAudit
        .publishable ===
        false &&
      unsupportedAudit
        .effectiveConfidence ===
        "low",
  );

  /* ── Partial deterministic override ──────────────── */

  const maliciousPartial =
    clone(VALID_OUTPUT);

  const partialDecision =
    maliciousPartial
      .decisions.find(
        (decision) =>
          decision.claimId ===
          "claim-causal-continuity",
      )!;

  partialDecision.decision =
    "publish";

  partialDecision.confidence =
    "high";

  const partialResult =
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              maliciousPartial,
            ),
          ),
      },
    );

  const partialClaim =
    partialResult.claims.find(
      (claim) =>
        claim.id ===
        "claim-causal-continuity",
    );

  check(
    "partial claim cannot publish even when Reconciler requests publish",
    partialClaim?.publishable ===
      false &&
      partialClaim.confidence ===
        "low",
  );

  /* ── Conflict deterministic override ─────────────── */

  const maliciousConflict =
    clone(VALID_OUTPUT);

  const conflictDecision =
    maliciousConflict
      .decisions.find(
        (decision) =>
          decision.claimId ===
          "metric-final-1058",
      )!;

  conflictDecision.decision =
    "publish";

  conflictDecision.confidence =
    "high";

  const conflictResult =
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              maliciousConflict,
            ),
          ),
      },
    );

  const forcedConflict =
    conflictResult.claims.find(
      (claim) =>
        claim.id ===
        "metric-final-1058",
    );

  check(
    "unresolved conflict cannot publish even when Reconciler requests publish",
    forcedConflict?.publishable ===
      false &&
      forcedConflict.confidence ===
        "low",
  );

  /* ── Supported medium confidence ─────────────────── */

  const mediumOutput =
    clone(VALID_OUTPUT);

  const mediumDecision =
    mediumOutput
      .decisions.find(
        (decision) =>
          decision.claimId ===
          "metric-wider-reach",
      )!;

  mediumDecision.confidence =
    "medium";

  const mediumResult =
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              mediumOutput,
            ),
          ),
      },
    );

  const mediumClaim =
    mediumResult.claims.find(
      (claim) =>
        claim.id ===
        "metric-wider-reach",
    );

  check(
    "supported medium-confidence claim may publish",
    mediumClaim?.publishable ===
      true &&
      mediumClaim.confidence ===
        "medium",
  );

  /* ── Supported low confidence ────────────────────── */

  const lowOutput =
    clone(VALID_OUTPUT);

  const lowDecision =
    lowOutput.decisions.find(
      (decision) =>
        decision.claimId ===
        "metric-wider-reach",
    )!;

  lowDecision.confidence =
    "low";

  const lowResult =
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              lowOutput,
            ),
          ),
      },
    );

  const lowClaim =
    lowResult.claims.find(
      (claim) =>
        claim.id ===
        "metric-wider-reach",
    );

  check(
    "low-confidence claim cannot become public",
    lowClaim?.publishable ===
      false,
  );

  /* ── Explicit withhold remains withheld ──────────── */

  const withholdOutput =
    clone(VALID_OUTPUT);

  const withholdDecision =
    withholdOutput
      .decisions.find(
        (decision) =>
          decision.claimId ===
          "fact-not-roi",
      )!;

  withholdDecision.decision =
    "withhold";

  const withholdResult =
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              withholdOutput,
            ),
          ),
      },
    );

  check(
    "supported claim remains withheld when reconciliation requests withhold",
    withholdResult.claims.find(
      (claim) =>
        claim.id ===
        "fact-not-roi",
    )?.publishable ===
      false,
  );

  /* ── Exact decision coverage ─────────────────────── */

  const omitted =
    clone(VALID_OUTPUT);

  omitted.decisions.pop();

  await expectReject(
    "omitted reconciliation decision is rejected",
    clone(REQUEST),
    omitted,
    "exactly one decision per candidate claim",
  );

  const duplicateDecision =
    clone(VALID_OUTPUT);

  duplicateDecision
    .decisions[1]
    .claimId =
    duplicateDecision
      .decisions[0]
      .claimId;

  await expectReject(
    "duplicate reconciliation decision is rejected",
    clone(REQUEST),
    duplicateDecision,
    "Duplicate Evidence Reconciler decision",
  );

  const unknownClaim =
    clone(VALID_OUTPUT);

  unknownClaim
    .decisions[0]
    .claimId =
    "invented-claim";

  await expectReject(
    "unknown reconciliation claim ID is rejected",
    clone(REQUEST),
    unknownClaim,
    "unknown candidate claim",
  );

  /* ── Conflict-group structure ────────────────────── */

  const missingConflictGroup =
    clone(VALID_OUTPUT);

  const missingGroupDecision =
    missingConflictGroup
      .decisions[0];

  missingGroupDecision
    .conflictGroupId =
    null;

  await expectReject(
    "unresolved conflict requires conflictGroupId",
    clone(REQUEST),
    missingConflictGroup,
    "requires conflictGroupId",
  );

  const groupWhenNone =
    clone(VALID_OUTPUT);

  const widerDecision =
    groupWhenNone
      .decisions.find(
        (decision) =>
          decision.claimId ===
          "metric-wider-reach",
      )!;

  widerDecision
    .conflictGroupId =
    "fake-conflict";

  await expectReject(
    "non-conflicting claim must use null conflictGroupId",
    clone(REQUEST),
    groupWhenNone,
    "must use conflictGroupId=null",
  );

  const unsafeGroup =
    clone(VALID_OUTPUT);

  unsafeGroup
    .decisions[0]
    .conflictGroupId =
    "../unsafe";

  unsafeGroup
    .decisions[1]
    .conflictGroupId =
    "../unsafe";

  await expectReject(
    "unsafe conflict group ID is rejected",
    clone(REQUEST),
    unsafeGroup,
    "conflictGroupId is not safe",
  );

  const singletonGroup =
    clone(VALID_OUTPUT);

  const secondConflict =
    singletonGroup
      .decisions[1];

  secondConflict
    .conflictDisposition =
    "none";

  secondConflict
    .conflictGroupId =
    null;

  await expectReject(
    "unresolved conflict group cannot contain only one claim",
    clone(REQUEST),
    singletonGroup,
    "must contain at least two claims",
  );

  /* ── Model cannot inject rewritten evidence ──────── */

  const statementInjection =
    clone(VALID_OUTPUT) as any;

  statementInjection
    .decisions[2]
    .statement =
    "Geek delivered 8M+ reach.";

  await expectReject(
    "Reconciler cannot inject rewritten claim statement",
    clone(REQUEST),
    statementInjection,
    "unknown field: statement",
  );

  const metricInjection =
    clone(VALID_OUTPUT) as any;

  metricInjection
    .decisions[2]
    .value =
    "10M+";

  await expectReject(
    "Reconciler cannot inject replacement metric value",
    clone(REQUEST),
    metricInjection,
    "unknown field: value",
  );

  /* ── Verification coverage ───────────────────────── */

  const missingVerification =
    clone(REQUEST);

  missingVerification
    .verification
    .results
    .pop();

  await expectReject(
    "missing semantic-verification result is rejected before reconciliation",
    missingVerification,
    VALID_OUTPUT,
    "no semantic-verification result",
  );

  const unknownVerification =
    clone(REQUEST);

  unknownVerification
    .verification
    .results[0]
    .claimId =
    "invented-claim";

  await expectReject(
    "verification result for unknown claim is rejected",
    unknownVerification,
    VALID_OUTPUT,
    "verification references unknown claim",
  );

  const duplicateVerification =
    clone(REQUEST);

  duplicateVerification
    .verification
    .results[1]
    .claimId =
    duplicateVerification
      .verification
      .results[0]
      .claimId;

  await expectReject(
    "duplicate verification result is rejected",
    duplicateVerification,
    VALID_OUTPUT,
    "Duplicate Evidence Reconciler verification result",
  );

  const badSupportedVerification =
    clone(REQUEST);

  badSupportedVerification
    .verification
    .results[0]
    .unsupportedElements = [
      "unexpected",
    ];

  await expectReject(
    "supported verification cannot contain unsupported elements",
    badSupportedVerification,
    VALID_OUTPUT,
    "cannot contain unsupportedElements",
  );

  const badPartialVerification =
    clone(REQUEST);

  const partialVerification =
    badPartialVerification
      .verification
      .results.find(
        (item) =>
          item.claimId ===
          "claim-causal-continuity",
      )!;

  partialVerification
    .unsupportedElements =
    [];

  await expectReject(
    "partial verification must identify unsupported elements",
    badPartialVerification,
    VALID_OUTPUT,
    "must identify unsupportedElements",
  );

  /* ── Re-prove verbatim evidence boundary ─────────── */

  const fabricatedEvidence =
    clone(REQUEST);

  fabricatedEvidence
    .claims[0]
    .support[0]
    .excerpt =
    "Geek activated approximately 1,058 creators.";

  await expectReject(
    "Reconciler rechecks fabricated support before model reasoning",
    fabricatedEvidence,
    VALID_OUTPUT,
    "is not verbatim in trusted source",
  );

  /* ── Invalid model output ────────────────────────── */

  const invalidDecision =
    clone(VALID_OUTPUT) as any;

  invalidDecision
    .decisions[2]
    .decision =
    "maybe";

  await expectReject(
    "invalid reconciliation decision is rejected",
    clone(REQUEST),
    invalidDecision,
    "invalid decision",
  );

  const invalidConfidence =
    clone(VALID_OUTPUT) as any;

  invalidConfidence
    .decisions[2]
    .confidence =
    "certain";

  await expectReject(
    "invalid reconciliation confidence is rejected",
    clone(REQUEST),
    invalidConfidence,
    "invalid confidence",
  );

  const rootInjection =
    clone(VALID_OUTPUT) as any;

  rootInjection.quality = {
    score:
      100,
  };

  await expectReject(
    "unknown Reconciler root field is rejected",
    clone(REQUEST),
    rootInjection,
    "unknown field: quality",
  );

  let malformedRejected =
    false;

  try {
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            "{ invalid json",
          ),
      },
    );
  } catch (error) {
    malformedRejected =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "malformed Reconciler output is rejected",
    malformedRejected,
  );

  let emptyOutputRejected =
    false;

  try {
    await reconcileEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(""),
      },
    );
  } catch (error) {
    emptyOutputRejected =
      error instanceof Error &&
      error.message.includes(
        "no structured output",
      );
  }

  check(
    "empty Reconciler output is rejected",
    emptyOutputRejected,
  );

  /* ── Auditor repair-context contract ─────────────── */

  const repairRequest =
    clone(REQUEST);

  repairRequest.repairContext = {
    attempt:
      1,

    findings: [
      {
        id:
          "missed-quantitative-conflict",

        category:
          "missed-conflict",

        severity:
          "error",

        message:
          "Two supported metric claims require another reconciliation pass.",

        claimIds: [
          "metric-final-1058",
          "metric-wider-reach",
        ],
      },
    ],
  };

  const repairPromptInputs:
    unknown[] =
    [];

  const repairResult =
    await reconcileEvidence(
      repairRequest,
      {
        client:
          fakeClient(
            JSON.stringify(
              VALID_OUTPUT,
            ),
            repairPromptInputs,
          ),
      },
    );

  check(
    "valid Auditor repairContext is accepted",
    repairResult.claims.length ===
      REQUEST.claims.length,
  );

  /**
   * Inspect the actual user prompt structurally.
   *
   * The OpenAI request contains the Reconciler prompt as a JSON
   * string inside the request object, so stringify/search would
   * double-escape field names and provide a weaker assertion.
   */
  const capturedRepairInput =
    repairPromptInputs[0] as any;

  const capturedRepairUserMessage =
    Array.isArray(
      capturedRepairInput?.input,
    )
      ? capturedRepairInput.input.find(
          (message: any) =>
            message?.role ===
            "user",
        )
      : undefined;

  let parsedRepairPrompt:
    any = null;

  try {
    if (
      typeof capturedRepairUserMessage
        ?.content ===
      "string"
    ) {
      parsedRepairPrompt =
        JSON.parse(
          capturedRepairUserMessage
            .content,
        );
    }
  } catch {
    parsedRepairPrompt =
      null;
  }

  const capturedRepairFinding =
    parsedRepairPrompt
      ?.repairContext
      ?.findings?.[0];

  check(
    "Auditor repair finding is supplied to Reconciler model prompt",
    parsedRepairPrompt
      ?.repairContext
      ?.attempt ===
      1 &&
    capturedRepairFinding?.id ===
      "missed-quantitative-conflict" &&
    capturedRepairFinding
      ?.category ===
      "missed-conflict" &&
    capturedRepairFinding
      ?.severity ===
      "error" &&
    capturedRepairFinding
      ?.message ===
      "Two supported metric claims require another reconciliation pass." &&
    JSON.stringify(
      capturedRepairFinding
        ?.claimIds,
    ) ===
      JSON.stringify([
        "metric-final-1058",
        "metric-wider-reach",
      ]),
  );

  const unknownRepairClaim =
    clone(REQUEST) as any;

  unknownRepairClaim.repairContext = {
    attempt:
      1,

    findings: [
      {
        id:
          "unknown-claim-conflict",

        category:
          "missed-conflict",

        severity:
          "error",

        message:
          "This deliberately references an unknown claim.",

        claimIds: [
          "invented-claim",
        ],
      },
    ],
  };

  await expectReject(
    "repairContext cannot reference an unknown claim",
    unknownRepairClaim as
      ReconcileEvidenceRequest,
    VALID_OUTPUT,
    "references unknown claimId",
  );

  const warningRepairFinding =
    clone(REQUEST) as any;

  warningRepairFinding.repairContext = {
    attempt:
      1,

    findings: [
      {
        id:
          "warning-cannot-trigger-repair",

        category:
          "decision-justification",

        severity:
          "warning",

        message:
          "Warnings must not enter the repair boundary.",

        claimIds: [
          "metric-final-1058",
        ],
      },
    ],
  };

  await expectReject(
    "warning finding cannot masquerade as repair error",
    warningRepairFinding as
      ReconcileEvidenceRequest,
    VALID_OUTPUT,
    "must have error severity",
  );

  const thirdRepairAttempt =
    clone(REQUEST) as any;

  thirdRepairAttempt.repairContext = {
    attempt:
      3,

    findings: [
      {
        id:
          "third-repair-attempt",

        category:
          "missed-conflict",

        severity:
          "error",

        message:
          "A third repair attempt must never be accepted.",

        claimIds: [
          "metric-final-1058",
          "metric-wider-reach",
        ],
      },
    ],
  };

  await expectReject(
    "Reconciler refuses repair attempt greater than two",
    thirdRepairAttempt as
      ReconcileEvidenceRequest,
    VALID_OUTPUT,
    "permits only repair attempt 1 or 2",
  );

  /* ── Zero-candidate fast path ────────────────────── */

  const emptyRequest:
    ReconcileEvidenceRequest = {
      sources:
        clone(
          REQUEST.sources,
        ),

      claims: [],

      verification: {
        results: [],
      },
    };

  const emptyResult =
    await reconcileEvidence(
      emptyRequest,
    );

  check(
    "zero candidate claims require no model call",
    emptyResult.claims.length ===
      0 &&
      emptyResult.audit.length ===
        0,
  );

  /* ── Input immutability ──────────────────────────── */

  check(
    "Reconciler does not mutate trusted request",
    JSON.stringify(
      REQUEST,
    ) ===
      requestBefore,
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

main().catch(
  (error) => {
    console.error(error);

    process.exit(1);
  },
);
