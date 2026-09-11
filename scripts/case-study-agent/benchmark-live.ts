/**
 * GOLD STANDARD CASE STUDY AGENT — LIVE MODEL BENCHMARK
 *
 * Regenerates the three canonical benchmark cases against the live model.
 *
 * Purpose:
 * - Detect prompt/model regressions.
 * - Test semantic invariants, not exact prose.
 *
 * Safety:
 * - No Payload import.
 * - No database connection.
 * - No CMS write.
 * - No publish path.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/benchmark-live.ts
 */

import fs from "node:fs";
import path from "node:path";

import {
  generateCaseStudy,
} from "./generator";

import type {
  GenerateCaseStudyRequest,
} from "./generator";

/* ── Test helpers ────────────────────────────────────────────────── */

let passed = 0;
let failed = 0;

function check(
  label: string,
  condition: boolean,
) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}`);
    failed++;
  }
}

function displayedMetricValue(
  metric: {
    value?: string;
    prefix?: string;
    suffix?: string;
  },
) {
  return `${metric.prefix ?? ""}${metric.value ?? ""}${metric.suffix ?? ""}`
    .replace(/\s+/g, "")
    .toLowerCase();
}

function readRequest(
  relativePath: string,
): GenerateCaseStudyRequest {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(relativePath),
      "utf8",
    ),
  );
}

/* ── Shared invariants ───────────────────────────────────────────── */

function checkShared(
  name: string,
  built: Awaited<
    ReturnType<typeof generateCaseStudy>
  >,
) {
  const project =
    built.package.project;

  check(
    `${name}: quality PASS`,
    built.quality.status === "pass",
  );

  check(
    `${name}: quality 100/100`,
    built.quality.score === 100,
  );

  check(
    `${name}: draft-ready`,
    built.quality.draftReady === true,
  );

  check(
    `${name}: Standard render mode`,
    project.renderMode === "standard",
  );

  check(
    `${name}: PepsiCo Company`,
    project.companySlug === "pepsico",
  );

  check(
    `${name}: Lay's Brand`,
    project.brandSlug === "lays",
  );

  check(
    `${name}: FMCG category`,
    project.businessCategorySlugs?.includes(
      "fmcg",
    ) === true,
  );

  check(
    `${name}: Influencer Marketing service`,
    project.serviceSlugs?.includes(
      "influencer-marketing",
    ) === true,
  );
}

/* ── Benchmark #1 — Smile ────────────────────────────────────────── */

async function runSmile() {
  console.log(
    "\nBenchmark #1 — Lay's Smile Deke Dekho\n",
  );

  const built =
    await generateCaseStudy(
      readRequest(
        "content/case-study-agent-input/smile-deke-dekho.json",
      ),
    );

  checkShared(
    "Smile",
    built,
  );

  const project =
    built.package.project;

  check(
    "Smile: no Solution relationship",
    (project.solutionSlugs?.length ?? 0) === 0,
  );

  check(
    "Smile: canonical IRM is NOT assigned",
    !project.solutionSlugs?.includes(
      "influencer-relationship-management",
    ),
  );

  const metrics =
    project.metrics ?? [];

  check(
    "Smile: public metrics remain wider-campaign scoped",
    metrics.length > 0 &&
    metrics.every((metric) =>
      `${metric.label} ${metric.note ?? ""}`
        .toLowerCase()
        .includes("wider"),
    ),
  );

  check(
    "Smile: wider metrics are not attributed to Geek",
    metrics.every((metric) => {
      const note =
        (metric.note ?? "")
          .toLowerCase();

      return (
        note.includes("geek") &&
        (
          note.includes("not") ||
          note.includes("not attributable")
        )
      );
    }),
  );

  const publicJson =
    JSON.stringify(project)
      .toLowerCase();

  const conflictingArchiveFigures = [
    "1,450",
    "1450",
    "210m",
    "25m",
    "90%",
    "2,500",
    "2500",
  ];

  check(
    "Smile: conflicting internal archive figures stay out",
    conflictingArchiveFigures.every(
      (figure) =>
        !publicJson.includes(
          figure.toLowerCase(),
        ),
    ),
  );

  check(
    "Smile: outcome preserves creator-community continuity",
    (project.outcome ?? "")
      .toLowerCase()
      .includes("creator") &&
    (project.outcome ?? "")
      .toLowerCase()
      .includes("community"),
  );
}

/* ── Benchmark #2 — Heartwork ────────────────────────────────────── */

async function runHeartwork() {
  console.log(
    "\nBenchmark #2 — Lay's Heartwork\n",
  );

  const built =
    await generateCaseStudy(
      readRequest(
        "content/case-study-agent-input/lays-heartwork.json",
      ),
    );

  checkShared(
    "Heartwork",
    built,
  );

  const project =
    built.package.project;

  check(
    "Heartwork: no Solution relationship",
    (project.solutionSlugs?.length ?? 0) === 0,
  );

  check(
    "Heartwork: canonical IRM is NOT assigned",
    !project.solutionSlugs?.includes(
      "influencer-relationship-management",
    ),
  );

  const metrics =
    project.metrics ?? [];

  const metricJson =
    JSON.stringify(metrics)
      .toLowerCase();

  for (const figure of [
    "1,400",
    "1,058",
    "1,738",
  ]) {
    check(
      `Heartwork: preserves Geek metric ${figure}`,
      metricJson.includes(
        figure.toLowerCase(),
      ),
    );
  }

  check(
    "Heartwork: preserves Geek metric 4.76M tracked reach",
    metrics.some(
      (metric) =>
        metric.label
          .toLowerCase()
          .includes("reach") &&
        displayedMetricValue(metric)
          .includes("4.76m"),
    ),
  );

  check(
    "Heartwork: preserves Geek metric 3.81M tracked engagement",
    metrics.some(
      (metric) =>
        metric.label
          .toLowerCase()
          .includes("engagement") &&
        displayedMetricValue(metric)
          .includes("3.81m"),
    ),
  );

  check(
    "Heartwork: preserves 75% organic participation",
    metrics.some(
      (metric) =>
        metric.label
          .toLowerCase()
          .includes("organic") &&
        displayedMetricValue(metric)
          .includes("75%"),
    ),
  );

  const geekMetrics =
    metrics.filter(
      (metric) =>
        (metric.note ?? "")
          .toLowerCase()
          .includes("geek"),
    );

  check(
    "Heartwork: Geek metrics remain explicitly scoped",
    geekMetrics.length >= 6 &&
    geekMetrics.every(
      (metric) => {
        const text =
          `${metric.label} ${metric.note ?? ""}`
            .toLowerCase();

        return (
          text.includes("tracked") ||
          text.includes("subset") ||
          text.includes("geek")
        );
      },
    ),
  );

  const widerMetrics =
    metrics.filter(
      (metric) => {
        const label =
          metric.label
            .toLowerCase();

        const note =
          (metric.note ?? "")
            .toLowerCase();

        const text =
          `${label} ${note}`;

        // Do not misclassify Geek metrics that explicitly say
        // "not wider-campaign".
        if (
          text.includes("not wider") ||
          text.includes("not the wider")
        ) {
          return false;
        }

        return (
          label.includes("wider") ||
          text.includes("broader heartwork campaign") ||
          text.includes("broader campaign") ||
          text.includes("independent reporting")
        );
      },
    );

  const widerScopePass =
    widerMetrics.every(
      (metric) => {
        const text =
          `${metric.label} ${metric.note ?? ""}`
            .toLowerCase();

        return (
          text.includes("wider") &&
          (
            text.includes("not attributable") ||
            text.includes("not geek") ||
            text.includes("not a geek") ||
            text.includes("separate from geek") ||
            (
              text.includes("separate") &&
              text.includes("geek") &&
              text.includes("subset")
            )
          )
        );
      },
    );

  if (!widerScopePass) {
    console.log(
      "\n  Heartwork wider-metric diagnostic:"
    );
    console.log(
      JSON.stringify(widerMetrics, null, 2)
    );
  }

  check(
    "Heartwork: any wider metrics remain separately scoped",
    widerScopePass,
  );

  const publicJson =
    JSON.stringify(project)
      .toLowerCase();

  check(
    "Heartwork: no public ROI claim",
    !publicJson.includes('"roi"') &&
    !publicJson.includes(
      "return on investment",
    ),
  );

  const outcome =
    (project.outcome ?? "")
      .toLowerCase();

  check(
    "Heartwork: outcome preserves reactivation",
    outcome.includes("reactivat"),
  );

  check(
    "Heartwork: outcome preserves Smile continuity",
    outcome.includes("smile"),
  );
}

/* ── Benchmark #3 — MyLaysRelationchip ───────────────────────────── */

async function runRelationchip() {
  console.log(
    "\nBenchmark #3 — Lay's #MyLaysRelationchip\n",
  );

  const built =
    await generateCaseStudy(
      readRequest(
        "content/case-study-agent-input/mylaysrelationchip.json",
      ),
    );

  checkShared(
    "MyLaysRelationchip",
    built,
  );

  const pkg =
    built.package;

  const project =
    pkg.project;

  check(
    "MyLaysRelationchip: exactly one Solution relationship",
    project.solutionSlugs?.length === 1,
  );

  check(
    "MyLaysRelationchip: canonical IRM IS assigned",
    project.solutionSlugs?.includes(
      "influencer-relationship-management",
    ) === true,
  );

  const irmClaim =
    pkg.evidence.claims.find(
      (claim) => {
        const text =
          `${claim.statement} ${claim.note ?? ""}`
            .toLowerCase();

        return (
          claim.type === "relationship" &&
          (
            text.includes(
              "influencer relationship management",
            ) ||
            text.includes(
              "influencer-relationship-management",
            )
          )
        );
      },
    );

  check(
    "MyLaysRelationchip: IRM has explicit relationship evidence",
    Boolean(irmClaim),
  );

  check(
    "MyLaysRelationchip: IRM evidence is high-confidence",
    irmClaim?.confidence === "high",
  );

  check(
    "MyLaysRelationchip: IRM evidence is publishable",
    irmClaim?.publishable === true,
  );

  const metrics =
    project.metrics ?? [];

  const inboundMetric =
    metrics.find(
      (metric) =>
        metric.label
          .toLowerCase()
          .includes("inbound") &&
        metric.label
          .toLowerCase()
          .includes("creator"),
    );

  check(
    "MyLaysRelationchip: preserves 500+ inbound creators",
    inboundMetric
      ? displayedMetricValue(
          inboundMetric,
        ).includes("500+")
      : false,
  );

  const reachMetric =
    metrics.find(
      (metric) =>
        metric.label
          .toLowerCase()
          .includes("reach") &&
        displayedMetricValue(
          metric,
        ).includes("28m+"),
    );

  check(
    "MyLaysRelationchip: preserves 28M+ creator reach",
    Boolean(reachMetric),
  );

  check(
    "MyLaysRelationchip: 28M+ remains explicitly estimated",
    reachMetric
      ? `${reachMetric.label} ${reachMetric.note ?? ""}`
          .toLowerCase()
          .includes("estimated")
      : false,
  );

  const publicJson =
    JSON.stringify(project)
      .toLowerCase();

  check(
    "MyLaysRelationchip: no public ROI claim",
    !publicJson.includes('"roi"') &&
    !publicJson.includes(
      "return on investment",
    ),
  );

  check(
    "MyLaysRelationchip: creator-value estimate is not exposed as public result",
    !publicJson.includes("5.57"),
  );

  const outcome =
    (project.outcome ?? "")
      .toLowerCase();

  check(
    "MyLaysRelationchip: outcome preserves creator community",
    outcome.includes("creator") &&
    outcome.includes("community"),
  );

  check(
    "MyLaysRelationchip: outcome preserves 500+ creator join demand",
    outcome.includes("500") &&
    outcome.includes("creator") &&
    (
      outcome.includes("inbound") ||
      outcome.includes("request") ||
      outcome.includes("join")
    ),
  );
}

/* ── Main ────────────────────────────────────────────────────────── */

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is required for the live benchmark.",
    );
  }

  console.log(
    "Gold Standard Case Study Agent — LIVE benchmark",
  );

  console.log(
    "\nThis will call the model three times.",
  );

  console.log(
    "No CMS or database connection will be opened.",
  );

  await runSmile();
  await runHeartwork();
  await runRelationchip();

  console.log(
    `\n${failed === 0 ? "PASS" : "FAIL"} — ${passed} passed, ${failed} failed`,
  );

  process.exit(
    failed === 0 ? 0 : 1,
  );
}

main().catch((error) => {
  console.error(
    "\nLive benchmark failed to complete:",
  );

  console.error(
    error instanceof Error
      ? error.message
      : error,
  );

  process.exit(1);
});
