/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE CMS COMPILER
 *
 * Deterministically compiles validated Designer output into
 * Payload-compatible Flexible sections.
 *
 * SECURITY / TRUST BOUNDARY:
 *
 * AI Designer may produce:
 * - semantic copy
 * - trusted asset IDs
 * - trusted project slugs
 * - evidence bindings
 *
 * Compiler alone produces:
 * - Lexical JSON
 * - legacySrc / CMS media relationships
 * - /work/<slug> CTA hrefs
 *
 * Evidence metadata never enters CMS sections.
 *
 * NO OpenAI.
 * NO Payload connection.
 * NO database.
 * NO publishing.
 */

import type {
  Project as CmsProject,
} from "../../payload-types";

import type {
  DesignedSection,
  FlexibleCaseStudyDesign,
} from "./designer";

/* ── CMS section type ───────────────────────────────── */

export type CmsFlexibleSection =
  NonNullable<
    CmsProject["sections"]
  >[number];

/* ── Trusted media registry ─────────────────────────── */

export type CompilerMediaAsset = {
  /**
   * Stable internal ID used by the Designer.
   */
  id: string;

  /**
   * Trusted existing public asset.
   *
   * Example:
   * /assets/work/lays/heartwork/heartwork-hero.jpg
   */
  legacySrc?: string;

  /**
   * Trusted Payload media relationship ID.
   *
   * Exactly one of legacySrc OR mediaId must be supplied.
   */
  mediaId?: number;

  alt?: string;

  caption?: string;

  credit?: string;
};

export type CompilerRequest = {
  design:
    FlexibleCaseStudyDesign;

  mediaAssets?:
    CompilerMediaAsset[];

  /**
   * Explicit navigation allowlist.
   *
   * CTA hrefs are derived from these slugs.
   */
  allowedContinuitySlugs?:
    string[];
};

export type SectionEvidenceBinding = {
  sectionId: string;

  chapterId?: string;

  blockType:
    DesignedSection["blockType"];

  evidenceClaimIds:
    string[];
};

export type CompiledFlexibleCaseStudy = {
  renderMode: "flexible";

  cmsSections:
    CmsFlexibleSection[];

  /**
   * Internal-only evidence map.
   *
   * This is deliberately separate from cmsSections.
   */
  bindings:
    SectionEvidenceBinding[];
};

/* ── Generic helpers ────────────────────────────────── */

function nonEmpty(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    Boolean(value.trim())
  );
}

function cleanOptional(
  value:
    | string
    | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed =
    value.trim();

  return trimmed
    ? trimmed
    : undefined;
}

function assertSlug(
  slug: string,
  label: string,
) {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/
      .test(slug)
  ) {
    throw new Error(
      `${label} is not a safe project slug: ${slug}`,
    );
  }
}

function assertLegacySrc(
  src: string,
  assetId: string,
) {
  if (
    !src.startsWith(
      "/assets/",
    )
  ) {
    throw new Error(
      `Compiler media asset ${assetId} legacySrc must start with /assets/.`,
    );
  }

  if (
    src.includes("..") ||
    src.includes("\\") ||
    src.includes("://")
  ) {
    throw new Error(
      `Compiler media asset ${assetId} has unsafe legacySrc.`,
    );
  }
}

/* ── Deterministic Lexical builder ─────────────────── */

/**
 * Mirrors the minimal valid SerializedEditorState shape
 * already used by scripts/seed-projects.ts.
 *
 * Blank-line-separated paragraphs become separate
 * Lexical paragraph nodes.
 */
function textNode(
  text: string,
) {
  return {
    type:
      "text",

    version:
      1,

    text,

    format:
      0,

    style:
      "",

    mode:
      "normal" as const,

    detail:
      0,
  };
}

function paragraphNode(
  text: string,
) {
  return {
    type:
      "paragraph",

    version:
      1,

    format:
      "" as const,

    indent:
      0,

    direction:
      "ltr" as const,

    children: [
      textNode(text),
    ],
  };
}

type RichTextSection =
  Extract<
    CmsFlexibleSection,
    {
      blockType:
        "richText";
    }
  >;

type LexicalValue =
  RichTextSection["content"];

export function plainTextToLexical(
  text: string,
): LexicalValue {
  if (!nonEmpty(text)) {
    throw new Error(
      "Cannot compile empty text into Lexical content.",
    );
  }

  const paragraphs =
    text
      .trim()
      .split(
        /\r?\n\s*\r?\n/,
      )
      .map(
        (paragraph) =>
          paragraph.trim(),
      )
      .filter(Boolean);

  return {
    root: {
      type:
        "root",

      format:
        "",

      indent:
        0,

      version:
        1,

      direction:
        "ltr",

      children:
        paragraphs.map(
          paragraphNode,
        ),
    },
  };
}

/* ── Trusted media resolution ───────────────────────── */

type ResolvedCompilerMedia = {
  media?: number;

  legacySrc?: string;

  alt?: string;

  caption?: string;

  credit?: string;
};

function buildMediaRegistry(
  assets:
    CompilerMediaAsset[],
): Map<
  string,
  ResolvedCompilerMedia
> {
  const registry =
    new Map<
      string,
      ResolvedCompilerMedia
    >();

  for (const asset of assets) {
    if (!nonEmpty(asset.id)) {
      throw new Error(
        "Every Compiler media asset requires an id.",
      );
    }

    const id =
      asset.id.trim();

    if (registry.has(id)) {
      throw new Error(
        `Duplicate Compiler media asset id: ${id}`,
      );
    }

    const hasLegacy =
      nonEmpty(
        asset.legacySrc,
      );

    const hasMedia =
      typeof asset.mediaId ===
        "number";

    if (
      hasLegacy ===
      hasMedia
    ) {
      throw new Error(
        `Compiler media asset ${id} must provide exactly one of legacySrc or mediaId.`,
      );
    }

    if (hasLegacy) {
      assertLegacySrc(
        asset.legacySrc!,
        id,
      );
    }

    if (hasMedia) {
      if (
        !Number.isInteger(
          asset.mediaId,
        ) ||
        asset.mediaId! <= 0
      ) {
        throw new Error(
          `Compiler media asset ${id} has invalid mediaId.`,
        );
      }
    }

    registry.set(
      id,
      {
        media:
          hasMedia
            ? asset.mediaId
            : undefined,

        legacySrc:
          hasLegacy
            ? asset
                .legacySrc!
                .trim()
            : undefined,

        alt:
          cleanOptional(
            asset.alt,
          ),

        caption:
          cleanOptional(
            asset.caption,
          ),

        credit:
          cleanOptional(
            asset.credit,
          ),
      },
    );
  }

  return registry;
}

function resolveAsset(
  assetId: string,
  registry:
    Map<
      string,
      ResolvedCompilerMedia
    >,
  label: string,
): ResolvedCompilerMedia {
  const media =
    registry.get(
      assetId,
    );

  if (!media) {
    throw new Error(
      `${label} references unknown Compiler media asset: ${assetId}`,
    );
  }

  return media;
}

/* ── Request validation ─────────────────────────────── */

function validateCompilerRequest(
  request:
    CompilerRequest,
) {
  if (
    !request.design ||
    request.design.renderMode !==
      "flexible"
  ) {
    throw new Error(
      "Flexible CMS Compiler requires renderMode=flexible.",
    );
  }

  if (
    !Array.isArray(
      request.design.sections,
    ) ||
    request.design.sections
      .length === 0
  ) {
    throw new Error(
      "Flexible CMS Compiler requires at least one Designer section.",
    );
  }

  const continuity =
    request
      .allowedContinuitySlugs ??
    [];

  if (
    !continuity.every(
      (slug) =>
        nonEmpty(slug),
    )
  ) {
    throw new Error(
      "Compiler allowedContinuitySlugs must contain only non-empty strings.",
    );
  }

  if (
    new Set(continuity).size !==
    continuity.length
  ) {
    throw new Error(
      "Compiler allowedContinuitySlugs contains duplicates.",
    );
  }

  for (const slug of continuity) {
    assertSlug(
      slug,
      "Compiler continuity slug",
    );
  }
}

/* ── Evidence binding ───────────────────────────────── */

function bindingFor(
  section:
    DesignedSection,
): SectionEvidenceBinding {
  return {
    sectionId:
      section.id,

    chapterId:
      section.chapterId,

    blockType:
      section.blockType,

    evidenceClaimIds: [
      ...section
        .evidenceClaimIds,
    ],
  };
}

/* ── Public compiler ────────────────────────────────── */

export function compileFlexibleCaseStudy(
  request:
    CompilerRequest,
): CompiledFlexibleCaseStudy {
  validateCompilerRequest(
    request,
  );

  const mediaRegistry =
    buildMediaRegistry(
      request.mediaAssets ??
        [],
    );

  const continuity =
    new Set(
      request
        .allowedContinuitySlugs ??
        [],
    );

  const cmsSections:
    CmsFlexibleSection[] =
    [];

  const bindings:
    SectionEvidenceBinding[] =
    [];

  const seenSectionIds =
    new Set<string>();

  for (
    const section
    of request.design.sections
  ) {
    if (!nonEmpty(section.id)) {
      throw new Error(
        "Every Compiler section requires an internal section id.",
      );
    }

    if (
      seenSectionIds.has(
        section.id,
      )
    ) {
      throw new Error(
        `Duplicate Compiler section id: ${section.id}`,
      );
    }

    seenSectionIds.add(
      section.id,
    );

    bindings.push(
      bindingFor(
        section,
      ),
    );

    switch (
      section.blockType
    ) {
      /* ── SECTION INTRO ───────────────────────────── */

      case "sectionIntro": {
        cmsSections.push({
          blockType:
            "sectionIntro",

          eyebrow:
            section.eyebrow,

          heading:
            section.heading,

          body:
            section.body,
        });

        break;
      }

      /* ── RICH TEXT ───────────────────────────────── */

      case "richText": {
        cmsSections.push({
          blockType:
            "richText",

          content:
            plainTextToLexical(
              section.body,
            ),
        });

        break;
      }

      /* ── MEDIA BLOCK ─────────────────────────────── */

      case "mediaBlock": {
        const media =
          resolveAsset(
            section.assetId,
            mediaRegistry,
            `Compiler section ${section.id}`,
          );

        cmsSections.push({
          blockType:
            "mediaBlock",

          ...media,
        });

        break;
      }

      /* ── FULL BLEED MEDIA ────────────────────────── */

      case "fullBleedMedia": {
        const media =
          resolveAsset(
            section.assetId,
            mediaRegistry,
            `Compiler section ${section.id}`,
          );

        cmsSections.push({
          blockType:
            "fullBleedMedia",

          ...media,

          overlayHeading:
            section
              .overlayHeading,
        });

        break;
      }

      /* ── SPLIT CONTENT ───────────────────────────── */

      case "splitContent": {
        const media =
          resolveAsset(
            section.assetId,
            mediaRegistry,
            `Compiler section ${section.id}`,
          );

        cmsSections.push({
          blockType:
            "splitContent",

          mediaSide:
            section.mediaSide,

          content:
            plainTextToLexical(
              section.body,
            ),

          ...media,
        });

        break;
      }

      /* ── MEDIA GALLERY ───────────────────────────── */

      case "mediaGallery": {
        const items =
          section.assetIds.map(
            (assetId) => {
              const media =
                resolveAsset(
                  assetId,
                  mediaRegistry,
                  `Compiler section ${section.id}`,
                );

              return {
                ...media,
              };
            },
          );

        cmsSections.push({
          blockType:
            "mediaGallery",

          heading:
            section.heading,

          items,
        });

        break;
      }

      /* ── METRICS ─────────────────────────────────── */

      case "metrics": {
        cmsSections.push({
          blockType:
            "metrics",

          heading:
            section.heading,

          items:
            section.items.map(
              (item) => ({
                /**
                 * claimId deliberately stripped.
                 */
                value:
                  item.value,

                label:
                  item.label,

                prefix:
                  item.prefix,

                suffix:
                  item.suffix,

                note:
                  item.note,
              }),
            ),
        });

        break;
      }

      /* ── QUOTE ───────────────────────────────────── */

      case "quote": {
        cmsSections.push({
          blockType:
            "quote",

          /**
           * claimId deliberately stripped.
           */
          quote:
            section.quote,

          attribution:
            section.attribution,
        });

        break;
      }

      /* ── CTA ─────────────────────────────────────── */

      case "cta": {
        const target =
          section
            .targetProjectSlug;

        let buttonHref:
          string | undefined;

        if (target) {
          assertSlug(
            target,
            `Compiler CTA target`,
          );

          if (
            !continuity.has(
              target,
            )
          ) {
            throw new Error(
              `Compiler CTA references non-allowlisted project slug: ${target}`,
            );
          }

          buttonHref =
            `/work/${target}`;
        }

        if (
          section.buttonLabel &&
          !buttonHref
        ) {
          throw new Error(
            `Compiler CTA ${section.id} has buttonLabel without an approved targetProjectSlug.`,
          );
        }

        if (
          buttonHref &&
          !section.buttonLabel
        ) {
          throw new Error(
            `Compiler CTA ${section.id} has targetProjectSlug without buttonLabel.`,
          );
        }

        cmsSections.push({
          blockType:
            "cta",

          heading:
            section.heading,

          body:
            section.body,

          buttonLabel:
            section.buttonLabel,

          buttonHref,
        });

        break;
      }

      default: {
        const neverSection:
          never =
          section;

        throw new Error(
          `Unsupported Designer section type: ${
            (
              neverSection as {
                blockType?:
                  unknown;
              }
            ).blockType
          }`,
        );
      }
    }
  }

  return {
    renderMode:
      "flexible",

    cmsSections,

    bindings,
  };
}
