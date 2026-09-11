/**
 * GOLD STANDARD CASE STUDY AGENT — PAYLOAD DRAFT WRITER
 *
 * IMPORTANT:
 * - No auto-publish path exists here.
 * - Quality is recomputed immediately before every write.
 * - Agent-supplied `pkg.quality` is NEVER trusted.
 * - Evidence / provenance never enter Payload.
 * - Relationships resolve deterministically by slug.
 * - Missing / inconsistent relationships fail closed.
 * - Existing projects are updated as DRAFTS only.
 *
 * This module has no CLI entry point and does nothing merely by importing it.
 */

import type { getPayload } from "payload";

import { sanitizeProjectForCms, relationshipSlugs } from "./cmsPayload";
import { runQualityGate } from "./qualityGate";
import type { CaseStudyAgentPackage } from "./types";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

type ResolvedDoc = {
  id: number | string;
  slug?: string | null;
  company?: number | string | { id?: number | string } | null;
};

export type DraftWriteResult = {
  action: "created" | "updated";
  id: number | string;
  slug: string;
  status: "draft";
  qualityScore: number;
};

async function findBySlug(
  payload: PayloadClient,
  collection: string,
  slug: string,
): Promise<ResolvedDoc | undefined> {
  const result = await payload.find({
    collection: collection as never,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });

  return result.docs[0] as ResolvedDoc | undefined;
}

async function requireBySlug(
  payload: PayloadClient,
  collection: string,
  slug: string,
): Promise<ResolvedDoc> {
  const doc = await findBySlug(payload, collection, slug);

  if (!doc) {
    throw new Error(
      `Case Study Agent cannot resolve ${collection}/${slug}. ` +
        "Create or correct the relationship entity before writing the Project draft.",
    );
  }

  return doc;
}

async function resolveMany(
  payload: PayloadClient,
  collection: string,
  slugs: string[],
): Promise<Array<number | string>> {
  return Promise.all(
    slugs.map(async (slug) => {
      const doc = await requireBySlug(payload, collection, slug);
      return doc.id;
    }),
  );
}

function relationshipId(
  value: number | string | { id?: number | string } | null | undefined,
): number | string | undefined {
  if (value == null) return undefined;

  if (typeof value === "object") {
    return value.id;
  }

  return value;
}

async function resolveRelationships(
  payload: PayloadClient,
  pkg: CaseStudyAgentPackage,
) {
  const slugs = relationshipSlugs(pkg);

  const company = slugs.companySlug
    ? await requireBySlug(payload, "companies", slugs.companySlug)
    : undefined;

  const brand = slugs.brandSlug
    ? await requireBySlug(payload, "brands", slugs.brandSlug)
    : undefined;

  /**
   * Fail early on Company / Brand inconsistency rather than relying solely
   * on the Projects collection hook.
   */
  if (company && brand) {
    const brandCompanyId = relationshipId(brand.company);

    if (
      brandCompanyId != null &&
      String(brandCompanyId) !== String(company.id)
    ) {
      throw new Error(
        `Case Study Agent relationship mismatch: brand/${slugs.brandSlug} ` +
          `does not belong to company/${slugs.companySlug}.`,
      );
    }
  }

  const businessCategories = await resolveMany(
    payload,
    "business-categories",
    slugs.businessCategorySlugs,
  );

  const services = await resolveMany(
    payload,
    "services",
    slugs.serviceSlugs,
  );

  const solutions = await resolveMany(
    payload,
    "solutions",
    slugs.solutionSlugs,
  );

  return {
    company: company?.id,
    brand: brand?.id,
    businessCategories,
    services,
    solutions,
  };
}

export async function writeCaseStudyDraft(
  payload: PayloadClient,
  pkg: CaseStudyAgentPackage,
): Promise<DraftWriteResult> {
  if (process.env.PAYLOAD_DB_PUSH === "true") {
    throw new Error(
      "Case Study Agent refuses to write with PAYLOAD_DB_PUSH=true. " +
        "Use a migration-managed database.",
    );
  }

  /**
   * Recompute quality now.
   * Never trust pkg.quality because an upstream agent/process could provide
   * stale or manipulated quality metadata.
   */
  const quality = runQualityGate(pkg);

  if (!quality.draftReady) {
    const blocking = quality.issues
      .filter((issue) => issue.severity === "error")
      .map((issue) => `${issue.code}: ${issue.message}`)
      .join("; ");

    throw new Error(
      `Case Study Agent quality gate refused CMS write. ${blocking}`,
    );
  }

  const data = sanitizeProjectForCms(pkg);
  const relationships = await resolveRelationships(payload, pkg);

  /**
   * Final CMS data contains only publication-safe fields plus resolved IDs.
   * Evidence, claims, confidence, provenance and agent metadata are absent.
   */
  const cmsData = {
    ...data,
    ...relationships,
  };

  const existing = await findBySlug(payload, "projects", data.slug);

  if (existing) {
    const updated = await payload.update({
      collection: "projects" as never,
      id: existing.id as never,
      data: cmsData as never,

      /**
       * Critical safety property:
       * update creates/updates the draft version; it does not publish.
       */
      draft: true,
      overrideAccess: true,
    });

    return {
      action: "updated",
      id: (updated as { id: number | string }).id,
      slug: data.slug,
      status: "draft",
      qualityScore: quality.score,
    };
  }

  const created = await payload.create({
    collection: "projects" as never,
    data: {
      ...cmsData,

      /**
       * Critical safety property:
       * newly generated case studies always begin as Drafts.
       */
      _status: "draft",
    } as never,
    overrideAccess: true,
  });

  return {
    action: "created",
    id: (created as { id: number | string }).id,
    slug: data.slug,
    status: "draft",
    qualityScore: quality.score,
  };
}
