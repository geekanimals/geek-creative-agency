/**
 * GOLD STANDARD CASE STUDY AGENT — DISCOVERY REVIEW
 *
 * Source Discovery candidates
 *   → explicit operator review
 *   → Trusted Source Manifest draft
 *
 * IMPORTANT:
 *
 * Discovery NEVER:
 * - assigns an EvidenceSourceKind;
 * - creates an evidence source ID;
 * - approves a source for extraction;
 * - treats discovered content as true.
 *
 * Those decisions belong to the operator.
 *
 * Binary/document candidates that require extraction
 * cannot become Manifest entries until textual content
 * has explicitly been supplied.
 *
 * No AI.
 * No network.
 * No CMS.
 * No database.
 */

import {
  buildTrustedSourceManifest,
} from "./sourceManifest";

import type {
  EvidenceSourceKind,
} from "./types";

import type {
  SourceDiscoveryResult,
} from "./sourceDiscovery";

import type {
  SourceIntakeStatus,
  TrustedSourceManifest,
} from "./sourceManifest";

/* ── Review decisions ─────────────────────────────── */

export type DiscoveryReviewAction =
  | "register"
  | "reject"
  | "defer";

export type DiscoveryReviewDecision = {
  discoveryId:
    string;

  action:
    DiscoveryReviewAction;

  /**
   * Required only when action=register.
   */
  sourceId?:
    string;

  /**
   * Operator-selected canonical source classification.
   *
   * Discovery itself never infers this.
   */
  kind?:
    EvidenceSourceKind;

  /**
   * Required only when action=register.
   */
  status?:
    SourceIntakeStatus;

  /**
   * Optional operator title override.
   */
  title?:
    string;

  /**
   * Required for candidates whose contentState is
   * requires-extraction.
   *
   * For text-ready candidates, discovered content is
   * preserved exactly and this must not be supplied.
   */
  extractedContent?:
    string;

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

export type BuildManifestDraftFromDiscoveryRequest = {
  discovery:
    SourceDiscoveryResult;

  reviews:
    DiscoveryReviewDecision[];
};

/* ── Internal review audit ────────────────────────── */

export type DiscoveryReviewAuditEntry = {
  discoveryId:
    string;

  reference:
    string;

  action:
    DiscoveryReviewAction;

  sourceId?:
    string;

  reason:
    string;
};

export type DiscoveryReviewResult = {
  /**
   * Deterministically validated Manifest containing
   * only explicitly registered candidates.
   */
  manifest:
    TrustedSourceManifest;

  /**
   * Full review trail, including rejected/deferred items.
   */
  audit:
    DiscoveryReviewAuditEntry[];

  /**
   * Candidates with no operator decision yet.
   */
  unreviewedDiscoveryIds:
    string[];
};

/* ── Helpers ──────────────────────────────────────── */

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

/* ── Public deterministic bridge ──────────────────── */

export function buildManifestDraftFromDiscovery(
  request:
    BuildManifestDraftFromDiscoveryRequest,
): DiscoveryReviewResult {
  if (
    !request.discovery ||
    !Array.isArray(
      request.discovery.candidates,
    )
  ) {
    throw new Error(
      "Discovery Review requires a valid discovery result.",
    );
  }

  if (
    !Array.isArray(
      request.reviews,
    )
  ) {
    throw new Error(
      "Discovery Review reviews must be an array.",
    );
  }

  const candidateById =
    new Map(
      request.discovery.candidates.map(
        (candidate) => [
          candidate.discoveryId,
          candidate,
        ],
      ),
    );

  const seenReviews =
    new Set<string>();

  const manifestEntries:
    Parameters<
      typeof buildTrustedSourceManifest
    >[0]["entries"] =
    [];

  const audit:
    DiscoveryReviewAuditEntry[] =
    [];

  for (
    const review
    of request.reviews
  ) {
    if (
      !nonEmpty(
        review.discoveryId,
      )
    ) {
      throw new Error(
        "Discovery Review decision requires discoveryId.",
      );
    }

    if (
      seenReviews.has(
        review.discoveryId,
      )
    ) {
      throw new Error(
        `Discovery Review contains duplicate decision for ${review.discoveryId}.`,
      );
    }

    seenReviews.add(
      review.discoveryId,
    );

    const candidate =
      candidateById.get(
        review.discoveryId,
      );

    if (
      !candidate
    ) {
      throw new Error(
        `Discovery Review references unknown discoveryId: ${review.discoveryId}`,
      );
    }

    if (
      review.action !==
        "register" &&
      review.action !==
        "reject" &&
      review.action !==
        "defer"
    ) {
      throw new Error(
        `Discovery Review "${review.discoveryId}" has invalid action.`,
      );
    }

    if (
      review.action ===
      "reject"
    ) {
      audit.push({
        discoveryId:
          candidate.discoveryId,

        reference:
          candidate.reference,

        action:
          "reject",

        reason:
          "Operator rejected discovered material.",
      });

      continue;
    }

    if (
      review.action ===
      "defer"
    ) {
      audit.push({
        discoveryId:
          candidate.discoveryId,

        reference:
          candidate.reference,

        action:
          "defer",

        reason:
          "Operator deferred review.",
      });

      continue;
    }

    /* ── register ───────────────────────────────── */

    if (
      !nonEmpty(
        review.sourceId,
      )
    ) {
      throw new Error(
        `Discovery Review "${review.discoveryId}" register action requires sourceId.`,
      );
    }

    if (
      !review.kind
    ) {
      throw new Error(
        `Discovery Review "${review.discoveryId}" register action requires operator-selected kind.`,
      );
    }

    if (
      !review.status
    ) {
      throw new Error(
        `Discovery Review "${review.discoveryId}" register action requires explicit intake status.`,
      );
    }

    let content:
      string;

    if (
      candidate.contentState ===
      "text-ready"
    ) {
      if (
        review.extractedContent !==
        undefined
      ) {
        throw new Error(
          `Discovery Review "${review.discoveryId}" cannot replace discovered text-ready content.`,
        );
      }

      if (
        !nonEmpty(
          candidate.content,
        )
      ) {
        throw new Error(
          `Discovery Review "${review.discoveryId}" text-ready candidate has no usable content.`,
        );
      }

      content =
        candidate.content;
    } else {
      if (
        !nonEmpty(
          review.extractedContent,
        )
      ) {
        throw new Error(
          `Discovery Review "${review.discoveryId}" requires extractedContent before registration.`,
        );
      }

      content =
        review.extractedContent;
    }

    manifestEntries.push({
      id:
        review.sourceId,

      kind:
        review.kind,

      title:
        nonEmpty(
          review.title,
        )
          ? review.title.trim()
          : candidate.title,

      content,

      origin: {
        kind:
          "local-file",

        reference:
          candidate.reference,

        note:
          `Discovery ID: ${candidate.discoveryId}; SHA-256: ${candidate.sha256}`,
      },

      status:
        review.status,

      url:
        review.url,

      publisher:
        review.publisher,

      publicationDate:
        review.publicationDate,

      capturedAt:
        review.capturedAt,

      notes:
        review.notes,
    });

    audit.push({
      discoveryId:
        candidate.discoveryId,

      reference:
        candidate.reference,

      action:
        "register",

      sourceId:
        review.sourceId,

      reason:
        "Operator explicitly registered discovered material into the Trusted Source Manifest.",
    });
  }

  const manifest =
    buildTrustedSourceManifest({
      entries:
        manifestEntries,
    });

  const unreviewedDiscoveryIds =
    request.discovery.candidates
      .filter(
        (candidate) =>
          !seenReviews.has(
            candidate.discoveryId,
          ),
      )
      .map(
        (candidate) =>
          candidate.discoveryId,
      )
      .sort();

  return {
    manifest,
    audit,
    unreviewedDiscoveryIds,
  };
}
