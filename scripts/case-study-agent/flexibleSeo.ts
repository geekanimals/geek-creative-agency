/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE SEO
 *
 * Additive SEO/AEO layer.
 *
 * Boundary:
 *
 * approved project identity
 * + publication-ready claims
 * + finished public story
 *   → OpenAI Structured Output
 *   → deterministic SEO Quality Gate
 *   → FlexibleSeoResult
 *
 * IMPORTANT:
 * - Does NOT rewrite the case study.
 * - Does NOT alter evidence.
 * - Does NOT assign taxonomy.
 * - Does NOT choose publication status.
 * - Does NOT control canonical domains.
 * - Does NOT control robots/noindex.
 * - Does NOT access Payload.
 * - Does NOT access a database.
 * - Does NOT publish.
 */

import {
  loadCaseStudyAgentMemory,
} from "./caseStudyAgentMemory";

import OpenAI from "openai";

/* ── Types ─────────────────────────────────────────── */

export const FLEXIBLE_SEO_INTENTS = [
  "informational",
  "commercial",
  "branded",
  "transactional",
  "mixed",
] as const;

export type FlexibleSeoIntent =
  typeof FLEXIBLE_SEO_INTENTS[number];

export type FlexibleSeoProjectIdentity = {
  title: string;
  slug: string;
  client?: string;
  year?: number;
  location?: string;
};

export type FlexibleSeoClaim = {
  id: string;
  type: string;
  statement: string;
};

export type FlexibleSeoRequest = {
  project: FlexibleSeoProjectIdentity;

  /**
   * ONLY publication-ready claims may be supplied here.
   */
  publishableClaims: FlexibleSeoClaim[];

  /**
   * Finished public story text after the normal Agent quality
   * and semantic-review stages.
   */
  storyText: string[];

  model?: string;
};

export type FlexibleSeoDraft = {
  metaTitle: string;
  metaDescription: string;

  primaryKeyword: string;
  secondaryKeywords: string[];

  searchIntent: FlexibleSeoIntent;

  /**
   * Use only when supplied by trusted project identity or supported
   * by the publication-ready material. Otherwise null.
   */
  targetMarket: string | null;

  /**
   * Editorial linking suggestions only.
   * These are NOT automatically injected into page copy.
   */
  preferredInternalAnchors: string[];

  /**
   * Internal editorial notes only.
   *
   * This must never pretend that live SERP / search-volume research
   * occurred when no such research source was supplied.
   */
  searchNotes: string;
};

export type FlexibleSeoIssueSeverity =
  | "error"
  | "warning"
  | "info";

export type FlexibleSeoIssue = {
  code: string;
  severity: FlexibleSeoIssueSeverity;
  message: string;
};

export type FlexibleSeoQuality = {
  status:
    | "pass"
    | "partial"
    | "fail";

  draftReady: boolean;

  /**
   * Deterministic score.
   * The model never chooses this.
   */
  score: number;

  issues: FlexibleSeoIssue[];
};

export type FlexibleSeoResult = {
  /**
   * Deterministic route path.
   *
   * The AI never controls the canonical host.
   */
  canonicalPath: string;

  metaTitle: string;
  metaDescription: string;

  primaryKeyword: string;
  secondaryKeywords: string[];

  searchIntent: FlexibleSeoIntent;
  targetMarket: string | null;

  preferredInternalAnchors: string[];
  searchNotes: string;

  quality: FlexibleSeoQuality;
};

export type FlexibleSeoOptions = {
  client?: OpenAI;
};

/* ── Structured Output schema ──────────────────────── */

const FLEXIBLE_SEO_RESPONSE_FORMAT = {
  type: "json_schema",
  name: "flexible_case_study_seo",
  strict: true,

  schema: {
    type: "object",
    additionalProperties: false,

    required: [
      "metaTitle",
      "metaDescription",
      "primaryKeyword",
      "secondaryKeywords",
      "searchIntent",
      "targetMarket",
      "preferredInternalAnchors",
      "searchNotes",
    ],

    properties: {
      metaTitle: {
        type: "string",
      },

      metaDescription: {
        type: "string",
      },

      primaryKeyword: {
        type: "string",
      },

      secondaryKeywords: {
        type: "array",
        maxItems: 6,
        items: {
          type: "string",
        },
      },

      searchIntent: {
        type: "string",
        enum: [
          "informational",
          "commercial",
          "branded",
          "transactional",
          "mixed",
        ],
      },

      targetMarket: {
        type: [
          "string",
          "null",
        ],
      },

      preferredInternalAnchors: {
        type: "array",
        maxItems: 6,
        items: {
          type: "string",
        },
      },

      searchNotes: {
        type: "string",
      },
    },
  },
} as const;

/* ── Prompt ────────────────────────────────────────── */

const FLEXIBLE_SEO_SYSTEM_PROMPT = `
You are the SEO/AEO specialist inside the Gold Standard Case Study Agent.

You work AFTER the case-study evidence, narrative, architecture, design,
compilation, deterministic quality gate and semantic review have already
been completed.

You are NOT the case-study writer.
You are NOT the evidence verifier.
You are NOT the portfolio-taxonomy authority.
You are NOT the publisher.

Your job is to prepare an accurate discoverability layer for the finished
case study.

Use ONLY:
1. the supplied trusted project identity;
2. the supplied publication-ready claims; and
3. the supplied finished public story text.

Never invent:
- campaign facts;
- metrics;
- dates;
- geography;
- awards;
- client attribution;
- business results;
- causality;
- ROI;
- revenue;
- superlatives;
- rankings;
- search volumes;
- SERP positions;
- People Also Ask data;
- competitor rankings.

META TITLE
- Clear and natural.
- Prefer roughly 35–65 characters.
- Preserve campaign / brand identity.
- Do not keyword-stuff.

META DESCRIPTION
- Concise, useful summary of the supported case study.
- Prefer roughly 100–160 characters.
- No clickbait.
- No unsupported metrics or claims.

PRIMARY KEYWORD
- One natural branded or campaign-specific phrase.
- It must match the actual case study.

SECONDARY KEYWORDS
- Maximum six.
- Relevant variations only.
- No keyword stuffing.

SEARCH INTENT
Choose only one allowed intent.

TARGET MARKET
Use a market only when it is supplied or clearly supported.
Otherwise return null.

PREFERRED INTERNAL ANCHORS
These are editorial suggestions only.
Do not force exact-match anchor stuffing.
Prefer natural references to the Brand, Company, Industry, Service,
Solution when applicable, and Work.

SEARCH NOTES
Internal editorial notes only.
You may discuss ambiguity, terminology, cannibalization risk or content
positioning based on the supplied material.

Do NOT claim live keyword research, live SERP review, ranking data,
search volume, or People Also Ask research has occurred.

Return only the required structured output.
`.trim();

/* ── Validation helpers ────────────────────────────── */

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

function assertExactKeys(
  value: Record<string, unknown>,
  allowed: string[],
  context: string,
): void {
  const allowedSet =
    new Set(allowed);

  for (
    const key of
    Object.keys(value)
  ) {
    if (
      !allowedSet.has(key)
    ) {
      throw new Error(
        `${context} contains unexpected field "${key}".`,
      );
    }
  }
}

function validateStringArray(
  value: unknown,
  context: string,
  maxItems: number,
): string[] {
  if (
    !Array.isArray(value)
  ) {
    throw new Error(
      `${context} must be an array.`,
    );
  }

  if (
    value.length >
    maxItems
  ) {
    throw new Error(
      `${context} may contain at most ${maxItems} items.`,
    );
  }

  const result =
    value.map(
      (
        item,
        index,
      ) => {
        if (
          !nonEmpty(item)
        ) {
          throw new Error(
            `${context}[${index}] must be a non-empty string.`,
          );
        }

        return item.trim();
      },
    );

  const normalized =
    result.map(
      (item) =>
        item.toLowerCase(),
    );

  if (
    new Set(normalized).size !==
    normalized.length
  ) {
    throw new Error(
      `${context} contains duplicate values.`,
    );
  }

  return result;
}

function validateSeoDraft(
  value: unknown,
): FlexibleSeoDraft {
  if (
    !isObject(value)
  ) {
    throw new Error(
      "Flexible SEO output must be an object.",
    );
  }

  assertExactKeys(
    value,
    [
      "metaTitle",
      "metaDescription",
      "primaryKeyword",
      "secondaryKeywords",
      "searchIntent",
      "targetMarket",
      "preferredInternalAnchors",
      "searchNotes",
    ],
    "Flexible SEO output",
  );

  if (
    !nonEmpty(value.metaTitle)
  ) {
    throw new Error(
      "Flexible SEO metaTitle must be a non-empty string.",
    );
  }

  if (
    !nonEmpty(value.metaDescription)
  ) {
    throw new Error(
      "Flexible SEO metaDescription must be a non-empty string.",
    );
  }

  if (
    !nonEmpty(value.primaryKeyword)
  ) {
    throw new Error(
      "Flexible SEO primaryKeyword must be a non-empty string.",
    );
  }

  if (
    !FLEXIBLE_SEO_INTENTS.includes(
      value.searchIntent as FlexibleSeoIntent,
    )
  ) {
    throw new Error(
      "Flexible SEO searchIntent is invalid.",
    );
  }

  if (
    value.targetMarket !==
      null &&
    !nonEmpty(
      value.targetMarket,
    )
  ) {
    throw new Error(
      "Flexible SEO targetMarket must be a non-empty string or null.",
    );
  }

  if (
    !nonEmpty(value.searchNotes)
  ) {
    throw new Error(
      "Flexible SEO searchNotes must be a non-empty string.",
    );
  }

  return {
    metaTitle:
      value.metaTitle.trim(),

    metaDescription:
      value.metaDescription.trim(),

    primaryKeyword:
      value.primaryKeyword.trim(),

    secondaryKeywords:
      validateStringArray(
        value.secondaryKeywords,
        "Flexible SEO secondaryKeywords",
        6,
      ),

    searchIntent:
      value.searchIntent as
        FlexibleSeoIntent,

    targetMarket:
      value.targetMarket ===
        null
        ? null
        : (
            value.targetMarket as string
          ).trim(),

    preferredInternalAnchors:
      validateStringArray(
        value.preferredInternalAnchors,
        "Flexible SEO preferredInternalAnchors",
        6,
      ),

    searchNotes:
      value.searchNotes.trim(),
  };
}

function validateRequest(
  request: FlexibleSeoRequest,
): void {
  if (
    !nonEmpty(
      request.project.title,
    )
  ) {
    throw new Error(
      "Flexible SEO requires trusted project title.",
    );
  }

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      request.project.slug,
    )
  ) {
    throw new Error(
      "Flexible SEO requires a valid trusted project slug.",
    );
  }

  if (
    request.publishableClaims.length ===
    0
  ) {
    throw new Error(
      "Flexible SEO requires at least one publication-ready evidence claim.",
    );
  }

  for (
    const claim of
    request.publishableClaims
  ) {
    if (
      !nonEmpty(claim.id) ||
      !nonEmpty(claim.type) ||
      !nonEmpty(claim.statement)
    ) {
      throw new Error(
        "Flexible SEO received an invalid publication-ready claim.",
      );
    }
  }

  if (
    request.storyText.length ===
    0 ||
    request.storyText.some(
      (item) =>
        !nonEmpty(item),
    )
  ) {
    throw new Error(
      "Flexible SEO requires finished public story text.",
    );
  }
}

/* ── Deterministic SEO quality gate ────────────────── */

function normalize(
  value: string,
): string {
  return value
    .toLowerCase()
    .replace(
      /[’']/g,
      "",
    )
    .replace(
      /[^a-z0-9%₹$+.,]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function numericTokens(
  value: string,
): string[] {
  const matches =
    value.match(
      /(?:₹\s*|inr\s*|\$\s*)?\d[\d,.]*(?:\.\d+)?(?:\s*(?:%|k|m|b|lakh|crore))?\+?/gi,
    ) ?? [];

  return matches.map(
    (item) =>
      normalize(item)
        .replace(
          /\s+/g,
          "",
        )
        .replace(
          /,/g,
          "",
        ),
  );
}

function identityTokens(
  request: FlexibleSeoRequest,
): string[] {
  const source =
    [
      request.project.title,
      request.project.client ??
        "",
    ].join(
      " ",
    );

  const stop =
    new Set([
      "the",
      "and",
      "for",
      "with",
      "from",
      "case",
      "study",
      "campaign",
      "geek",
    ]);

  return normalize(source)
    .split(" ")
    .filter(
      (token) =>
        token.length >=
          3 &&
        !stop.has(token),
    );
}

function pushIssue(
  issues: FlexibleSeoIssue[],
  code: string,
  severity: FlexibleSeoIssueSeverity,
  message: string,
): void {
  issues.push({
    code,
    severity,
    message,
  });
}

export function runFlexibleSeoQualityGate(
  request: FlexibleSeoRequest,
  draft: FlexibleSeoDraft,
): FlexibleSeoQuality {
  const issues:
    FlexibleSeoIssue[] =
      [];

  const titleLength =
    draft.metaTitle.length;

  if (
    titleLength <
      20 ||
    titleLength >
      70
  ) {
    pushIssue(
      issues,
      "SEO_META_TITLE_LENGTH",
      "error",
      `Meta title length is ${titleLength}; expected 20–70 characters.`,
    );
  } else if (
    titleLength >
    65
  ) {
    pushIssue(
      issues,
      "SEO_META_TITLE_LONG",
      "warning",
      `Meta title length is ${titleLength}; consider keeping it at 65 characters or fewer.`,
    );
  }

  const descriptionLength =
    draft.metaDescription.length;

  if (
    descriptionLength <
      70 ||
    descriptionLength >
      180
  ) {
    pushIssue(
      issues,
      "SEO_META_DESCRIPTION_LENGTH",
      "error",
      `Meta description length is ${descriptionLength}; expected 70–180 characters.`,
    );
  } else if (
    descriptionLength >
    160
  ) {
    pushIssue(
      issues,
      "SEO_META_DESCRIPTION_LONG",
      "warning",
      `Meta description length is ${descriptionLength}; consider keeping it at 160 characters or fewer.`,
    );
  }

  const knownIdentity =
    identityTokens(
      request,
    );

  const normalizedTitle =
    normalize(
      draft.metaTitle,
    );

  if (
    knownIdentity.length >
      0 &&
    !knownIdentity.some(
      (token) =>
        normalizedTitle.includes(
          token,
        ),
    )
  ) {
    pushIssue(
      issues,
      "SEO_META_TITLE_IDENTITY_MISSING",
      "error",
      "Meta title does not preserve a recognizable trusted project/client identity.",
    );
  }

  const supportCorpus =
    normalize(
      [
        request.project.title,
        request.project.client ??
          "",
        request.project.year != null
          ? String(
              request.project.year,
            )
          : "",
        request.project.location ??
          "",
        ...request
          .publishableClaims
          .map(
            (claim) =>
              claim.statement,
          ),
        ...request.storyText,
      ].join(
        "\n",
      ),
    )
      .replace(
        /,/g,
        "",
      );

  const publicSeoText =
    [
      draft.metaTitle,
      draft.metaDescription,
    ].join(
      " ",
    );

  for (
    const token of
    numericTokens(
      publicSeoText,
    )
  ) {
    if (
      !supportCorpus.includes(
        token,
      )
    ) {
      pushIssue(
        issues,
        "SEO_UNSUPPORTED_NUMBER",
        "error",
        `SEO copy contains numeric token "${token}" that is absent from the approved public material.`,
      );
    }
  }

  const riskyClaims =
    [
      "best",
      "biggest",
      "largest",
      "#1",
      "number one",
      "first ever",
      "first-ever",
      "unprecedented",
      "record breaking",
      "record-breaking",
      "guaranteed",
      "revolutionary",
    ];

  const normalizedSeo =
    normalize(
      publicSeoText,
    );

  for (
    const phrase of
    riskyClaims
  ) {
    const normalizedPhrase =
      normalize(
        phrase,
      );

    if (
      normalizedSeo.includes(
        normalizedPhrase,
      ) &&
      !supportCorpus.includes(
        normalizedPhrase,
      )
    ) {
      pushIssue(
        issues,
        "SEO_UNSUPPORTED_SUPERLATIVE",
        "error",
        `SEO copy contains unsupported superlative/claim "${phrase}".`,
      );
    }
  }

  const falseResearchSignals =
    [
      "search volume",
      "monthly searches",
      "current serp",
      "serp shows",
      "people also ask",
      "paa data",
      "ranking position",
    ];

  const normalizedNotes =
    normalize(
      draft.searchNotes,
    );

  for (
    const phrase of
    falseResearchSignals
  ) {
    if (
      normalizedNotes.includes(
        normalize(
          phrase,
        ),
      )
    ) {
      pushIssue(
        issues,
        "SEO_FALSE_RESEARCH_SIGNAL",
        "error",
        `Search notes imply live research ("${phrase}") that was not supplied.`,
      );
    }
  }

  if (
    draft.secondaryKeywords.some(
      (keyword) =>
        normalize(
          keyword,
        ) ===
        normalize(
          draft.primaryKeyword,
        ),
    )
  ) {
    pushIssue(
      issues,
      "SEO_DUPLICATE_PRIMARY_KEYWORD",
      "warning",
      "Primary keyword is duplicated in secondaryKeywords.",
    );
  }

  const errorCount =
    issues.filter(
      (issue) =>
        issue.severity ===
        "error",
    ).length;

  const warningCount =
    issues.filter(
      (issue) =>
        issue.severity ===
        "warning",
    ).length;

  const score =
    Math.max(
      0,
      100 -
        errorCount *
          25 -
        warningCount *
          5,
    );

  return {
    status:
      errorCount >
      0
        ? "fail"
        : warningCount >
            0
          ? "partial"
          : "pass",

    draftReady:
      errorCount ===
      0,

    score,

    issues,
  };
}

/* ── Prompt assembly ───────────────────────────────── */

function buildPrompt(
  request: FlexibleSeoRequest,
): string {
  return JSON.stringify(
    {
      project:
        request.project,

      publicationReadyClaims:
        request.publishableClaims,

      finishedPublicStory:
        request.storyText,

      constraints: {
        canonicalPath:
          `/work/${request.project.slug}`,

        liveKeywordResearchProvided:
          false,

        noindexControlledByModel:
          false,

        canonicalHostControlledByModel:
          false,
      },
    },
    null,
    2,
  );
}

/* ── Public generator ──────────────────────────────── */

export async function generateFlexibleSeo(
  request: FlexibleSeoRequest,
  options: FlexibleSeoOptions = {},
): Promise<FlexibleSeoResult> {
  loadCaseStudyAgentMemory();

  validateRequest(
    request,
  );

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (
    !options.client &&
    !apiKey
  ) {
    throw new Error(
      "OPENAI_API_KEY is required for Flexible SEO generation.",
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
      .CASE_STUDY_AGENT_SEO_MODEL ??
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
            FLEXIBLE_SEO_SYSTEM_PROMPT,
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
          FLEXIBLE_SEO_RESPONSE_FORMAT as any,
      },
    });

  const outputText =
    response.output_text?.trim();

  if (
    !outputText
  ) {
    throw new Error(
      "Flexible SEO Agent returned no structured output.",
    );
  }

  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        outputText,
      );
  } catch {
    throw new Error(
      "Flexible SEO Agent returned invalid JSON.",
    );
  }

  const draft =
    validateSeoDraft(
      parsed,
    );

  const quality =
    runFlexibleSeoQualityGate(
      request,
      draft,
    );

  if (
    !quality.draftReady
  ) {    const codes =
      quality.issues
        .filter(
          (issue) =>
            issue.severity ===
            "error",
        )
        .map(
          (issue) =>
            issue.code,
        )
        .join(
          ", ",
        );

    throw new Error(
      `Flexible SEO Quality Gate failed: ${codes || "unknown SEO error"}`,
    );
  }

  return {
    canonicalPath:
      `/work/${request.project.slug}`,

    ...draft,

    quality,
  };
}
