/**
 * GOLD STANDARD CASE STUDY AGENT
 * INDEPENDENT RECONCILIATION AUDITOR — STRUCTURED OUTPUT CONTRACT
 *
 * The Auditor reviews reconciliation.
 * It does NOT perform reconciliation itself.
 */

export const RECONCILIATION_AUDIT_CATEGORIES = [
  "missed-conflict",
  "unsafe-publication",
  "unsafe-confidence",
  "conflict-group-integrity",
  "scope-distinction",
  "decision-justification",
  "ledger-integrity",
  "other",
] as const;

export type ReconciliationAuditCategory =
  typeof RECONCILIATION_AUDIT_CATEGORIES[number];

export const RECONCILIATION_AUDIT_SEVERITIES = [
  "error",
  "warning",
] as const;

export type ReconciliationAuditSeverity =
  typeof RECONCILIATION_AUDIT_SEVERITIES[number];

/**
 * Model output only.
 *
 * Status / score / safeToContinue are deliberately absent.
 * Those are calculated deterministically by the application.
 */
export const RECONCILIATION_AUDITOR_RESPONSE_FORMAT = {
  type:
    "json_schema",

  name:
    "gold_standard_reconciliation_audit",

  strict:
    true,

  schema: {
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
                RECONCILIATION_AUDIT_CATEGORIES,
            },

            severity: {
              type:
                "string",

              enum:
                RECONCILIATION_AUDIT_SEVERITIES,
            },

            message: {
              type:
                "string",
            },

            claimIds: {
              type:
                "array",

              minItems:
                1,

              items: {
                type:
                  "string",
              },
            },
          },
        },
      },
    },
  },
} as const;
