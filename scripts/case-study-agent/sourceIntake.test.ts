/**
 * GOLD STANDARD CASE STUDY AGENT — SOURCE INTAKE TESTS
 *
 * Proves:
 * - approved sources reach GenerationSource[];
 * - pending sources never reach the Extractor input;
 * - rejected sources never reach the Extractor input;
 * - provenance/status metadata does not leak into GenerationSource[];
 * - source content and trusted metadata survive exactly;
 * - runtime revalidation protects against tampered manifests;
 * - empty / zero-approved manifests are valid;
 * - input is never mutated.
 */

import {
  buildTrustedSourceManifest,
} from "./sourceManifest";

import {
  buildGenerationSourcesFromManifest,
} from "./sourceIntake";

import type {
  TrustedSourceManifest,
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
  manifest:
    TrustedSourceManifest,
  expected:
    string,
): boolean {
  try {
    buildGenerationSourcesFromManifest(
      manifest,
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

function manifest():
  TrustedSourceManifest {
  return buildTrustedSourceManifest({
    entries: [
      {
        id:
          "approved-report",

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
            "final-report.pdf",
        },

        status:
          "approved-for-extraction",

        publicationDate:
          "2026-08-30",

        capturedAt:
          "2026-09-16T10:00:00+05:30",

        notes:
          "Approved campaign closure report.",
      },

      {
        id:
          "pending-article",

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
            "https://example.com/article",
        },

        status:
          "pending",

        url:
          "https://example.com/article",

        publisher:
          "Example Publication",
      },

      {
        id:
          "rejected-note",

        kind:
          "user-provided",

        title:
          "Old Working Estimate",

        content:
          "An early estimate suggested 900 creators.",

        origin: {
          kind:
            "pasted-text",

          reference:
            "operator-paste-old-estimate",
        },

        status:
          "rejected",

        notes:
          "Superseded working estimate.",
      },

      {
        id:
          "approved-brand-page",

        kind:
          "official-brand",

        title:
          "Official Campaign Page",

        content:
          "The campaign launched nationally.",

        origin: {
          kind:
            "url",

          reference:
            "https://brand.example.com/campaign",
        },

        status:
          "approved-for-extraction",

        url:
          "https://brand.example.com/campaign",

        publisher:
          "Sample Brand",
      },
    ],
  });
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Source Intake Adapter tests\n",
  );

  const trustedManifest =
    manifest();

  const before =
    JSON.stringify(
      trustedManifest,
    );

  const result =
    buildGenerationSourcesFromManifest(
      trustedManifest,
    );

  check(
    "only approved sources become GenerationSource records",
    result.sources.length ===
      2,
  );

  check(
    "approved source order is preserved",
    result.sources
      .map(
        (source) =>
          source.id,
      )
      .join(",") ===
      "approved-report,approved-brand-page",
  );

  check(
    "pending source never enters GenerationSource array",
    !result.sources.some(
      (source) =>
        source.id ===
        "pending-article",
    ),
  );

  check(
    "rejected source never enters GenerationSource array",
    !result.sources.some(
      (source) =>
        source.id ===
        "rejected-note",
    ),
  );

  check(
    "pending source remains visible in internal exclusion audit",
    result.excluded.some(
      (entry) =>
        entry.id ===
          "pending-article" &&
        entry.status ===
          "pending",
    ),
  );

  check(
    "rejected source remains visible in internal exclusion audit",
    result.excluded.some(
      (entry) =>
        entry.id ===
          "rejected-note" &&
        entry.status ===
          "rejected",
    ),
  );

  check(
    "approved source content survives exactly",
    result.sources[0]
      ?.content ===
      "The campaign activated 500 creators.",
  );

  check(
    "canonical evidence source kind survives adapter",
    result.sources[0]
      ?.kind ===
      "internal-document",
  );

  check(
    "trusted dates survive adapter",
    result.sources[0]
      ?.publicationDate ===
      "2026-08-30" &&
    result.sources[0]
      ?.capturedAt ===
      "2026-09-16T10:00:00+05:30",
  );

  check(
    "trusted URL and publisher survive adapter",
    result.sources[1]
      ?.url ===
      "https://brand.example.com/campaign" &&
    result.sources[1]
      ?.publisher ===
      "Sample Brand",
  );

  const generationJson =
    JSON.stringify(
      result.sources,
    );

  check(
    "manifest origin provenance does not leak into GenerationSource",
    !generationJson.includes(
      '"origin"',
    ) &&
    !generationJson.includes(
      "final-report.pdf",
    ),
  );

  check(
    "intake status does not leak into GenerationSource",
    !generationJson.includes(
      "approved-for-extraction",
    ) &&
    !generationJson.includes(
      '"status"',
    ),
  );

  check(
    "excluded source content never reaches GenerationSource",
    !generationJson.includes(
      "900 creators",
    ) &&
    !generationJson.includes(
      "national coverage",
    ),
  );

  /* ── Status change is explicit operator action ──── */

  const approvedPending =
    clone(
      trustedManifest,
    );

  const pendingEntry =
    approvedPending.entries.find(
      (entry) =>
        entry.id ===
        "pending-article",
    );

  if (pendingEntry) {
    pendingEntry.status =
      "approved-for-extraction";
  }

  const afterApproval =
    buildGenerationSourcesFromManifest(
      approvedPending,
    );

  check(
    "pending source enters extraction only after explicit status change",
    afterApproval.sources.some(
      (source) =>
        source.id ===
        "pending-article",
    ),
  );

  /* ── Runtime revalidation ───────────────────────── */

  const tamperedStatus =
    clone(
      trustedManifest,
    );

  (
    tamperedStatus.entries[0] as any
  ).status =
    "automatically-trusted";

  check(
    "tampered intake status is rejected at adapter boundary",
    rejectedWith(
      tamperedStatus,
      "invalid intake status",
    ),
  );

  const tamperedSourceId =
    clone(
      trustedManifest,
    );

  tamperedSourceId
    .entries[0]
    .id =
    "Unsafe Source ID";

  check(
    "tampered source ID is rejected at adapter boundary",
    rejectedWith(
      tamperedSourceId,
      "safe lower-kebab-case ID",
    ),
  );

  const tamperedContent =
    clone(
      trustedManifest,
    );

  tamperedContent
    .entries[0]
    .content =
    "   ";

  check(
    "tampered empty source content is rejected at adapter boundary",
    rejectedWith(
      tamperedContent,
      "requires non-empty content",
    ),
  );

  /* ── Zero approved sources ──────────────────────── */

  const noApproved =
    buildTrustedSourceManifest({
      entries: [
        {
          id:
            "pending-only",

          kind:
            "internal-document",

          title:
            "Pending Report",

          content:
            "Pending source material.",

          origin: {
            kind:
              "uploaded-file",

            reference:
              "pending.pdf",
          },

          status:
            "pending",
        },

        {
          id:
            "rejected-only",

          kind:
            "user-provided",

          title:
            "Rejected Note",

          content:
            "Rejected source material.",

          origin: {
            kind:
              "pasted-text",

            reference:
              "rejected-note",
          },

          status:
            "rejected",
        },
      ],
    });

  const noApprovedResult =
    buildGenerationSourcesFromManifest(
      noApproved,
    );

  check(
    "manifest with zero approved sources produces empty GenerationSource array",
    noApprovedResult.sources.length ===
      0,
  );

  check(
    "zero-approved manifest still preserves exclusion audit",
    noApprovedResult.excluded.length ===
      2,
  );

  /* ── Completely empty manifest ──────────────────── */

  const empty =
    buildGenerationSourcesFromManifest(
      buildTrustedSourceManifest({
        entries: [],
      }),
    );

  check(
    "empty manifest produces empty deterministic intake",
    empty.sources.length ===
      0 &&
    empty.excluded.length ===
      0,
  );

  /* ── Input immutability ─────────────────────────── */

  check(
    "Source Intake Adapter does not mutate trusted manifest",
    JSON.stringify(
      trustedManifest,
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
