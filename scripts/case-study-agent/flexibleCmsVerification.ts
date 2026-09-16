/**
 * GOLD STANDARD CASE STUDY AGENT
 * CMS DRAFT READ-BACK VERIFICATION
 *
 * Pure deterministic verification.
 *
 * No Payload initialization.
 * No database access.
 * No CMS mutation.
 * No publishing.
 *
 * Purpose:
 * Compare the exact Agent-owned draft payload with the document
 * returned by Payload after a draft write.
 *
 * Payload-generated block / array row IDs are ignored because they
 * are storage metadata rather than authored case-study content.
 */

export type FlexibleCmsVerificationIssue = {
  code: string;
  path: string;
  message: string;
};

export type FlexibleCmsReadbackVerification = {
  verified: boolean;
  issues: FlexibleCmsVerificationIssue[];
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function relationshipId(
  value: unknown,
): unknown {
  if (
    isRecord(value) &&
    (
      typeof value.id === "string" ||
      typeof value.id === "number"
    )
  ) {
    return value.id;
  }

  return value;
}

function normalizeRelationshipMany(
  value: unknown,
): unknown {
  if (!Array.isArray(value)) {
    return value;
  }

  return value
    .map(
      (item) =>
        relationshipId(item),
    )
    .sort(
      (left, right) =>
        String(left).localeCompare(
          String(right),
        ),
    );
}

/**
 * Payload blocks and array rows may receive generated `id` fields.
 *
 * These IDs do not represent authored case-study content and therefore
 * must not cause a false verification failure.
 *
 * `media` is an upload relationship. When populated by Payload it may
 * appear as an object; normalize it back to its relationship ID.
 */
function normalizeSectionValue(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      normalizeSectionValue,
    );
  }

  if (!isRecord(value)) {
    return value;
  }

  const output:
    Record<string, unknown> = {};

  for (
    const [
      key,
      child,
    ] of Object.entries(value)
  ) {
    if (key === "id") {
      continue;
    }

    if (key === "media") {
      output[key] =
        relationshipId(child);

      continue;
    }

    output[key] =
      normalizeSectionValue(
        child,
      );
  }

  return output;
}

function canonicalize(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      canonicalize,
    );
  }

  if (!isRecord(value)) {
    return value;
  }

  const output:
    Record<string, unknown> = {};

  for (
    const key
    of Object.keys(value).sort()
  ) {
    output[key] =
      canonicalize(
        value[key],
      );
  }

  return output;
}

function sameValue(
  left: unknown,
  right: unknown,
): boolean {
  return (
    JSON.stringify(
      canonicalize(left),
    ) ===
    JSON.stringify(
      canonicalize(right),
    )
  );
}

const SINGLE_RELATIONSHIPS =
  new Set([
    "company",
    "brand",
    "heroMedia",
  ]);

const MANY_RELATIONSHIPS =
  new Set([
    "businessCategories",
    "services",
    "solutions",
  ]);

function normalizeField(
  key: string,
  value: unknown,
): unknown {
  if (key === "sections") {
    return normalizeSectionValue(
      value,
    );
  }

  if (
    SINGLE_RELATIONSHIPS.has(
      key,
    )
  ) {
    return relationshipId(
      value,
    );
  }

  if (
    MANY_RELATIONSHIPS.has(
      key,
    )
  ) {
    return normalizeRelationshipMany(
      value,
    );
  }

  return value;
}

export function verifyFlexibleCmsDraftReadback(
  expected:
    Record<string, unknown>,
  stored:
    unknown,
): FlexibleCmsReadbackVerification {
  const issues:
    FlexibleCmsVerificationIssue[] =
      [];

  if (!isRecord(stored)) {
    return {
      verified:
        false,

      issues: [
        {
          code:
            "CMS_READBACK_INVALID_DOCUMENT",

          path:
            "$",

          message:
            "Payload read-back result is not an object.",
        },
      ],
    };
  }

  if (
    stored._status !==
    "draft"
  ) {
    issues.push({
      code:
        "CMS_READBACK_NOT_DRAFT",

      path:
        "_status",

      message:
        'Stored Project must remain _status="draft".',
    });
  }

  if (
    stored.renderMode !==
    "flexible"
  ) {
    issues.push({
      code:
        "CMS_READBACK_RENDER_MODE_MISMATCH",

      path:
        "renderMode",

      message:
        'Stored Agent Project must use renderMode="flexible".',
    });
  }

  if (
    stored.flagshipRendererKey !==
      undefined &&
    stored.flagshipRendererKey !==
      null &&
    stored.flagshipRendererKey !==
      ""
  ) {
    issues.push({
      code:
        "CMS_READBACK_FLAGSHIP_RENDERER_PRESENT",

      path:
        "flagshipRendererKey",

      message:
        "Flexible Agent Project must not carry a flagship renderer.",
    });
  }

  for (
    const [
      key,
      expectedValue,
    ] of Object.entries(
      expected,
    )
  ) {
    /**
     * Optional properties represented as undefined were not meaningful
     * write instructions and therefore are not compared.
     */
    if (
      expectedValue ===
      undefined
    ) {
      continue;
    }

    const actualValue =
      stored[key];

    const normalizedExpected =
      normalizeField(
        key,
        expectedValue,
      );

    const normalizedActual =
      normalizeField(
        key,
        actualValue,
      );

    if (
      !sameValue(
        normalizedExpected,
        normalizedActual,
      )
    ) {
      issues.push({
        code:
          "CMS_READBACK_FIELD_MISMATCH",

        path:
          key,

        message:
          `Stored Project field "${key}" does not match the approved draft payload.`,
      });
    }
  }

  return {
    verified:
      issues.length === 0,

    issues,
  };
}
