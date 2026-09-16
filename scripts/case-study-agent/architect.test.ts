/**
 * GOLD STANDARD CASE STUDY AGENT — ARCHITECT TESTS
 *
 * No real OpenAI call.
 * No network.
 * No Payload.
 * No DB.
 */

import {
  architectCaseStudy,
} from "./architect";

import type {
  ArchitectRequest,
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
  captureRequest?: (
    input: unknown,
  ) => void,
) {
  return {
    responses: {
      create: async (
        input: unknown,
      ) => {
        captureRequest?.(
          input,
        );

        return {
          output_text:
            outputText,
        };
      },
    },
  } as never;
}

const REQUEST: ArchitectRequest = {
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
      id: "fact-continuity",
      type: "narrative",

      statement:
        "The campaign connected to the next phase of the creator programme.",

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

  projectHint: {
    title: "Sample Campaign",
    slug: "sample-campaign",
  },

  portfolioContext: {
    relationships: {
      companySlug:
        "sample-company",

      brandSlug:
        "sample-brand",

      businessCategorySlugs: [
        "consumer-goods",
      ],

      serviceSlugs: [
        "influencer-marketing",
      ],

      solutionSlugs: [
        "creator-activation-system",
      ],
    },

    solutions: [
      {
        slug:
          "creator-activation-system",

        evidenceClaimIds: [
          "fact-mechanic",
        ],
      },
    ],
  },

  allowedContinuitySlugs: [
    "sample-next-project",
  ],

  model: "fake-model",
};

const VALID_PLAN = {
  narrativeThesis:
    "The strongest story is how an active creator mechanic turned a constrained launch into measurable participation.",

  storyStrategy:
    "Begin with context, explain the mechanic, then prove scale with the verified creator metric.",

  renderModeRecommendation:
    "flexible",

  chapters: [
    {
      id: "context",

      role: "context",

      headingDirection:
        "Set up the operating conditions.",

      purpose:
        "Explain the campaign context without overstating the challenge.",

      evidenceClaimIds: [
        "fact-context",
      ],

      metricClaimIds: [],

      mediaRole: "context",

      toneRecommendation:
        "dark",
    },

    {
      id: "mechanic",

      role: "mechanic",

      headingDirection:
        "Show how creators participated.",

      purpose:
        "Explain the campaign mechanic.",

      evidenceClaimIds: [
        "fact-mechanic",
      ],

      metricClaimIds: [],

      mediaRole: "mechanic",

      toneRecommendation:
        "light",
    },

    {
      id: "results",

      role: "results",

      headingDirection:
        "Make verified scale visible.",

      purpose:
        "Present the strongest supported metric.",

      evidenceClaimIds: [
        "metric-creators",
      ],

      metricClaimIds: [
        "metric-creators",
      ],

      mediaRole: "report-chart",

      toneRecommendation:
        "dark",
    },
  ],

  metricsPlan: [
    {
      claimId:
        "metric-creators",

      role:
        "Primary proof of participation scale.",

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
        "hero",

      purpose:
        "Establish the campaign visually.",

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },

    {
      role:
        "mechanic",

      placement:
        "mechanic",

      purpose:
        "Help readers understand how participation worked.",

      evidenceClaimIds: [
        "fact-mechanic",
      ],
    },
  ],

  continuityPlan: {
    previousProjectSlug:
      null,

    nextProjectSlug:
      "sample-next-project",

    progression:
      "The creator programme continued into the next project.",

    rationale:
      "The supplied continuity evidence supports a next-phase relationship.",
  },

  ctaPlan: {
    purpose:
      "Continue the creator-system story.",

    recommendedDirection:
      "Invite the reader into the next project.",

    targetProjectSlug:
      "sample-next-project",
  },

  designRationale:
    "This structure follows the strongest evidence rather than forcing the project into a five-part generic template.",
};

async function expectReject(
  name: string,
  output: unknown,
  expectedMessage: string,
) {
  let rejected = false;

  try {
    await architectCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(output),
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
    "Gold Standard Case Study Agent — Architect tests\n",
  );

  const before =
    JSON.stringify(REQUEST);

  let capturedArchitectRequest:
    unknown;

  const valid =
    await architectCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              VALID_PLAN,
            ),
            (
              input,
            ) => {
              capturedArchitectRequest =
                input;
            },
          ),
      },
    );

  const capturedRequest =
    capturedArchitectRequest as {
      input?: Array<{
        role?: string;
        content?: string;
      }>;
    };

  const capturedUserMessage =
    capturedRequest
      .input
      ?.find(
        (message) =>
          message.role ===
          "user",
      );

  let capturedPrompt:
    Record<string, unknown> |
    undefined;

  if (
    capturedUserMessage
      ?.content
  ) {
    capturedPrompt =
      JSON.parse(
        capturedUserMessage
          .content,
      ) as
        Record<
          string,
          unknown
        >;
  }

  check(
    "Architect receives trusted portfolio context",
    Boolean(
      capturedPrompt
        ?.trustedPortfolioContext,
    ),
  );

  check(
    "Architect receives portfolio context unchanged",
    JSON.stringify(
      capturedPrompt
        ?.trustedPortfolioContext,
    ) ===
      JSON.stringify(
        REQUEST
          .portfolioContext,
      ),
  );

  const capturedPortfolio =
    capturedPrompt
      ?.trustedPortfolioContext as
      | {
          relationships?: {
            companySlug?: string;
            brandSlug?: string;
            businessCategorySlugs?: string[];
            serviceSlugs?: string[];
            solutionSlugs?: string[];
          };

          solutions?: Array<{
            slug?: string;
            evidenceClaimIds?: string[];
          }>;
        }
      | undefined;

  check(
    "Company reaches Architect unchanged",
    capturedPortfolio
      ?.relationships
      ?.companySlug ===
      "sample-company",
  );

  check(
    "Brand reaches Architect unchanged",
    capturedPortfolio
      ?.relationships
      ?.brandSlug ===
      "sample-brand",
  );

  check(
    "Industry/category reaches Architect unchanged",
    capturedPortfolio
      ?.relationships
      ?.businessCategorySlugs
      ?.join(",") ===
      "consumer-goods",
  );

  check(
    "Service reaches Architect unchanged",
    capturedPortfolio
      ?.relationships
      ?.serviceSlugs
      ?.join(",") ===
      "influencer-marketing",
  );

  check(
    "only supplied Solution/IP reaches Architect",
    capturedPortfolio
      ?.relationships
      ?.solutionSlugs
      ?.join(",") ===
      "creator-activation-system" &&
    capturedPortfolio
      ?.solutions
      ?.length ===
      1 &&
    capturedPortfolio
      .solutions[0]
      .slug ===
      "creator-activation-system",
  );

  check(
    "Solution/IP evidence relationship reaches Architect unchanged",
    capturedPortfolio
      ?.solutions?.[0]
      ?.evidenceClaimIds
      ?.join(",") ===
      "fact-mechanic",
  );

  check(
    "valid architecture plan succeeds",
    valid.chapters.length === 3,
  );

  check(
    "variable chapter count is accepted",
    valid.chapters.length !== 5,
  );

  check(
    "architect is not forced into fixed Standard narrative fields",
    !valid.chapters.some(
      (chapter) =>
        [
          "challenge",
          "insight",
          "idea",
          "execution",
          "outcome",
        ].includes(
          chapter.id,
        ),
    ),
  );

  check(
    "flexible recommendation is accepted",
    valid.renderModeRecommendation ===
      "flexible",
  );

  const standard =
    clone(VALID_PLAN);

  standard.renderModeRecommendation =
    "standard";

  const standardResult =
    await architectCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              standard,
            ),
          ),
      },
    );

  check(
    "standard recommendation is accepted",
    standardResult.renderModeRecommendation ===
      "standard",
  );

  const duplicate =
    clone(VALID_PLAN);

  duplicate.chapters[1].id =
    duplicate.chapters[0].id;

  await expectReject(
    "duplicate chapter IDs are rejected",
    duplicate,
    "Duplicate Architect chapter id",
  );

  const unknownEvidence =
    clone(VALID_PLAN);

  unknownEvidence
    .chapters[0]
    .evidenceClaimIds = [
      "claim-does-not-exist",
    ];

  await expectReject(
    "unknown evidence claim ID is rejected",
    unknownEvidence,
    "unknown evidence claim",
  );

  const unknownMetric =
    clone(VALID_PLAN);

  unknownMetric
    .metricsPlan[0]
    .claimId =
    "metric-does-not-exist";

  await expectReject(
    "unknown metric claim ID is rejected",
    unknownMetric,
    "unknown evidence claim",
  );

  const nonMetric =
    clone(VALID_PLAN);

  nonMetric
    .metricsPlan[0]
    .claimId =
    "fact-context";

  await expectReject(
    "non-metric claim cannot be used in metrics plan",
    nonMetric,
    "non-metric claim",
  );

  const flagship =
    clone(VALID_PLAN) as any;

  flagship.renderModeRecommendation =
    "flagship";

  await expectReject(
    "flagship recommendation is rejected",
    flagship,
    "must be standard or flexible",
  );

  const inventedUrl =
    clone(VALID_PLAN) as any;

  inventedUrl.mediaPlan[0].url =
    "https://example.com/fake.jpg";

  await expectReject(
    "media plan cannot invent URL",
    inventedUrl,
    "unknown field: url",
  );

  const inventedPath =
    clone(VALID_PLAN) as any;

  inventedPath.mediaPlan[0].path =
    "/assets/fake.jpg";

  await expectReject(
    "media plan cannot invent asset path",
    inventedPath,
    "unknown field: path",
  );

  const badContinuity =
    clone(VALID_PLAN);

  badContinuity
    .continuityPlan!
    .nextProjectSlug =
    "invented-project";

  await expectReject(
    "continuity outside trusted allowlist is rejected",
    badContinuity,
    "non-allowlisted project slug",
  );

  check(
    "valid continuity target is accepted",
    valid.continuityPlan?.nextProjectSlug ===
      "sample-next-project",
  );

  const unknownRoot =
    clone(VALID_PLAN) as any;

  unknownRoot.modelApproved =
    true;

  await expectReject(
    "unknown root fields are rejected",
    unknownRoot,
    "unknown field: modelApproved",
  );

  const lowConfidence =
    clone(VALID_PLAN);

  lowConfidence
    .chapters[0]
    .evidenceClaimIds = [
      "internal-weak",
    ];

  await expectReject(
    "low-confidence internal claim cannot support public chapter",
    lowConfidence,
    "not publication-ready",
  );

  let invalidJsonRejected =
    false;

  try {
    await architectCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            "{ not valid JSON",
          ),
      },
    );
  } catch (error) {
    invalidJsonRejected =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "malformed structured output is rejected",
    invalidJsonRejected,
  );

  let emptyRejected =
    false;

  try {
    await architectCaseStudy(
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
    "empty model output is rejected",
    emptyRejected,
  );

  check(
    "architect does not mutate supplied request",
    JSON.stringify(REQUEST) === before,
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
