/**
 * GOLD STANDARD CASE STUDY AGENT — SEMANTIC VERIFICATION GATE
 *
 * Pure policy layer.
 *
 * Takes:
 * - generated evidence claims
 * - independently produced semantic-verification results
 *
 * Rule:
 * A publishable claim may proceed ONLY when independently verified
 * as fully supported.
 *
 * No OpenAI.
 * No Payload.
 * No database.
 */

import type {
  EvidenceClaim,
} from "./types";

import type {
  ClaimVerificationBatch,
  ClaimVerificationResult,
} from "./verificationSchema";

export type SemanticVerificationIssue = {
  claimId: string;

  verdict:
    | "partial"
    | "unsupported";

  reason: string;

  unsupportedElements: string[];
};

export type SemanticVerificationGateResult = {
  pass: boolean;

  issues:
    SemanticVerificationIssue[];
};

function resultByClaimId(
  verification:
    ClaimVerificationBatch,
): Map<
  string,
  ClaimVerificationResult
> {
  return new Map(
    verification.results.map(
      (result) => [
        result.claimId,
        result,
      ],
    ),
  );
}

/**
 * Fail closed for PUBLIC claims.
 *
 * Non-publishable claims may remain in the internal evidence ledger even
 * when they are partial or unsupported.
 */
export function runSemanticVerificationGate(
  claims: EvidenceClaim[],
  verification:
    ClaimVerificationBatch,
): SemanticVerificationGateResult {
  const byId =
    resultByClaimId(
      verification,
    );

  const issues:
    SemanticVerificationIssue[] = [];

  for (const claim of claims) {
    if (!claim.publishable) {
      continue;
    }

    const result =
      byId.get(
        claim.id,
      );

    /**
     * The verifier itself normally guarantees complete result coverage.
     * We still fail closed here in case this function is ever called with
     * data from another boundary.
     */
    if (!result) {
      issues.push({
        claimId:
          claim.id,

        verdict:
          "unsupported",

        reason:
          "Publishable claim has no independent semantic-verification result.",

        unsupportedElements: [
          "independent verification",
        ],
      });

      continue;
    }

    if (
      result.verdict ===
      "supported"
    ) {
      continue;
    }

    issues.push({
      claimId:
        claim.id,

      verdict:
        result.verdict,

      reason:
        result.reason,

      unsupportedElements:
        result.unsupportedElements,
    });
  }

  return {
    pass:
      issues.length === 0,

    issues,
  };
}

/**
 * Convenience fail-closed boundary for generation.
 */
export function assertSemanticVerification(
  claims: EvidenceClaim[],
  verification:
    ClaimVerificationBatch,
) {
  const result =
    runSemanticVerificationGate(
      claims,
      verification,
    );

  if (result.pass) {
    return;
  }

  const detail =
    result.issues
      .map(
        (issue) => {
          const unsupported =
            issue
              .unsupportedElements
              .join(", ");

          return (
            `${issue.claimId}: ${issue.verdict}` +
            ` — ${issue.reason}` +
            (
              unsupported
                ? ` [unsupported: ${unsupported}]`
                : ""
            )
          );
        },
      )
      .join("; ");

  throw new Error(
    `Semantic evidence verification refused generation. ${detail}`,
  );
}
