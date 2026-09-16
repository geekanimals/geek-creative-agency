/**
 * GOLD STANDARD CASE STUDY AGENT — EVIDENCE EXTRACTION SCHEMA
 *
 * Raw trusted campaign sources → candidate factual claims.
 *
 * IMPORTANT:
 * - This is BEFORE reconciliation.
 * - This is BEFORE publication confidence.
 * - This is BEFORE publishable=true/false.
 * - Every claim requires exact verbatim source support.
 * - The model may never invent source IDs.
 */

export const EXTRACTABLE_CLAIM_TYPES = [
  "fact",
  "metric",
  "quote",
  "relationship",
  "award",
  "press",
  "narrative",
] as const;

export const EVIDENCE_EXTRACTION_RESPONSE_SCHEMA = {
  type: "object",

  additionalProperties: false,

  required: [
    "claims",
  ],

  properties: {
    claims: {
      type: "array",
      maxItems: 200,

      items: {
        type: "object",

        additionalProperties: false,

        required: [
          "id",
          "type",
          "statement",
          "sourceIds",
          "support",
        ],

        properties: {
          /**
           * Stable candidate ID.
           *
           * Example:
           * metric-creators-activated
           */
          id: {
            type: "string",
          },

          type: {
            type: "string",

            enum: [
              "fact",
              "metric",
              "quote",
              "relationship",
              "award",
              "press",
              "narrative",
            ],
          },

          /**
           * Narrow factual statement supported by the excerpts.
           *
           * Do not combine unrelated facts merely to reduce claim count.
           */
          statement: {
            type: "string",
          },

          /**
           * Exact trusted source IDs used by this claim.
           */
          sourceIds: {
            type: "array",
            minItems: 1,

            items: {
              type: "string",
            },
          },

          /**
           * Exact verbatim passages from trusted source content.
           *
           * Application code will verify every excerpt character-for-character.
           */
          support: {
            type: "array",
            minItems: 1,

            items: {
              type: "object",

              additionalProperties: false,

              required: [
                "sourceId",
                "excerpt",
              ],

              properties: {
                sourceId: {
                  type: "string",
                },

                excerpt: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

export const EVIDENCE_EXTRACTION_RESPONSE_FORMAT = {
  type: "json_schema" as const,

  name:
    "case_study_evidence_extraction",

  strict:
    true,

  schema:
    EVIDENCE_EXTRACTION_RESPONSE_SCHEMA,
};
