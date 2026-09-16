/**
 * GOLD STANDARD CASE STUDY AGENT — ARCHITECTURE OUTPUT SCHEMA
 *
 * Internal planning contract only.
 *
 * The Architect designs how a case study should be told.
 * It does NOT write CMS content, access Payload, or publish anything.
 */

export const CHAPTER_ROLES = [
  "context",
  "problem",
  "mechanic",
  "strategy",
  "execution",
  "scale",
  "logistics",
  "community",
  "results",
  "economics",
  "impact",
  "learning",
  "continuity",
  "other",
] as const;

export const MEDIA_ROLES = [
  "campaign-hero",
  "product-pack",
  "mechanic",
  "creator-content",
  "execution-evidence",
  "report-chart",
  "press-proof",
  "context",
  "other",
] as const;

export const ARCHITECTURE_MODEL_OUTPUT_SCHEMA = {
  type: "object",

  additionalProperties: false,

  required: [
    "narrativeThesis",
    "storyStrategy",
    "renderModeRecommendation",
    "chapters",
    "metricsPlan",
    "mediaPlan",
    "continuityPlan",
    "ctaPlan",
    "designRationale",
  ],

  properties: {
    narrativeThesis: {
      type: "string",
    },

    storyStrategy: {
      type: "string",
    },

    renderModeRecommendation: {
      type: "string",
      enum: [
        "standard",
        "flexible",
      ],
    },

    chapters: {
      type: "array",
      minItems: 1,
      maxItems: 16,

      items: {
        type: "object",

        additionalProperties: false,

        required: [
          "id",
          "role",
          "headingDirection",
          "purpose",
          "evidenceClaimIds",
          "metricClaimIds",
          "mediaRole",
          "toneRecommendation",
        ],

        properties: {
          id: {
            type: "string",
          },

          role: {
            type: "string",
            enum: CHAPTER_ROLES,
          },

          headingDirection: {
            type: "string",
          },

          purpose: {
            type: "string",
          },

          evidenceClaimIds: {
            type: "array",
            items: {
              type: "string",
            },
          },

          metricClaimIds: {
            type: "array",
            items: {
              type: "string",
            },
          },

          mediaRole: {
            type: [
              "string",
              "null",
            ],
            enum: [
              ...MEDIA_ROLES,
              null,
            ],
          },

          toneRecommendation: {
            type: "string",
            enum: [
              "light",
              "dark",
              "neutral",
            ],
          },
        },
      },
    },

    metricsPlan: {
      type: "array",

      items: {
        type: "object",

        additionalProperties: false,

        required: [
          "claimId",
          "role",
          "placement",
          "scopeNote",
        ],

        properties: {
          claimId: {
            type: "string",
          },

          role: {
            type: "string",
          },

          placement: {
            type: "string",
          },

          scopeNote: {
            type: [
              "string",
              "null",
            ],
          },
        },
      },
    },

    mediaPlan: {
      type: "array",

      items: {
        type: "object",

        additionalProperties: false,

        required: [
          "role",
          "placement",
          "purpose",
          "evidenceClaimIds",
        ],

        properties: {
          role: {
            type: "string",
            enum: MEDIA_ROLES,
          },

          placement: {
            type: "string",
          },

          purpose: {
            type: "string",
          },

          evidenceClaimIds: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },

    continuityPlan: {
      anyOf: [
        {
          type: "object",

          additionalProperties: false,

          required: [
            "previousProjectSlug",
            "nextProjectSlug",
            "progression",
            "rationale",
          ],

          properties: {
            previousProjectSlug: {
              type: [
                "string",
                "null",
              ],
            },

            nextProjectSlug: {
              type: [
                "string",
                "null",
              ],
            },

            progression: {
              type: "string",
            },

            rationale: {
              type: "string",
            },
          },
        },

        {
          type: "null",
        },
      ],
    },

    ctaPlan: {
      type: "object",

      additionalProperties: false,

      required: [
        "purpose",
        "recommendedDirection",
        "targetProjectSlug",
      ],

      properties: {
        purpose: {
          type: "string",
        },

        recommendedDirection: {
          type: "string",
        },

        targetProjectSlug: {
          type: [
            "string",
            "null",
          ],
        },
      },
    },

    designRationale: {
      type: "string",
    },
  },
} as const;

export const ARCHITECTURE_RESPONSE_FORMAT = {
  type: "json_schema" as const,

  name: "case_study_architecture",

  strict: true,

  schema:
    ARCHITECTURE_MODEL_OUTPUT_SCHEMA,
};
