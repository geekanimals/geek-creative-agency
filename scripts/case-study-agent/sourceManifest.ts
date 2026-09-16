/**
 * GOLD STANDARD CASE STUDY AGENT — TRUSTED SOURCE MANIFEST
 *
 * Raw source material
 *   → deterministic source registration
 *   → provenance + operator intake status
 *   → validated trusted source manifest
 *
 * This layer DOES NOT:
 * - extract evidence;
 * - decide whether a claim is true;
 * - assign confidence;
 * - make anything publication-ready;
 * - access CMS / Payload / database;
 * - discover files or URLs automatically.
 *
 * "approved-for-extraction" means only:
 * the operator permits this source to enter the Evidence Pipeline.
 */

import type {
  EvidenceSourceKind,
} from "./types";

/* ── Existing canonical source kinds ───────────────── */

export const EVIDENCE_SOURCE_KINDS:
  readonly EvidenceSourceKind[] =
[
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
] as const;

/* ── Intake provenance ─────────────────────────────── */

export const SOURCE_ORIGIN_KINDS = [
  "uploaded-file",
  "local-file",
  "pasted-text",
  "url",
  "connected-drive",
  "campaign-archive",
  "manual-entry",
  "other",
] as const;

export type SourceOriginKind =
  typeof SOURCE_ORIGIN_KINDS[number];

export const SOURCE_INTAKE_STATUSES = [
  "pending",
  "approved-for-extraction",
  "rejected",
] as const;

export type SourceIntakeStatus =
  typeof SOURCE_INTAKE_STATUSES[number];

export type SourceOrigin = {
  kind:
    SourceOriginKind;

  /**
   * Internal locator/reference only.
   *
   * Examples:
   * - uploaded filename
   * - Drive document identifier
   * - archive folder reference
   * - source URL
   *
   * This field is provenance, not evidence.
   */
  reference:
    string;

  /**
   * Optional human note about how this source entered
   * the case-study workflow.
   */
  note?:
    string;
};

/* ── Operator input ────────────────────────────────── */

export type SourceManifestEntryInput = {
  /**
   * Stable ID later used by evidence claims.
   */
  id:
    string;

  /**
   * Existing repository evidence-source classification.
   */
  kind:
    EvidenceSourceKind;

  title:
    string;

  /**
   * Extracted / supplied textual content.
   *
   * No claim from this text is trusted merely because
   * the source is present in this manifest.
   */
  content:
    string;

  origin:
    SourceOrigin;

  /**
   * Operator-controlled intake decision.
   *
   * Only approved-for-extraction sources may later be
   * converted into GenerationSource[].
   */
  status:
    SourceIntakeStatus;

  url?:
    string;

  publisher?:
    string;

  publicationDate?:
    string;

  capturedAt?:
    string;

  notes?:
    string;
};

export type BuildSourceManifestRequest = {
  entries:
    SourceManifestEntryInput[];
};

/* ── Validated output ──────────────────────────────── */

export type TrustedSourceManifestEntry = {
  id:
    string;

  kind:
    EvidenceSourceKind;

  title:
    string;

  content:
    string;

  origin:
    SourceOrigin;

  status:
    SourceIntakeStatus;

  url?:
    string;

  publisher?:
    string;

  publicationDate?:
    string;

  capturedAt?:
    string;

  notes?:
    string;
};

export type TrustedSourceManifest = {
  entries:
    TrustedSourceManifestEntry[];

  approvedCount:
    number;

  pendingCount:
    number;

  rejectedCount:
    number;
};

/* ── Helpers ───────────────────────────────────────── */

const SAFE_ID =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function nonEmpty(
  value: unknown,
): value is string {
  return (
    typeof value ===
      "string" &&
    Boolean(
      value.trim(),
    )
  );
}

function cleanOptional(
  value:
    | string
    | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const cleaned =
    value.trim();

  return cleaned
    ? cleaned
    : undefined;
}

function assertSafeId(
  value: unknown,
  context: string,
): asserts value is string {
  if (
    !nonEmpty(
      value,
    ) ||
    !SAFE_ID.test(
      value.trim(),
    )
  ) {
    throw new Error(
      `${context} must be a safe lower-kebab-case ID.`,
    );
  }
}

function isHttpUrl(
  value: string,
): boolean {
  try {
    const parsed =
      new URL(
        value,
      );

    return (
      parsed.protocol ===
        "https:" ||
      parsed.protocol ===
        "http:"
    );
  } catch {
    return false;
  }
}

function validateOptionalDate(
  value:
    string | undefined,
  context:
    string,
): string | undefined {
  const cleaned =
    cleanOptional(
      value,
    );

  if (!cleaned) {
    return undefined;
  }

  if (
    Number.isNaN(
      Date.parse(
        cleaned,
      ),
    )
  ) {
    throw new Error(
      `${context} must be a valid date/date-time string.`,
    );
  }

  return cleaned;
}

/* ── Public deterministic builder ──────────────────── */

export function buildTrustedSourceManifest(
  request:
    BuildSourceManifestRequest,
): TrustedSourceManifest {
  if (
    !Array.isArray(
      request.entries,
    )
  ) {
    throw new Error(
      "Trusted Source Manifest entries must be an array.",
    );
  }

  const seenIds =
    new Set<string>();

  const entries:
    TrustedSourceManifestEntry[] =
    [];

  for (
    const raw
    of request.entries
  ) {
    assertSafeId(
      raw.id,
      "Trusted Source Manifest entry.id",
    );

    const id =
      raw.id.trim();

    if (
      seenIds.has(
        id,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest contains duplicate source ID: ${id}`,
      );
    }

    seenIds.add(
      id,
    );

    if (
      !(
        EVIDENCE_SOURCE_KINDS as readonly string[]
      ).includes(
        raw.kind,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" has invalid evidence source kind.`,
      );
    }

    if (
      !nonEmpty(
        raw.title,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" requires title.`,
      );
    }

    if (
      !nonEmpty(
        raw.content,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" requires non-empty content.`,
      );
    }

    if (
      !raw.origin ||
      !(
        SOURCE_ORIGIN_KINDS as readonly string[]
      ).includes(
        raw.origin.kind,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" requires valid origin.kind.`,
      );
    }

    if (
      !nonEmpty(
        raw.origin.reference,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" requires origin.reference.`,
      );
    }

    if (
      !(
        SOURCE_INTAKE_STATUSES as readonly string[]
      ).includes(
        raw.status,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" has invalid intake status.`,
      );
    }

    const url =
      cleanOptional(
        raw.url,
      );

    if (
      url &&
      !isHttpUrl(
        url,
      )
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" url must be http or https.`,
      );
    }

    /**
     * URL-origin entries must preserve their actual URL
     * in the source metadata rather than relying only on
     * a free-text provenance reference.
     */
    if (
      raw.origin.kind ===
        "url" &&
      !url
    ) {
      throw new Error(
        `Trusted Source Manifest "${id}" with url origin requires url.`,
      );
    }

    entries.push({
      id,

      kind:
        raw.kind,

      title:
        raw.title.trim(),

      content:
        raw.content,

      origin: {
        kind:
          raw.origin.kind,

        reference:
          raw.origin.reference.trim(),

        note:
          cleanOptional(
            raw.origin.note,
          ),
      },

      status:
        raw.status,

      url,

      publisher:
        cleanOptional(
          raw.publisher,
        ),

      publicationDate:
        validateOptionalDate(
          raw.publicationDate,
          `Trusted Source Manifest "${id}" publicationDate`,
        ),

      capturedAt:
        validateOptionalDate(
          raw.capturedAt,
          `Trusted Source Manifest "${id}" capturedAt`,
        ),

      notes:
        cleanOptional(
          raw.notes,
        ),
    });
  }

  return {
    entries,

    approvedCount:
      entries.filter(
        (entry) =>
          entry.status ===
          "approved-for-extraction",
      ).length,

    pendingCount:
      entries.filter(
        (entry) =>
          entry.status ===
          "pending",
      ).length,

    rejectedCount:
      entries.filter(
        (entry) =>
          entry.status ===
          "rejected",
      ).length,
  };
}
