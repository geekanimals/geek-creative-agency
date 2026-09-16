/**
 * GOLD STANDARD CASE STUDY AGENT — EVIDENCE EXTRACTOR
 *
 * Trusted raw GenerationSource[] → evidence candidate claims.
 *
 * IMPORTANT:
 *
 * - Candidates do NOT yet have confidence.
 * - Candidates do NOT yet have publishable=true/false.
 * - Every support excerpt must exist verbatim in trusted source content.
 * - Source IDs are operator-controlled.
 * - No Payload.
 * - No database.
 * - No publishing.
 */

import OpenAI from "openai";

import {
  EVIDENCE_EXTRACTION_RESPONSE_FORMAT,
  EXTRACTABLE_CLAIM_TYPES,
} from "./extractionSchema";

import type {
  GenerationSource,
} from "./generator";

import type {
  ClaimType,
  EvidenceSupport,
} from "./types";

/* ── Public contracts ───────────────────────────────── */

export type CandidateEvidenceClaim = {
  id: string;

  type: ClaimType;

  statement: string;

  sourceIds: string[];

  support: EvidenceSupport[];
};

export type EvidenceExtractionResult = {
  claims: CandidateEvidenceClaim[];
};

export type ExtractEvidenceRequest = {
  sources: GenerationSource[];

  model?: string;
};

export type ExtractEvidenceOptions = {
  client?: OpenAI;
};

/* ── Helpers ────────────────────────────────────────── */

function nonEmpty(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    Boolean(value.trim())
  );
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function exactKeys(
  object: Record<string, unknown>,
  allowed: string[],
  label: string,
) {
  const allowedSet =
    new Set(allowed);

  for (
    const key
    of Object.keys(object)
  ) {
    if (!allowedSet.has(key)) {
      throw new Error(
        `${label} contains unknown field: ${key}`,
      );
    }
  }
}

/* ── Trusted source validation ──────────────────────── */

function validateExtractionRequest(
  request: ExtractEvidenceRequest,
) {
  if (
    !Array.isArray(
      request.sources,
    ) ||
    request.sources.length === 0
  ) {
    throw new Error(
      "Evidence Extractor requires at least one trusted source.",
    );
  }

  const ids =
    new Set<string>();

  for (
    const source
    of request.sources
  ) {
    if (!nonEmpty(source.id)) {
      throw new Error(
        "Every Evidence Extractor source requires an id.",
      );
    }

    const id =
      source.id.trim();

    if (ids.has(id)) {
      throw new Error(
        `Duplicate Evidence Extractor source id: ${id}`,
      );
    }

    ids.add(id);

    if (!nonEmpty(source.title)) {
      throw new Error(
        `Evidence Extractor source ${id} requires a title.`,
      );
    }

    if (!nonEmpty(source.content)) {
      throw new Error(
        `Evidence Extractor source ${id} has no content.`,
      );
    }
  }
}

/* ── Prompt ─────────────────────────────────────────── */

const EXTRACTOR_SYSTEM_PROMPT = `
You are the Evidence Extractor for Geek Creative Agency's Gold Standard Case Study system.

Your task is ONLY to identify narrow evidence candidate claims from trusted source material.

You are NOT writing the case study.
You are NOT deciding publication readiness.
You are NOT deciding confidence.
You are NOT reconciling conflicts.

HARD RULES:

1. The supplied trusted sources are the entire factual universe.

   Do not use:
   - memory
   - outside knowledge
   - web knowledge
   - assumptions
   - common sense as factual evidence

2. Extract only claims directly supported by supplied source text.

3. Every claim must contain:
   - id
   - type
   - statement
   - sourceIds
   - support

4. support[].excerpt must be copied EXACTLY from source content.

   Never:
   - paraphrase
   - shorten with ellipses
   - clean punctuation
   - alter capitalization
   - repair spelling
   - merge non-contiguous passages into one excerpt

5. Use multiple support items when multiple passages are required to establish the full claim.

6. Keep claims NARROW.

   Do not combine unrelated facts merely to reduce claim count.

7. Preserve attribution and scope.

   Examples of materially different scopes include:
   - Geek-specific activity
   - tracked subset
   - wider campaign
   - partner amplification
   - historical comparison
   - estimated value
   - audited financial result

   Never silently merge these.

8. Preserve qualifiers exactly in meaning.

   Examples:
   - approximately
   - estimated
   - tracked
   - organic
   - wider-campaign
   - reported
   - historical

9. METRICS:

   Extract the number together with its supported scope and attribution.

   Do not transform:
   "8M+ wider-campaign reach"
   into:
   "Geek delivered 8M+ reach".

10. QUOTES:

    Never rewrite or polish quotes.

11. RELATIONSHIPS:

    Extract company, brand, service, Solution/IP, chronology or project relationships
    only when explicitly established by the source.

12. NARRATIVE:

    Narrative claims are allowed only when the source itself supports the meaning.

    Do not infer:
    - strategic insight
    - causality
    - campaign effectiveness
    - business impact
    - historical progression

    from disconnected facts.

13. CONFLICTS:

    If two sources contain conflicting figures, extract both as separate narrow claims.

    Do NOT choose which one is correct.
    Reconciliation happens in a later stage.

14. SOURCE IDs:

    Use only exact source IDs supplied by the operator.
    Never invent a source ID.

15. Do not output:
    - confidence
    - publishable
    - quality score
    - CMS fields
    - case-study prose
    - taxonomy slugs unless directly present in evidence

16. It is valid to return zero claims if no defensible factual claim exists.
`.trim();

function sourcesForPrompt(
  sources: GenerationSource[],
) {
  return sources.map(
    (source) => ({
      id:
        source.id,

      kind:
        source.kind,

      title:
        source.title,

      publisher:
        source.publisher ??
        null,

      publicationDate:
        source.publicationDate ??
        null,

      notes:
        source.notes ??
        null,

      content:
        source.content,
    }),
  );
}

function buildExtractorPrompt(
  request: ExtractEvidenceRequest,
): string {
  return JSON.stringify(
    {
      task:
        "Extract narrow evidence candidate claims with exact verbatim support.",

      trustedSources:
        sourcesForPrompt(
          request.sources,
        ),
    },
    null,
    2,
  );
}

/* ── Deterministic candidate validation ─────────────── */

export function validateEvidenceExtraction(
  input: unknown,
  sources: GenerationSource[],
): EvidenceExtractionResult {
  if (!isObject(input)) {
    throw new Error(
      "Evidence Extractor output must be an object.",
    );
  }

  exactKeys(
    input,
    [
      "claims",
    ],
    "Evidence Extractor output",
  );

  if (
    !Array.isArray(
      input.claims,
    )
  ) {
    throw new Error(
      "Evidence Extractor output requires a claims array.",
    );
  }

  if (
    input.claims.length >
    200
  ) {
    throw new Error(
      "Evidence Extractor cannot return more than 200 claims.",
    );
  }

  const sourceById =
    new Map(
      sources.map(
        (source) => [
          source.id,
          source,
        ] as const,
      ),
    );

  const seenClaimIds =
    new Set<string>();

  const claims:
    CandidateEvidenceClaim[] =
    [];

  for (
    const [
      claimIndex,
      raw,
    ] of input.claims.entries()
  ) {
    const label =
      `Evidence Extractor claim[${claimIndex}]`;

    if (!isObject(raw)) {
      throw new Error(
        `${label} must be an object.`,
      );
    }

    exactKeys(
      raw,
      [
        "id",
        "type",
        "statement",
        "sourceIds",
        "support",
      ],
      label,
    );

    if (!nonEmpty(raw.id)) {
      throw new Error(
        `${label} requires id.`,
      );
    }

    const id =
      raw.id.trim();

    if (
      seenClaimIds.has(id)
    ) {
      throw new Error(
        `Duplicate Evidence Extractor claim id: ${id}`,
      );
    }

    seenClaimIds.add(id);

    if (
      typeof raw.type !==
        "string" ||
      !(
        EXTRACTABLE_CLAIM_TYPES as
          readonly string[]
      ).includes(
        raw.type,
      )
    ) {
      throw new Error(
        `${label} has invalid claim type.`,
      );
    }

    const type =
      raw.type as ClaimType;

    if (
      !nonEmpty(
        raw.statement,
      )
    ) {
      throw new Error(
        `${label} requires statement.`,
      );
    }

    if (
      !Array.isArray(
        raw.sourceIds,
      ) ||
      raw.sourceIds.length ===
        0 ||
      !raw.sourceIds.every(
        nonEmpty,
      )
    ) {
      throw new Error(
        `${label}.sourceIds must contain at least one non-empty source ID.`,
      );
    }

    const sourceIds =
      raw.sourceIds.map(
        (sourceId) =>
          sourceId.trim(),
      );

    if (
      new Set(
        sourceIds,
      ).size !==
      sourceIds.length
    ) {
      throw new Error(
        `${label}.sourceIds contains duplicates.`,
      );
    }

    for (
      const sourceId
      of sourceIds
    ) {
      if (
        !sourceById.has(
          sourceId,
        )
      ) {
        throw new Error(
          `${label} references unknown trusted source: ${sourceId}`,
        );
      }
    }

    if (
      !Array.isArray(
        raw.support,
      ) ||
      raw.support.length ===
        0
    ) {
      throw new Error(
        `${label} requires at least one verbatim support excerpt.`,
      );
    }

    const support:
      EvidenceSupport[] =
      [];

    const supportedSourceIds =
      new Set<string>();

    const seenSupportKeys =
      new Set<string>();

    for (
      const [
        supportIndex,
        rawSupport,
      ] of raw.support.entries()
    ) {
      const supportLabel =
        `${label}.support[${supportIndex}]`;

      if (
        !isObject(
          rawSupport,
        )
      ) {
        throw new Error(
          `${supportLabel} must be an object.`,
        );
      }

      exactKeys(
        rawSupport,
        [
          "sourceId",
          "excerpt",
        ],
        supportLabel,
      );

      if (
        !nonEmpty(
          rawSupport.sourceId,
        )
      ) {
        throw new Error(
          `${supportLabel} requires sourceId.`,
        );
      }

      const sourceId =
        rawSupport
          .sourceId
          .trim();

      if (
        !sourceIds.includes(
          sourceId,
        )
      ) {
        throw new Error(
          `${supportLabel} source ${sourceId} is not declared in claim.sourceIds.`,
        );
      }

      const trustedSource =
        sourceById.get(
          sourceId,
        );

      if (!trustedSource) {
        throw new Error(
          `${supportLabel} references unknown trusted source: ${sourceId}`,
        );
      }

      if (
        typeof rawSupport.excerpt !==
          "string" ||
        !rawSupport.excerpt
          .trim()
      ) {
        throw new Error(
          `${supportLabel} requires excerpt.`,
        );
      }

      /**
       * DO NOT trim the actual excerpt.
       *
       * Its character-for-character form is the evidence binding.
       */
      const excerpt =
        rawSupport.excerpt;

      if (
        !trustedSource
          .content
          .includes(
            excerpt,
          )
      ) {
        throw new Error(
          `${supportLabel} is not verbatim in trusted source ${sourceId}.`,
        );
      }

      const supportKey =
        `${sourceId}\u0000${excerpt}`;

      if (
        seenSupportKeys.has(
          supportKey,
        )
      ) {
        throw new Error(
          `${label} contains duplicate support excerpt for source ${sourceId}.`,
        );
      }

      seenSupportKeys.add(
        supportKey,
      );

      supportedSourceIds.add(
        sourceId,
      );

      support.push({
        sourceId,
        excerpt,
      });
    }

    /**
     * Prevent dangling sourceIds.
     *
     * If the model says a source supports a claim,
     * that source must contribute at least one exact excerpt.
     */
    for (
      const sourceId
      of sourceIds
    ) {
      if (
        !supportedSourceIds.has(
          sourceId,
        )
      ) {
        throw new Error(
          `${label} declares source ${sourceId} but provides no support excerpt from it.`,
        );
      }
    }

    claims.push({
      id,

      type,

      statement:
        raw.statement.trim(),

      sourceIds,

      support,
    });
  }

  return {
    claims,
  };
}

/* ── Public extraction API ──────────────────────────── */

export async function extractEvidence(
  request: ExtractEvidenceRequest,
  options: ExtractEvidenceOptions = {},
): Promise<EvidenceExtractionResult> {
  validateExtractionRequest(
    request,
  );

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (
    !options.client &&
    !apiKey
  ) {
    throw new Error(
      "OPENAI_API_KEY is required for Evidence Extractor generation.",
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
      .CASE_STUDY_AGENT_EXTRACTOR_MODEL ??
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
            EXTRACTOR_SYSTEM_PROMPT,
        },

        {
          role:
            "user",

          content:
            buildExtractorPrompt(
              request,
            ),
        },
      ],

      text: {
        format:
          EVIDENCE_EXTRACTION_RESPONSE_FORMAT as any,
      },
    });

  const outputText =
    response.output_text
      ?.trim();

  if (!outputText) {
    throw new Error(
      "Evidence Extractor returned no structured output.",
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
      `Evidence Extractor returned invalid JSON despite Structured Outputs: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  return validateEvidenceExtraction(
    parsed,
    request.sources,
  );
}
