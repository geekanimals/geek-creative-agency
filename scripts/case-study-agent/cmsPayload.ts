/**
 * GOLD STANDARD CASE STUDY AGENT — CMS PAYLOAD SANITIZER
 *
 * Pure function. No DB, no Payload, no network.
 *
 * Converts an evidence-rich Agent package into publication-safe Project fields.
 * Evidence, confidence, claimIds, quality results and agent metadata NEVER cross
 * this boundary.
 */

import type { CaseStudyAgentPackage } from "./types";

export type CmsProjectPayload = {
  title: string;
  slug: string;
  client?: string;
  year?: number;
  location?: string;

  shortSummary?: string;
  cardSummary?: string;

  renderMode: "standard";
  projectKind:
    | "campaign"
    | "ongoing-program"
    | "platform"
    | "activation";

  heroLegacySrc?: string;

  headline?: string;
  challenge?: {
    question?: string;
    copy?: string;
  };
  insight?: string;
  idea?: {
    statement?: string;
    copy?: string;
  };
  execution?: string;
  outcome?: string;
  quote?: {
    text?: string;
    attribution?: string;
  };

  metrics?: {
    value: string;
    label: string;
    prefix?: string;
    suffix?: string;
    note?: string;
  }[];

  faqs?: {
    question: string;
    answer: string;
  }[];

  pressCoverage?: Record<string, unknown>[];
  awards?: Record<string, unknown>[];

  searchStrategy?: Record<string, unknown>;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noindex?: boolean;
  };
};

function cleanText(value?: string): string | undefined {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function removeUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeUndefined(item))
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    const cleaned = Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, removeUndefined(entry)]),
    );

    return cleaned as T;
  }

  return value;
}

export function sanitizeProjectForCms(
  pkg: CaseStudyAgentPackage,
): CmsProjectPayload {
  const p = pkg.project;

  const data: CmsProjectPayload = {
    title: p.title.trim(),
    slug: p.slug.trim(),

    client: cleanText(p.client),
    year: p.year,
    location: cleanText(p.location),

    shortSummary: cleanText(p.shortSummary),
    cardSummary: cleanText(p.cardSummary),

    renderMode: "standard",
    projectKind: p.projectKind,

    heroLegacySrc: cleanText(p.heroLegacySrc),

    headline: cleanText(p.headline),

    challenge:
      p.challenge &&
      (cleanText(p.challenge.question) || cleanText(p.challenge.copy))
        ? {
            question: cleanText(p.challenge.question),
            copy: cleanText(p.challenge.copy),
          }
        : undefined,

    insight: cleanText(p.insight),

    idea:
      p.idea &&
      (cleanText(p.idea.statement) || cleanText(p.idea.copy))
        ? {
            statement: cleanText(p.idea.statement),
            copy: cleanText(p.idea.copy),
          }
        : undefined,

    execution: cleanText(p.execution),
    outcome: cleanText(p.outcome),

    quote:
      p.quote &&
      (cleanText(p.quote.text) || cleanText(p.quote.attribution))
        ? {
            text: cleanText(p.quote.text),
            attribution: cleanText(p.quote.attribution),
          }
        : undefined,

    /**
     * claimId intentionally stripped here.
     */
    metrics: (p.metrics ?? []).map((metric) => ({
      value: metric.value.trim(),
      label: metric.label.trim(),
      prefix: cleanText(metric.prefix),
      suffix: cleanText(metric.suffix),
      note: cleanText(metric.note),
    })),

    faqs: (p.faqs ?? []).map((faq) => ({
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    })),

    pressCoverage: (p.press ?? []).map((item) => ({ ...item })),
    awards: (p.awards ?? []).map((item) => ({ ...item })),

    searchStrategy: p.searchStrategy
      ? { ...p.searchStrategy }
      : undefined,

    seo: p.seo
      ? {
          metaTitle: cleanText(p.seo.metaTitle),
          metaDescription: cleanText(p.seo.metaDescription),
          noindex: Boolean(p.seo.noindex),
        }
      : undefined,
  };

  return removeUndefined(data);
}

/**
 * Relationship slugs remain separate from the public-field sanitizer because
 * the DB writer must resolve them to Payload IDs deterministically.
 */
export function relationshipSlugs(pkg: CaseStudyAgentPackage) {
  return {
    companySlug: cleanText(pkg.project.companySlug),
    brandSlug: cleanText(pkg.project.brandSlug),

    businessCategorySlugs: [
      ...new Set(pkg.project.businessCategorySlugs ?? []),
    ],

    serviceSlugs: [
      ...new Set(pkg.project.serviceSlugs ?? []),
    ],

    solutionSlugs: [
      ...new Set(pkg.project.solutionSlugs ?? []),
    ],
  };
}
