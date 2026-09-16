/**
 * GOLD STANDARD CASE STUDY AGENT — TRUSTED MEDIA CONTEXT
 *
 * Deterministic operator-controlled media registry.
 *
 * Responsibilities:
 * - validate stable asset IDs;
 * - validate semantic media roles;
 * - validate trusted public/CMS locators;
 * - preserve accessibility/caption/credit metadata;
 * - preserve internal provenance;
 * - validate optional associations to publication-ready evidence;
 * - expose safe projections for Designer and Compiler.
 *
 * IMPORTANT:
 * - No AI.
 * - No Payload.
 * - No database.
 * - No CMS write.
 * - No publishing.
 *
 * Media may illustrate or accompany evidence.
 * Media NEVER creates evidence and NEVER makes an
 * unsupported claim publishable.
 */

import {
  MEDIA_ROLES,
} from "./architectureSchema";

import type {
  MediaRole,
} from "./architect";

import type {
  DesignerMediaAsset,
} from "./designer";

import type {
  CompilerMediaAsset,
} from "./compiler";

import type {
  EvidenceClaim,
} from "./types";

/* ── Provenance ────────────────────────────────────── */

export const MEDIA_PROVENANCE_KINDS = [
  "repository-asset",
  "payload-media",
  "client-provided",
  "user-provided",
  "campaign-archive",
  "other",
] as const;

export type MediaProvenanceKind =
  typeof MEDIA_PROVENANCE_KINDS[number];

export type TrustedMediaProvenance = {
  kind:
    MediaProvenanceKind;

  /**
   * Internal provenance note/reference.
   *
   * This is not exposed to the Designer or CMS compiler.
   * Examples:
   * - archive filename
   * - client delivery note
   * - campaign folder reference
   */
  reference?:
    string;
};

/* ── Operator input ────────────────────────────────── */

export type TrustedMediaAssetInput = {
  /**
   * Stable internal ID exposed to the Designer.
   */
  id:
    string;

  title:
    string;

  /**
   * Optional semantic role.
   *
   * Must match the Architect's canonical media-role vocabulary.
   */
  role?:
    MediaRole;

  /**
   * Semantic description only.
   *
   * This may guide placement but is NOT factual evidence.
   */
  description?:
    string;

  /**
   * Exactly one trusted locator is required.
   */
  legacySrc?:
    string;

  mediaId?:
    number;

  alt?:
    string;

  caption?:
    string;

  credit?:
    string;

  provenance:
    TrustedMediaProvenance;

  /**
   * Optional publication-ready claims this asset is relevant to.
   *
   * Association does NOT mean the asset proves the claim.
   */
  relatedClaimIds?:
    string[];
};

export type BuildTrustedMediaContextRequest = {
  assets:
    TrustedMediaAssetInput[];

  /**
   * Reconciled evidence ledger.
   *
   * Used only to validate optional relatedClaimIds.
   * Media cannot change claim confidence or publishability.
   */
  claims:
    EvidenceClaim[];
};

/* ── Validated output ──────────────────────────────── */

export type TrustedMediaAsset = {
  id:
    string;

  title:
    string;

  role?:
    MediaRole;

  description?:
    string;

  legacySrc?:
    string;

  mediaId?:
    number;

  alt?:
    string;

  caption?:
    string;

  credit?:
    string;

  provenance:
    TrustedMediaProvenance;

  relatedClaimIds:
    string[];
};

export type TrustedMediaContext = {
  /**
   * Complete internal trusted registry.
   *
   * Includes provenance and evidence associations.
   */
  assets:
    TrustedMediaAsset[];

  /**
   * Safe semantic projection exposed to AI Designer.
   *
   * No paths.
   * No CMS IDs.
   * No provenance.
   */
  designerAssets:
    DesignerMediaAsset[];

  /**
   * Deterministic locator projection supplied only
   * to the Compiler.
   */
  compilerAssets:
    CompilerMediaAsset[];
};

/* ── Helpers ───────────────────────────────────────── */

const SAFE_ID =
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

function assertSafeId(
  value: unknown,
  context: string,
): asserts value is string {
  if (
    !nonEmpty(
      value,
    ) ||
    !SAFE_ID.test(
      value.trim(),
    )
  ) {
    throw new Error(
      `${context} must be a safe lower-kebab-case ID.`,
    );
  }
}

function validateLegacySrc(
  value:
    string,
  assetId:
    string,
): string {
  const cleaned =
    value.trim();

  if (
    !cleaned.startsWith(
      "/assets/",
    )
  ) {
    throw new Error(
      `Trusted media asset "${assetId}" legacySrc must begin with /assets/.`,
    );
  }

  if (
    cleaned.includes(
      "..",
    ) ||
    cleaned.includes(
      "\\",
    ) ||
    cleaned.includes(
      "://",
    )
  ) {
    throw new Error(
      `Trusted media asset "${assetId}" contains unsafe legacySrc.`,
    );
  }

  return cleaned;
}

function validateProvenance(
  provenance:
    TrustedMediaProvenance,
  assetId:
    string,
): TrustedMediaProvenance {
  if (
    !provenance ||
    !(
      MEDIA_PROVENANCE_KINDS as readonly string[]
    ).includes(
      provenance.kind,
    )
  ) {
    throw new Error(
      `Trusted media asset "${assetId}" requires valid provenance.kind.`,
    );
  }

  return {
    kind:
      provenance.kind,

    reference:
      cleanOptional(
        provenance.reference,
      ),
  };
}

function validateRelatedClaims(
  claimIds:
    string[],
  claimMap:
    Map<string, EvidenceClaim>,
  assetId:
    string,
): string[] {
  const seen =
    new Set<string>();

  const output:
    string[] =
    [];

  for (
    const claimId
    of claimIds
  ) {
    assertSafeId(
      claimId,
      `Trusted media asset ${assetId}.relatedClaimIds`,
    );

    if (
      seen.has(
        claimId,
      )
    ) {
      throw new Error(
        `Trusted media asset "${assetId}" contains duplicate related claim ID: ${claimId}`,
      );
    }

    seen.add(
      claimId,
    );

    const claim =
      claimMap.get(
        claimId,
      );

    if (!claim) {
      throw new Error(
        `Trusted media asset "${assetId}" references unknown evidence claim: ${claimId}`,
      );
    }

    if (
      !claim.publishable ||
      claim.confidence ===
        "low"
    ) {
      throw new Error(
        `Trusted media asset "${assetId}" may reference only publication-ready evidence claim: ${claimId}`,
      );
    }

    output.push(
      claimId,
    );
  }

  return output;
}

/* ── Public deterministic builder ──────────────────── */

export function buildTrustedMediaContext(
  request:
    BuildTrustedMediaContextRequest,
): TrustedMediaContext {
  if (
    !Array.isArray(
      request.assets,
    )
  ) {
    throw new Error(
      "Trusted media assets must be an array.",
    );
  }

  if (
    !Array.isArray(
      request.claims,
    )
  ) {
    throw new Error(
      "Trusted media claims must be an array.",
    );
  }

  const claimMap =
    new Map<string, EvidenceClaim>();

  for (
    const claim
    of request.claims
  ) {
    if (
      claimMap.has(
        claim.id,
      )
    ) {
      throw new Error(
        `Trusted media context received duplicate evidence claim ID: ${claim.id}`,
      );
    }

    claimMap.set(
      claim.id,
      claim,
    );
  }

  const assetIds =
    new Set<string>();

  const assets:
    TrustedMediaAsset[] =
    [];

  for (
    const raw
    of request.assets
  ) {
    assertSafeId(
      raw.id,
      "Trusted media asset.id",
    );

    const id =
      raw.id.trim();

    if (
      assetIds.has(
        id,
      )
    ) {
      throw new Error(
        `Trusted media context contains duplicate asset ID: ${id}`,
      );
    }

    assetIds.add(
      id,
    );

    if (
      !nonEmpty(
        raw.title,
      )
    ) {
      throw new Error(
        `Trusted media asset "${id}" requires title.`,
      );
    }

    if (
      raw.role !==
        undefined &&
      !(
        MEDIA_ROLES as readonly string[]
      ).includes(
        raw.role,
      )
    ) {
      throw new Error(
        `Trusted media asset "${id}" has invalid media role: ${String(raw.role)}`,
      );
    }

    const hasLegacySrc =
      nonEmpty(
        raw.legacySrc,
      );

    const hasMediaId =
      raw.mediaId !==
        undefined;

    if (
      hasLegacySrc ===
      hasMediaId
    ) {
      throw new Error(
        `Trusted media asset "${id}" must provide exactly one of legacySrc or mediaId.`,
      );
    }

    let legacySrc:
      string | undefined;

    let mediaId:
      number | undefined;

    if (
      hasLegacySrc
    ) {
      legacySrc =
        validateLegacySrc(
          raw.legacySrc as string,
          id,
        );
    }

    if (
      hasMediaId
    ) {
      if (
        !Number.isInteger(
          raw.mediaId,
        ) ||
        (
          raw.mediaId as number
        ) <=
          0
      ) {
        throw new Error(
          `Trusted media asset "${id}" mediaId must be a positive integer.`,
        );
      }

      mediaId =
        raw.mediaId;
    }

    const provenance =
      validateProvenance(
        raw.provenance,
        id,
      );

    const relatedClaimIds =
      validateRelatedClaims(
        raw.relatedClaimIds ??
          [],
        claimMap,
        id,
      );

    assets.push({
      id,

      title:
        raw.title.trim(),

      role:
        raw.role,

      description:
        cleanOptional(
          raw.description,
        ),

      legacySrc,

      mediaId,

      alt:
        cleanOptional(
          raw.alt,
        ),

      caption:
        cleanOptional(
          raw.caption,
        ),

      credit:
        cleanOptional(
          raw.credit,
        ),

      provenance,

      relatedClaimIds,
    });
  }

  const designerAssets:
    DesignerMediaAsset[] =
    assets.map(
      (asset) => ({
        id:
          asset.id,

        title:
          asset.title,

        role:
          asset.role,

        description:
          asset.description,
      }),
    );

  const compilerAssets:
    CompilerMediaAsset[] =
    assets.map(
      (asset) => ({
        id:
          asset.id,

        legacySrc:
          asset.legacySrc,

        mediaId:
          asset.mediaId,

        alt:
          asset.alt,

        caption:
          asset.caption,

        credit:
          asset.credit,
      }),
    );

  return {
    assets,

    designerAssets,

    compilerAssets,
  };
}
