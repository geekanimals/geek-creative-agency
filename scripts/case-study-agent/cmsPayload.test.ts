/**
 * GOLD STANDARD CASE STUDY AGENT — CMS SANITIZER TESTS
 *
 * No DB. No Payload. No network.
 *
 * Proves:
 * - evidence never enters CMS payload;
 * - claimId never enters CMS metrics;
 * - confidence never enters CMS payload;
 * - quality metadata never enters CMS payload;
 * - relationship slugs stay outside public-field payload;
 * - publication-safe fields survive sanitization.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/cmsPayload.test.ts
 */

import {
  relationshipSlugs,
  sanitizeProjectForCms,
} from "./cmsPayload";

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

const pkg: CaseStudyAgentPackage = {
  schemaVersion: "1.0",
  generatedAt: "2026-09-04T00:00:00.000Z",

  project: {
    slug: "  sample-case-study  ",
    title: "  Sample Case Study  ",

    client: "  Sample Client  ",
    year: 2026,

    shortSummary: "  Short summary.  ",
    cardSummary: "  Card summary.  ",

    renderMode: "standard",
    projectKind: "campaign",

    companySlug: "sample-company",
    brandSlug: "sample-brand",

    businessCategorySlugs: ["fmcg"],
    serviceSlugs: ["influencer-marketing"],
    solutionSlugs: ["irm"],

    headline: "  A strong headline.  ",

    challenge: {
      question: "  What was the challenge?  ",
      copy: "  The challenge copy.  ",
    },

    insight: "  The insight.  ",

    idea: {
      statement: "  The idea.  ",
      copy: "  The idea explained.  ",
    },

    execution: "  Execution details.  ",
    outcome: "  Outcome details.  ",

    quote: {
      text: "  A verified quote.  ",
      attribution: "  Client stakeholder  ",
    },

    metrics: [
      {
        value: " 500 ",
        label: " Creators ",
        suffix: "+",
        claimId: "metric-creators",
      },
    ],

    faqs: [
      {
        question: "  What did Geek do?  ",
        answer: "  Geek led the campaign.  ",
      },
    ],

    searchStrategy: {
      primaryKeyword: "sample campaign",
      searchIntent: "branded",
    },

    seo: {
      metaTitle: "  Sample Case Study | Geek  ",
      metaDescription: "  Sample SEO description.  ",
      noindex: true,
    },
  },

  evidence: {
    sources: [
      {
        id: "source-report",
        kind: "internal-document",
        title: "Campaign Report",
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
        id: "relationship-irm",
        type: "relationship",
        statement: "The project explicitly used IRM.",
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
    ],
  },

  quality: {
    status: "pass",
    draftReady: true,
    score: 100,
    issues: [],
  },
};

console.log("Gold Standard Case Study Agent — CMS sanitizer tests\n");

const cms = sanitizeProjectForCms(pkg);
const relationships = relationshipSlugs(pkg);

const serialized = JSON.stringify(cms);

/* ── Public fields survive ───────────────────────────────────────────── */

check(
  "title survives and is trimmed",
  cms.title === "Sample Case Study",
);

check(
  "slug survives and is trimmed",
  cms.slug === "sample-case-study",
);

check(
  "headline survives and is trimmed",
  cms.headline === "A strong headline.",
);

check(
  "challenge survives",
  cms.challenge?.copy === "The challenge copy.",
);

check(
  "execution survives",
  cms.execution === "Execution details.",
);

check(
  "outcome survives",
  cms.outcome === "Outcome details.",
);

/* ── Metric evidence metadata is stripped ───────────────────────────── */

check(
  "metric survives",
  cms.metrics?.[0]?.value === "500",
);

check(
  "metric label is trimmed",
  cms.metrics?.[0]?.label === "Creators",
);

check(
  "claimId is stripped from CMS metric",
  !("claimId" in (cms.metrics?.[0] ?? {})),
);

/* ── Agent-only package data cannot leak ────────────────────────────── */

check(
  "evidence is absent from CMS payload",
  !serialized.includes('"evidence"'),
);

check(
  "confidence is absent from CMS payload",
  !serialized.includes('"confidence"'),
);

check(
  "publishable is absent from CMS payload",
  !serialized.includes('"publishable"'),
);

check(
  "quality is absent from CMS payload",
  !serialized.includes('"quality"'),
);

check(
  "generatedAt is absent from CMS payload",
  !serialized.includes('"generatedAt"'),
);

check(
  "schemaVersion is absent from CMS payload",
  !serialized.includes('"schemaVersion"'),
);

check(
  "claimId is absent everywhere in CMS payload",
  !serialized.includes('"claimId"'),
);

/* ── Relationship slugs stay outside CMS public fields ──────────────── */

check(
  "companySlug is absent from sanitized field payload",
  !serialized.includes('"companySlug"'),
);

check(
  "brandSlug is absent from sanitized field payload",
  !serialized.includes('"brandSlug"'),
);

check(
  "solutionSlugs are absent from sanitized field payload",
  !serialized.includes('"solutionSlugs"'),
);

check(
  "company relationship is preserved separately",
  relationships.companySlug === "sample-company",
);

check(
  "brand relationship is preserved separately",
  relationships.brandSlug === "sample-brand",
);

check(
  "service relationships are preserved separately",
  relationships.serviceSlugs.join(",") === "influencer-marketing",
);

check(
  "solution relationships are preserved separately",
  relationships.solutionSlugs.join(",") === "irm",
);

/* ── Result ──────────────────────────────────────────────────────────── */

console.log(
  `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
);

process.exit(fail === 0 ? 0 : 1);
