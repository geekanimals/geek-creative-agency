/**
 * GOLD STANDARD CASE STUDY AGENT — QUALITY GATE TESTS
 *
 * No DB. No Payload. No network.
 *
 * Proves that:
 * - a properly evidenced Standard case study can pass;
 * - invented / unsupported metrics fail;
 * - low-confidence metrics fail;
 * - unsupported quotes fail;
 * - broken Company → Brand relationships fail;
 * - inferred / duplicate relationships are rejected;
 * - protected flagships cannot be touched;
 * - incomplete narrative cannot become draft-ready.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/qualityGate.test.ts
 */

import { runQualityGate } from "./qualityGate";
import type { CaseStudyAgentPackage } from "./types";

let pass = 0;
let fail = 0;

function check(name: string, condition: boolean) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    pass++;
  } else {
    console.log(`  ✗ ${name}`);
    fail++;
  }
}

function hasIssue(
  result: ReturnType<typeof runQualityGate>,
  code: string,
): boolean {
  return result.issues.some((issue) => issue.code === code);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const VALID: CaseStudyAgentPackage = {
  schemaVersion: "1.0",
  generatedAt: "2026-09-04T00:00:00.000Z",

  project: {
    slug: "sample-brand-launch",
    title: "Sample Brand Launch",
    client: "Sample Brand",
    year: 2026,

    shortSummary:
      "A creator-led launch designed to turn product discovery into participation.",

    cardSummary:
      "A creator-led launch built around participation, not passive reach.",

    renderMode: "standard",
    projectKind: "campaign",

    companySlug: "sample-company",
    brandSlug: "sample-brand",

    businessCategorySlugs: ["fmcg"],
    serviceSlugs: ["influencer-marketing"],
    solutionSlugs: ["sample-solution"],

    headline:
      "Turning a product launch into something people wanted to join.",

    challenge: {
      question: "How do you make another launch feel worth participating in?",
      copy:
        "The launch needed to compete for attention in a crowded category without relying on passive impressions alone.",
    },

    insight:
      "Participation creates stronger cultural memory than one-way exposure when the audience has a meaningful role in the idea.",

    idea: {
      statement: "Turn the audience into part of the launch.",
      copy:
        "The campaign was structured around creator participation, social proof and repeatable formats that could travel across communities.",
    },

    execution:
      "Geek developed the creator structure, campaign mechanics, content framework and activation workflow, then coordinated delivery across the selected creator cohort.",

    outcome:
      "The campaign generated measurable creator participation and produced a reusable activation model for future launches.",

    quote: {
      text: "The campaign gave creators a real role in the launch.",
      attribution: "Sample campaign stakeholder",
    },

    metrics: [
      {
        value: "500",
        label: "Creators",
        claimId: "metric-creators",
      },
    ],

    seo: {
      metaTitle: "Sample Brand Launch Case Study | Geek",
      metaDescription:
        "How Geek built a creator-led launch designed around participation.",
      noindex: true,
    },
  },

  evidence: {
    sources: [
      {
        id: "source-client-report",
        kind: "internal-document",
        title: "Final Campaign Report",
        notes: "Client-approved campaign closure report.",
      },
      {
        id: "source-interview",
        kind: "user-provided",
        title: "Campaign Stakeholder Interview",
      },
    ],

    claims: [
      {
        id: "narrative-challenge",
        type: "narrative",
        statement: "The launch competed for attention in a crowded category.",
        sourceIds: ["source-client-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-insight",
        type: "narrative",
        statement: "Participation was identified as more valuable than passive exposure for this campaign.",
        sourceIds: ["source-client-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-idea",
        type: "narrative",
        statement: "The campaign idea gave the audience an active role in the launch.",
        sourceIds: ["source-client-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-execution",
        type: "fact",
        statement: "Geek developed the creator structure, campaign mechanics and activation workflow.",
        sourceIds: ["source-client-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-outcome",
        type: "narrative",
        statement: "The campaign produced measurable participation and a reusable activation model.",
        sourceIds: ["source-client-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "metric-creators",
        type: "metric",
        statement: "The campaign activated 500 creators.",
        sourceIds: ["source-client-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "quote-stakeholder",
        type: "quote",
        statement:
          "The campaign gave creators a real role in the launch.",
        sourceIds: ["source-interview"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "relationship-solution",
        type: "relationship",
        statement:
          "The project explicitly used the Sample Solution methodology.",
        sourceIds: ["source-client-report"],
        confidence: "high",
        publishable: true,
      },
    ],
    narrativeBindings: [
      {
        field: "challenge",
        claimIds: ["narrative-challenge"],
      },
      {
        field: "insight",
        claimIds: ["narrative-insight"],
      },
      {
        field: "idea",
        claimIds: ["narrative-idea"],
      },
      {
        field: "execution",
        claimIds: ["narrative-execution"],
      },
      {
        field: "outcome",
        claimIds: ["narrative-outcome"],
      },
    ],
  },

  quality: {
    status: "fail",
    draftReady: false,
    score: 0,
    issues: [],
  },
};

console.log("Gold Standard Case Study Agent — quality gate tests\n");

/* ── 1. Valid package ─────────────────────────────────────────────────── */

const valid = runQualityGate(clone(VALID));

check("valid evidence-backed package passes", valid.status === "pass");
check("valid package is draft-ready", valid.draftReady === true);
check("valid package scores 100", valid.score === 100);
check("valid package has no issues", valid.issues.length === 0);

/* ── 2. Invented / unsourced metric ──────────────────────────────────── */

const unsourcedMetric = clone(VALID);
unsourcedMetric.project.metrics![0].claimId = undefined;

const unsourcedMetricResult = runQualityGate(unsourcedMetric);

check(
  "unsourced metric fails",
  unsourcedMetricResult.status === "fail",
);

check(
  "unsourced metric gets METRIC_UNSOURCED",
  hasIssue(unsourcedMetricResult, "METRIC_UNSOURCED"),
);

check(
  "unsourced metric is not draft-ready",
  unsourcedMetricResult.draftReady === false,
);

/* ── 3. Low-confidence metric ────────────────────────────────────────── */

const lowMetric = clone(VALID);

lowMetric.evidence.claims.find(
  (claim) => claim.id === "metric-creators",
)!.confidence = "low";

const lowMetricResult = runQualityGate(lowMetric);

check(
  "low-confidence public metric fails",
  lowMetricResult.status === "fail",
);

check(
  "low-confidence metric is explicitly rejected",
  hasIssue(lowMetricResult, "METRIC_CONFIDENCE_TOO_LOW"),
);

check(
  "low-confidence publishable claim is rejected",
  hasIssue(lowMetricResult, "CLAIM_LOW_CONFIDENCE_PUBLISHABLE"),
);

/* ── 4. Unsupported quote ────────────────────────────────────────────── */

const unsupportedQuote = clone(VALID);

unsupportedQuote.project.quote = {
  text: "This quote was never actually said.",
  attribution: "Someone",
};

const unsupportedQuoteResult = runQualityGate(unsupportedQuote);

check(
  "unsupported quote fails",
  unsupportedQuoteResult.status === "fail",
);

check(
  "unsupported quote gets QUOTE_UNSUPPORTED",
  hasIssue(unsupportedQuoteResult, "QUOTE_UNSUPPORTED"),
);

/* ── 5. Brand without Company ────────────────────────────────────────── */

const orphanBrand = clone(VALID);
orphanBrand.project.companySlug = undefined;

const orphanBrandResult = runQualityGate(orphanBrand);

check(
  "brand without company fails",
  orphanBrandResult.status === "fail",
);

check(
  "brand/company graph rule fires",
  hasIssue(orphanBrandResult, "RELATION_BRAND_WITHOUT_COMPANY"),
);

/* ── 6. Duplicate relationships ─────────────────────────────────────── */

const duplicateService = clone(VALID);

duplicateService.project.serviceSlugs = [
  "influencer-marketing",
  "influencer-marketing",
];

const duplicateServiceResult = runQualityGate(duplicateService);

check(
  "duplicate relationship slug fails",
  duplicateServiceResult.status === "fail",
);

check(
  "duplicate relationship is explicitly detected",
  hasIssue(duplicateServiceResult, "RELATION_DUPLICATE_SLUG"),
);

/* ── 7. Protected flagship ───────────────────────────────────────────── */

const protectedFlagship = clone(VALID);
protectedFlagship.project.slug = "the-coolest-job";

const protectedResult = runQualityGate(protectedFlagship);

check(
  "protected flagship fails",
  protectedResult.status === "fail",
);

check(
  "protected flagship guard fires",
  hasIssue(protectedResult, "PROJECT_FLAGSHIP_PROTECTED"),
);

check(
  "protected flagship is never draft-ready",
  protectedResult.draftReady === false,
);

/* ── 8. Missing narrative ────────────────────────────────────────────── */

const thinStory = clone(VALID);
thinStory.project.challenge = undefined;
thinStory.project.insight = undefined;
thinStory.project.execution = undefined;
thinStory.project.outcome = undefined;

const thinStoryResult = runQualityGate(thinStory);

check(
  "thin narrative fails",
  thinStoryResult.status === "fail",
);

check(
  "missing challenge detected",
  hasIssue(thinStoryResult, "NARRATIVE_CHALLENGE_MISSING"),
);

check(
  "missing insight detected",
  hasIssue(thinStoryResult, "NARRATIVE_INSIGHT_MISSING"),
);

check(
  "missing execution detected",
  hasIssue(thinStoryResult, "NARRATIVE_EXECUTION_MISSING"),
);

check(
  "missing outcome detected",
  hasIssue(thinStoryResult, "NARRATIVE_OUTCOME_MISSING"),
);

/* ── 9. Unsupported / inferred Solution ────────────────────────────── */

const unsupportedSolution = clone(VALID);

unsupportedSolution.project.solutionSlugs = ["irm"];

const unsupportedSolutionResult = runQualityGate(unsupportedSolution);

check(
  "unsupported inferred Solution fails",
  unsupportedSolutionResult.status === "fail",
);

check(
  "unsupported Solution gets RELATION_SOLUTION_UNSUPPORTED",
  hasIssue(
    unsupportedSolutionResult,
    "RELATION_SOLUTION_UNSUPPORTED",
  ),
);

/* ── 10. Low-confidence Solution evidence ───────────────────────────── */

const lowConfidenceSolution = clone(VALID);

lowConfidenceSolution.evidence.claims.find(
  (claim) => claim.id === "relationship-solution",
)!.confidence = "low";

const lowConfidenceSolutionResult = runQualityGate(
  lowConfidenceSolution,
);

check(
  "low-confidence Solution relationship fails",
  lowConfidenceSolutionResult.status === "fail",
);

check(
  "low-confidence Solution evidence is not accepted",
  hasIssue(
    lowConfidenceSolutionResult,
    "RELATION_SOLUTION_UNSUPPORTED",
  ),
);


/* ── 11. Missing narrative evidence binding ─────────────────────────── */

const missingNarrativeBinding = clone(VALID);

missingNarrativeBinding.evidence.narrativeBindings =
  missingNarrativeBinding.evidence.narrativeBindings!.filter(
    (binding) => binding.field !== "insight",
  );

const missingNarrativeBindingResult =
  runQualityGate(missingNarrativeBinding);

check(
  "missing narrative evidence binding fails",
  missingNarrativeBindingResult.status === "fail",
);

check(
  "missing narrative binding is explicitly detected",
  hasIssue(
    missingNarrativeBindingResult,
    "NARRATIVE_EVIDENCE_BINDING_MISSING",
  ),
);

/* ── 12. Fabricated narrative claim ─────────────────────────────────── */

const fabricatedNarrativeClaim = clone(VALID);

fabricatedNarrativeClaim.evidence.narrativeBindings!
  .find((binding) => binding.field === "challenge")!
  .claimIds = ["claim-that-does-not-exist"];

const fabricatedNarrativeClaimResult =
  runQualityGate(fabricatedNarrativeClaim);

check(
  "fabricated narrative evidence claim fails",
  fabricatedNarrativeClaimResult.status === "fail",
);

check(
  "unknown narrative claim is explicitly detected",
  hasIssue(
    fabricatedNarrativeClaimResult,
    "NARRATIVE_EVIDENCE_CLAIM_NOT_FOUND",
  ),
);

/* ── 13. Low-confidence narrative evidence ─────────────────────────── */

const lowConfidenceNarrative = clone(VALID);

lowConfidenceNarrative.evidence.claims.find(
  (claim) => claim.id === "narrative-outcome",
)!.confidence = "low";

const lowConfidenceNarrativeResult =
  runQualityGate(lowConfidenceNarrative);

check(
  "low-confidence narrative evidence fails",
  lowConfidenceNarrativeResult.status === "fail",
);

check(
  "low-confidence narrative evidence is unusable",
  hasIssue(
    lowConfidenceNarrativeResult,
    "NARRATIVE_EVIDENCE_CLAIM_UNUSABLE",
  ),
);

/* ── Result ──────────────────────────────────────────────────────────── */

console.log(
  `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
);

process.exit(fail === 0 ? 0 : 1);
