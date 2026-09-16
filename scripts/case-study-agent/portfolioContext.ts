/**
 * GOLD STANDARD CASE STUDY AGENT — TRUSTED PORTFOLIO CONTEXT
 *
 * Deterministic operator-controlled portfolio graph.
 *
 * Responsibilities:
 * - validate project identity;
 * - validate Company → Brand relationship;
 * - validate Industry / Service / Solution taxonomy selections;
 * - require explicit evidence for every Solution / Geek IP relationship;
 * - validate previous / next project continuity;
 * - produce the exact trusted context consumed by the Flexible pipeline.
 *
 * IMPORTANT:
 * - No AI.
 * - No Payload.
 * - No database.
 * - No CMS write.
 * - No publishing.
 * - The model cannot invent taxonomy relationships here.
 */

import type {
  GenerationTaxonomy,
  ProjectHint,
} from "./generator";

import type {
  EvidenceClaim,
} from "./types";

/* ── Trusted operator input ────────────────────────── */

export type TrustedProjectIdentity = {
  title:
    string;

  slug:
    string;

  client?:
    string;

  year?:
    number;

  location?:
    string;

  editorialNote?:
    string;
};

export type TrustedSolutionRelationship = {
  /**
   * Canonical allowlisted Solution / Geek IP slug.
   */
  slug:
    string;

  /**
   * Explicit evidence proving this project genuinely
   * has this Solution relationship.
   *
   * These must resolve to publication-ready
   * EvidenceClaim records of type "relationship".
   */
  evidenceClaimIds:
    string[];
};

export type TrustedPortfolioSelection = {
  project:
    TrustedProjectIdentity;

  companySlug?:
    string;

  brandSlug?:
    string;

  businessCategorySlugs:
    string[];

  serviceSlugs:
    string[];

  /**
   * Empty is valid.
   *
   * Solutions must NEVER be inferred merely because a
   * campaign resembles another project.
   */
  solutions:
    TrustedSolutionRelationship[];

  /**
   * Exact operator-approved portfolio continuity.
   *
   * These are not general suggestions. They define the
   * only previous / next project relationships that may
   * be used by downstream AI.
   */
  previousProjectSlug?:
    string;

  nextProjectSlug?:
    string;
};

export type BuildTrustedPortfolioContextRequest = {
  taxonomy:
    GenerationTaxonomy;

  selection:
    TrustedPortfolioSelection;

  /**
   * Reconciled evidence ledger.
   *
   * Required so Solution / IP relationships can be
   * proven rather than inferred.
   */
  claims:
    EvidenceClaim[];
};

/* ── Validated output ──────────────────────────────── */

export type TrustedPortfolioRelationships = {
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

export type TrustedPortfolioContinuity = {
  previousProjectSlug?:
    string;

  nextProjectSlug?:
    string;
};

export type ValidatedSolutionRelationship = {
  slug:
    string;

  evidenceClaimIds:
    string[];
};

export type TrustedPortfolioContext = {
  projectHint:
    ProjectHint;

  relationships:
    TrustedPortfolioRelationships;

  solutions:
    ValidatedSolutionRelationship[];

  continuity:
    TrustedPortfolioContinuity;

  /**
   * Convenience projection for the existing Architect /
   * Designer allowlist contracts.
   */
  allowedContinuitySlugs:
    string[];
};

/* ── Helpers ───────────────────────────────────────── */

const SAFE_SLUG =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

function cleanOptional(
  value:
    | string
    | undefined,
): string | undefined {
  if (
    !value
  ) {
    return undefined;
  }

  const cleaned =
    value.trim();

  return cleaned
    ? cleaned
    : undefined;
}

function assertSlug(
  value: unknown,
  context: string,
): asserts value is string {
  if (
    !nonEmpty(
      value,
    ) ||
    !SAFE_SLUG.test(
      value.trim(),
    )
  ) {
    throw new Error(
      `${context} must be a safe lower-kebab-case slug.`,
    );
  }
}

function assertUniqueSlugs(
  values:
    string[],
  context:
    string,
) {
  const seen =
    new Set<string>();

  for (
    const value
    of values
  ) {
    assertSlug(
      value,
      context,
    );

    if (
      seen.has(
        value,
      )
    ) {
      throw new Error(
        `${context} contains duplicate slug: ${value}`,
      );
    }

    seen.add(
      value,
    );
  }
}

function taxonomySlugSet(
  items:
    Array<{
      slug:
        string;
    }>,
  context:
    string,
): Set<string> {
  const result =
    new Set<string>();

  for (
    const item
    of items
  ) {
    assertSlug(
      item.slug,
      `${context}.slug`,
    );

    if (
      result.has(
        item.slug,
      )
    ) {
      throw new Error(
        `${context} contains duplicate slug: ${item.slug}`,
      );
    }

    result.add(
      item.slug,
    );
  }

  return result;
}

function assertSelected(
  values:
    string[],
  allowed:
    Set<string>,
  context:
    string,
) {
  assertUniqueSlugs(
    values,
    context,
  );

  for (
    const value
    of values
  ) {
    if (
      !allowed.has(
        value,
      )
    ) {
      throw new Error(
        `${context} contains non-allowlisted slug: ${value}`,
      );
    }
  }
}

/* ── Taxonomy validation ───────────────────────────── */

function validateTaxonomy(
  taxonomy:
    GenerationTaxonomy,
) {
  const companies =
    taxonomySlugSet(
      taxonomy.companies,
      "Portfolio taxonomy companies",
    );

  const brands =
    taxonomySlugSet(
      taxonomy.brands,
      "Portfolio taxonomy brands",
    );

  const businessCategories =
    taxonomySlugSet(
      taxonomy.businessCategories,
      "Portfolio taxonomy businessCategories",
    );

  const services =
    taxonomySlugSet(
      taxonomy.services,
      "Portfolio taxonomy services",
    );

  const solutions =
    taxonomySlugSet(
      taxonomy.solutions,
      "Portfolio taxonomy solutions",
    );

  for (
    const brand
    of taxonomy.brands
  ) {
    assertSlug(
      brand.companySlug,
      `Portfolio taxonomy brand ${brand.slug}.companySlug`,
    );

    if (
      !companies.has(
        brand.companySlug,
      )
    ) {
      throw new Error(
        `Portfolio taxonomy brand ${brand.slug} references unknown company: ${brand.companySlug}`,
      );
    }
  }

  return {
    companies,
    brands,
    businessCategories,
    services,
    solutions,
  };
}

/* ── Project identity ──────────────────────────────── */

function validateProject(
  project:
    TrustedProjectIdentity,
): ProjectHint {
  if (
    !nonEmpty(
      project.title,
    )
  ) {
    throw new Error(
      "Trusted portfolio project requires title.",
    );
  }

  assertSlug(
    project.slug,
    "Trusted portfolio project.slug",
  );

  if (
    project.year !==
      undefined &&
    (
      !Number.isInteger(
        project.year,
      ) ||
      project.year <
        1900 ||
      project.year >
        2100
    )
  ) {
    throw new Error(
      "Trusted portfolio project.year must be an integer between 1900 and 2100.",
    );
  }

  return {
    title:
      project.title.trim(),

    slug:
      project.slug.trim(),

    client:
      cleanOptional(
        project.client,
      ),

    year:
      project.year,

    location:
      cleanOptional(
        project.location,
      ),

    editorialNote:
      cleanOptional(
        project.editorialNote,
      ),
  };
}

/* ── Solution evidence validation ──────────────────── */

function validateSolutions(
  selections:
    TrustedSolutionRelationship[],
  allowedSolutions:
    Set<string>,
  claims:
    EvidenceClaim[],
): ValidatedSolutionRelationship[] {
  const claimMap =
    new Map(
      claims.map(
        (claim) => [
          claim.id,
          claim,
        ],
      ),
    );

  const seenSolutions =
    new Set<string>();

  const output:
    ValidatedSolutionRelationship[] =
    [];

  for (
    const selection
    of selections
  ) {
    assertSlug(
      selection.slug,
      "Trusted portfolio solution.slug",
    );

    if (
      seenSolutions.has(
        selection.slug,
      )
    ) {
      throw new Error(
        `Trusted portfolio contains duplicate Solution relationship: ${selection.slug}`,
      );
    }

    seenSolutions.add(
      selection.slug,
    );

    if (
      !allowedSolutions.has(
        selection.slug,
      )
    ) {
      throw new Error(
        `Trusted portfolio Solution is not allowlisted: ${selection.slug}`,
      );
    }

    if (
      !Array.isArray(
        selection.evidenceClaimIds,
      ) ||
      selection.evidenceClaimIds
        .length ===
        0
    ) {
      throw new Error(
        `Trusted portfolio Solution "${selection.slug}" requires explicit relationship evidence.`,
      );
    }

    assertUniqueSlugs(
      selection.evidenceClaimIds,
      `Trusted portfolio Solution ${selection.slug}.evidenceClaimIds`,
    );

    for (
      const claimId
      of selection.evidenceClaimIds
    ) {
      const claim =
        claimMap.get(
          claimId,
        );

      if (!claim) {
        throw new Error(
          `Trusted portfolio Solution "${selection.slug}" references unknown evidence claim: ${claimId}`,
        );
      }

      if (
        claim.type !==
        "relationship"
      ) {
        throw new Error(
          `Trusted portfolio Solution "${selection.slug}" evidence claim must be type relationship: ${claimId}`,
        );
      }

      if (
        !claim.publishable ||
        claim.confidence ===
          "low"
      ) {
        throw new Error(
          `Trusted portfolio Solution "${selection.slug}" requires publication-ready evidence claim: ${claimId}`,
        );
      }
    }

    output.push({
      slug:
        selection.slug,

      evidenceClaimIds:
        [
          ...selection
            .evidenceClaimIds,
        ],
    });
  }

  return output;
}

/* ── Continuity validation ─────────────────────────── */

function validateContinuity(
  projectSlug:
    string,
  previousProjectSlug:
    string | undefined,
  nextProjectSlug:
    string | undefined,
): {
  continuity:
    TrustedPortfolioContinuity;

  allowedContinuitySlugs:
    string[];
} {
  const previous =
    cleanOptional(
      previousProjectSlug,
    );

  const next =
    cleanOptional(
      nextProjectSlug,
    );

  if (
    previous
  ) {
    assertSlug(
      previous,
      "Trusted portfolio previousProjectSlug",
    );

    if (
      previous ===
      projectSlug
    ) {
      throw new Error(
        "Trusted portfolio previousProjectSlug cannot equal the current project slug.",
      );
    }
  }

  if (
    next
  ) {
    assertSlug(
      next,
      "Trusted portfolio nextProjectSlug",
    );

    if (
      next ===
      projectSlug
    ) {
      throw new Error(
        "Trusted portfolio nextProjectSlug cannot equal the current project slug.",
      );
    }
  }

  if (
    previous &&
    next &&
    previous ===
      next
  ) {
    throw new Error(
      "Trusted portfolio previous and next project slugs must be different.",
    );
  }

  const allowedContinuitySlugs =
    [
      previous,
      next,
    ].filter(
      (
        value,
      ): value is string =>
        Boolean(value),
    );

  return {
    continuity: {
      previousProjectSlug:
        previous,

      nextProjectSlug:
        next,
    },

    allowedContinuitySlugs,
  };
}

/* ── Public deterministic builder ──────────────────── */

export function buildTrustedPortfolioContext(
  request:
    BuildTrustedPortfolioContextRequest,
): TrustedPortfolioContext {
  const taxonomy =
    validateTaxonomy(
      request.taxonomy,
    );

  const projectHint =
    validateProject(
      request.selection
        .project,
    );

  const projectSlug =
    projectHint.slug;

  if (!projectSlug) {
    throw new Error(
      "Trusted portfolio project slug unexpectedly missing after validation.",
    );
  }

  const companySlug =
    cleanOptional(
      request.selection
        .companySlug,
    );

  if (
    companySlug
  ) {
    assertSlug(
      companySlug,
      "Trusted portfolio companySlug",
    );

    if (
      !taxonomy.companies.has(
        companySlug,
      )
    ) {
      throw new Error(
        `Trusted portfolio companySlug is not allowlisted: ${companySlug}`,
      );
    }
  }

  const brandSlug =
    cleanOptional(
      request.selection
        .brandSlug,
    );

  if (
    brandSlug
  ) {
    assertSlug(
      brandSlug,
      "Trusted portfolio brandSlug",
    );

    if (
      !taxonomy.brands.has(
        brandSlug,
      )
    ) {
      throw new Error(
        `Trusted portfolio brandSlug is not allowlisted: ${brandSlug}`,
      );
    }

    if (
      !companySlug
    ) {
      throw new Error(
        "Trusted portfolio Brand requires an explicit Company relationship.",
      );
    }

    const brand =
      request.taxonomy
        .brands.find(
          (item) =>
            item.slug ===
            brandSlug,
        );

    if (
      !brand ||
      brand.companySlug !==
        companySlug
    ) {
      throw new Error(
        `Trusted portfolio Brand → Company mismatch: ${brandSlug} does not belong to ${companySlug}.`,
      );
    }
  }

  if (
    request.selection
      .businessCategorySlugs
      .length ===
    0
  ) {
    throw new Error(
      "Trusted portfolio requires at least one business category.",
    );
  }

  assertSelected(
    request.selection
      .businessCategorySlugs,
    taxonomy.businessCategories,
    "Trusted portfolio businessCategorySlugs",
  );

  if (
    request.selection
      .serviceSlugs
      .length ===
    0
  ) {
    throw new Error(
      "Trusted portfolio requires at least one Service.",
    );
  }

  assertSelected(
    request.selection
      .serviceSlugs,
    taxonomy.services,
    "Trusted portfolio serviceSlugs",
  );

  const solutions =
    validateSolutions(
      request.selection
        .solutions,
      taxonomy.solutions,
      request.claims,
    );

  const {
    continuity,
    allowedContinuitySlugs,
  } =
    validateContinuity(
      projectSlug,
      request.selection
        .previousProjectSlug,
      request.selection
        .nextProjectSlug,
    );

  return {
    projectHint,

    relationships: {
      companySlug,

      brandSlug,

      businessCategorySlugs:
        [
          ...request.selection
            .businessCategorySlugs,
        ],

      serviceSlugs:
        [
          ...request.selection
            .serviceSlugs,
        ],

      solutionSlugs:
        solutions.map(
          (solution) =>
            solution.slug,
        ),
    },

    solutions,

    continuity,

    allowedContinuitySlugs,
  };
}
