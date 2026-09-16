/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE CMS PAYLOAD
 *
 * Pure publication boundary.
 *
 * NO Payload client.
 * NO database.
 * NO network.
 * NO publishing.
 *
 * Converts a completed Flexible Agent candidate into:
 * 1. publication-safe Project fields; and
 * 2. relationship slugs that a later draft writer must resolve.
 *
 * Evidence, provenance, confidence, audit data and internal
 * Agent identifiers MUST NOT cross this boundary.
 */

import type {
  Project as CmsProject,
} from "../../payload-types";

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

/* ── Public output ─────────────────────────────────── */

export type FlexibleCmsProjectPayload =
  Pick<
    CmsProject,
    | "title"
    | "slug"
    | "renderMode"
    | "sections"
  > &
  Partial<
    Pick<
      CmsProject,
      | "client"
      | "year"
      | "location"
      | "heroMedia"
      | "heroLegacySrc"
    >
  >;

export type FlexibleCmsRelationshipSlugs = {
  companySlug?:
    string;

  brandSlug?:
    string;

  businessCategorySlugs:
    string[];

  serviceSlugs:
    string[];

  solutionSlugs:
    string[];
};

export type FlexibleCmsDraftPreparation = {
  data:
    FlexibleCmsProjectPayload;

  relationships:
    FlexibleCmsRelationshipSlugs;
};

/* ── Internal safety helpers ───────────────────────── */

const FORBIDDEN_CMS_KEYS =
  new Set([
    "claimId",
    "claimIds",
    "evidenceClaimIds",
    "sourceId",
    "sourceIds",
    "support",
    "confidence",
    "publishable",
    "assetId",
    "targetProjectSlug",
    "provenance",
    "relatedClaimIds",
  ]);

function findForbiddenKey(
  value:
    unknown,
  path =
    "sections",
): string | undefined {
  if (
    value ===
      null ||
    typeof value !==
      "object"
  ) {
    return undefined;
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    for (
      let index = 0;
      index <
      value.length;
      index++
    ) {
      const found =
        findForbiddenKey(
          value[index],
          `${path}[${index}]`,
        );

      if (found) {
        return found;
      }
    }

    return undefined;
  }

  for (
    const [
      key,
      child,
    ] of Object.entries(
      value as Record<
        string,
        unknown
      >,
    )
  ) {
    if (
      FORBIDDEN_CMS_KEYS.has(
        key,
      )
    ) {
      return `${path}.${key}`;
    }

    const found =
      findForbiddenKey(
        child,
        `${path}.${key}`,
      );

    if (found) {
      return found;
    }
  }

  return undefined;
}

function assertSafeCandidate(
  candidate:
    GoldStandardCaseStudyCandidate,
): void {
  if (
    candidate
      .evidence
      .reconciliationAuditResult
      .safeToContinue !==
    true
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: reconciliation audit is not safe to continue.",
    );
  }

  if (
    candidate
      .quality
      .draftReady !==
    true
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: deterministic quality gate is not draft-ready.",
    );
  }

  if (
    candidate
      .semanticCritic
      .draftReady !==
    true
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: Semantic Critic is not draft-ready.",
    );
  }

  if (
    candidate
      .architecture
      .renderModeRecommendation !==
    "flexible"
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: Architect did not approve Flexible rendering.",
    );
  }

  if (
    candidate
      .design
      .renderMode !==
    "flexible"
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: Designer output is not Flexible.",
    );
  }

  if (
    candidate
      .compiled
      .renderMode !==
    "flexible"
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: Compiler output is not Flexible.",
    );
  }

  if (
    candidate
      .compiled
      .cmsSections
      .length ===
    0
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: no compiled CMS sections exist.",
    );
  }

  const forbidden =
    findForbiddenKey(
      candidate
        .compiled
        .cmsSections,
    );

  if (forbidden) {
    throw new Error(
      `Flexible CMS payload refused candidate: internal Agent field leaked into CMS at ${forbidden}.`,
    );
  }
}

/* ── Pure CMS preparation ──────────────────────────── */

export function buildFlexibleCmsDraftPayload(
  candidate:
    GoldStandardCaseStudyCandidate,
): FlexibleCmsDraftPreparation {
  assertSafeCandidate(
    candidate,
  );

  const project =
    candidate
      .portfolio
      .projectHint;

  const relationships =
    candidate
      .portfolio
      .relationships;

  if (
    !project.title?.trim() ||
    !project.slug?.trim()
  ) {
    throw new Error(
      "Flexible CMS payload refused candidate: trusted project title and slug are required.",
    );
  }

  const title =
    project.title.trim();

  const slug =
    project.slug.trim();

  const data:
    FlexibleCmsProjectPayload =
    {
      title,

      slug,

      renderMode:
        "flexible",

      /**
       * Compiler output is already Payload-compatible.
       *
       * Internal bindings deliberately remain outside CMS.
       */
      sections:
        candidate
          .compiled
          .cmsSections,
    };

  if (
    project.client
  ) {
    data.client =
      project.client;
  }

  if (
    project.year != null
  ) {
    data.year =
      project.year;
  }

  if (
    project.location
  ) {
    data.location =
      project.location;
  }

  /**
   * Hero selection is deterministic only when exactly
   * one trusted campaign-hero asset exists.
   *
   * Zero or multiple candidates remain an explicit
   * human/editorial decision rather than guessing.
   */
  const heroAssets =
    candidate
      .media
      .assets
      .filter(
        (asset) =>
          asset.role ===
          "campaign-hero",
      );

  if (
    heroAssets.length ===
    1
  ) {
    const hero =
      heroAssets[0];

    if (
      hero.mediaId != null
    ) {
      data.heroMedia =
        hero.mediaId;
    } else if (
      hero.legacySrc
    ) {
      data.heroLegacySrc =
        hero.legacySrc;
    }
  }

  return {
    data,

    relationships: {
      companySlug:
        relationships
          .companySlug,

      brandSlug:
        relationships
          .brandSlug,

      businessCategorySlugs:
        [
          ...relationships
            .businessCategorySlugs,
        ],

      serviceSlugs:
        [
          ...relationships
            .serviceSlugs,
        ],

      solutionSlugs:
        candidate
          .portfolio
          .solutions
          .map(
            (solution) =>
              solution.slug,
          ),
    },
  };
}
