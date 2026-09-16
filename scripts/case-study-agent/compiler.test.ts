/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE COMPILER TESTS
 *
 * No OpenAI.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves deterministic compilation from validated Designer output
 * into Payload-compatible Flexible sections.
 */

import {
  compileFlexibleCaseStudy,
  plainTextToLexical,
} from "./compiler";

import type {
  CompilerRequest,
} from "./compiler";

import type {
  FlexibleCaseStudyDesign,
} from "./designer";

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

function containsKey(
  value: unknown,
  key: string,
): boolean {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(
      (item) =>
        containsKey(
          item,
          key,
        ),
    );
  }

  const object =
    value as Record<
      string,
      unknown
    >;

  if (
    Object.prototype.hasOwnProperty.call(
      object,
      key,
    )
  ) {
    return true;
  }

  return Object.values(
    object,
  ).some(
    (item) =>
      containsKey(
        item,
        key,
      ),
  );
}

const DESIGN: FlexibleCaseStudyDesign = {
  renderMode:
    "flexible",

  sections: [
    {
      id:
        "intro",

      chapterId:
        "context",

      blockType:
        "sectionIntro",

      eyebrow:
        "CHAPTER 01",

      heading:
        "THE CONTEXT",

      body:
        "A supported campaign context.",

      evidenceClaimIds: [
        "fact-context",
      ],
    },

    {
      id:
        "rich",

      chapterId:
        "context",

      blockType:
        "richText",

      body:
        "First paragraph.\n\nSecond paragraph.",

      evidenceClaimIds: [
        "fact-context",
      ],
    },

    {
      id:
        "media",

      chapterId:
        "mechanic",

      blockType:
        "mediaBlock",

      assetId:
        "asset-legacy",

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },

    {
      id:
        "full-bleed",

      chapterId:
        "mechanic",

      blockType:
        "fullBleedMedia",

      assetId:
        "asset-cms",

      overlayHeading:
        "THE MECHANIC",

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },

    {
      id:
        "split",

      chapterId:
        "mechanic",

      blockType:
        "splitContent",

      mediaSide:
        "right",

      body:
        "The mechanic used a trusted campaign visual.",

      assetId:
        "asset-legacy",

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },

    {
      id:
        "gallery",

      chapterId:
        "execution",

      blockType:
        "mediaGallery",

      heading:
        "Execution evidence",

      assetIds: [
        "asset-gallery-1",
        "asset-gallery-2",
      ],

      evidenceClaimIds: [
        "fact-execution",
      ],
    },

    {
      id:
        "metrics",

      chapterId:
        "results",

      blockType:
        "metrics",

      heading:
        "VERIFIED RESULTS",

      items: [
        {
          claimId:
            "metric-creators",

          value:
            "500",

          label:
            "Creators activated",

          prefix:
            undefined,

          suffix:
            "+",

          note:
            "Verified activation scope.",
        },
      ],

      evidenceClaimIds: [
        "metric-creators",
      ],
    },

    {
      id:
        "quote",

      chapterId:
        "impact",

      blockType:
        "quote",

      quote:
        "The activation gave creators a meaningful role.",

      attribution:
        "Campaign stakeholder",

      claimId:
        "quote-stakeholder",

      evidenceClaimIds: [
        "quote-stakeholder",
      ],
    },

    {
      id:
        "cta",

      blockType:
        "cta",

      heading:
        "THE STORY CONTINUED.",

      body:
        "See the next project.",

      buttonLabel:
        "See next project",

      targetProjectSlug:
        "next-project",

      evidenceClaimIds: [],
    },
  ],
};

const REQUEST: CompilerRequest = {
  design:
    DESIGN,

  mediaAssets: [
    {
      id:
        "asset-legacy",

      legacySrc:
        "/assets/work/test/mechanic.jpg",

      alt:
        "Campaign mechanic visual",

      caption:
        "Trusted campaign evidence",

      credit:
        "Geek archive",
    },

    {
      id:
        "asset-cms",

      mediaId:
        321,

      alt:
        "CMS-managed campaign visual",
    },

    {
      id:
        "asset-gallery-1",

      legacySrc:
        "/assets/work/test/gallery-1.jpg",

      alt:
        "Gallery image one",
    },

    {
      id:
        "asset-gallery-2",

      legacySrc:
        "/assets/work/test/gallery-2.jpg",

      alt:
        "Gallery image two",
    },
  ],

  allowedContinuitySlugs: [
    "next-project",
  ],
};

function expectThrow(
  name: string,
  fn: () => unknown,
  expectedMessage: string,
) {
  let rejected = false;

  try {
    fn();
  } catch (error) {
    rejected =
      error instanceof Error &&
      error.message.includes(
        expectedMessage,
      );
  }

  check(
    name,
    rejected,
  );
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible compiler tests\n",
  );

  const requestBefore =
    JSON.stringify(
      REQUEST,
    );

  const compiled =
    compileFlexibleCaseStudy(
      clone(REQUEST),
    );

  /* ── Core compilation ────────────────────────────── */

  check(
    "valid Flexible design compiles",
    compiled.renderMode ===
      "flexible",
  );

  check(
    "all nine sections survive compilation",
    compiled.cmsSections.length ===
      9,
  );

  check(
    "compiler creates one evidence binding per section",
    compiled.bindings.length ===
      DESIGN.sections.length,
  );

  /* ── Section intro ───────────────────────────────── */

  const intro =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "sectionIntro",
    );

  check(
    "sectionIntro copy survives",
    Boolean(
      intro &&
      intro.blockType ===
        "sectionIntro" &&
      intro.heading ===
        "THE CONTEXT" &&
      intro.body ===
        "A supported campaign context.",
    ),
  );

  /* ── Lexical conversion ──────────────────────────── */

  const rich =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "richText",
    );

  check(
    "richText is converted into Lexical root",
    Boolean(
      rich &&
      rich.blockType ===
        "richText" &&
      rich.content &&
      rich.content.root &&
      rich.content.root.type ===
        "root",
    ),
  );

  check(
    "blank-line separated text becomes two Lexical paragraphs",
    Boolean(
      rich &&
      rich.blockType ===
        "richText" &&
      rich.content.root.children.length ===
        2,
    ),
  );

  if (
    rich &&
    rich.blockType ===
      "richText"
  ) {
    const firstParagraph =
      rich.content.root
        .children[0] as any;

    check(
      "Lexical text content is preserved",
      firstParagraph
        ?.children?.[0]
        ?.text ===
        "First paragraph.",
    );
  } else {
    check(
      "Lexical text content is preserved",
      false,
    );
  }

  const directLexical =
    plainTextToLexical(
      "Hello world",
    );

  check(
    "Lexical builder uses repository-compatible version 1 root",
    directLexical.root
      .version === 1,
  );

  expectThrow(
    "empty rich text cannot compile",
    () =>
      plainTextToLexical(
        "   ",
      ),
    "Cannot compile empty text",
  );

  /* ── Trusted media resolution ────────────────────── */

  const legacyMedia =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "mediaBlock",
    );

  check(
    "trusted assetId resolves to trusted legacySrc",
    Boolean(
      legacyMedia &&
      legacyMedia.blockType ===
        "mediaBlock" &&
      legacyMedia.legacySrc ===
        "/assets/work/test/mechanic.jpg",
    ),
  );

  check(
    "trusted media metadata survives compilation",
    Boolean(
      legacyMedia &&
      legacyMedia.blockType ===
        "mediaBlock" &&
      legacyMedia.alt ===
        "Campaign mechanic visual" &&
      legacyMedia.caption ===
        "Trusted campaign evidence" &&
      legacyMedia.credit ===
        "Geek archive",
    ),
  );

  const fullBleed =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "fullBleedMedia",
    );

  check(
    "trusted CMS media asset resolves to numeric media relationship",
    Boolean(
      fullBleed &&
      fullBleed.blockType ===
        "fullBleedMedia" &&
      fullBleed.media ===
        321 &&
      !fullBleed.legacySrc,
    ),
  );

  check(
    "full-bleed overlay heading survives",
    Boolean(
      fullBleed &&
      fullBleed.blockType ===
        "fullBleedMedia" &&
      fullBleed.overlayHeading ===
        "THE MECHANIC",
    ),
  );

  const split =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "splitContent",
    );

  check(
    "splitContent compiles text and trusted media",
    Boolean(
      split &&
      split.blockType ===
        "splitContent" &&
      split.mediaSide ===
        "right" &&
      split.legacySrc ===
        "/assets/work/test/mechanic.jpg" &&
      split.content.root.type ===
        "root",
    ),
  );

  const gallery =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "mediaGallery",
    );

  check(
    "mediaGallery resolves all trusted asset IDs",
    Boolean(
      gallery &&
      gallery.blockType ===
        "mediaGallery" &&
      gallery.items?.length ===
        2 &&
      gallery.items[0]
        ?.legacySrc ===
        "/assets/work/test/gallery-1.jpg" &&
      gallery.items[1]
        ?.legacySrc ===
        "/assets/work/test/gallery-2.jpg",
    ),
  );

  /* ── Metrics / quote sanitisation ───────────────── */

  const metrics =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "metrics",
    );

  check(
    "metric value survives compilation",
    Boolean(
      metrics &&
      metrics.blockType ===
        "metrics" &&
      metrics.items?.[0]
        ?.value ===
        "500" &&
      metrics.items?.[0]
        ?.suffix ===
        "+",
    ),
  );

  check(
    "metric claimId is stripped from CMS output",
    !containsKey(
      compiled.cmsSections,
      "claimId",
    ),
  );

  const quote =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "quote",
    );

  check(
    "quote copy survives compilation",
    Boolean(
      quote &&
      quote.blockType ===
        "quote" &&
      quote.quote ===
        "The activation gave creators a meaningful role.",
    ),
  );

  /* ── CTA compilation ─────────────────────────────── */

  const cta =
    compiled.cmsSections.find(
      (section) =>
        section.blockType ===
        "cta",
    );

  check(
    "trusted CTA slug compiles deterministically to /work path",
    Boolean(
      cta &&
      cta.blockType ===
        "cta" &&
      cta.buttonHref ===
        "/work/next-project",
    ),
  );

  /* ── Internal metadata stripping ─────────────────── */

  check(
    "evidenceClaimIds never enter CMS sections",
    !containsKey(
      compiled.cmsSections,
      "evidenceClaimIds",
    ),
  );

  check(
    "assetId never enters CMS sections",
    !containsKey(
      compiled.cmsSections,
      "assetId",
    ),
  );

  check(
    "targetProjectSlug never enters CMS sections",
    !containsKey(
      compiled.cmsSections,
      "targetProjectSlug",
    ),
  );

  check(
    "internal section id never becomes Payload block id",
    !containsKey(
      compiled.cmsSections,
      "id",
    ),
  );

  /* ── Evidence bindings remain internal ───────────── */

  const metricBinding =
    compiled.bindings.find(
      (binding) =>
        binding.sectionId ===
        "metrics",
    );

  check(
    "internal bindings preserve evidence provenance",
    Boolean(
      metricBinding &&
      metricBinding.blockType ===
        "metrics" &&
      metricBinding.evidenceClaimIds
        .includes(
          "metric-creators",
        ),
    ),
  );

  /* ── Unknown media asset ─────────────────────────── */

  const unknownAssetRequest =
    clone(REQUEST);

  const unknownAssetSection =
    unknownAssetRequest
      .design
      .sections.find(
        (section) =>
          section.blockType ===
          "mediaBlock",
      );

  if (
    unknownAssetSection &&
    unknownAssetSection.blockType ===
      "mediaBlock"
  ) {
    unknownAssetSection.assetId =
      "invented-asset";
  }

  expectThrow(
    "unknown Designer media asset is rejected",
    () =>
      compileFlexibleCaseStudy(
        unknownAssetRequest,
      ),
    "unknown Compiler media asset",
  );

  /* ── Invalid media registry ──────────────────────── */

  const bothMediaRequest =
    clone(REQUEST);

  bothMediaRequest.mediaAssets![
    0
  ].mediaId = 999;

  expectThrow(
    "media registry cannot provide both legacySrc and mediaId",
    () =>
      compileFlexibleCaseStudy(
        bothMediaRequest,
      ),
    "exactly one of legacySrc or mediaId",
  );

  const noMediaRequest =
    clone(REQUEST);

  delete noMediaRequest
    .mediaAssets![0]
    .legacySrc;

  expectThrow(
    "media registry must provide a concrete trusted media locator",
    () =>
      compileFlexibleCaseStudy(
        noMediaRequest,
      ),
    "exactly one of legacySrc or mediaId",
  );

  const unsafeLegacyRequest =
    clone(REQUEST);

  unsafeLegacyRequest
    .mediaAssets![0]
    .legacySrc =
    "https://example.com/fake.jpg";

  expectThrow(
    "external media URL cannot enter legacySrc registry",
    () =>
      compileFlexibleCaseStudy(
        unsafeLegacyRequest,
      ),
    "legacySrc must start with /assets/",
  );

  const traversalRequest =
    clone(REQUEST);

  traversalRequest
    .mediaAssets![0]
    .legacySrc =
    "/assets/../secret.jpg";

  expectThrow(
    "unsafe legacySrc traversal is rejected",
    () =>
      compileFlexibleCaseStudy(
        traversalRequest,
      ),
    "unsafe legacySrc",
  );

  const badMediaIdRequest =
    clone(REQUEST);

  const cmsAsset =
    badMediaIdRequest
      .mediaAssets!
      .find(
        (asset) =>
          asset.id ===
          "asset-cms",
      )!;

  cmsAsset.mediaId =
    -1;

  expectThrow(
    "invalid CMS media ID is rejected",
    () =>
      compileFlexibleCaseStudy(
        badMediaIdRequest,
      ),
    "invalid mediaId",
  );

  /* ── CTA safeguards ──────────────────────────────── */

  const badCtaRequest =
    clone(REQUEST);

  const badCta =
    badCtaRequest
      .design
      .sections.find(
        (section) =>
          section.blockType ===
          "cta",
      );

  if (
    badCta &&
    badCta.blockType ===
      "cta"
  ) {
    badCta.targetProjectSlug =
      "not-allowed";
  }

  expectThrow(
    "CTA target outside compiler allowlist is rejected",
    () =>
      compileFlexibleCaseStudy(
        badCtaRequest,
      ),
    "non-allowlisted project slug",
  );

  const unsafeSlugRequest =
    clone(REQUEST);

  unsafeSlugRequest
    .allowedContinuitySlugs = [
      "../admin",
    ];

  expectThrow(
    "unsafe continuity slug is rejected before URL construction",
    () =>
      compileFlexibleCaseStudy(
        unsafeSlugRequest,
      ),
    "not a safe project slug",
  );

  const labelWithoutTarget =
    clone(REQUEST);

  const labelCta =
    labelWithoutTarget
      .design
      .sections.find(
        (section) =>
          section.blockType ===
          "cta",
      );

  if (
    labelCta &&
    labelCta.blockType ===
      "cta"
  ) {
    labelCta.targetProjectSlug =
      undefined;
  }

  expectThrow(
    "CTA button label cannot exist without approved target",
    () =>
      compileFlexibleCaseStudy(
        labelWithoutTarget,
      ),
    "buttonLabel without an approved targetProjectSlug",
  );

  /* ── Duplicate section ID ────────────────────────── */

  const duplicateSectionRequest =
    clone(REQUEST);

  duplicateSectionRequest
    .design
    .sections[1]
    .id =
    duplicateSectionRequest
      .design
      .sections[0]
      .id;

  expectThrow(
    "duplicate internal section IDs are rejected",
    () =>
      compileFlexibleCaseStudy(
        duplicateSectionRequest,
      ),
    "Duplicate Compiler section id",
  );

  /* ── Wrong render mode ───────────────────────────── */

  const wrongModeRequest =
    clone(REQUEST) as any;

  wrongModeRequest
    .design
    .renderMode =
    "standard";

  expectThrow(
    "compiler refuses non-Flexible design",
    () =>
      compileFlexibleCaseStudy(
        wrongModeRequest,
      ),
    "requires renderMode=flexible",
  );

  /* ── Input immutability ──────────────────────────── */

  check(
    "compiler does not mutate trusted request",
    JSON.stringify(
      REQUEST,
    ) ===
      requestBefore,
  );

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(
    fail === 0 ? 0 : 1,
  );
}

main();
