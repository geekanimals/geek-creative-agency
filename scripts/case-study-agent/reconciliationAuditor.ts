/**
 * GOLD STANDARD CASE STUDY AGENT
 * INDEPENDENT RECONCILIATION AUDITOR
 *
 * Candidate evidence
 *   + independent verifier verdicts
 *   + Reconciler audit trail
 *   + final EvidenceClaim ledger
 *   → independent reconciliation audit
 *
 * PURPOSE
 *
 * The downstream Semantic Critic sees only publication-ready evidence.
 * It therefore cannot discover a conflict that the Reconciler failed to
 * identify and accidentally allowed through.
 *
 * This Auditor reviews the ENTIRE reconciliation boundary independently.
 *
 * It may detect:
 * - missed conflicts;
 * - unsafe publication;
 * - unsafe confidence;
 * - incorrect conflict grouping;
 * - compatible scope differences incorrectly treated as conflicts;
 * - unjustified reconciliation decisions;
 * - ledger integrity failures.
 *
 * IMPORTANT
 *
 * - No rewriting.
 * - No new facts.
 * - No choosing a preferred source by intuition.
 * - No CMS.
 * - No Payload.
 * - No database.
 * - No publishing.
 */

import OpenAI from "openai";

import {
  RECONCILIATION_AUDITOR_RESPONSE_FORMAT,
  RECONCILIATION_AUDIT_CATEGORIES,
  RECONCILIATION_AUDIT_SEVERITIES,
} from "./reconciliationAuditorSchema";

import type {
  ReconciliationAuditCategory,
  ReconciliationAuditSeverity,
} from "./reconciliationAuditorSchema";

import type {
  CandidateEvidenceClaim,
} from "./extractor";

import type {
  ClaimVerificationBatch,
  ClaimVerificationResult,
} from "./verificationSchema";

import type {
  ReconciliationAuditEntry,
} from "./reconciler";

import type {
  EvidenceClaim,
} from "./types";

/* ── Public contracts ─────────────────────────────── */

export type ReconciliationAuditorRequest = {
  candidates:
    CandidateEvidenceClaim[];

  verification:
    ClaimVerificationBatch;

  reconciliationAudit:
    ReconciliationAuditEntry[];

  claims:
    EvidenceClaim[];

  model?:
    string;
};

export type ReconciliationAuditorOptions = {
  client?:
    OpenAI;
};

export type ReconciliationAuditorFinding = {
  id:
    string;

  category:
    ReconciliationAuditCategory;

  severity:
    ReconciliationAuditSeverity;

  message:
    string;

  claimIds:
    string[];
};

export type ReconciliationAuditorResult = {
  status:
    | "pass"
    | "partial"
    | "fail";

  /**
   * False when any error exists.
   *
   * The Evidence Pipeline must eventually fail closed
   * when this is false.
   */
  safeToContinue:
    boolean;

  /**
   * Deterministic score.
   *
   * error   = -18
   * warning = -6
   */
  score:
    number;

  summary:
    string;

  findings:
    ReconciliationAuditorFinding[];
};

/* ── Internal model shape ─────────────────────────── */

type ReconciliationAuditorModelOutput = {
  summary:
    string;

  findings:
    Array<{
      id:
        string;

      category:
        ReconciliationAuditCategory;

      severity:
        ReconciliationAuditSeverity;

      message:
        string;

      claimIds:
        string[];
    }>;
};

/* ── Constants ────────────────────────────────────── */

const SAFE_ID =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SYSTEM_PROMPT = `
You are the independent Reconciliation Auditor inside a Gold Standard case-study evidence system.

You are NOT the Extractor.
You are NOT the Verifier.
You are NOT the Reconciler.
You are NOT the case-study writer.

Your only job is to audit whether reconciliation was semantically safe.

You receive:
1. every extracted candidate claim;
2. every independent verifier result;
3. every reconciliation decision and deterministic outcome;
4. every final EvidenceClaim, including withheld claims.

AUDIT FOR:

- conflicts the Reconciler failed to identify;
- materially incompatible figures presented as compatible;
- same metric / same scope / same period claims with contradictory values;
- unsafe publication;
- unsafe confidence;
- incorrect conflict grouping;
- unjustified publication or withholding;
- important scope, denominator, period, geography or attribution distinctions;
- contradictions between reconciliation reasoning and the actual claims;
- final-ledger decisions that misrepresent the input evidence.

CRITICAL CONFLICT RULE:

Different numbers are NOT automatically conflicting.

Two figures can coexist when they refer to meaningfully different:
- populations;
- scopes;
- campaign components;
- geographies;
- time periods;
- channels;
- denominators;
- attribution boundaries;
- Geek-specific versus wider-campaign measurements;
- historical comparison versus current result.

Only treat claims as conflicting when their material meaning actually competes.

Do NOT resolve a conflict by assuming one source is more authoritative.
Do NOT infer supersession unless the supplied evidence explicitly establishes it.
Do NOT invent missing dates, scopes, causality, attribution or relationships.

SEVERITY:

ERROR:
- missed material conflict that could allow misleading evidence downstream;
- unsupported / partial evidence effectively published;
- misleading metric interpretation;
- unsafe confidence that materially affects publication;
- reconciliation that creates a materially false or contradictory ledger.

WARNING:
- unnecessary withholding;
- overly conservative treatment of compatible evidence;
- weak reconciliation reasoning where the final ledger is still safe;
- non-blocking ambiguity.

Every finding must reference the affected claim IDs.

A "missed-conflict" finding MUST reference at least two claim IDs.

Do not rewrite claims.
Do not suggest replacement copy.
Do not create new evidence.
Do not output scores, pass/fail status or publication decisions.
`.trim();

/* ── Helpers ──────────────────────────────────────── */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function nonEmpty(
  value: unknown,
): value is string {
  return (
    typeof value ===
      "string" &&
    Boolean(
      value.trim(),
    )
  );
}

function exactKeys(
  object:
    Record<string, unknown>,
  allowed:
    string[],
  context:
    string,
) {
  const allow =
    new Set(
      allowed,
    );

  for (
    const key
    of Object.keys(
      object,
    )
  ) {
    if (
      !allow.has(
        key,
      )
    ) {
      throw new Error(
        `${context} contains unknown field: ${key}`,
      );
    }
  }
}

function assertSafeId(
  value: unknown,
  context: string,
): asserts value is string {
  if (
    !nonEmpty(
      value,
    ) ||
    !SAFE_ID.test(
      value.trim(),
    )
  ) {
    throw new Error(
      `${context} must be a safe lower-kebab-case ID.`,
    );
  }
}

function sameStringArray(
  left:
    string[] | undefined,
  right:
    string[] | undefined,
): boolean {
  const a =
    left ?? [];

  const b =
    right ?? [];

  return (
    a.length ===
      b.length &&
    a.every(
      (value, index) =>
        value ===
        b[index],
    )
  );
}

function sameSupport(
  candidate:
    CandidateEvidenceClaim,
  claim:
    EvidenceClaim,
): boolean {
  const claimSupport =
    claim.support ?? [];

  if (
    candidate.support.length !==
    claimSupport.length
  ) {
    return false;
  }

  return candidate.support.every(
    (item, index) =>
      item.sourceId ===
        claimSupport[index]
          ?.sourceId &&
      item.excerpt ===
        claimSupport[index]
          ?.excerpt,
  );
}

function mapUniqueById<T extends {
  id?: string;
  claimId?: string;
}>(
  values:
    T[],
  kind:
    "id" | "claimId",
  context:
    string,
): Map<string, T> {
  const map =
    new Map<string, T>();

  for (
    const value
    of values
  ) {
    const id =
      kind ===
      "id"
        ? value.id
        : value.claimId;

    assertSafeId(
      id,
      `${context}.${kind}`,
    );

    if (
      map.has(
        id,
      )
    ) {
      throw new Error(
        `${context} contains duplicate ${kind}: ${id}`,
      );
    }

    map.set(
      id,
      value,
    );
  }

  return map;
}

function assertExactCoverage(
  candidateIds:
    Set<string>,
  actualIds:
    Set<string>,
  context:
    string,
) {
  for (
    const candidateId
    of candidateIds
  ) {
    if (
      !actualIds.has(
        candidateId,
      )
    ) {
      throw new Error(
        `${context} is missing claimId: ${candidateId}`,
      );
    }
  }

  for (
    const actualId
    of actualIds
  ) {
    if (
      !candidateIds.has(
        actualId,
      )
    ) {
      throw new Error(
        `${context} contains unknown claimId: ${actualId}`,
      );
    }
  }
}

function finding(
  id:
    string,
  category:
    ReconciliationAuditCategory,
  severity:
    ReconciliationAuditSeverity,
  message:
    string,
  claimIds:
    string[],
): ReconciliationAuditorFinding {
  return {
    id,
    category,
    severity,
    message,
    claimIds:
      [
        ...claimIds,
      ],
  };
}

/* ── Deterministic structural + safety audit ───────── */

function validateAndBuildDeterministicFindings(
  request:
    ReconciliationAuditorRequest,
): ReconciliationAuditorFinding[] {
  if (
    !Array.isArray(
      request.candidates,
    ) ||
    !Array.isArray(
      request.verification
        ?.results,
    ) ||
    !Array.isArray(
      request.reconciliationAudit,
    ) ||
    !Array.isArray(
      request.claims,
    )
  ) {
    throw new Error(
      "Reconciliation Auditor requires candidate, verification, reconciliation and final claim arrays.",
    );
  }

  const candidateMap =
    mapUniqueById(
      request.candidates,
      "id",
      "Reconciliation Auditor candidates",
    );

  const verificationMap =
    mapUniqueById(
      request.verification
        .results,
      "claimId",
      "Reconciliation Auditor verification",
    );

  const reconciliationMap =
    mapUniqueById(
      request.reconciliationAudit,
      "claimId",
      "Reconciliation Auditor reconciliationAudit",
    );

  const claimMap =
    mapUniqueById(
      request.claims,
      "id",
      "Reconciliation Auditor final claims",
    );

  const candidateIds =
    new Set(
      candidateMap.keys(),
    );

  assertExactCoverage(
    candidateIds,
    new Set(
      verificationMap.keys(),
    ),
    "Reconciliation Auditor verification",
  );

  assertExactCoverage(
    candidateIds,
    new Set(
      reconciliationMap.keys(),
    ),
    "Reconciliation Auditor reconciliationAudit",
  );

  assertExactCoverage(
    candidateIds,
    new Set(
      claimMap.keys(),
    ),
    "Reconciliation Auditor final claims",
  );

  const findings:
    ReconciliationAuditorFinding[] =
    [];

  const conflictGroups =
    new Map<
      string,
      string[]
    >();

  for (
    const candidate
    of request.candidates
  ) {
    const verification =
      verificationMap.get(
        candidate.id,
      ) as ClaimVerificationResult;

    const audit =
      reconciliationMap.get(
        candidate.id,
      ) as ReconciliationAuditEntry;

    const claim =
      claimMap.get(
        candidate.id,
      ) as EvidenceClaim;

    /**
     * Reconciler is not allowed to rewrite evidence.
     */
    if (
      claim.type !==
        candidate.type ||
      claim.statement !==
        candidate.statement ||
      !sameStringArray(
        claim.sourceIds,
        candidate.sourceIds,
      ) ||
      !sameSupport(
        candidate,
        claim,
      )
    ) {
      findings.push(
        finding(
          `ledger-mutation-${candidate.id}`,
          "ledger-integrity",
          "error",
          `Final evidence claim "${candidate.id}" does not exactly preserve the extracted candidate evidence.`,
          [
            candidate.id,
          ],
        ),
      );
    }

    /**
     * Audit must use the actual independent verifier verdict.
     */
    if (
      audit.verifierVerdict !==
      verification.verdict
    ) {
      findings.push(
        finding(
          `verifier-mismatch-${candidate.id}`,
          "ledger-integrity",
          "error",
          `Reconciliation audit for "${candidate.id}" does not preserve the independent verifier verdict.`,
          [
            candidate.id,
          ],
        ),
      );
    }

    /**
     * Final deterministic confidence/publication must match
     * the reconciliation audit record.
     */
    if (
      claim.confidence !==
        audit.effectiveConfidence ||
      claim.publishable !==
        audit.publishable
    ) {
      findings.push(
        finding(
          `final-state-mismatch-${candidate.id}`,
          "ledger-integrity",
          "error",
          `Final evidence state for "${candidate.id}" does not match the reconciliation audit trail.`,
          [
            candidate.id,
          ],
        ),
      );
    }

    /**
     * Partial / unsupported evidence may never publish.
     */
    if (
      verification.verdict !==
        "supported" &&
      claim.publishable
    ) {
      findings.push(
        finding(
          `unsafe-verification-publication-${candidate.id}`,
          "unsafe-publication",
          "error",
          `Claim "${candidate.id}" is publication-ready despite verifier verdict "${verification.verdict}".`,
          [
            candidate.id,
          ],
        ),
      );
    }

    /**
     * Low confidence may never publish.
     */
    if (
      claim.confidence ===
        "low" &&
      claim.publishable
    ) {
      findings.push(
        finding(
          `unsafe-low-confidence-publication-${candidate.id}`,
          "unsafe-confidence",
          "error",
          `Low-confidence claim "${candidate.id}" is marked publication-ready.`,
          [
            candidate.id,
          ],
        ),
      );
    }

    /**
     * Unresolved conflicts may never publish.
     */
    if (
      audit.conflictDisposition ===
        "unresolved"
    ) {
      if (
        !audit.conflictGroupId
      ) {
        findings.push(
          finding(
            `missing-conflict-group-${candidate.id}`,
            "conflict-group-integrity",
            "error",
            `Unresolved claim "${candidate.id}" has no conflictGroupId.`,
            [
              candidate.id,
            ],
          ),
        );
      } else {
        assertSafeId(
          audit.conflictGroupId,
          `Reconciliation Auditor conflictGroupId for ${candidate.id}`,
        );

        const existing =
          conflictGroups.get(
            audit.conflictGroupId,
          ) ?? [];

        existing.push(
          candidate.id,
        );

        conflictGroups.set(
          audit.conflictGroupId,
          existing,
        );
      }

      if (
        claim.publishable
      ) {
        findings.push(
          finding(
            `unresolved-conflict-published-${candidate.id}`,
            "unsafe-publication",
            "error",
            `Claim "${candidate.id}" is part of an unresolved conflict but remains publication-ready.`,
            [
              candidate.id,
            ],
          ),
        );
      }
    } else if (
      audit.conflictGroupId
    ) {
      findings.push(
        finding(
          `unexpected-conflict-group-${candidate.id}`,
          "conflict-group-integrity",
          "error",
          `Claim "${candidate.id}" has a conflictGroupId without unresolved conflict disposition.`,
          [
            candidate.id,
          ],
        ),
      );
    }

    /**
     * The model may request something unsafe even when
     * deterministic enforcement correctly blocks it.
     *
     * Final evidence remains safe, so this is a warning.
     */
    if (
      verification.verdict !==
        "supported" &&
      audit.requestedDecision ===
        "publish" &&
      !claim.publishable
    ) {
      findings.push(
        finding(
          `unsafe-request-overridden-${candidate.id}`,
          "decision-justification",
          "warning",
          `Reconciler requested publication for verifier-${verification.verdict} claim "${candidate.id}", but deterministic enforcement correctly withheld it.`,
          [
            candidate.id,
          ],
        ),
      );
    }

    if (
      verification.verdict !==
        "supported" &&
      audit.requestedConfidence !==
        "low" &&
      claim.confidence ===
        "low"
    ) {
      findings.push(
        finding(
          `unsafe-confidence-overridden-${candidate.id}`,
          "unsafe-confidence",
          "warning",
          `Reconciler requested ${audit.requestedConfidence} confidence for verifier-${verification.verdict} claim "${candidate.id}", but deterministic enforcement correctly reduced it to low.`,
          [
            candidate.id,
          ],
        ),
      );
    }
  }

  /**
   * An unresolved conflict requires at least two claims.
   */
  for (
    const [
      groupId,
      claimIds,
    ]
    of conflictGroups
  ) {
    if (
      claimIds.length <
      2
    ) {
      findings.push(
        finding(
          `singleton-conflict-${groupId}`,
          "conflict-group-integrity",
          "error",
          `Conflict group "${groupId}" contains fewer than two claims.`,
          claimIds,
        ),
      );
    }
  }

  return findings;
}

/* ── Model-output validation ───────────────────────── */

function validateModelOutput(
  raw:
    unknown,
  allowedClaimIds:
    Set<string>,
): ReconciliationAuditorModelOutput {
  if (
    !isObject(
      raw,
    )
  ) {
    throw new Error(
      "Reconciliation Auditor model output must be an object.",
    );
  }

  exactKeys(
    raw,
    [
      "summary",
      "findings",
    ],
    "Reconciliation Auditor output",
  );

  if (
    !nonEmpty(
      raw.summary,
    )
  ) {
    throw new Error(
      "Reconciliation Auditor summary must be a non-empty string.",
    );
  }

  if (
    !Array.isArray(
      raw.findings,
    )
  ) {
    throw new Error(
      "Reconciliation Auditor findings must be an array.",
    );
  }

  if (
    raw.findings.length >
    50
  ) {
    throw new Error(
      "Reconciliation Auditor returned more than 50 findings.",
    );
  }

  const findingIds =
    new Set<string>();

  const findings:
    ReconciliationAuditorFinding[] =
    [];

  for (
    const [
      index,
      rawFinding,
    ]
    of raw.findings.entries()
  ) {
    if (
      !isObject(
        rawFinding,
      )
    ) {
      throw new Error(
        `Reconciliation Auditor finding[${index}] must be an object.`,
      );
    }

    exactKeys(
      rawFinding,
      [
        "id",
        "category",
        "severity",
        "message",
        "claimIds",
      ],
      `Reconciliation Auditor finding[${index}]`,
    );

    assertSafeId(
      rawFinding.id,
      `Reconciliation Auditor finding[${index}].id`,
    );

    if (
      findingIds.has(
        rawFinding.id,
      )
    ) {
      throw new Error(
        `Reconciliation Auditor returned duplicate finding ID: ${rawFinding.id}`,
      );
    }

    findingIds.add(
      rawFinding.id,
    );

    if (
      !(
        RECONCILIATION_AUDIT_CATEGORIES as readonly unknown[]
      ).includes(
        rawFinding.category,
      )
    ) {
      throw new Error(
        `Reconciliation Auditor finding "${rawFinding.id}" has invalid category.`,
      );
    }

    if (
      !(
        RECONCILIATION_AUDIT_SEVERITIES as readonly unknown[]
      ).includes(
        rawFinding.severity,
      )
    ) {
      throw new Error(
        `Reconciliation Auditor finding "${rawFinding.id}" has invalid severity.`,
      );
    }

    if (
      !nonEmpty(
        rawFinding.message,
      )
    ) {
      throw new Error(
        `Reconciliation Auditor finding "${rawFinding.id}" requires message.`,
      );
    }

    if (
      !Array.isArray(
        rawFinding.claimIds,
      ) ||
      rawFinding.claimIds.length ===
        0
    ) {
      throw new Error(
        `Reconciliation Auditor finding "${rawFinding.id}" requires at least one claimId.`,
      );
    }

    const claimIds:
      string[] =
      [];

    const seenClaimIds =
      new Set<string>();

    for (
      const claimId
      of rawFinding.claimIds
    ) {
      assertSafeId(
        claimId,
        `Reconciliation Auditor finding "${rawFinding.id}".claimIds`,
      );

      if (
        seenClaimIds.has(
          claimId,
        )
      ) {
        throw new Error(
          `Reconciliation Auditor finding "${rawFinding.id}" contains duplicate claimId: ${claimId}`,
        );
      }

      seenClaimIds.add(
        claimId,
      );

      if (
        !allowedClaimIds.has(
          claimId,
        )
      ) {
        throw new Error(
          `Reconciliation Auditor finding "${rawFinding.id}" references unknown claimId: ${claimId}`,
        );
      }

      claimIds.push(
        claimId,
      );
    }

    if (
      rawFinding.category ===
        "missed-conflict" &&
      claimIds.length <
        2
    ) {
      throw new Error(
        `Reconciliation Auditor missed-conflict finding "${rawFinding.id}" must reference at least two claims.`,
      );
    }

    findings.push({
      id:
        rawFinding.id,

      category:
        rawFinding.category as
          ReconciliationAuditCategory,

      severity:
        rawFinding.severity as
          ReconciliationAuditSeverity,

      message:
        rawFinding.message.trim(),

      claimIds,
    });
  }

  return {
    summary:
      raw.summary.trim(),

    findings,
  };
}

/* ── Deterministic scoring ────────────────────────── */

function buildResult(
  summary:
    string,
  findings:
    ReconciliationAuditorFinding[],
): ReconciliationAuditorResult {
  const errorCount =
    findings.filter(
      (item) =>
        item.severity ===
        "error",
    ).length;

  const warningCount =
    findings.filter(
      (item) =>
        item.severity ===
        "warning",
    ).length;

  const score =
    Math.max(
      0,
      100 -
        errorCount *
          18 -
        warningCount *
          6,
    );

  const status:
    ReconciliationAuditorResult["status"] =
    errorCount >
    0
      ? "fail"
      : warningCount >
          0
        ? "partial"
        : "pass";

  return {
    status,

    safeToContinue:
      errorCount ===
      0,

    score,

    summary,

    findings,
  };
}

/* ── Public auditor ───────────────────────────────── */

export async function auditReconciliation(
  request:
    ReconciliationAuditorRequest,
  options:
    ReconciliationAuditorOptions = {},
): Promise<ReconciliationAuditorResult> {
  const deterministicFindings =
    validateAndBuildDeterministicFindings(
      request,
    );

  /**
   * No evidence is a legitimate state.
   *
   * The Evidence Pipeline already short-circuits before
   * reconciliation in that case, so no AI call is needed.
   */
  if (
    request.candidates.length ===
    0
  ) {
    return buildResult(
      "No evidence candidates required reconciliation audit.",
      deterministicFindings,
    );
  }

  const allowedClaimIds =
    new Set(
      request.candidates.map(
        (claim) =>
          claim.id,
      ),
    );

  const model =
    request.model ??
    process.env
      .CASE_STUDY_AGENT_RECONCILIATION_AUDITOR_MODEL ??
    process.env
      .CASE_STUDY_AGENT_MODEL ??
    "gpt-5.6";

  const client =
    options.client ??
    new OpenAI();

  const auditorInput = {
    candidates:
      request.candidates,

    verification:
      request.verification,

    reconciliationAudit:
      request.reconciliationAudit,

    finalClaims:
      request.claims,
  };

  const response =
    await client.responses.create({
      model,

      input: [
        {
          role:
            "system",

          content:
            SYSTEM_PROMPT,
        },

        {
          role:
            "user",

          content:
            JSON.stringify(
              auditorInput,
            ),
        },
      ],

      text: {
        format:
          RECONCILIATION_AUDITOR_RESPONSE_FORMAT as any,
      },
    });

  if (
    !nonEmpty(
      response.output_text,
    )
  ) {
    throw new Error(
      "Reconciliation Auditor returned empty output.",
    );
  }

  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        response.output_text,
      );
  } catch {
    throw new Error(
      "Reconciliation Auditor returned invalid JSON.",
    );
  }

  const modelOutput =
    validateModelOutput(
      parsed,
      allowedClaimIds,
    );

  /**
   * Deterministic findings and independent semantic
   * findings must never silently overwrite one another.
   */
  const deterministicIds =
    new Set(
      deterministicFindings.map(
        (item) =>
          item.id,
      ),
    );

  for (
    const item
    of modelOutput.findings
  ) {
    if (
      deterministicIds.has(
        item.id,
      )
    ) {
      throw new Error(
        `Reconciliation Auditor model finding ID collides with deterministic finding: ${item.id}`,
      );
    }
  }

  return buildResult(
    modelOutput.summary,
    [
      ...deterministicFindings,
      ...modelOutput.findings,
    ],
  );
}
