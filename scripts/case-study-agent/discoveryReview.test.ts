/**
 * GOLD STANDARD CASE STUDY AGENT — DISCOVERY REVIEW TESTS
 *
 * No AI.
 * No network.
 * No CMS.
 * No database.
 *
 * Proves the human-control boundary between:
 *
 * discovery
 *   → explicit operator review
 *   → Trusted Source Manifest
 *
 * Discovery alone can never approve evidence.
 */

import {
  buildManifestDraftFromDiscovery,
} from "./discoveryReview";

import type {
  BuildManifestDraftFromDiscoveryRequest,
} from "./discoveryReview";

import type {
  SourceDiscoveryResult,
} from "./sourceDiscovery";

let pass = 0;
let fail = 0;

function check(
  name: string,
  condition: boolean,
) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    pass++;
  } else {
    console.log(`  ✗ ${name}`);
    fail++;
  }
}

function clone<T>(
  value: T,
): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
}

function rejectedWith(
  request:
    BuildManifestDraftFromDiscoveryRequest,
  expected:
    string,
): boolean {
  try {
    buildManifestDraftFromDiscovery(
      request,
    );

    return false;
  } catch (error) {
    return (
      error instanceof Error &&
      error.message.includes(
        expected,
      )
    );
  }
}

const DISCOVERY:
  SourceDiscoveryResult =
{
  candidates: [
    {
      discoveryId:
        "discovery-campaign-notes-aaaaaaaaaaaa",

      title:
        "campaign-notes.md",

      reference:
        "campaign/campaign-notes.md",

      extension:
        ".md",

      sizeBytes:
        32,

      sha256:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",

      contentState:
        "text-ready",

      content:
        "Campaign activated 500 creators.",

      reviewRequired:
        true,
    },

    {
      discoveryId:
        "discovery-final-report-bbbbbbbbbbbb",

      title:
        "final-report.pdf",

      reference:
        "campaign/final-report.pdf",

      extension:
        ".pdf",

      sizeBytes:
        2048,

      sha256:
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",

      contentState:
        "requires-extraction",

      reviewRequired:
        true,
    },

    {
      discoveryId:
        "discovery-old-note-cccccccccccc",

      title:
        "old-note.txt",

      reference:
        "campaign/old-note.txt",

      extension:
        ".txt",

      sizeBytes:
        24,

      sha256:
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",

      contentState:
        "text-ready",

      content:
        "Old preliminary estimate.",

      reviewRequired:
        true,
    },
  ],

  skipped: [],

  scannedFileCount:
    3,
};

function validRequest():
  BuildManifestDraftFromDiscoveryRequest {
  return {
    discovery:
      clone(
        DISCOVERY,
      ),

    reviews: [
      {
        discoveryId:
          "discovery-campaign-notes-aaaaaaaaaaaa",

        action:
          "register",

        sourceId:
          "campaign-notes",

        kind:
          "internal-document",

        status:
          "approved-for-extraction",
      },

      {
        discoveryId:
          "discovery-final-report-bbbbbbbbbbbb",

        action:
          "register",

        sourceId:
          "final-campaign-report",

        kind:
          "internal-document",

        status:
          "pending",

        extractedContent:
          "Final report states the campaign activated 500 creators.",

        title:
          "Final Campaign Report",

        publicationDate:
          "2026-08-30",
      },

      {
        discoveryId:
          "discovery-old-note-cccccccccccc",

        action:
          "reject",
      },
    ],
  };
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Discovery Review tests\n",
  );

  const request =
    validRequest();

  const before =
    JSON.stringify(
      request,
    );

  const result =
    buildManifestDraftFromDiscovery(
      request,
    );

  check(
    "valid Discovery Review succeeds",
    Boolean(
      result,
    ),
  );

  check(
    "only explicitly registered candidates enter Manifest",
    result.manifest.entries.length ===
      2,
  );

  const textSource =
    result.manifest.entries.find(
      (entry) =>
        entry.id ===
        "campaign-notes",
    );

  check(
    "text-ready discovered content is preserved exactly",
    textSource?.content ===
      "Campaign activated 500 creators.",
  );

  check(
    "operator-selected EvidenceSource kind is preserved",
    textSource?.kind ===
      "internal-document",
  );

  check(
    "operator-selected intake status is preserved",
    textSource?.status ===
      "approved-for-extraction",
  );

  check(
    "discovered local file becomes explicit local-file provenance",
    textSource?.origin.kind ===
      "local-file" &&
    textSource?.origin.reference ===
      "campaign/campaign-notes.md",
  );

  check(
    "discovery identity and hash survive in internal provenance note",
    Boolean(
      textSource?.origin.note?.includes(
        "discovery-campaign-notes-aaaaaaaaaaaa",
      ) &&
      textSource?.origin.note?.includes(
        "aaaaaaaaaaaaaaaaaaaaaaaa",
      ),
    ),
  );

  const pdfSource =
    result.manifest.entries.find(
      (entry) =>
        entry.id ===
        "final-campaign-report",
    );

  check(
    "document requiring extraction uses explicitly supplied extracted text",
    pdfSource?.content ===
      "Final report states the campaign activated 500 creators.",
  );

  check(
    "document registration does not automatically approve extraction",
    pdfSource?.status ===
      "pending",
  );

  check(
    "operator title override is preserved",
    pdfSource?.title ===
      "Final Campaign Report",
  );

  check(
    "trusted metadata survives Manifest validation",
    pdfSource?.publicationDate ===
      "2026-08-30",
  );

  check(
    "rejected discovery candidate never enters Manifest",
    !result.manifest.entries.some(
      (entry) =>
        entry.id ===
        "old-note",
    ),
  );

  check(
    "rejected discovery candidate remains in review audit",
    result.audit.some(
      (entry) =>
        entry.discoveryId ===
          "discovery-old-note-cccccccccccc" &&
        entry.action ===
          "reject",
    ),
  );

  check(
    "fully reviewed discovery has no unresolved candidates",
    result.unreviewedDiscoveryIds.length ===
      0,
  );

  /* ── Unreviewed / deferred material ─────────────── */

  const partial =
    validRequest();

  partial.reviews =
    partial.reviews.slice(
      0,
      1,
    );

  const partialResult =
    buildManifestDraftFromDiscovery(
      partial,
    );

  check(
    "unreviewed discovery candidates remain explicitly visible",
    partialResult
      .unreviewedDiscoveryIds
      .length ===
      2,
  );

  const deferred =
    validRequest();

  deferred.reviews = [
    {
      discoveryId:
        "discovery-old-note-cccccccccccc",

      action:
        "defer",
    },
  ];

  const deferredResult =
    buildManifestDraftFromDiscovery(
      deferred,
    );

  check(
    "deferred candidate never enters Manifest",
    deferredResult
      .manifest
      .entries
      .length ===
      0,
  );

  check(
    "deferred decision remains visible in audit",
    deferredResult.audit[0]
      ?.action ===
      "defer",
  );

  /* ── Unknown / duplicate review attacks ─────────── */

  const unknown =
    validRequest();

  unknown.reviews[0]
    .discoveryId =
    "discovery-does-not-exist-111111111111";

  check(
    "unknown discovery ID is rejected",
    rejectedWith(
      unknown,
      "unknown discoveryId",
    ),
  );

  const duplicateReview =
    validRequest();

  duplicateReview
    .reviews
    .push(
      clone(
        duplicateReview
          .reviews[0],
      ),
    );

  check(
    "duplicate operator decision for same discovery candidate is rejected",
    rejectedWith(
      duplicateReview,
      "duplicate decision",
    ),
  );

  /* ── Explicit registration requirements ─────────── */

  const missingSourceId =
    validRequest();

  delete missingSourceId
    .reviews[0]
    .sourceId;

  check(
    "register action requires explicit source ID",
    rejectedWith(
      missingSourceId,
      "requires sourceId",
    ),
  );

  const missingKind =
    validRequest();

  delete missingKind
    .reviews[0]
    .kind;

  check(
    "register action requires operator-selected EvidenceSource kind",
    rejectedWith(
      missingKind,
      "requires operator-selected kind",
    ),
  );

  const missingStatus =
    validRequest();

  delete missingStatus
    .reviews[0]
    .status;

  check(
    "register action requires explicit intake status",
    rejectedWith(
      missingStatus,
      "requires explicit intake status",
    ),
  );

  const unsafeSourceId =
    validRequest();

  unsafeSourceId
    .reviews[0]
    .sourceId =
    "Unsafe Source ID";

  check(
    "unsafe registered source ID is rejected by Manifest boundary",
    rejectedWith(
      unsafeSourceId,
      "safe lower-kebab-case ID",
    ),
  );

  const invalidKind =
    validRequest();

  (
    invalidKind.reviews[0] as any
  ).kind =
    "model-invented-source-kind";

  check(
    "invented EvidenceSource classification is rejected",
    rejectedWith(
      invalidKind,
      "invalid evidence source kind",
    ),
  );

  const invalidStatus =
    validRequest();

  (
    invalidStatus.reviews[0] as any
  ).status =
    "automatically-trusted";

  check(
    "invented intake status is rejected",
    rejectedWith(
      invalidStatus,
      "invalid intake status",
    ),
  );

  /* ── Binary/document extraction boundary ────────── */

  const missingExtractedText =
    validRequest();

  delete missingExtractedText
    .reviews[1]
    .extractedContent;

  check(
    "PDF cannot enter Manifest before text extraction",
    rejectedWith(
      missingExtractedText,
      "requires extractedContent before registration",
    ),
  );

  const blankExtractedText =
    validRequest();

  blankExtractedText
    .reviews[1]
    .extractedContent =
    "   ";

  check(
    "blank extracted document content is rejected",
    rejectedWith(
      blankExtractedText,
      "requires extractedContent before registration",
    ),
  );

  /* ── Text-ready source integrity ────────────────── */

  const replaceText =
    validRequest();

  replaceText
    .reviews[0]
    .extractedContent =
    "Operator replacement text.";

  check(
    "operator cannot silently replace discovered text-ready content",
    rejectedWith(
      replaceText,
      "cannot replace discovered text-ready content",
    ),
  );

  const blankDiscoveredContent =
    validRequest();

  const textCandidate =
    blankDiscoveredContent
      .discovery
      .candidates[0];

  textCandidate.content =
    "   ";

  check(
    "text-ready candidate without usable discovered content is blocked",
    rejectedWith(
      blankDiscoveredContent,
      "text-ready candidate has no usable content",
    ),
  );

  /* ── Duplicate Manifest identity ────────────────── */

  const duplicateSourceId =
    validRequest();

  duplicateSourceId
    .reviews[1]
    .sourceId =
    "campaign-notes";

  check(
    "two discovered candidates cannot register as same source ID",
    rejectedWith(
      duplicateSourceId,
      "duplicate source ID",
    ),
  );

  /* ── Action validation ──────────────────────────── */

  const invalidAction =
    validRequest();

  (
    invalidAction.reviews[0] as any
  ).action =
    "auto-approve";

  check(
    "invented review action is rejected",
    rejectedWith(
      invalidAction,
      "invalid action",
    ),
  );

  /* ── Runtime input validation ───────────────────── */

  const invalidReviews =
    validRequest();

  (
    invalidReviews as any
  ).reviews =
    null;

  check(
    "reviews must be an array",
    rejectedWith(
      invalidReviews,
      "reviews must be an array",
    ),
  );

  const invalidDiscovery =
    validRequest();

  (
    invalidDiscovery as any
  ).discovery =
    null;

  check(
    "valid discovery result is required",
    rejectedWith(
      invalidDiscovery,
      "requires a valid discovery result",
    ),
  );

  /* ── Manifest can remain entirely non-approved ──── */

  const allPending =
    validRequest();

  allPending.reviews =
    allPending.reviews
      .filter(
        (review) =>
          review.action ===
          "register",
      )
      .map(
        (review) => ({
          ...review,

          status:
            "pending",
        }),
      );

  const allPendingResult =
    buildManifestDraftFromDiscovery(
      allPending,
    );

  check(
    "Discovery Review may produce Manifest with zero extraction-approved sources",
    allPendingResult
      .manifest
      .approvedCount ===
      0 &&
    allPendingResult
      .manifest
      .pendingCount ===
      2,
  );

  /* ── Input immutability ─────────────────────────── */

  check(
    "Discovery Review does not mutate operator input",
    JSON.stringify(
      request,
    ) ===
      before,
  );

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(
    fail === 0
      ? 0
      : 1,
  );
}

main();
