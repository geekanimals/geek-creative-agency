/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE QUALITY GATE v2
 *
 * Independent deterministic audit for the new Flexible pipeline.
 *
 * This gate does NOT write to Payload, DB or CMS.
 * It does NOT publish.
 * It does NOT trust earlier module validation blindly.
 *
 * It independently checks:
 * - render-mode consistency;
 * - evidence publication safety;
 * - architecture evidence integrity;
 * - Designer → Compiler binding integrity;
 * - metrics and quote grounding;
 * - CTA continuity integrity;
 * - compiler ordering;
 * - internal metadata leakage into CMS sections;
 * - minimum structural completeness.
 */

import type {
  EvidenceClaim,
  QualityGateResult,
  QualityIssue,
} from "./types";

import type {
  CaseStudyDesignPlan,
} from "./architect";

import type {
  DesignedSection,
  FlexibleCaseStudyDesign,
} from "./designer";

import type {
  CompiledFlexibleCaseStudy,
} from "./compiler";

/* ── Public request ─────────────────────────────────── */

export type FlexibleQualityGateRequest = {
  claims:
    EvidenceClaim[];

  architecture:
    CaseStudyDesignPlan;

  design:
    FlexibleCaseStudyDesign;

  compiled:
    CompiledFlexibleCaseStudy;
};

/* ── Generic helpers ────────────────────────────────── */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function sameStrings(
  left: string[],
  right: string[],
): boolean {
  return (
    left.length ===
      right.length &&
    left.every(
      (value, index) =>
        value ===
        right[index],
    )
  );
}

function normalizeChapterId(
  value: unknown,
): string | undefined {
  return (
    typeof value === "string" &&
    value.trim()
  )
    ? value
    : undefined;
}

function addIssue(
  issues: QualityIssue[],
  issue: QualityIssue,
) {
  issues.push(issue);
}

function scoreFor(
  issues: QualityIssue[],
): number {
  let score = 100;

  for (const issue of issues) {
    if (
      issue.severity ===
      "error"
    ) {
      score -= 18;
    }

    if (
      issue.severity ===
      "warning"
    ) {
      score -= 6;
    }
  }

  return Math.max(
    0,
    Math.min(
      100,
      score,
    ),
  );
}

/* ── Evidence helpers ───────────────────────────────── */

function claimMapFor(
  claims: EvidenceClaim[],
): Map<string, EvidenceClaim> {
  return new Map(
    claims.map(
      (claim) => [
        claim.id,
        claim,
      ],
    ),
  );
}

function validatePublicClaimReference(
  claimId: string,
  claimMap: Map<string, EvidenceClaim>,
  issues: QualityIssue[],
  field: string,
) {
  const claim =
    claimMap.get(
      claimId,
    );

  if (!claim) {
    addIssue(
      issues,
      {
        code:
          "FLEX_EVIDENCE_UNKNOWN",

        severity:
          "error",

        message:
          `Public Flexible content references unknown evidence claim "${claimId}".`,

        field,

        claimId,
      },
    );

    return;
  }

  if (!claim.publishable) {
    addIssue(
      issues,
      {
        code:
          "FLEX_EVIDENCE_NOT_PUBLISHABLE",

        severity:
          "error",

        message:
          `Public Flexible content references non-publishable evidence claim "${claimId}".`,

        field,

        claimId,
      },
    );
  }

  if (
    claim.confidence ===
    "low"
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_EVIDENCE_LOW_CONFIDENCE",

        severity:
          "error",

        message:
          `Public Flexible content references low-confidence evidence claim "${claimId}".`,

        field,

        claimId,
      },
    );
  }
}

/* ── Render-mode audit ──────────────────────────────── */

function validateRenderModes(
  request:
    FlexibleQualityGateRequest,
  issues:
    QualityIssue[],
) {
  if (
    request.architecture
      .renderModeRecommendation !==
    "flexible"
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_ARCHITECT_MODE_INVALID",

        severity:
          "error",

        message:
          "Flexible quality gate requires Architect renderModeRecommendation=flexible.",

        field:
          "architecture.renderModeRecommendation",
      },
    );
  }

  if (
    request.design.renderMode !==
    "flexible"
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_DESIGN_MODE_INVALID",

        severity:
          "error",

        message:
          "Flexible quality gate requires Designer renderMode=flexible.",

        field:
          "design.renderMode",
      },
    );
  }

  if (
    request.compiled.renderMode !==
    "flexible"
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_COMPILED_MODE_INVALID",

        severity:
          "error",

        message:
          "Flexible quality gate requires Compiler renderMode=flexible.",

        field:
          "compiled.renderMode",
      },
    );
  }
}

/* ── Architecture audit ─────────────────────────────── */

function validateArchitecture(
  request:
    FlexibleQualityGateRequest,
  claimMap:
    Map<string, EvidenceClaim>,
  issues:
    QualityIssue[],
) {
  const architecture =
    request.architecture;

  if (
    architecture.chapters.length ===
    0
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_ARCHITECTURE_EMPTY",

        severity:
          "error",

        message:
          "Flexible architecture contains no chapters.",

        field:
          "architecture.chapters",
      },
    );
  }

  const chapterIds =
    new Set<string>();

  for (
    const chapter
    of architecture.chapters
  ) {
    if (
      chapterIds.has(
        chapter.id,
      )
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_ARCHITECTURE_DUPLICATE_CHAPTER",

          severity:
            "error",

          message:
            `Flexible architecture contains duplicate chapter "${chapter.id}".`,

          field:
            "architecture.chapters",
        },
      );
    }

    chapterIds.add(
      chapter.id,
    );

    for (
      const claimId
      of chapter.evidenceClaimIds
    ) {
      validatePublicClaimReference(
        claimId,
        claimMap,
        issues,
        `architecture.chapters.${chapter.id}.evidenceClaimIds`,
      );
    }

    for (
      const claimId
      of chapter.metricClaimIds
    ) {
      validatePublicClaimReference(
        claimId,
        claimMap,
        issues,
        `architecture.chapters.${chapter.id}.metricClaimIds`,
      );

      const claim =
        claimMap.get(
          claimId,
        );

      if (
        claim &&
        claim.type !==
          "metric"
      ) {
        addIssue(
          issues,
          {
            code:
              "FLEX_ARCHITECTURE_METRIC_TYPE_INVALID",

            severity:
              "error",

            message:
              `Architect metric reference "${claimId}" is not a metric claim.`,

            field:
              `architecture.chapters.${chapter.id}.metricClaimIds`,

            claimId,
          },
        );
      }
    }
  }

  for (
    const metric
    of architecture.metricsPlan
  ) {
    validatePublicClaimReference(
      metric.claimId,
      claimMap,
      issues,
      "architecture.metricsPlan",
    );

    const claim =
      claimMap.get(
        metric.claimId,
      );

    if (
      claim &&
      claim.type !==
        "metric"
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_METRICS_PLAN_TYPE_INVALID",

          severity:
            "error",

          message:
            `Metrics plan references non-metric claim "${metric.claimId}".`,

          field:
            "architecture.metricsPlan",

          claimId:
            metric.claimId,
        },
      );
    }
  }

  for (
    const media
    of architecture.mediaPlan
  ) {
    for (
      const claimId
      of media.evidenceClaimIds
    ) {
      validatePublicClaimReference(
        claimId,
        claimMap,
        issues,
        "architecture.mediaPlan",
      );
    }
  }
}

/* ── Designer + binding audit ───────────────────────── */

function narrativeNeedsEvidence(
  section:
    DesignedSection,
): boolean {
  if (
    section.blockType ===
    "richText"
  ) {
    return true;
  }

  if (
    section.blockType ===
    "splitContent"
  ) {
    return true;
  }

  if (
    section.blockType ===
    "quote"
  ) {
    return true;
  }

  if (
    section.blockType ===
    "metrics"
  ) {
    return true;
  }

  if (
    section.blockType ===
    "sectionIntro"
  ) {
    return Boolean(
      section.body?.trim(),
    );
  }

  return false;
}

function validateDesignAndBindings(
  request:
    FlexibleQualityGateRequest,
  claimMap:
    Map<string, EvidenceClaim>,
  issues:
    QualityIssue[],
) {
  const designSections =
    request.design.sections;

  const bindings =
    request.compiled.bindings;

  const cmsSections =
    request.compiled.cmsSections;

  if (
    designSections.length ===
    0
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_DESIGN_EMPTY",

        severity:
          "error",

        message:
          "Flexible Designer produced no sections.",

        field:
          "design.sections",
      },
    );
  }

  if (
    bindings.length !==
    designSections.length
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_BINDING_COUNT_MISMATCH",

        severity:
          "error",

        message:
          "Compiler evidence-binding count does not match Designer section count.",

        field:
          "compiled.bindings",
      },
    );
  }

  if (
    cmsSections.length !==
    designSections.length
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_CMS_SECTION_COUNT_MISMATCH",

        severity:
          "error",

        message:
          "Compiled CMS section count does not match Designer section count.",

        field:
          "compiled.cmsSections",
      },
    );
  }

  const metricClaimsUsed =
    new Set<string>();

  for (
    let index = 0;
    index <
    designSections.length;
    index++
  ) {
    const section =
      designSections[index];

    const binding =
      bindings[index];

    const cmsSection =
      cmsSections[index];

    if (!binding) {
      continue;
    }

    if (
      binding.sectionId !==
      section.id
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_BINDING_SECTION_MISMATCH",

          severity:
            "error",

          message:
            `Compiler binding at index ${index} does not belong to Designer section "${section.id}".`,

          field:
            `compiled.bindings.${index}`,
        },
      );
    }

    if (
      binding.blockType !==
      section.blockType
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_BINDING_BLOCKTYPE_MISMATCH",

          severity:
            "error",

          message:
            `Compiler binding block type does not match Designer section "${section.id}".`,

          field:
            `compiled.bindings.${index}`,
        },
      );
    }

    if (
      normalizeChapterId(
        binding.chapterId,
      ) !==
      normalizeChapterId(
        section.chapterId,
      )
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_BINDING_CHAPTER_MISMATCH",

          severity:
            "error",

          message:
            `Compiler binding chapter does not match Designer section "${section.id}".`,

          field:
            `compiled.bindings.${index}`,
        },
      );
    }

    if (
      !sameStrings(
        binding.evidenceClaimIds,
        section.evidenceClaimIds,
      )
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_BINDING_EVIDENCE_MISMATCH",

          severity:
            "error",

          message:
            `Compiler evidence binding differs from Designer evidence for section "${section.id}".`,

          field:
            `compiled.bindings.${index}`,
        },
      );
    }

    if (
      cmsSection &&
      cmsSection.blockType !==
        section.blockType
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_COMPILED_ORDER_MISMATCH",

          severity:
            "error",

          message:
            `Compiled CMS block order differs from Designer order at section "${section.id}".`,

          field:
            `compiled.cmsSections.${index}`,
        },
      );
    }

    for (
      const claimId
      of section.evidenceClaimIds
    ) {
      validatePublicClaimReference(
        claimId,
        claimMap,
        issues,
        `design.sections.${section.id}`,
      );
    }

    if (
      narrativeNeedsEvidence(
        section,
      ) &&
      section.evidenceClaimIds
        .length ===
        0
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_NARRATIVE_UNBOUND",

          severity:
            "error",

          message:
            `Narrative section "${section.id}" has no evidence binding.`,

          field:
            `design.sections.${section.id}`,
        },
      );
    }

    if (
      section.blockType ===
      "metrics"
    ) {
      for (
        const item
        of section.items
      ) {
        metricClaimsUsed.add(
          item.claimId,
        );

        validatePublicClaimReference(
          item.claimId,
          claimMap,
          issues,
          `design.sections.${section.id}.items`,
        );

        const claim =
          claimMap.get(
            item.claimId,
          );

        if (
          claim &&
          claim.type !==
            "metric"
        ) {
          addIssue(
            issues,
            {
              code:
                "FLEX_METRIC_TYPE_INVALID",

              severity:
                "error",

              message:
                `Metric item "${item.claimId}" does not reference metric evidence.`,

              field:
                `design.sections.${section.id}.items`,

              claimId:
                item.claimId,
            },
          );
        }

        if (
          !section
            .evidenceClaimIds
            .includes(
              item.claimId,
            )
        ) {
          addIssue(
            issues,
            {
              code:
                "FLEX_METRIC_BINDING_MISSING",

              severity:
                "error",

              message:
                `Metric "${item.claimId}" is not included in its section evidence binding.`,

              field:
                `design.sections.${section.id}`,

              claimId:
                item.claimId,
            },
          );
        }
      }
    }

    if (
      section.blockType ===
      "quote"
    ) {
      validatePublicClaimReference(
        section.claimId,
        claimMap,
        issues,
        `design.sections.${section.id}.claimId`,
      );

      const claim =
        claimMap.get(
          section.claimId,
        );

      if (
        claim &&
        claim.type !==
          "quote"
      ) {
        addIssue(
          issues,
          {
            code:
              "FLEX_QUOTE_TYPE_INVALID",

            severity:
              "error",

            message:
              `Quote section "${section.id}" does not reference quote evidence.`,

            field:
              `design.sections.${section.id}`,

            claimId:
              section.claimId,
          },
        );
      }

      if (
        claim &&
        claim.statement.trim() !==
          section.quote.trim()
      ) {
        addIssue(
          issues,
          {
            code:
              "FLEX_QUOTE_TEXT_MISMATCH",

            severity:
              "error",

            message:
              `Quote section "${section.id}" does not exactly match its evidence claim.`,

            field:
              `design.sections.${section.id}`,

            claimId:
              section.claimId,
          },
        );
      }
    }
  }

  for (
    const plannedMetric
    of request.architecture
      .metricsPlan
  ) {
    if (
      !metricClaimsUsed.has(
        plannedMetric.claimId,
      )
    ) {
      addIssue(
        issues,
        {
          code:
            "FLEX_PLANNED_METRIC_MISSING",

          severity:
            "error",

          message:
            `Architect-planned metric "${plannedMetric.claimId}" is absent from the designed case study.`,

          field:
            "architecture.metricsPlan",

          claimId:
            plannedMetric.claimId,
        },
      );
    }
  }

  const hasDesignedMedia =
    designSections.some(
      (section) =>
        section.blockType ===
          "mediaBlock" ||
        section.blockType ===
          "fullBleedMedia" ||
        section.blockType ===
          "splitContent" ||
        section.blockType ===
          "mediaGallery",
    );

  if (
    request.architecture
      .mediaPlan.length >
      0 &&
    !hasDesignedMedia
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_MEDIA_PLAN_UNFULFILLED",

        severity:
          "warning",

        message:
          "Architect requested media treatment but Designer produced no media-bearing sections.",

        field:
          "architecture.mediaPlan",
      },
    );
  }
}

/* ── CTA continuity audit ───────────────────────────── */

function validateCta(
  request:
    FlexibleQualityGateRequest,
  issues:
    QualityIssue[],
) {
  const expectedTarget =
    request.architecture
      .ctaPlan
      .targetProjectSlug;

  const ctas =
    request.design.sections
      .filter(
        (
          section,
        ): section is Extract<
          DesignedSection,
          {
            blockType:
              "cta";
          }
        > =>
          section.blockType ===
          "cta",
      );

  if (
    expectedTarget &&
    ctas.length ===
      0
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_CTA_MISSING",

        severity:
          "error",

        message:
          `Architect approved CTA target "${expectedTarget}" but Designer produced no CTA.`,

        field:
          "design.sections",
      },
    );

    return;
  }

  if (
    ctas.length >
    1
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_CTA_MULTIPLE",

        severity:
          "error",

        message:
          "Flexible case study contains more than one CTA section.",

        field:
          "design.sections",
      },
    );
  }

  const cta =
    ctas[0];

  if (!cta) {
    return;
  }

  if (
    cta.targetProjectSlug !==
    expectedTarget
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_CTA_TARGET_MISMATCH",

        severity:
          "error",

        message:
          "Designer CTA target does not match Architect-approved continuity target.",

        field:
          `design.sections.${cta.id}`,
      },
    );
  }

  const finalSection =
    request.design.sections[
      request.design.sections
        .length -
      1
    ];

  if (
    finalSection?.id !==
    cta.id
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_CTA_NOT_FINAL",

        severity:
          "error",

        message:
          "Flexible CTA must remain the final designed section.",

        field:
          `design.sections.${cta.id}`,
      },
    );
  }

  const compiledCta =
    request.compiled
      .cmsSections
      .find(
        (section) =>
          section.blockType ===
          "cta",
      );

  if (
    expectedTarget &&
    (
      !compiledCta ||
      compiledCta.blockType !==
        "cta" ||
      compiledCta.buttonHref !==
        `/work/${expectedTarget}`
    )
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_CTA_COMPILED_PATH_INVALID",

        severity:
          "error",

        message:
          "Compiled CTA path does not match the Architect-approved project slug.",

        field:
          "compiled.cmsSections",
      },
    );
  }
}

/* ── CMS leakage audit ──────────────────────────────── */

const FORBIDDEN_CMS_KEYS =
  new Set([
    "evidenceClaimIds",
    "claimId",
    "assetId",
    "assetIds",
    "targetProjectSlug",
  ]);

function findForbiddenKeys(
  value: unknown,
  found: Set<string>,
) {
  if (
    Array.isArray(value)
  ) {
    for (
      const item
      of value
    ) {
      findForbiddenKeys(
        item,
        found,
      );
    }

    return;
  }

  if (
    !isObject(value)
  ) {
    return;
  }

  for (
    const [
      key,
      child,
    ]
    of Object.entries(
      value,
    )
  ) {
    if (
      FORBIDDEN_CMS_KEYS.has(
        key,
      )
    ) {
      found.add(
        key,
      );
    }

    findForbiddenKeys(
      child,
      found,
    );
  }
}

function validateCmsLeakage(
  request:
    FlexibleQualityGateRequest,
  issues:
    QualityIssue[],
) {
  const forbidden =
    new Set<string>();

  findForbiddenKeys(
    request.compiled
      .cmsSections,
    forbidden,
  );

  for (
    const key
    of forbidden
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_CMS_INTERNAL_METADATA_LEAK",

        severity:
          "error",

        message:
          `Internal field "${key}" leaked into CMS section output.`,

        field:
          "compiled.cmsSections",
      },
    );
  }
}

/* ── Public gate ────────────────────────────────────── */

export function runFlexibleQualityGate(
  request:
    FlexibleQualityGateRequest,
): QualityGateResult {
  const issues:
    QualityIssue[] =
    [];

  const claimMap =
    claimMapFor(
      request.claims,
    );

  if (
    request.claims.length ===
    0
  ) {
    addIssue(
      issues,
      {
        code:
          "FLEX_EVIDENCE_LEDGER_EMPTY",

        severity:
          "error",

        message:
          "Flexible case study has no reconciled evidence claims.",

        field:
          "claims",
      },
    );
  }

  validateRenderModes(
    request,
    issues,
  );

  validateArchitecture(
    request,
    claimMap,
    issues,
  );

  validateDesignAndBindings(
    request,
    claimMap,
    issues,
  );

  validateCta(
    request,
    issues,
  );

  validateCmsLeakage(
    request,
    issues,
  );

  const errors =
    issues.filter(
      (issue) =>
        issue.severity ===
        "error",
    );

  const warnings =
    issues.filter(
      (issue) =>
        issue.severity ===
        "warning",
    );

  const score =
    scoreFor(
      issues,
    );

  const draftReady =
    errors.length ===
    0;

  const status:
    QualityGateResult["status"] =
    errors.length > 0
      ? "fail"
      : warnings.length > 0
        ? "partial"
        : "pass";

  return {
    status,
    draftReady,
    score,
    issues,
  };
}
