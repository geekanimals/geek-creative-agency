/**
 * GOLD STANDARD CASE STUDY AGENT — EVIDENCE RECONCILER
 *
 * Candidate evidence claims
 *   → independent semantic-verification results
 *   → reconciliation
 *   → final EvidenceClaim[]
 *
 * RESPONSIBILITY:
 *
 * - preserve candidate evidence exactly;
 * - distinguish compatible scope differences from real conflicts;
 * - identify unresolved conflicts;
 * - assign internal confidence;
 * - recommend publication disposition;
 * - deterministically enforce verifier + conflict safety.
 *
 * The Reconciler NEVER rewrites:
 * - claim id
 * - claim type
 * - claim statement
 * - sourceIds
 * - verbatim support
 *
 * NO Payload.
 * NO database.
 * NO CMS.
 * NO publishing.
 */

import OpenAI from "openai";

import {
  EVIDENCE_RECONCILIATION_RESPONSE_FORMAT,
  RECONCILIATION_CONFIDENCE,
  RECONCILIATION_DECISIONS,
  CONFLICT_DISPOSITIONS,
} from "./reconciliationSchema";

import {
  validateEvidenceExtraction,
} from "./extractor";

import type {
  CandidateEvidenceClaim,
} from "./extractor";

import type {
  GenerationSource,
} from "./generator";

import type {
  ClaimVerificationBatch,
  ClaimVerificationResult,
  EvidenceVerificationVerdict,
} from "./verificationSchema";

import type {
  ClaimConfidence,
  EvidenceClaim,
} from "./types";

/* ── Public contracts ───────────────────────────────── */

export type ReconcileEvidenceRequest = {
  sources: GenerationSource[];

  claims: CandidateEvidenceClaim[];

  verification: ClaimVerificationBatch;

  model?: string;
};

export type ReconcileEvidenceOptions = {
  client?: OpenAI;
};

export type ReconciliationAuditEntry = {
  claimId: string;

  verifierVerdict:
    EvidenceVerificationVerdict;

  requestedDecision:
    | "publish"
    | "withhold";

  requestedConfidence:
    ClaimConfidence;

  conflictDisposition:
    | "none"
    | "unresolved";

  conflictGroupId?: string;

  reason: string;

  /**
   * Final deterministic result after safety enforcement.
   */
  effectiveConfidence:
    ClaimConfidence;

  publishable: boolean;
};

export type ReconciledEvidenceResult = {
  claims: EvidenceClaim[];

  /**
   * Internal-only reconciliation audit trail.
   *
   * Never written to the public CMS.
   */
  audit:
    ReconciliationAuditEntry[];
};

/* ── Internal model-output shape ────────────────────── */

type ReconciliationDecision = {
  claimId: string;

  decision:
    | "publish"
    | "withhold";

  confidence:
    ClaimConfidence;

  conflictDisposition:
    | "none"
    | "unresolved";

  conflictGroupId:
    string | null;

  reason: string;
};

type ReconciliationModelOutput = {
  decisions:
    ReconciliationDecision[];
};

/* ── Helpers ────────────────────────────────────────── */

function nonEmpty(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    Boolean(value.trim())
  );
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function exactKeys(
  object: Record<string, unknown>,
  allowed: string[],
  label: string,
) {
  const allowedSet =
    new Set(allowed);

  for (
    const key
    of Object.keys(object)
  ) {
    if (!allowedSet.has(key)) {
      throw new Error(
        `${label} contains unknown field: ${key}`,
      );
    }
  }
}

function assertSafeConflictGroupId(
  id: string,
) {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/
      .test(id)
  ) {
    throw new Error(
      `Reconciliation conflictGroupId is not safe: ${id}`,
    );
  }
}

/* ── Trusted-source validation ──────────────────────── */

function validateSourceRegistry(
  sources: GenerationSource[],
) {
  if (!Array.isArray(sources)) {
    throw new Error(
      "Evidence Reconciler sources must be an array.",
    );
  }

  const ids =
    new Set<string>();

  for (
    const source
    of sources
  ) {
    if (!nonEmpty(source.id)) {
      throw new Error(
        "Every Evidence Reconciler source requires an id.",
      );
    }

    const id =
      source.id.trim();

    if (ids.has(id)) {
      throw new Error(
        `Duplicate Evidence Reconciler source id: ${id}`,
      );
    }

    ids.add(id);

    if (!nonEmpty(source.title)) {
      throw new Error(
        `Evidence Reconciler source ${id} requires a title.`,
      );
    }

    if (!nonEmpty(source.content)) {
      throw new Error(
        `Evidence Reconciler source ${id} has no content.`,
      );
    }
  }
}

/* ── Verification validation ────────────────────────── */

function validateVerificationCoverage(
  claims: CandidateEvidenceClaim[],
  verification: ClaimVerificationBatch,
): Map<
  string,
  ClaimVerificationResult
> {
  if (
    !verification ||
    !Array.isArray(
      verification.results,
    )
  ) {
    throw new Error(
      "Evidence Reconciler requires semantic-verification results.",
    );
  }

  const claimIds =
    new Set(
      claims.map(
        (claim) =>
          claim.id,
      ),
    );

  const resultById =
    new Map<
      string,
      ClaimVerificationResult
    >();

  for (
    const [
      index,
      result,
    ] of verification.results.entries()
  ) {
    if (!isObject(result)) {
      throw new Error(
        `Evidence Reconciler verification result[${index}] is malformed.`,
      );
    }

    if (!nonEmpty(result.claimId)) {
      throw new Error(
        `Evidence Reconciler verification result[${index}] has no claimId.`,
      );
    }

    const claimId =
      result.claimId.trim();

    if (
      !claimIds.has(
        claimId,
      )
    ) {
      throw new Error(
        `Evidence Reconciler verification references unknown claim: ${claimId}`,
      );
    }

    if (
      resultById.has(
        claimId,
      )
    ) {
      throw new Error(
        `Duplicate Evidence Reconciler verification result: ${claimId}`,
      );
    }

    if (
      result.verdict !==
        "supported" &&
      result.verdict !==
        "partial" &&
      result.verdict !==
        "unsupported"
    ) {
      throw new Error(
        `Evidence Reconciler verification has invalid verdict for ${claimId}.`,
      );
    }

    if (!nonEmpty(result.reason)) {
      throw new Error(
        `Evidence Reconciler verification has no reason for ${claimId}.`,
      );
    }

    if (
      !Array.isArray(
        result.unsupportedElements,
      ) ||
      !result.unsupportedElements.every(
        (value) =>
          typeof value ===
          "string",
      )
    ) {
      throw new Error(
        `Evidence Reconciler verification has invalid unsupportedElements for ${claimId}.`,
      );
    }

    const unsupported =
      result.unsupportedElements
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean);

    if (
      result.verdict ===
        "supported" &&
      unsupported.length > 0
    ) {
      throw new Error(
        `Supported reconciliation claim ${claimId} cannot contain unsupportedElements.`,
      );
    }

    if (
      result.verdict !==
        "supported" &&
      unsupported.length === 0
    ) {
      throw new Error(
        `${result.verdict} reconciliation claim ${claimId} must identify unsupportedElements.`,
      );
    }

    resultById.set(
      claimId,
      {
        claimId,

        verdict:
          result.verdict,

        reason:
          result.reason.trim(),

        unsupportedElements:
          unsupported,
      },
    );
  }

  for (
    const claim
    of claims
  ) {
    if (
      !resultById.has(
        claim.id,
      )
    ) {
      throw new Error(
        `Evidence Reconciler has no semantic-verification result for claim: ${claim.id}`,
      );
    }
  }

  if (
    resultById.size !==
    claims.length
  ) {
    throw new Error(
      "Evidence Reconciler verification coverage does not exactly match candidate claims.",
    );
  }

  return resultById;
}

/* ── Request validation ─────────────────────────────── */

function validateReconcileRequest(
  request: ReconcileEvidenceRequest,
): Map<
  string,
  ClaimVerificationResult
> {
  validateSourceRegistry(
    request.sources,
  );

  /**
   * Reuse the Extractor's deterministic boundary.
   *
   * This re-proves:
   * - candidate shape;
   * - exact source IDs;
   * - verbatim excerpts;
   * - no dangling evidence.
   *
   * Reconciliation does not merely trust that another caller
   * previously ran the Extractor correctly.
   */
  validateEvidenceExtraction(
    {
      claims:
        request.claims,
    },
    request.sources,
  );

  return validateVerificationCoverage(
    request.claims,
    request.verification,
  );
}

/* ── Prompt ─────────────────────────────────────────── */

const RECONCILER_SYSTEM_PROMPT = `
You are the Evidence Reconciler for Geek Creative Agency's Gold Standard Case Study system.

You receive:

1. evidence candidate claims already bound to exact trusted source excerpts;
2. independent semantic-verification results for every claim;
3. trusted source metadata.

Your job is NOT to rewrite evidence.

Your job is to decide whether each EXACT claim should be published or withheld,
what confidence applies to that exact claim, and whether it participates in an
UNRESOLVED factual conflict.

HARD RULES:

1. Preserve every claim exactly as supplied.

   Never rewrite:
   - claim ID
   - claim type
   - statement
   - number
   - attribution
   - scope
   - source IDs
   - support excerpts

2. You must return exactly one decision for every supplied claim.

3. SEMANTIC VERIFIER:

   If verifier verdict is:
   - partial
   - unsupported

   decision MUST be "withhold".

   Do not attempt to repair or reinterpret the claim.

4. CONFLICTS:

   Mark conflictDisposition="unresolved" only when supplied claims make materially
   incompatible assertions about the same relevant subject, scope, attribution,
   period and meaning, and the supplied evidence does not resolve the difference.

5. DIFFERENT SCOPE IS NOT AUTOMATICALLY A CONFLICT.

   Examples:

   Geek tracked subset
   versus
   wider campaign

   are different scopes when the evidence explicitly says so.

   Do not merge them.

6. DIFFERENT PERIOD IS NOT AUTOMATICALLY A CONFLICT.

   An older figure and a later figure may both be true if the evidence establishes
   different dates, reporting windows or stages.

   Do not invent chronology that is absent from evidence.

7. SOURCE SUPERSESSION:

   Treat an apparent conflict as resolved only when supplied evidence or trusted
   source metadata explicitly establishes a meaningful reason such as:
   - different scope;
   - different period;
   - revised/final reporting;
   - explicit supersession.

   Do not simply choose whichever source sounds more authoritative.

8. UNRESOLVED CONFLICTS:

   Every claim in the same unresolved conflict must:
   - use conflictDisposition="unresolved";
   - share the same conflictGroupId;
   - be withheld.

9. SCOPE / ATTRIBUTION:

   Preserve distinctions including:
   - Geek-specific activity;
   - tracked subset;
   - wider campaign;
   - partner amplification;
   - estimated values;
   - historical comparisons.

10. FINANCIAL / VALUE LANGUAGE:

    Estimated creator media value,
    historical value comparison,
    ROI,
    revenue,
    profit,
    audited financial return

    are materially different concepts.

    Never transform one into another.

11. SERVICE / SOLUTION:

    Evidence for a Service does not automatically establish a Solution/IP relationship.

12. CHRONOLOGY / CAUSALITY:

    Project A preceding Project B does not by itself establish that A caused B.

13. CONFIDENCE:

    "high":
    - exact claim is fully supported;
    - scope and attribution are clear;
    - no unresolved material conflict.

    "medium":
    - exact claim is supported;
    - but publication deserves explicit caution because of source/context limitations
      that do not amount to contradiction.

    "low":
    - partial / unsupported verification;
    - unresolved conflict;
    - or material uncertainty.

14. PUBLICATION:

    Recommend "publish" only when:
    - verifier verdict is supported;
    - conflictDisposition is none;
    - confidence is high or medium;
    - scope / attribution are sufficiently clear.

15. Do not add facts in reason.

    reason is internal reconciliation explanation only.

16. conflictGroupId:
    - null when conflictDisposition="none";
    - a short lowercase hyphenated ID when conflictDisposition="unresolved".

17. It is acceptable for every claim to be withheld.
    Evidence safety is more important than producing public copy.
`.trim();

/* ── Prompt input ───────────────────────────────────── */

function sourceRegistryForPrompt(
  sources: GenerationSource[],
) {
  return sources.map(
    (source) => ({
      id:
        source.id,

      kind:
        source.kind,

      title:
        source.title,

      publisher:
        source.publisher ??
        null,

      publicationDate:
        source.publicationDate ??
        null,

      capturedAt:
        source.capturedAt ??
        null,

      notes:
        source.notes ??
        null,
    }),
  );
}

function claimsForPrompt(
  claims: CandidateEvidenceClaim[],
  verificationById:
    Map<
      string,
      ClaimVerificationResult
    >,
) {
  return claims.map(
    (claim) => {
      const verification =
        verificationById.get(
          claim.id,
        )!;

      return {
        id:
          claim.id,

        type:
          claim.type,

        statement:
          claim.statement,

        sourceIds: [
          ...claim.sourceIds,
        ],

        support:
          claim.support.map(
            (item) => ({
              sourceId:
                item.sourceId,

              excerpt:
                item.excerpt,
            }),
          ),

        verification: {
          verdict:
            verification.verdict,

          reason:
            verification.reason,

          unsupportedElements:
            verification
              .unsupportedElements,
        },
      };
    },
  );
}

function buildReconcilerPrompt(
  request:
    ReconcileEvidenceRequest,
  verificationById:
    Map<
      string,
      ClaimVerificationResult
    >,
): string {
  return JSON.stringify(
    {
      task:
        "Reconcile candidate claims without rewriting evidence.",

      trustedSources:
        sourceRegistryForPrompt(
          request.sources,
        ),

      candidateClaims:
        claimsForPrompt(
          request.claims,
          verificationById,
        ),
    },
    null,
    2,
  );
}

/* ── Model-output validation ────────────────────────── */

function validateReconciliationOutput(
  input: unknown,
  claims: CandidateEvidenceClaim[],
): ReconciliationModelOutput {
  if (!isObject(input)) {
    throw new Error(
      "Evidence Reconciler output must be an object.",
    );
  }

  exactKeys(
    input,
    [
      "decisions",
    ],
    "Evidence Reconciler output",
  );

  if (
    !Array.isArray(
      input.decisions,
    )
  ) {
    throw new Error(
      "Evidence Reconciler output requires decisions array.",
    );
  }

  if (
    input.decisions.length !==
    claims.length
  ) {
    throw new Error(
      "Evidence Reconciler must return exactly one decision per candidate claim.",
    );
  }

  const allowedClaimIds =
    new Set(
      claims.map(
        (claim) =>
          claim.id,
      ),
    );

  const seenClaimIds =
    new Set<string>();

  const decisions:
    ReconciliationDecision[] =
    [];

  for (
    const [
      index,
      raw,
    ] of input.decisions.entries()
  ) {
    const label =
      `Evidence Reconciler decision[${index}]`;

    if (!isObject(raw)) {
      throw new Error(
        `${label} must be an object.`,
      );
    }

    exactKeys(
      raw,
      [
        "claimId",
        "decision",
        "confidence",
        "conflictDisposition",
        "conflictGroupId",
        "reason",
      ],
      label,
    );

    if (!nonEmpty(raw.claimId)) {
      throw new Error(
        `${label} requires claimId.`,
      );
    }

    const claimId =
      raw.claimId.trim();

    if (
      !allowedClaimIds.has(
        claimId,
      )
    ) {
      throw new Error(
        `${label} references unknown candidate claim: ${claimId}`,
      );
    }

    if (
      seenClaimIds.has(
        claimId,
      )
    ) {
      throw new Error(
        `Duplicate Evidence Reconciler decision for claim: ${claimId}`,
      );
    }

    seenClaimIds.add(
      claimId,
    );

    if (
      typeof raw.decision !==
        "string" ||
      !(
        RECONCILIATION_DECISIONS as
          readonly string[]
      ).includes(
        raw.decision,
      )
    ) {
      throw new Error(
        `${label} has invalid decision.`,
      );
    }

    if (
      typeof raw.confidence !==
        "string" ||
      !(
        RECONCILIATION_CONFIDENCE as
          readonly string[]
      ).includes(
        raw.confidence,
      )
    ) {
      throw new Error(
        `${label} has invalid confidence.`,
      );
    }

    if (
      typeof raw.conflictDisposition !==
        "string" ||
      !(
        CONFLICT_DISPOSITIONS as
          readonly string[]
      ).includes(
        raw.conflictDisposition,
      )
    ) {
      throw new Error(
        `${label} has invalid conflictDisposition.`,
      );
    }

    let conflictGroupId:
      string | null =
      null;

    if (
      raw.conflictDisposition ===
      "none"
    ) {
      if (
        raw.conflictGroupId !==
        null
      ) {
        throw new Error(
          `${label} must use conflictGroupId=null when no unresolved conflict exists.`,
        );
      }
    } else {
      if (
        !nonEmpty(
          raw.conflictGroupId,
        )
      ) {
        throw new Error(
          `${label} requires conflictGroupId for unresolved conflict.`,
        );
      }

      conflictGroupId =
        raw.conflictGroupId.trim();

      assertSafeConflictGroupId(
        conflictGroupId,
      );
    }

    if (!nonEmpty(raw.reason)) {
      throw new Error(
        `${label} requires reconciliation reason.`,
      );
    }

    decisions.push({
      claimId,

      decision:
        raw.decision as
          | "publish"
          | "withhold",

      confidence:
        raw.confidence as
          ClaimConfidence,

      conflictDisposition:
        raw.conflictDisposition as
          | "none"
          | "unresolved",

      conflictGroupId,

      reason:
        raw.reason.trim(),
    });
  }

  for (
    const claim
    of claims
  ) {
    if (
      !seenClaimIds.has(
        claim.id,
      )
    ) {
      throw new Error(
        `Evidence Reconciler omitted claim: ${claim.id}`,
      );
    }
  }

  /**
   * Every unresolved conflict group must contain at least two claims.
   *
   * A claim cannot conflict only with itself.
   */
  const conflictGroups =
    new Map<
      string,
      string[]
    >();

  for (
    const decision
    of decisions
  ) {
    if (
      decision.conflictDisposition !==
        "unresolved" ||
      !decision.conflictGroupId
    ) {
      continue;
    }

    const members =
      conflictGroups.get(
        decision.conflictGroupId,
      ) ?? [];

    members.push(
      decision.claimId,
    );

    conflictGroups.set(
      decision.conflictGroupId,
      members,
    );
  }

  for (
    const [
      groupId,
      members,
    ] of conflictGroups
  ) {
    if (
      members.length < 2
    ) {
      throw new Error(
        `Evidence Reconciler conflict group ${groupId} must contain at least two claims.`,
      );
    }
  }

  return {
    decisions,
  };
}

/* ── Deterministic enforcement ─────────────────────── */

function effectiveConfidence(
  requested:
    ClaimConfidence,
  verdict:
    EvidenceVerificationVerdict,
  conflictDisposition:
    | "none"
    | "unresolved",
): ClaimConfidence {
  /**
   * A partial / unsupported claim can never emerge
   * from reconciliation with medium/high confidence.
   */
  if (
    verdict !==
    "supported"
  ) {
    return "low";
  }

  /**
   * An unresolved conflict is material uncertainty.
   */
  if (
    conflictDisposition ===
    "unresolved"
  ) {
    return "low";
  }

  return requested;
}

function effectivePublishable(
  decision:
    | "publish"
    | "withhold",
  confidence:
    ClaimConfidence,
  verdict:
    EvidenceVerificationVerdict,
  conflictDisposition:
    | "none"
    | "unresolved",
): boolean {
  if (
    verdict !==
    "supported"
  ) {
    return false;
  }

  if (
    conflictDisposition ===
    "unresolved"
  ) {
    return false;
  }

  if (
    confidence ===
    "low"
  ) {
    return false;
  }

  return (
    decision ===
    "publish"
  );
}

/* ── Build trusted final ledger ─────────────────────── */

function buildReconciledLedger(
  request:
    ReconcileEvidenceRequest,
  verificationById:
    Map<
      string,
      ClaimVerificationResult
    >,
  output:
    ReconciliationModelOutput,
): ReconciledEvidenceResult {
  const decisionById =
    new Map(
      output.decisions.map(
        (decision) => [
          decision.claimId,
          decision,
        ] as const,
      ),
    );

  const claims:
    EvidenceClaim[] =
    [];

  const audit:
    ReconciliationAuditEntry[] =
    [];

  /**
   * Preserve original candidate order.
   */
  for (
    const candidate
    of request.claims
  ) {
    const verification =
      verificationById.get(
        candidate.id,
      )!;

    const decision =
      decisionById.get(
        candidate.id,
      )!;

    const confidence =
      effectiveConfidence(
        decision.confidence,
        verification.verdict,
        decision.conflictDisposition,
      );

    const publishable =
      effectivePublishable(
        decision.decision,
        confidence,
        verification.verdict,
        decision.conflictDisposition,
      );

    /**
     * Candidate factual material is copied exactly.
     *
     * The model cannot rewrite evidence at this boundary.
     */
    claims.push({
      id:
        candidate.id,

      type:
        candidate.type,

      statement:
        candidate.statement,

      sourceIds: [
        ...candidate.sourceIds,
      ],

      support:
        candidate.support.map(
          (item) => ({
            sourceId:
              item.sourceId,

            excerpt:
              item.excerpt,
          }),
        ),

      confidence,

      publishable,

      note:
        decision.reason,
    });

    audit.push({
      claimId:
        candidate.id,

      verifierVerdict:
        verification.verdict,

      requestedDecision:
        decision.decision,

      requestedConfidence:
        decision.confidence,

      conflictDisposition:
        decision.conflictDisposition,

      conflictGroupId:
        decision
          .conflictGroupId ??
        undefined,

      reason:
        decision.reason,

      effectiveConfidence:
        confidence,

      publishable,
    });
  }

  return {
    claims,

    audit,
  };
}

/* ── Public API ─────────────────────────────────────── */

export async function reconcileEvidence(
  request:
    ReconcileEvidenceRequest,
  options:
    ReconcileEvidenceOptions = {},
): Promise<ReconciledEvidenceResult> {
  const verificationById =
    validateReconcileRequest(
      request,
    );

  /**
   * Nothing to reconcile.
   *
   * Avoid an unnecessary model call.
   */
  if (
    request.claims.length ===
    0
  ) {
    return {
      claims: [],
      audit: [],
    };
  }

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (
    !options.client &&
    !apiKey
  ) {
    throw new Error(
      "OPENAI_API_KEY is required for Evidence Reconciler generation.",
    );
  }

  const client =
    options.client ??
    new OpenAI({
      apiKey,
    });

  const model =
    request.model ??
    process.env
      .CASE_STUDY_AGENT_RECONCILER_MODEL ??
    process.env
      .CASE_STUDY_AGENT_MODEL ??
    "gpt-5.6";

  const response =
    await client.responses.create({
      model,

      input: [
        {
          role:
            "system",

          content:
            RECONCILER_SYSTEM_PROMPT,
        },

        {
          role:
            "user",

          content:
            buildReconcilerPrompt(
              request,
              verificationById,
            ),
        },
      ],

      text: {
        format:
          EVIDENCE_RECONCILIATION_RESPONSE_FORMAT as any,
      },
    });

  const outputText =
    response.output_text
      ?.trim();

  if (!outputText) {
    throw new Error(
      "Evidence Reconciler returned no structured output.",
    );
  }

  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        outputText,
      );
  } catch (error) {
    throw new Error(
      `Evidence Reconciler returned invalid JSON despite Structured Outputs: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  const output =
    validateReconciliationOutput(
      parsed,
      request.claims,
    );

  return buildReconciledLedger(
    request,
    verificationById,
    output,
  );
}
