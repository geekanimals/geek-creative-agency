/**
 * GOLD STANDARD CASE STUDY AGENT — DESIGNER TESTS
 *
 * No real OpenAI call.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves that the Designer:
 * - follows Architect chapter structure;
 * - supports the real Flexible block vocabulary;
 * - preserves evidence boundaries;
 * - permits only trusted media;
 * - permits only trusted CTA targets;
 * - rejects invented CMS fields / paths / URLs;
 * - never writes Payload directly.
 */

import {
  designCaseStudy,
} from "./designer";

import type {
  DesignerRequest,
} from "./designer";

import type {
  CaseStudyDesignPlan,
} from "./architect";

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

function fakeClient(
  outputText: string | undefined,
) {
  return {
    responses: {
      create: async () => ({
        output_text: outputText,
      }),
    },
  } as never;
}

const PLAN: CaseStudyDesignPlan = {
  narrativeThesis:
    "The strongest story moves from campaign context through the participation mechanic to verified scale.",

  storyStrategy:
    "Establish the context, show how participation worked, then close with evidence of scale.",

  renderModeRecommendation:
    "flexible",

  chapters: [
    {
      id: "context",
      role: "context",

      headingDirection:
        "Establish the campaign context.",

      purpose:
        "Explain the conditions surrounding the campaign.",

      evidenceClaimIds: [
        "fact-context",
        "quote-stakeholder",
      ],

      metricClaimIds: [],

      mediaRole:
        "campaign-hero",

      toneRecommendation:
        "dark",
    },

    {
      id: "mechanic",
      role: "mechanic",

      headingDirection:
        "Show how participation worked.",

      purpose:
        "Explain the campaign mechanic and execution.",

      evidenceClaimIds: [
        "fact-mechanic",
      ],

      metricClaimIds: [],

      mediaRole:
        "mechanic",

      toneRecommendation:
        "light",
    },

    {
      id: "results",
      role: "results",

      headingDirection:
        "Make verified scale visible.",

      purpose:
        "Present the strongest supported result.",

      evidenceClaimIds: [
        "fact-result",
      ],

      metricClaimIds: [
        "metric-creators",
      ],

      mediaRole:
        "report-chart",

      toneRecommendation:
        "dark",
    },
  ],

  metricsPlan: [
    {
      claimId:
        "metric-creators",

      role:
        "Primary scale proof.",

      placement:
        "results",

      scopeNote:
        "Campaign-specific creator activation.",
    },
  ],

  mediaPlan: [
    {
      role:
        "campaign-hero",

      placement:
        "context",

      purpose:
        "Establish campaign identity.",

      evidenceClaimIds: [
        "fact-context",
      ],
    },

    {
      role:
        "mechanic",

      placement:
        "mechanic",

      purpose:
        "Show how the participation mechanic worked.",

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },
  ],

  continuityPlan: {
    nextProjectSlug:
      "next-project",

    progression:
      "The next project continued the creator relationship.",

    rationale:
      "Trusted continuity context permits this relationship.",
  },

  ctaPlan: {
    purpose:
      "Continue the portfolio story.",

    recommendedDirection:
      "Lead to the next campaign.",

    targetProjectSlug:
      "next-project",
  },

  designRationale:
    "A context → mechanic → proof structure better reflects the available evidence than a fixed five-part template.",
};

const REQUEST: DesignerRequest = {
  plan:
    PLAN,

  claims: [
    {
      id: "fact-context",
      type: "fact",

      statement:
        "The campaign operated during a constrained launch period.",

      sourceIds: [
        "source-report",
      ],

      confidence: "high",
      publishable: true,
    },

    {
      id: "quote-stakeholder",
      type: "quote",

      statement:
        "The activation gave creators a meaningful role.",

      sourceIds: [
        "source-interview",
      ],

      confidence: "high",
      publishable: true,
    },

    {
      id: "fact-mechanic",
      type: "fact",

      statement:
        "Creators participated through an active campaign mechanic.",

      sourceIds: [
        "source-report",
      ],

      confidence: "high",
      publishable: true,
    },

    {
      id: "fact-result",
      type: "fact",

      statement:
        "The campaign produced measurable creator participation.",

      sourceIds: [
        "source-report",
      ],

      confidence: "high",
      publishable: true,
    },

    {
      id: "metric-creators",
      type: "metric",

      statement:
        "The campaign activated 500 creators.",

      sourceIds: [
        "source-report",
      ],

      confidence: "high",
      publishable: true,
    },

    {
      id: "fact-outside-chapter",
      type: "fact",

      statement:
        "A separate supported fact exists outside the context chapter.",

      sourceIds: [
        "source-report",
      ],

      confidence: "high",
      publishable: true,
    },

    {
      id: "internal-weak",
      type: "fact",

      statement:
        "An uncertain internal observation.",

      sourceIds: [
        "source-report",
      ],

      confidence: "low",
      publishable: false,
    },
  ],

  mediaAssets: [
    {
      id:
        "asset-hero",

      title:
        "Campaign hero",

      role:
        "campaign-hero",

      description:
        "Primary campaign visual.",
    },

    {
      id:
        "asset-context",

      title:
        "Campaign context",

      role:
        "context",

      description:
        "Supporting contextual visual.",
    },

    {
      id:
        "asset-mechanic",

      title:
        "Campaign mechanic",

      role:
        "mechanic",

      description:
        "Visual showing the activation mechanic.",
    },

    {
      id:
        "asset-gallery-1",

      title:
        "Creator content one",

      role:
        "creator-content",
    },

    {
      id:
        "asset-gallery-2",

      title:
        "Creator content two",

      role:
        "creator-content",
    },
  ],

  allowedContinuitySlugs: [
    "next-project",
  ],

  model:
    "fake-model",
};

const VALID_DESIGN = {
  renderMode:
    "flexible",

  sections: [
    {
      id:
        "context-intro",

      chapterId:
        "context",

      blockType:
        "sectionIntro",

      eyebrow:
        "THE CONTEXT",

      heading:
        "A launch operating under constraint.",

      body:
        "The campaign operated during a constrained launch period.",

      evidenceClaimIds: [
        "fact-context",
      ],
    },

    {
      id:
        "context-rich",

      chapterId:
        "context",

      blockType:
        "richText",

      body:
        "The campaign context shaped how the activation needed to work.",

      evidenceClaimIds: [
        "fact-context",
      ],
    },

    {
      id:
        "context-media",

      chapterId:
        "context",

      blockType:
        "mediaBlock",

      assetId:
        "asset-context",

      evidenceClaimIds: [],
    },

    {
      id:
        "context-full-bleed",

      chapterId:
        "context",

      blockType:
        "fullBleedMedia",

      assetId:
        "asset-hero",

      overlayHeading:
        "THE CAMPAIGN",

      evidenceClaimIds: [
        "fact-context",
      ],
    },

    {
      id:
        "context-quote",

      chapterId:
        "context",

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
        "mechanic-split",

      chapterId:
        "mechanic",

      blockType:
        "splitContent",

      mediaSide:
        "left",

      body:
        "Creators participated through an active campaign mechanic.",

      assetId:
        "asset-mechanic",

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },

    {
      id:
        "mechanic-gallery",

      chapterId:
        "mechanic",

      blockType:
        "mediaGallery",

      heading:
        "Creator participation",

      assetIds: [
        "asset-gallery-1",
        "asset-gallery-2",
      ],

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },

    {
      id:
        "results-metrics",

      chapterId:
        "results",

      blockType:
        "metrics",

      heading:
        "VERIFIED SCALE",

      items: [
        {
          claimId:
            "metric-creators",

          value:
            "500",

          label:
            "Creators activated",

          prefix:
            null,

          suffix:
            null,

          note:
            "Campaign-specific activation.",
        },
      ],

      evidenceClaimIds: [
        "metric-creators",
      ],
    },

    {
      id:
        "closing-cta",

      chapterId:
        null,

      blockType:
        "cta",

      heading:
        "THE STORY CONTINUED.",

      body:
        "See how the creator relationship developed in the next project.",

      buttonLabel:
        "See the next project",

      targetProjectSlug:
        "next-project",

      evidenceClaimIds: [],
    },
  ],
};

async function expectReject(
  name: string,
  output: unknown,
  expectedMessage: string,
) {
  let rejected = false;

  try {
    await designCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              output,
            ),
          ),
      },
    );
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

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Designer tests\n",
  );

  const requestBefore =
    JSON.stringify(REQUEST);

  /* ── Valid complete design ───────────────────────── */

  const valid =
    await designCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              VALID_DESIGN,
            ),
          ),
      },
    );

  check(
    "valid Flexible design succeeds",
    valid.renderMode ===
      "flexible",
  );

  check(
    "all nine semantic Flexible block types are accepted",
    new Set(
      valid.sections.map(
        (section) =>
          section.blockType,
      ),
    ).size === 9,
  );

  check(
    "Designer preserves variable Architect chapter structure",
    [
      ...new Set(
        valid.sections
          .map(
            (section) =>
              section.chapterId,
          )
          .filter(Boolean),
      ),
    ].join(",") ===
      "context,mechanic,results",
  );

  const rich =
    valid.sections.find(
      (section) =>
        section.blockType ===
        "richText",
    );

  check(
    "richText remains semantic plain text rather than Lexical JSON",
    Boolean(
      rich &&
      rich.blockType ===
        "richText" &&
      typeof rich.body ===
        "string",
    ),
  );

  const media =
    valid.sections.find(
      (section) =>
        section.blockType ===
        "mediaBlock",
    );

  check(
    "media uses trusted assetId rather than a path",
    Boolean(
      media &&
      media.blockType ===
        "mediaBlock" &&
      media.assetId ===
        "asset-context",
    ),
  );

  const cta =
    valid.sections.find(
      (section) =>
        section.blockType ===
        "cta",
    );

  check(
    "CTA keeps trusted project slug rather than generating URL",
    Boolean(
      cta &&
      cta.blockType ===
        "cta" &&
      cta.targetProjectSlug ===
        "next-project",
    ),
  );

  /* ── Duplicate section id ────────────────────────── */

  const duplicateSection =
    clone(VALID_DESIGN);

  duplicateSection
    .sections[1]
    .id =
    duplicateSection
      .sections[0]
      .id;

  await expectReject(
    "duplicate section IDs are rejected",
    duplicateSection,
    "Duplicate Designer section id",
  );

  /* ── Unknown chapter ─────────────────────────────── */

  const unknownChapter =
    clone(VALID_DESIGN);

  unknownChapter
    .sections[1]
    .chapterId =
    "invented-chapter";

  await expectReject(
    "invented Architect chapter is rejected",
    unknownChapter,
    "unknown Architect chapter",
  );

  /* ── Chapter omission ────────────────────────────── */

  const omittedChapter =
    clone(VALID_DESIGN);

  omittedChapter.sections =
    omittedChapter.sections.filter(
      (section) =>
        section.chapterId !==
        "mechanic",
    );

  await expectReject(
    "Designer cannot omit an Architect chapter",
    omittedChapter,
    "Designer omitted Architect chapter: mechanic",
  );

  /* ── Chapter reorder ─────────────────────────────── */

  const reordered =
    clone(VALID_DESIGN);

  const results =
    reordered.sections.splice(
      7,
      1,
    )[0];

  reordered.sections.splice(
    1,
    0,
    results,
  );

  await expectReject(
    "Designer cannot reorder approved Architect chapters",
    reordered,
    "breaks the approved Architect chapter order",
  );

  /* ── Evidence outside chapter ────────────────────── */

  const outsideEvidence =
    clone(VALID_DESIGN);

  outsideEvidence
    .sections[0]
    .evidenceClaimIds = [
      "fact-outside-chapter",
    ];

  await expectReject(
    "section cannot use evidence outside its Architect chapter",
    outsideEvidence,
    "outside Architect chapter context",
  );

  /* ── Unknown evidence ────────────────────────────── */

  const unknownEvidence =
    clone(VALID_DESIGN);

  unknownEvidence
    .sections[0]
    .evidenceClaimIds = [
      "claim-does-not-exist",
    ];

  await expectReject(
    "unknown evidence claim is rejected",
    unknownEvidence,
    "unknown evidence claim",
  );

  /* ── Low-confidence evidence ─────────────────────── */

  const weakEvidence =
    clone(VALID_DESIGN);

  weakEvidence
    .sections[0]
    .evidenceClaimIds = [
      "internal-weak",
    ];

  const weakRequest =
    clone(REQUEST);

  weakRequest
    .plan
    .chapters[0]
    .evidenceClaimIds.push(
      "internal-weak",
    );

  let weakRejected =
    false;

  try {
    await designCaseStudy(
      weakRequest,
      {
        client:
          fakeClient(
            JSON.stringify(
              weakEvidence,
            ),
          ),
      },
    );
  } catch (error) {
    weakRejected =
      error instanceof Error &&
      error.message.includes(
        "not publication-ready",
      );
  }

  check(
    "low-confidence evidence cannot support public copy",
    weakRejected,
  );

  /* ── Unknown media ───────────────────────────────── */

  const unknownMedia =
    clone(VALID_DESIGN);

  const mediaSection =
    unknownMedia.sections.find(
      (section) =>
        section.blockType ===
        "mediaBlock",
    ) as any;

  mediaSection.assetId =
    "invented-asset";

  await expectReject(
    "invented media asset is rejected",
    unknownMedia,
    "non-allowlisted media asset",
  );

  /* ── Media URL injection ─────────────────────────── */

  const mediaUrl =
    clone(VALID_DESIGN) as any;

  mediaUrl.sections[2].url =
    "https://example.com/fake.jpg";

  await expectReject(
    "Designer cannot invent media URL",
    mediaUrl,
    "unknown field: url",
  );

  /* ── legacySrc injection ─────────────────────────── */

  const legacyPath =
    clone(VALID_DESIGN) as any;

  legacyPath.sections[2].legacySrc =
    "/assets/fake.jpg";

  await expectReject(
    "Designer cannot invent legacySrc",
    legacyPath,
    "unknown field: legacySrc",
  );

  /* ── CMS media ID injection ──────────────────────── */

  const cmsMedia =
    clone(VALID_DESIGN) as any;

  cmsMedia.sections[2].media =
    123;

  await expectReject(
    "Designer cannot invent CMS media ID",
    cmsMedia,
    "unknown field: media",
  );

  /* ── Duplicate gallery asset ─────────────────────── */

  const duplicateGallery =
    clone(VALID_DESIGN);

  const gallery =
    duplicateGallery.sections.find(
      (section) =>
        section.blockType ===
        "mediaGallery",
    ) as any;

  gallery.assetIds = [
    "asset-gallery-1",
    "asset-gallery-1",
  ];

  await expectReject(
    "duplicate gallery asset IDs are rejected",
    duplicateGallery,
    "duplicate media asset IDs",
  );

  /* ── Metric must exist ───────────────────────────── */

  const unknownMetric =
    clone(VALID_DESIGN);

  const metricsUnknown =
    unknownMetric.sections.find(
      (section) =>
        section.blockType ===
        "metrics",
    ) as any;

  metricsUnknown.items[0].claimId =
    "metric-does-not-exist";

  await expectReject(
    "unknown metric claim is rejected",
    unknownMetric,
    "unknown evidence claim",
  );

  /* ── Metric must be metric type ──────────────────── */

  const nonMetric =
    clone(VALID_DESIGN);

  const metricsNonMetric =
    nonMetric.sections.find(
      (section) =>
        section.blockType ===
        "metrics",
    ) as any;

  metricsNonMetric.items[0].claimId =
    "fact-result";

  const nonMetricRequest =
    clone(REQUEST);

  nonMetricRequest
    .plan
    .chapters[2]
    .metricClaimIds.push(
      "fact-result",
    );

  let nonMetricRejected =
    false;

  try {
    await designCaseStudy(
      nonMetricRequest,
      {
        client:
          fakeClient(
            JSON.stringify(
              nonMetric,
            ),
          ),
      },
    );
  } catch (error) {
    nonMetricRejected =
      error instanceof Error &&
      error.message.includes(
        "non-metric claim",
      );
  }

  check(
    "non-metric evidence cannot become metric item",
    nonMetricRejected,
  );

  /* ── Metric must belong to Architect chapter ─────── */

  const metricOutside =
    clone(VALID_DESIGN);

  const metricOutsideSection =
    metricOutside.sections.find(
      (section) =>
        section.blockType ===
        "metrics",
    ) as any;

  metricOutsideSection.items[0].claimId =
    "metric-creators";

  const metricOutsideRequest =
    clone(REQUEST);

  metricOutsideRequest
    .plan
    .chapters[2]
    .metricClaimIds = [];

  await (async () => {
    let rejected = false;

    try {
      await designCaseStudy(
        metricOutsideRequest,
        {
          client:
            fakeClient(
              JSON.stringify(
                metricOutside,
              ),
            ),
        },
      );
    } catch (error) {
      rejected =
        error instanceof Error &&
        (
          error.message.includes(
            "outside Architect chapter results",
          ) ||
          error.message.includes(
            "outside Architect chapter",
          )
        );
    }

    check(
      "metric must be approved for its Architect chapter",
      rejected,
    );
  })();

  /* ── Quote must be quote type ────────────────────── */

  const nonQuote =
    clone(VALID_DESIGN);

  const quote =
    nonQuote.sections.find(
      (section) =>
        section.blockType ===
        "quote",
    ) as any;

  quote.claimId =
    "fact-context";

  quote.evidenceClaimIds = [
    "fact-context",
  ];

  await expectReject(
    "non-quote claim cannot become quote block",
    nonQuote,
    "non-quote claim",
  );

  /* ── CTA allowlist ───────────────────────────────── */

  const inventedCta =
    clone(VALID_DESIGN);

  const badCta =
    inventedCta.sections[
      inventedCta.sections.length - 1
    ] as any;

  badCta.targetProjectSlug =
    "invented-project";

  await expectReject(
    "CTA outside trusted continuity allowlist is rejected",
    inventedCta,
    "non-allowlisted CTA target",
  );

  /* ── CTA must follow Architect target ────────────── */

  const wrongCta =
    clone(VALID_DESIGN);

  const wrongCtaRequest =
    clone(REQUEST);

  wrongCtaRequest
    .allowedContinuitySlugs!
    .push(
      "another-project",
    );

  const wrongCtaBlock =
    wrongCta.sections[
      wrongCta.sections.length - 1
    ] as any;

  wrongCtaBlock.targetProjectSlug =
    "another-project";

  let wrongTargetRejected =
    false;

  try {
    await designCaseStudy(
      wrongCtaRequest,
      {
        client:
          fakeClient(
            JSON.stringify(
              wrongCta,
            ),
          ),
      },
    );
  } catch (error) {
    wrongTargetRejected =
      error instanceof Error &&
      error.message.includes(
        "does not follow the approved Architect CTA target",
      );
  }

  check(
    "Designer cannot override Architect CTA target",
    wrongTargetRejected,
  );

  /* ── CTA cannot contain URL ──────────────────────── */

  const hrefInjection =
    clone(VALID_DESIGN) as any;

  hrefInjection.sections[
    hrefInjection.sections.length - 1
  ].buttonHref =
    "/work/next-project";

  await expectReject(
    "Designer cannot generate buttonHref",
    hrefInjection,
    "unknown field: buttonHref",
  );

  /* ── CTA must be final ───────────────────────────── */

  const ctaNotFinal =
    clone(VALID_DESIGN);

  const closing =
    ctaNotFinal.sections.pop()!;

  ctaNotFinal.sections.splice(
    1,
    0,
    closing,
  );

  await expectReject(
    "CTA must be final section",
    ctaNotFinal,
    "CTA must be the final section",
  );

  /* ── Only Flexible mode ──────────────────────────── */

  const standardOutput =
    clone(VALID_DESIGN) as any;

  standardOutput.renderMode =
    "standard";

  await expectReject(
    "Designer cannot output Standard mode",
    standardOutput,
    "renderMode must be flexible",
  );

  /* ── Unknown root field ──────────────────────────── */

  const rootInjection =
    clone(VALID_DESIGN) as any;

  rootInjection.payloadReady =
    true;

  await expectReject(
    "unknown Designer root fields are rejected",
    rootInjection,
    "unknown field: payloadReady",
  );

  /* ── Malformed JSON ──────────────────────────────── */

  let malformedRejected =
    false;

  try {
    await designCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            "{ not valid JSON",
          ),
      },
    );
  } catch (error) {
    malformedRejected =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "malformed structured output is rejected",
    malformedRejected,
  );

  /* ── Empty model output ──────────────────────────── */

  let emptyRejected =
    false;

  try {
    await designCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(""),
      },
    );
  } catch (error) {
    emptyRejected =
      error instanceof Error &&
      error.message.includes(
        "no structured output",
      );
  }

  check(
    "empty Designer model output is rejected",
    emptyRejected,
  );

  /* ── Architect standard plan refused ─────────────── */

  const standardPlanRequest =
    clone(REQUEST);

  standardPlanRequest
    .plan
    .renderModeRecommendation =
    "standard";

  let standardPlanRejected =
    false;

  try {
    await designCaseStudy(
      standardPlanRequest,
      {
        client:
          fakeClient(
            JSON.stringify(
              VALID_DESIGN,
            ),
          ),
      },
    );
  } catch (error) {
    standardPlanRejected =
      error instanceof Error &&
      error.message.includes(
        "requires an Architect plan recommending flexible",
      );
  }

  check(
    "Designer refuses Architect Standard-mode plan",
    standardPlanRejected,
  );

  /* ── Input mutation ──────────────────────────────── */

  check(
    "Designer does not mutate trusted request",
    JSON.stringify(REQUEST) ===
      requestBefore,
  );

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(
    fail === 0 ? 0 : 1,
  );
}

main().catch(
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
