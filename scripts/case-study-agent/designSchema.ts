/**
 * GOLD STANDARD CASE STUDY AGENT — DESIGNER OUTPUT SCHEMA
 *
 * Internal semantic case-study design.
 *
 * IMPORTANT:
 * - This is NOT Payload data yet.
 * - Rich text remains plain editorial text here.
 * - Media is referenced only by trusted asset IDs.
 * - A later deterministic compiler converts this into CMS sections.
 */

export const DESIGNER_BLOCK_TYPES = [
  "sectionIntro",
  "richText",
  "mediaBlock",
  "fullBleedMedia",
  "splitContent",
  "mediaGallery",
  "metrics",
  "quote",
  "cta",
] as const;

export const DESIGNER_RESPONSE_SCHEMA = {
  type: "object",

  additionalProperties: false,

  required: [
    "renderMode",
    "sections",
  ],

  properties: {
    renderMode: {
      type: "string",
      enum: [
        "flexible",
      ],
    },

    sections: {
      type: "array",
      minItems: 1,
      maxItems: 40,

      items: {
        anyOf: [
          /* ── Section Intro ─────────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "eyebrow",
              "heading",
              "body",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "sectionIntro",
                ],
              },

              eyebrow: {
                type: [
                  "string",
                  "null",
                ],
              },

              heading: {
                type: "string",
              },

              body: {
                type: [
                  "string",
                  "null",
                ],
              },

              evidenceClaimIds: {
                type: "array",

                items: {
                  type: "string",
                },
              },
            },
          },

          /* ── Semantic Rich Text ───────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "body",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "richText",
                ],
              },

              /**
               * Plain text here.
               *
               * Phase D will convert this deterministically to Lexical JSON.
               */
              body: {
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

          /* ── Media ───────────────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "assetId",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "mediaBlock",
                ],
              },

              assetId: {
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

          /* ── Full-Bleed Media ────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "assetId",
              "overlayHeading",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "fullBleedMedia",
                ],
              },

              assetId: {
                type: "string",
              },

              overlayHeading: {
                type: [
                  "string",
                  "null",
                ],
              },

              evidenceClaimIds: {
                type: "array",

                items: {
                  type: "string",
                },
              },
            },
          },

          /* ── Split Content ───────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "mediaSide",
              "body",
              "assetId",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "splitContent",
                ],
              },

              mediaSide: {
                type: "string",

                enum: [
                  "left",
                  "right",
                ],
              },

              /**
               * Plain semantic copy.
               * Converted to Lexical deterministically later.
               */
              body: {
                type: "string",
              },

              assetId: {
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

          /* ── Media Gallery ───────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "heading",
              "assetIds",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "mediaGallery",
                ],
              },

              heading: {
                type: [
                  "string",
                  "null",
                ],
              },

              assetIds: {
                type: "array",
                minItems: 1,

                items: {
                  type: "string",
                },
              },

              evidenceClaimIds: {
                type: "array",

                items: {
                  type: "string",
                },
              },
            },
          },

          /* ── Metrics ─────────────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "heading",
              "items",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "metrics",
                ],
              },

              heading: {
                type: [
                  "string",
                  "null",
                ],
              },

              items: {
                type: "array",
                minItems: 1,

                items: {
                  type: "object",

                  additionalProperties: false,

                  required: [
                    "claimId",
                    "value",
                    "label",
                    "prefix",
                    "suffix",
                    "note",
                  ],

                  properties: {
                    claimId: {
                      type: "string",
                    },

                    value: {
                      type: "string",
                    },

                    label: {
                      type: "string",
                    },

                    prefix: {
                      type: [
                        "string",
                        "null",
                      ],
                    },

                    suffix: {
                      type: [
                        "string",
                        "null",
                      ],
                    },

                    note: {
                      type: [
                        "string",
                        "null",
                      ],
                    },
                  },
                },
              },

              evidenceClaimIds: {
                type: "array",

                items: {
                  type: "string",
                },
              },
            },
          },

          /* ── Quote ───────────────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "quote",
              "attribution",
              "claimId",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: "string",
              },

              blockType: {
                type: "string",
                enum: [
                  "quote",
                ],
              },

              quote: {
                type: "string",
              },

              attribution: {
                type: [
                  "string",
                  "null",
                ],
              },

              claimId: {
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

          /* ── CTA ─────────────────────────────────── */
          {
            type: "object",

            additionalProperties: false,

            required: [
              "id",
              "chapterId",
              "blockType",
              "heading",
              "body",
              "buttonLabel",
              "targetProjectSlug",
              "evidenceClaimIds",
            ],

            properties: {
              id: {
                type: "string",
              },

              chapterId: {
                type: [
                  "string",
                  "null",
                ],
              },

              blockType: {
                type: "string",
                enum: [
                  "cta",
                ],
              },

              heading: {
                type: "string",
              },

              body: {
                type: [
                  "string",
                  "null",
                ],
              },

              buttonLabel: {
                type: [
                  "string",
                  "null",
                ],
              },

              /**
               * Never generate buttonHref.
               *
               * Phase D will create the URL deterministically from this
               * allowlisted project slug.
               */
              targetProjectSlug: {
                type: [
                  "string",
                  "null",
                ],
              },

              evidenceClaimIds: {
                type: "array",

                items: {
                  type: "string",
                },
              },
            },
          },
        ],
      },
    },
  },
} as const;

export const DESIGNER_RESPONSE_FORMAT = {
  type: "json_schema" as const,

  name: "case_study_flexible_design",

  strict: true,

  schema:
    DESIGNER_RESPONSE_SCHEMA,
};
