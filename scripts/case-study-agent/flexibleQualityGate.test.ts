/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE QUALITY GATE TESTS
 *
 * No OpenAI.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves that the independent Flexible quality gate:
 * - passes a valid candidate;
 * - fails unsafe evidence;
 * - detects binding / compiler corruption;
 * - detects metric / quote / CTA integrity failures;
 * - prevents internal metadata leaking into CMS output;
 * - distinguishes warnings from errors.
 */

import {
  runFlexibleQualityGate,
} from "./flexibleQualityGate";

import {
  compileFlexibleCaseStudy,
} from "./compiler";

import type {
  FlexibleQualityGateRequest,
} from "./flexibleQualityGate";

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

function hasIssue(
  result: ReturnType<
    typeof runFlexibleQualityGate
  >,
  code: string,
): boolean {
  return result.issues.some(
    (issue) =>
      issue.code === code,
  );
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
      "quote-stakeholder",

    type:
      "quote",

    statement:
      "The activation gave creators a meaningful role.",

    sourceIds: [
      "source-interview",
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
];

/* ── Architecture ─────────────────────────────────── */

const ARCHITECTURE: CaseStudyDesignPlan = {
  narrativeThesis:
    "The campaign moved from constrained context to measurable creator participation.",

  storyStrategy:
    "Establish context and close with verified evidence of scale.",

  renderModeRecommendation:
    "flexible",

  chapters: [
    {
      id:
        "context",

      role:
        "context",

      headingDirection:
        "Establish the context.",

      purpose:
        "Explain the conditions surrounding the campaign.",

      evidenceClaimIds: [
        "fact-context",
        "quote-stakeholder",
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
        "Show verified scale.",

      purpose:
        "Present the strongest supported result.",

      evidenceClaimIds: [
        "metric-creators",
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
    nextProjectSlug:
      "next-project",

    progression:
      "The creator relationship continued into the next project.",

    rationale:
      "Trusted portfolio context supports continuity.",
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
    "A concise context-to-proof structure reflects the available evidence.",
};

/* ── Semantic Flexible design ─────────────────────── */

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
        "A launch operating under constraint.",

      body:
        "The campaign operated during a constrained launch period.",

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

      blockType:
        "cta",

      heading:
        "THE STORY CONTINUED.",

      body:
        "See the next project.",

      buttonLabel:
        "See the next project",

      targetProjectSlug:
        "next-project",

      evidenceClaimIds: [],
    },
  ],
};

function buildValidRequest():
  FlexibleQualityGateRequest {
  const design =
    clone(DESIGN);

  const compiled =
    compileFlexibleCaseStudy({
      design,

      allowedContinuitySlugs: [
        "next-project",
      ],
    });

  return {
    claims:
      clone(CLAIMS),

    architecture:
      clone(ARCHITECTURE),

    design,

    compiled,
  };
}

/* ── Tests ────────────────────────────────────────── */

function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible Quality Gate tests\n",
  );

  /* Valid candidate */

  const valid =
    runFlexibleQualityGate(
      buildValidRequest(),
    );

  check(
    "valid Flexible candidate passes",
    valid.status ===
      "pass",
  );

  check(
    "valid Flexible candidate is draft-ready",
    valid.draftReady ===
      true,
  );

  check(
    "valid Flexible candidate scores 100",
    valid.score ===
      100,
  );

  check(
    "valid Flexible candidate has no issues",
    valid.issues.length ===
      0,
  );

  /* Empty evidence */

  const emptyEvidence =
    buildValidRequest();

  emptyEvidence.claims =
    [];

  const emptyEvidenceResult =
    runFlexibleQualityGate(
      emptyEvidence,
    );

  check(
    "empty evidence ledger fails",
    emptyEvidenceResult.status ===
      "fail" &&
    hasIssue(
      emptyEvidenceResult,
      "FLEX_EVIDENCE_LEDGER_EMPTY",
    ),
  );

  /* Non-publishable evidence */

  const nonPublishable =
    buildValidRequest();

  nonPublishable.claims[0]
    .publishable =
    false;

  const nonPublishableResult =
    runFlexibleQualityGate(
      nonPublishable,
    );

  check(
    "non-publishable public evidence fails",
    nonPublishableResult.status ===
      "fail" &&
    hasIssue(
      nonPublishableResult,
      "FLEX_EVIDENCE_NOT_PUBLISHABLE",
    ),
  );

  /* Low confidence evidence */

  const lowConfidence =
    buildValidRequest();

  lowConfidence.claims[2]
    .confidence =
    "low";

  const lowConfidenceResult =
    runFlexibleQualityGate(
      lowConfidence,
    );

  check(
    "low-confidence public evidence fails",
    lowConfidenceResult.status ===
      "fail" &&
    hasIssue(
      lowConfidenceResult,
      "FLEX_EVIDENCE_LOW_CONFIDENCE",
    ),
  );

  /* Unknown evidence */

  const unknownEvidence =
    buildValidRequest();

  unknownEvidence.design
    .sections[0]
    .evidenceClaimIds = [
      "invented-claim",
    ];

  unknownEvidence.compiled
    .bindings[0]
    .evidenceClaimIds = [
      "invented-claim",
    ];

  const unknownEvidenceResult =
    runFlexibleQualityGate(
      unknownEvidence,
    );

  check(
    "unknown public evidence fails",
    unknownEvidenceResult.status ===
      "fail" &&
    hasIssue(
      unknownEvidenceResult,
      "FLEX_EVIDENCE_UNKNOWN",
    ),
  );

  /* Metric claim type corruption */

  const badMetricType =
    buildValidRequest();

  const metricClaim =
    badMetricType.claims.find(
      (claim) =>
        claim.id ===
        "metric-creators",
    );

  if (metricClaim) {
    metricClaim.type =
      "fact";
  }

  const badMetricResult =
    runFlexibleQualityGate(
      badMetricType,
    );

  check(
    "non-metric evidence cannot survive as metric",
    badMetricResult.status ===
      "fail" &&
    (
      hasIssue(
        badMetricResult,
        "FLEX_ARCHITECTURE_METRIC_TYPE_INVALID",
      ) ||
      hasIssue(
        badMetricResult,
        "FLEX_METRIC_TYPE_INVALID",
      )
    ),
  );

  /* Quote text corruption */

  const badQuote =
    buildValidRequest();

  const quoteSection =
    badQuote.design.sections.find(
      (section) =>
        section.blockType ===
        "quote",
    );

  if (
    quoteSection &&
    quoteSection.blockType ===
      "quote"
  ) {
    quoteSection.quote =
      "A rewritten quote that was never said.";
  }

  const badQuoteResult =
    runFlexibleQualityGate(
      badQuote,
    );

  check(
    "rewritten quote fails evidence audit",
    badQuoteResult.status ===
      "fail" &&
    hasIssue(
      badQuoteResult,
      "FLEX_QUOTE_TEXT_MISMATCH",
    ),
  );

  /* Binding corruption */

  const badBinding =
    buildValidRequest();

  badBinding.compiled
    .bindings[0]
    .evidenceClaimIds =
    [];

  const badBindingResult =
    runFlexibleQualityGate(
      badBinding,
    );

  check(
    "Designer-to-Compiler evidence binding mismatch fails",
    badBindingResult.status ===
      "fail" &&
    hasIssue(
      badBindingResult,
      "FLEX_BINDING_EVIDENCE_MISMATCH",
    ),
  );

  /* Binding count corruption */

  const missingBinding =
    buildValidRequest();

  missingBinding.compiled
    .bindings.pop();

  const missingBindingResult =
    runFlexibleQualityGate(
      missingBinding,
    );

  check(
    "missing compiler binding fails",
    missingBindingResult.status ===
      "fail" &&
    hasIssue(
      missingBindingResult,
      "FLEX_BINDING_COUNT_MISMATCH",
    ),
  );

  /* Compiled order corruption */

  const badOrder =
    buildValidRequest();

  [
    badOrder.compiled
      .cmsSections[0],
    badOrder.compiled
      .cmsSections[1],
  ] = [
    badOrder.compiled
      .cmsSections[1],
    badOrder.compiled
      .cmsSections[0],
  ];

  const badOrderResult =
    runFlexibleQualityGate(
      badOrder,
    );

  check(
    "compiled section order corruption fails",
    badOrderResult.status ===
      "fail" &&
    hasIssue(
      badOrderResult,
      "FLEX_COMPILED_ORDER_MISMATCH",
    ),
  );

  /* Planned metric omitted */

  const metricMissing =
    buildValidRequest();

  metricMissing.design
    .sections =
    metricMissing.design
      .sections.filter(
        (section) =>
          section.blockType !==
          "metrics",
      );

  metricMissing.compiled =
    compileFlexibleCaseStudy({
      design:
        metricMissing.design,

      allowedContinuitySlugs: [
        "next-project",
      ],
    });

  const metricMissingResult =
    runFlexibleQualityGate(
      metricMissing,
    );

  check(
    "Architect-planned metric cannot disappear from design",
    metricMissingResult.status ===
      "fail" &&
    hasIssue(
      metricMissingResult,
      "FLEX_PLANNED_METRIC_MISSING",
    ),
  );

  /* CTA target corruption */

  const badCtaTarget =
    buildValidRequest();

  const cta =
    badCtaTarget.design
      .sections.find(
        (section) =>
          section.blockType ===
          "cta",
      );

  if (
    cta &&
    cta.blockType ===
      "cta"
  ) {
    cta.targetProjectSlug =
      "different-project";
  }

  const badCtaTargetResult =
    runFlexibleQualityGate(
      badCtaTarget,
    );

  check(
    "Designer CTA target must match Architect approval",
    badCtaTargetResult.status ===
      "fail" &&
    hasIssue(
      badCtaTargetResult,
      "FLEX_CTA_TARGET_MISMATCH",
    ),
  );

  /* Compiled CTA corruption */

  const badCompiledCta =
    buildValidRequest();

  const compiledCta =
    badCompiledCta.compiled
      .cmsSections.find(
        (section) =>
          section.blockType ===
          "cta",
      );

  if (
    compiledCta &&
    compiledCta.blockType ===
      "cta"
  ) {
    compiledCta.buttonHref =
      "/work/invented-project";
  }

  const badCompiledCtaResult =
    runFlexibleQualityGate(
      badCompiledCta,
    );

  check(
    "compiled CTA path corruption fails",
    badCompiledCtaResult.status ===
      "fail" &&
    hasIssue(
      badCompiledCtaResult,
      "FLEX_CTA_COMPILED_PATH_INVALID",
    ),
  );

  /* Internal metadata leakage */

  const leakage =
    buildValidRequest();

  (
    leakage.compiled
      .cmsSections[0] as unknown as
      Record<string, unknown>
  ).claimId =
    "fact-context";

  const leakageResult =
    runFlexibleQualityGate(
      leakage,
    );

  check(
    "internal evidence metadata leaking into CMS fails",
    leakageResult.status ===
      "fail" &&
    hasIssue(
      leakageResult,
      "FLEX_CMS_INTERNAL_METADATA_LEAK",
    ),
  );

  /* Narrative without evidence */

  const unboundNarrative =
    buildValidRequest();

  unboundNarrative.design
    .sections[0]
    .evidenceClaimIds =
    [];

  unboundNarrative.compiled
    .bindings[0]
    .evidenceClaimIds =
    [];

  const unboundNarrativeResult =
    runFlexibleQualityGate(
      unboundNarrative,
    );

  check(
    "public narrative without evidence binding fails",
    unboundNarrativeResult.status ===
      "fail" &&
    hasIssue(
      unboundNarrativeResult,
      "FLEX_NARRATIVE_UNBOUND",
    ),
  );

  /* Architect render-mode corruption */

  const wrongMode =
    buildValidRequest();

  (
    wrongMode.architecture as unknown as {
      renderModeRecommendation:
        string;
    }
  ).renderModeRecommendation =
    "standard";

  const wrongModeResult =
    runFlexibleQualityGate(
      wrongMode,
    );

  check(
    "non-Flexible Architect mode fails",
    wrongModeResult.status ===
      "fail" &&
    hasIssue(
      wrongModeResult,
      "FLEX_ARCHITECT_MODE_INVALID",
    ),
  );

  /* Media-plan warning */

  const missingMedia =
    buildValidRequest();

  missingMedia.architecture
    .mediaPlan = [
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
  ];

  const missingMediaResult =
    runFlexibleQualityGate(
      missingMedia,
    );

  check(
    "unfulfilled media plan produces warning rather than false pass",
    missingMediaResult.status ===
      "partial" &&
    missingMediaResult.draftReady ===
      true &&
    hasIssue(
      missingMediaResult,
      "FLEX_MEDIA_PLAN_UNFULFILLED",
    ),
  );

  check(
    "warning reduces score without blocking draft readiness",
    missingMediaResult.score ===
      94,
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
