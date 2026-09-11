/**
 * GOLD STANDARD CASE STUDY AGENT — BENCHMARK REGRESSION TESTS
 *
 * Benchmark #1:
 *   Lay's Smile Deke Dekho
 *
 * Guards against future prompt/model/code regressions.
 *
 * No DB.
 * No Payload.
 * No network.
 *
 * Run:
 *   npx tsx scripts/case-study-agent/benchmark.test.ts
 */

import fs from "node:fs";
import path from "node:path";

import { runQualityGate } from "./qualityGate";
import { sanitizeProjectForCms } from "./cmsPayload";
import { validateCaseStudyPackage } from "./validatePackage";

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

const benchmarkPath = path.resolve(
  "content",
  "case-study-agent-benchmarks",
  "smile-deke-dekho.json",
);

const raw = JSON.parse(
  fs.readFileSync(
    benchmarkPath,
    "utf8",
  ),
);

const pkg =
  validateCaseStudyPackage(raw);

const quality =
  runQualityGate(pkg);

const project =
  pkg.project;

console.log(
  "Gold Standard Case Study Agent — benchmark regression tests\n",
);

/* ── 1. Benchmark identity ────────────────────────────────────────── */

check(
  "Smile benchmark slug is stable",
  project.slug ===
    "smile-deke-dekho",
);

check(
  "Smile benchmark remains Standard mode",
  project.renderMode === "standard",
);

check(
  "Smile remains a campaign",
  project.projectKind === "campaign",
);

/* ── 2. Gold Standard quality ────────────────────────────────────── */

check(
  "Smile still passes the trusted quality gate",
  quality.status === "pass",
);

check(
  "Smile remains draft-ready",
  quality.draftReady === true,
);

check(
  "Smile remains 100/100",
  quality.score === 100,
);

/* ── 3. Relationship graph ───────────────────────────────────────── */

check(
  "Company remains PepsiCo",
  project.companySlug === "pepsico",
);

check(
  "Brand remains Lay's",
  project.brandSlug === "lays",
);

check(
  "FMCG industry remains assigned",
  project.businessCategorySlugs?.includes(
    "fmcg",
  ) === true,
);

check(
  "Influencer Marketing service remains assigned",
  project.serviceSlugs?.includes(
    "influencer-marketing",
  ) === true,
);

/* ── 4. Critical IRM rule ────────────────────────────────────────── */

check(
  "Smile has no Solution relationship",
  (project.solutionSlugs?.length ?? 0) === 0,
);

check(
  "Smile never acquires IRM by inference",
  !project.solutionSlugs?.includes("influencer-relationship-management"),
);

/* ── 5. Wider-campaign metric attribution ────────────────────────── */

const metrics =
  project.metrics ?? [];

check(
  "Smile keeps wider-campaign metrics",
  metrics.length > 0,
);

check(
  "every public metric is explicitly wider-campaign scoped",
  metrics.every((metric) =>
    `${metric.label} ${metric.note ?? ""}`
      .toLowerCase()
      .includes("wider"),
  ),
);

check(
  "every public metric avoids Geek attribution",
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

/* ── 6. Conflicting internal metrics stay out ────────────────────── */

const publicMetricJson =
  JSON.stringify(metrics)
    .toLowerCase();

const forbiddenInternalFigures = [
  "1,450",
  "1450",
  "210m",
  "25m",
  "90%",
  "2,500",
  "2500",
];

check(
  "conflicting Geek archive figures remain withheld",
  forbiddenInternalFigures.every(
    (figure) =>
      !publicMetricJson.includes(
        figure.toLowerCase(),
      ),
  ),
);

/* ── 7. Defensible outcome survives ──────────────────────────────── */

const outcome =
  (project.outcome ?? "")
    .toLowerCase();

check(
  "outcome remains focused on creator community",
  outcome.includes("creator") &&
    outcome.includes("community"),
);

check(
  "Smile → Heartwork continuity remains explicit",
  outcome.includes("heartwork"),
);

/* ── 8. Agent-only evidence still cannot leak to CMS ─────────────── */

const cms =
  sanitizeProjectForCms(pkg);

const cmsJson =
  JSON.stringify(cms);

check(
  "benchmark CMS payload contains no evidence",
  !cmsJson.includes('"evidence"'),
);

check(
  "benchmark CMS payload contains no claimId",
  !cmsJson.includes('"claimId"'),
);

check(
  "benchmark CMS payload contains no quality metadata",
  !cmsJson.includes('"quality"'),
);


/* ── Benchmark #2 — Lay's Heartwork ───────────────────────────────── */

const heartworkPath = path.resolve(
  "content",
  "case-study-agent-benchmarks",
  "lays-heartwork.json",
);

const heartworkRaw = JSON.parse(
  fs.readFileSync(
    heartworkPath,
    "utf8",
  ),
);

const heartworkPkg =
  validateCaseStudyPackage(
    heartworkRaw,
  );

const heartworkQuality =
  runQualityGate(
    heartworkPkg,
  );

const heartwork =
  heartworkPkg.project;

console.log(
  "\nBenchmark #2 — Lay's Heartwork\n",
);

/* Identity + quality */

check(
  "Heartwork benchmark slug is stable",
  heartwork.slug === "lays-heartwork",
);

check(
  "Heartwork remains Standard mode",
  heartwork.renderMode === "standard",
);

check(
  "Heartwork remains PASS",
  heartworkQuality.status === "pass",
);

check(
  "Heartwork remains draft-ready",
  heartworkQuality.draftReady === true,
);

check(
  "Heartwork remains 100/100",
  heartworkQuality.score === 100,
);

/* Relationship graph */

check(
  "Heartwork Company remains PepsiCo",
  heartwork.companySlug === "pepsico",
);

check(
  "Heartwork Brand remains Lay's",
  heartwork.brandSlug === "lays",
);

check(
  "Heartwork remains FMCG",
  heartwork.businessCategorySlugs?.includes(
    "fmcg",
  ) === true,
);

check(
  "Heartwork remains Influencer Marketing",
  heartwork.serviceSlugs?.includes(
    "influencer-marketing",
  ) === true,
);

check(
  "Heartwork has no Solution relationship",
  (heartwork.solutionSlugs?.length ?? 0) === 0,
);

check(
  "Heartwork never acquires IRM by inference",
  !heartwork.solutionSlugs?.includes("influencer-relationship-management"),
);

/* Metric-scope separation */

const heartworkMetrics =
  heartwork.metrics ?? [];

const geekMetrics =
  heartworkMetrics.filter(
    (metric) =>
      (metric.note ?? "")
        .toLowerCase()
        .includes("geek"),
  );

const widerMetrics =
  heartworkMetrics.filter(
    (metric) =>
      `${metric.label} ${metric.note ?? ""}`
        .toLowerCase()
        .includes("wider"),
  );

check(
  "Heartwork retains Geek tracked metrics",
  geekMetrics.length >= 6,
);

check(
  "Geek metrics remain explicitly subset-scoped",
  geekMetrics.every(
    (metric) => {
      const text =
        `${metric.label} ${metric.note ?? ""}`
          .toLowerCase();

      return (
        text.includes("tracked") ||
        text.includes("subset")
      );
    },
  ),
);

check(
  "Heartwork retains wider-campaign context separately",
  widerMetrics.length >= 4,
);

check(
  "wider-campaign metrics are not attributed to Geek",
  widerMetrics.every(
    (metric) => {
      const note =
        (metric.note ?? "")
          .toLowerCase();

      return (
        note.includes("not attributable") ||
        note.includes("not a geek") ||
        note.includes("not geek")
      );
    },
  ),
);

/* Required Geek tracked metrics */

const heartworkMetricJson =
  JSON.stringify(
    heartworkMetrics,
  ).toLowerCase();

for (const figure of [
  "1,400",
  "1,058",
  "1,738",
  "4.76m",
  "3.81m",
]) {
  check(
    `Heartwork preserves Geek metric ${figure}`,
    heartworkMetricJson.includes(
      figure.toLowerCase(),
    ),
  );
}

check(
  "Heartwork preserves 75% organic participation",
  heartworkMetrics.some(
    (metric) =>
      metric.label
        .toLowerCase()
        .includes("organic participation") &&
      (
        metric.value === "75%" ||
        (
          metric.value === "75" &&
          metric.suffix === "%"
        )
      ),
  ),
);

/* Wider figures must not leak into Geek-specific outcome */

const heartworkOutcome =
  (heartwork.outcome ?? "")
    .toLowerCase();

check(
  "Heartwork outcome centers reactivation",
  heartworkOutcome.includes(
    "reactivat",
  ),
);

check(
  "Heartwork outcome preserves Smile continuity",
  heartworkOutcome.includes(
    "smile",
  ),
);

/* Economics / ROI guard */

const heartworkJson =
  JSON.stringify(
    heartworkPkg,
  ).toLowerCase();

check(
  "Heartwork does not claim ROI",
  !heartworkJson.includes('"roi"') &&
  !heartworkJson.includes("return on investment"),
);

check(
  "Heartwork does not present ₹1.44Cr as a return claim",
  !heartworkJson.includes("1.44cr roi") &&
  !heartworkJson.includes("1.44 cr roi") &&
  !heartworkJson.includes("₹1.44cr roi"),
);

/* CMS boundary */

const heartworkCms =
  sanitizeProjectForCms(
    heartworkPkg,
  );

const heartworkCmsJson =
  JSON.stringify(
    heartworkCms,
  );

check(
  "Heartwork CMS payload contains no evidence",
  !heartworkCmsJson.includes('"evidence"'),
);

check(
  "Heartwork CMS payload contains no claimId",
  !heartworkCmsJson.includes('"claimId"'),
);

check(
  "Heartwork CMS payload contains no quality metadata",
  !heartworkCmsJson.includes('"quality"'),
);


/* ── Benchmark #3 — Lay's #MyLaysRelationchip ───────────────────── */

const relationchipPath = path.resolve(
  "content",
  "case-study-agent-benchmarks",
  "mylaysrelationchip.json",
);

const relationchipRaw = JSON.parse(
  fs.readFileSync(
    relationchipPath,
    "utf8",
  ),
);

const relationchipPkg =
  validateCaseStudyPackage(
    relationchipRaw,
  );

const relationchipQuality =
  runQualityGate(
    relationchipPkg,
  );

const relationchip =
  relationchipPkg.project;

console.log(
  "\nBenchmark #3 — Lay's #MyLaysRelationchip\n",
);

/* Identity + quality */

check(
  "MyLaysRelationchip benchmark slug is stable",
  relationchip.slug === "mylaysrelationchip",
);

check(
  "MyLaysRelationchip remains Standard mode",
  relationchip.renderMode === "standard",
);

check(
  "MyLaysRelationchip remains PASS",
  relationchipQuality.status === "pass",
);

check(
  "MyLaysRelationchip remains draft-ready",
  relationchipQuality.draftReady === true,
);

check(
  "MyLaysRelationchip remains 100/100",
  relationchipQuality.score === 100,
);

/* Relationship graph */

check(
  "MyLaysRelationchip Company remains PepsiCo",
  relationchip.companySlug === "pepsico",
);

check(
  "MyLaysRelationchip Brand remains Lay's",
  relationchip.brandSlug === "lays",
);

check(
  "MyLaysRelationchip remains FMCG",
  relationchip.businessCategorySlugs?.includes(
    "fmcg",
  ) === true,
);

check(
  "MyLaysRelationchip remains Influencer Marketing",
  relationchip.serviceSlugs?.includes(
    "influencer-marketing",
  ) === true,
);

/* Positive IRM rule */

check(
  "MyLaysRelationchip has exactly one Solution relationship",
  relationchip.solutionSlugs?.length === 1,
);

check(
  "MyLaysRelationchip explicitly assigns canonical IRM",
  relationchip.solutionSlugs?.includes(
    "influencer-relationship-management",
  ) === true,
);

const irmRelationshipClaim =
  relationchipPkg.evidence.claims.find(
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
  "IRM relationship has an explicit evidence claim",
  Boolean(irmRelationshipClaim),
);

check(
  "IRM evidence claim is high-confidence",
  irmRelationshipClaim?.confidence === "high",
);

check(
  "IRM evidence claim is publishable",
  irmRelationshipClaim?.publishable === true,
);

/* Metric helpers */

const relationchipMetrics =
  relationchip.metrics ?? [];

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

/* IRM proof-point metric */

const inboundMetric =
  relationchipMetrics.find(
    (metric) =>
      metric.label
        .toLowerCase()
        .includes("inbound") &&
      metric.label
        .toLowerCase()
        .includes("creator"),
  );

check(
  "MyLaysRelationchip preserves inbound creator metric",
  Boolean(inboundMetric),
);

check(
  "MyLaysRelationchip preserves 500+ inbound creators",
  inboundMetric
    ? displayedMetricValue(inboundMetric).includes("500+")
    : false,
);

/* Estimated reach must stay estimated */

const estimatedReachMetric =
  relationchipMetrics.find(
    (metric) =>
      metric.label
        .toLowerCase()
        .includes("reach") &&
      displayedMetricValue(metric)
        .includes("28"),
  );

check(
  "MyLaysRelationchip preserves 28M+ creator reach",
  estimatedReachMetric
    ? displayedMetricValue(
        estimatedReachMetric,
      ).includes("28m+")
    : false,
);

check(
  "28M+ creator reach remains explicitly estimated",
  estimatedReachMetric
    ? `${estimatedReachMetric.label} ${estimatedReachMetric.note ?? ""}`
        .toLowerCase()
        .includes("estimated")
    : false,
);

/* Geek activation scope */

const relationchipMetricJson =
  JSON.stringify(
    relationchipMetrics,
  ).toLowerCase();

for (const figure of [
  "2,900",
  "2,700",
  "5,000",
]) {
  check(
    `MyLaysRelationchip preserves Geek activation figure ${figure}`,
    relationchipMetricJson.includes(
      figure.toLowerCase(),
    ),
  );
}

check(
  "MyLaysRelationchip preserves 93% participation",
  relationchipMetrics.some(
    (metric) =>
      metric.label
        .toLowerCase()
        .includes("participation") &&
      displayedMetricValue(metric)
        .includes("93%"),
  ),
);

/* Narrative outcome */

const relationchipOutcome =
  (relationchip.outcome ?? "")
    .toLowerCase();

check(
  "MyLaysRelationchip outcome centers accumulated creator community",
  relationchipOutcome.includes("creator") &&
  relationchipOutcome.includes("community"),
);

check(
  "MyLaysRelationchip outcome preserves inbound demand",
  relationchipOutcome.includes("inbound") &&
  relationchipOutcome.includes("500"),
);

/* Scope-conflict safety */

const publicProjectJson =
  JSON.stringify(
    relationchip,
  ).toLowerCase();

check(
  "public project does not merge in public 2M view snapshot",
  !publicProjectJson.includes('"2m"') &&
  !publicProjectJson.includes("2m views"),
);

check(
  "public project does not expose ₹5.57Cr creator-value estimate",
  !publicProjectJson.includes("5.57"),
);

check(
  "public project does not expose ₹5.3Cr value comparison",
  !publicProjectJson.includes("5.3cr") &&
  !publicProjectJson.includes("5.3 cr") &&
  !publicProjectJson.includes("₹5.3"),
);

check(
  "public project makes no ROI claim",
  !publicProjectJson.includes('"roi"') &&
  !publicProjectJson.includes("return on investment"),
);

/* CMS boundary */

const relationchipCms =
  sanitizeProjectForCms(
    relationchipPkg,
  );

const relationchipCmsJson =
  JSON.stringify(
    relationchipCms,
  );

check(
  "MyLaysRelationchip CMS payload contains no evidence",
  !relationchipCmsJson.includes('"evidence"'),
);

check(
  "MyLaysRelationchip CMS payload contains no claimId",
  !relationchipCmsJson.includes('"claimId"'),
);

check(
  "MyLaysRelationchip CMS payload contains no quality metadata",
  !relationchipCmsJson.includes('"quality"'),
);

/* ── Result ───────────────────────────────────────────────────────── */

console.log(
  `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
);

process.exit(
  fail === 0 ? 0 : 1,
);
