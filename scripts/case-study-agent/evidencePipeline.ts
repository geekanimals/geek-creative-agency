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
  const reconciliation:
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
  const reconciliationAuditResult =
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
   * Fail closed on any independent reconciliation error.
   *
   * Warnings remain safeToContinue=true and are preserved
   * for later human review.
   */
  if (
    !reconciliationAuditResult
      .safeToContinue
  ) {
    const findingIds =
      reconciliationAuditResult
        .findings
        .filter(
          (finding) =>
            finding.severity ===
            "error",
        )
        .map(
          (finding) =>
            finding.id,
        )
        .join(", ");

    throw new Error(
      `Evidence Pipeline failed Reconciliation Auditor: ${findingIds || "unknown reconciliation audit error"}`,
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
  };
}
