/**
 * GOLD STANDARD CASE STUDY AGENT — TRUSTED PORTFOLIO CONTEXT TESTS
 *
 * No AI.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves:
 * - taxonomy relationships are operator-controlled;
 * - Brand → Company graph is enforced;
 * - Industries / Services / Solutions are allowlisted;
 * - Solution / Geek IP relationships require explicit,
 *   publication-ready relationship evidence;
 * - no Solution can appear through similarity or inference;
 * - continuity is explicit and safe.
 */

import {
  buildTrustedPortfolioContext,
} from "./portfolioContext";

import type {
  BuildTrustedPortfolioContextRequest,
  TrustedPortfolioSelection,
} from "./portfolioContext";

import type {
  GenerationTaxonomy,
} from "./generator";

import type {
  EvidenceClaim,
} from "./types";

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

function rejectedWith(
  request:
    BuildTrustedPortfolioContextRequest,
  expected:
    string,
): boolean {
  try {
    buildTrustedPortfolioContext(
      request,
    );

    return false;
  } catch (error) {
    return (
      error instanceof Error &&
      error.message.includes(
        expected,
      )
    );
  }
}

/* ── Canonical sample taxonomy ────────────────────── */

const TAXONOMY: GenerationTaxonomy = {
  companies: [
    {
      slug:
        "pepsico",
      label:
        "PepsiCo",
    },

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
        "lays",
      label:
        "Lay's",
      companySlug:
        "pepsico",
    },

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

    {
      slug:
        "creator-strategy",
      label:
        "Creator Strategy",
    },
  ],

  solutions: [
    {
      slug:
        "influencer-relationship-management",
      label:
        "Influencer Relationship Management",
    },

    {
      slug:
        "sample-solution",
      label:
        "Sample Solution",
    },
  ],
};

/* ── Reconciled evidence ──────────────────────────── */

const CLAIMS: EvidenceClaim[] = [
  {
    id:
      "fact-campaign",

    type:
      "fact",

    statement:
      "The campaign activated creators.",

    sourceIds: [
      "source-report",
    ],

    confidence:
      "high",

    publishable:
      true,
  },

  {
    id:
      "rel-irm",

    type:
      "relationship",

    statement:
      "The project explicitly used Geek's Influencer Relationship Management solution.",

    sourceIds: [
      "source-report",
    ],

    confidence:
      "high",

    publishable:
      true,
  },

  {
    id:
      "rel-low-confidence",

    type:
      "relationship",

    statement:
      "An uncertain relationship claim.",

    sourceIds: [
      "source-report",
    ],

    confidence:
      "low",

    publishable:
      false,
  },
];

/* ── Base operator selection ──────────────────────── */

const BASE_SELECTION: TrustedPortfolioSelection = {
  project: {
    title:
      "Sample Campaign",

    slug:
      "sample-campaign",

    client:
      "Sample Brand",

    year:
      2026,

    location:
      "India",
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

  previousProjectSlug:
    "previous-project",

  nextProjectSlug:
    "next-project",
};

function baseRequest():
  BuildTrustedPortfolioContextRequest {
  return {
    taxonomy:
      clone(TAXONOMY),

    selection:
      clone(BASE_SELECTION),

    claims:
      clone(CLAIMS),
  };
}

/* ── Tests ────────────────────────────────────────── */

function main() {
  console.log(
    "Gold Standard Case Study Agent — Trusted Portfolio Context tests\n",
  );

  const request =
    baseRequest();

  const requestBefore =
    JSON.stringify(
      request,
    );

  const context =
    buildTrustedPortfolioContext(
      request,
    );

  check(
    "valid trusted portfolio context succeeds",
    Boolean(context),
  );

  check(
    "project identity survives validation",
    context.projectHint.title ===
      "Sample Campaign" &&
    context.projectHint.slug ===
      "sample-campaign",
  );

  check(
    "Company relationship survives validation",
    context.relationships
      .companySlug ===
      "sample-company",
  );

  check(
    "Brand relationship survives validation",
    context.relationships
      .brandSlug ===
      "sample-brand",
  );

  check(
    "business category survives validation",
    context.relationships
      .businessCategorySlugs
      .join(",") ===
      "fmcg",
  );

  check(
    "Service relationship survives validation",
    context.relationships
      .serviceSlugs
      .join(",") ===
      "influencer-marketing",
  );

  check(
    "no Solution is inferred when operator supplied none",
    context.relationships
      .solutionSlugs.length ===
      0 &&
    context.solutions.length ===
      0,
  );

  check(
    "explicit previous and next continuity survive validation",
    context.continuity
      .previousProjectSlug ===
      "previous-project" &&
    context.continuity
      .nextProjectSlug ===
      "next-project",
  );

  check(
    "continuity allowlist contains only approved portfolio neighbours",
    JSON.stringify(
      context.allowedContinuitySlugs,
    ) ===
      JSON.stringify([
        "previous-project",
        "next-project",
      ]),
  );

  /* ── Real benchmark principle: Smile ────────────── */

  const smile =
    baseRequest();

  smile.selection = {
    project: {
      title:
        "Lay's Smile Deke Dekho",

      slug:
        "lays-smile-deke-dekho",
    },

    companySlug:
      "pepsico",

    brandSlug:
      "lays",

    businessCategorySlugs: [
      "fmcg",
    ],

    serviceSlugs: [
      "influencer-marketing",
    ],

    solutions: [],

    nextProjectSlug:
      "lays-heartwork",
  };

  const smileContext =
    buildTrustedPortfolioContext(
      smile,
    );

  check(
    "Smile cannot acquire IRM by portfolio similarity",
    !smileContext.relationships
      .solutionSlugs
      .includes(
        "influencer-relationship-management",
      ),
  );

  /* ── Real benchmark principle: Heartwork ────────── */

  const heartwork =
    baseRequest();

  heartwork.selection = {
    project: {
      title:
        "Lay's Heartwork",

      slug:
        "lays-heartwork",
    },

    companySlug:
      "pepsico",

    brandSlug:
      "lays",

    businessCategorySlugs: [
      "fmcg",
    ],

    serviceSlugs: [
      "influencer-marketing",
    ],

    solutions: [],

    previousProjectSlug:
      "lays-smile-deke-dekho",

    nextProjectSlug:
      "lays-mylaysrelationchip",
  };

  const heartworkContext =
    buildTrustedPortfolioContext(
      heartwork,
    );

  check(
    "Heartwork cannot acquire IRM merely because a later Lay's project uses it",
    !heartworkContext.relationships
      .solutionSlugs
      .includes(
        "influencer-relationship-management",
      ),
  );

  /* ── Explicitly evidenced IRM project ───────────── */

  const relationchip =
    baseRequest();

  relationchip.selection = {
    project: {
      title:
        "Lay's MyLaysRelationchip",

      slug:
        "lays-mylaysrelationchip",
    },

    companySlug:
      "pepsico",

    brandSlug:
      "lays",

    businessCategorySlugs: [
      "fmcg",
    ],

    serviceSlugs: [
      "influencer-marketing",
    ],

    solutions: [
      {
        slug:
          "influencer-relationship-management",

        evidenceClaimIds: [
          "rel-irm",
        ],
      },
    ],

    previousProjectSlug:
      "lays-heartwork",
  };

  const relationchipContext =
    buildTrustedPortfolioContext(
      relationchip,
    );

  check(
    "explicitly evidenced project may receive canonical IRM",
    relationchipContext
      .relationships
      .solutionSlugs
      .includes(
        "influencer-relationship-management",
      ),
  );

  check(
    "validated Solution preserves its relationship evidence",
    relationchipContext
      .solutions[0]
      ?.evidenceClaimIds
      .join(",") ===
      "rel-irm",
  );

  /* ── Solution cannot be added without evidence ──── */

  const missingSolutionEvidence =
    baseRequest();

  missingSolutionEvidence
    .selection
    .solutions = [
    {
      slug:
        "influencer-relationship-management",

      evidenceClaimIds: [],
    },
  ];

  check(
    "Solution without explicit evidence is rejected",
    rejectedWith(
      missingSolutionEvidence,
      "requires explicit relationship evidence",
    ),
  );

  /* ── Fact claim cannot prove a Solution ─────────── */

  const wrongEvidenceType =
    baseRequest();

  wrongEvidenceType
    .selection
    .solutions = [
    {
      slug:
        "influencer-relationship-management",

      evidenceClaimIds: [
        "fact-campaign",
      ],
    },
  ];

  check(
    "ordinary fact cannot establish Solution relationship",
    rejectedWith(
      wrongEvidenceType,
      "must be type relationship",
    ),
  );

  /* ── Low-confidence relationship cannot prove IP ─ */

  const weakSolution =
    baseRequest();

  weakSolution
    .selection
    .solutions = [
    {
      slug:
        "influencer-relationship-management",

      evidenceClaimIds: [
        "rel-low-confidence",
      ],
    },
  ];

  check(
    "low-confidence relationship evidence cannot establish Solution",
    rejectedWith(
      weakSolution,
      "requires publication-ready evidence claim",
    ),
  );

  /* ── Invented Solution rejected ─────────────────── */

  const inventedSolution =
    baseRequest();

  inventedSolution
    .selection
    .solutions = [
    {
      slug:
        "invented-solution",

      evidenceClaimIds: [
        "rel-irm",
      ],
    },
  ];

  check(
    "non-allowlisted Solution is rejected",
    rejectedWith(
      inventedSolution,
      "Solution is not allowlisted",
    ),
  );

  /* ── Unknown evidence rejected ──────────────────── */

  const unknownRelationshipEvidence =
    baseRequest();

  unknownRelationshipEvidence
    .selection
    .solutions = [
    {
      slug:
        "influencer-relationship-management",

      evidenceClaimIds: [
        "rel-does-not-exist",
      ],
    },
  ];

  check(
    "Solution cannot reference invented evidence claim",
    rejectedWith(
      unknownRelationshipEvidence,
      "references unknown evidence claim",
    ),
  );

  /* ── Brand requires Company ─────────────────────── */

  const brandWithoutCompany =
    baseRequest();

  brandWithoutCompany
    .selection
    .companySlug =
    undefined;

  check(
    "Brand without Company is rejected",
    rejectedWith(
      brandWithoutCompany,
      "Brand requires an explicit Company",
    ),
  );

  /* ── Brand → Company mismatch ───────────────────── */

  const wrongCompany =
    baseRequest();

  wrongCompany.selection
    .companySlug =
    "pepsico";

  check(
    "Brand → Company mismatch is rejected",
    rejectedWith(
      wrongCompany,
      "Brand → Company mismatch",
    ),
  );

  /* ── Unknown Company ────────────────────────────── */

  const inventedCompany =
    baseRequest();

  inventedCompany.selection
    .companySlug =
    "invented-company";

  check(
    "non-allowlisted Company is rejected",
    rejectedWith(
      inventedCompany,
      "companySlug is not allowlisted",
    ),
  );

  /* ── Unknown Brand ──────────────────────────────── */

  const inventedBrand =
    baseRequest();

  inventedBrand.selection
    .brandSlug =
    "invented-brand";

  check(
    "non-allowlisted Brand is rejected",
    rejectedWith(
      inventedBrand,
      "brandSlug is not allowlisted",
    ),
  );

  /* ── Unknown Industry ───────────────────────────── */

  const inventedIndustry =
    baseRequest();

  inventedIndustry.selection
    .businessCategorySlugs = [
    "invented-industry",
  ];

  check(
    "non-allowlisted business category is rejected",
    rejectedWith(
      inventedIndustry,
      "businessCategorySlugs contains non-allowlisted slug",
    ),
  );

  /* ── Missing Industry ───────────────────────────── */

  const missingIndustry =
    baseRequest();

  missingIndustry.selection
    .businessCategorySlugs =
    [];

  check(
    "portfolio requires at least one business category",
    rejectedWith(
      missingIndustry,
      "requires at least one business category",
    ),
  );

  /* ── Unknown Service ────────────────────────────── */

  const inventedService =
    baseRequest();

  inventedService.selection
    .serviceSlugs = [
    "invented-service",
  ];

  check(
    "non-allowlisted Service is rejected",
    rejectedWith(
      inventedService,
      "serviceSlugs contains non-allowlisted slug",
    ),
  );

  /* ── Missing Service ────────────────────────────── */

  const missingService =
    baseRequest();

  missingService.selection
    .serviceSlugs =
    [];

  check(
    "portfolio requires at least one Service",
    rejectedWith(
      missingService,
      "requires at least one Service",
    ),
  );

  /* ── Duplicate Service ──────────────────────────── */

  const duplicateService =
    baseRequest();

  duplicateService.selection
    .serviceSlugs = [
    "influencer-marketing",
    "influencer-marketing",
  ];

  check(
    "duplicate Service relationship is rejected",
    rejectedWith(
      duplicateService,
      "contains duplicate slug",
    ),
  );

  /* ── Current project cannot point to itself ─────── */

  const selfContinuity =
    baseRequest();

  selfContinuity.selection
    .nextProjectSlug =
    "sample-campaign";

  check(
    "project cannot use itself as next continuity target",
    rejectedWith(
      selfContinuity,
      "nextProjectSlug cannot equal the current project slug",
    ),
  );

  /* ── Previous and next must differ ──────────────── */

  const sameNeighbours =
    baseRequest();

  sameNeighbours.selection
    .previousProjectSlug =
    "same-project";

  sameNeighbours.selection
    .nextProjectSlug =
    "same-project";

  check(
    "previous and next continuity targets must differ",
    rejectedWith(
      sameNeighbours,
      "previous and next project slugs must be different",
    ),
  );

  /* ── Taxonomy itself must be internally valid ───── */

  const brokenTaxonomy =
    baseRequest();

  brokenTaxonomy.taxonomy
    .brands[0]
    .companySlug =
    "missing-company";

  check(
    "taxonomy Brand cannot reference unknown Company",
    rejectedWith(
      brokenTaxonomy,
      "references unknown company",
    ),
  );

  /* ── Input immutability ─────────────────────────── */

  check(
    "Trusted Portfolio Context does not mutate operator input",
    JSON.stringify(
      request,
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

main();
