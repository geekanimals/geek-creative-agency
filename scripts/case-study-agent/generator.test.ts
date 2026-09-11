/**
 * GOLD STANDARD CASE STUDY AGENT — GENERATOR SAFETY TESTS
 *
 * No real OpenAI call.
 * No DB.
 * No Payload.
 * No network.
 *
 * Proves:
 * - Structured model output builds a trusted package;
 * - model-supplied source metadata is discarded;
 * - operator source metadata is restored;
 * - model cannot self-approve quality;
 * - unsupported narrative remains FAIL;
 * - invented taxonomy slugs are rejected;
 * - Brand → Company mismatch is rejected;
 * - fabricated source references fail the trusted quality gate;
 * - invalid JSON is rejected;
 * - empty model output is rejected.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/generator.test.ts
 */

import {
  generateCaseStudy,
} from "./generator";

import type {
  GenerateCaseStudyRequest,
} from "./generator";

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

function clone<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
}

function fakeClient(
  outputText: string | undefined,
) {
  return {
    responses: {
      create: async () => ({
        output_text: outputText,
      }),
    },
  } as never;
}


/**
 * Independent zero-network semantic verifier used by generator tests.
 *
 * It reads the verifier's supplied claim batch and marks every claim
 * fully supported. Individual verifier/gate behavior is tested separately
 * in verifier.test.ts and verificationGate.test.ts.
 */
function fakeVerifierClient() {
  return {
    responses: {
      create: async (args: any) => {
        const userMessage =
          args?.input?.find(
            (item: any) =>
              item?.role === "user",
          );

        const parsed =
          JSON.parse(
            userMessage?.content ?? "{}",
          );

        const claims =
          Array.isArray(parsed.claims)
            ? parsed.claims
            : [];

        return {
          output_text:
            JSON.stringify({
              results:
                claims.map(
                  (claim: any) => ({
                    claimId:
                      claim.claimId,

                    verdict:
                      "supported",

                    reason:
                      "Fake test verifier marks supplied claim as supported.",

                    unsupportedElements:
                      [],
                  }),
                ),
            }),
        };
      },
    },
  } as never;
}

const REQUEST: GenerateCaseStudyRequest = {
  sources: [
    {
      id: "source-report",
      kind: "internal-document",
      title: "Final Campaign Report",

      content: `
The campaign was created for Sample Brand.

Sample Brand belongs to Sample Company.

The launch competed in a crowded category.

The campaign strategy was built around active creator participation.

Geek developed the creator structure, campaign mechanics and activation workflow.

The campaign activated 500 creators.

The project explicitly used the Sample Solution methodology.

The resulting campaign created measurable participation and a repeatable activation model.
      `.trim(),

      url:
        "https://internal.example.com/report",

      publisher:
        "Geek Creative Agency",

      publicationDate:
        "2026-08-15",

      capturedAt:
        "2026-09-05T00:00:00.000Z",

      notes:
        "Operator-trusted source metadata.",
    },
  ],

  taxonomy: {
    companies: [
      {
        slug: "sample-company",
        label: "Sample Company",
      },
    ],

    brands: [
      {
        slug: "sample-brand",
        label: "Sample Brand",
        companySlug: "sample-company",
      },
    ],

    businessCategories: [
      {
        slug: "fmcg",
        label: "FMCG",
      },
    ],

    services: [
      {
        slug: "influencer-marketing",
        label: "Influencer Marketing",
      },
    ],

    solutions: [
      {
        slug: "sample-solution",
        label: "Sample Solution",
      },
    ],
  },

  projectHint: {
    title: "Sample Case Study",
    slug: "sample-case-study",
    client: "Sample Brand",
    year: 2026,
  },

  model: "fake-model",
};

const MODEL_OUTPUT = {
  project: {
    slug: "sample-case-study",
    title: "Sample Case Study",

    client: "Sample Brand",
    year: 2026,
    location: null,

    shortSummary:
      "A creator-led campaign built around active participation.",

    cardSummary:
      "A creator-led campaign built for participation.",

    renderMode: "standard",
    projectKind: "campaign",

    heroLegacySrc: null,

    companySlug: "sample-company",
    brandSlug: "sample-brand",

    businessCategorySlugs: [
      "fmcg",
    ],

    serviceSlugs: [
      "influencer-marketing",
    ],

    solutionSlugs: [
      "sample-solution",
    ],

    headline:
      "Turning a launch into active participation.",

    challenge: {
      question:
        "How could the launch compete for attention?",
      copy:
        "The launch had to compete in a crowded category.",
    },

    insight:
      "The strategy identified active participation as more useful than passive exposure for this campaign.",

    idea: {
      statement:
        "Give creators an active role in the launch.",
      copy:
        "The campaign structure was designed around creator participation.",
    },

    execution:
      "Geek developed the creator structure, campaign mechanics and activation workflow.",

    outcome:
      "The campaign created measurable participation and a repeatable activation model.",

    quote: null,

    metrics: [
      {
        value: "500",
        label: "Creators",
        prefix: null,
        suffix: null,
        note: null,
        claimId: "metric-creators",
      },
    ],

    seo: {
      metaTitle:
        "Sample Case Study | Geek",
      metaDescription:
        "How Geek built a creator-led campaign around active participation.",
      noindex: true,
    },
  },

  evidence: {
    /**
     * Deliberately fake metadata.
     * Generator must throw this source object away and restore REQUEST.sources.
     */
    sources: [
      {
        id: "source-report",
        kind: "independent-editorial",
        title: "MODEL INVENTED TITLE",
        url:
          "https://evil.example.com/fake",
        publisher:
          "MODEL INVENTED PUBLISHER",
        publicationDate:
          "1900-01-01",
        capturedAt:
          "1900-01-01T00:00:00.000Z",
        notes:
          "MODEL INVENTED NOTES",
      },
    ],

    claims: [
      {
        id: "narrative-challenge",
        type: "narrative",

        statement:
          "The launch competed in a crowded category.",

        sourceIds: [
          "source-report",
        ],
        support: [
          {
            sourceId: "source-report",
            excerpt: 'The launch competed in a crowded category.',
          },
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-insight",
        type: "narrative",

        statement:
          "The strategy was built around active creator participation.",

        sourceIds: [
          "source-report",
        ],
        support: [
          {
            sourceId: "source-report",
            excerpt: 'The campaign strategy was built around active creator participation.',
          },
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-idea",
        type: "narrative",

        statement:
          "The campaign gave creators an active role.",

        sourceIds: [
          "source-report",
        ],
        support: [
          {
            sourceId: "source-report",
            excerpt: 'The campaign strategy was built around active creator participation.',
          },
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-execution",
        type: "fact",

        statement:
          "Geek developed the creator structure, campaign mechanics and activation workflow.",

        sourceIds: [
          "source-report",
        ],
        support: [
          {
            sourceId: "source-report",
            excerpt: 'Geek developed the creator structure, campaign mechanics and activation workflow.',
          },
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "narrative-outcome",
        type: "narrative",

        statement:
          "The campaign created measurable participation and a repeatable activation model.",

        sourceIds: [
          "source-report",
        ],
        support: [
          {
            sourceId: "source-report",
            excerpt: 'The resulting campaign created measurable participation and a repeatable activation model.',
          },
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "metric-creators",
        type: "metric",

        statement:
          "The campaign activated 500 creators.",

        sourceIds: [
          "source-report",
        ],
        support: [
          {
            sourceId: "source-report",
            excerpt: 'The campaign activated 500 creators.',
          },
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },

      {
        id: "relationship-solution",
        type: "relationship",

        statement:
          "The project explicitly used the Sample Solution methodology.",

        sourceIds: [
          "source-report",
        ],
        support: [
          {
            sourceId: "source-report",
            excerpt: 'The project explicitly used the Sample Solution methodology.',
          },
        ],

        confidence: "high",
        publishable: true,
        note: null,
      },
    ],

    narrativeBindings: [
      {
        field: "challenge",
        claimIds: [
          "narrative-challenge",
        ],
      },

      {
        field: "insight",
        claimIds: [
          "narrative-insight",
        ],
      },

      {
        field: "idea",
        claimIds: [
          "narrative-idea",
        ],
      },

      {
        field: "execution",
        claimIds: [
          "narrative-execution",
        ],
      },

      {
        field: "outcome",
        claimIds: [
          "narrative-outcome",
        ],
      },
    ],
  },

  /**
   * Deliberate model attempt to control trusted roots.
   * buildCaseStudyPackage ignores these.
   */
  schemaVersion: "999",

  generatedAt:
    "1900-01-01T00:00:00.000Z",

  quality: {
    status: "pass",
    draftReady: true,
    score: 999,
    issues: [],
  },
};

async function main() {
  console.log(
    "Gold Standard Case Study Agent — generator safety tests\n",
  );

  /* ── 1. Valid fake generation ───────────────────────────────────── */

  const built =
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            JSON.stringify(
              MODEL_OUTPUT,
            ),
          ),

        generatedAt:
          "2026-09-05T01:00:00.000Z",
      },
    );

  check(
    "valid generated package passes",
    built.quality.status === "pass",
  );

  check(
    "valid generated package is draft-ready",
    built.quality.draftReady === true,
  );

  check(
    "quality is recomputed to 100",
    built.quality.score === 100,
  );

  check(
    "model cannot control schemaVersion",
    built.package.schemaVersion === "1.0",
  );

  check(
    "model cannot control generatedAt",
    built.package.generatedAt ===
      "2026-09-05T01:00:00.000Z",
  );

  check(
    "model cannot self-assign quality score",
    built.package.quality.score !== 999,
  );

  /* ── 2. Trusted source restoration ──────────────────────────────── */

  const source =
    built.package.evidence.sources[0];

  check(
    "trusted source title is restored",
    source.title ===
      "Final Campaign Report",
  );

  check(
    "model-invented publisher is discarded",
    source.publisher ===
      "Geek Creative Agency",
  );

  check(
    "trusted source URL is restored",
    source.url ===
      "https://internal.example.com/report",
  );

  check(
    "trusted source kind is restored",
    source.kind ===
      "internal-document",
  );

  check(
    "source content does not enter package provenance",
    !(
      "content" in
      (source as unknown as Record<string, unknown>)
    ),
  );

  /* ── 3. Unsupported narrative cannot self-approve ───────────────── */

  const unsupported =
    clone(MODEL_OUTPUT);

  unsupported.evidence.narrativeBindings =
    unsupported.evidence.narrativeBindings.filter(
      (binding) =>
        binding.field !== "outcome",
    );

  const unsupportedBuilt =
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            JSON.stringify(
              unsupported,
            ),
          ),
      },
    );

  check(
    "unsupported generated narrative becomes FAIL",
    unsupportedBuilt.quality.status === "fail",
  );

  check(
    "unsupported generated narrative is not draft-ready",
    unsupportedBuilt.quality.draftReady === false,
  );

  check(
    "trusted quality gate reports missing binding",
    unsupportedBuilt.quality.issues.some(
      (issue) =>
        issue.code ===
        "NARRATIVE_EVIDENCE_BINDING_MISSING",
    ),
  );

  /* ── 4. Invented taxonomy slug is rejected ──────────────────────── */

  const inventedService =
    clone(MODEL_OUTPUT);

  inventedService.project.serviceSlugs = [
    "model-invented-service",
  ];

  let inventedServiceRejected = false;

  try {
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            JSON.stringify(
              inventedService,
            ),
          ),
      },
    );
  } catch (error) {
    inventedServiceRejected =
      error instanceof Error &&
      error.message.includes(
        "non-allowlisted slug",
      );
  }

  check(
    "invented service slug is rejected",
    inventedServiceRejected,
  );

  /* ── 5. Invented Company slug is rejected ───────────────────────── */

  const inventedCompany =
    clone(MODEL_OUTPUT);

  inventedCompany.project.companySlug =
    "fake-company";

  let inventedCompanyRejected = false;

  try {
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            JSON.stringify(
              inventedCompany,
            ),
          ),
      },
    );
  } catch (error) {
    inventedCompanyRejected =
      error instanceof Error &&
      error.message.includes(
        "companySlug is not allowlisted",
      );
  }

  check(
    "invented company slug is rejected",
    inventedCompanyRejected,
  );

  /* ── 6. Brand → Company mismatch ────────────────────────────────── */

  const mismatchRequest =
    clone(REQUEST);

  mismatchRequest.taxonomy.companies.push(
    {
      slug: "other-company",
      label: "Other Company",
    },
  );

  const mismatchOutput =
    clone(MODEL_OUTPUT);

  mismatchOutput.project.companySlug =
    "other-company";

  let mismatchRejected = false;

  try {
    await generateCaseStudy(
      mismatchRequest,
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            JSON.stringify(
              mismatchOutput,
            ),
          ),
      },
    );
  } catch (error) {
    mismatchRejected =
      error instanceof Error &&
      error.message.includes(
        "Brand → Company mismatch",
      );
  }

  check(
    "Brand → Company mismatch is rejected",
    mismatchRejected,
  );

  /* ── 7. Fabricated source reference is rejected ─────────────────── */

  const fakeSourceClaim =
    clone(MODEL_OUTPUT);

  fakeSourceClaim.evidence.claims[0]
    .sourceIds = [
      "source-model-invented",
    ];

  fakeSourceClaim.evidence.claims[0]
    .support = [
      {
        sourceId:
          "source-model-invented",
        excerpt:
          "The launch competed in a crowded category.",
      },
    ];

  let fabricatedSourceRejected = false;

  try {
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            JSON.stringify(
              fakeSourceClaim,
            ),
          ),
      },
    );
  } catch (error) {
    fabricatedSourceRejected =
      error instanceof Error &&
      error.message.includes(
        "unknown trusted source source-model-invented",
      );
  }

  check(
    "fabricated source reference is rejected before package build",
    fabricatedSourceRejected,
  );

  /* ── Verbatim support attack ───────────────────────────────────── */

  const fabricatedExcerptOutput =
    clone(MODEL_OUTPUT);

  fabricatedExcerptOutput
    .evidence
    .claims[0]
    .support = [
      {
        sourceId: "source-report",

        /**
         * Deliberately paraphrased.
         *
         * Trusted source says:
         * "The launch competed in a crowded category."
         */
        excerpt:
          "The launch competed in an extremely crowded category.",
      },
    ];

  let fabricatedExcerptRejected = false;

  try {
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            JSON.stringify(
              fabricatedExcerptOutput,
            ),
          ),
      },
    );
  } catch (error) {
    fabricatedExcerptRejected =
      error instanceof Error &&
      error.message.includes(
        "not verbatim in trusted source",
      );
  }

  check(
    "fabricated support excerpt is rejected before package build",
    fabricatedExcerptRejected,
  );

  /* ── Semantic verifier refusal integration ─────────────────────── */

  let semanticPartialRejected = false;

  try {
    await generateCaseStudy(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              MODEL_OUTPUT,
            ),
          ),

        verifierClient: {
          responses: {
            create: async (args: any) => {
              const userMessage =
                args?.input?.find(
                  (item: any) =>
                    item?.role === "user",
                );

              const parsed =
                JSON.parse(
                  userMessage?.content ?? "{}",
                );

              const claims =
                Array.isArray(parsed.claims)
                  ? parsed.claims
                  : [];

              return {
                output_text:
                  JSON.stringify({
                    results:
                      claims.map(
                        (
                          claim: any,
                          index: number,
                        ) => ({
                          claimId:
                            claim.claimId,

                          verdict:
                            index === 0
                              ? "partial"
                              : "supported",

                          reason:
                            index === 0
                              ? "The supplied excerpt does not prove the full material claim."
                              : "Fully supported.",

                          unsupportedElements:
                            index === 0
                              ? [
                                  "full material claim",
                                ]
                              : [],
                        }),
                      ),
                  }),
              };
            },
          },
        } as never,
      },
    );
  } catch (error) {
    semanticPartialRejected =
      error instanceof Error &&
      error.message.includes(
        "Semantic evidence verification refused generation",
      ) &&
      error.message.includes(
        "narrative-challenge",
      ) &&
      error.message.includes(
        "partial",
      );
  }

  check(
    "generateCaseStudy fails closed when semantic verifier returns partial",
    semanticPartialRejected,
  );

  /* ── 8. Invalid JSON ─────────────────────────────────────────────── */

  let invalidJsonRejected = false;

  try {
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(
            "{ definitely not json",
          ),
      },
    );
  } catch (error) {
    invalidJsonRejected =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "invalid model JSON is rejected",
    invalidJsonRejected,
  );

  /* ── 9. Empty response ───────────────────────────────────────────── */

  let emptyRejected = false;

  try {
    await generateCaseStudy(
      clone(REQUEST),
      {
        verifierClient:
          fakeVerifierClient(),

        client:
          fakeClient(""),
      },
    );
  } catch (error) {
    emptyRejected =
      error instanceof Error &&
      error.message.includes(
        "no structured case-study output",
      );
  }

  check(
    "empty model response is rejected",
    emptyRejected,
  );

  /* ── Result ──────────────────────────────────────────────────────── */

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(
    fail === 0 ? 0 : 1,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
