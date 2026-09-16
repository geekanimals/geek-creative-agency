/**
 * GOLD STANDARD CASE STUDY AGENT — TRUSTED SOURCE MANIFEST TESTS
 *
 * No AI.
 * No network.
 * No CMS.
 * No database.
 *
 * Proves:
 * - canonical evidence-source kinds are preserved;
 * - stable source IDs are enforced;
 * - source provenance is mandatory;
 * - intake status is operator-controlled;
 * - pending / rejected sources remain auditable;
 * - URLs and dates are validated;
 * - counts are deterministic;
 * - input is not mutated.
 */

import {
  buildTrustedSourceManifest,
} from "./sourceManifest";

import type {
  BuildSourceManifestRequest,
  SourceManifestEntryInput,
} from "./sourceManifest";

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
    BuildSourceManifestRequest,
  expected:
    string,
): boolean {
  try {
    buildTrustedSourceManifest(
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

const ENTRIES:
  SourceManifestEntryInput[] =
[
  {
    id:
      "client-report",

    kind:
      "internal-document",

    title:
      "Final Campaign Report",

    content:
      "The campaign activated 500 creators.",

    origin: {
      kind:
        "uploaded-file",

      reference:
        "final-campaign-report.pdf",

      note:
        "Uploaded by operator.",
    },

    status:
      "approved-for-extraction",

    publicationDate:
      "2026-08-30",

    capturedAt:
      "2026-09-16T10:00:00+05:30",

    notes:
      "Client-approved closure report.",
  },

  {
    id:
      "press-coverage",

    kind:
      "independent-editorial",

    title:
      "Campaign Coverage",

    content:
      "The wider campaign received national coverage.",

    origin: {
      kind:
        "url",

      reference:
        "https://example.com/campaign",
    },

    status:
      "pending",

    url:
      "https://example.com/campaign",

    publisher:
      "Example Publication",
  },

  {
    id:
      "old-working-note",

    kind:
      "user-provided",

    title:
      "Old Working Note",

    content:
      "Early rough campaign estimate.",

    origin: {
      kind:
        "pasted-text",

      reference:
        "operator-paste-01",
    },

    status:
      "rejected",

    notes:
      "Superseded working note.",
  },
];

function baseRequest():
  BuildSourceManifestRequest {
  return {
    entries:
      clone(ENTRIES),
  };
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Trusted Source Manifest tests\n",
  );

  const request =
    baseRequest();

  const before =
    JSON.stringify(
      request,
    );

  const manifest =
    buildTrustedSourceManifest(
      request,
    );

  check(
    "valid source manifest succeeds",
    manifest.entries.length ===
      3,
  );

  check(
    "approved source count is deterministic",
    manifest.approvedCount ===
      1,
  );

  check(
    "pending source count is deterministic",
    manifest.pendingCount ===
      1,
  );

  check(
    "rejected source count is deterministic",
    manifest.rejectedCount ===
      1,
  );

  check(
    "canonical evidence source kind survives validation",
    manifest.entries[0]
      ?.kind ===
      "internal-document",
  );

  check(
    "source content survives exactly",
    manifest.entries[0]
      ?.content ===
      "The campaign activated 500 creators.",
  );

  check(
    "source origin survives internally",
    manifest.entries[0]
      ?.origin.kind ===
      "uploaded-file" &&
    manifest.entries[0]
      ?.origin.reference ===
      "final-campaign-report.pdf",
  );

  check(
    "pending source remains registered for audit",
    manifest.entries
      .find(
        (entry) =>
          entry.id ===
          "press-coverage",
      )
      ?.status ===
      "pending",
  );

  check(
    "rejected source remains registered for audit",
    manifest.entries
      .find(
        (entry) =>
          entry.id ===
          "old-working-note",
      )
      ?.status ===
      "rejected",
  );

  check(
    "trusted metadata survives validation",
    manifest.entries[0]
      ?.publicationDate ===
      "2026-08-30" &&
    manifest.entries[0]
      ?.capturedAt ===
      "2026-09-16T10:00:00+05:30",
  );

  /* ── Identity ───────────────────────────────────── */

  const unsafeId =
    baseRequest();

  unsafeId.entries[0].id =
    "Client Report";

  check(
    "unsafe source ID is rejected",
    rejectedWith(
      unsafeId,
      "safe lower-kebab-case ID",
    ),
  );

  const duplicate =
    baseRequest();

  duplicate.entries[1].id =
    "client-report";

  check(
    "duplicate source ID is rejected",
    rejectedWith(
      duplicate,
      "duplicate source ID",
    ),
  );

  /* ── Source classification ──────────────────────── */

  const invalidKind =
    baseRequest();

  (
    invalidKind.entries[0] as any
  ).kind =
    "random-internet-source";

  check(
    "invented evidence-source kind is rejected",
    rejectedWith(
      invalidKind,
      "invalid evidence source kind",
    ),
  );

  /* ── Required source material ───────────────────── */

  const missingTitle =
    baseRequest();

  missingTitle.entries[0]
    .title =
    "   ";

  check(
    "source title is required",
    rejectedWith(
      missingTitle,
      "requires title",
    ),
  );

  const missingContent =
    baseRequest();

  missingContent.entries[0]
    .content =
    "   ";

  check(
    "source content is required",
    rejectedWith(
      missingContent,
      "requires non-empty content",
    ),
  );

  /* ── Provenance ─────────────────────────────────── */

  const missingOrigin =
    baseRequest();

  (
    missingOrigin.entries[0] as any
  ).origin =
    undefined;

  check(
    "source provenance is required",
    rejectedWith(
      missingOrigin,
      "requires valid origin.kind",
    ),
  );

  const inventedOrigin =
    baseRequest();

  (
    inventedOrigin.entries[0]
      .origin as any
  ).kind =
    "magic-discovery";

  check(
    "invented origin kind is rejected",
    rejectedWith(
      inventedOrigin,
      "requires valid origin.kind",
    ),
  );

  const blankOriginReference =
    baseRequest();

  blankOriginReference
    .entries[0]
    .origin
    .reference =
    "   ";

  check(
    "origin reference is required",
    rejectedWith(
      blankOriginReference,
      "requires origin.reference",
    ),
  );

  /* ── Intake decision ────────────────────────────── */

  const invalidStatus =
    baseRequest();

  (
    invalidStatus.entries[0] as any
  ).status =
    "trusted";

  check(
    "invented intake status is rejected",
    rejectedWith(
      invalidStatus,
      "invalid intake status",
    ),
  );

  /* ── URL safety ─────────────────────────────────── */

  const badUrl =
    baseRequest();

  badUrl.entries[1].url =
    "javascript:alert(1)";

  check(
    "non-http source URL is rejected",
    rejectedWith(
      badUrl,
      "url must be http or https",
    ),
  );

  const urlOriginWithoutUrl =
    baseRequest();

  delete urlOriginWithoutUrl
    .entries[1]
    .url;

  check(
    "url-origin source requires canonical url metadata",
    rejectedWith(
      urlOriginWithoutUrl,
      "with url origin requires url",
    ),
  );

  const httpsUrl =
    baseRequest();

  httpsUrl.entries[1].url =
    "https://example.com/article";

  check(
    "https source URL is accepted",
    Boolean(
      buildTrustedSourceManifest(
        httpsUrl,
      ),
    ),
  );

  /* ── Date validation ────────────────────────────── */

  const badPublicationDate =
    baseRequest();

  badPublicationDate
    .entries[0]
    .publicationDate =
    "not-a-date";

  check(
    "invalid publication date is rejected",
    rejectedWith(
      badPublicationDate,
      "publicationDate must be a valid date",
    ),
  );

  const badCapturedAt =
    baseRequest();

  badCapturedAt
    .entries[0]
    .capturedAt =
    "not-a-date";

  check(
    "invalid capturedAt is rejected",
    rejectedWith(
      badCapturedAt,
      "capturedAt must be a valid date",
    ),
  );

  /* ── Empty manifest ─────────────────────────────── */

  const empty =
    buildTrustedSourceManifest({
      entries: [],
    });

  check(
    "empty source manifest is valid before discovery",
    empty.entries.length ===
      0 &&
    empty.approvedCount ===
      0 &&
    empty.pendingCount ===
      0 &&
    empty.rejectedCount ===
      0,
  );

  /* ── Input immutability ─────────────────────────── */

  check(
    "Trusted Source Manifest does not mutate operator input",
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
