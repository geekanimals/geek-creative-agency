/**
 * GOLD STANDARD CASE STUDY AGENT — PACKAGE BUILDER TESTS
 *
 * No DB. No Payload. No network.
 *
 * Proves:
 * - Structured Output null placeholders are removed;
 * - model-supplied root metadata is ignored;
 * - schemaVersion is system-controlled;
 * - generatedAt is system-controlled;
 * - quality is recomputed by our code;
 * - valid evidence-backed output passes;
 * - unsupported narrative output remains FAIL;
 * - malformed model output is rejected.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/buildPackage.test.ts
 */

import {
  buildCaseStudyPackage,
  removeNullPlaceholders,
} from "./buildPackage";

import {
  PackageValidationError,
} from "./validatePackage";

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

function clone<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
}

const MODEL_OUTPUT = {
  project: {
    slug: "sample-case-study",
    title: "Sample Case Study",

    client: "Sample Client",
    year: 2026,
    location: null,

    shortSummary:
      "A creator-led campaign built around participation.",

    cardSummary:
      "A creator-led campaign built for participation.",

    renderMode: "standard",
    projectKind: "campaign",

    heroLegacySrc: null,

    companySlug: "sample-company",
    brandSlug: "sample-brand",

    businessCategorySlugs: [
      "fmcg",
    ],

    serviceSlugs: [
      "influencer-marketing",
    ],

    solutionSlugs: [
      "sample-solution",
    ],

    headline:
      "Turning a launch into something people wanted to join.",

    challenge: {
      question:
        "How do you make another launch feel worth participating in?",
      copy:
        "The launch needed to compete for attention in a crowded category.",
    },

    insight:
      "Participation can create stronger memory than passive exposure.",

    idea: {
      statement:
        "Turn the audience into part of the launch.",
      copy:
        "Creators were given an active role in the campaign structure.",
    },

    execution:
      "Geek developed the creator structure, campaign mechanics and activation workflow.",

    outcome:
      "The campaign generated measurable participation and a repeatable activation model.",

    quote: null,

    metrics: [
      {
        value: "500",
        label: "Creators",
        prefix: null,
        suffix: null,
        note: null,
        claimId: "metric-creators",
      },
    ],

    seo: {
      metaTitle:
        "Sample Case Study | Geek",

      metaDescription:
        "How Geek built a creator-led participation campaign.",

      noindex: true,
    },
  },

  evidence: {
    sources: [
      {
        id: "source-report",
        kind: "internal-document",
        title: "Final Campaign Report",

        url: null,
        publisher: null,
        publicationDate: null,
        capturedAt: null,
        notes:
          "Client-approved campaign closure report.",
      },
    ],

    claims: [
      {
        id: "narrative-challenge",
        type: "narrative",

        statement:
          "The launch competed for attention in a crowded category.",

        sourceIds: [
          "source-report",
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-insight",
        type: "narrative",

        statement:
          "Participation was identified as more valuable than passive exposure for this campaign.",

        sourceIds: [
          "source-report",
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-idea",
        type: "narrative",

        statement:
          "The campaign idea gave the audience an active role in the launch.",

        sourceIds: [
          "source-report",
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-execution",
        type: "fact",

        statement:
          "Geek developed the creator structure, campaign mechanics and activation workflow.",

        sourceIds: [
          "source-report",
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-outcome",
        type: "narrative",

        statement:
          "The campaign produced measurable participation and a reusable activation model.",

        sourceIds: [
          "source-report",
        ],

        confidence: "high",
        publishable: true,
        note: null,
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
        note: null,
      },

      {
        id: "relationship-solution",
        type: "relationship",

        statement:
          "The project explicitly used the Sample Solution methodology.",

        sourceIds: [
          "source-report",
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },
    ],

    narrativeBindings: [
      {
        field: "challenge",
        claimIds: [
          "narrative-challenge",
        ],
      },

      {
        field: "insight",
        claimIds: [
          "narrative-insight",
        ],
      },

      {
        field: "idea",
        claimIds: [
          "narrative-idea",
        ],
      },

      {
        field: "execution",
        claimIds: [
          "narrative-execution",
        ],
      },

      {
        field: "outcome",
        claimIds: [
          "narrative-outcome",
        ],
      },
    ],
  },

  /**
   * Deliberate attempted model injection.
   * buildCaseStudyPackage must ignore these roots.
   */
  schemaVersion: "999",
  generatedAt: "1900-01-01T00:00:00.000Z",

  quality: {
    status: "pass",
    draftReady: true,
    score: 999,
    issues: [],
  },
};

console.log(
  "Gold Standard Case Study Agent — package builder tests\n",
);

/* ── 1. Null normalization ─────────────────────────────────────────── */

const normalized =
  removeNullPlaceholders({
    a: null,
    b: "keep",
    c: {
      x: null,
      y: false,
      z: 0,
    },
    d: [
      null,
      "keep",
      {
        q: null,
        r: "yes",
      },
    ],
  }) as any;

check(
  "null object property is removed",
  !("a" in normalized),
);

check(
  "ordinary string survives",
  normalized.b === "keep",
);

check(
  "nested null property is removed",
  !("x" in normalized.c),
);

check(
  "false survives normalization",
  normalized.c.y === false,
);

check(
  "zero survives normalization",
  normalized.c.z === 0,
);

check(
  "null array entry is removed",
  normalized.d.length === 2,
);

check(
  "nested array object is normalized",
  !("q" in normalized.d[1]),
);

/* ── 2. Valid model output builds trusted package ─────────────────── */

const built =
  buildCaseStudyPackage(
    clone(MODEL_OUTPUT),
    {
      generatedAt:
        "2026-09-05T00:00:00.000Z",
    },
  );

check(
  "trusted schemaVersion is 1.0",
  built.package.schemaVersion === "1.0",
);

check(
  "trusted generatedAt overrides model value",
  built.package.generatedAt ===
    "2026-09-05T00:00:00.000Z",
);

check(
  "model-supplied quality score is ignored",
  built.package.quality.score !== 999,
);

check(
  "quality is recomputed as PASS",
  built.package.quality.status === "pass",
);

check(
  "trusted package is draft-ready",
  built.package.quality.draftReady === true,
);

check(
  "trusted quality score is 100",
  built.package.quality.score === 100,
);

/* ── 3. Null placeholders are absent internally ───────────────────── */

const pkgJson =
  JSON.stringify(built.package);

check(
  "null placeholders are absent from trusted package",
  !pkgJson.includes(":null"),
);

check(
  "null quote becomes absent optional field",
  built.package.project.quote === undefined,
);

check(
  "null metric suffix becomes absent",
  built.package.project.metrics?.[0]
    ?.suffix === undefined,
);

/* ── 4. Unsupported AI narrative cannot self-approve ──────────────── */

const unsupportedNarrative =
  clone(MODEL_OUTPUT);

unsupportedNarrative.evidence.narrativeBindings =
  unsupportedNarrative.evidence.narrativeBindings.filter(
    (binding) =>
      binding.field !== "insight",
  );

unsupportedNarrative.quality = {
  status: "pass",
  draftReady: true,
  score: 100,
  issues: [],
};

const unsupportedBuilt =
  buildCaseStudyPackage(
    unsupportedNarrative,
    {
      generatedAt:
        "2026-09-05T00:00:00.000Z",
    },
  );

check(
  "unsupported model narrative becomes FAIL",
  unsupportedBuilt.quality.status === "fail",
);

check(
  "unsupported model narrative is not draft-ready",
  unsupportedBuilt.quality.draftReady === false,
);

check(
  "missing narrative binding issue survives trusted gate",
  unsupportedBuilt.quality.issues.some(
    (issue) =>
      issue.code ===
      "NARRATIVE_EVIDENCE_BINDING_MISSING",
  ),
);

/* ── 5. Malformed model output is rejected ────────────────────────── */

let malformedRejected = false;

try {
  buildCaseStudyPackage({
    project: {
      title: "Missing everything else",
    },

    evidence: {
      sources: [],
      claims: [],
      narrativeBindings: [],
    },
  });
} catch (error) {
  malformedRejected =
    error instanceof PackageValidationError;
}

check(
  "malformed model output is rejected",
  malformedRejected,
);

/* ── Result ───────────────────────────────────────────────────────── */

console.log(
  `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
);

process.exit(
  fail === 0 ? 0 : 1,
);
