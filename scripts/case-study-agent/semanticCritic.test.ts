/**
 * GOLD STANDARD CASE STUDY AGENT — SEMANTIC CRITIC TESTS
 *
 * No real OpenAI calls.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves that the independent semantic Critic:
 * - can pass a clean story;
 * - scores warnings/errors deterministically;
 * - cannot invent claim or section references;
 * - cannot review hidden/non-public evidence;
 * - enforces category-specific grounding;
 * - rejects malformed model output;
 * - receives only publication-ready evidence;
 * - does not mutate trusted input.
 */

import {
  critiqueCaseStudy,
} from "./semanticCritic";

import type {
  SemanticCriticRequest,
} from "./semanticCritic";

import type {
  EvidenceClaim,
} from "./types";

import type {
  CaseStudyDesignPlan,
} from "./architect";

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

type Capture = {
  calls: number;
  model?: string;
  request?: unknown;
};

function fakeClient(
  outputText: string | undefined,
  capture?: Capture,
) {
  return {
    responses: {
      create: async (
        request: {
          model?: string;
        },
      ) => {
        if (capture) {
          capture.calls++;
          capture.model =
            request.model;
          capture.request =
            request;
        }

        return {
          output_text:
            outputText,
        };
      },
    },
  } as never;
}

/* ── Evidence ─────────────────────────────────────── */

const CLAIMS: EvidenceClaim[] = [
  {
    id:
      "fact-context",

    type:
      "fact",

    statement:
      "The campaign operated during a constrained launch period.",

    sourceIds: [
      "source-report",
    ],

    confidence:
      "high",

    publishable:
      true,
  },

  {
    id:
      "metric-creators",

    type:
      "metric",

    statement:
      "The campaign activated 500 creators.",

    sourceIds: [
      "source-report",
    ],

    confidence:
      "high",

    publishable:
      true,
  },

  {
    id:
      "fact-learning",

    type:
      "narrative",

    statement:
      "The campaign showed that active participation could deepen creator involvement.",

    sourceIds: [
      "source-report",
    ],

    confidence:
      "medium",

    publishable:
      true,
  },

  {
    id:
      "internal-hidden",

    type:
      "fact",

    statement:
      "An uncertain internal observation.",

    sourceIds: [
      "source-report",
    ],

    confidence:
      "low",

    publishable:
      false,
  },
];

/* ── Architecture ─────────────────────────────────── */

const ARCHITECTURE: CaseStudyDesignPlan = {
  narrativeThesis:
    "The story moves from campaign constraint to measurable creator participation.",

  storyStrategy:
    "Establish the context, explain participation, and finish with verified scale.",

  renderModeRecommendation:
    "flexible",

  chapters: [
    {
      id:
        "context",

      role:
        "context",

      headingDirection:
        "Establish the campaign context.",

      purpose:
        "Explain the operating conditions.",

      evidenceClaimIds: [
        "fact-context",
      ],

      metricClaimIds: [],

      toneRecommendation:
        "dark",
    },

    {
      id:
        "results",

      role:
        "results",

      headingDirection:
        "Make verified scale visible.",

      purpose:
        "Show the supported creator result.",

      evidenceClaimIds: [
        "metric-creators",
        "fact-learning",
      ],

      metricClaimIds: [
        "metric-creators",
      ],

      toneRecommendation:
        "light",
    },
  ],

  metricsPlan: [
    {
      claimId:
        "metric-creators",

      role:
        "Primary participation proof.",

      placement:
        "results",

      scopeNote:
        "Campaign-specific creator activation.",
    },
  ],

  mediaPlan: [],

  continuityPlan: {
    progression:
      "No external continuity claim is required.",

    rationale:
      "The supplied evidence supports a self-contained case study.",
  },

  ctaPlan: {
    purpose:
      "Close the case study.",

    recommendedDirection:
      "End without inventing portfolio continuity.",
  },

  designRationale:
    "A short context-to-results structure reflects the available evidence.",
};

/* ── Finished design ───────────────────────────────── */

const DESIGN: FlexibleCaseStudyDesign = {
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
        "A constrained launch period.",

      body:
        "The campaign operated during a constrained launch period.",

      evidenceClaimIds: [
        "fact-context",
      ],
    },

    {
      id:
        "results-rich",

      chapterId:
        "results",

      blockType:
        "richText",

      body:
        "The campaign produced measurable creator participation.",

      evidenceClaimIds: [
        "metric-creators",
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
        },
      ],

      evidenceClaimIds: [
        "metric-creators",
      ],
    },
  ],
};

const REQUEST: SemanticCriticRequest = {
  claims:
    CLAIMS,

  architecture:
    ARCHITECTURE,

  design:
    DESIGN,

  model:
    "critic-test-model",
};

/* ── Helpers ──────────────────────────────────────── */

async function expectReject(
  name: string,
  output: unknown,
  expectedMessage: string,
) {
  let rejected =
    false;

  try {
    await critiqueCaseStudy(
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

/* ── Tests ────────────────────────────────────────── */

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Semantic Critic tests\n",
  );

  const requestBefore =
    JSON.stringify(
      REQUEST,
    );

  /* Clean pass */

  const cleanCapture: Capture = {
    calls: 0,
  };

  const clean =
    await critiqueCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify({
              summary:
                "The case study is coherent, evidence-faithful and appropriately scoped.",

              findings: [],
            }),
            cleanCapture,
          ),
      },
    );

  check(
    "clean semantic review passes",
    clean.status ===
      "pass",
  );

  check(
    "clean semantic review is draft-ready",
    clean.draftReady ===
      true,
  );

  check(
    "clean semantic review scores 100",
    clean.score ===
      100,
  );

  check(
    "clean semantic review has no findings",
    clean.findings.length ===
      0,
  );

  check(
    "Critic model is routed correctly",
    cleanCapture.model ===
      "critic-test-model",
  );

  check(
    "Critic model is called exactly once",
    cleanCapture.calls ===
      1,
  );

  /* Prompt evidence isolation */

  const serializedRequest =
    JSON.stringify(
      cleanCapture.request,
    );

  check(
    "Critic receives publication-ready evidence",
    serializedRequest.includes(
      "metric-creators",
    ) &&
    serializedRequest.includes(
      "fact-context",
    ),
  );

  check(
    "Critic does not receive low-confidence hidden evidence",
    !serializedRequest.includes(
      "internal-hidden",
    ) &&
    !serializedRequest.includes(
      "An uncertain internal observation.",
    ),
  );

  /* Warning */

  const warning =
    await critiqueCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify({
              summary:
                "The story is valid but repeats the same result across two sections.",

              findings: [
                {
                  id:
                    "repeated-result",

                  category:
                    "repetition",

                  severity:
                    "warning",

                  message:
                    "The creator result is repeated without adding material meaning.",

                  sectionIds: [
                    "results-rich",
                    "results-metrics",
                  ],

                  claimIds: [
                    "metric-creators",
                  ],
                },
              ],
            }),
          ),
      },
    );

  check(
    "semantic warning produces partial status",
    warning.status ===
      "partial",
  );

  check(
    "semantic warning remains draft-ready",
    warning.draftReady ===
      true,
  );

  check(
    "semantic warning deterministically scores 94",
    warning.score ===
      94,
  );

  /* Error */

  const errorResult =
    await critiqueCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify({
              summary:
                "The story contains material evidence overreach.",

              findings: [
                {
                  id:
                    "unsupported-impact",

                  category:
                    "evidence-overreach",

                  severity:
                    "error",

                  message:
                    "The narrative gives the creator metric a stronger business meaning than the evidence supports.",

                  sectionIds: [
                    "results-rich",
                  ],

                  claimIds: [
                    "metric-creators",
                  ],
                },
              ],
            }),
          ),
      },
    );

  check(
    "semantic error fails review",
    errorResult.status ===
      "fail",
  );

  check(
    "semantic error blocks draft readiness",
    errorResult.draftReady ===
      false,
  );

  check(
    "semantic error deterministically scores 82",
    errorResult.score ===
      82,
  );

  /* Mixed deterministic scoring */

  const mixed =
    await critiqueCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify({
              summary:
                "The story contains one blocking issue and one non-blocking weakness.",

              findings: [
                {
                  id:
                    "unsupported-impact",

                  category:
                    "evidence-overreach",

                  severity:
                    "error",

                  message:
                    "The metric is interpreted too strongly.",

                  sectionIds: [
                    "results-rich",
                  ],

                  claimIds: [
                    "metric-creators",
                  ],
                },

                {
                  id:
                    "thin-strategy",

                  category:
                    "strategic-depth",

                  severity:
                    "warning",

                  message:
                    "The supported strategic learning is underdeveloped.",

                  sectionIds: [
                    "results-rich",
                  ],

                  claimIds: [
                    "fact-learning",
                  ],
                },
              ],
            }),
          ),
      },
    );

  check(
    "mixed semantic findings still fail when any error exists",
    mixed.status ===
      "fail" &&
    mixed.draftReady ===
      false,
  );

  check(
    "mixed semantic score is deterministic",
    mixed.score ===
      76,
  );

  /* Unknown section */

  await expectReject(
    "Critic cannot invent section ID",
    {
      summary:
        "Invalid reference.",

      findings: [
        {
          id:
            "invented-section",

          category:
            "narrative-logic",

          severity:
            "warning",

          message:
            "Invented section reference.",

          sectionIds: [
            "not-a-real-section",
          ],

          claimIds: [],
        },
      ],
    },
    "references unknown section ID",
  );

  /* Unknown claim */

  await expectReject(
    "Critic cannot invent evidence claim ID",
    {
      summary:
        "Invalid reference.",

      findings: [
        {
          id:
            "invented-claim",

          category:
            "metric-interpretation",

          severity:
            "error",

          message:
            "Invented evidence reference.",

          sectionIds: [
            "results-metrics",
          ],

          claimIds: [
            "fake-claim",
          ],
        },
      ],
    },
    "references non-public or unknown claim ID",
  );

  /* Hidden evidence */

  await expectReject(
    "Critic cannot cite non-public evidence",
    {
      summary:
        "Invalid hidden evidence reference.",

      findings: [
        {
          id:
            "hidden-evidence",

          category:
            "other",

          severity:
            "warning",

          message:
            "Attempted reference to internal evidence.",

          sectionIds: [],

          claimIds: [
            "internal-hidden",
          ],
        },
      ],
    },
    "references non-public or unknown claim ID",
  );

  /* Evidence-overreach grounding */

  await expectReject(
    "evidence-overreach must reference both section and claim",
    {
      summary:
        "Invalid overreach finding.",

      findings: [
        {
          id:
            "overreach-unbound",

          category:
            "evidence-overreach",

          severity:
            "error",

          message:
            "Overreach finding lacks evidence grounding.",

          sectionIds: [
            "results-rich",
          ],

          claimIds: [],
        },
      ],
    },
    "must reference both section and claim IDs",
  );

  /* Repetition grounding */

  await expectReject(
    "repetition must reference at least two sections",
    {
      summary:
        "Invalid repetition finding.",

      findings: [
        {
          id:
            "single-section-repeat",

          category:
            "repetition",

          severity:
            "warning",

          message:
            "Cannot prove repetition from one section.",

          sectionIds: [
            "results-rich",
          ],

          claimIds: [
            "metric-creators",
          ],
        },
      ],
    },
    "must reference at least two sections",
  );

  /* Omitted evidence grounding */

  await expectReject(
    "omitted-evidence must identify omitted claim",
    {
      summary:
        "Invalid omission finding.",

      findings: [
        {
          id:
            "missing-claim-reference",

          category:
            "omitted-evidence",

          severity:
            "warning",

          message:
            "Omission finding does not identify the evidence.",

          sectionIds: [
            "results-rich",
          ],

          claimIds: [],
        },
      ],
    },
    "must reference the omitted claim",
  );

  /* Finding must be anchored */

  await expectReject(
    "Critic finding cannot be completely unanchored",
    {
      summary:
        "Invalid unanchored finding.",

      findings: [
        {
          id:
            "unanchored",

          category:
            "other",

          severity:
            "warning",

          message:
            "This finding references nothing.",

          sectionIds: [],

          claimIds: [],
        },
      ],
    },
    "must reference at least one section or claim",
  );

  /* Duplicate finding IDs */

  await expectReject(
    "duplicate Critic finding IDs are rejected",
    {
      summary:
        "Duplicate IDs.",

      findings: [
        {
          id:
            "same-finding",

          category:
            "other",

          severity:
            "warning",

          message:
            "First.",

          sectionIds: [
            "context-intro",
          ],

          claimIds: [],
        },

        {
          id:
            "same-finding",

          category:
            "other",

          severity:
            "warning",

          message:
            "Second.",

          sectionIds: [
            "results-rich",
          ],

          claimIds: [],
        },
      ],
    },
    "duplicate finding ID",
  );

  /* Unsafe finding ID */

  await expectReject(
    "Critic finding ID must be safe lower-kebab-case",
    {
      summary:
        "Unsafe ID.",

      findings: [
        {
          id:
            "Bad Finding ID",

          category:
            "other",

          severity:
            "warning",

          message:
            "Unsafe identifier.",

          sectionIds: [
            "context-intro",
          ],

          claimIds: [],
        },
      ],
    },
    "must be lower-kebab-case",
  );

  /* Invalid category */

  await expectReject(
    "invalid Critic category is rejected",
    {
      summary:
        "Invalid category.",

      findings: [
        {
          id:
            "bad-category",

          category:
            "made-up-category",

          severity:
            "warning",

          message:
            "Invalid category.",

          sectionIds: [
            "context-intro",
          ],

          claimIds: [],
        },
      ],
    },
    "invalid category",
  );

  /* Invalid severity */

  await expectReject(
    "invalid Critic severity is rejected",
    {
      summary:
        "Invalid severity.",

      findings: [
        {
          id:
            "bad-severity",

          category:
            "other",

          severity:
            "critical",

          message:
            "Invalid severity.",

          sectionIds: [
            "context-intro",
          ],

          claimIds: [],
        },
      ],
    },
    "invalid severity",
  );

  /* Unknown root field */

  await expectReject(
    "Critic cannot self-assign status or score",
    {
      summary:
        "Attempted self-scoring.",

      findings: [],

      score:
        100,

      status:
        "pass",
    },
    "unknown field",
  );

  /* Unknown finding field */

  await expectReject(
    "Critic finding cannot inject rewrite",
    {
      summary:
        "Attempted rewrite.",

      findings: [
        {
          id:
            "rewrite-attempt",

          category:
            "other",

          severity:
            "warning",

          message:
            "A finding.",

          sectionIds: [
            "context-intro",
          ],

          claimIds: [],

          replacementCopy:
            "Use this rewritten paragraph.",
        },
      ],
    },
    "unknown field",
  );

  /* Invalid JSON */

  let malformedRejected =
    false;

  try {
    await critiqueCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            "{ invalid json",
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
    "malformed Critic structured output is rejected",
    malformedRejected,
  );

  /* Empty output */

  let emptyOutputRejected =
    false;

  try {
    await critiqueCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            undefined,
          ),
      },
    );
  } catch (error) {
    emptyOutputRejected =
      error instanceof Error &&
      error.message.includes(
        "returned no structured output",
      );
  }

  check(
    "empty Critic model output is rejected",
    emptyOutputRejected,
  );

  /* No publication-ready evidence */

  const noPublicRequest =
    clone(
      REQUEST,
    );

  noPublicRequest.claims =
    noPublicRequest.claims.map(
      (claim) => ({
        ...claim,

        publishable:
          false,

        confidence:
          "low" as const,
      }),
    );

  const noPublicCapture: Capture = {
    calls: 0,
  };

  let noPublicRejected =
    false;

  try {
    await critiqueCaseStudy(
      noPublicRequest,
      {
        client:
          fakeClient(
            JSON.stringify({
              summary:
                "Should not run.",

              findings: [],
            }),
            noPublicCapture,
          ),
      },
    );
  } catch (error) {
    noPublicRejected =
      error instanceof Error &&
      error.message.includes(
        "requires at least one publication-ready evidence claim",
      );
  }

  check(
    "Critic refuses request with no publication-ready evidence",
    noPublicRejected,
  );

  check(
    "invalid evidence request fails before model call",
    noPublicCapture.calls ===
      0,
  );

  /* Duplicate section ID */

  const duplicateSectionRequest =
    clone(
      REQUEST,
    );

  duplicateSectionRequest.design
    .sections[1].id =
    "context-intro";

  const duplicateSectionCapture:
    Capture = {
      calls: 0,
    };

  let duplicateSectionRejected =
    false;

  try {
    await critiqueCaseStudy(
      duplicateSectionRequest,
      {
        client:
          fakeClient(
            JSON.stringify({
              summary:
                "Should not run.",

              findings: [],
            }),
            duplicateSectionCapture,
          ),
      },
    );
  } catch (error) {
    duplicateSectionRejected =
      error instanceof Error &&
      error.message.includes(
        "duplicate section ID",
      );
  }

  check(
    "duplicate design section IDs are rejected before critique",
    duplicateSectionRejected,
  );

  check(
    "duplicate section request fails before model call",
    duplicateSectionCapture.calls ===
      0,
  );

  /* Input immutability */

  check(
    "Semantic Critic does not mutate trusted request",
    JSON.stringify(
      REQUEST,
    ) ===
      requestBefore,
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

main().catch(
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
