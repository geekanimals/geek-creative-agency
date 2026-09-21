/**
 * GOLD STANDARD CASE STUDY AGENT — CASE STUDY DESIGNER
 *
 * Converts an approved CaseStudyDesignPlan into an evidence-bound,
 * semantic Flexible case-study structure.
 *
 * IMPORTANT:
 *
 * - Output is NOT Payload data yet.
 * - Rich text remains ordinary text.
 * - Media may reference ONLY trusted asset IDs.
 * - CTA may reference ONLY trusted project slugs.
 * - No database.
 * - No Payload.
 * - No publishing.
 */

import OpenAI from "openai";

import {
  DESIGNER_BLOCK_TYPES,
  DESIGNER_RESPONSE_FORMAT,
} from "./designSchema";

import type {
  CaseStudyDesignPlan,
} from "./architect";

import type {
  EvidenceClaim,
} from "./types";

/* ── Trusted input ───────────────────────────────────── */

export type DesignerMediaAsset = {
  /**
   * Stable internal identifier.
   *
   * The model sees this ID, never a filesystem path or CMS media ID.
   */
  id: string;

  title: string;

  role?: string;

  description?: string;
};

export type DesignerRequest = {
  plan: CaseStudyDesignPlan;

  /**
   * Evidence ledger available to the Designer.
   */
  claims: EvidenceClaim[];

  /**
   * Explicit media allowlist.
   *
   * The model may select ONLY these IDs.
   */
  mediaAssets?: DesignerMediaAsset[];

  /**
   * Explicit project-slug allowlist for CTA / continuity navigation.
   */
  allowedContinuitySlugs?: string[];

  model?: string;
};

export type DesignerOptions = {
  client?: OpenAI;
};

/* ── Semantic section types ──────────────────────────── */

type SectionEvidence = {
  id: string;

  evidenceClaimIds: string[];
};

export type DesignedSectionIntro =
  SectionEvidence & {
    chapterId: string;

    blockType: "sectionIntro";

    eyebrow?: string;

    heading: string;

    body?: string;
  };

export type DesignedRichText =
  SectionEvidence & {
    chapterId: string;

    blockType: "richText";

    /**
     * Plain text only.
     * Compiled to Lexical later.
     */
    body: string;
  };

export type DesignedMediaBlock =
  SectionEvidence & {
    chapterId: string;

    blockType: "mediaBlock";

    assetId: string;
  };

export type DesignedFullBleedMedia =
  SectionEvidence & {
    chapterId: string;

    blockType: "fullBleedMedia";

    assetId: string;

    overlayHeading?: string;
  };

export type DesignedSplitContent =
  SectionEvidence & {
    chapterId: string;

    blockType: "splitContent";

    mediaSide:
      | "left"
      | "right";

    body: string;

    assetId: string;
  };

export type DesignedMediaGallery =
  SectionEvidence & {
    chapterId: string;

    blockType: "mediaGallery";

    heading?: string;

    assetIds: string[];
  };

export type DesignedMetricItem = {
  claimId: string;

  value: string;

  label: string;

  prefix?: string;

  suffix?: string;

  note?: string;
};

export type DesignedMetrics =
  SectionEvidence & {
    chapterId: string;

    blockType: "metrics";

    heading?: string;

    items:
      DesignedMetricItem[];
  };

export type DesignedQuote =
  SectionEvidence & {
    chapterId: string;

    blockType: "quote";

    quote: string;

    attribution?: string;

    claimId: string;
  };

export type DesignedCta =
  SectionEvidence & {
    chapterId?: string;

    blockType: "cta";

    heading: string;

    body?: string;

    buttonLabel?: string;

    targetProjectSlug?: string;
  };

export type DesignedSection =
  | DesignedSectionIntro
  | DesignedRichText
  | DesignedMediaBlock
  | DesignedFullBleedMedia
  | DesignedSplitContent
  | DesignedMediaGallery
  | DesignedMetrics
  | DesignedQuote
  | DesignedCta;

export type FlexibleCaseStudyDesign = {
  renderMode: "flexible";

  sections: DesignedSection[];
};

/* ── Generic helpers ─────────────────────────────────── */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function nonEmpty(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    Boolean(value.trim())
  );
}

function exactKeys(
  value: Record<string, unknown>,
  allowed: string[],
  label: string,
) {
  const allowedSet =
    new Set(allowed);

  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) {
      throw new Error(
        `${label} contains unknown field: ${key}`,
      );
    }
  }
}

function stringArray(
  value: unknown,
  label: string,
): string[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        typeof item === "string" &&
        Boolean(item.trim()),
    )
  ) {
    throw new Error(
      `${label} must be an array of non-empty strings.`,
    );
  }

  return value.map(
    (item) =>
      item.trim(),
  );
}

function optionalString(
  value: unknown,
  label: string,
): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (!nonEmpty(value)) {
    throw new Error(
      `${label} must be a non-empty string or null.`,
    );
  }

  return value.trim();
}

/* ── Trusted request validation ──────────────────────── */

function validateDesignerRequest(
  request: DesignerRequest,
) {
  if (
    !request.plan ||
    request.plan.renderModeRecommendation !==
      "flexible"
  ) {
    throw new Error(
      "Case Study Designer requires an Architect plan recommending flexible render mode.",
    );
  }

  if (
    !Array.isArray(
      request.plan.chapters,
    ) ||
    request.plan.chapters.length === 0
  ) {
    throw new Error(
      "Case Study Designer requires at least one Architect chapter.",
    );
  }

  const chapterIds =
    new Set<string>();

  for (
    const chapter
    of request.plan.chapters
  ) {
    if (!nonEmpty(chapter.id)) {
      throw new Error(
        "Every Architect chapter requires an id.",
      );
    }

    if (chapterIds.has(chapter.id)) {
      throw new Error(
        `Duplicate Architect chapter id: ${chapter.id}`,
      );
    }

    chapterIds.add(
      chapter.id,
    );
  }

  if (
    !Array.isArray(request.claims) ||
    request.claims.length === 0
  ) {
    throw new Error(
      "Case Study Designer requires at least one evidence claim.",
    );
  }

  const claimIds =
    new Set<string>();

  for (const claim of request.claims) {
    if (!nonEmpty(claim.id)) {
      throw new Error(
        "Every Designer evidence claim requires an id.",
      );
    }

    if (claimIds.has(claim.id)) {
      throw new Error(
        `Duplicate Designer evidence claim id: ${claim.id}`,
      );
    }

    claimIds.add(
      claim.id,
    );
  }

  const assetIds =
    new Set<string>();

  for (
    const asset
    of request.mediaAssets ?? []
  ) {
    if (!nonEmpty(asset.id)) {
      throw new Error(
        "Every Designer media asset requires an id.",
      );
    }

    if (!nonEmpty(asset.title)) {
      throw new Error(
        `Designer media asset ${asset.id} requires a title.`,
      );
    }

    if (assetIds.has(asset.id)) {
      throw new Error(
        `Duplicate Designer media asset id: ${asset.id}`,
      );
    }

    assetIds.add(
      asset.id,
    );
  }

  const continuity =
    request.allowedContinuitySlugs ??
    [];

  if (
    !continuity.every(
      (slug) =>
        nonEmpty(slug),
    )
  ) {
    throw new Error(
      "allowedContinuitySlugs must contain only non-empty strings.",
    );
  }

  if (
    new Set(continuity).size !==
    continuity.length
  ) {
    throw new Error(
      "allowedContinuitySlugs contains duplicates.",
    );
  }

  const architectTarget =
    request.plan.ctaPlan
      .targetProjectSlug;

  if (
    architectTarget &&
    !continuity.includes(
      architectTarget,
    )
  ) {
    throw new Error(
      `Architect CTA target is not present in Designer continuity allowlist: ${architectTarget}`,
    );
  }
}

/* ── Prompt construction ─────────────────────────────── */

const DESIGNER_SYSTEM_PROMPT = `
You are Geek Creative Agency's Case Study Designer.

The Architect has already decided the strategic story architecture.

Your job is to translate that approved architecture into a semantic sequence
of Flexible case-study blocks.

You are NOT allowed to redesign the strategic story.

HARD RULES:

1. Follow the supplied Architect chapter order.

2. Every Architect chapter must appear in the resulting sections.

3. You may use ONLY these block types:

   - sectionIntro
   - richText
   - mediaBlock
   - fullBleedMedia
   - splitContent
   - mediaGallery
   - metrics
   - quote
   - cta

4. Do NOT create Payload Lexical JSON.

   richText.body and splitContent.body must remain plain editorial text.
   Application code will compile them into Lexical later.

5. EVIDENCE:

   Every factual/public section must cite supplied evidenceClaimIds.

   Use only publication-ready claims:
   - publishable=true
   - confidence is not "low"

   Do not invent facts, interpretation, causality, chronology, metrics,
   relationships or campaign scope.

6. CHAPTER BOUNDARY:

   A section assigned to an Architect chapter may use only evidence claims
   assigned to that chapter by the Architect.

7. METRICS:

   Metrics may use only claims whose type is "metric".

   Do not manufacture metric values.

   Preserve qualifiers, scope and approximation language.

   ARCHITECT METRIC PLAN IS MANDATORY:

   - Every claimId in the supplied Architect metricsPlan MUST appear exactly once
     in the designed case study inside a "metrics" block.

   - Place each planned metric only under an Architect chapter whose
     metricClaimIds contains that claimId.

   - The metric claimId MUST also appear in that metrics block's
     evidenceClaimIds.

   - Do not omit an Architect-planned metric.

   - Do not duplicate an Architect-planned metric.

   - Do not add metric items absent from the Architect metricsPlan.

   The downstream deterministic Flexible Quality Gate independently verifies
   this contract and fails closed when it is violated.

8. QUOTES:

   A quote block may use only a claim whose type is "quote".

   Never polish, rewrite or manufacture a quote.

9. MEDIA:

   You may select ONLY supplied media asset IDs.

   Never output:
   - URL
   - file path
   - legacySrc
   - CMS media ID
   - filename

   Media assets are selected by trusted assetId only.

10. CTA:

    Never create buttonHref.

    targetProjectSlug may use only an explicitly supplied allowed continuity
    slug and must follow the Architect CTA plan.

    CTA FIELD PAIRING:
    - buttonLabel and targetProjectSlug are an inseparable pair;
    - if the Architect CTA plan has no targetProjectSlug, output
      buttonLabel=null and targetProjectSlug=null;
    - if the Architect CTA plan has a targetProjectSlug, output that exact
      targetProjectSlug and a non-empty buttonLabel;
    - never output a buttonLabel without targetProjectSlug;
    - never output targetProjectSlug without buttonLabel;
    - do not invent a continuity target merely to create a button.

11. Never output flagship.

    This Designer creates Flexible semantic sections only.

12. Prefer useful editorial rhythm.

    A chapter may contain more than one block when that improves the story:
    for example sectionIntro → media → metrics.

13. Do not add decorative sections merely to increase section count.

14. The resulting structure is an INTERNAL Gold Standard candidate.
    It does not publish or write to Payload.
`.trim();

function claimsForPrompt(
  claims: EvidenceClaim[],
) {
  return claims.map(
    (claim) => ({
      id:
        claim.id,

      type:
        claim.type,

      statement:
        claim.statement,

      confidence:
        claim.confidence,

      publishable:
        claim.publishable,

      note:
        claim.note ?? null,
    }),
  );
}

function mediaForPrompt(
  assets: DesignerMediaAsset[],
) {
  return assets.map(
    (asset) => ({
      id:
        asset.id,

      title:
        asset.title,

      role:
        asset.role ?? null,

      description:
        asset.description ?? null,
    }),
  );
}

function buildDesignerPrompt(
  request: DesignerRequest,
): string {
  return JSON.stringify(
    {
      task:
        "Translate the approved Architect plan into evidence-bound Flexible case-study sections.",

      architectPlan:
        request.plan,

      evidenceClaims:
        claimsForPrompt(
          request.claims,
        ),

      trustedMediaAssets:
        mediaForPrompt(
          request.mediaAssets ?? [],
        ),

      allowedContinuitySlugs:
        request.allowedContinuitySlugs ??
        [],
    },
    null,
    2,
  );
}

/* ── Trusted reference validation ────────────────────── */

function requirePublishableClaim(
  id: string,
  claimById:
    Map<string, EvidenceClaim>,
  label: string,
): EvidenceClaim {
  const claim =
    claimById.get(id);

  if (!claim) {
    throw new Error(
      `${label} references unknown evidence claim: ${id}`,
    );
  }

  if (
    !claim.publishable ||
    claim.confidence === "low"
  ) {
    throw new Error(
      `${label} references evidence claim ${id}, which is not publication-ready.`,
    );
  }

  return claim;
}

function requireMetricClaim(
  id: string,
  claimById:
    Map<string, EvidenceClaim>,
  label: string,
): EvidenceClaim {
  const claim =
    requirePublishableClaim(
      id,
      claimById,
      label,
    );

  if (claim.type !== "metric") {
    throw new Error(
      `${label} references non-metric claim: ${id}`,
    );
  }

  return claim;
}

function requireQuoteClaim(
  id: string,
  claimById:
    Map<string, EvidenceClaim>,
  label: string,
): EvidenceClaim {
  const claim =
    requirePublishableClaim(
      id,
      claimById,
      label,
    );

  if (claim.type !== "quote") {
    throw new Error(
      `${label} references non-quote claim: ${id}`,
    );
  }

  return claim;
}

/* ── Output validation ───────────────────────────────── */

export function validateFlexibleCaseStudyDesign(
  input: unknown,
  request: DesignerRequest,
): FlexibleCaseStudyDesign {
  if (!isObject(input)) {
    throw new Error(
      "Case Study Designer output must be an object.",
    );
  }

  exactKeys(
    input,
    [
      "renderMode",
      "sections",
    ],
    "Designer output",
  );

  if (
    input.renderMode !==
    "flexible"
  ) {
    throw new Error(
      "Case Study Designer renderMode must be flexible.",
    );
  }

  if (
    !Array.isArray(input.sections) ||
    input.sections.length === 0
  ) {
    throw new Error(
      "Case Study Designer requires at least one section.",
    );
  }

  if (
    input.sections.length > 40
  ) {
    throw new Error(
      "Case Study Designer cannot produce more than 40 sections.",
    );
  }

  const claimById =
    new Map(
      request.claims.map(
        (claim) => [
          claim.id,
          claim,
        ] as const,
      ),
    );

  const assetById =
    new Map(
      (request.mediaAssets ?? [])
        .map(
          (asset) => [
            asset.id,
            asset,
          ] as const,
        ),
    );

  const continuity =
    new Set(
      request.allowedContinuitySlugs ??
      [],
    );

  const chapterIndex =
    new Map(
      request.plan.chapters.map(
        (chapter, index) => [
          chapter.id,
          index,
        ] as const,
      ),
    );

  const chapterById =
    new Map(
      request.plan.chapters.map(
        (chapter) => [
          chapter.id,
          chapter,
        ] as const,
      ),
    );

  const seenSectionIds =
    new Set<string>();

  const seenChapterIds =
    new Set<string>();

  let previousChapterIndex =
    -1;

  let ctaCount =
    0;

  const sections:
    DesignedSection[] = [];

  function validateChapter(
    chapterId: string,
    label: string,
  ) {
    const index =
      chapterIndex.get(
        chapterId,
      );

    if (index == null) {
      throw new Error(
        `${label} references unknown Architect chapter: ${chapterId}`,
      );
    }

    if (
      index <
      previousChapterIndex
    ) {
      throw new Error(
        `${label} breaks the approved Architect chapter order.`,
      );
    }

    previousChapterIndex =
      index;

    seenChapterIds.add(
      chapterId,
    );

    return chapterById.get(
      chapterId,
    )!;
  }

  function validateEvidenceForChapter(
    rawIds: unknown,
    chapterId: string,
    label: string,
    requireAtLeastOne = true,
  ): string[] {
    const ids =
      stringArray(
        rawIds,
        `${label}.evidenceClaimIds`,
      );

    if (
      requireAtLeastOne &&
      ids.length === 0
    ) {
      throw new Error(
        `${label} requires at least one evidence claim.`,
      );
    }

    const chapter =
      chapterById.get(
        chapterId,
      );

    if (!chapter) {
      throw new Error(
        `${label} references unknown Architect chapter: ${chapterId}`,
      );
    }

    const architectClaims =
      new Set([
        ...chapter.evidenceClaimIds,
        ...chapter.metricClaimIds,
      ]);

    for (const id of ids) {
      requirePublishableClaim(
        id,
        claimById,
        label,
      );

      if (
        !architectClaims.has(id)
      ) {
        throw new Error(
          `${label} references evidence claim ${id} outside Architect chapter ${chapterId}.`,
        );
      }
    }

    return ids;
  }

  function requireAsset(
    id: string,
    label: string,
  ) {
    if (!assetById.has(id)) {
      throw new Error(
        `${label} references non-allowlisted media asset: ${id}`,
      );
    }
  }

  for (
    const [
      index,
      raw,
    ] of input.sections.entries()
  ) {
    const label =
      `Designer section[${index}]`;

    if (!isObject(raw)) {
      throw new Error(
        `${label} must be an object.`,
      );
    }

    if (!nonEmpty(raw.id)) {
      throw new Error(
        `${label} requires id.`,
      );
    }

    const id =
      raw.id.trim();

    if (
      seenSectionIds.has(id)
    ) {
      throw new Error(
        `Duplicate Designer section id: ${id}`,
      );
    }

    seenSectionIds.add(id);

    if (
      typeof raw.blockType !==
        "string" ||
      !(
        DESIGNER_BLOCK_TYPES as
          readonly string[]
      ).includes(
        raw.blockType,
      )
    ) {
      throw new Error(
        `${label} has invalid blockType.`,
      );
    }

    const blockType =
      raw.blockType;

    /* ── CTA ───────────────────────────────────────── */

    if (
      blockType === "cta"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "heading",
          "body",
          "buttonLabel",
          "targetProjectSlug",
          "evidenceClaimIds",
        ],
        label,
      );

      ctaCount++;

      if (ctaCount > 1) {
        throw new Error(
          "Case Study Designer may produce at most one CTA section.",
        );
      }

      if (
        index !==
        input.sections.length - 1
      ) {
        throw new Error(
          "Case Study Designer CTA must be the final section.",
        );
      }

      const chapterId =
        optionalString(
          raw.chapterId,
          `${label}.chapterId`,
        );

      let evidenceClaimIds:
        string[];

      if (chapterId) {
        validateChapter(
          chapterId,
          label,
        );

        evidenceClaimIds =
          validateEvidenceForChapter(
            raw.evidenceClaimIds,
            chapterId,
            label,
            false,
          );
      } else {
        evidenceClaimIds =
          stringArray(
            raw.evidenceClaimIds,
            `${label}.evidenceClaimIds`,
          );

        for (
          const claimId
          of evidenceClaimIds
        ) {
          requirePublishableClaim(
            claimId,
            claimById,
            label,
          );
        }
      }

      if (!nonEmpty(raw.heading)) {
        throw new Error(
          `${label} requires heading.`,
        );
      }

      const body =
        optionalString(
          raw.body,
          `${label}.body`,
        );

      const buttonLabel =
        optionalString(
          raw.buttonLabel,
          `${label}.buttonLabel`,
        );

      const targetProjectSlug =
        optionalString(
          raw.targetProjectSlug,
          `${label}.targetProjectSlug`,
        );

      const architectTarget =
        request.plan.ctaPlan
          .targetProjectSlug;

      if (
        targetProjectSlug &&
        !continuity.has(
          targetProjectSlug,
        )
      ) {
        throw new Error(
          `${label} references non-allowlisted CTA target: ${targetProjectSlug}`,
        );
      }

      if (
        architectTarget &&
        targetProjectSlug !==
          architectTarget
      ) {
        throw new Error(
          `${label} does not follow the approved Architect CTA target.`,
        );
      }

      if (
        !architectTarget &&
        targetProjectSlug
      ) {
        throw new Error(
          `${label} invented a CTA target not approved by the Architect.`,
        );
      }

      if (
        targetProjectSlug &&
        !buttonLabel
      ) {
        throw new Error(
          `${label} requires buttonLabel when targetProjectSlug is present.`,
        );
      }

      if (
        buttonLabel &&
        !targetProjectSlug
      ) {
        throw new Error(
          `${label} cannot have buttonLabel without targetProjectSlug.`,
        );
      }

      sections.push({
        id,
        chapterId,
        blockType,
        heading:
          raw.heading.trim(),
        body,
        buttonLabel,
        targetProjectSlug,
        evidenceClaimIds,
      });

      continue;
    }

    /* Every other block must belong to an Architect chapter. */

    if (!nonEmpty(raw.chapterId)) {
      throw new Error(
        `${label} requires chapterId.`,
      );
    }

    const chapterId =
      raw.chapterId.trim();

    const chapter =
      validateChapter(
        chapterId,
        label,
      );

    /* ── Section intro ─────────────────────────────── */

    if (
      blockType ===
      "sectionIntro"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "eyebrow",
          "heading",
          "body",
          "evidenceClaimIds",
        ],
        label,
      );

      if (!nonEmpty(raw.heading)) {
        throw new Error(
          `${label} requires heading.`,
        );
      }

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
        );

      sections.push({
        id,
        chapterId,
        blockType,
        eyebrow:
          optionalString(
            raw.eyebrow,
            `${label}.eyebrow`,
          ),
        heading:
          raw.heading.trim(),
        body:
          optionalString(
            raw.body,
            `${label}.body`,
          ),
        evidenceClaimIds,
      });

      continue;
    }

    /* ── Rich text ─────────────────────────────────── */

    if (
      blockType ===
      "richText"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "body",
          "evidenceClaimIds",
        ],
        label,
      );

      if (!nonEmpty(raw.body)) {
        throw new Error(
          `${label} requires body.`,
        );
      }

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
        );

      sections.push({
        id,
        chapterId,
        blockType,
        body:
          raw.body.trim(),
        evidenceClaimIds,
      });

      continue;
    }

    /* ── Media block ───────────────────────────────── */

    if (
      blockType ===
      "mediaBlock"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "assetId",
          "evidenceClaimIds",
        ],
        label,
      );

      if (!nonEmpty(raw.assetId)) {
        throw new Error(
          `${label} requires assetId.`,
        );
      }

      const assetId =
        raw.assetId.trim();

      requireAsset(
        assetId,
        label,
      );

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
          false,
        );

      sections.push({
        id,
        chapterId,
        blockType,
        assetId,
        evidenceClaimIds,
      });

      continue;
    }

    /* ── Full bleed ────────────────────────────────── */

    if (
      blockType ===
      "fullBleedMedia"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "assetId",
          "overlayHeading",
          "evidenceClaimIds",
        ],
        label,
      );

      if (!nonEmpty(raw.assetId)) {
        throw new Error(
          `${label} requires assetId.`,
        );
      }

      const assetId =
        raw.assetId.trim();

      requireAsset(
        assetId,
        label,
      );

      const overlayHeading =
        optionalString(
          raw.overlayHeading,
          `${label}.overlayHeading`,
        );

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
          Boolean(
            overlayHeading,
          ),
        );

      sections.push({
        id,
        chapterId,
        blockType,
        assetId,
        overlayHeading,
        evidenceClaimIds,
      });

      continue;
    }

    /* ── Split content ─────────────────────────────── */

    if (
      blockType ===
      "splitContent"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "mediaSide",
          "body",
          "assetId",
          "evidenceClaimIds",
        ],
        label,
      );

      if (
        raw.mediaSide !==
          "left" &&
        raw.mediaSide !==
          "right"
      ) {
        throw new Error(
          `${label} has invalid mediaSide.`,
        );
      }

      if (!nonEmpty(raw.body)) {
        throw new Error(
          `${label} requires body.`,
        );
      }

      if (!nonEmpty(raw.assetId)) {
        throw new Error(
          `${label} requires assetId.`,
        );
      }

      const assetId =
        raw.assetId.trim();

      requireAsset(
        assetId,
        label,
      );

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
        );

      sections.push({
        id,
        chapterId,
        blockType,
        mediaSide:
          raw.mediaSide,
        body:
          raw.body.trim(),
        assetId,
        evidenceClaimIds,
      });

      continue;
    }

    /* ── Media gallery ─────────────────────────────── */

    if (
      blockType ===
      "mediaGallery"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "heading",
          "assetIds",
          "evidenceClaimIds",
        ],
        label,
      );

      const assetIds =
        stringArray(
          raw.assetIds,
          `${label}.assetIds`,
        );

      if (
        assetIds.length === 0
      ) {
        throw new Error(
          `${label} requires at least one media asset.`,
        );
      }

      if (
        new Set(assetIds).size !==
        assetIds.length
      ) {
        throw new Error(
          `${label} contains duplicate media asset IDs.`,
        );
      }

      for (
        const assetId
        of assetIds
      ) {
        requireAsset(
          assetId,
          label,
        );
      }

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
          false,
        );

      sections.push({
        id,
        chapterId,
        blockType,
        heading:
          optionalString(
            raw.heading,
            `${label}.heading`,
          ),
        assetIds,
        evidenceClaimIds,
      });

      continue;
    }

    /* ── Metrics ───────────────────────────────────── */

    if (
      blockType ===
      "metrics"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "heading",
          "items",
          "evidenceClaimIds",
        ],
        label,
      );

      if (
        !Array.isArray(
          raw.items,
        ) ||
        raw.items.length === 0
      ) {
        throw new Error(
          `${label} requires at least one metric item.`,
        );
      }

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
        );

      const metricItems:
        DesignedMetricItem[] = [];

      const seenMetricClaims =
        new Set<string>();

      for (
        const [
          metricIndex,
          item,
        ] of raw.items.entries()
      ) {
        const metricLabel =
          `${label}.items[${metricIndex}]`;

        if (!isObject(item)) {
          throw new Error(
            `${metricLabel} must be an object.`,
          );
        }

        exactKeys(
          item,
          [
            "claimId",
            "value",
            "label",
            "prefix",
            "suffix",
            "note",
          ],
          metricLabel,
        );

        if (!nonEmpty(item.claimId)) {
          throw new Error(
            `${metricLabel} requires claimId.`,
          );
        }

        const claimId =
          item.claimId.trim();

        requireMetricClaim(
          claimId,
          claimById,
          metricLabel,
        );

        if (
          !chapter.metricClaimIds
            .includes(
              claimId,
            )
        ) {
          throw new Error(
            `${metricLabel} references metric ${claimId} outside Architect chapter ${chapterId}.`,
          );
        }

        if (
          !evidenceClaimIds
            .includes(
              claimId,
            )
        ) {
          throw new Error(
            `${metricLabel} claim ${claimId} must also appear in the section evidenceClaimIds.`,
          );
        }

        if (
          seenMetricClaims.has(
            claimId,
          )
        ) {
          throw new Error(
            `${label} contains duplicate metric claim: ${claimId}`,
          );
        }

        seenMetricClaims.add(
          claimId,
        );

        if (!nonEmpty(item.value)) {
          throw new Error(
            `${metricLabel} requires value.`,
          );
        }

        if (!nonEmpty(item.label)) {
          throw new Error(
            `${metricLabel} requires label.`,
          );
        }

        metricItems.push({
          claimId,

          value:
            item.value.trim(),

          label:
            item.label.trim(),

          prefix:
            optionalString(
              item.prefix,
              `${metricLabel}.prefix`,
            ),

          suffix:
            optionalString(
              item.suffix,
              `${metricLabel}.suffix`,
            ),

          note:
            optionalString(
              item.note,
              `${metricLabel}.note`,
            ),
        });
      }

      sections.push({
        id,
        chapterId,
        blockType,

        heading:
          optionalString(
            raw.heading,
            `${label}.heading`,
          ),

        items:
          metricItems,

        evidenceClaimIds,
      });

      continue;
    }

    /* ── Quote ─────────────────────────────────────── */

    if (
      blockType ===
      "quote"
    ) {
      exactKeys(
        raw,
        [
          "id",
          "chapterId",
          "blockType",
          "quote",
          "attribution",
          "claimId",
          "evidenceClaimIds",
        ],
        label,
      );

      if (!nonEmpty(raw.quote)) {
        throw new Error(
          `${label} requires quote.`,
        );
      }

      if (!nonEmpty(raw.claimId)) {
        throw new Error(
          `${label} requires claimId.`,
        );
      }

      const claimId =
        raw.claimId.trim();

      requireQuoteClaim(
        claimId,
        claimById,
        label,
      );

      if (
        !chapter.evidenceClaimIds
          .includes(
            claimId,
          )
      ) {
        throw new Error(
          `${label} references quote ${claimId} outside Architect chapter ${chapterId}.`,
        );
      }

      const evidenceClaimIds =
        validateEvidenceForChapter(
          raw.evidenceClaimIds,
          chapterId,
          label,
        );

      if (
        !evidenceClaimIds
          .includes(
            claimId,
          )
      ) {
        throw new Error(
          `${label} quote claim ${claimId} must appear in evidenceClaimIds.`,
        );
      }

      sections.push({
        id,
        chapterId,
        blockType,

        quote:
          raw.quote.trim(),

        attribution:
          optionalString(
            raw.attribution,
            `${label}.attribution`,
          ),

        claimId,

        evidenceClaimIds,
      });

      continue;
    }

    throw new Error(
      `${label} uses unsupported block type: ${blockType}`,
    );
  }

  /* Every Architect chapter must survive into the designed case study. */

  for (
    const chapter
    of request.plan.chapters
  ) {
    if (
      !seenChapterIds.has(
        chapter.id,
      )
    ) {
      throw new Error(
        `Designer omitted Architect chapter: ${chapter.id}`,
      );
    }
  }

  return {
    renderMode:
      "flexible",

    sections,
  };
}

/* ── Public Designer API ─────────────────────────────── */

export async function designCaseStudy(
  request: DesignerRequest,
  options: DesignerOptions = {},
): Promise<FlexibleCaseStudyDesign> {
  validateDesignerRequest(
    request,
  );

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (
    !options.client &&
    !apiKey
  ) {
    throw new Error(
      "OPENAI_API_KEY is required for Case Study Designer generation.",
    );
  }

  const client =
    options.client ??
    new OpenAI({
      apiKey,
    });

  const model =
    request.model ??
    process.env
      .CASE_STUDY_AGENT_DESIGNER_MODEL ??
    process.env
      .CASE_STUDY_AGENT_MODEL ??
    "gpt-5.6";

  const response =
    await client.responses.create({
      model,

      input: [
        {
          role: "system",
          content:
            DESIGNER_SYSTEM_PROMPT,
        },

        {
          role: "user",
          content:
            buildDesignerPrompt(
              request,
            ),
        },
      ],

      text: {
        format:
          DESIGNER_RESPONSE_FORMAT as any,
      },
    });

  const outputText =
    response.output_text?.trim();

  if (!outputText) {
    throw new Error(
      "Case Study Designer returned no structured output.",
    );
  }

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(
        outputText,
      );
  } catch (error) {
    throw new Error(
      `Case Study Designer returned invalid JSON despite Structured Outputs: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  return validateFlexibleCaseStudyDesign(
    parsed,
    request,
  );
}
