/**
 * GOLD STANDARD CASE STUDY AGENT — INDEPENDENT SEMANTIC CRITIC
 *
 * This module reviews a finished Flexible case study for:
 *
 * - evidence overreach;
 * - scope / attribution clarity;
 * - narrative logic;
 * - strategic depth;
 * - repetition;
 * - omitted publishable evidence;
 * - architecture fit;
 * - continuity integrity;
 * - metric interpretation.
 *
 * It does NOT rewrite.
 * It does NOT compile.
 * It does NOT access Payload.
 * It does NOT write to CMS or DB.
 * It does NOT publish.
 */

import OpenAI from "openai";

import {
  SEMANTIC_CRITIC_CATEGORIES,
  SEMANTIC_CRITIC_RESPONSE_FORMAT,
  SEMANTIC_CRITIC_SEVERITIES,
} from "./semanticCriticSchema";

import type {
  EvidenceClaim,
} from "./types";

import type {
  CaseStudyDesignPlan,
} from "./architect";

import type {
  FlexibleCaseStudyDesign,
} from "./designer";

/* ── Types ─────────────────────────────────────────── */

export type SemanticCriticCategory =
  typeof SEMANTIC_CRITIC_CATEGORIES[number];

export type SemanticCriticSeverity =
  typeof SEMANTIC_CRITIC_SEVERITIES[number];

export type SemanticCriticFinding = {
  id:
    string;

  category:
    SemanticCriticCategory;

  severity:
    SemanticCriticSeverity;

  message:
    string;

  sectionIds:
    string[];

  claimIds:
    string[];
};

export type SemanticCriticResult = {
  status:
    | "pass"
    | "partial"
    | "fail";

  /**
   * Semantic approval only.
   *
   * This never means automatic CMS publication.
   */
  draftReady:
    boolean;

  /**
   * Deterministically calculated.
   * The model cannot assign its own score.
   */
  score:
    number;

  summary:
    string;

  findings:
    SemanticCriticFinding[];
};

export type SemanticCriticRequest = {
  claims:
    EvidenceClaim[];

  architecture:
    CaseStudyDesignPlan;

  design:
    FlexibleCaseStudyDesign;

  model?:
    string;
};

export type SemanticCriticOptions = {
  client?:
    OpenAI;
};

/* ── Prompt ────────────────────────────────────────── */

const SEMANTIC_CRITIC_SYSTEM_PROMPT = `
You are the independent semantic critic inside the Gold Standard Case Study Agent.

You are NOT the writer.
You are NOT the architect.
You are NOT the designer.

Your role is to audit the finished case-study story against the supplied publication-ready evidence.

Do not rewrite the case study.
Do not propose replacement copy.
Do not create new facts.
Do not create new metrics.
Do not invent campaign context.
Do not infer relationships that are not supported.
Do not treat visual assets as factual evidence.

Audit for MATERIAL problems only.

Review these dimensions:

1. EVIDENCE OVERREACH
Flag public copy that goes materially beyond the supplied evidence.
This includes unsupported causality, attribution, chronology, superlatives,
business impact, ROI, revenue, value, strategic intent or campaign outcomes.

2. SCOPE CLARITY
Check whether Geek-specific results, wider-campaign results, estimates,
historical comparisons, subsets and different time periods remain clearly
distinguished.

3. NARRATIVE LOGIC
Check whether the story progresses coherently and whether conclusions
actually follow from the evidence presented.

4. STRATEGIC DEPTH
Check whether the case study explains the meaningful strategic mechanism
supported by evidence rather than merely listing activity.

Do not demand strategic claims that the evidence cannot support.

5. REPETITION
Flag material repetition that weakens the case study.
Do not flag normal thematic reinforcement.

6. OMITTED EVIDENCE
Flag important publication-ready evidence that is materially relevant to
the approved architecture but has been omitted from the final story.

Never recommend using low-confidence or non-publishable evidence.

7. ARCHITECTURE FIT
Check whether the finished sections actually fulfil the Architect's
approved chapter purposes and story strategy.

Do not force a fixed Challenge / Insight / Idea / Execution / Outcome
template.

8. CONTINUITY INTEGRITY
Check whether previous / next campaign progression is stated more strongly
than the supplied evidence permits.

9. METRIC INTERPRETATION
Check that a metric is not given a stronger meaning than its evidence
supports.

Severity rules:

ERROR:
Use only for a material semantic problem that should block draft readiness,
such as factual overreach, misleading attribution, unsupported causality,
misrepresented metrics, unsupported continuity, or a serious contradiction
between story and evidence.

WARNING:
Use for non-blocking but meaningful weaknesses such as repetition,
underdeveloped supported strategy, unclear flow, or an important omitted
publication-ready point.

A strong case study may legitimately have zero findings.

Every finding must be anchored to at least one supplied section ID or
publication-ready claim ID.

For evidence-overreach findings, cite both the relevant section ID and
the evidence claim ID(s).

For repetition findings, cite at least two section IDs.

For omitted-evidence findings, cite the omitted publication-ready claim ID.

Return only the required structured output.
`.trim();

/* ── Generic validation helpers ───────────────────── */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function nonEmpty(
  value: unknown,
): value is string {
  return (
    typeof value ===
      "string" &&
    Boolean(
      value.trim(),
    )
  );
}

function assertExactKeys(
  value:
    Record<string, unknown>,
  allowed:
    string[],
  context:
    string,
) {
  const allowedSet =
    new Set(
      allowed,
    );

  for (
    const key
    of Object.keys(
      value,
    )
  ) {
    if (
      !allowedSet.has(
        key,
      )
    ) {
      throw new Error(
        `${context} contains unknown field: ${key}`,
      );
    }
  }

  for (
    const key
    of allowed
  ) {
    if (
      !(key in value)
    ) {
      throw new Error(
        `${context} is missing required field: ${key}`,
      );
    }
  }
}

function stringArray(
  value:
    unknown,
  context:
    string,
): string[] {
  if (
    !Array.isArray(
      value,
    )
  ) {
    throw new Error(
      `${context} must be an array.`,
    );
  }

  const result:
    string[] =
    [];

  const seen =
    new Set<string>();

  for (
    const item
    of value
  ) {
    if (
      !nonEmpty(
        item,
      )
    ) {
      throw new Error(
        `${context} must contain only non-empty strings.`,
      );
    }

    const cleaned =
      item.trim();

    if (
      seen.has(
        cleaned,
      )
    ) {
      throw new Error(
        `${context} contains duplicate value: ${cleaned}`,
      );
    }

    seen.add(
      cleaned,
    );

    result.push(
      cleaned,
    );
  }

  return result;
}

function scoreFor(
  findings:
    SemanticCriticFinding[],
): number {
  let score =
    100;

  for (
    const finding
    of findings
  ) {
    if (
      finding.severity ===
      "error"
    ) {
      score -=
        18;
    }

    if (
      finding.severity ===
      "warning"
    ) {
      score -=
        6;
    }
  }

  return Math.max(
    0,
    Math.min(
      100,
      score,
    ),
  );
}

/* ── Request validation ───────────────────────────── */

function validateRequest(
  request:
    SemanticCriticRequest,
) {
  if (
    !Array.isArray(
      request.claims,
    )
  ) {
    throw new Error(
      "Semantic Critic claims must be an array.",
    );
  }

  const publicClaims =
    request.claims.filter(
      (claim) =>
        claim.publishable &&
        claim.confidence !==
          "low",
    );

  if (
    publicClaims.length ===
    0
  ) {
    throw new Error(
      "Semantic Critic requires at least one publication-ready evidence claim.",
    );
  }

  const claimIds =
    new Set<string>();

  for (
    const claim
    of publicClaims
  ) {
    if (
      !nonEmpty(
        claim.id,
      )
    ) {
      throw new Error(
        "Semantic Critic evidence claim requires an ID.",
      );
    }

    if (
      claimIds.has(
        claim.id,
      )
    ) {
      throw new Error(
        `Semantic Critic received duplicate evidence claim ID: ${claim.id}`,
      );
    }

    claimIds.add(
      claim.id,
    );
  }

  if (
    request.architecture
      .renderModeRecommendation !==
    "flexible"
  ) {
    throw new Error(
      "Semantic Critic requires Flexible Architect output.",
    );
  }

  if (
    request.design
      .renderMode !==
    "flexible"
  ) {
    throw new Error(
      "Semantic Critic requires Flexible Designer output.",
    );
  }

  if (
    request.design
      .sections.length ===
    0
  ) {
    throw new Error(
      "Semantic Critic requires at least one designed section.",
    );
  }

  const sectionIds =
    new Set<string>();

  for (
    const section
    of request.design
      .sections
  ) {
    if (
      !nonEmpty(
        section.id,
      )
    ) {
      throw new Error(
        "Semantic Critic requires every designed section to have an ID.",
      );
    }

    if (
      sectionIds.has(
        section.id,
      )
    ) {
      throw new Error(
        `Semantic Critic received duplicate section ID: ${section.id}`,
      );
    }

    sectionIds.add(
      section.id,
    );
  }
}

/* ── Prompt construction ──────────────────────────── */

function buildPrompt(
  request:
    SemanticCriticRequest,
): string {
  const publicationReadyClaims =
    request.claims.filter(
      (claim) =>
        claim.publishable &&
        claim.confidence !==
          "low",
    );

  return JSON.stringify(
    {
      publicationReadyEvidence:
        publicationReadyClaims,

      approvedArchitecture:
        request.architecture,

      finishedDesign:
        request.design,
    },
    null,
    2,
  );
}

/* ── Structured-output validation ─────────────────── */

export function validateSemanticCriticOutput(
  input:
    unknown,
  request:
    SemanticCriticRequest,
): Omit<
  SemanticCriticResult,
  | "status"
  | "draftReady"
  | "score"
> {
  if (
    !isObject(
      input,
    )
  ) {
    throw new Error(
      "Semantic Critic output must be an object.",
    );
  }

  assertExactKeys(
    input,
    [
      "summary",
      "findings",
    ],
    "Semantic Critic output",
  );

  if (
    !nonEmpty(
      input.summary,
    )
  ) {
    throw new Error(
      "Semantic Critic output requires summary.",
    );
  }

  if (
    !Array.isArray(
      input.findings,
    )
  ) {
    throw new Error(
      "Semantic Critic findings must be an array.",
    );
  }

  if (
    input.findings.length >
    50
  ) {
    throw new Error(
      "Semantic Critic returned too many findings.",
    );
  }

  const allowedSections =
    new Set(
      request.design
        .sections
        .map(
          (section) =>
            section.id,
        ),
    );

  const allowedClaims =
    new Set(
      request.claims
        .filter(
          (claim) =>
            claim.publishable &&
            claim.confidence !==
              "low",
        )
        .map(
          (claim) =>
            claim.id,
        ),
    );

  const findingIds =
    new Set<string>();

  const findings:
    SemanticCriticFinding[] =
    [];

  for (
    const rawFinding
    of input.findings
  ) {
    if (
      !isObject(
        rawFinding,
      )
    ) {
      throw new Error(
        "Semantic Critic finding must be an object.",
      );
    }

    assertExactKeys(
      rawFinding,
      [
        "id",
        "category",
        "severity",
        "message",
        "sectionIds",
        "claimIds",
      ],
      "Semantic Critic finding",
    );

    if (
      !nonEmpty(
        rawFinding.id,
      )
    ) {
      throw new Error(
        "Semantic Critic finding requires id.",
      );
    }

    const id =
      rawFinding.id.trim();

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        id,
      )
    ) {
      throw new Error(
        `Semantic Critic finding ID must be lower-kebab-case: ${id}`,
      );
    }

    if (
      findingIds.has(
        id,
      )
    ) {
      throw new Error(
        `Semantic Critic returned duplicate finding ID: ${id}`,
      );
    }

    findingIds.add(
      id,
    );

    if (
      typeof rawFinding.category !==
        "string" ||
      !(
        SEMANTIC_CRITIC_CATEGORIES as readonly string[]
      ).includes(
        rawFinding.category,
      )
    ) {
      throw new Error(
        `Semantic Critic returned invalid category for finding ${id}.`,
      );
    }

    if (
      typeof rawFinding.severity !==
        "string" ||
      !(
        SEMANTIC_CRITIC_SEVERITIES as readonly string[]
      ).includes(
        rawFinding.severity,
      )
    ) {
      throw new Error(
        `Semantic Critic returned invalid severity for finding ${id}.`,
      );
    }

    if (
      !nonEmpty(
        rawFinding.message,
      )
    ) {
      throw new Error(
        `Semantic Critic finding ${id} requires message.`,
      );
    }

    const sectionIds =
      stringArray(
        rawFinding.sectionIds,
        `Semantic Critic finding ${id}.sectionIds`,
      );

    const claimIds =
      stringArray(
        rawFinding.claimIds,
        `Semantic Critic finding ${id}.claimIds`,
      );

    if (
      sectionIds.length ===
        0 &&
      claimIds.length ===
        0
    ) {
      throw new Error(
        `Semantic Critic finding ${id} must reference at least one section or claim.`,
      );
    }

    for (
      const sectionId
      of sectionIds
    ) {
      if (
        !allowedSections.has(
          sectionId,
        )
      ) {
        throw new Error(
          `Semantic Critic finding ${id} references unknown section ID: ${sectionId}`,
        );
      }
    }

    for (
      const claimId
      of claimIds
    ) {
      if (
        !allowedClaims.has(
          claimId,
        )
      ) {
        throw new Error(
          `Semantic Critic finding ${id} references non-public or unknown claim ID: ${claimId}`,
        );
      }
    }

    if (
      rawFinding.category ===
        "evidence-overreach" &&
      (
        sectionIds.length ===
          0 ||
        claimIds.length ===
          0
      )
    ) {
      throw new Error(
        `Semantic Critic evidence-overreach finding ${id} must reference both section and claim IDs.`,
      );
    }

    if (
      rawFinding.category ===
        "repetition" &&
      sectionIds.length <
        2
    ) {
      throw new Error(
        `Semantic Critic repetition finding ${id} must reference at least two sections.`,
      );
    }

    if (
      rawFinding.category ===
        "omitted-evidence" &&
      claimIds.length ===
        0
    ) {
      throw new Error(
        `Semantic Critic omitted-evidence finding ${id} must reference the omitted claim.`,
      );
    }

    findings.push({
      id,

      category:
        rawFinding.category as
          SemanticCriticCategory,

      severity:
        rawFinding.severity as
          SemanticCriticSeverity,

      message:
        rawFinding.message.trim(),

      sectionIds,

      claimIds,
    });
  }

  return {
    summary:
      input.summary.trim(),

    findings,
  };
}

/* ── Public API ───────────────────────────────────── */

export async function critiqueCaseStudy(
  request:
    SemanticCriticRequest,
  options:
    SemanticCriticOptions = {},
): Promise<SemanticCriticResult> {
  validateRequest(
    request,
  );

  const apiKey =
    process.env
      .OPENAI_API_KEY;

  if (
    !options.client &&
    !apiKey
  ) {
    throw new Error(
      "OPENAI_API_KEY is required for Case Study Semantic Critic.",
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
      .CASE_STUDY_AGENT_CRITIC_MODEL ??
    process.env
      .CASE_STUDY_AGENT_MODEL ??
    "gpt-5.6";

  const response =
    await client.responses.create({
      model,

      input: [
        {
          role:
            "system",

          content:
            SEMANTIC_CRITIC_SYSTEM_PROMPT,
        },

        {
          role:
            "user",

          content:
            buildPrompt(
              request,
            ),
        },
      ],

      text: {
        format:
          SEMANTIC_CRITIC_RESPONSE_FORMAT as any,
      },
    });

  const outputText =
    response.output_text
      ?.trim();

  if (
    !outputText
  ) {
    throw new Error(
      "Case Study Semantic Critic returned no structured output.",
    );
  }

  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        outputText,
      );
  } catch (error) {
    throw new Error(
      `Case Study Semantic Critic returned invalid JSON despite Structured Outputs: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  const validated =
    validateSemanticCriticOutput(
      parsed,
      request,
    );

  const errors =
    validated.findings
      .filter(
        (finding) =>
          finding.severity ===
          "error",
      );

  const warnings =
    validated.findings
      .filter(
        (finding) =>
          finding.severity ===
          "warning",
      );

  const score =
    scoreFor(
      validated.findings,
    );

  const status:
    SemanticCriticResult["status"] =
    errors.length >
      0
      ? "fail"
      : warnings.length >
          0
        ? "partial"
        : "pass";

  return {
    status,

    draftReady:
      errors.length ===
      0,

    score,

    summary:
      validated.summary,

    findings:
      validated.findings,
  };
}
