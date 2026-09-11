/**
 * GOLD STANDARD CASE STUDY AGENT — MODEL OUTPUT SCHEMA
 *
 * This schema is ONLY for OpenAI Structured Outputs.
 *
 * Important:
 * - The model does NOT generate schemaVersion, generatedAt or quality.
 * - Optional editorial fields use `null` because Structured Outputs strict
 *   mode requires every property to be present.
 * - A later normalization step removes nulls before our trusted runtime
 *   validator + quality gate see the package.
 * - Evidence/provenance remains internal and never enters Payload.
 */

export const CASE_STUDY_MODEL_OUTPUT_SCHEMA = {
  type: "object",

  additionalProperties: false,

  required: [
    "project",
    "evidence",
  ],

  properties: {
    project: {
      type: "object",

      additionalProperties: false,

      required: [
        "slug",
        "title",
        "client",
        "year",
        "location",
        "shortSummary",
        "cardSummary",
        "renderMode",
        "projectKind",
        "heroLegacySrc",
        "companySlug",
        "brandSlug",
        "businessCategorySlugs",
        "serviceSlugs",
        "solutionSlugs",
        "headline",
        "challenge",
        "insight",
        "idea",
        "execution",
        "outcome",
        "quote",
        "metrics",
        "seo",
      ],

      properties: {
        slug: {
          type: "string",
        },

        title: {
          type: "string",
        },

        client: {
          type: ["string", "null"],
        },

        year: {
          type: ["number", "null"],
        },

        location: {
          type: ["string", "null"],
        },

        shortSummary: {
          type: ["string", "null"],
        },

        cardSummary: {
          type: ["string", "null"],
        },

        renderMode: {
          type: "string",
          enum: ["standard"],
        },

        projectKind: {
          type: "string",
          enum: [
            "campaign",
            "ongoing-program",
            "platform",
            "activation",
          ],
        },

        heroLegacySrc: {
          type: ["string", "null"],
        },

        companySlug: {
          type: ["string", "null"],
        },

        brandSlug: {
          type: ["string", "null"],
        },

        businessCategorySlugs: {
          type: "array",
          items: {
            type: "string",
          },
        },

        serviceSlugs: {
          type: "array",
          items: {
            type: "string",
          },
        },

        solutionSlugs: {
          type: "array",
          items: {
            type: "string",
          },
        },

        headline: {
          type: ["string", "null"],
        },

        challenge: {
          anyOf: [
            {
              type: "object",

              additionalProperties: false,

              required: [
                "question",
                "copy",
              ],

              properties: {
                question: {
                  type: ["string", "null"],
                },

                copy: {
                  type: ["string", "null"],
                },
              },
            },

            {
              type: "null",
            },
          ],
        },

        insight: {
          type: ["string", "null"],
        },

        idea: {
          anyOf: [
            {
              type: "object",

              additionalProperties: false,

              required: [
                "statement",
                "copy",
              ],

              properties: {
                statement: {
                  type: ["string", "null"],
                },

                copy: {
                  type: ["string", "null"],
                },
              },
            },

            {
              type: "null",
            },
          ],
        },

        execution: {
          type: ["string", "null"],
        },

        outcome: {
          type: ["string", "null"],
        },

        quote: {
          anyOf: [
            {
              type: "object",

              additionalProperties: false,

              required: [
                "text",
                "attribution",
              ],

              properties: {
                text: {
                  type: ["string", "null"],
                },

                attribution: {
                  type: ["string", "null"],
                },
              },
            },

            {
              type: "null",
            },
          ],
        },

        metrics: {
          type: "array",

          items: {
            type: "object",

            additionalProperties: false,

            required: [
              "value",
              "label",
              "prefix",
              "suffix",
              "note",
              "claimId",
            ],

            properties: {
              value: {
                type: "string",
              },

              label: {
                type: "string",
              },

              prefix: {
                type: ["string", "null"],
              },

              suffix: {
                type: ["string", "null"],
              },

              note: {
                type: ["string", "null"],
              },

              claimId: {
                type: "string",
              },
            },
          },
        },

        seo: {
          anyOf: [
            {
              type: "object",

              additionalProperties: false,

              required: [
                "metaTitle",
                "metaDescription",
                "noindex",
              ],

              properties: {
                metaTitle: {
                  type: ["string", "null"],
                },

                metaDescription: {
                  type: ["string", "null"],
                },

                noindex: {
                  type: "boolean",
                },
              },
            },

            {
              type: "null",
            },
          ],
        },
      },
    },

    evidence: {
      type: "object",

      additionalProperties: false,

      required: [
        "sources",
        "claims",
        "narrativeBindings",
      ],

      properties: {
        sources: {
          type: "array",

          items: {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "kind",
              "title",
              "url",
              "publisher",
              "publicationDate",
              "capturedAt",
              "notes",
            ],

            properties: {
              id: {
                type: "string",
              },

              kind: {
                type: "string",

                enum: [
                  "user-provided",
                  "internal-document",
                  "official-brand",
                  "campaign-archive",
                  "independent-editorial",
                  "trade-publication",
                  "partner-ngo",
                  "website",
                  "social",
                  "other",
                ],
              },

              title: {
                type: "string",
              },

              url: {
                type: ["string", "null"],
              },

              publisher: {
                type: ["string", "null"],
              },

              publicationDate: {
                type: ["string", "null"],
              },

              capturedAt: {
                type: ["string", "null"],
              },

              notes: {
                type: ["string", "null"],
              },
            },
          },
        },

        claims: {
          type: "array",

          items: {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "type",
              "statement",
              "sourceIds",
              "support",
              "confidence",
              "publishable",
              "note",
            ],

            properties: {
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

              statement: {
                type: "string",
              },

              sourceIds: {
                type: "array",

                items: {
                  type: "string",
                },
              },

              support: {
                type: "array",

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

              confidence: {
                type: "string",

                enum: [
                  "high",
                  "medium",
                  "low",
                ],
              },

              publishable: {
                type: "boolean",
              },

              note: {
                type: ["string", "null"],
              },
            },
          },
        },

        narrativeBindings: {
          type: "array",

          items: {
            type: "object",

            additionalProperties: false,

            required: [
              "field",
              "claimIds",
            ],

            properties: {
              field: {
                type: "string",

                enum: [
                  "challenge",
                  "insight",
                  "idea",
                  "execution",
                  "outcome",
                ],
              },

              claimIds: {
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
  },
} as const;

export const CASE_STUDY_RESPONSE_FORMAT = {
  type: "json_schema" as const,

  name: "gold_standard_case_study",

  strict: true,

  schema: CASE_STUDY_MODEL_OUTPUT_SCHEMA,
};
