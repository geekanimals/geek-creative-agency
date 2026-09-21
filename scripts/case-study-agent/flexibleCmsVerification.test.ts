import {
  verifyFlexibleCmsDraftReadback,
} from "./flexibleCmsVerification";

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

const EXPECTED:
  Record<string, unknown> = {
    title:
      "Sample Campaign",

    slug:
      "sample-campaign",

    client:
      "Sample Brand",

    year:
      2026,

    location:
      "India",

    renderMode:
      "flexible",

    heroLegacySrc:
      "/assets/work/sample/hero.jpg",

    company:
      10,

    brand:
      20,

    businessCategories: [
      30,
    ],

    services: [
      40,
      41,
    ],

    solutions: [
      50,
    ],

    sections: [
      {
        blockType:
          "sectionIntro",

        eyebrow:
          "Campaign",

        heading:
          "A verified campaign story.",

        body:
          "Evidence-backed introduction.",
      },

      {
        blockType:
          "metrics",

        heading:
          "Verified results",

        items: [
          {
            value:
              "500",

            label:
              "Creators activated",
          },
        ],
      },

      {
        blockType:
          "mediaBlock",

        media:
          99,

        alt:
          "Campaign visual",
      },

      {
        blockType:
          "cta",

        heading:
          "Continue exploring",

        buttonLabel:
          "Next project",

        buttonHref:
          "/work/next-project",
      },
    ],
  };

function cleanStoredDocument(): Record<string, any> {
  return {
    id:
      1001,

    ...clone(EXPECTED),

    _status:
      "draft",

    createdAt:
      "2026-09-16T10:00:00.000Z",

    updatedAt:
      "2026-09-16T10:01:00.000Z",

    projectKind:
      "campaign",

    featured:
      false,

    flagshipRendererKey:
      null,
  };
}

function hasCode(
  result:
    ReturnType<
      typeof verifyFlexibleCmsDraftReadback
    >,
  code: string,
): boolean {
  return result
    .issues
    .some(
      (issue) =>
        issue.code ===
        code,
    );
}

function hasPath(
  result:
    ReturnType<
      typeof verifyFlexibleCmsDraftReadback
    >,
  path: string,
): boolean {
  return result
    .issues
    .some(
      (issue) =>
        issue.path ===
        path,
    );
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — CMS read-back verification tests\n",
  );

  const exact =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      cleanStoredDocument(),
    );

  check(
    "exact stored draft verifies",
    exact.verified,
  );

  check(
    "harmless Payload metadata is allowed",
    exact.issues.length ===
      0,
  );

  const generatedIds =
    cleanStoredDocument();

  const sections =
    generatedIds.sections as
      Array<
        Record<
          string,
          unknown
        >
      >;

  sections[0].id =
    "payload-block-1";

  sections[1].id =
    "payload-block-2";

  const metricItems =
    sections[1].items as
      Array<
        Record<
          string,
          unknown
        >
      >;

  metricItems[0].id =
    "payload-array-row-1";

  const generatedIdResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      generatedIds,
    );

  check(
    "Payload-generated block and array IDs are ignored",
    generatedIdResult
      .verified,
  );

  const payloadNullMetadata =
    cleanStoredDocument();

  const payloadNullSections =
    payloadNullMetadata
      .sections as
      Array<
        Record<
          string,
          unknown
        >
      >;

  for (
    const section
    of payloadNullSections
  ) {
    section.blockName =
      null;
  }

  const payloadNullMetricItems =
    payloadNullSections[1]
      .items as
      Array<
        Record<
          string,
          unknown
        >
      >;

  payloadNullMetricItems[0].prefix =
    null;

  payloadNullMetricItems[0].suffix =
    null;

  payloadNullMetricItems[0].note =
    null;

  payloadNullSections[2].legacySrc =
    null;

  payloadNullSections[2].caption =
    null;

  payloadNullSections[2].credit =
    null;

  payloadNullSections[3].body =
    null;

  const payloadNullResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      payloadNullMetadata,
    );

  check(
    "Payload blockName metadata and null optional placeholders are ignored",
    payloadNullResult
      .verified,
  );

  const unexpectedOptionalValue =
    cleanStoredDocument();

  (
    unexpectedOptionalValue
      .sections as
      Array<
        Record<
          string,
          unknown
        >
      >
  )[2].caption =
    "Unexpected caption";

  const unexpectedOptionalResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      unexpectedOptionalValue,
    );

  check(
    "non-null unexpected section content is still rejected",
    !unexpectedOptionalResult
      .verified &&
    hasPath(
      unexpectedOptionalResult,
      "sections",
    ),
  );

  const populatedRelationships =
    cleanStoredDocument();

  populatedRelationships.company = {
    id:
      10,
    slug:
      "sample-company",
  };

  populatedRelationships.brand = {
    id:
      20,
    slug:
      "sample-brand",
  };

  populatedRelationships.services = [
    {
      id:
        41,
      slug:
        "service-two",
    },
    {
      id:
        40,
      slug:
        "service-one",
    },
  ];

  populatedRelationships.businessCategories = [
    {
      id:
        30,
      slug:
        "consumer-goods",
    },
  ];

  populatedRelationships.solutions = [
    {
      id:
        50,
      slug:
        "solution-one",
    },
  ];

  const populatedSections =
    populatedRelationships
      .sections as
      Array<
        Record<
          string,
          unknown
        >
      >;

  populatedSections[2].media = {
    id:
      99,
    url:
      "https://example.invalid/media.jpg",
  };

  const populatedResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      populatedRelationships,
    );

  check(
    "populated Payload relationships normalize to IDs",
    populatedResult
      .verified,
  );

  const wrongStatus =
    cleanStoredDocument();

  wrongStatus._status =
    "published";

  const wrongStatusResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      wrongStatus,
    );

  check(
    "published read-back is rejected",
    !wrongStatusResult
      .verified &&
    hasCode(
      wrongStatusResult,
      "CMS_READBACK_NOT_DRAFT",
    ),
  );

  const wrongRenderMode =
    cleanStoredDocument();

  wrongRenderMode.renderMode =
    "standard";

  const wrongRenderResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      wrongRenderMode,
    );

  check(
    "non-flexible read-back is rejected",
    !wrongRenderResult
      .verified &&
    hasCode(
      wrongRenderResult,
      "CMS_READBACK_RENDER_MODE_MISMATCH",
    ),
  );

  const flagship =
    cleanStoredDocument();

  flagship.flagshipRendererKey =
    "high-ultra-lounge";

  const flagshipResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      flagship,
    );

  check(
    "flagship renderer on Agent draft is rejected",
    !flagshipResult
      .verified &&
    hasCode(
      flagshipResult,
      "CMS_READBACK_FLAGSHIP_RENDERER_PRESENT",
    ),
  );

  const wrongTitle =
    cleanStoredDocument();

  wrongTitle.title =
    "Changed Campaign";

  const wrongTitleResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      wrongTitle,
    );

  check(
    "changed title is detected",
    !wrongTitleResult
      .verified &&
    hasPath(
      wrongTitleResult,
      "title",
    ),
  );

  const wrongSlug =
    cleanStoredDocument();

  wrongSlug.slug =
    "different-slug";

  const wrongSlugResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      wrongSlug,
    );

  check(
    "changed slug is detected",
    !wrongSlugResult
      .verified &&
    hasPath(
      wrongSlugResult,
      "slug",
    ),
  );

  const wrongRelationship =
    cleanStoredDocument();

  wrongRelationship.brand =
    999;

  const wrongRelationshipResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      wrongRelationship,
    );

  check(
    "changed relationship is detected",
    !wrongRelationshipResult
      .verified &&
    hasPath(
      wrongRelationshipResult,
      "brand",
    ),
  );

  const wrongServices =
    cleanStoredDocument();

  wrongServices.services = [
    40,
    999,
  ];

  const wrongServicesResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      wrongServices,
    );

  check(
    "changed many-relationship is detected",
    !wrongServicesResult
      .verified &&
    hasPath(
      wrongServicesResult,
      "services",
    ),
  );

  const changedSection =
    cleanStoredDocument();

  (
    changedSection
      .sections as
      Array<
        Record<
          string,
          unknown
        >
      >
  )[0].heading =
    "Changed heading";

  const changedSectionResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      changedSection,
    );

  check(
    "changed section content is detected",
    !changedSectionResult
      .verified &&
    hasPath(
      changedSectionResult,
      "sections",
    ),
  );

  const reorderedSections =
    cleanStoredDocument();

  reorderedSections.sections = [
    ...(
      reorderedSections
        .sections as unknown[]
    ),
  ].reverse();

  const reorderedResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      reorderedSections,
    );

  check(
    "section order changes are detected",
    !reorderedResult
      .verified &&
    hasPath(
      reorderedResult,
      "sections",
    ),
  );

  const missingSections =
    cleanStoredDocument();

  delete (
    missingSections as
      Record<string, unknown>
  ).sections;

  const missingSectionsResult =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      missingSections,
    );

  check(
    "missing Agent-owned field is detected",
    !missingSectionsResult
      .verified &&
    hasPath(
      missingSectionsResult,
      "sections",
    ),
  );

  const invalidDocument =
    verifyFlexibleCmsDraftReadback(
      EXPECTED,
      null,
    );

  check(
    "invalid Payload document is rejected",
    !invalidDocument
      .verified &&
    hasCode(
      invalidDocument,
      "CMS_READBACK_INVALID_DOCUMENT",
    ),
  );

  const expectedBefore =
    JSON.stringify(
      EXPECTED,
    );

  const storedForMutation =
    cleanStoredDocument();

  const storedBefore =
    JSON.stringify(
      storedForMutation,
    );

  verifyFlexibleCmsDraftReadback(
    EXPECTED,
    storedForMutation,
  );

  check(
    "verifier does not mutate expected payload",
    JSON.stringify(
      EXPECTED,
    ) ===
      expectedBefore,
  );

  check(
    "verifier does not mutate stored document",
    JSON.stringify(
      storedForMutation,
    ) ===
      storedBefore,
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
