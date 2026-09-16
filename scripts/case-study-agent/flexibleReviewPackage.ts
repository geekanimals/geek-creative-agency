/**
 * GOLD STANDARD CASE STUDY AGENT
 * FLEXIBLE REVIEW PACKAGE
 *
 * Purpose:
 * - freeze the exact generated candidate for human review;
 * - attach the deterministic Flexible benchmark;
 * - create a stable SHA-256 fingerprint;
 * - detect accidental candidate/benchmark modification before CMS write.
 *
 * This module:
 * - does NOT call AI;
 * - does NOT connect to Payload;
 * - does NOT connect to a database;
 * - does NOT publish anything.
 */

import {
  createHash,
} from "node:crypto";

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

import {
  benchmarkFlexibleCandidate,
} from "./flexibleBenchmark";

import type {
  FlexibleBenchmarkResult,
} from "./flexibleBenchmark";

/* ── Public types ─────────────────────────────────── */

export type FlexibleReviewPackage = {
  formatVersion:
    1;

  candidateHash:
    string;

  candidate:
    GoldStandardCaseStudyCandidate;

  benchmark:
    FlexibleBenchmarkResult;
};

/* ── Canonical JSON ───────────────────────────────── */

/**
 * Sort every object key recursively so the candidate fingerprint
 * does not depend on property insertion order.
 *
 * Arrays deliberately retain their original order because:
 * - section order is meaningful;
 * - chapter order is meaningful;
 * - source / evidence ordering may be meaningful;
 * - relationship lists are already controlled upstream.
 */
function canonicalize(
  value:
    unknown,
): unknown {
  if (
    Array.isArray(
      value,
    )
  ) {
    return value.map(
      (
        item,
      ) =>
        canonicalize(
          item,
        ),
    );
  }

  if (
    value !==
      null &&
    typeof value ===
      "object"
  ) {
    const record =
      value as
        Record<
          string,
          unknown
        >;

    const output:
      Record<
        string,
        unknown
      > = {};

    for (
      const key of
      Object.keys(
        record,
      ).sort()
    ) {
      output[key] =
        canonicalize(
          record[key],
        );
    }

    return output;
  }

  return value;
}

function stableStringify(
  value:
    unknown,
): string {
  return JSON.stringify(
    canonicalize(
      value,
    ),
  );
}

/* ── Candidate fingerprint ────────────────────────── */

export function hashFlexibleCandidate(
  candidate:
    GoldStandardCaseStudyCandidate,
): string {
  return createHash(
    "sha256",
  )
    .update(
      stableStringify(
        candidate,
      ),
      "utf8",
    )
    .digest(
      "hex",
    );
}

/* ── Build review package ─────────────────────────── */

export function buildFlexibleReviewPackage(
  candidate:
    GoldStandardCaseStudyCandidate,
): FlexibleReviewPackage {
  /**
   * Freeze the serializable form that will actually be reviewed.
   *
   * This prevents later mutation of the caller's candidate object
   * from silently changing the review package in memory.
   */
  const frozenCandidate =
    JSON.parse(
      JSON.stringify(
        candidate,
      ),
    ) as
      GoldStandardCaseStudyCandidate;

  const benchmark =
    benchmarkFlexibleCandidate(
      frozenCandidate,
    );

  return {
    formatVersion:
      1,

    candidateHash:
      hashFlexibleCandidate(
        frozenCandidate,
      ),

    candidate:
      frozenCandidate,

    benchmark,
  };
}

/* ── Runtime verification ─────────────────────────── */

function isRecord(
  value:
    unknown,
): value is
  Record<
    string,
    unknown
  > {
  return (
    value !==
      null &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value,
    )
  );
}

/**
 * Re-validates a review package loaded from disk.
 *
 * Important:
 * A SHA-256 fingerprint is tamper-evidence for the operator workflow,
 * not a cryptographic signature or authentication mechanism.
 *
 * Actual CMS safety is independently enforced again by
 * flexibleWriter.ts at the mutation boundary.
 */
export function validateFlexibleReviewPackage(
  value:
    unknown,
): FlexibleReviewPackage {
  if (
    !isRecord(
      value,
    )
  ) {
    throw new Error(
      "Flexible review package must be an object.",
    );
  }

  if (
    value.formatVersion !==
    1
  ) {
    throw new Error(
      "Flexible review package has an unsupported formatVersion.",
    );
  }

  if (
    !isRecord(
      value.candidate,
    )
  ) {
    throw new Error(
      "Flexible review package is missing candidate.",
    );
  }

  if (
    typeof value.candidateHash !==
      "string" ||
    !/^[a-f0-9]{64}$/.test(
      value.candidateHash,
    )
  ) {
    throw new Error(
      "Flexible review package has an invalid candidateHash.",
    );
  }

  if (
    !isRecord(
      value.benchmark,
    )
  ) {
    throw new Error(
      "Flexible review package is missing benchmark.",
    );
  }

  const candidate =
    value.candidate as unknown as
      GoldStandardCaseStudyCandidate;

  const expectedHash =
    hashFlexibleCandidate(
      candidate,
    );

  if (
    expectedHash !==
    value.candidateHash
  ) {
    throw new Error(
      "Flexible review package candidate fingerprint mismatch. The reviewed candidate has changed.",
    );
  }

  /**
   * Benchmark is deterministic and therefore must still equal
   * a fresh benchmark of the exact candidate.
   */
  const expectedBenchmark =
    benchmarkFlexibleCandidate(
      candidate,
    );

  if (
    stableStringify(
      expectedBenchmark,
    ) !==
    stableStringify(
      value.benchmark,
    )
  ) {
    throw new Error(
      "Flexible review package benchmark mismatch. Regenerate the review package before approval.",
    );
  }

  return value as unknown as
    FlexibleReviewPackage;
}
