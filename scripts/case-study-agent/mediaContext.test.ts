/**
 * GOLD STANDARD CASE STUDY AGENT — TRUSTED MEDIA CONTEXT TESTS
 *
 * No AI.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves:
 * - media IDs are trusted and unique;
 * - media roles use the canonical vocabulary;
 * - exactly one trusted locator is required;
 * - filesystem/public paths are constrained;
 * - Payload IDs must be valid positive integers;
 * - provenance is mandatory;
 * - evidence associations are publication-ready only;
 * - media does not create or modify evidence;
 * - Designer never sees paths, CMS IDs or provenance;
 * - Compiler receives only trusted locator metadata.
 */

import {
  buildTrustedMediaContext,
} from "./mediaContext";

import type {
  BuildTrustedMediaContextRequest,
  TrustedMediaAssetInput,
} from "./mediaContext";

import type {
  EvidenceClaim,
} from "./types";

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
    BuildTrustedMediaContextRequest,
  expected:
    string,
): boolean {
  try {
    buildTrustedMediaContext(
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

/* ── Evidence ledger ──────────────────────────────── */

const CLAIMS: EvidenceClaim[] = [
  {
    id:
      "metric-creators",

    type:
      "metric",

    statement:
      "The campaign activated 1,058 creators.",

    sourceIds: [
      "campaign-report",
    ],

    confidence:
      "high",

    publishable:
      true,
  },

  {
    id:
      "fact-pack",

    type:
      "fact",

    statement:
      "The campaign used a custom product pack.",

    sourceIds: [
      "campaign-report",
    ],

    confidence:
      "medium",

    publishable:
      true,
  },

  {
    id:
      "fact-hidden",

    type:
      "fact",

    statement:
      "This claim is not publication ready.",

    sourceIds: [
      "campaign-report",
    ],

    confidence:
      "low",

    publishable:
      false,
  },
];

/* ── Trusted assets ───────────────────────────────── */

const ASSETS:
  TrustedMediaAssetInput[] =
[
  {
    id:
      "campaign-hero",

    title:
      "Campaign hero",

    role:
      "campaign-hero",

    description:
      "Primary campaign visual.",

    legacySrc:
      "/assets/work/sample/campaign-hero.jpg",

    alt:
      "Campaign hero artwork",

    caption:
      "Campaign hero visual",

    credit:
      "Client campaign archive",

    provenance: {
      kind:
        "campaign-archive",

      reference:
        "client-delivery-01",
    },

    relatedClaimIds: [
      "fact-pack",
    ],
  },

  {
    id:
      "creator-results",

    title:
      "Creator results",

    role:
      "creator-content",

    description:
      "Creator campaign execution visual.",

    mediaId:
      42,

    alt:
      "Creator campaign content",

    provenance: {
      kind:
        "payload-media",

      reference:
        "payload-media-42",
    },

    relatedClaimIds: [
      "metric-creators",
    ],
  },
];

function baseRequest():
  BuildTrustedMediaContextRequest {
  return {
    assets:
      clone(ASSETS),

    claims:
      clone(CLAIMS),
  };
}

/* ── Tests ────────────────────────────────────────── */

function main() {
  console.log(
    "Gold Standard Case Study Agent — Trusted Media Context tests\n",
  );

  const request =
    baseRequest();

  const before =
    JSON.stringify(
      request,
    );

  const result =
    buildTrustedMediaContext(
      request,
    );

  check(
    "valid trusted media context succeeds",
    result.assets.length ===
      2,
  );

  check(
    "stable media IDs survive validation",
    result.assets
      .map(
        (asset) =>
          asset.id,
      )
      .join(",") ===
      "campaign-hero,creator-results",
  );

  check(
    "semantic media role survives validation",
    result.assets[0]
      ?.role ===
      "campaign-hero",
  );

  check(
    "trusted legacySrc survives internally",
    result.assets[0]
      ?.legacySrc ===
      "/assets/work/sample/campaign-hero.jpg",
  );

  check(
    "trusted Payload mediaId survives internally",
    result.assets[1]
      ?.mediaId ===
      42,
  );

  check(
    "media provenance survives internally",
    result.assets[0]
      ?.provenance.kind ===
      "campaign-archive" &&
    result.assets[0]
      ?.provenance.reference ===
      "client-delivery-01",
  );

  check(
    "evidence association survives internally",
    result.assets[1]
      ?.relatedClaimIds
      .join(",") ===
      "metric-creators",
  );

  /* ── Designer projection ────────────────────────── */

  const designerSerialized =
    JSON.stringify(
      result.designerAssets,
    );

  check(
    "Designer receives semantic asset identity",
    result.designerAssets[0]
      ?.id ===
      "campaign-hero" &&
    result.designerAssets[0]
      ?.title ===
      "Campaign hero",
  );

  check(
    "Designer receives semantic role and description",
    result.designerAssets[0]
      ?.role ===
      "campaign-hero" &&
    result.designerAssets[0]
      ?.description ===
      "Primary campaign visual.",
  );

  check(
    "Designer never receives filesystem path",
    !designerSerialized.includes(
      "legacySrc",
    ) &&
    !designerSerialized.includes(
      "/assets/",
    ),
  );

  check(
    "Designer never receives Payload media ID",
    !designerSerialized.includes(
      "mediaId",
    ),
  );

  check(
    "Designer never receives provenance",
    !designerSerialized.includes(
      "provenance",
    ) &&
    !designerSerialized.includes(
      "client-delivery-01",
    ),
  );

  check(
    "Designer never receives evidence association IDs",
    !designerSerialized.includes(
      "relatedClaimIds",
    ) &&
    !designerSerialized.includes(
      "metric-creators",
    ),
  );

  /* ── Compiler projection ────────────────────────── */

  check(
    "Compiler receives trusted legacySrc",
    result.compilerAssets[0]
      ?.legacySrc ===
      "/assets/work/sample/campaign-hero.jpg",
  );

  check(
    "Compiler receives trusted Payload mediaId",
    result.compilerAssets[1]
      ?.mediaId ===
      42,
  );

  check(
    "Compiler receives accessibility metadata",
    result.compilerAssets[0]
      ?.alt ===
      "Campaign hero artwork",
  );

  const compilerSerialized =
    JSON.stringify(
      result.compilerAssets,
    );

  check(
    "Compiler never receives provenance",
    !compilerSerialized.includes(
      "provenance",
    ) &&
    !compilerSerialized.includes(
      "client-delivery-01",
    ),
  );

  check(
    "Compiler never receives evidence association IDs",
    !compilerSerialized.includes(
      "relatedClaimIds",
    ),
  );

  /* ── Invalid asset identity ─────────────────────── */

  const unsafeId =
    baseRequest();

  unsafeId.assets[0].id =
    "Campaign Hero";

  check(
    "unsafe media asset ID is rejected",
    rejectedWith(
      unsafeId,
      "safe lower-kebab-case ID",
    ),
  );

  const duplicateAsset =
    baseRequest();

  duplicateAsset.assets[1].id =
    "campaign-hero";

  check(
    "duplicate media asset ID is rejected",
    rejectedWith(
      duplicateAsset,
      "duplicate asset ID",
    ),
  );

  const missingTitle =
    baseRequest();

  missingTitle.assets[0].title =
    "   ";

  check(
    "media asset requires title",
    rejectedWith(
      missingTitle,
      "requires title",
    ),
  );

  /* ── Canonical role validation ──────────────────── */

  const badRole =
    baseRequest();

  (
    badRole.assets[0] as any
  ).role =
    "invented-media-role";

  check(
    "invented media role is rejected",
    rejectedWith(
      badRole,
      "invalid media role",
    ),
  );

  /* ── Locator rules ──────────────────────────────── */

  const noLocator =
    baseRequest();

  delete noLocator
    .assets[0]
    .legacySrc;

  check(
    "asset without trusted locator is rejected",
    rejectedWith(
      noLocator,
      "exactly one of legacySrc or mediaId",
    ),
  );

  const twoLocators =
    baseRequest();

  twoLocators.assets[0]
    .mediaId =
    7;

  check(
    "asset with two locators is rejected",
    rejectedWith(
      twoLocators,
      "exactly one of legacySrc or mediaId",
    ),
  );

  const externalUrl =
    baseRequest();

  externalUrl.assets[0]
    .legacySrc =
    "https://example.com/image.jpg";

  check(
    "external URL cannot masquerade as repository asset",
    rejectedWith(
      externalUrl,
      "must begin with /assets/",
    ),
  );

  const traversal =
    baseRequest();

  traversal.assets[0]
    .legacySrc =
    "/assets/work/../secret.jpg";

  check(
    "path traversal in repository asset is rejected",
    rejectedWith(
      traversal,
      "unsafe legacySrc",
    ),
  );

  const backslashPath =
    baseRequest();

  backslashPath.assets[0]
    .legacySrc =
    "/assets/work\\sample\\image.jpg";

  check(
    "backslash repository path is rejected",
    rejectedWith(
      backslashPath,
      "unsafe legacySrc",
    ),
  );

  const zeroMediaId =
    baseRequest();

  zeroMediaId.assets[1]
    .mediaId =
    0;

  check(
    "zero Payload mediaId is rejected",
    rejectedWith(
      zeroMediaId,
      "positive integer",
    ),
  );

  const fractionalMediaId =
    baseRequest();

  fractionalMediaId.assets[1]
    .mediaId =
    2.5;

  check(
    "fractional Payload mediaId is rejected",
    rejectedWith(
      fractionalMediaId,
      "positive integer",
    ),
  );

  /* ── Provenance rules ───────────────────────────── */

  const missingProvenance =
    baseRequest();

  (
    missingProvenance
      .assets[0] as any
  ).provenance =
    undefined;

  check(
    "media without provenance is rejected",
    rejectedWith(
      missingProvenance,
      "requires valid provenance.kind",
    ),
  );

  const inventedProvenance =
    baseRequest();

  (
    inventedProvenance
      .assets[0]
      .provenance as any
  ).kind =
    "invented-source";

  check(
    "invented provenance kind is rejected",
    rejectedWith(
      inventedProvenance,
      "requires valid provenance.kind",
    ),
  );

  /* ── Evidence-association boundary ──────────────── */

  const unknownClaim =
    baseRequest();

  unknownClaim.assets[0]
    .relatedClaimIds = [
    "invented-claim",
  ];

  check(
    "media cannot reference invented evidence claim",
    rejectedWith(
      unknownClaim,
      "references unknown evidence claim",
    ),
  );

  const hiddenClaim =
    baseRequest();

  hiddenClaim.assets[0]
    .relatedClaimIds = [
    "fact-hidden",
  ];

  check(
    "media cannot attach itself to non-publication-ready evidence",
    rejectedWith(
      hiddenClaim,
      "publication-ready evidence claim",
    ),
  );

  const duplicateClaimAssociation =
    baseRequest();

  duplicateClaimAssociation
    .assets[0]
    .relatedClaimIds = [
    "fact-pack",
    "fact-pack",
  ];

  check(
    "duplicate media evidence association is rejected",
    rejectedWith(
      duplicateClaimAssociation,
      "duplicate related claim ID",
    ),
  );

  /* ── Media never mutates evidence ───────────────── */

  const evidenceBefore =
    JSON.stringify(
      request.claims,
    );

  buildTrustedMediaContext(
    request,
  );

  check(
    "media validation never changes evidence ledger",
    JSON.stringify(
      request.claims,
    ) ===
      evidenceBefore,
  );

  check(
    "media cannot change claim publication status",
    request.claims.find(
      (claim) =>
        claim.id ===
        "fact-hidden",
    )?.publishable ===
      false,
  );

  /* ── Evidence ledger integrity ──────────────────── */

  const duplicateEvidence =
    baseRequest();

  duplicateEvidence.claims.push(
    clone(
      duplicateEvidence
        .claims[0],
    ),
  );

  check(
    "duplicate evidence claim IDs are rejected",
    rejectedWith(
      duplicateEvidence,
      "duplicate evidence claim ID",
    ),
  );

  /* ── Empty media registry is valid ──────────────── */

  const empty =
    buildTrustedMediaContext({
      assets: [],
      claims:
        clone(CLAIMS),
    });

  check(
    "case study may legitimately have no trusted media",
    empty.assets.length ===
      0 &&
    empty.designerAssets.length ===
      0 &&
    empty.compilerAssets.length ===
      0,
  );

  /* ── Input immutability ─────────────────────────── */

  check(
    "Trusted Media Context does not mutate operator input",
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
