/**
 * GOLD STANDARD CASE STUDY AGENT — OPENAI GENERATION ENGINE
 *
 * Boundary:
 *
 * trusted source material
 *   → OpenAI Structured Output
 *   → trusted source metadata restored by our code
 *   → package builder
 *   → runtime validation
 *   → Gold Standard quality gate
 *
 * NO Payload.
 * NO database.
 * NO publishing.
 * NO web-search tools.
 *
 * The model is permitted to synthesize editorial language, but it is NOT
 * permitted to create facts, metrics, quotes, relationships or provenance.
 */

import OpenAI from "openai";

import {
  CASE_STUDY_RESPONSE_FORMAT,
} from "./generationSchema";

import {
  buildCaseStudyPackage,
} from "./buildPackage";

import {
  verifyClaims,
} from "./verifier";

import type {
  VerifiableClaim,
} from "./verifier";

import {
  assertSemanticVerification,
} from "./verificationGate";

import type {
  BuiltCaseStudyPackage,
} from "./buildPackage";

import type {
  EvidenceSourceKind,
} from "./types";

/* ── Generation input ─────────────────────────────────────────────── */

export type GenerationSource = {
  /**
   * Stable source ID used by evidence claims.
   * Example: "client-report-2025"
   */
  id: string;

  kind: EvidenceSourceKind;

  title: string;

  /**
   * Actual source material supplied to the model.
   * This never enters Payload.
   */
  content: string;

  url?: string;
  publisher?: string;
  publicationDate?: string;
  capturedAt?: string;
  notes?: string;
};

export type TaxonomyItem = {
  slug: string;
  label?: string;
};

export type BrandTaxonomyItem = TaxonomyItem & {
  companySlug: string;
};

export type GenerationTaxonomy = {
  companies: TaxonomyItem[];
  brands: BrandTaxonomyItem[];
  businessCategories: TaxonomyItem[];
  services: TaxonomyItem[];
  solutions: TaxonomyItem[];
};

export type ProjectHint = {
  title?: string;
  slug?: string;
  client?: string;
  year?: number;
  location?: string;

  /**
   * Optional operator guidance only.
   * It is not evidence and must not be treated as a factual source unless the
   * same fact appears in the supplied GenerationSource content.
   */
  editorialNote?: string;
};

export type GenerateCaseStudyRequest = {
  sources: GenerationSource[];

  taxonomy: GenerationTaxonomy;

  projectHint?: ProjectHint;

  /**
   * Defaults to CASE_STUDY_AGENT_MODEL or gpt-5.6.
   */
  model?: string;
};

export type GenerateCaseStudyOptions = {
  /**
   * Injectable generation client for tests.
   * Production usage can omit this.
   */
  client?: OpenAI;

  /**
   * Independent semantic-verifier client.
   *
   * Deliberately separate from the generation client so tests and future
   * deployments can isolate the verifier boundary.
   */
  verifierClient?: OpenAI;

  /**
   * Optional verifier-model override.
   *
   * Otherwise verifier.ts resolves:
   * CASE_STUDY_AGENT_VERIFIER_MODEL
   * → CASE_STUDY_AGENT_MODEL
   * → gpt-5.6
   */
  verifierModel?: string;

  /**
   * Injectable timestamp for deterministic tests.
   */
  generatedAt?: string;
};

/* ── Input safety ─────────────────────────────────────────────────── */

function nonEmpty(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function validateGenerationRequest(
  request: GenerateCaseStudyRequest,
) {
  if (!Array.isArray(request.sources) || request.sources.length === 0) {
    throw new Error(
      "Case Study Agent requires at least one evidence source.",
    );
  }

  const sourceIds = new Set<string>();

  for (const source of request.sources) {
    if (!nonEmpty(source.id)) {
      throw new Error(
        "Every generation source requires a non-empty id.",
      );
    }

    if (sourceIds.has(source.id)) {
      throw new Error(
        `Duplicate generation source id: ${source.id}`,
      );
    }

    sourceIds.add(source.id);

    if (!nonEmpty(source.title)) {
      throw new Error(
        `Generation source ${source.id} requires a title.`,
      );
    }

    if (!nonEmpty(source.content)) {
      throw new Error(
        `Generation source ${source.id} has no content.`,
      );
    }
  }

  const taxonomyGroups: Array<
    [string, TaxonomyItem[]]
  > = [
    ["companies", request.taxonomy.companies],
    ["brands", request.taxonomy.brands],
    [
      "businessCategories",
      request.taxonomy.businessCategories,
    ],
    ["services", request.taxonomy.services],
    ["solutions", request.taxonomy.solutions],
  ];

  for (const [group, items] of taxonomyGroups) {
    const slugs = new Set<string>();

    for (const item of items) {
      if (!nonEmpty(item.slug)) {
        throw new Error(
          `Taxonomy ${group} contains an empty slug.`,
        );
      }

      if (slugs.has(item.slug)) {
        throw new Error(
          `Taxonomy ${group} contains duplicate slug ${item.slug}.`,
        );
      }

      slugs.add(item.slug);
    }
  }
}

/* ── Prompt construction ──────────────────────────────────────────── */

const SYSTEM_PROMPT = `
You are Geek Creative Agency's Gold Standard Case Study evidence editor.

Your job is to transform ONLY the supplied evidence into a structured case-study draft.

HARD RULES:

1. The supplied sources are the entire factual universe.
   Do not use memory, outside knowledge, web knowledge, assumptions or common sense
   as factual evidence.

2. Never invent:
   - metrics
   - numbers
   - dates
   - quotes
   - awards
   - press coverage
   - campaign results
   - company relationships
   - brand relationships
   - services
   - solutions/IP
   - locations
   - client claims

3. Editorial synthesis is allowed only when grounded in supplied evidence.
   Challenge, Insight, Idea, Execution and Outcome must each have explicit evidence
   claims and narrativeBindings.

   Narrative bindings may reference ONLY claims whose type is:
   - narrative
   - fact
   - metric

   Never bind a narrative section to:
   - relationship
   - quote
   - award
   - press

   Relationship claims may exist for taxonomy/scope validation, but they are not
   narrative evidence bindings.

   NARRATIVE FIELD SEMANTICS:

   Do not convert a supported fact, mechanic, role, outcome or observation into a
   stronger historical narrative claim unless the evidence supports that framing.

   In particular:

   CHALLENGE
   - Never state "the challenge was..." merely because a campaign mechanic or task exists.
   - If the source does not explicitly identify a challenge, bind Challenge to supported
     factual constraints, scope or conditions without claiming those facts were explicitly
     described as "the challenge".
   - The Challenge copy may editorially frame a supported tension or question, but it
     must not add a new factual assertion beyond its bound claims.

   INSIGHT
   - Never turn an observed mechanic or outcome into a claimed strategic insight,
     learning or causal conclusion unless the supplied evidence supports that meaning.
   - A narrative claim must state only what the evidence actually establishes.

   IDEA
   - Describe the supported campaign mechanic or creative proposition.
   - Do not infer strategic intent that is absent from the evidence.

   EXECUTION
   - Attribute only actions explicitly supported by the sources.
   - Preserve scope boundaries between Geek and the wider campaign.

   OUTCOME
   - Use only supported results or defensible continuity described by the evidence.
   - Do not infer causality, effectiveness or business impact from participation alone.

   If a required narrative field cannot be defensibly supported, do NOT manufacture a
   narrative claim simply to pass the quality gate. Return weaker/non-publishable evidence
   and allow the package to fail.

4. If evidence is insufficient:
   - use null for nullable editorial fields;
   - use [] for unsupported relationships/metrics;
   - mark weak claims publishable=false;
   - use low confidence where appropriate.
   It is better for the package to FAIL the quality gate than to invent anything.

5. METRICS:
   Every public metric must correspond to a metric claim.

   Confidence describes how strongly the supplied evidence supports the stated
   figure and scope; it does NOT mean the number must be mathematically exact.

   A figure reported as approximately 185M+, 750+, 8.2M or approximately 75%
   may still be high-confidence when the supplied evidence explicitly supports
   that figure and its scope.

   Wider-campaign metrics may be included only when:
   - the supplied evidence explicitly supports them;
   - confidence is high;
   - the metric label/note clearly says they are wider-campaign figures;
   - they are NOT presented as Geek-attributed performance.

   Conflicting or unreconciled Geek-specific figures must:
   - be low-confidence or non-publishable;
   - NOT appear in project.metrics.

6. QUOTES:
   Never manufacture or polish a quote.
   A quote must be directly supported by a supplied source.
   Otherwise return quote=null.

7. SOLUTIONS / IP:
   Never infer a Solution from a Service.
   A Solution slug may appear only when the evidence explicitly supports that
   Solution or methodology.

8. TAXONOMY:
   You may use ONLY the exact slugs supplied in the taxonomy registry.
   Do not create new slugs.
   If no allowed slug is supported, use null or [].

9. SOURCE IDs:
   Evidence claims may reference ONLY the exact source IDs supplied by the operator.
   Never create a source ID.

10. VERBATIM CLAIM SUPPORT:
    Every publishable claim MUST contain at least one support item.

    Each support item must contain:
    - sourceId: one of that claim's sourceIds;
    - excerpt: an exact VERBATIM substring copied from that source's supplied content.

    Do not paraphrase, rewrite, shorten with ellipses, clean up punctuation,
    alter capitalization, or manufacture a supporting excerpt.

    The application will verify the excerpt character-for-character against the
    trusted source content. A fabricated or modified excerpt will cause generation
    to fail.

    SUPPORT COMPLETENESS:
    For every publishable claim, the combined support excerpts must prove EVERY
    material element of the claim, including where relevant:
    - project / entity identity
    - company / brand identity
    - year or date
    - numbers
    - attribution
    - scope
    - chronology
    - qualifiers such as estimated, approximate, wider-campaign or tracked subset

    If one claim combines facts found on multiple source lines, include a verbatim
    support excerpt for EACH material element.

    Example:
    If a claim says "Project X was a 2019 campaign", support must establish:
    - that the project is Project X;
    - the year 2019;
    - that it was a campaign.

    If the supplied excerpts cannot jointly prove the full statement:
    - split it into narrower claims; or
    - mark it non-publishable.

    IDENTITY / ACRONYM / ALIAS RULES:

    Do not expand, normalize, rename or resolve an acronym, abbreviation, shorthand
    or entity alias unless the supplied support excerpts explicitly establish that
    equivalence.

    Examples:
    - If the evidence says "IRM", do not write "Influencer Relationship Management"
      unless another support excerpt explicitly establishes IRM = Influencer
      Relationship Management.
    - If the evidence says "Smile", do not silently rewrite it as
      "Smile Deke Dekho" unless the combined support excerpts explicitly establish
      that "Smile" refers to "Smile Deke Dekho".
    - Do not turn a brand shorthand, campaign shorthand, company abbreviation or
      internal label into a more specific canonical name unless supported.

    When the fuller identity IS supported elsewhere in the same trusted source:
    include that additional verbatim excerpt in the claim's support[].

    Otherwise preserve the exact supported terminology in the claim.

    Non-publishable claims may use support=[] when no defensible verbatim passage
    exists.

11. SOURCE METADATA:
    The application will replace your returned source metadata with the trusted
    operator source registry. Do not use source metadata as a place to add facts.

12. WRITING:
    Write clear, concise, credible case-study copy.
    Avoid hype, puffery and unsupported superlatives.
    Explain what was actually done and why it mattered.

13. RENDER MODE:
    Always "standard".

14. QUALITY:
    Do not decide whether the case study passes.
    Application code calculates quality after your response.
`.trim();

function taxonomyForPrompt(
  taxonomy: GenerationTaxonomy,
) {
  return {
    companies: taxonomy.companies,
    brands: taxonomy.brands,
    businessCategories:
      taxonomy.businessCategories,
    services: taxonomy.services,
    solutions: taxonomy.solutions,
  };
}

function sourcesForPrompt(
  sources: GenerationSource[],
) {
  return sources.map((source) => ({
    id: source.id,
    kind: source.kind,
    title: source.title,
    url: source.url ?? null,
    publisher: source.publisher ?? null,
    publicationDate:
      source.publicationDate ?? null,
    notes: source.notes ?? null,
    content: source.content,
  }));
}

function buildUserPrompt(
  request: GenerateCaseStudyRequest,
): string {
  return JSON.stringify(
    {
      task:
        "Create one evidence-grounded Gold Standard case-study draft.",

      projectHint:
        request.projectHint ?? null,

      allowedTaxonomy:
        taxonomyForPrompt(request.taxonomy),

      evidenceSources:
        sourcesForPrompt(request.sources),
    },
    null,
    2,
  );
}

/* ── Trusted provenance restoration ───────────────────────────────── */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Source metadata is operator-controlled.
 *
 * The model is required by the Structured Output schema to return sources, but
 * we deliberately discard that source list and restore the trusted registry.
 */
/**
 * Deterministically verify model-emitted claim support while the raw trusted
 * source content is still available.
 *
 * This proves:
 *
 *   claim
 *     → declared sourceId
 *     → exact excerpt
 *     → excerpt actually exists in trusted GenerationSource.content
 *
 * It does NOT yet judge semantic entailment. That will be a separate verifier
 * phase after this deterministic boundary.
 */
function assertVerbatimClaimSupport(
  modelOutput: unknown,
  sources: GenerationSource[],
) {
  if (!isObject(modelOutput)) {
    throw new Error(
      "Generated case-study output must be an object before claim-support verification.",
    );
  }

  if (!isObject(modelOutput.evidence)) {
    throw new Error(
      "Generated case-study output has no evidence object for claim-support verification.",
    );
  }

  const claims =
    modelOutput.evidence.claims;

  if (!Array.isArray(claims)) {
    throw new Error(
      "Generated case-study evidence has no claims array for claim-support verification.",
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

  claims.forEach(
    (claim, claimIndex) => {
      if (!isObject(claim)) {
        throw new Error(
          `Generated claim[${claimIndex}] is malformed during claim-support verification.`,
        );
      }

      const claimId =
        typeof claim.id === "string" &&
        claim.id.trim()
          ? claim.id.trim()
          : `claim[${claimIndex}]`;

      const claimSourceIds =
        Array.isArray(claim.sourceIds)
          ? claim.sourceIds.filter(
              (value): value is string =>
                typeof value === "string" &&
                Boolean(value.trim()),
            )
          : [];

      const support =
        claim.support;

      /**
       * New generations always require support[].
       *
       * Backward compatibility for old frozen packages is handled in
       * validatePackage.ts, not at this live generation boundary.
       */
      if (!Array.isArray(support)) {
        throw new Error(
          `Generated claim ${claimId} has no verbatim support array.`,
        );
      }

      if (
        claim.publishable === true &&
        support.length === 0
      ) {
        throw new Error(
          `Publishable claim ${claimId} has no verbatim source support.`,
        );
      }

      support.forEach(
        (item, supportIndex) => {
          if (!isObject(item)) {
            throw new Error(
              `Claim ${claimId} support[${supportIndex}] is malformed.`,
            );
          }

          const sourceId =
            typeof item.sourceId === "string"
              ? item.sourceId.trim()
              : "";

          const excerpt =
            typeof item.excerpt === "string"
              ? item.excerpt
              : "";

          if (!sourceId) {
            throw new Error(
              `Claim ${claimId} support[${supportIndex}] has no sourceId.`,
            );
          }

          if (!excerpt.trim()) {
            throw new Error(
              `Claim ${claimId} support[${supportIndex}] has an empty excerpt.`,
            );
          }

          if (
            !claimSourceIds.includes(
              sourceId,
            )
          ) {
            throw new Error(
              `Claim ${claimId} support source ${sourceId} is not listed in that claim's sourceIds.`,
            );
          }

          const trustedSource =
            sourceById.get(sourceId);

          if (!trustedSource) {
            throw new Error(
              `Claim ${claimId} support references unknown trusted source ${sourceId}.`,
            );
          }

          if (
            !trustedSource.content.includes(
              excerpt,
            )
          ) {
            throw new Error(
              `Claim ${claimId} contains a support excerpt that is not verbatim in trusted source ${sourceId}.`,
            );
          }
        },
      );
    },
  );
}

function restoreTrustedSources(
  modelOutput: unknown,
  sources: GenerationSource[],
): unknown {
  if (!isObject(modelOutput)) {
    return modelOutput;
  }

  const evidence = isObject(modelOutput.evidence)
    ? modelOutput.evidence
    : {};

  const trustedSources = sources.map(
    ({
      content: _content,
      ...source
    }) => ({
      ...source,
    }),
  );

  return {
    ...modelOutput,

    evidence: {
      ...evidence,
      sources: trustedSources,
    },
  };
}

/* ── Taxonomy integrity ───────────────────────────────────────────── */

function allowedSlugSet(
  items: TaxonomyItem[],
): Set<string> {
  return new Set(
    items.map((item) => item.slug),
  );
}

function assertSelectedSlugs(
  field: string,
  selected: string[] | undefined,
  allowed: Set<string>,
) {
  for (const slug of selected ?? []) {
    if (!allowed.has(slug)) {
      throw new Error(
        `Generated ${field} contains non-allowlisted slug: ${slug}`,
      );
    }
  }
}

function assertTaxonomyIntegrity(
  built: BuiltCaseStudyPackage,
  taxonomy: GenerationTaxonomy,
) {
  const project = built.package.project;

  const companies =
    allowedSlugSet(taxonomy.companies);

  const brands =
    allowedSlugSet(taxonomy.brands);

  const industries =
    allowedSlugSet(
      taxonomy.businessCategories,
    );

  const services =
    allowedSlugSet(taxonomy.services);

  const solutions =
    allowedSlugSet(taxonomy.solutions);

  if (
    project.companySlug &&
    !companies.has(project.companySlug)
  ) {
    throw new Error(
      `Generated companySlug is not allowlisted: ${project.companySlug}`,
    );
  }

  if (
    project.brandSlug &&
    !brands.has(project.brandSlug)
  ) {
    throw new Error(
      `Generated brandSlug is not allowlisted: ${project.brandSlug}`,
    );
  }

  assertSelectedSlugs(
    "businessCategorySlugs",
    project.businessCategorySlugs,
    industries,
  );

  assertSelectedSlugs(
    "serviceSlugs",
    project.serviceSlugs,
    services,
  );

  assertSelectedSlugs(
    "solutionSlugs",
    project.solutionSlugs,
    solutions,
  );

  /**
   * Validate Brand → Company using the operator registry before Payload ever
   * becomes involved. The Draft writer will independently verify this against
   * the actual CMS relationship later.
   */
  if (project.brandSlug) {
    const brand = taxonomy.brands.find(
      (item) =>
        item.slug === project.brandSlug,
    );

    if (!brand) {
      throw new Error(
        `Generated brandSlug cannot be resolved: ${project.brandSlug}`,
      );
    }

    if (
      project.companySlug &&
      brand.companySlug !==
        project.companySlug
    ) {
      throw new Error(
        `Generated Brand → Company mismatch: ${project.brandSlug} belongs to ${brand.companySlug}, not ${project.companySlug}.`,
      );
    }
  }
}

/* ── Generation ───────────────────────────────────────────────────── */

/**
 * Independently verify every claim the model marked publication-ready.
 *
 * At this point:
 * - Structured Output has parsed;
 * - support excerpts have been proven verbatim;
 * - package runtime validation has passed;
 * - Gold Standard quality has been recomputed;
 * - taxonomy has been checked against the operator allowlist.
 *
 * A publishable claim proceeds only when the independent verifier judges
 * its FULL material meaning as supported.
 */
async function assertPublishableClaimsSemanticallyVerified(
  built: BuiltCaseStudyPackage,
  options: GenerateCaseStudyOptions,
) {
  const publishableClaims =
    built.package.evidence.claims.filter(
      (claim) =>
        claim.publishable,
    );

  if (
    publishableClaims.length === 0
  ) {
    return;
  }

  const verifiableClaims:
    VerifiableClaim[] =
    publishableClaims.map(
      (claim) => {
        if (
          !claim.support ||
          claim.support.length === 0
        ) {
          /**
           * This should already have been rejected at the live generation
           * boundary. Keep this assertion so this layer also fails closed
           * independently.
           */
          throw new Error(
            `Publishable claim ${claim.id} reached semantic verification without verbatim support.`,
          );
        }

        return {
          id:
            claim.id,

          type:
            claim.type,

          statement:
            claim.statement,

          support:
            claim.support,
        };
      },
    );

  const verification =
    await verifyClaims(
      verifiableClaims,
      {
        client:
          options.verifierClient,

        model:
          options.verifierModel,
      },
    );

  assertSemanticVerification(
    publishableClaims,
    verification,
  );
}

export async function generateCaseStudy(
  request: GenerateCaseStudyRequest,
  options: GenerateCaseStudyOptions = {},
): Promise<BuiltCaseStudyPackage> {
  validateGenerationRequest(request);

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (!options.client && !apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required for Case Study Agent generation.",
    );
  }

  const client =
    options.client ??
    new OpenAI({
      apiKey,
    });

  const model =
    request.model ??
    process.env.CASE_STUDY_AGENT_MODEL ??
    "gpt-5.6";

  const response =
    await client.responses.create({
      model,

      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },

        {
          role: "user",
          content:
            buildUserPrompt(request),
        },
      ],

      text: {
        /**
         * Our schema is locally owned and already compile-tested.
         * The SDK boundary accepts the JSON Schema object here.
         */
        format:
          CASE_STUDY_RESPONSE_FORMAT as any,
      },
    });

  const outputText =
    response.output_text?.trim();

  if (!outputText) {
    throw new Error(
      "OpenAI returned no structured case-study output.",
    );
  }

  let modelOutput: unknown;

  try {
    modelOutput =
      JSON.parse(outputText);
  } catch (error) {
    throw new Error(
      `OpenAI returned invalid JSON despite Structured Outputs: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  /**
   * Verify exact claim → source passage bindings BEFORE trusted source content
   * is stripped from the generated package.
   */
  assertVerbatimClaimSupport(
    modelOutput,
    request.sources,
  );

  /**
   * Model-generated source metadata is never trusted.
   */
  const provenanceSafeOutput =
    restoreTrustedSources(
      modelOutput,
      request.sources,
    );

  const built =
    buildCaseStudyPackage(
      provenanceSafeOutput,
      {
        generatedAt:
          options.generatedAt,
      },
    );

  /**
   * Model-selected taxonomy must come only from the explicit operator registry.
   */
  assertTaxonomyIntegrity(
    built,
    request.taxonomy,
  );

  /**
   * Final evidence boundary before returning generated content:
   *
   * exact source passage
   *   → generated claim
   *   → independent semantic verifier
   *   → fail closed unless fully supported
   */
  await assertPublishableClaimsSemanticallyVerified(
    built,
    options,
  );

  return built;
}
