/**
 * GOLD STANDARD CASE STUDY AGENT — RUNTIME VALIDATOR TESTS
 *
 * No DB. No Payload. No network.
 *
 * Proves malformed external/AI-generated JSON fails before CMS logic.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/validatePackage.test.ts
 */

import {
  PackageValidationError,
  validateCaseStudyPackage,
} from "./validatePackage";

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

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function rejectedWith(
  value: unknown,
  fragment: string,
): boolean {
  try {
    validateCaseStudyPackage(value);
    return false;
  } catch (error) {
    return (
      error instanceof PackageValidationError &&
      error.issues.some((issue) =>
        issue.includes(fragment),
      )
    );
  }
}

const VALID: CaseStudyAgentPackage = {
  schemaVersion: "1.0",
  generatedAt: "2026-09-04T00:00:00.000Z",

  project: {
    slug: "sample-case-study",
    title: "Sample Case Study",
    renderMode: "standard",
    projectKind: "campaign",

    companySlug: "sample-company",
    brandSlug: "sample-brand",

    businessCategorySlugs: ["fmcg"],
    serviceSlugs: ["influencer-marketing"],
    solutionSlugs: ["sample-solution"],

    headline: "A strong headline.",

    challenge: {
      copy: "A real campaign challenge.",
    },

    insight: "A useful campaign insight.",

    idea: {
      statement: "The core campaign idea.",
    },

    execution: "How the campaign was executed.",
    outcome: "What the campaign achieved.",

    metrics: [
      {
        value: "500",
        label: "Creators",
        claimId: "metric-creators",
      },
    ],
  },

  evidence: {
    sources: [
      {
        id: "source-report",
        kind: "internal-document",
        title: "Final Campaign Report",
      },
    ],

    claims: [
      {
        id: "metric-creators",
        type: "metric",
        statement: "The campaign activated 500 creators.",
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "relationship-solution",
        type: "relationship",
        statement:
          "The project explicitly used the Sample Solution.",
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
    ],
  },

  /**
   * Runtime validator only requires this to be an object.
   * Writer recomputes quality and never trusts these values.
   */
  quality: {
    status: "fail",
    draftReady: false,
    score: 0,
    issues: [],
  },
};

console.log(
  "Gold Standard Case Study Agent — runtime validator tests\n",
);

/* ── 1. Valid package ──────────────────────────────────────────────── */

const accepted = validateCaseStudyPackage(
  clone(VALID),
);

check(
  "valid package is accepted",
  accepted.project.slug === "sample-case-study",
);

/* ── 2. Root shape ────────────────────────────────────────────────── */

check(
  "null root is rejected",
  rejectedWith(null, "root value must be an object"),
);

check(
  "array root is rejected",
  rejectedWith([], "root value must be an object"),
);

/* ── 3. Schema version ────────────────────────────────────────────── */

const badVersion = clone(VALID) as any;
badVersion.schemaVersion = "2.0";

check(
  "wrong schemaVersion is rejected",
  rejectedWith(
    badVersion,
    'schemaVersion must be exactly "1.0"',
  ),
);

/* ── 4. Project identity ──────────────────────────────────────────── */

const missingSlug = clone(VALID) as any;
missingSlug.project.slug = "";

check(
  "empty project slug is rejected",
  rejectedWith(
    missingSlug,
    "project.slug is required",
  ),
);

const missingTitle = clone(VALID) as any;
delete missingTitle.project.title;

check(
  "missing project title is rejected",
  rejectedWith(
    missingTitle,
    "project.title is required",
  ),
);

/* ── 5. Render-mode safety ────────────────────────────────────────── */

const flagship = clone(VALID) as any;
flagship.project.renderMode = "flagship";

check(
  "flagship render mode is rejected",
  rejectedWith(
    flagship,
    'project.renderMode must be exactly "standard"',
  ),
);

const flexible = clone(VALID) as any;
flexible.project.renderMode = "flexible";

check(
  "flexible render mode is rejected in Agent v1",
  rejectedWith(
    flexible,
    'project.renderMode must be exactly "standard"',
  ),
);

/* ── 6. Project kind enum ─────────────────────────────────────────── */

const badKind = clone(VALID) as any;
badKind.project.projectKind = "television-show";

check(
  "invalid projectKind is rejected",
  rejectedWith(
    badKind,
    "project.projectKind must be one of",
  ),
);

/* ── 7. Relationship-array shape ──────────────────────────────────── */

const badServices = clone(VALID) as any;
badServices.project.serviceSlugs =
  "influencer-marketing";

check(
  "non-array serviceSlugs is rejected",
  rejectedWith(
    badServices,
    "project.serviceSlugs must be an array",
  ),
);

const blankSolution = clone(VALID) as any;
blankSolution.project.solutionSlugs = [""];

check(
  "blank relationship slug is rejected",
  rejectedWith(
    blankSolution,
    "project.solutionSlugs[0] must be a non-empty string",
  ),
);

/* ── 8. Metric shape ──────────────────────────────────────────────── */

const badMetric = clone(VALID) as any;
badMetric.project.metrics[0].value = 500;

check(
  "numeric metric value is rejected",
  rejectedWith(
    badMetric,
    "project.metrics[0].value is required",
  ),
);

const badClaimId = clone(VALID) as any;
badClaimId.project.metrics[0].claimId = 123;

check(
  "non-string metric claimId is rejected",
  rejectedWith(
    badClaimId,
    "project.metrics[0].claimId must be a string",
  ),
);

/* ── 9. Evidence source validation ────────────────────────────────── */

const badSourceKind = clone(VALID) as any;
badSourceKind.evidence.sources[0].kind =
  "random-internet-thing";

check(
  "unknown evidence source kind is rejected",
  rejectedWith(
    badSourceKind,
    "evidence.sources[0].kind must be one of",
  ),
);

const missingSourceTitle = clone(VALID) as any;
missingSourceTitle.evidence.sources[0].title = "";

check(
  "source without title is rejected",
  rejectedWith(
    missingSourceTitle,
    "evidence.sources[0].title is required",
  ),
);

/* ── 10. Evidence claim validation ────────────────────────────────── */

const badClaimType = clone(VALID) as any;
badClaimType.evidence.claims[0].type =
  "made-up-claim";

check(
  "unknown claim type is rejected",
  rejectedWith(
    badClaimType,
    "evidence.claims[0].type must be one of",
  ),
);

const badConfidence = clone(VALID) as any;
badConfidence.evidence.claims[0].confidence =
  "absolutely-certain";

check(
  "unknown confidence value is rejected",
  rejectedWith(
    badConfidence,
    "evidence.claims[0].confidence must be one of",
  ),
);

const badPublishable = clone(VALID) as any;
badPublishable.evidence.claims[0].publishable =
  "yes";

check(
  "non-boolean publishable value is rejected",
  rejectedWith(
    badPublishable,
    "evidence.claims[0].publishable must be boolean",
  ),
);

const badSourceIds = clone(VALID) as any;
badSourceIds.evidence.claims[0].sourceIds =
  "source-report";

check(
  "non-array claim sourceIds is rejected",
  rejectedWith(
    badSourceIds,
    "evidence.claims[0].sourceIds must be an array",
  ),
);

/* ── 11. Quality object boundary ──────────────────────────────────── */

const missingQuality = clone(VALID) as any;
delete missingQuality.quality;

check(
  "missing quality object is rejected",
  rejectedWith(
    missingQuality,
    "quality must be an object",
  ),
);


/* ── 12. Narrative binding runtime validation ─────────────────────── */

const badNarrativeBindingsShape = clone(VALID) as any;

badNarrativeBindingsShape.evidence.narrativeBindings =
  "challenge";

check(
  "non-array narrativeBindings is rejected",
  rejectedWith(
    badNarrativeBindingsShape,
    "evidence.narrativeBindings must be an array",
  ),
);

const badNarrativeField = clone(VALID) as any;

badNarrativeField.evidence.narrativeBindings = [
  {
    field: "made-up-section",
    claimIds: ["claim-1"],
  },
];

check(
  "unknown narrative field is rejected",
  rejectedWith(
    badNarrativeField,
    "evidence.narrativeBindings[0].field must be one of",
  ),
);

const badNarrativeClaimIds = clone(VALID) as any;

badNarrativeClaimIds.evidence.narrativeBindings = [
  {
    field: "challenge",
    claimIds: "claim-1",
  },
];

check(
  "non-array narrative claimIds is rejected",
  rejectedWith(
    badNarrativeClaimIds,
    "evidence.narrativeBindings[0].claimIds must be an array",
  ),
);

const blankNarrativeClaimId = clone(VALID) as any;

blankNarrativeClaimId.evidence.narrativeBindings = [
  {
    field: "challenge",
    claimIds: [""],
  },
];

check(
  "blank narrative claimId is rejected",
  rejectedWith(
    blankNarrativeClaimId,
    "evidence.narrativeBindings[0].claimIds[0] must be a non-empty string",
  ),
);

/* ── Result ───────────────────────────────────────────────────────── */

console.log(
  `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
);

process.exit(fail === 0 ? 0 : 1);
