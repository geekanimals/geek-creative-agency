/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE WRITER TESTS
 *
 * Fake Payload only.
 * No DB.
 * No CMS connection.
 * No network.
 * No publishing.
 */

import {
  compileFlexibleCaseStudy,
} from "./compiler";

import {
  writeFlexibleCaseStudyDraft,
} from "./flexibleWriter";

import type {
  EvidenceClaim,
} from "./types";

import type {
  CaseStudyDesignPlan,
} from "./architect";

import type {
  FlexibleCaseStudyDesign,
} from "./designer";

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

/* ── Test helpers ─────────────────────────────────── */

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

async function expectReject(
  name: string,
  fn: () => Promise<unknown>,
  includes: string,
) {
  try {
    await fn();

    console.log(`  ✗ ${name}`);
    fail++;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    if (
      message.includes(
        includes,
      )
    ) {
      console.log(`  ✓ ${name}`);
      pass++;
    } else {
      console.log(
        `  ✗ ${name} — unexpected error: ${message}`,
      );
      fail++;
    }
  }
}

/* ── Known-good Flexible fixture ──────────────────── */

const CLAIMS:
  EvidenceClaim[] = [
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

const ARCHITECTURE:
  CaseStudyDesignPlan = {
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

const DESIGN:
  FlexibleCaseStudyDesign = {
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

function buildCandidate():
  GoldStandardCaseStudyCandidate {
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
    sourceIntake: {
      sources: [],
      excluded: [],
    },

    evidence: {
      candidates: [],

      verification: {
        claims: [],
      },

      claims:
        clone(CLAIMS),

      reconciliationAudit:
        [],

      reconciliationAuditResult: {
        status:
          "pass",

        safeToContinue:
          true,

        score:
          100,

        summary:
          "No unsafe reconciliation issues.",

        findings: [],
      },
    },

    portfolio: {
      projectHint: {
        title:
          "Sample Campaign",

        slug:
          "sample-case-study",

        client:
          "Sample Brand",

        year:
          2026,

        location:
          "India",
      },

      relationships: {
        companySlug:
          "sample-company",

        brandSlug:
          "sample-brand",

        businessCategorySlugs: [
          "fmcg",
        ],

        serviceSlugs: [
          "influencer-marketing",
        ],
      },

      solutions: [
        {
          slug:
            "sample-solution",

          evidenceClaimIds: [
            "fact-context",
          ],
        },
      ],

      continuity: {
        nextProjectSlug:
          "next-project",
      },

      allowedContinuitySlugs: [
        "next-project",
      ],
    },

    media: {
      assets: [],
      designerAssets: [],
      compilerAssets: [],
    },

    architecture:
      clone(ARCHITECTURE),

    design,

    compiled,

    /**
     * Intentionally valid initially.
     * Some tests will corrupt this to prove the writer
     * does not trust stale quality metadata.
     */
    quality: {
      status:
        "pass",

      draftReady:
        true,

      score:
        100,

      issues: [],
    },

    semanticCritic: {
      status:
        "pass",

      draftReady:
        true,

      score:
        100,

      summary:
        "No semantic issues.",

      findings: [],
    },
  } as unknown as
    GoldStandardCaseStudyCandidate;
}

/* ── Fake Payload ─────────────────────────────────── */

type Doc = {
  id:
    number;

  slug:
    string;

  company?:
    number;

  renderMode?:
    string;

  flagshipRendererKey?:
    string;
};

type Call = {
  method:
    "find" |
    "findByID" |
    "create" |
    "update";

  args:
    any;
};

class FakePayload {
  calls:
    Call[] = [];

  docs:
    Record<
      string,
      Doc[]
    > = {
    companies: [
      {
        id:
          10,

        slug:
          "sample-company",
      },

      {
        id:
          11,

        slug:
          "other-company",
      },
    ],

    brands: [
      {
        id:
          20,

        slug:
          "sample-brand",

        company:
          10,
      },

      {
        id:
          21,

        slug:
          "wrong-brand",

        company:
          11,
      },
    ],

    "business-categories": [
      {
        id:
          30,

        slug:
          "fmcg",
      },
    ],

    services: [
      {
        id:
          40,

        slug:
          "influencer-marketing",
      },
    ],

    solutions: [
      {
        id:
          50,

        slug:
          "sample-solution",
      },
    ],

    projects:
      [],
  };

  async find(
    args: any,
  ) {
    this.calls.push({
      method:
        "find",

      args,
    });

    const collection =
      String(
        args.collection,
      );

    const slug =
      args?.where
        ?.slug
        ?.equals;

    const docs =
      (
        this.docs[
          collection
        ] ?? []
      ).filter(
        (
          doc,
        ) =>
          doc.slug ===
          slug,
      );

    return {
      docs,

      totalDocs:
        docs.length,
    };
  }

  async findByID(
    args: any,
  ) {
    this.calls.push({
      method:
        "findByID",

      args,
    });

    const collection =
      String(
        args.collection,
      );

    const doc =
      (
        this.docs[
          collection
        ] ?? []
      ).find(
        (candidate) =>
          String(
            candidate.id,
          ) ===
          String(
            args.id,
          ),
      );

    if (!doc) {
      throw new Error(
        `FakePayload cannot find ${collection}/${String(args.id)}.`,
      );
    }

    return clone(
      doc,
    );
  }

  async create(
    args: any,
  ) {
    this.calls.push({
      method:
        "create",

      args,
    });

    const collection =
      String(
        args.collection,
      );

    const created = {
      id:
        999,

      ...clone(
        args.data,
      ),
    };

    if (
      !this.docs[
        collection
      ]
    ) {
      this.docs[
        collection
      ] = [];
    }

    this.docs[
      collection
    ].push(
      created,
    );

    return clone(
      created,
    );
  }

  async update(
    args: any,
  ) {
    this.calls.push({
      method:
        "update",

      args,
    });

    const collection =
      String(
        args.collection,
      );

    const docs =
      this.docs[
        collection
      ] ?? [];

    const index =
      docs.findIndex(
        (candidate) =>
          String(
            candidate.id,
          ) ===
          String(
            args.id,
          ),
      );

    if (
      index ===
      -1
    ) {
      throw new Error(
        `FakePayload cannot update missing ${collection}/${String(args.id)}.`,
      );
    }

    const updated = {
      ...docs[
        index
      ],

      ...clone(
        args.data,
      ),

      id:
        args.id,
    };

    docs[
      index
    ] =
      updated;

    return clone(
      updated,
    );
  }
}

class TamperedReadbackPayload extends FakePayload {
  constructor(
    private readonly tamper:
      (doc: any) => any,
  ) {
    super();
  }

  override async findByID(
    args: any,
  ) {
    const doc =
      await super.findByID(
        args,
      );

    return this.tamper(
      clone(doc),
    );
  }
}
const AUTH = {
  humanApproved:
    true,

  allowCmsDraftWrite:
    true,

  target:
    "staging",
} as const;

function hasMutation(
  payload:
    FakePayload,
) {
  return payload.calls.some(
    (
      call,
    ) =>
      call.method ===
        "create" ||
      call.method ===
        "update",
  );
}

/* ── Tests ────────────────────────────────────────── */

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible Writer tests\n",
  );

  /**
   * Fake staging environment for isolated writer tests.
   *
   * No real connection is made because FakePayload is used.
   */
  process.env.DATABASE_URL =
    "postgresql://test@case-study-staging.example/test";

  process.env.CASE_STUDY_AGENT_STAGING_DB_MARKER =
    "case-study-staging";

  delete process.env.VERCEL_ENV;

  /* 1. Human approval */

  const noApprovalPayload =
    new FakePayload();

  await expectReject(
    "missing human approval is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        noApprovalPayload as never,
        buildCandidate(),
        {
          ...AUTH,
          humanApproved:
            false,
        },
      ),
    "human approval",
  );

  check(
    "missing approval performs zero Payload calls",
    noApprovalPayload
      .calls
      .length ===
      0,
  );

  /* 2. Explicit write opt-in */

  const noOptInPayload =
    new FakePayload();

  await expectReject(
    "missing CMS write opt-in is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        noOptInPayload as never,
        buildCandidate(),
        {
          ...AUTH,
          allowCmsDraftWrite:
            false,
        },
      ),
    "draft-write opt-in",
  );

  check(
    "missing write opt-in performs zero Payload calls",
    noOptInPayload
      .calls
      .length ===
      0,
  );

  /* 3. Non-staging target */

  const wrongTargetPayload =
    new FakePayload();

  await expectReject(
    "non-staging target is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        wrongTargetPayload as never,
        buildCandidate(),
        {
          ...AUTH,
          target:
            "production",
        } as never,
      ),
    "outside the staging target",
  );

  check(
    "non-staging target performs zero Payload calls",
    wrongTargetPayload
      .calls
      .length ===
      0,
  );

  /* 4. PAYLOAD_DB_PUSH safety */

  const originalPush =
    process.env
      .PAYLOAD_DB_PUSH;

  process.env
    .PAYLOAD_DB_PUSH =
    "true";

  const dbPushPayload =
    new FakePayload();

  await expectReject(
    "PAYLOAD_DB_PUSH=true is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        dbPushPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "PAYLOAD_DB_PUSH=true",
  );

  check(
    "PAYLOAD_DB_PUSH refusal performs zero Payload calls",
    dbPushPayload
      .calls
      .length ===
      0,
  );

  if (
    originalPush ===
    undefined
  ) {
    delete process.env
      .PAYLOAD_DB_PUSH;
  } else {
    process.env
      .PAYLOAD_DB_PUSH =
      originalPush;
  }

  /* 4A. Missing staging identity marker */

  const savedMarker =
    process.env
      .CASE_STUDY_AGENT_STAGING_DB_MARKER;

  delete process.env
    .CASE_STUDY_AGENT_STAGING_DB_MARKER;

  const missingMarkerPayload =
    new FakePayload();

  await expectReject(
    "missing staging database marker is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        missingMarkerPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "CASE_STUDY_AGENT_STAGING_DB_MARKER",
  );

  check(
    "missing staging marker performs zero Payload calls",
    missingMarkerPayload
      .calls
      .length ===
      0,
  );

  process.env
    .CASE_STUDY_AGENT_STAGING_DB_MARKER =
    savedMarker;

  /* 4B. Database identity mismatch */

  const savedDatabaseUrl =
    process.env
      .DATABASE_URL;

  process.env
    .DATABASE_URL =
    "postgresql://test@production.example/test";

  const mismatchDatabasePayload =
    new FakePayload();

  await expectReject(
    "database not matching staging marker is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        mismatchDatabasePayload as never,
        buildCandidate(),
        AUTH,
      ),
    "does not match the approved staging database marker",
  );

  check(
    "database identity mismatch performs zero Payload calls",
    mismatchDatabasePayload
      .calls
      .length ===
      0,
  );

  process.env
    .DATABASE_URL =
    savedDatabaseUrl;

  /* 4B.1 Weak staging marker */

  process.env
    .DATABASE_URL =
    "postgresql://test@case-study-staging.example/test";

  process.env
    .CASE_STUDY_AGENT_STAGING_DB_MARKER =
    "postgres";

  const weakMarkerPayload =
    new FakePayload();

  await expectReject(
    "weak staging database marker is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        weakMarkerPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "must be a specific database identity",
  );

  check(
    "weak staging marker performs zero Payload calls",
    weakMarkerPayload
      .calls
      .length ===
      0,
  );

  /* 4B.2 Marker hidden in password */

  process.env
    .DATABASE_URL =
    "postgresql://test:case-study-staging@production.example/test";

  process.env
    .CASE_STUDY_AGENT_STAGING_DB_MARKER =
    "case-study-staging";

  const passwordMarkerPayload =
    new FakePayload();

  await expectReject(
    "staging marker hidden in database password is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        passwordMarkerPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "does not match the approved staging database marker",
  );

  check(
    "password-only staging marker performs zero Payload calls",
    passwordMarkerPayload
      .calls
      .length ===
      0,
  );

  /* 4B.3 Marker hidden in database path */

  process.env
    .DATABASE_URL =
    "postgresql://test@production.example/case-study-staging";

  const pathMarkerPayload =
    new FakePayload();

  await expectReject(
    "staging marker hidden in database path is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        pathMarkerPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "does not match the approved staging database marker",
  );

  check(
    "path-only staging marker performs zero Payload calls",
    pathMarkerPayload
      .calls
      .length ===
      0,
  );

  /* Restore valid staging identity for later tests. */

  process.env
    .DATABASE_URL =
    savedDatabaseUrl;

  process.env
    .CASE_STUDY_AGENT_STAGING_DB_MARKER =
    savedMarker;
  /* 4C. Vercel production environment */

  process.env
    .VERCEL_ENV =
    "production";

  const productionEnvironmentPayload =
    new FakePayload();

  await expectReject(
    "Vercel production environment is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        productionEnvironmentPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "Vercel production environment",
  );

  check(
    "production environment performs zero Payload calls",
    productionEnvironmentPayload
      .calls
      .length ===
      0,
  );

  delete process.env
    .VERCEL_ENV;

  /* 5. Recompute quality instead of trusting stored metadata */

  const staleQuality =
    buildCandidate();

  staleQuality.quality = {
    status:
      "fail",

    draftReady:
      false,

    score:
      0,

    issues: [],
  };

  const stalePayload =
    new FakePayload();

  const staleResult =
    await writeFlexibleCaseStudyDraft(
      stalePayload as never,
      staleQuality,
      AUTH,
    );

  check(
    "writer ignores stale candidate quality and recomputes clean 100",
    staleResult
      .qualityScore ===
      100 &&
    staleResult.action ===
      "created",
  );

  /* 6. Genuine write-time quality corruption */

  const corrupted =
    buildCandidate();

  corrupted
    .evidence
    .claims[0]
    .publishable =
    false;

  /**
   * Deliberately leave candidate.quality as PASS.
   * Writer must catch the actual corruption itself.
   */
  const corruptedPayload =
    new FakePayload();

  await expectReject(
    "writer catches evidence corruption despite stale PASS metadata",
    () =>
      writeFlexibleCaseStudyDraft(
        corruptedPayload as never,
        corrupted,
        AUTH,
      ),
    "quality gate refused CMS write",
  );

  check(
    "failed recomputed quality performs no Payload calls",
    corruptedPayload
      .calls
      .length ===
      0,
  );

  /* 7. Reconciliation Auditor */

  const unsafeReconciliation =
    buildCandidate();

  unsafeReconciliation
    .evidence
    .reconciliationAuditResult
    .safeToContinue =
    false;

  const unsafeReconciliationPayload =
    new FakePayload();

  await expectReject(
    "unsafe reconciliation is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        unsafeReconciliationPayload as never,
        unsafeReconciliation,
        AUTH,
      ),
    "Reconciliation Auditor",
  );

  check(
    "unsafe reconciliation performs no Payload mutation",
    !hasMutation(
      unsafeReconciliationPayload,
    ),
  );

  const reconciliationError =
    buildCandidate();

  (
    reconciliationError
      .evidence
      .reconciliationAuditResult
      .findings as any[]
  ).push({
    id:
      "unsafe-publication-1",

    category:
      "unsafe-publication",

    severity:
      "error",

    message:
      "Unsafe publication.",
  });

  const reconciliationErrorPayload =
    new FakePayload();

  await expectReject(
    "Reconciliation Auditor error finding is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        reconciliationErrorPayload as never,
        reconciliationError,
        AUTH,
      ),
    "error finding",
  );

  check(
    "Reconciliation Auditor error performs no Payload mutation",
    !hasMutation(
      reconciliationErrorPayload,
    ),
  );

  /* 8. Semantic Critic */

  const badCritic =
    buildCandidate();

  badCritic
    .semanticCritic
    .draftReady =
    false;

  const badCriticPayload =
    new FakePayload();

  await expectReject(
    "non-draft-ready Semantic Critic is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        badCriticPayload as never,
        badCritic,
        AUTH,
      ),
    "Semantic Critic",
  );

  check(
    "Semantic Critic refusal performs no Payload mutation",
    !hasMutation(
      badCriticPayload,
    ),
  );

  const criticError =
    buildCandidate();

  (
    criticError
      .semanticCritic
      .findings as any[]
  ).push({
    id:
      "semantic-error-1",

    category:
      "evidence-overreach",

    severity:
      "error",

    message:
      "Evidence overreach.",
  });

  const criticErrorPayload =
    new FakePayload();

  await expectReject(
    "Semantic Critic error finding is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        criticErrorPayload as never,
        criticError,
        AUTH,
      ),
    "error finding",
  );

  check(
    "Semantic Critic error performs no Payload mutation",
    !hasMutation(
      criticErrorPayload,
    ),
  );

  /* 9. Missing relationship */

  const missingRelationship =
    buildCandidate();

  missingRelationship
    .portfolio
    .relationships
    .serviceSlugs = [
      "missing-service",
    ];

  const missingPayload =
    new FakePayload();

  await expectReject(
    "missing trusted relationship fails closed",
    () =>
      writeFlexibleCaseStudyDraft(
        missingPayload as never,
        missingRelationship,
        AUTH,
      ),
    "cannot resolve services/missing-service",
  );

  check(
    "missing relationship performs no mutation",
    !hasMutation(
      missingPayload,
    ),
  );

  /* 10. Brand → Company consistency */

  const mismatch =
    buildCandidate();

  mismatch
    .portfolio
    .relationships
    .brandSlug =
    "wrong-brand";

  const mismatchPayload =
    new FakePayload();

  await expectReject(
    "Brand → Company mismatch is refused",
    () =>
      writeFlexibleCaseStudyDraft(
        mismatchPayload as never,
        mismatch,
        AUTH,
      ),
    "relationship mismatch",
  );

  check(
    "Brand → Company mismatch performs no mutation",
    !hasMutation(
      mismatchPayload,
    ),
  );

  /* 11. Protected flagship slug */

  const protectedSlug =
    buildCandidate();

  protectedSlug
    .portfolio
    .projectHint
    .slug =
    "high-ultra-lounge";

  const protectedPayload =
    new FakePayload();

  await expectReject(
    "protected Flagship slug cannot be overwritten",
    () =>
      writeFlexibleCaseStudyDraft(
        protectedPayload as never,
        protectedSlug,
        AUTH,
      ),
    "protected Flagship",
  );

  check(
    "protected Flagship slug performs no mutation",
    !hasMutation(
      protectedPayload,
    ),
  );

  /* 12. Existing Flagship record */

  const existingFlagshipPayload =
    new FakePayload();

  existingFlagshipPayload
    .docs
    .projects
    .push({
      id:
        88,

      slug:
        "sample-case-study",

      renderMode:
        "flagship",
    });

  await expectReject(
    "existing Flagship project cannot be overwritten",
    () =>
      writeFlexibleCaseStudyDraft(
        existingFlagshipPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "existing Flagship",
  );

  check(
    "existing Flagship protection performs no mutation",
    !hasMutation(
      existingFlagshipPayload,
    ),
  );

  /* 13. Clean create */

  const createPayload =
    new FakePayload();

  const createCandidate =
    buildCandidate();

  const beforeCreate =
    JSON.stringify(
      createCandidate,
    );

  const createResult =
    await writeFlexibleCaseStudyDraft(
      createPayload as never,
      createCandidate,
      AUTH,
    );

  const createCall =
    createPayload
      .calls
      .find(
        (
          call,
        ) =>
          call.method ===
          "create",
      );

  check(
    "clean candidate creates CMS project",
    createResult.action ===
      "created" &&
    createResult.status ===
      "draft",
  );

  check(
    "clean create reports recomputed quality and audit scores",
    createResult
      .qualityScore ===
      100 &&
    createResult
      .semanticCriticScore ===
      100 &&
    createResult
      .reconciliationAuditScore ===
      100,
  );

  check(
    "created project explicitly writes _status=draft",
    createCall
      ?.args
      ?.data
      ?._status ===
      "draft",
  );

  check(
    "created project is Flexible",
    createCall
      ?.args
      ?.data
      ?.renderMode ===
      "flexible",
  );

  check(
    "compiled sections reach Payload",
    Array.isArray(
      createCall
        ?.args
        ?.data
        ?.sections,
    ) &&
    createCall
      ?.args
      ?.data
      ?.sections
      ?.length ===
      4,
  );

  check(
    "company slug resolves to ID",
    createCall
      ?.args
      ?.data
      ?.company ===
      10,
  );

  check(
    "brand slug resolves to ID",
    createCall
      ?.args
      ?.data
      ?.brand ===
      20,
  );

  check(
    "business category resolves to ID",
    createCall
      ?.args
      ?.data
      ?.businessCategories
      ?.[0] ===
      30,
  );

  check(
    "service resolves to ID",
    createCall
      ?.args
      ?.data
      ?.services
      ?.[0] ===
      40,
  );

  check(
    "validated Solution/IP resolves to ID",
    createCall
      ?.args
      ?.data
      ?.solutions
      ?.[0] ===
      50,
  );

  const writtenJson =
    JSON.stringify(
      createCall
        ?.args
        ?.data ?? {},
    );

  check(
    "evidence and provenance never enter Payload",
    !writtenJson.includes(
      '"evidence"',
    ) &&
    !writtenJson.includes(
      '"provenance"',
    ) &&
    !writtenJson.includes(
      '"confidence"',
    ) &&
    !writtenJson.includes(
      '"sourceIds"',
    ) &&
    !writtenJson.includes(
      '"publishable"',
    ),
  );

  check(
    "internal Agent bindings and IDs never enter Payload",
    !writtenJson.includes(
      '"bindings"',
    ) &&
    !writtenJson.includes(
      '"evidenceClaimIds"',
    ) &&
    !writtenJson.includes(
      '"claimId"',
    ) &&
    !writtenJson.includes(
      '"assetId"',
    ),
  );

  check(
    "writer never writes published status",
    !createPayload
      .calls
      .some(
        (
          call,
        ) =>
          call.args
            ?.data
            ?._status ===
          "published",
      ),
  );

  check(
    "writer does not mutate candidate",
    JSON.stringify(
      createCandidate,
    ) ===
      beforeCreate,
  );

  /* 14. Clean update */

  const updatePayload =
    new FakePayload();

  updatePayload
    .docs
    .projects
    .push({
      id:
        77,

      slug:
        "sample-case-study",

      renderMode:
        "flexible",
    });

  const updateResult =
    await writeFlexibleCaseStudyDraft(
      updatePayload as never,
      buildCandidate(),
      AUTH,
    );

  const updateCall =
    updatePayload
      .calls
      .find(
        (
          call,
        ) =>
          call.method ===
          "update",
      );

  check(
    "existing Flexible project is updated",
    updateResult.action ===
      "updated" &&
    updateResult.id ===
      77,
  );

  check(
    "update explicitly uses draft:true",
    updateCall
      ?.args
      ?.draft ===
      true,
  );

  check(
    "update explicitly preserves _status=draft",
    updateCall
      ?.args
      ?.data
      ?._status ===
      "draft",
  );

  check(
    "update never writes published status",
    updateCall
      ?.args
      ?.data
      ?._status !==
      "published",
  );

  /* 15. CMS read-back verification — fail closed */

  const tamperedTitlePayload =
    new TamperedReadbackPayload(
      (doc) => ({
        ...doc,
        title:
          "CMS changed this title",
      }),
    );

  await expectReject(
    "writer rejects changed CMS title after draft write",
    () =>
      writeFlexibleCaseStudyDraft(
        tamperedTitlePayload as never,
        buildCandidate(),
        AUTH,
      ),
    "CMS read-back verification failed",
  );

  check(
    "changed-title read-back was checked after mutation",
    tamperedTitlePayload
      .calls
      .some(
        (call) =>
          call.method ===
          "create",
      ) &&
    tamperedTitlePayload
      .calls
      .some(
        (call) =>
          call.method ===
          "findByID",
      ),
  );

  const publishedReadbackPayload =
    new TamperedReadbackPayload(
      (doc) => ({
        ...doc,
        _status:
          "published",
      }),
    );

  await expectReject(
    "writer rejects CMS read-back that is no longer draft",
    () =>
      writeFlexibleCaseStudyDraft(
        publishedReadbackPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "CMS read-back verification failed",
  );

  check(
    "published read-back cannot be reported as successful",
    publishedReadbackPayload
      .calls
      .some(
        (call) =>
          call.method ===
          "findByID",
      ),
  );

  const tamperedSectionPayload =
    new TamperedReadbackPayload(
      (doc) => {
        const changed =
          clone(doc);

        if (
          Array.isArray(
            changed.sections,
          ) &&
          changed.sections[0]
        ) {
          changed
            .sections[0]
            .heading =
            "CMS changed section heading";
        }

        return changed;
      },
    );

  await expectReject(
    "writer rejects changed CMS section content",
    () =>
      writeFlexibleCaseStudyDraft(
        tamperedSectionPayload as never,
        buildCandidate(),
        AUTH,
      ),
    "CMS read-back verification failed",
  );

  check(
    "section mismatch is checked after draft mutation",
    tamperedSectionPayload
      .calls
      .some(
        (call) =>
          call.method ===
          "create",
      ) &&
    tamperedSectionPayload
      .calls
      .some(
        (call) =>
          call.method ===
          "findByID",
      ),
  );

  const tamperedUpdatePayload =
    new TamperedReadbackPayload(
      (doc) => ({
        ...doc,
        brand:
          999,
      }),
    );

  tamperedUpdatePayload
    .docs
    .projects
    .push({
      id:
        77,

      slug:
        "sample-case-study",

      renderMode:
        "flexible",
    });

  await expectReject(
    "writer rejects corrupted read-back after update",
    () =>
      writeFlexibleCaseStudyDraft(
        tamperedUpdatePayload as never,
        buildCandidate(),
        AUTH,
      ),
    "CMS read-back verification failed",
  );

  check(
    "update path also performs CMS read-back verification",
    tamperedUpdatePayload
      .calls
      .some(
        (call) =>
          call.method ===
          "update",
      ) &&
    tamperedUpdatePayload
      .calls
      .some(
        (call) =>
          call.method ===
          "findByID",
      ),
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
  (
    error,
  ) => {
    console.error(
      error,
    );

    process.exit(
      1,
    );
  },
);
