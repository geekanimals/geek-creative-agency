/**
 * TEST-ONLY FIXTURES
 *
 * Shared deterministic candidate fixtures for Case Study Agent tests.
 * Never imported by production/operator code.
 */

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";
export function buildCleanFlexibleCandidate():
  GoldStandardCaseStudyCandidate {
  return {
    sourceIntake: {
      sources: [
        {
          id:
            "source-report",

          kind:
            "internal-document",

          title:
            "Campaign Report",

          content:
            "The campaign activated 500 creators.",
        },
      ],

      excluded: [
        {
          id:
            "pending-note",

          status:
            "pending",

          reason:
            "Pending operator approval.",
        },
      ],
    },

    evidence: {
      candidates: [
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
      ],

      verification: {
        claims: [],
      },

      claims: [
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

          confidence:
            "high",

          publishable:
            true,

          note:
            "Supported.",
        },
      ],

      reconciliationAudit: [],

      reconciliationAuditResult: {
        status:
          "pass",

        safeToContinue:
          true,

        score:
          100,

        summary:
          "Reconciliation is safe.",

        findings: [],
      },
    },

    portfolio: {
      projectHint: {
        title:
          "Sample Campaign",

        slug:
          "sample-campaign",
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

      solutions: [],

      continuity: {
        previousProjectSlug:
          null,

        nextProjectSlug:
          null,
      },

      allowedContinuitySlugs: [],
    },

    media: {
      assets: [],

      designerAssets: [],

      compilerAssets: [],
    },

    architecture: {
      narrativeThesis:
        "Creator participation made the campaign measurable.",

      storyStrategy:
        "Lead with the mechanic and prove participation.",

      renderModeRecommendation:
        "flexible",

      chapters: [
        {
          id:
            "results",

          role:
            "results",

          headingDirection:
            "Participation at scale",

          purpose:
            "Show the verified campaign result.",

          evidenceClaimIds: [
            "metric-creators",
          ],

          metricClaimIds: [
            "metric-creators",
          ],

          mediaRole:
            null,

          toneRecommendation:
            "precise",
        },
      ],

      metricsPlan: [
        {
          claimId:
            "metric-creators",

          role:
            "primary-result",

          placement:
            "results",

          scopeNote:
            null,
        },
      ],

      mediaPlan: [],

      continuityPlan:
        null,

      ctaPlan: {
        type:
          "none",

        targetProjectSlug:
          null,

        rationale:
          "No trusted continuation is configured.",
      },

      rationale:
        "Flexible presentation supports the evidence structure.",
    },

    design: {
      renderMode:
        "flexible",

      sections: [
        {
          id:
            "results-metrics",

          chapterId:
            "results",

          blockType:
            "metrics",

          heading:
            "Campaign results",

          items: [
            {
              claimId:
                "metric-creators",

              value:
                "500",

              label:
                "Creators activated",

              note:
                null,
            },
          ],

          evidenceClaimIds: [
            "metric-creators",
          ],
        },
      ],
    },

    compiled: {
      renderMode:
        "flexible",

      cmsSections: [
        {
          blockType:
            "metrics",

          heading:
            "Campaign results",

          items: [
            {
              value:
                "500",

              label:
                "Creators activated",

              note:
                null,
            },
          ],
        },
      ],

      bindings: [
        {
          sectionId:
            "results-metrics",

          chapterId:
            "results",

          blockType:
            "metrics",

          evidenceClaimIds: [
            "metric-creators",
          ],
        },
      ],
    },

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
        "No semantic issues found.",

      findings: [],
    },
  } as unknown as GoldStandardCaseStudyCandidate;
}
