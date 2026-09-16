/**
 * GOLD STANDARD CASE STUDY AGENT — CASE STUDY ARCHITECT
 *
 * Evidence-backed planning layer.
 *
 * Boundary:
 *
 * trusted verified claims
 *   → OpenAI Structured Output
 *   → local deterministic validation
 *   → CaseStudyDesignPlan
 *
 * NO Payload.
 * NO database.
 * NO CMS write.
 * NO publishing.
 */

import OpenAI from "openai";

import {
  ARCHITECTURE_RESPONSE_FORMAT,
  CHAPTER_ROLES,
  MEDIA_ROLES,
} from "./architectureSchema";

import type {
  EvidenceClaim,
} from "./types";

import type {
  ProjectHint,
} from "./generator";

export type ChapterRole =
  typeof CHAPTER_ROLES[number];

export type MediaRole =
  typeof MEDIA_ROLES[number];

export type CaseStudyDesignChapter = {
  id: string;

  role: ChapterRole;

  headingDirection: string;

  purpose: string;

  evidenceClaimIds: string[];

  metricClaimIds: string[];

  mediaRole?: MediaRole;

  toneRecommendation:
    | "light"
    | "dark"
    | "neutral";
};

export type MetricsPlanItem = {
  claimId: string;

  role: string;

  placement: string;

  scopeNote?: string;
};

export type MediaPlanItem = {
  role: MediaRole;

  placement: string;

  purpose: string;

  evidenceClaimIds: string[];
};

export type ContinuityPlan = {
  previousProjectSlug?: string;

  nextProjectSlug?: string;

  progression: string;

  rationale: string;
};

export type CtaPlan = {
  purpose: string;

  recommendedDirection: string;

  targetProjectSlug?: string;
};

export type CaseStudyDesignPlan = {
  narrativeThesis: string;

  storyStrategy: string;

  renderModeRecommendation:
    | "standard"
    | "flexible";

  chapters:
    CaseStudyDesignChapter[];

  metricsPlan:
    MetricsPlanItem[];

  mediaPlan:
    MediaPlanItem[];

  continuityPlan?:
    ContinuityPlan;

  ctaPlan:
    CtaPlan;

  designRationale: string;
};

export type ArchitectPortfolioContext = {
  relationships: {
    companySlug?: string;
    brandSlug?: string;
    businessCategorySlugs: string[];
    serviceSlugs: string[];
    solutionSlugs: string[];
  };

  /**
   * Only evidence-validated Solution / IP relationships.
   */
  solutions: Array<{
    slug: string;
    evidenceClaimIds: string[];
  }>;
};

export type ArchitectRequest = {
  claims: EvidenceClaim[];

  projectHint?: ProjectHint;

  /**
   * Read-only operator-validated portfolio context.
   *
   * The Architect may use this to understand positioning,
   * but cannot assign or modify portfolio relationships.
   */
  portfolioContext?: ArchitectPortfolioContext;

  /**
   * Explicit trusted allowlist.
   *
   * The model may recommend continuity only to one of these slugs.
   */
  allowedContinuitySlugs?: string[];

  /**
   * Defaults to:
   * CASE_STUDY_AGENT_ARCHITECT_MODEL
   * → CASE_STUDY_AGENT_MODEL
   * → gpt-5.6
   */
  model?: string;
};

export type ArchitectOptions = {
  client?: OpenAI;
};

/* ── Helpers ───────────────────────────────────────────── */

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
  object: Record<string, unknown>,
  allowed: string[],
  label: string,
) {
  const allowedSet =
    new Set(allowed);

  for (const key of Object.keys(object)) {
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

/* ── Request validation ───────────────────────────────── */

function validateRequest(
  request: ArchitectRequest,
) {
  if (
    !Array.isArray(request.claims) ||
    request.claims.length === 0
  ) {
    throw new Error(
      "Case Study Architect requires at least one evidence claim.",
    );
  }

  const ids =
    new Set<string>();

  for (const claim of request.claims) {
    if (!nonEmpty(claim.id)) {
      throw new Error(
        "Every Architect evidence claim requires an id.",
      );
    }

    if (ids.has(claim.id)) {
      throw new Error(
        `Duplicate Architect evidence claim id: ${claim.id}`,
      );
    }

    ids.add(claim.id);

    if (!nonEmpty(claim.statement)) {
      throw new Error(
        `Architect evidence claim ${claim.id} has no statement.`,
      );
    }
  }

  const continuity =
    request.allowedContinuitySlugs ?? [];

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
}

/* ── Prompt ───────────────────────────────────────────── */

const ARCHITECT_SYSTEM_PROMPT = `
You are Geek Creative Agency's Case Study Architect.

Your role is NOT to write the final case study.

Your role is to determine the strongest evidence-supported editorial
architecture for the case study.

You receive trusted evidence claims.

HARD RULES:

1. Use ONLY the supplied evidence claims and trusted operator context.

2. Never invent:
   - facts
   - metrics
   - media assets
   - filenames
   - URLs
   - project relationships
   - campaign continuity
   - solutions/IP
   - chronology
   - causality

2A. Trusted portfolio context is READ-ONLY operator context.
    You may use supplied Company, Brand, Industry, Service and validated
    Solution/IP relationships to understand strategic positioning.

    You must NEVER:
    - create a new portfolio relationship
    - remove or rename a supplied relationship
    - infer a Solution/IP that is not supplied
    - treat portfolio context itself as evidence for a factual campaign claim

    Solution/IP relationships may be referenced only when explicitly supplied
    in trustedPortfolioContext.

3. Do NOT force every project into:
   Challenge → Insight → Idea → Execution → Outcome.

4. Choose the chapter count and chapter order that best expresses the
   supported story.

5. Every substantive chapter must cite one or more supplied evidenceClaimIds.

6. metricClaimIds and metricsPlan may reference ONLY supplied claims whose
   claim type is "metric".

7. Use only publication-ready evidence for public-facing architecture:
   publishable=true and confidence not equal to "low".

8. renderModeRecommendation may be:
   - standard
   - flexible

   Never flagship.

9. Media planning describes MEDIA ROLES only.
   Never invent:
   - asset paths
   - file names
   - URLs

10. Continuity:
    previousProjectSlug, nextProjectSlug and CTA targetProjectSlug may use
    ONLY explicitly supplied allowedContinuitySlugs.

    If continuity is not supported, return null values / no continuity plan.

11. The design plan is internal editorial intelligence.
    It is not a publication claim and does not enter Payload directly.

12. Prefer the strongest true story over the most dramatic story.

13. Explain why the selected structure is better than blindly applying a
    generic template.
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

function buildPrompt(
  request: ArchitectRequest,
): string {
  return JSON.stringify(
    {
      task:
        "Design the evidence-backed editorial architecture for one Geek Creative Agency case study.",

      projectHint:
        request.projectHint ?? null,

      trustedPortfolioContext:
        request.portfolioContext ?? null,

      allowedContinuitySlugs:
        request.allowedContinuitySlugs ?? [],

      evidenceClaims:
        claimsForPrompt(
          request.claims,
        ),
    },
    null,
    2,
  );
}

/* ── Trusted local validation ─────────────────────────── */

function validateClaimReference(
  id: string,
  claimById: Map<string, EvidenceClaim>,
  label: string,
) {
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

function validateMetricReference(
  id: string,
  claimById: Map<string, EvidenceClaim>,
  label: string,
) {
  const claim =
    validateClaimReference(
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

export function validateCaseStudyDesignPlan(
  input: unknown,
  request: ArchitectRequest,
): CaseStudyDesignPlan {
  if (!isObject(input)) {
    throw new Error(
      "Architect output must be an object.",
    );
  }

  exactKeys(
    input,
    [
      "narrativeThesis",
      "storyStrategy",
      "renderModeRecommendation",
      "chapters",
      "metricsPlan",
      "mediaPlan",
      "continuityPlan",
      "ctaPlan",
      "designRationale",
    ],
    "Architect output",
  );

  if (!nonEmpty(input.narrativeThesis)) {
    throw new Error(
      "Architect output requires narrativeThesis.",
    );
  }

  if (!nonEmpty(input.storyStrategy)) {
    throw new Error(
      "Architect output requires storyStrategy.",
    );
  }

  if (
    input.renderModeRecommendation !== "standard" &&
    input.renderModeRecommendation !== "flexible"
  ) {
    throw new Error(
      "Architect renderModeRecommendation must be standard or flexible.",
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

  if (
    !Array.isArray(input.chapters) ||
    input.chapters.length === 0
  ) {
    throw new Error(
      "Architect output requires at least one chapter.",
    );
  }

  const chapterIds =
    new Set<string>();

  const chapters:
    CaseStudyDesignChapter[] =
    input.chapters.map(
      (raw, index) => {
        if (!isObject(raw)) {
          throw new Error(
            `Architect chapter[${index}] must be an object.`,
          );
        }

        exactKeys(
          raw,
          [
            "id",
            "role",
            "headingDirection",
            "purpose",
            "evidenceClaimIds",
            "metricClaimIds",
            "mediaRole",
            "toneRecommendation",
          ],
          `Architect chapter[${index}]`,
        );

        if (!nonEmpty(raw.id)) {
          throw new Error(
            `Architect chapter[${index}] requires id.`,
          );
        }

        const id =
          raw.id.trim();

        if (chapterIds.has(id)) {
          throw new Error(
            `Duplicate Architect chapter id: ${id}`,
          );
        }

        chapterIds.add(id);

        if (
          typeof raw.role !== "string" ||
          !(
            CHAPTER_ROLES as readonly string[]
          ).includes(raw.role)
        ) {
          throw new Error(
            `Architect chapter ${id} has invalid role.`,
          );
        }

        if (!nonEmpty(raw.headingDirection)) {
          throw new Error(
            `Architect chapter ${id} requires headingDirection.`,
          );
        }

        if (!nonEmpty(raw.purpose)) {
          throw new Error(
            `Architect chapter ${id} requires purpose.`,
          );
        }

        const evidenceClaimIds =
          stringArray(
            raw.evidenceClaimIds,
            `Architect chapter ${id}.evidenceClaimIds`,
          );

        if (
          evidenceClaimIds.length === 0
        ) {
          throw new Error(
            `Architect chapter ${id} requires at least one evidence claim.`,
          );
        }

        for (const claimId of evidenceClaimIds) {
          validateClaimReference(
            claimId,
            claimById,
            `Architect chapter ${id}`,
          );
        }

        const metricClaimIds =
          stringArray(
            raw.metricClaimIds,
            `Architect chapter ${id}.metricClaimIds`,
          );

        for (const claimId of metricClaimIds) {
          validateMetricReference(
            claimId,
            claimById,
            `Architect chapter ${id}`,
          );
        }

        let mediaRole:
          MediaRole | undefined;

        if (raw.mediaRole != null) {
          if (
            typeof raw.mediaRole !== "string" ||
            !(
              MEDIA_ROLES as readonly string[]
            ).includes(raw.mediaRole)
          ) {
            throw new Error(
              `Architect chapter ${id} has invalid mediaRole.`,
            );
          }

          mediaRole =
            raw.mediaRole as MediaRole;
        }

        if (
          raw.toneRecommendation !== "light" &&
          raw.toneRecommendation !== "dark" &&
          raw.toneRecommendation !== "neutral"
        ) {
          throw new Error(
            `Architect chapter ${id} has invalid toneRecommendation.`,
          );
        }

        return {
          id,

          role:
            raw.role as ChapterRole,

          headingDirection:
            raw.headingDirection.trim(),

          purpose:
            raw.purpose.trim(),

          evidenceClaimIds,

          metricClaimIds,

          mediaRole,

          toneRecommendation:
            raw.toneRecommendation,
        };
      },
    );

  if (!Array.isArray(input.metricsPlan)) {
    throw new Error(
      "Architect metricsPlan must be an array.",
    );
  }

  const metricsPlan:
    MetricsPlanItem[] =
    input.metricsPlan.map(
      (raw, index) => {
        if (!isObject(raw)) {
          throw new Error(
            `Architect metricsPlan[${index}] must be an object.`,
          );
        }

        exactKeys(
          raw,
          [
            "claimId",
            "role",
            "placement",
            "scopeNote",
          ],
          `Architect metricsPlan[${index}]`,
        );

        if (!nonEmpty(raw.claimId)) {
          throw new Error(
            `Architect metricsPlan[${index}] requires claimId.`,
          );
        }

        validateMetricReference(
          raw.claimId.trim(),
          claimById,
          `Architect metricsPlan[${index}]`,
        );

        if (!nonEmpty(raw.role)) {
          throw new Error(
            `Architect metricsPlan[${index}] requires role.`,
          );
        }

        if (!nonEmpty(raw.placement)) {
          throw new Error(
            `Architect metricsPlan[${index}] requires placement.`,
          );
        }

        return {
          claimId:
            raw.claimId.trim(),

          role:
            raw.role.trim(),

          placement:
            raw.placement.trim(),

          scopeNote:
            optionalString(
              raw.scopeNote,
              `Architect metricsPlan[${index}].scopeNote`,
            ),
        };
      },
    );

  if (!Array.isArray(input.mediaPlan)) {
    throw new Error(
      "Architect mediaPlan must be an array.",
    );
  }

  const mediaPlan:
    MediaPlanItem[] =
    input.mediaPlan.map(
      (raw, index) => {
        if (!isObject(raw)) {
          throw new Error(
            `Architect mediaPlan[${index}] must be an object.`,
          );
        }

        exactKeys(
          raw,
          [
            "role",
            "placement",
            "purpose",
            "evidenceClaimIds",
          ],
          `Architect mediaPlan[${index}]`,
        );

        if (
          typeof raw.role !== "string" ||
          !(
            MEDIA_ROLES as readonly string[]
          ).includes(raw.role)
        ) {
          throw new Error(
            `Architect mediaPlan[${index}] has invalid role.`,
          );
        }

        if (!nonEmpty(raw.placement)) {
          throw new Error(
            `Architect mediaPlan[${index}] requires placement.`,
          );
        }

        if (!nonEmpty(raw.purpose)) {
          throw new Error(
            `Architect mediaPlan[${index}] requires purpose.`,
          );
        }

        const evidenceClaimIds =
          stringArray(
            raw.evidenceClaimIds,
            `Architect mediaPlan[${index}].evidenceClaimIds`,
          );

        for (const claimId of evidenceClaimIds) {
          validateClaimReference(
            claimId,
            claimById,
            `Architect mediaPlan[${index}]`,
          );
        }

        return {
          role:
            raw.role as MediaRole,

          placement:
            raw.placement.trim(),

          purpose:
            raw.purpose.trim(),

          evidenceClaimIds,
        };
      },
    );

  const allowedContinuity =
    new Set(
      request.allowedContinuitySlugs ?? [],
    );

  let continuityPlan:
    ContinuityPlan | undefined;

  if (input.continuityPlan != null) {
    if (!isObject(input.continuityPlan)) {
      throw new Error(
        "Architect continuityPlan must be an object or null.",
      );
    }

    exactKeys(
      input.continuityPlan,
      [
        "previousProjectSlug",
        "nextProjectSlug",
        "progression",
        "rationale",
      ],
      "Architect continuityPlan",
    );

    const previousProjectSlug =
      optionalString(
        input.continuityPlan.previousProjectSlug,
        "Architect continuityPlan.previousProjectSlug",
      );

    const nextProjectSlug =
      optionalString(
        input.continuityPlan.nextProjectSlug,
        "Architect continuityPlan.nextProjectSlug",
      );

    for (
      const slug of [
        previousProjectSlug,
        nextProjectSlug,
      ]
    ) {
      if (
        slug &&
        !allowedContinuity.has(slug)
      ) {
        throw new Error(
          `Architect continuity references non-allowlisted project slug: ${slug}`,
        );
      }
    }

    if (!nonEmpty(input.continuityPlan.progression)) {
      throw new Error(
        "Architect continuityPlan requires progression.",
      );
    }

    if (!nonEmpty(input.continuityPlan.rationale)) {
      throw new Error(
        "Architect continuityPlan requires rationale.",
      );
    }

    continuityPlan = {
      previousProjectSlug,
      nextProjectSlug,

      progression:
        input.continuityPlan.progression.trim(),

      rationale:
        input.continuityPlan.rationale.trim(),
    };
  }

  if (!isObject(input.ctaPlan)) {
    throw new Error(
      "Architect ctaPlan must be an object.",
    );
  }

  exactKeys(
    input.ctaPlan,
    [
      "purpose",
      "recommendedDirection",
      "targetProjectSlug",
    ],
    "Architect ctaPlan",
  );

  if (!nonEmpty(input.ctaPlan.purpose)) {
    throw new Error(
      "Architect ctaPlan requires purpose.",
    );
  }

  if (!nonEmpty(input.ctaPlan.recommendedDirection)) {
    throw new Error(
      "Architect ctaPlan requires recommendedDirection.",
    );
  }

  const targetProjectSlug =
    optionalString(
      input.ctaPlan.targetProjectSlug,
      "Architect ctaPlan.targetProjectSlug",
    );

  if (
    targetProjectSlug &&
    !allowedContinuity.has(
      targetProjectSlug,
    )
  ) {
    throw new Error(
      `Architect CTA references non-allowlisted project slug: ${targetProjectSlug}`,
    );
  }

  if (!nonEmpty(input.designRationale)) {
    throw new Error(
      "Architect output requires designRationale.",
    );
  }

  return {
    narrativeThesis:
      input.narrativeThesis.trim(),

    storyStrategy:
      input.storyStrategy.trim(),

    renderModeRecommendation:
      input.renderModeRecommendation,

    chapters,

    metricsPlan,

    mediaPlan,

    continuityPlan,

    ctaPlan: {
      purpose:
        input.ctaPlan.purpose.trim(),

      recommendedDirection:
        input.ctaPlan.recommendedDirection.trim(),

      targetProjectSlug,
    },

    designRationale:
      input.designRationale.trim(),
  };
}

/* ── Public API ───────────────────────────────────────── */

export async function architectCaseStudy(
  request: ArchitectRequest,
  options: ArchitectOptions = {},
): Promise<CaseStudyDesignPlan> {
  validateRequest(request);

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (
    !options.client &&
    !apiKey
  ) {
    throw new Error(
      "OPENAI_API_KEY is required for Case Study Architect generation.",
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
      .CASE_STUDY_AGENT_ARCHITECT_MODEL ??
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
            ARCHITECT_SYSTEM_PROMPT,
        },

        {
          role: "user",
          content:
            buildPrompt(request),
        },
      ],

      text: {
        format:
          ARCHITECTURE_RESPONSE_FORMAT as any,
      },
    });

  const outputText =
    response.output_text?.trim();

  if (!outputText) {
    throw new Error(
      "Case Study Architect returned no structured output.",
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
      `Case Study Architect returned invalid JSON despite Structured Outputs: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  return validateCaseStudyDesignPlan(
    parsed,
    request,
  );
}
