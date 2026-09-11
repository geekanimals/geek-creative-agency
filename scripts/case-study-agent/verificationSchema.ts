/**
 * GOLD STANDARD CASE STUDY AGENT — SEMANTIC EVIDENCE VERIFIER CONTRACT
 *
 * Independent verification pass.
 *
 * The verifier receives:
 * - one generated claim
 * - only that claim's trusted verbatim support excerpts
 *
 * It does NOT receive the drafted public case-study copy.
 * It does NOT receive taxonomy suggestions.
 * It cannot add facts.
 *
 * Verdicts:
 *
 * supported
 *   The supplied excerpts directly support the full material meaning
 *   and scope of the claim.
 *
 * partial
 *   The excerpts support only part of the claim, or the claim is
 *   broader / stronger / more specific than the evidence.
 *
 * unsupported
 *   The excerpts do not support the claim, contradict it, or require
 *   information not contained in the supplied excerpts.
 */

export type EvidenceVerificationVerdict =
  | "supported"
  | "partial"
  | "unsupported";

export type ClaimVerificationResult = {
  claimId: string;

  verdict:
    EvidenceVerificationVerdict;

  /**
   * Concise verifier explanation.
   *
   * Internal only.
   */
  reason: string;

  /**
   * Material claim elements not proven by the excerpts.
   *
   * Empty when fully supported.
   */
  unsupportedElements: string[];
};

export type ClaimVerificationBatch = {
  results: ClaimVerificationResult[];
};

/**
 * Strict Structured Output schema for the independent verifier.
 */
export const CLAIM_VERIFICATION_RESPONSE_FORMAT = {
  type: "json_schema",

  name:
    "gold_standard_claim_verification",

  strict: true,

  schema: {
    type: "object",

    additionalProperties: false,

    required: [
      "results",
    ],

    properties: {
      results: {
        type: "array",

        items: {
          type: "object",

          additionalProperties: false,

          required: [
            "claimId",
            "verdict",
            "reason",
            "unsupportedElements",
          ],

          properties: {
            claimId: {
              type: "string",
            },

            verdict: {
              type: "string",

              enum: [
                "supported",
                "partial",
                "unsupported",
              ],
            },

            reason: {
              type: "string",
            },

            unsupportedElements: {
              type: "array",

              items: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
} as const;
