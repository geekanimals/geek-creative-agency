/**
 * GOLD STANDARD CASE STUDY AGENT — DRAFT WRITER TESTS
 *
 * No DB. No real Payload. No network.
 *
 * Proves:
 * - valid case studies create Drafts only;
 * - existing case studies update Drafts only;
 * - evidence / claimIds never enter CMS writes;
 * - failed quality is rejected before any write;
 * - missing relationship entities fail closed;
 * - Brand → Company mismatch fails closed;
 * - relationships resolve by slug to IDs.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/writer.test.ts
 */

import { writeCaseStudyDraft } from "./writer";
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

type Doc = {
  id: number;
  slug: string;
  company?: number;
};

type Call = {
  method: "find" | "create" | "update";
  args: any;
};

class FakePayload {
  calls: Call[] = [];

  docs: Record<string, Doc[]> = {
    companies: [
      { id: 10, slug: "sample-company" },
      { id: 11, slug: "other-company" },
    ],

    brands: [
      {
        id: 20,
        slug: "sample-brand",
        company: 10,
      },
      {
        id: 21,
        slug: "wrong-brand",
        company: 11,
      },
    ],

    "business-categories": [
      { id: 30, slug: "fmcg" },
    ],

    services: [
      { id: 40, slug: "influencer-marketing" },
    ],

    solutions: [
      { id: 50, slug: "sample-solution" },
    ],

    projects: [],
  };

  async find(args: any) {
    this.calls.push({
      method: "find",
      args,
    });

    const collection = String(args.collection);
    const slug = args?.where?.slug?.equals;

    const docs = (this.docs[collection] ?? []).filter(
      (doc) => doc.slug === slug,
    );

    return {
      docs,
      totalDocs: docs.length,
    };
  }

  async create(args: any) {
    this.calls.push({
      method: "create",
      args,
    });

    const created = {
      id: 999,
      ...args.data,
    };

    return created;
  }

  async update(args: any) {
    this.calls.push({
      method: "update",
      args,
    });

    return {
      id: args.id,
      ...args.data,
    };
  }
}

const VALID: CaseStudyAgentPackage = {
  schemaVersion: "1.0",
  generatedAt: "2026-09-04T00:00:00.000Z",

  project: {
    slug: "sample-case-study",
    title: "Sample Case Study",
    client: "Sample Client",
    year: 2026,

    shortSummary:
      "A creator-led campaign built around participation.",

    cardSummary:
      "A creator-led campaign built for participation.",

    renderMode: "standard",
    projectKind: "campaign",

    companySlug: "sample-company",
    brandSlug: "sample-brand",

    businessCategorySlugs: ["fmcg"],
    serviceSlugs: ["influencer-marketing"],
    solutionSlugs: ["sample-solution"],

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
      statement: "Turn the audience into part of the launch.",
      copy:
        "Creators were given an active role in the campaign structure.",
    },

    execution:
      "Geek developed the creator structure, campaign mechanics and activation workflow.",

    outcome:
      "The campaign generated measurable participation and a repeatable activation model.",

    quote: {
      text: "The campaign gave creators a real role in the launch.",
      attribution: "Campaign stakeholder",
    },

    metrics: [
      {
        value: "500",
        label: "Creators",
        claimId: "metric-creators",
      },
    ],

    seo: {
      metaTitle: "Sample Case Study | Geek",
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
      },
      {
        id: "source-interview",
        kind: "user-provided",
        title: "Campaign Stakeholder Interview",
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
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-challenge",
        type: "narrative",
        statement:
          "The launch needed to compete for attention in a crowded category.",
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-insight",
        type: "narrative",
        statement:
          "Participation can create stronger memory than passive exposure.",
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-idea",
        type: "narrative",
        statement:
          "Creators were given an active role in the campaign structure.",
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-execution",
        type: "fact",
        statement:
          "Geek developed the creator structure, campaign mechanics and activation workflow.",
        sourceIds: ["source-report"],
        confidence: "high",
        publishable: true,
      },
      {
        id: "narrative-outcome",
        type: "narrative",
        statement:
          "The campaign generated measurable participation and a repeatable activation model.",
        sourceIds: ["source-report"],
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

  /**
   * Deliberately wrong/stale.
   * Writer must ignore this and recompute quality itself.
   */
  quality: {
    status: "fail",
    draftReady: false,
    score: 0,
    issues: [],
  },
};

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Draft writer tests\n",
  );

  /* ── 1. Valid package creates Draft only ─────────────────────────── */

  const payload = new FakePayload();

  const result = await writeCaseStudyDraft(
    payload as never,
    clone(VALID),
  );

  check(
    "valid package creates project",
    result.action === "created",
  );

  check(
    "writer reports draft status",
    result.status === "draft",
  );

  check(
    "writer recomputes quality instead of trusting pkg.quality",
    result.qualityScore === 100,
  );

  const createCall = payload.calls.find(
    (call) => call.method === "create",
  );

  check(
    "create call exists",
    Boolean(createCall),
  );

  check(
    "new project explicitly writes _status=draft",
    createCall?.args?.data?._status === "draft",
  );

  check(
    "writer never writes _status=published",
    !payload.calls.some(
      (call) =>
        call.args?.data?._status === "published",
    ),
  );

  /* ── 2. Relationships resolve to IDs ─────────────────────────────── */

  check(
    "company slug resolves to company ID",
    createCall?.args?.data?.company === 10,
  );

  check(
    "brand slug resolves to brand ID",
    createCall?.args?.data?.brand === 20,
  );

  check(
    "industry slug resolves to ID",
    createCall?.args?.data?.businessCategories?.[0] === 30,
  );

  check(
    "service slug resolves to ID",
    createCall?.args?.data?.services?.[0] === 40,
  );

  check(
    "solution slug resolves to ID",
    createCall?.args?.data?.solutions?.[0] === 50,
  );

  /* ── 3. Agent-only evidence cannot leak ──────────────────────────── */

  const writtenJson = JSON.stringify(
    createCall?.args?.data ?? {},
  );

  check(
    "evidence does not enter CMS write",
    !writtenJson.includes('"evidence"'),
  );

  check(
    "claimId does not enter CMS write",
    !writtenJson.includes('"claimId"'),
  );

  check(
    "confidence does not enter CMS write",
    !writtenJson.includes('"confidence"'),
  );

  check(
    "quality metadata does not enter CMS write",
    !writtenJson.includes('"quality"'),
  );

  check(
    "generatedAt does not enter CMS write",
    !writtenJson.includes('"generatedAt"'),
  );

  /* ── 4. Existing Project updates Draft only ─────────────────────── */

  const updatePayload = new FakePayload();

  updatePayload.docs.projects.push({
    id: 77,
    slug: "sample-case-study",
  });

  const updateResult = await writeCaseStudyDraft(
    updatePayload as never,
    clone(VALID),
  );

  const updateCall = updatePayload.calls.find(
    (call) => call.method === "update",
  );

  check(
    "existing project is updated",
    updateResult.action === "updated",
  );

  check(
    "existing project ID is preserved",
    updateResult.id === 77,
  );

  check(
    "update explicitly uses draft:true",
    updateCall?.args?.draft === true,
  );

  check(
    "update has no publish override",
    updateCall?.args?.data?._status !== "published",
  );

  /* ── 5. Failed quality refuses all writes ────────────────────────── */

  const badQuality = clone(VALID);

  badQuality.project.metrics![0].claimId = undefined;

  const badPayload = new FakePayload();

  let qualityRejected = false;

  try {
    await writeCaseStudyDraft(
      badPayload as never,
      badQuality,
    );
  } catch (error) {
    qualityRejected =
      error instanceof Error &&
      error.message.includes(
        "quality gate refused CMS write",
      );
  }

  check(
    "failed quality package is rejected",
    qualityRejected,
  );

  check(
    "failed quality performs no create",
    !badPayload.calls.some(
      (call) => call.method === "create",
    ),
  );

  check(
    "failed quality performs no update",
    !badPayload.calls.some(
      (call) => call.method === "update",
    ),
  );

  /* ── 6. Missing relationship fails closed ───────────────────────── */

  const missingRelationship = clone(VALID);

  missingRelationship.project.serviceSlugs = [
    "service-that-does-not-exist",
  ];

  const missingPayload = new FakePayload();

  let missingRejected = false;

  try {
    await writeCaseStudyDraft(
      missingPayload as never,
      missingRelationship,
    );
  } catch (error) {
    missingRejected =
      error instanceof Error &&
      error.message.includes(
        "cannot resolve services/service-that-does-not-exist",
      );
  }

  check(
    "missing relationship entity is rejected",
    missingRejected,
  );

  check(
    "missing relationship performs no write",
    !missingPayload.calls.some(
      (call) =>
        call.method === "create" ||
        call.method === "update",
    ),
  );

  /* ── 7. Brand / Company mismatch fails closed ───────────────────── */

  const mismatch = clone(VALID);

  mismatch.project.brandSlug = "wrong-brand";

  const mismatchPayload = new FakePayload();

  let mismatchRejected = false;

  try {
    await writeCaseStudyDraft(
      mismatchPayload as never,
      mismatch,
    );
  } catch (error) {
    mismatchRejected =
      error instanceof Error &&
      error.message.includes(
        "relationship mismatch",
      );
  }

  check(
    "Brand → Company mismatch is rejected",
    mismatchRejected,
  );

  check(
    "Brand → Company mismatch performs no write",
    !mismatchPayload.calls.some(
      (call) =>
        call.method === "create" ||
        call.method === "update",
    ),
  );

  /* ── Result ──────────────────────────────────────────────────────── */

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(fail === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
