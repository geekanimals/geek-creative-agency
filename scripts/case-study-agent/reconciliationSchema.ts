/**
 * GOLD STANDARD CASE STUDY AGENT — RECONCILIATION SCHEMA
 *
 * Candidate claims have already:
 * - been extracted from trusted sources;
 * - passed deterministic verbatim-support checks;
 * - received an independent semantic-verification verdict.
 *
 * The Reconciler does NOT rewrite evidence.
 *
 * It decides only:
 * - publication disposition;
 * - confidence;
 * - unresolved conflict grouping;
 * - internal reconciliation rationale.
 */

export const RECONCILIATION_DECISIONS = [
  "publish",
  "withhold",
] as const;

export const RECONCILIATION_CONFIDENCE = [
  "high",
  "medium",
  "low",
] as const;

export const CONFLICT_DISPOSITIONS = [
  "none",
  "unresolved",
] as const;

export const EVIDENCE_RECONCILIATION_RESPONSE_SCHEMA = {
  type: "object",

  additionalProperties: false,

  required: [
    "decisions",
  ],

  properties: {
    decisions: {
      type: "array",
      maxItems: 200,

      items: {
        type: "object",

        additionalProperties: false,

        required: [
          "claimId",
          "decision",
          "confidence",
          "conflictDisposition",
          "conflictGroupId",
          "reason",
        ],

        properties: {
          /**
           * Must exactly match an extracted candidate claim.
           */
          claimId: {
            type: "string",
          },

          /**
           * Publication recommendation.
           *
           * Application code still enforces verifier/conflict rules
           * deterministically after model output.
           */
          decision: {
            type: "string",

            enum: [
              "publish",
              "withhold",
            ],
          },

          /**
           * Evidence confidence after considering:
           * - semantic verification;
           * - source agreement;
           * - scope clarity;
           * - unresolved conflicts.
           *
           * This describes support for the exact claim as written.
           */
          confidence: {
            type: "string",

            enum: [
              "high",
              "medium",
              "low",
            ],
          },

          /**
           * "unresolved" means another supplied candidate materially
           * conflicts with this claim within the same relevant scope.
           *
           * Claims that merely describe different explicitly-supported
           * scopes, periods or attribution should not be marked conflicting.
           */
          conflictDisposition: {
            type: "string",

            enum: [
              "none",
              "unresolved",
            ],
          },

          /**
           * Shared stable group ID for claims participating in the same
           * unresolved conflict.
           *
           * null when conflictDisposition="none".
           */
          conflictGroupId: {
            anyOf: [
              {
                type: "string",
              },

              {
                type: "null",
              },
            ],
          },

          /**
           * Concise INTERNAL explanation.
           *
           * May explain:
           * - why a supported claim is safe to publish;
           * - why a claim is withheld;
           * - scope separation;
           * - unresolved conflict;
           * - verifier failure.
           *
           * Must not add new facts.
           */
          reason: {
            type: "string",
          },
        },
      },
    },
  },
} as const;

export const EVIDENCE_RECONCILIATION_RESPONSE_FORMAT = {
  type: "json_schema" as const,

  name:
    "case_study_evidence_reconciliation",

  strict:
    true,

  schema:
    EVIDENCE_RECONCILIATION_RESPONSE_SCHEMA,
};
