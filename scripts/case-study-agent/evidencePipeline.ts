/**
 * GOLD STANDARD CASE STUDY AGENT — EVIDENCE PIPELINE
 *
 * Orchestrates:
 *
 * trusted raw sources
 *   → Evidence Extractor
 *   → independent Semantic Verifier
 *   → Evidence Reconciler
 *   → trusted EvidenceClaim ledger
 *
 * NO Payload.
 * NO database.
 * NO CMS.
 * NO publishing.
 */

import type OpenAI from "openai";

import {
  extractEvidence,
} from "./extractor";

import {
  verifyClaims,
} from "./verifier";

import {
  reconcileEvidence,
} from "./reconciler";

import {
  auditReconciliation,
} from "./reconciliationAuditor";

import type {
  CandidateEvidenceClaim,
  EvidenceExtractionResult,
} from "./extractor";

import type {
  GenerationSource,
} from "./generator";

import type {
  VerifiableClaim,
} from "./verifier";

import type {
  ClaimVerificationBatch,
} from "./verificationSchema";

import type {
  ReconciliationAuditEntry,
  ReconciledEvidenceResult,
} from "./reconciler";

import type {
  EvidenceClaim,
} from "./types";

import type {
  ReconciliationAuditorResult,
} from "./reconciliationAuditor";

/* ── Public contracts ───────────────────────────────── */

export type BuildEvidenceLedgerRequest = {
  sources:
    GenerationSource[];

  extractorModel?: string;

  verifierModel?: string;

  reconcilerModel?: string;

  reconciliationAuditorModel?: string;
};

export type BuildEvidenceLedgerOptions = {
  extractorClient?: OpenAI;

  verifierClient?: OpenAI;

  reconcilerClient?: OpenAI;

  reconciliationAuditorClient?: OpenAI;
};

export type ReconciliationRepairHistoryEntry = {
  /**
   * The pipeline permits at most two bounded repair passes.
   */
  attempt:
    1 | 2;

  /**
   * Reconciler state that failed the independent audit.
   */
  reconciliationAudit:
    ReconciliationAuditEntry[];

  /**
   * Independent audit that triggered the repair.
   */
  auditResult:
    ReconciliationAuditorResult;
};

export type EvidencePipelineResult = {
  /**
   * Raw evidence candidates created by the Extractor.
   */
  candidates:
    CandidateEvidenceClaim[];

  /**
   * Independent semantic-verification results.
   */
  verification:
    ClaimVerificationBatch;

  /**
   * Final reconciled EvidenceClaim ledger.
   */
  claims:
    EvidenceClaim[];

  /**
   * Internal reconciliation audit trail.
   */
  reconciliationAudit:
    ReconciliationAuditEntry[];

  /**
   * Independent audit of the entire reconciliation
   * boundary, including withheld and conflicting claims.
   */
  reconciliationAuditResult:
    ReconciliationAuditorResult;

  /**
   * Present only when the independent Auditor forced the
   * single bounded Reconciler repair pass.
   *
   * The final authoritative safety verdict remains
   * reconciliationAuditResult.
   */
  reconciliationRepairHistory?:
    ReconciliationRepairHistoryEntry[];
};

/* ── Helpers ────────────────────────────────────────── */

function toVerifiableClaims(
  extraction:
    EvidenceExtractionResult,
): VerifiableClaim[] {
  return extraction.claims.map(
    (claim) => ({
      id:
        claim.id,

      type:
        claim.type,

      statement:
        claim.statement,

      support:
        claim.support.map(
          (item) => ({
            sourceId:
              item.sourceId,

            excerpt:
              item.excerpt,
          }),
        ),
    }),
  );
}

function formatReconciliationAuditErrors(
  result:
    ReconciliationAuditorResult,
): string {
  return result
    .findings
    .filter(
      (finding) =>
        finding.severity ===
        "error",
    )
    .map(
      (finding) =>
        [
          finding.id,
          `category=${finding.category}`,
          `severity=${finding.severity}`,
          `claims=${finding.claimIds.join(", ")}`,
          `message=${finding.message}`,
        ].join(" | "),
    )
    .join("\n");
}

/* ── Public orchestrator ────────────────────────────── */

export async function buildEvidenceLedger(
  request:
    BuildEvidenceLedgerRequest,
  options:
    BuildEvidenceLedgerOptions = {},
): Promise<EvidencePipelineResult> {
  /**
   * STEP 1
   *
   * Extract narrow candidate claims with exact
   * verbatim support.
   */
  const extraction =
    await extractEvidence(
      {
        sources:
          request.sources,

        model:
          request.extractorModel,
      },
      {
        client:
          options.extractorClient,
      },
    );

  /**
   * A source set may legitimately contain no
   * defensible candidate claims.
   *
   * Do not waste verifier / reconciler calls.
   */
  if (
    extraction.claims.length ===
    0
  ) {
    return {
      candidates: [],

      verification: {
        results: [],
      },

      claims: [],

      reconciliationAudit: [],

      reconciliationAuditResult: {
        status:
          "pass",

        safeToContinue:
          true,

        score:
          100,

        summary:
          "No evidence candidates required reconciliation audit.",

        findings: [],
      },
    };
  }

  /**
   * STEP 2
   *
   * Independently verify the full semantic meaning
   * of every extracted candidate against only its
   * already-proven verbatim excerpts.
   */
  const verifiableClaims =
    toVerifiableClaims(
      extraction,
    );

  const verification =
    await verifyClaims(
      verifiableClaims,
      {
        client:
          options.verifierClient,

        model:
          request.verifierModel,
      },
    );

  /**
   * STEP 3
   *
   * Reconcile:
   * - conflicts
   * - scope
   * - attribution
   * - confidence
   * - publication disposition
   *
   * Reconciler receives the independent verifier
   * verdicts and cannot rewrite candidate evidence.
   */
  let reconciliation:
    ReconciledEvidenceResult =
    await reconcileEvidence(
      {
        sources:
          request.sources,

        claims:
          extraction.claims,

        verification,

        model:
          request.reconcilerModel,
      },
      {
        client:
          options.reconcilerClient,
      },
    );

  /**
   * STEP 4
   *
   * Independently audit the complete reconciliation
   * boundary before any downstream case-study reasoning.
   *
   * Unlike the downstream Semantic Critic, this stage sees:
   * - every extracted candidate;
   * - every verifier verdict;
   * - every reconciliation decision;
   * - publication-ready AND withheld final claims.
   */
  let reconciliationAuditResult =
    await auditReconciliation(
      {
        candidates:
          extraction.claims,

        verification,

        reconciliationAudit:
          reconciliation.audit,

        claims:
          reconciliation.claims,

        model:
          request.reconciliationAuditorModel,
      },
      {
        client:
          options.reconciliationAuditorClient,
      },
    );

  /**
   * Independent Auditor bounded convergence boundary.
   *
   * Maximum sequence:
   *
   * Reconciler #1
   *   -> Auditor #1
   *
   * if unsafe:
   *   -> Repair #1
   *   -> Auditor #2
   *
   * if still unsafe:
   *   -> Repair #2
   *   -> Auditor #3
   *
   * Auditor #3 still unsafe => FAIL CLOSED.
   *
   * There is never an unlimited retry loop.
   * Warnings never trigger repair.
   */
  const MAX_RECONCILIATION_REPAIR_ATTEMPTS =
    2 as const;

  const reconciliationRepairHistory:
    ReconciliationRepairHistoryEntry[] =
    [];

  /**
   * Every failed audit contributes its ERROR diagnostics
   * to subsequent repair passes.
   *
   * IDs are namespaced by audit round solely to prevent
   * collisions between independent Auditor calls.
   *
   * Category, message and claimIds are preserved exactly.
   */
  const cumulativeRepairFindings:
    Array<{
      id: string;

      category:
        ReconciliationAuditorResult[
          "findings"
        ][number]["category"];

      severity:
        "error";

      message:
        string;

      claimIds:
        string[];
    }> =
    [];

  for (
    let repairNumber =
      1;

    repairNumber <=
      MAX_RECONCILIATION_REPAIR_ATTEMPTS &&
    !reconciliationAuditResult
      .safeToContinue;

    repairNumber++
  ) {
    const attempt =
      repairNumber as
        1 | 2;

    const failedAudit =
      reconciliationAuditResult;

    const errorFindings =
      failedAudit
        .findings
        .filter(
          (finding) =>
            finding.severity ===
            "error",
        );

    if (
      errorFindings.length ===
      0
    ) {
      throw new Error(
        "Evidence Pipeline failed Reconciliation Auditor: safeToContinue=false without an error finding.",
      );
    }

    /**
     * Preserve the complete failed reconciliation
     * and independent audit before repairing it.
     */
    reconciliationRepairHistory.push({
      attempt,

      reconciliationAudit:
        reconciliation.audit.map(
          (entry) => ({
            ...entry,
          }),
        ),

      auditResult: {
        ...failedAudit,

        findings:
          failedAudit
            .findings
            .map(
              (finding) => ({
                ...finding,

                claimIds: [
                  ...finding.claimIds,
                ],
              }),
            ),
      },
    });

    /**
     * Carry forward every material Auditor error so that
     * Repair #2 cannot forget a problem identified during
     * Audit #1.
     *
     * The original Auditor finding remains unchanged in
     * reconciliationRepairHistory. Only the repair-context
     * ID is namespaced to guarantee uniqueness.
     */
    for (
      const finding
      of errorFindings
    ) {
      cumulativeRepairFindings.push({
        id:
          `audit-${attempt}-${finding.id}`,

        category:
          finding.category,

        severity:
          "error",

        message:
          finding.message,

        claimIds: [
          ...finding.claimIds,
        ],
      });
    }

    /**
     * Reconcile again from the original trusted evidence
     * and verifier results.
     *
     * The repair feedback is diagnostic context only.
     * It is never new evidence.
     */
    reconciliation =
      await reconcileEvidence(
        {
          sources:
            request.sources,

          claims:
            extraction.claims,

          verification,

          repairContext: {
            attempt,

            findings:
              cumulativeRepairFindings.map(
                (finding) => ({
                  ...finding,

                  claimIds: [
                    ...finding.claimIds,
                  ],
                }),
              ),
          },

          model:
            request.reconcilerModel,
        },
        {
          client:
            options.reconcilerClient,
        },
      );

    /**
     * Independently audit the complete repaired ledger
     * again from scratch.
     */
    reconciliationAuditResult =
      await auditReconciliation(
        {
          candidates:
            extraction.claims,

          verification,

          reconciliationAudit:
            reconciliation.audit,

          claims:
            reconciliation.claims,

          model:
            request
              .reconciliationAuditorModel,
        },
        {
          client:
            options
              .reconciliationAuditorClient,
        },
      );
  }

  /**
   * No third repair is permitted.
   *
   * If the third independent audit still finds a material
   * error, the evidence pipeline stops permanently.
   */
  if (
    !reconciliationAuditResult
      .safeToContinue
  ) {
    const auditSections:
      string[] =
      [];

    for (
      let index =
        0;

      index <
        reconciliationRepairHistory.length;

      index++
    ) {
      auditSections.push(
        `AUDIT #${index + 1}:`,
        formatReconciliationAuditErrors(
          reconciliationRepairHistory[index]
            .auditResult,
        ) ||
          "unknown reconciliation audit error",
        "",
      );
    }

    auditSections.push(
      `AUDIT #${reconciliationRepairHistory.length + 1}:`,
      formatReconciliationAuditErrors(
        reconciliationAuditResult,
      ) ||
        "unknown reconciliation audit error",
    );

    throw new Error(
      [
        "Evidence Pipeline failed Reconciliation Auditor after two bounded repair attempts.",
        "",
        ...auditSections,
      ].join("\n"),
    );
  }
  return {
    candidates:
      extraction.claims.map(
        (claim) => ({
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
        }),
      ),

    verification: {
      results:
        verification.results.map(
          (result) => ({
            claimId:
              result.claimId,

            verdict:
              result.verdict,

            reason:
              result.reason,

            unsupportedElements: [
              ...result
                .unsupportedElements,
            ],
          }),
        ),
    },

    claims:
      reconciliation.claims.map(
        (claim) => ({
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
            claim.support?.map(
              (item) => ({
                sourceId:
                  item.sourceId,

                excerpt:
                  item.excerpt,
              }),
            ),

          confidence:
            claim.confidence,

          publishable:
            claim.publishable,

          note:
            claim.note,
        }),
      ),

    reconciliationAudit:
      reconciliation.audit.map(
        (entry) => ({
          claimId:
            entry.claimId,

          verifierVerdict:
            entry.verifierVerdict,

          requestedDecision:
            entry.requestedDecision,

          requestedConfidence:
            entry.requestedConfidence,

          conflictDisposition:
            entry.conflictDisposition,

          conflictGroupId:
            entry.conflictGroupId,

          reason:
            entry.reason,

          effectiveConfidence:
            entry.effectiveConfidence,

          publishable:
            entry.publishable,
        }),
      ),

    reconciliationAuditResult,

    ...(
      reconciliationRepairHistory.length >
      0
        ? {
            reconciliationRepairHistory,
          }
        : {}
    ),
  };
}
