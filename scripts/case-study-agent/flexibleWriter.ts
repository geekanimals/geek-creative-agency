/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE PAYLOAD DRAFT WRITER
 *
 * FINAL CMS MUTATION BOUNDARY FOR THE FLEXIBLE AGENT.
 *
 * SAFETY:
 * - Drafts only.
 * - No publish path exists.
 * - Requires explicit human approval.
 * - Requires explicit write opt-in.
 * - Staging target only.
 * - PAYLOAD_DB_PUSH=true is refused.
 * - Flexible Quality Gate is recomputed immediately before write.
 * - Reconciliation Auditor and Semantic Critic are rechecked.
 * - Existing Flagship projects are protected.
 * - Relationships resolve deterministically by trusted slug.
 * - Evidence / provenance / Agent metadata never enter Payload.
 *
 * Importing this module performs no action.
 */

import type {
  getPayload,
} from "payload";

import {
  buildFlexibleCmsDraftPayload,
} from "./flexibleCmsPayload";

import {
  verifyFlexibleCmsDraftReadback,
} from "./flexibleCmsVerification";

import {
  runFlexibleQualityGate,
} from "./flexibleQualityGate";

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

/* ── Payload boundary ──────────────────────────────── */

type PayloadClient =
  Awaited<
    ReturnType<
      typeof getPayload
    >
  >;

type ResolvedDoc = {
  id:
    number | string;

  slug?:
    string | null;

  renderMode?:
    string | null;

  flagshipRendererKey?:
    string | null;

  company?:
    | number
    | string
    | {
        id?:
          number | string;
      }
    | null;
};

/* ── Explicit operator authorization ───────────────── */

export type FlexibleDraftWriteAuthorization = {
  /**
   * Must be explicitly true after human review.
   */
  humanApproved:
    boolean;

  /**
   * Separate operational opt-in.
   *
   * Prevents an approval flag alone from causing a write.
   */
  allowCmsDraftWrite:
    boolean;

  /**
   * Flexible Agent writes are staging-only at this stage.
   */
  target:
    "staging";
};

export type FlexibleDraftWriteResult = {
  action:
    "created" | "updated";

  id:
    number | string;

  slug:
    string;

  status:
    "draft";

  qualityScore:
    number;

  semanticCriticScore:
    number;

  reconciliationAuditScore:
    number;
};

/* ── Protected developer-built Flagships ───────────── */

const PROTECTED_FLAGSHIP_SLUGS =
  new Set([
    "high-ultra-lounge",
    "the-coolest-job",
  ]);

/* ── Payload helpers ───────────────────────────────── */

async function findBySlug(
  payload:
    PayloadClient,
  collection:
    string,
  slug:
    string,
): Promise<
  ResolvedDoc | undefined
> {
  const result =
    await payload.find({
      collection:
        collection as never,

      where: {
        slug: {
          equals:
            slug,
        },
      },

      limit:
        1,

      depth:
        0,

      draft:
        true,

      overrideAccess:
        true,
    });

  return (
    result.docs[0] as
      | ResolvedDoc
      | undefined
  );
}

async function requireBySlug(
  payload:
    PayloadClient,
  collection:
    string,
  slug:
    string,
): Promise<ResolvedDoc> {
  const doc =
    await findBySlug(
      payload,
      collection,
      slug,
    );

  if (!doc) {
    throw new Error(
      `Flexible Case Study Agent cannot resolve ${collection}/${slug}. ` +
        "Create or correct the trusted relationship entity before writing the Project draft.",
    );
  }

  return doc;
}

async function resolveMany(
  payload:
    PayloadClient,
  collection:
    string,
  slugs:
    string[],
): Promise<
  Array<
    number | string
  >
> {
  return Promise.all(
    slugs.map(
      async (
        slug,
      ) => {
        const doc =
          await requireBySlug(
            payload,
            collection,
            slug,
          );

        return doc.id;
      },
    ),
  );
}

function relationshipId(
  value:
    | number
    | string
    | {
        id?:
          number | string;
      }
    | null
    | undefined,
):
  | number
  | string
  | undefined {
  if (
    value ==
    null
  ) {
    return undefined;
  }

  if (
    typeof value ===
    "object"
  ) {
    return value.id;
  }

  return value;
}

async function resolveRelationships(
  payload:
    PayloadClient,
  candidate:
    GoldStandardCaseStudyCandidate,
) {
  const prepared =
    buildFlexibleCmsDraftPayload(
      candidate,
    );

  const slugs =
    prepared.relationships;

  const company =
    slugs.companySlug
      ? await requireBySlug(
          payload,
          "companies",
          slugs.companySlug,
        )
      : undefined;

  const brand =
    slugs.brandSlug
      ? await requireBySlug(
          payload,
          "brands",
          slugs.brandSlug,
        )
      : undefined;

  /**
   * Company / Brand relationship must remain consistent.
   */
  if (
    company &&
    brand
  ) {
    const brandCompanyId =
      relationshipId(
        brand.company,
      );

    if (
      brandCompanyId !=
        null &&
      String(
        brandCompanyId,
      ) !==
        String(
          company.id,
        )
    ) {
      throw new Error(
        `Flexible Case Study Agent relationship mismatch: brand/${slugs.brandSlug} ` +
          `does not belong to company/${slugs.companySlug}.`,
      );
    }
  }

  const businessCategories =
    await resolveMany(
      payload,
      "business-categories",
      slugs.businessCategorySlugs,
    );

  const services =
    await resolveMany(
      payload,
      "services",
      slugs.serviceSlugs,
    );

  const solutions =
    await resolveMany(
      payload,
      "solutions",
      slugs.solutionSlugs,
    );

  return {
    company:
      company?.id,

    brand:
      brand?.id,

    businessCategories,

    services,

    solutions,
  };
}

async function verifyStoredDraft(
  payload:
    PayloadClient,
  id:
    number | string,
  expected:
    Record<string, unknown>,
): Promise<void> {
  const stored =
    await payload.findByID({
      collection:
        "projects" as never,

      id:
        id as never,

      depth:
        0,

      draft:
        true,

      overrideAccess:
        true,
    });

  const verification =
    verifyFlexibleCmsDraftReadback(
      expected,
      stored,
    );

  if (!verification.verified) {
    const details =
      verification
        .issues
        .map(
          (issue) =>
            `${issue.code}:${issue.path}`,
        )
        .join(", ");

    throw new Error(
      "Flexible Case Study Agent CMS read-back verification failed after draft write" +
        (
          details
            ? `: ${details}`
            : "."
        ),
    );
  }
}
/* ── Write-time safety gates ───────────────────────── */

export function assertFlexibleDraftWriteAuthorization(
  authorization:
    FlexibleDraftWriteAuthorization,
): void {
  if (
    authorization.target !==
    "staging"
  ) {
    throw new Error(
      "Flexible Case Study Agent refuses CMS writes outside the staging target.",
    );
  }

  if (
    authorization
      .humanApproved !==
    true
  ) {
    throw new Error(
      "Flexible Case Study Agent requires explicit human approval before CMS draft write.",
    );
  }

  if (
    authorization
      .allowCmsDraftWrite !==
    true
  ) {
    throw new Error(
      "Flexible Case Study Agent requires explicit CMS draft-write opt-in.",
    );
  }

  if (
    process.env
      .PAYLOAD_DB_PUSH ===
    "true"
  ) {
    throw new Error(
      "Flexible Case Study Agent refuses to write with PAYLOAD_DB_PUSH=true. Use a migration-managed staging database.",
    );
  }

  /**
   * "target: staging" must describe the REAL database,
   * not merely a caller-supplied label.
   *
   * The operator must configure a non-secret identifying
   * fragment for the approved staging database, for example
   * its project ref or hostname fragment.
   */
  const databaseUrl =
    process.env
      .DATABASE_URL;

  const stagingMarker =
    process.env
      .CASE_STUDY_AGENT_STAGING_DB_MARKER;

  if (
    !databaseUrl ||
    !stagingMarker
  ) {
    throw new Error(
      "Flexible Case Study Agent requires DATABASE_URL and CASE_STUDY_AGENT_STAGING_DB_MARKER before any staging CMS write.",
    );
  }

  const normalizedStagingMarker =
    stagingMarker
      .trim()
      .toLowerCase();

  const genericDatabaseMarkers =
    new Set([
      "postgres",
      "postgresql",
      "database",
      "production",
      "localhost",
      "supabase",
      "neon",
      "vercel",
    ]);

  if (
    normalizedStagingMarker.length < 8 ||
    genericDatabaseMarkers.has(
      normalizedStagingMarker,
    ) ||
    !/^[a-z0-9._-]+$/.test(
      normalizedStagingMarker,
    )
  ) {
    throw new Error(
      "Flexible Case Study Agent refuses CMS write: CASE_STUDY_AGENT_STAGING_DB_MARKER must be a specific database identity of at least 8 characters using only letters, numbers, dots, underscores, or hyphens.",
    );
  }

  let parsedDatabaseUrl:
    URL;

  try {
    parsedDatabaseUrl =
      new URL(
        databaseUrl,
      );
  } catch {
    throw new Error(
      "Flexible Case Study Agent refuses CMS write: DATABASE_URL is not a valid database URL.",
    );
  }

  if (
    parsedDatabaseUrl.protocol !==
      "postgres:" &&
    parsedDatabaseUrl.protocol !==
      "postgresql:"
  ) {
    throw new Error(
      "Flexible Case Study Agent refuses CMS write: DATABASE_URL must use the postgres or postgresql protocol.",
    );
  }

  /**
   * Only non-secret connection identity is considered:
   * hostname + username.
   *
   * Password, database path, query parameters and fragments
   * can never satisfy the staging identity guard.
   */
  const databaseIdentity =
    [
      parsedDatabaseUrl
        .hostname,
      parsedDatabaseUrl
        .username,
    ]
      .join("|")
      .toLowerCase();

  if (
    !databaseIdentity.includes(
      normalizedStagingMarker,
    )
  ) {
    throw new Error(
      "Flexible Case Study Agent refuses CMS write: DATABASE_URL does not match the approved staging database marker.",
    );
  }

  if (
    process.env
      .VERCEL_ENV ===
    "production"
  ) {
    throw new Error(
      "Flexible Case Study Agent refuses CMS draft writes from the Vercel production environment.",
    );
  }
}

function recomputeQuality(
  candidate:
    GoldStandardCaseStudyCandidate,
) {
  const quality =
    runFlexibleQualityGate({
      claims:
        candidate
          .evidence
          .claims,

      architecture:
        candidate
          .architecture,

      design:
        candidate
          .design,

      compiled:
        candidate
          .compiled,
    });

  if (
    !quality.draftReady
  ) {
    const blocking =
      quality.issues
        .filter(
          (
            issue,
          ) =>
            issue.severity ===
            "error",
        )
        .map(
          (
            issue,
          ) =>
            `${issue.code}: ${issue.message}`,
        )
        .join("; ");

    throw new Error(
      `Flexible Case Study Agent quality gate refused CMS write. ${blocking}`,
    );
  }

  return quality;
}

function assertIndependentAudits(
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
      "Flexible Case Study Agent refused CMS write: Reconciliation Auditor is not safe to continue.",
    );
  }

  if (
    candidate
      .evidence
      .reconciliationAuditResult
      .findings
      .some(
        (
          finding,
        ) =>
          finding.severity ===
          "error",
      )
  ) {
    throw new Error(
      "Flexible Case Study Agent refused CMS write: Reconciliation Auditor contains an error finding.",
    );
  }

  if (
    candidate
      .semanticCritic
      .draftReady !==
    true
  ) {
    throw new Error(
      "Flexible Case Study Agent refused CMS write: Semantic Critic is not draft-ready.",
    );
  }

  if (
    candidate
      .semanticCritic
      .findings
      .some(
        (
          finding,
        ) =>
          finding.severity ===
          "error",
      )
  ) {
    throw new Error(
      "Flexible Case Study Agent refused CMS write: Semantic Critic contains an error finding.",
    );
  }
}

function assertProjectNotProtected(
  slug:
    string,
  existing:
    ResolvedDoc | undefined,
): void {
  if (
    PROTECTED_FLAGSHIP_SLUGS.has(
      slug,
    )
  ) {
    throw new Error(
      `Flexible Case Study Agent refuses to overwrite protected Flagship project "${slug}".`,
    );
  }

  if (
    existing &&
    (
      existing.renderMode ===
        "flagship" ||
      Boolean(
        existing
          .flagshipRendererKey,
      )
    )
  ) {
    throw new Error(
      `Flexible Case Study Agent refuses to overwrite existing Flagship project "${slug}".`,
    );
  }
}

/* ── Public draft writer ───────────────────────────── */

export async function writeFlexibleCaseStudyDraft(
  payload:
    PayloadClient,

  candidate:
    GoldStandardCaseStudyCandidate,

  authorization:
    FlexibleDraftWriteAuthorization,
): Promise<
  FlexibleDraftWriteResult
> {
  /**
   * Authorization is checked before any Payload read/write.
   */
  assertFlexibleDraftWriteAuthorization(
    authorization,
  );

  /**
   * Re-run deterministic quality at the mutation boundary.
   *
   * candidate.quality is deliberately NOT trusted.
   */
  const quality =
    recomputeQuality(
      candidate,
    );

  /**
   * Use the freshly recomputed deterministic quality result
   * for every downstream write-boundary check.
   *
   * Do not mutate the original candidate and do not trust
   * stale candidate.quality metadata.
   */
  const writeCandidate:
    GoldStandardCaseStudyCandidate =
    {
      ...candidate,
      quality,
    };

  /**
   * Independent audit results are also rechecked.
   */
  assertIndependentAudits(
    writeCandidate,
  );

  /**
   * Pure sanitizer independently rechecks:
   * - render modes;
   * - reconciliation safety;
   * - semantic critic readiness;
   * - compiled section existence;
   * - internal metadata leakage;
   * - trusted title / slug.
   */
  const prepared =
    buildFlexibleCmsDraftPayload(
      writeCandidate,
    );

  const existing =
    await findBySlug(
      payload,
      "projects",
      prepared.data.slug,
    );

  assertProjectNotProtected(
    prepared.data.slug,
    existing,
  );

  /**
   * Resolve all trusted relationship slugs before mutation.
   *
   * Missing or inconsistent relationships fail closed.
   */
  const relationships =
    await resolveRelationships(
      payload,
      writeCandidate,
    );

  /**
   * Only publication-safe fields plus resolved relationship
   * IDs cross the final Payload boundary.
   */
  const cmsData = {
    ...prepared.data,
    ...relationships,
  };

  if (
    existing
  ) {
    const updated =
      await payload.update({
        collection:
          "projects" as never,

        id:
          existing.id as never,

        data:
          {
            ...cmsData,

            /**
             * Explicitly preserve draft state.
             */
            _status:
              "draft",
          } as never,

        /**
         * Payload versions/drafts:
         * update draft only — never publish.
         */
        draft:
          true,

        overrideAccess:
          true,
      });

    const updatedId =
      (
        updated as {
          id:
            number | string;
        }
      ).id;

    await verifyStoredDraft(
      payload,
      updatedId,
      {
        ...cmsData,
        _status:
          "draft",
      },
    );

    return {
      action:
        "updated",

      id:
        updatedId,

      slug:
        prepared.data.slug,

      status:
        "draft",

      qualityScore:
        quality.score,

      semanticCriticScore:
        candidate
          .semanticCritic
          .score,

      reconciliationAuditScore:
        candidate
          .evidence
          .reconciliationAuditResult
          .score,
    };
  }

  const created =
    await payload.create({
      collection:
        "projects" as never,

      data:
        {
          ...cmsData,

          /**
           * Every Agent-created project starts as Draft.
           */
          _status:
            "draft",
        } as never,

      overrideAccess:
        true,
    });

  const createdId =
    (
      created as {
        id:
          number | string;
      }
    ).id;

  await verifyStoredDraft(
    payload,
    createdId,
    {
      ...cmsData,
      _status:
        "draft",
    },
  );

  return {
    action:
      "created",

    id:
      createdId,

    slug:
      prepared.data.slug,

    status:
      "draft",

    qualityScore:
      quality.score,

    semanticCriticScore:
      candidate
        .semanticCritic
        .score,

    reconciliationAuditScore:
      candidate
        .evidence
        .reconciliationAuditResult
        .score,
  };
}
