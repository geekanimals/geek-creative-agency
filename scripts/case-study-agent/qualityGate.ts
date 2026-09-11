import type {
  CaseStudyAgentPackage,
  EvidenceClaim,
  QualityGateResult,
  QualityIssue,
  StandardCaseStudyDraft,
} from "./types";

const PROTECTED_FLAGSHIP_SLUGS = new Set([
  "high-ultra-lounge",
  "the-coolest-job",
]);

const HTTP_URL = /^https?:\/\/\S+$/i;

function text(value?: string): string {
  return (value ?? "").trim();
}

function unique(values?: string[]): boolean {
  const clean = (values ?? []).filter(Boolean);
  return new Set(clean).size === clean.length;
}

function push(
  issues: QualityIssue[],
  code: string,
  severity: QualityIssue["severity"],
  message: string,
  field?: string,
  claimId?: string,
) {
  issues.push({ code, severity, message, field, claimId });
}

function claimById(
  claims: EvidenceClaim[],
  id?: string,
): EvidenceClaim | undefined {
  if (!id) return undefined;
  return claims.find((claim) => claim.id === id);
}

function validateNarrative(
  project: StandardCaseStudyDraft,
  issues: QualityIssue[],
) {
  if (!text(project.headline)) {
    push(
      issues,
      "NARRATIVE_HEADLINE_MISSING",
      "error",
      "Standard case study requires a headline.",
      "headline",
    );
  }

  if (!text(project.challenge?.copy)) {
    push(
      issues,
      "NARRATIVE_CHALLENGE_MISSING",
      "error",
      "Standard case study requires a supported challenge.",
      "challenge.copy",
    );
  }

  if (!text(project.insight)) {
    push(
      issues,
      "NARRATIVE_INSIGHT_MISSING",
      "error",
      "Standard case study requires an insight.",
      "insight",
    );
  }

  if (!text(project.idea?.statement) && !text(project.idea?.copy)) {
    push(
      issues,
      "NARRATIVE_IDEA_MISSING",
      "error",
      "Standard case study requires the core idea.",
      "idea",
    );
  }

  if (!text(project.execution)) {
    push(
      issues,
      "NARRATIVE_EXECUTION_MISSING",
      "error",
      "Standard case study requires execution detail.",
      "execution",
    );
  }

  if (!text(project.outcome)) {
    push(
      issues,
      "NARRATIVE_OUTCOME_MISSING",
      "error",
      "Standard case study requires an outcome.",
      "outcome",
    );
  }

  if (!text(project.shortSummary)) {
    push(
      issues,
      "SUMMARY_SHORT_MISSING",
      "warning",
      "Short summary is missing.",
      "shortSummary",
    );
  }

  if (!text(project.cardSummary)) {
    push(
      issues,
      "SUMMARY_CARD_MISSING",
      "warning",
      "Card summary is missing.",
      "cardSummary",
    );
  }
}

function validateRelationships(
  pkg: CaseStudyAgentPackage,
  issues: QualityIssue[],
) {
  const project = pkg.project;
  if (project.brandSlug && !project.companySlug) {
    push(
      issues,
      "RELATION_BRAND_WITHOUT_COMPANY",
      "error",
      "A brand relationship must also resolve to its company.",
      "companySlug",
    );
  }

  if (!(project.businessCategorySlugs?.length ?? 0)) {
    push(
      issues,
      "RELATION_INDUSTRY_MISSING",
      "warning",
      "No business category / industry has been assigned.",
      "businessCategorySlugs",
    );
  }

  if (!(project.serviceSlugs?.length ?? 0)) {
    push(
      issues,
      "RELATION_SERVICE_MISSING",
      "error",
      "At least one service must be explicitly assigned.",
      "serviceSlugs",
    );
  }

  /**
   * Solutions are deliberately optional.
   * The Agent must never infer a Solution merely because projects share a Service.
   */
  const relationshipArrays: Array<[string, string[] | undefined]> = [
    ["businessCategorySlugs", project.businessCategorySlugs],
    ["serviceSlugs", project.serviceSlugs],
    ["solutionSlugs", project.solutionSlugs],
  ];

  for (const [field, values] of relationshipArrays) {
    if (!unique(values)) {
      push(
        issues,
        "RELATION_DUPLICATE_SLUG",
        "error",
        `Duplicate relationship slug found in ${field}.`,
        field,
      );
    }
  }

  /**
   * Solution/IP relationships require explicit evidence.
   * Never infer IRM or another Solution merely because a Project
   * shares a Service with projects that use that Solution.
   */
  for (const solutionSlug of project.solutionSlugs ?? []) {
    const needle = solutionSlug
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const supported = pkg.evidence.claims.some((claim) => {
      if (
        claim.type !== "relationship" ||
        !claim.publishable ||
        claim.confidence === "low"
      ) {
        return false;
      }

      const evidenceText = `${claim.statement} ${claim.note ?? ""}`
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return evidenceText.includes(needle);
    });

    if (!supported) {
      push(
        issues,
        "RELATION_SOLUTION_UNSUPPORTED",
        "error",
        `Solution "${solutionSlug}" has no explicit evidence-backed relationship claim.`,
        "solutionSlugs",
      );
    }
  }
}

function validateEvidence(
  pkg: CaseStudyAgentPackage,
  issues: QualityIssue[],
) {
  const sourceIds = new Set<string>();

  for (const source of pkg.evidence.sources) {
    if (!source.id.trim()) {
      push(
        issues,
        "SOURCE_ID_MISSING",
        "error",
        "Every evidence source requires a stable id.",
        "evidence.sources",
      );
      continue;
    }

    if (sourceIds.has(source.id)) {
      push(
        issues,
        "SOURCE_ID_DUPLICATE",
        "error",
        `Duplicate evidence source id: ${source.id}`,
        "evidence.sources",
      );
    }

    sourceIds.add(source.id);

    if (!text(source.title)) {
      push(
        issues,
        "SOURCE_TITLE_MISSING",
        "error",
        `Evidence source ${source.id} has no title.`,
        "evidence.sources",
      );
    }

    if (source.url && !HTTP_URL.test(source.url)) {
      push(
        issues,
        "SOURCE_URL_INVALID",
        "error",
        `Evidence source ${source.id} has an invalid URL.`,
        "evidence.sources",
      );
    }
  }

  const claimIds = new Set<string>();

  for (const claim of pkg.evidence.claims) {
    if (!claim.id.trim()) {
      push(
        issues,
        "CLAIM_ID_MISSING",
        "error",
        "Every evidence claim requires a stable id.",
        "evidence.claims",
      );
      continue;
    }

    if (claimIds.has(claim.id)) {
      push(
        issues,
        "CLAIM_ID_DUPLICATE",
        "error",
        `Duplicate evidence claim id: ${claim.id}`,
        "evidence.claims",
        claim.id,
      );
    }

    claimIds.add(claim.id);

    if (!text(claim.statement)) {
      push(
        issues,
        "CLAIM_STATEMENT_MISSING",
        "error",
        `Claim ${claim.id} has no statement.`,
        "evidence.claims",
        claim.id,
      );
    }

    if (claim.publishable && claim.sourceIds.length === 0) {
      push(
        issues,
        "CLAIM_PUBLISHABLE_WITHOUT_SOURCE",
        "error",
        `Publishable claim ${claim.id} has no source.`,
        "evidence.claims",
        claim.id,
      );
    }

    for (const sourceId of claim.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        push(
          issues,
          "CLAIM_SOURCE_NOT_FOUND",
          "error",
          `Claim ${claim.id} references unknown source ${sourceId}.`,
          "evidence.claims",
          claim.id,
        );
      }
    }

    if (claim.publishable && claim.confidence === "low") {
      push(
        issues,
        "CLAIM_LOW_CONFIDENCE_PUBLISHABLE",
        "error",
        `Low-confidence claim ${claim.id} cannot be publication-ready.`,
        "evidence.claims",
        claim.id,
      );
    }
  }
}

function validateNarrativeEvidence(
  pkg: CaseStudyAgentPackage,
  issues: QualityIssue[],
) {
  const requiredFields = [
    "challenge",
    "insight",
    "idea",
    "execution",
    "outcome",
  ] as const;

  const bindings = pkg.evidence.narrativeBindings ?? [];
  const seen = new Set<string>();

  for (const binding of bindings) {
    if (seen.has(binding.field)) {
      push(
        issues,
        "NARRATIVE_EVIDENCE_BINDING_DUPLICATE",
        "error",
        `Narrative field "${binding.field}" has more than one evidence binding.`,
        binding.field,
      );
    }

    seen.add(binding.field);

    if (binding.claimIds.length === 0) {
      push(
        issues,
        "NARRATIVE_EVIDENCE_CLAIMS_EMPTY",
        "error",
        `Narrative field "${binding.field}" has no supporting claims.`,
        binding.field,
      );
    }

    for (const claimId of binding.claimIds) {
      const claim = pkg.evidence.claims.find(
        (candidate) => candidate.id === claimId,
      );

      if (!claim) {
        push(
          issues,
          "NARRATIVE_EVIDENCE_CLAIM_NOT_FOUND",
          "error",
          `Narrative field "${binding.field}" references unknown claim ${claimId}.`,
          binding.field,
          claimId,
        );
        continue;
      }

      if (
        !claim.publishable ||
        claim.confidence === "low"
      ) {
        push(
          issues,
          "NARRATIVE_EVIDENCE_CLAIM_UNUSABLE",
          "error",
          `Narrative field "${binding.field}" relies on claim ${claimId}, which is not publication-ready.`,
          binding.field,
          claimId,
        );
      }

      if (
        claim.type !== "narrative" &&
        claim.type !== "fact" &&
        claim.type !== "metric"
      ) {
        push(
          issues,
          "NARRATIVE_EVIDENCE_CLAIM_TYPE_INVALID",
          "error",
          `Narrative field "${binding.field}" cannot be supported by claim type "${claim.type}".`,
          binding.field,
          claimId,
        );
      }
    }
  }

  for (const field of requiredFields) {
    if (!seen.has(field)) {
      push(
        issues,
        "NARRATIVE_EVIDENCE_BINDING_MISSING",
        "error",
        `Narrative field "${field}" has no explicit evidence binding.`,
        field,
      );
    }
  }
}

function validateMetrics(
  pkg: CaseStudyAgentPackage,
  issues: QualityIssue[],
) {
  for (const metric of pkg.project.metrics ?? []) {
    if (!text(metric.value) || !text(metric.label)) {
      push(
        issues,
        "METRIC_INCOMPLETE",
        "error",
        "Every metric requires both value and label.",
        "metrics",
        metric.claimId,
      );
      continue;
    }

    if (!metric.claimId) {
      push(
        issues,
        "METRIC_UNSOURCED",
        "error",
        `Metric "${metric.value} ${metric.label}" has no evidence claim.`,
        "metrics",
      );
      continue;
    }

    const claim = claimById(pkg.evidence.claims, metric.claimId);

    if (!claim) {
      push(
        issues,
        "METRIC_CLAIM_NOT_FOUND",
        "error",
        `Metric references unknown claim ${metric.claimId}.`,
        "metrics",
        metric.claimId,
      );
      continue;
    }

    if (claim.type !== "metric") {
      push(
        issues,
        "METRIC_WRONG_CLAIM_TYPE",
        "error",
        `Metric claim ${claim.id} must have type "metric".`,
        "metrics",
        claim.id,
      );
    }

    if (!claim.publishable) {
      push(
        issues,
        "METRIC_NOT_PUBLISHABLE",
        "error",
        `Metric claim ${claim.id} has not been approved as publishable.`,
        "metrics",
        claim.id,
      );
    }

    if (claim.confidence !== "high") {
      push(
        issues,
        "METRIC_CONFIDENCE_TOO_LOW",
        "error",
        `Public metric ${claim.id} requires high-confidence evidence.`,
        "metrics",
        claim.id,
      );
    }
  }
}

function validateQuote(
  pkg: CaseStudyAgentPackage,
  issues: QualityIssue[],
) {
  const quote = text(pkg.project.quote?.text);
  if (!quote) return;

  const supportedQuote = pkg.evidence.claims.some(
    (claim) =>
      claim.type === "quote" &&
      claim.publishable &&
      claim.confidence !== "low" &&
      text(claim.statement).includes(quote),
  );

  if (!supportedQuote) {
    push(
      issues,
      "QUOTE_UNSUPPORTED",
      "error",
      "Published quote has no matching publishable evidence claim.",
      "quote.text",
    );
  }

  if (!text(pkg.project.quote?.attribution)) {
    push(
      issues,
      "QUOTE_ATTRIBUTION_MISSING",
      "warning",
      "Quote has no attribution.",
      "quote.attribution",
    );
  }
}

function validateProjectSafety(
  project: StandardCaseStudyDraft,
  issues: QualityIssue[],
) {
  if (!text(project.slug)) {
    push(
      issues,
      "PROJECT_SLUG_MISSING",
      "error",
      "Project slug is required.",
      "slug",
    );
  }

  if (!text(project.title)) {
    push(
      issues,
      "PROJECT_TITLE_MISSING",
      "error",
      "Project title is required.",
      "title",
    );
  }

  if (PROTECTED_FLAGSHIP_SLUGS.has(project.slug)) {
    push(
      issues,
      "PROJECT_FLAGSHIP_PROTECTED",
      "error",
      `Agent is prohibited from modifying protected flagship ${project.slug}.`,
      "slug",
    );
  }

  if (project.renderMode !== "standard") {
    push(
      issues,
      "PROJECT_RENDER_MODE_FORBIDDEN",
      "error",
      "Case Study Agent v1 may write only standard render-mode projects.",
      "renderMode",
    );
  }
}

function scoreFor(issues: QualityIssue[]): number {
  let score = 100;

  for (const issue of issues) {
    if (issue.severity === "error") score -= 18;
    if (issue.severity === "warning") score -= 6;
  }

  return Math.max(0, Math.min(100, score));
}

export function runQualityGate(
  pkg: CaseStudyAgentPackage,
): QualityGateResult {
  const issues: QualityIssue[] = [];

  validateProjectSafety(pkg.project, issues);
  validateNarrative(pkg.project, issues);
  validateRelationships(pkg, issues);
  validateEvidence(pkg, issues);
  validateNarrativeEvidence(pkg, issues);
  validateMetrics(pkg, issues);
  validateQuote(pkg, issues);

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  const score = scoreFor(issues);
  const draftReady = errors.length === 0;

  const status: QualityGateResult["status"] =
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
