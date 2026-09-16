/**
 * GOLD STANDARD CASE STUDY AGENT — SEMANTIC CRITIC SCHEMA
 *
 * Independent semantic audit contract.
 *
 * The Critic reviews the finished case-study story.
 * It does NOT rewrite content and does NOT publish.
 */

export const SEMANTIC_CRITIC_CATEGORIES = [
  "evidence-overreach",
  "scope-clarity",
  "narrative-logic",
  "strategic-depth",
  "repetition",
  "omitted-evidence",
  "architecture-fit",
  "continuity-integrity",
  "metric-interpretation",
  "other",
] as const;

export const SEMANTIC_CRITIC_SEVERITIES = [
  "error",
  "warning",
] as const;

export const SEMANTIC_CRITIC_MODEL_OUTPUT_SCHEMA = {
  type:
    "object",

  additionalProperties:
    false,

  required: [
    "summary",
    "findings",
  ],

  properties: {
    summary: {
      type:
        "string",
    },

    findings: {
      type:
        "array",

      maxItems:
        50,

      items: {
        type:
          "object",

        additionalProperties:
          false,

        required: [
          "id",
          "category",
          "severity",
          "message",
          "sectionIds",
          "claimIds",
        ],

        properties: {
          id: {
            type:
              "string",
          },

          category: {
            type:
              "string",

            enum:
              SEMANTIC_CRITIC_CATEGORIES,
          },

          severity: {
            type:
              "string",

            enum:
              SEMANTIC_CRITIC_SEVERITIES,
          },

          message: {
            type:
              "string",
          },

          sectionIds: {
            type:
              "array",

            items: {
              type:
                "string",
            },
          },

          claimIds: {
            type:
              "array",

            items: {
              type:
                "string",
            },
          },
        },
      },
    },
  },
} as const;

export const SEMANTIC_CRITIC_RESPONSE_FORMAT = {
  type:
    "json_schema",

  name:
    "case_study_semantic_critic",

  strict:
    true,

  schema:
    SEMANTIC_CRITIC_MODEL_OUTPUT_SCHEMA,
} as const;
