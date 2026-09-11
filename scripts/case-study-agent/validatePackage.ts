/**
 * GOLD STANDARD CASE STUDY AGENT — RUNTIME PACKAGE VALIDATION
 *
 * Dependency-free runtime validation for AI/generated JSON input.
 *
 * TypeScript types do not protect us from malformed JSON files, so every
 * external package must cross this boundary before quality checks or CMS writes.
 */

import type {
  CaseStudyAgentPackage,
  ClaimConfidence,
  ClaimType,
  EvidenceSourceKind,
} from "./types";

export class PackageValidationError extends Error {
  issues: string[];

  constructor(issues: string[]) {
    super(
      `Invalid Case Study Agent package:\n${issues
        .map((issue) => `- ${issue}`)
        .join("\n")}`,
    );

    this.name = "PackageValidationError";
    this.issues = issues;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function nonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

function optionalString(
  value: unknown,
  path: string,
  issues: string[],
) {
  if (value !== undefined && !isString(value)) {
    issues.push(`${path} must be a string when provided`);
  }
}

function optionalNumber(
  value: unknown,
  path: string,
  issues: string[],
) {
  if (
    value !== undefined &&
    (typeof value !== "number" || !Number.isFinite(value))
  ) {
    issues.push(`${path} must be a finite number when provided`);
  }
}

function optionalBoolean(
  value: unknown,
  path: string,
  issues: string[],
) {
  if (value !== undefined && typeof value !== "boolean") {
    issues.push(`${path} must be a boolean when provided`);
  }
}

function stringArray(
  value: unknown,
  path: string,
  issues: string[],
  required = false,
) {
  if (value === undefined) {
    if (required) issues.push(`${path} is required`);
    return;
  }

  if (!Array.isArray(value)) {
    issues.push(`${path} must be an array`);
    return;
  }

  value.forEach((item, index) => {
    if (!nonEmptyString(item)) {
      issues.push(`${path}[${index}] must be a non-empty string`);
    }
  });
}

function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  issues: string[],
): value is T {
  if (
    typeof value !== "string" ||
    !allowed.includes(value as T)
  ) {
    issues.push(
      `${path} must be one of: ${allowed.join(", ")}`,
    );

    return false;
  }

  return true;
}

const PROJECT_KINDS = [
  "campaign",
  "ongoing-program",
  "platform",
  "activation",
] as const;

const SOURCE_KINDS: readonly EvidenceSourceKind[] = [
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
];

const CLAIM_TYPES: readonly ClaimType[] = [
  "fact",
  "metric",
  "quote",
  "relationship",
  "award",
  "press",
  "narrative",
];

const CONFIDENCE: readonly ClaimConfidence[] = [
  "high",
  "medium",
  "low",
];

function validateProject(
  value: unknown,
  issues: string[],
) {
  if (!isObject(value)) {
    issues.push("project must be an object");
    return;
  }

  if (!nonEmptyString(value.slug)) {
    issues.push("project.slug is required");
  }

  if (!nonEmptyString(value.title)) {
    issues.push("project.title is required");
  }

  if (value.renderMode !== "standard") {
    issues.push(
      'project.renderMode must be exactly "standard" for Agent v1',
    );
  }

  oneOf(
    value.projectKind,
    PROJECT_KINDS,
    "project.projectKind",
    issues,
  );

  optionalString(value.client, "project.client", issues);
  optionalNumber(value.year, "project.year", issues);
  optionalString(value.location, "project.location", issues);

  optionalString(
    value.shortSummary,
    "project.shortSummary",
    issues,
  );

  optionalString(
    value.cardSummary,
    "project.cardSummary",
    issues,
  );

  optionalString(
    value.heroLegacySrc,
    "project.heroLegacySrc",
    issues,
  );

  optionalString(
    value.companySlug,
    "project.companySlug",
    issues,
  );

  optionalString(
    value.brandSlug,
    "project.brandSlug",
    issues,
  );

  stringArray(
    value.businessCategorySlugs,
    "project.businessCategorySlugs",
    issues,
  );

  stringArray(
    value.serviceSlugs,
    "project.serviceSlugs",
    issues,
  );

  stringArray(
    value.solutionSlugs,
    "project.solutionSlugs",
    issues,
  );

  optionalString(
    value.headline,
    "project.headline",
    issues,
  );

  optionalString(
    value.insight,
    "project.insight",
    issues,
  );

  optionalString(
    value.execution,
    "project.execution",
    issues,
  );

  optionalString(
    value.outcome,
    "project.outcome",
    issues,
  );

  if (value.challenge !== undefined) {
    if (!isObject(value.challenge)) {
      issues.push("project.challenge must be an object");
    } else {
      optionalString(
        value.challenge.question,
        "project.challenge.question",
        issues,
      );

      optionalString(
        value.challenge.copy,
        "project.challenge.copy",
        issues,
      );
    }
  }

  if (value.idea !== undefined) {
    if (!isObject(value.idea)) {
      issues.push("project.idea must be an object");
    } else {
      optionalString(
        value.idea.statement,
        "project.idea.statement",
        issues,
      );

      optionalString(
        value.idea.copy,
        "project.idea.copy",
        issues,
      );
    }
  }

  if (value.quote !== undefined) {
    if (!isObject(value.quote)) {
      issues.push("project.quote must be an object");
    } else {
      optionalString(
        value.quote.text,
        "project.quote.text",
        issues,
      );

      optionalString(
        value.quote.attribution,
        "project.quote.attribution",
        issues,
      );
    }
  }

  if (value.metrics !== undefined) {
    if (!Array.isArray(value.metrics)) {
      issues.push("project.metrics must be an array");
    } else {
      value.metrics.forEach((metric, index) => {
        if (!isObject(metric)) {
          issues.push(
            `project.metrics[${index}] must be an object`,
          );
          return;
        }

        if (!nonEmptyString(metric.value)) {
          issues.push(
            `project.metrics[${index}].value is required`,
          );
        }

        if (!nonEmptyString(metric.label)) {
          issues.push(
            `project.metrics[${index}].label is required`,
          );
        }

        optionalString(
          metric.prefix,
          `project.metrics[${index}].prefix`,
          issues,
        );

        optionalString(
          metric.suffix,
          `project.metrics[${index}].suffix`,
          issues,
        );

        optionalString(
          metric.note,
          `project.metrics[${index}].note`,
          issues,
        );

        optionalString(
          metric.claimId,
          `project.metrics[${index}].claimId`,
          issues,
        );
      });
    }
  }

  if (value.seo !== undefined) {
    if (!isObject(value.seo)) {
      issues.push("project.seo must be an object");
    } else {
      optionalString(
        value.seo.metaTitle,
        "project.seo.metaTitle",
        issues,
      );

      optionalString(
        value.seo.metaDescription,
        "project.seo.metaDescription",
        issues,
      );

      optionalBoolean(
        value.seo.noindex,
        "project.seo.noindex",
        issues,
      );
    }
  }
}

function validateEvidence(
  value: unknown,
  issues: string[],
) {
  if (!isObject(value)) {
    issues.push("evidence must be an object");
    return;
  }

  if (!Array.isArray(value.sources)) {
    issues.push("evidence.sources must be an array");
  } else {
    value.sources.forEach((source, index) => {
      if (!isObject(source)) {
        issues.push(
          `evidence.sources[${index}] must be an object`,
        );
        return;
      }

      if (!nonEmptyString(source.id)) {
        issues.push(
          `evidence.sources[${index}].id is required`,
        );
      }

      if (!nonEmptyString(source.title)) {
        issues.push(
          `evidence.sources[${index}].title is required`,
        );
      }

      oneOf(
        source.kind,
        SOURCE_KINDS,
        `evidence.sources[${index}].kind`,
        issues,
      );

      optionalString(
        source.url,
        `evidence.sources[${index}].url`,
        issues,
      );

      optionalString(
        source.publisher,
        `evidence.sources[${index}].publisher`,
        issues,
      );

      optionalString(
        source.publicationDate,
        `evidence.sources[${index}].publicationDate`,
        issues,
      );

      optionalString(
        source.capturedAt,
        `evidence.sources[${index}].capturedAt`,
        issues,
      );

      optionalString(
        source.notes,
        `evidence.sources[${index}].notes`,
        issues,
      );
    });
  }

  if (value.narrativeBindings !== undefined) {
    if (!Array.isArray(value.narrativeBindings)) {
      issues.push(
        "evidence.narrativeBindings must be an array",
      );
    } else {
      const allowedFields = [
        "challenge",
        "insight",
        "idea",
        "execution",
        "outcome",
      ] as const;

      value.narrativeBindings.forEach(
        (binding, index) => {
          if (!isObject(binding)) {
            issues.push(
              `evidence.narrativeBindings[${index}] must be an object`,
            );
            return;
          }

          oneOf(
            binding.field,
            allowedFields,
            `evidence.narrativeBindings[${index}].field`,
            issues,
          );

          stringArray(
            binding.claimIds,
            `evidence.narrativeBindings[${index}].claimIds`,
            issues,
            true,
          );
        },
      );
    }
  }

  if (!Array.isArray(value.claims)) {
    issues.push("evidence.claims must be an array");
  } else {
    value.claims.forEach((claim, index) => {
      if (!isObject(claim)) {
        issues.push(
          `evidence.claims[${index}] must be an object`,
        );
        return;
      }

      if (!nonEmptyString(claim.id)) {
        issues.push(
          `evidence.claims[${index}].id is required`,
        );
      }

      if (!nonEmptyString(claim.statement)) {
        issues.push(
          `evidence.claims[${index}].statement is required`,
        );
      }

      oneOf(
        claim.type,
        CLAIM_TYPES,
        `evidence.claims[${index}].type`,
        issues,
      );

      oneOf(
        claim.confidence,
        CONFIDENCE,
        `evidence.claims[${index}].confidence`,
        issues,
      );

      stringArray(
        claim.sourceIds,
        `evidence.claims[${index}].sourceIds`,
        issues,
        true,
      );

      if (typeof claim.publishable !== "boolean") {
        issues.push(
          `evidence.claims[${index}].publishable must be boolean`,
        );
      }

      optionalString(
        claim.note,
        `evidence.claims[${index}].note`,
        issues,
      );

      /**
       * Verbatim support is optional at the package boundary during migration
       * so existing frozen benchmark packages remain valid.
       *
       * New model generations require support[] through generationSchema.ts.
       */
      if (claim.support !== undefined) {
        if (!Array.isArray(claim.support)) {
          issues.push(
            `evidence.claims[${index}].support must be an array`,
          );
        } else {
          claim.support.forEach((support, supportIndex) => {
            if (!isObject(support)) {
              issues.push(
                `evidence.claims[${index}].support[${supportIndex}] must be an object`,
              );
              return;
            }

            if (!nonEmptyString(support.sourceId)) {
              issues.push(
                `evidence.claims[${index}].support[${supportIndex}].sourceId is required`,
              );
            }

            if (!nonEmptyString(support.excerpt)) {
              issues.push(
                `evidence.claims[${index}].support[${supportIndex}].excerpt is required`,
              );
            }
          });
        }
      }
    });
  }
}

/**
 * Validate unknown external JSON and return a typed package.
 *
 * `quality` is intentionally not deeply trusted here because the writer
 * recomputes it immediately before every CMS write.
 */
export function validateCaseStudyPackage(
  input: unknown,
): CaseStudyAgentPackage {
  const issues: string[] = [];

  if (!isObject(input)) {
    throw new PackageValidationError([
      "root value must be an object",
    ]);
  }

  if (input.schemaVersion !== "1.0") {
    issues.push(
      'schemaVersion must be exactly "1.0"',
    );
  }

  if (!nonEmptyString(input.generatedAt)) {
    issues.push("generatedAt is required");
  }

  validateProject(input.project, issues);
  validateEvidence(input.evidence, issues);

  if (!isObject(input.quality)) {
    issues.push("quality must be an object");
  }

  if (issues.length > 0) {
    throw new PackageValidationError(issues);
  }

  return input as CaseStudyAgentPackage;
}
