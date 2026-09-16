/**
 * GOLD STANDARD CASE STUDY AGENT — SOURCE INTAKE ADAPTER
 *
 * Trusted Source Manifest
 *   → approved sources only
 *   → GenerationSource[]
 *
 * IMPORTANT:
 *
 * "approved-for-extraction" does NOT mean:
 * - true;
 * - verified;
 * - publishable;
 * - conflict-free.
 *
 * It only means the operator permits that source to enter:
 *
 * Extractor
 *   → Verifier
 *   → Reconciler
 *   → Reconciliation Auditor
 *
 * Pending and rejected sources NEVER reach the Extractor.
 *
 * No AI.
 * No CMS.
 * No Payload.
 * No database.
 * No publishing.
 */

import {
  buildTrustedSourceManifest,
} from "./sourceManifest";

import type {
  SourceIntakeStatus,
  TrustedSourceManifest,
} from "./sourceManifest";

import type {
  GenerationSource,
} from "./generator";

/* ── Public output ─────────────────────────────────── */

export type ExcludedSourceIntakeEntry = {
  id:
    string;

  status:
    Exclude<
      SourceIntakeStatus,
      "approved-for-extraction"
    >;

  reason:
    string;
};

export type SourceIntakeResult = {
  /**
   * The ONLY sources allowed to reach the existing
   * Evidence Extractor.
   */
  sources:
    GenerationSource[];

  /**
   * Internal audit trail showing which registered
   * sources were deliberately excluded.
   */
  excluded:
    ExcludedSourceIntakeEntry[];
};

/* ── Public deterministic adapter ──────────────────── */

export function buildGenerationSourcesFromManifest(
  manifest:
    TrustedSourceManifest,
): SourceIntakeResult {
  /**
   * Revalidate at this boundary.
   *
   * TypeScript types alone are not a runtime trust boundary.
   * This protects the Evidence Pipeline from a manually
   * constructed or mutated manifest object.
   */
  const validated =
    buildTrustedSourceManifest({
      entries:
        manifest.entries,
    });

  const sources:
    GenerationSource[] =
    [];

  const excluded:
    ExcludedSourceIntakeEntry[] =
    [];

  for (
    const entry
    of validated.entries
  ) {
    if (
      entry.status ===
      "approved-for-extraction"
    ) {
      sources.push({
        id:
          entry.id,

        kind:
          entry.kind,

        title:
          entry.title,

        content:
          entry.content,

        url:
          entry.url,

        publisher:
          entry.publisher,

        publicationDate:
          entry.publicationDate,

        capturedAt:
          entry.capturedAt,

        notes:
          entry.notes,
      });

      continue;
    }

    excluded.push({
      id:
        entry.id,

      status:
        entry.status,

      reason:
        entry.status ===
        "pending"
          ? "Source is pending explicit operator approval for extraction."
          : "Source was explicitly rejected for extraction.",
    });
  }

  return {
    sources,
    excluded,
  };
}
