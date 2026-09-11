/**
 * GOLD STANDARD CASE STUDY AGENT — TRUSTED PACKAGE BUILDER
 *
 * Boundary:
 *
 *   OpenAI Structured Output
 *     → remove schema-required null placeholders
 *     → add trusted system metadata
 *     → runtime validation
 *     → recompute Gold Standard quality
 *     → CaseStudyAgentPackage
 *
 * The model never controls:
 * - schemaVersion
 * - generatedAt
 * - quality.status
 * - quality.draftReady
 * - quality.score
 * - quality.issues
 */

import { runQualityGate } from "./qualityGate";
import {
  PackageValidationError,
  validateCaseStudyPackage,
} from "./validatePackage";

import type {
  CaseStudyAgentPackage,
  QualityGateResult,
} from "./types";

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Structured Outputs strict mode requires optional properties to exist,
 * usually with null values.
 *
 * Our internal contract uses ordinary optional properties instead.
 *
 * This recursively:
 * - removes null object properties;
 * - preserves arrays;
 * - removes null array entries defensively;
 * - leaves false / 0 / empty strings unchanged for later validation.
 */
export function removeNullPlaceholders(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== null)
      .map((item) =>
        removeNullPlaceholders(item),
      );
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== null)
        .map(([key, entry]) => [
          key,
          removeNullPlaceholders(entry),
        ]),
    );
  }

  return value;
}

export type BuildPackageOptions = {
  /**
   * Injectable for deterministic tests.
   * Production generation should omit this.
   */
  generatedAt?: string;
};

export type BuiltCaseStudyPackage = {
  package: CaseStudyAgentPackage;
  quality: QualityGateResult;
};

export function buildCaseStudyPackage(
  modelOutput: unknown,
  options: BuildPackageOptions = {},
): BuiltCaseStudyPackage {
  const normalized =
    removeNullPlaceholders(modelOutput);

  if (!isObject(normalized)) {
    throw new PackageValidationError([
      "model output must be an object",
    ]);
  }

  /**
   * Do not spread arbitrary root properties into the package.
   * Only the two model-owned roots are admitted.
   */
  const candidate: unknown = {
    schemaVersion: "1.0",

    generatedAt:
      options.generatedAt ??
      new Date().toISOString(),

    project: normalized.project,

    evidence: normalized.evidence,

    /**
     * Placeholder only so the runtime package contract can validate.
     * It is overwritten immediately after validation.
     */
    quality: {
      status: "fail",
      draftReady: false,
      score: 0,
      issues: [],
    },
  };

  /**
   * First trusted boundary:
   * malformed AI output cannot continue.
   */
  const validated =
    validateCaseStudyPackage(candidate);

  /**
   * Second trusted boundary:
   * quality is always calculated by our code.
   */
  const quality = runQualityGate(validated);

  const pkg: CaseStudyAgentPackage = {
    ...validated,
    quality,
  };

  return {
    package: pkg,
    quality,
  };
}
