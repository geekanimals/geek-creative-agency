/**
 * GOLD STANDARD CASE STUDY AGENT — FULL PIPELINE TESTS
 *
 * No real OpenAI calls.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves:
 *
 * Sources
 *   → Extractor
 *   → Verifier
 *   → Reconciler
 *   → Architect
 *   → Designer
 *   → Compiler
 *   → Gold Standard Candidate
 */

import {
  buildCaseStudyCandidate,
} from "./caseStudyPipeline";

import type {
  BuildCaseStudyCandidateRequest,
} from "./caseStudyPipeline";

import {
  buildTrustedSourceManifest,
} from "./sourceManifest";

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

type Tracker = {
  order: string[];
  models: Record<string, string | undefined>;

  /**
   * Optional raw AI request capture for boundary tests.
   */
  requests?: Record<string, unknown[]>;
};

function fakeClient(
  stage: string,
  outputText: string | undefined,
  tracker: Tracker,
) {
  return {
    responses: {
      create: async (
        input: {
          model?: string;
        },
      ) => {
        tracker.order.push(stage);
        tracker.models[stage] =
          input.model;

        if (tracker.requests) {
          if (!tracker.requests[stage]) {
            tracker.requests[stage] =
              [];
          }

          tracker.requests[stage].push(
            input,
          );
        }

        return {
          output_text:
            outputText,
        };
      },
    },
  } as never;
}

const REQUEST: BuildCaseStudyCandidateRequest = {
  sourceManifest:
    buildTrustedSourceManifest({
      entries: [
        {
          id:
            "source-report",

          kind:
            "internal-document",

          title:
            "Campaign report",

          content: [
            "The campaign operated during a constrained launch period.",
            "Creators participated through an active campaign mechanic.",
            "The campaign produced measurable creator participation.",
            "The campaign activated 500 creators.",
            "The campaign connected to the next phase of the creator programme.",
          ].join("\n"),

          origin: {
            kind:
              "uploaded-file",

            reference:
              "campaign-report-test-fixture",
          },

          status:
            "approved-for-extraction",
        },

        {
          id:
            "source-interview",

          kind:
            "user-provided",

          title:
            "Campaign stakeholder interview",

          content:
            "The activation gave creators a meaningful role.",

          origin: {
            kind:
              "pasted-text",

            reference:
              "stakeholder-interview-test-fixture",
          },

          status:
            "approved-for-extraction",
        },

        {
          id:
            "pending-working-note",

          kind:
            "user-provided",

          title:
            "Unapproved working note",

          content:
            "UNAPPROVED MATERIAL MUST NEVER REACH THE EXTRACTOR.",

          origin: {
            kind:
              "pasted-text",

            reference:
              "pending-working-note-test-fixture",
          },

          status:
            "pending",
        },
      ],
    }),

  portfolio: {
    taxonomy: {
      companies: [
        {
          slug:
            "sample-company",

          label:
            "Sample Company",
        },
      ],

      brands: [
        {
          slug:
            "sample-brand",

          label:
            "Sample Brand",

          companySlug:
            "sample-company",
        },
      ],

      businessCategories: [
        {
          slug:
            "fmcg",

          label:
            "FMCG",
        },
      ],

      services: [
        {
          slug:
            "influencer-marketing",

          label:
            "Influencer Marketing",
        },
      ],

      solutions: [
        {
          slug:
            "sample-solution",

          label:
            "Sample Solution",
        },
      ],
    },

    selection: {
      project: {
        title:
          "Sample Campaign",

        slug:
          "sample-campaign",
      },

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

      solutions: [],

      nextProjectSlug:
        "next-project",
    },
  },

  mediaAssets: [
    {
      id:
        "asset-context",

      title:
        "Campaign context",

      legacySrc:
        "/assets/work/test/context.jpg",

      alt:
        "Campaign context",

      provenance: {
        kind:
          "repository-asset",

        reference:
          "test-fixture-context",
      },
    },

    {
      id:
        "asset-hero",

      title:
        "Campaign hero",

      legacySrc:
        "/assets/work/test/hero.jpg",

      alt:
        "Campaign hero",

      provenance: {
        kind:
          "repository-asset",

        reference:
          "test-fixture-hero",
      },
    },

    {
      id:
        "asset-mechanic",

      title:
        "Campaign mechanic",

      legacySrc:
        "/assets/work/test/mechanic.jpg",

      alt:
        "Campaign mechanic",

      provenance: {
        kind:
          "repository-asset",

        reference:
          "test-fixture-mechanic",
      },
    },

    {
      id:
        "asset-gallery-1",

      title:
        "Creator image one",

      legacySrc:
        "/assets/work/test/gallery-1.jpg",

      alt:
        "Creator image one",

      provenance: {
        kind:
          "repository-asset",

        reference:
          "test-fixture-gallery-1",
      },
    },

    {
      id:
        "asset-gallery-2",

      title:
        "Creator image two",

      legacySrc:
        "/assets/work/test/gallery-2.jpg",

      alt:
        "Creator image two",

      provenance: {
        kind:
          "repository-asset",

        reference:
          "test-fixture-gallery-2",
      },
    },
  ],

  extractorModel:
    "extractor-model",

  verifierModel:
    "verifier-model",

  reconcilerModel:
    "reconciler-model",

  reconciliationAuditorModel:
    "reconciliation-auditor-model",

  architectModel:
    "architect-model",

  designerModel:
    "designer-model",

  criticModel:
    "critic-model",
};

const EXTRACTION_OUTPUT = {
  claims: [
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

      support: [
        {
          sourceId:
            "source-report",

          excerpt:
            "The campaign operated during a constrained launch period.",
        },
      ],
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

      support: [
        {
          sourceId:
            "source-interview",

          excerpt:
            "The activation gave creators a meaningful role.",
        },
      ],
    },

    {
      id:
        "fact-mechanic",

      type:
        "fact",

      statement:
        "Creators participated through an active campaign mechanic.",

      sourceIds: [
        "source-report",
      ],

      support: [
        {
          sourceId:
            "source-report",

          excerpt:
            "Creators participated through an active campaign mechanic.",
        },
      ],
    },

    {
      id:
        "fact-result",

      type:
        "fact",

      statement:
        "The campaign produced measurable creator participation.",

      sourceIds: [
        "source-report",
      ],

      support: [
        {
          sourceId:
            "source-report",

          excerpt:
            "The campaign produced measurable creator participation.",
        },
      ],
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

      support: [
        {
          sourceId:
            "source-report",

          excerpt:
            "The campaign activated 500 creators.",
        },
      ],
    },

    {
      id:
        "fact-continuity",

      type:
        "narrative",

      statement:
        "The campaign connected to the next phase of the creator programme.",

      sourceIds: [
        "source-report",
      ],

      support: [
        {
          sourceId:
            "source-report",

          excerpt:
            "The campaign connected to the next phase of the creator programme.",
        },
      ],
    },
  ],
};

const VERIFICATION_OUTPUT = {
  results:
    EXTRACTION_OUTPUT.claims.map(
      (claim) => ({
        claimId:
          claim.id,

        verdict:
          "supported",

        reason:
          "The supplied excerpt directly supports the complete claim.",

        unsupportedElements: [],
      }),
    ),
};

const RECONCILIATION_OUTPUT = {
  decisions:
    EXTRACTION_OUTPUT.claims.map(
      (claim) => ({
        claimId:
          claim.id,

        decision:
          "publish",

        confidence:
          "high",

        conflictDisposition:
          "none",

        conflictGroupId:
          null,

        reason:
          "The exact claim is fully supported and has no unresolved material conflict.",
      }),
    ),
};

const RECONCILIATION_AUDITOR_OUTPUT = {
  summary:
    "The reconciliation is semantically safe.",

  findings: [],
};

const ARCHITECT_OUTPUT = {
  narrativeThesis:
    "The strongest story moves from campaign context through the participation mechanic to verified scale.",

  storyStrategy:
    "Establish the context, show how participation worked, then close with evidence of scale.",

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
      id:
        "mechanic",

      role:
        "mechanic",

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
      id:
        "results",

      role:
        "results",

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

const CRITIC_OUTPUT = {
  summary:
    "The finished case study is coherent, evidence-faithful and appropriately scoped.",

  findings: [],
};

const DESIGNER_OUTPUT = {
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

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Full Pipeline tests\n",
  );

  const requestBefore =
    JSON.stringify(
      REQUEST,
    );

  const tracker: Tracker = {
    order: [],
    models: {},
    requests: {},
  };

  const result =
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            tracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            tracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            tracker,
          ),
        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify(
              RECONCILIATION_AUDITOR_OUTPUT,
            ),
            tracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              ARCHITECT_OUTPUT,
            ),
            tracker,
          ),

        designerClient:
          fakeClient(
            "designer",
            JSON.stringify(
              DESIGNER_OUTPUT,
            ),
            tracker,
          ),

        criticClient:
          fakeClient(
            "critic",
            JSON.stringify(
              CRITIC_OUTPUT,
            ),
            tracker,
          ),
      },
    );

  check(
    "full Case Study Pipeline succeeds",
    Boolean(result),
  );

  /*
   * Prove the Architect receives the deterministically
   * validated portfolio projection produced by
   * buildTrustedPortfolioContext().
   *
   * This verifies there is no parallel raw-portfolio
   * bypass into the Architect prompt.
   */
  const architectApiRequest =
    tracker.requests
      ?.architect?.[0] as
      | {
          input?: Array<{
            role?: string;
            content?: string;
          }>;
        }
      | undefined;

  const architectUserMessage =
    architectApiRequest
      ?.input
      ?.find(
        (message) =>
          message.role ===
          "user",
      );

  const architectPrompt =
    architectUserMessage
      ?.content
      ? JSON.parse(
          architectUserMessage
            .content,
        ) as
          Record<
            string,
            unknown
          >
      : undefined;

  const expectedArchitectPortfolio = {
    relationships:
      result.portfolio
        .relationships,

    solutions:
      result.portfolio
        .solutions,
  };

  check(
    "full pipeline sends validated portfolio context to Architect",
    JSON.stringify(
      architectPrompt
        ?.trustedPortfolioContext,
    ) ===
      JSON.stringify(
        expectedArchitectPortfolio,
      ),
  );

  check(
    "Architect portfolio context comes from validated candidate portfolio",
    (
      architectPrompt
        ?.trustedPortfolioContext as
        | {
            relationships?: {
              companySlug?: string;
              brandSlug?: string;
              businessCategorySlugs?: string[];
              serviceSlugs?: string[];
              solutionSlugs?: string[];
            };
            solutions?: unknown[];
          }
        | undefined
    )
      ?.relationships
      ?.companySlug ===
      result.portfolio
        .relationships
        .companySlug &&
    (
      architectPrompt
        ?.trustedPortfolioContext as
        | {
            relationships?: {
              brandSlug?: string;
            };
          }
        | undefined
    )
      ?.relationships
      ?.brandSlug ===
      result.portfolio
        .relationships
        .brandSlug,
  );

  check(
    "full pipeline does not expose raw taxonomy to Architect",
    !JSON.stringify(
      architectPrompt
        ?.trustedPortfolioContext,
    ).includes(
      '"taxonomy"',
    ),
  );

  check(
    "full pipeline Source Intake forwards only approved sources",
    result.sourceIntake.sources.length ===
      2 &&
    result.sourceIntake.sources
      .map(
        (source) =>
          source.id,
      )
      .join(",") ===
      "source-report,source-interview",
  );

  check(
    "full pipeline preserves pending source in exclusion audit",
    result.sourceIntake.excluded.length ===
      1 &&
    result.sourceIntake.excluded[0]
      ?.id ===
      "pending-working-note" &&
    result.sourceIntake.excluded[0]
      ?.status ===
      "pending",
  );

  const extractorRequestJson =
    JSON.stringify(
      tracker.requests?.extractor ??
      [],
    );

  check(
    "approved sources reach Extractor request",
    extractorRequestJson.includes(
      "source-report",
    ) &&
    extractorRequestJson.includes(
      "source-interview",
    ),
  );

  check(
    "pending source identity never reaches Extractor request",
    !extractorRequestJson.includes(
      "pending-working-note",
    ),
  );

  check(
    "pending source content never reaches Extractor request",
    !extractorRequestJson.includes(
      "UNAPPROVED MATERIAL MUST NEVER REACH THE EXTRACTOR.",
    ),
  );

  check(
    "AI stages execute in correct order",
    JSON.stringify(
      tracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
        "architect",
        "designer",
        "critic",
      ]),
  );

  check(
    "all configured models route correctly",
    tracker.models.extractor ===
      "extractor-model" &&
    tracker.models.verifier ===
      "verifier-model" &&
    tracker.models.reconciler ===
      "reconciler-model" &&
    tracker.models.auditor ===
      "reconciliation-auditor-model" &&
    tracker.models.architect ===
      "architect-model" &&
    tracker.models.designer ===
      "designer-model" &&
    tracker.models.critic ===
      "critic-model",
  );

  check(
    "final evidence ledger survives into candidate",
    result.evidence.claims.length ===
      6,
  );

  check(
    "validated portfolio identity survives into candidate",
    result.portfolio
      .projectHint.slug ===
      "sample-campaign",
  );

  check(
    "validated Company and Brand survive into candidate",
    result.portfolio
      .relationships
      .companySlug ===
      "sample-company" &&
    result.portfolio
      .relationships
      .brandSlug ===
      "sample-brand",
  );

  check(
    "validated Service survives into candidate",
    result.portfolio
      .relationships
      .serviceSlugs
      .join(",") ===
      "influencer-marketing",
  );

  check(
    "no Solution relationship is inferred by the full pipeline",
    result.portfolio
      .relationships
      .solutionSlugs.length ===
      0,
  );

  check(
    "Architect continuity comes from validated portfolio context",
    result.portfolio
      .allowedContinuitySlugs
      .join(",") ===
      "next-project",
  );

  check(
    "all reconciled claims are publication-ready",
    result.evidence.claims.every(
      (claim) =>
        claim.publishable &&
        claim.confidence ===
          "high",
    ),
  );

  check(
    "Architect plan survives into candidate",
    result.architecture
      .chapters.length ===
      3 &&
    result.architecture
      .renderModeRecommendation ===
      "flexible",
  );

  check(
    "Designer output survives into candidate",
    result.design.sections.length ===
      9 &&
    result.design.renderMode ===
      "flexible",
  );

  check(
    "Compiler produces Payload-compatible Flexible sections",
    result.compiled
      .cmsSections.length ===
      9 &&
    result.compiled.renderMode ===
      "flexible",
  );

  const metricSection =
    result.compiled
      .cmsSections
      .find(
        (section) =>
          section.blockType ===
          "metrics",
      );

  check(
    "verified metric reaches compiled CMS section",
    Boolean(
      metricSection &&
      metricSection.blockType ===
        "metrics" &&
      metricSection.items?.[0]
        ?.value ===
        "500",
    ),
  );

  const cta =
    result.compiled
      .cmsSections
      .find(
        (section) =>
          section.blockType ===
          "cta",
      );

  check(
    "trusted continuity slug becomes deterministic CTA path",
    Boolean(
      cta &&
      cta.blockType ===
        "cta" &&
      cta.buttonHref ===
        "/work/next-project",
    ),
  );

  const media =
    result.compiled
      .cmsSections
      .find(
        (section) =>
          section.blockType ===
          "mediaBlock",
      );

  check(
    "trusted media ID resolves through compiler registry",
    Boolean(
      media &&
      media.blockType ===
        "mediaBlock" &&
      media.legacySrc ===
        "/assets/work/test/context.jpg",
    ),
  );

  check(
    "validated media provenance survives internally into candidate",
    result.media
      .assets
      .find(
        (asset) =>
          asset.id ===
          "asset-context",
      )
      ?.provenance.reference ===
      "test-fixture-context",
  );

  check(
    "final candidate preserves full trusted media registry",
    result.media.assets.length ===
      REQUEST.mediaAssets?.length,
  );

  const internalMediaJson =
    JSON.stringify(
      result.media,
    );

  check(
    "internal media context preserves provenance metadata",
    internalMediaJson.includes(
      "repository-asset",
    ) &&
    internalMediaJson.includes(
      "test-fixture-context",
    ),
  );

  const compiledJson =
    JSON.stringify(
      result.compiled
        .cmsSections,
    );

  check(
    "internal evidence IDs do not leak into CMS output",
    !compiledJson.includes(
      "evidenceClaimIds",
    ) &&
    !compiledJson.includes(
      "claimId",
    ),
  );

  check(
    "Designer asset IDs do not leak into CMS output",
    !compiledJson.includes(
      "asset-context",
    ) &&
    !compiledJson.includes(
      "asset-mechanic",
    ),
  );

  check(
    "media provenance and evidence associations do not leak into CMS output",
    !compiledJson.includes(
      "provenance",
    ) &&
    !compiledJson.includes(
      "repository-asset",
    ) &&
    !compiledJson.includes(
      "test-fixture-context",
    ) &&
    !compiledJson.includes(
      "relatedClaimIds",
    ),
  );

  check(
    "compiled evidence bindings remain internal",
    result.compiled
      .bindings.length ===
      result.design.sections.length,
  );

  check(
    "valid full-pipeline candidate passes Flexible quality gate",
    result.quality.status ===
      "pass" &&
    result.quality.draftReady ===
      true,
  );

  check(
    "valid full-pipeline candidate receives clean 100 quality score",
    result.quality.score ===
      100 &&
    result.quality.issues.length ===
      0,
  );

  check(
    "valid candidate passes independent Semantic Critic",
    result.semanticCritic.status ===
      "pass" &&
    result.semanticCritic.draftReady ===
      true,
  );

  check(
    "clean Semantic Critic result scores 100",
    result.semanticCritic.score ===
      100 &&
    result.semanticCritic.findings.length ===
      0,
  );

  /* ── Empty evidence must stop before Architect ───── */

  /* ── Zero approved sources stop before any AI ────── */

  const zeroApprovedRequest =
    clone(
      REQUEST,
    );

  for (
    const entry
    of zeroApprovedRequest
      .sourceManifest
      .entries
  ) {
    entry.status =
      "pending";
  }

  const zeroApprovedTracker:
    Tracker = {
      order: [],
      models: {},
      requests: {},
    };

  let zeroApprovedRejected =
    false;

  try {
    await buildCaseStudyCandidate(
      zeroApprovedRequest,
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            zeroApprovedTracker,
          ),
      },
    );
  } catch (error) {
    zeroApprovedRejected =
      error instanceof Error &&
      error.message.includes(
        "at least one source approved-for-extraction",
      );
  }

  check(
    "zero approved sources fail full pipeline before evidence extraction",
    zeroApprovedRejected,
  );

  check(
    "zero approved sources make no AI call",
    zeroApprovedTracker
      .order
      .length ===
      0,
  );

  const emptyTracker: Tracker = {
    order: [],
    models: {},
  };

  let emptyEvidenceRejected =
    false;

  try {
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify({
              claims: [],
            }),
            emptyTracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              ARCHITECT_OUTPUT,
            ),
            emptyTracker,
          ),
      },
    );
  } catch (error) {
    emptyEvidenceRejected =
      error instanceof Error &&
      error.message.includes(
        "evidence ledger is empty",
      );
  }

  check(
    "empty evidence ledger prevents case-study design",
    emptyEvidenceRejected,
  );

  check(
    "empty evidence stops before Architect",
    JSON.stringify(
      emptyTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
      ]),
  );

  /* ── Reconciliation Auditor blocks before Architect ─── */

  const reconciliationAuditFailureTracker:
    Tracker = {
      order: [],
      models: {},
    };

  let reconciliationAuditRejected =
    false;

  let reconciliationAuditFindingSurfaced =
    false;

  try {
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            reconciliationAuditFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            reconciliationAuditFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            reconciliationAuditFailureTracker,
          ),

        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify({
              summary:
                "A material reconciliation conflict was missed.",

              findings: [
                {
                  id:
                    "missed-evidence-conflict",

                  category:
                    "missed-conflict",

                  severity:
                    "error",

                  message:
                    "Two evidence claims contain a material unresolved conflict.",

                  claimIds: [
                    "fact-context",
                    "metric-creators",
                  ],
                },
              ],
            }),
            reconciliationAuditFailureTracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              ARCHITECT_OUTPUT,
            ),
            reconciliationAuditFailureTracker,
          ),
      },
    );
  } catch (error) {
    reconciliationAuditRejected =
      error instanceof Error &&
      error.message.includes(
        "Evidence Pipeline failed Reconciliation Auditor",
      );

    reconciliationAuditFindingSurfaced =
      error instanceof Error &&
      error.message.includes(
        "missed-evidence-conflict",
      );
  }

  check(
    "Reconciliation Auditor error blocks full Case Study Pipeline",
    reconciliationAuditRejected,
  );

  check(
    "full pipeline surfaces exact Reconciliation Auditor finding ID",
    reconciliationAuditFindingSurfaced,
  );

  check(
    "Reconciliation Auditor failure stops before Architect",
    JSON.stringify(
      reconciliationAuditFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
      ]),
  );

  /* ── Standard Architect recommendation stops Designer ── */

  const standardTracker: Tracker = {
    order: [],
    models: {},
  };

  const standardArchitecture =
    clone(
      ARCHITECT_OUTPUT,
    );

  standardArchitecture
    .renderModeRecommendation =
    "standard";

  let standardRejected =
    false;

  try {
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            standardTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            standardTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            standardTracker,
          ),
        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify(
              RECONCILIATION_AUDITOR_OUTPUT,
            ),
            standardTracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              standardArchitecture,
            ),
            standardTracker,
          ),

        designerClient:
          fakeClient(
            "designer",
            JSON.stringify(
              DESIGNER_OUTPUT,
            ),
            standardTracker,
          ),
      },
    );
  } catch (error) {
    standardRejected =
      error instanceof Error &&
      error.message.includes(
        "requires Architect renderModeRecommendation=flexible",
      );
  }

  check(
    "Standard Architect recommendation is not silently converted",
    standardRejected,
  );

  check(
    "Standard recommendation stops before Designer",
    JSON.stringify(
      standardTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
        "architect",
      ]),
  );

  /* ── Designer failure propagates safely ─────────── */

  const designerFailureTracker: Tracker = {
    order: [],
    models: {},
  };

  let designerFailure =
    false;

  try {
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            designerFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            designerFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            designerFailureTracker,
          ),
        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify(
              RECONCILIATION_AUDITOR_OUTPUT,
            ),
            designerFailureTracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              ARCHITECT_OUTPUT,
            ),
            designerFailureTracker,
          ),

        designerClient:
          fakeClient(
            "designer",
            "{ invalid json",
            designerFailureTracker,
          ),
      },
    );
  } catch (error) {
    designerFailure =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "invalid Designer output fails complete pipeline",
    designerFailure,
  );

  check(
    "Designer failure occurs only after evidence and architecture",
    JSON.stringify(
      designerFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
        "architect",
        "designer",
      ]),
  );

  /* ── Quality Gate must block structurally valid but incomplete design ── */

  const qualityFailureTracker: Tracker = {
    order: [],
    models: {},
  };

  const missingMetricDesign =
    clone(
      DESIGNER_OUTPUT,
    ) as {
      renderMode: string;
      sections:
        Array<Record<string, unknown>>;
    };

  const metricSectionIndex =
    missingMetricDesign
      .sections
      .findIndex(
        (section) =>
          section.blockType ===
          "metrics",
      );

  if (
    metricSectionIndex >=
    0
  ) {
    missingMetricDesign
      .sections[
        metricSectionIndex
      ] = {
        id:
          "results-rich",

        chapterId:
          "results",

        blockType:
          "richText",

        body:
          "The campaign produced measurable creator participation.",

        evidenceClaimIds: [
          "fact-result",
        ],
      };
  }

  let qualityFailure =
    false;

  let qualityFailureCode =
    false;

  try {
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            qualityFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            qualityFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            qualityFailureTracker,
          ),
        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify(
              RECONCILIATION_AUDITOR_OUTPUT,
            ),
            qualityFailureTracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              ARCHITECT_OUTPUT,
            ),
            qualityFailureTracker,
          ),

        designerClient:
          fakeClient(
            "designer",
            JSON.stringify(
              missingMetricDesign,
            ),
            qualityFailureTracker,
          ),
      },
    );
  } catch (error) {
    qualityFailure =
      error instanceof Error &&
      error.message.includes(
        "failed Flexible quality gate",
      );

    qualityFailureCode =
      error instanceof Error &&
      error.message.includes(
        "FLEX_PLANNED_METRIC_MISSING",
      );
  }

  check(
    "full pipeline rejects design that drops Architect-planned metric",
    qualityFailure,
  );

  check(
    "full pipeline surfaces exact Flexible quality failure code",
    qualityFailureCode,
  );

  check(
    "deterministic quality failure stops before Semantic Critic",
    JSON.stringify(
      qualityFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
        "architect",
        "designer",
      ]),
  );

  /* ── Semantic Critic error must fail closed ─────── */

  const criticFailureTracker: Tracker = {
    order: [],
    models: {},
  };

  const criticErrorOutput = {
    summary:
      "The finished story contains material evidence overreach.",

    findings: [
      {
        id:
          "unsupported-impact",

        category:
          "evidence-overreach",

        severity:
          "error",

        message:
          "The creator metric is given a stronger meaning than its evidence supports.",

        sectionIds: [
          "results-metrics",
        ],

        claimIds: [
          "metric-creators",
        ],
      },
    ],
  };

  let criticFailure =
    false;

  let criticFailureId =
    false;

  try {
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            criticFailureTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            criticFailureTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            criticFailureTracker,
          ),
        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify(
              RECONCILIATION_AUDITOR_OUTPUT,
            ),
            criticFailureTracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              ARCHITECT_OUTPUT,
            ),
            criticFailureTracker,
          ),

        designerClient:
          fakeClient(
            "designer",
            JSON.stringify(
              DESIGNER_OUTPUT,
            ),
            criticFailureTracker,
          ),

        criticClient:
          fakeClient(
            "critic",
            JSON.stringify(
              criticErrorOutput,
            ),
            criticFailureTracker,
          ),
      },
    );
  } catch (error) {
    criticFailure =
      error instanceof Error &&
      error.message.includes(
        "failed Semantic Critic",
      );

    criticFailureId =
      error instanceof Error &&
      error.message.includes(
        "unsupported-impact",
      );
  }

  check(
    "Semantic Critic error blocks Gold Standard candidate",
    criticFailure,
  );

  check(
    "pipeline surfaces exact Semantic Critic finding ID",
    criticFailureId,
  );

  check(
    "Semantic Critic error occurs after all earlier stages",
    JSON.stringify(
      criticFailureTracker.order,
    ) ===
      JSON.stringify([
        "extractor",
        "verifier",
        "reconciler",
        "auditor",
        "architect",
        "designer",
        "critic",
      ]),
  );

  /* ── Semantic warning may continue to human review ─ */

  const criticWarningTracker: Tracker = {
    order: [],
    models: {},
  };

  const criticWarningOutput = {
    summary:
      "The case study is evidence-safe but contains non-blocking repetition.",

    findings: [
      {
        id:
          "repeated-context",

        category:
          "repetition",

        severity:
          "warning",

        message:
          "Two context sections repeat the same point without adding material meaning.",

        sectionIds: [
          "context-intro",
          "context-rich",
        ],

        claimIds: [
          "fact-context",
        ],
      },
    ],
  };

  const warningCandidate =
    await buildCaseStudyCandidate(
      clone(REQUEST),
      {
        extractorClient:
          fakeClient(
            "extractor",
            JSON.stringify(
              EXTRACTION_OUTPUT,
            ),
            criticWarningTracker,
          ),

        verifierClient:
          fakeClient(
            "verifier",
            JSON.stringify(
              VERIFICATION_OUTPUT,
            ),
            criticWarningTracker,
          ),

        reconcilerClient:
          fakeClient(
            "reconciler",
            JSON.stringify(
              RECONCILIATION_OUTPUT,
            ),
            criticWarningTracker,
          ),
        reconciliationAuditorClient:
          fakeClient(
            "auditor",
            JSON.stringify(
              RECONCILIATION_AUDITOR_OUTPUT,
            ),
            criticWarningTracker,
          ),

        architectClient:
          fakeClient(
            "architect",
            JSON.stringify(
              ARCHITECT_OUTPUT,
            ),
            criticWarningTracker,
          ),

        designerClient:
          fakeClient(
            "designer",
            JSON.stringify(
              DESIGNER_OUTPUT,
            ),
            criticWarningTracker,
          ),

        criticClient:
          fakeClient(
            "critic",
            JSON.stringify(
              criticWarningOutput,
            ),
            criticWarningTracker,
          ),
      },
    );

  check(
    "Semantic Critic warning returns candidate for human review",
    warningCandidate
      .semanticCritic
      .status ===
      "partial" &&
    warningCandidate
      .semanticCritic
      .draftReady ===
      true,
  );

  check(
    "Semantic Critic warning score is deterministic",
    warningCandidate
      .semanticCritic
      .score ===
      94,
  );

  /* ── Input immutability ─────────────────────────── */

  check(
    "Full Case Study Pipeline does not mutate trusted request",
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
