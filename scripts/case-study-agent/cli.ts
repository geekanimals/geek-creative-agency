/**
 * GOLD STANDARD CASE STUDY AGENT — OPERATOR CLI
 *
 * SAFE DEFAULT:
 *   npx tsx scripts/case-study-agent/cli.ts ./path/to/case-study.json
 *
 * The command above performs:
 *   JSON parse
 *   → runtime validation
 *   → quality gate
 *   → CMS sanitization preview
 *
 * It DOES NOT connect to Payload or write to a database.
 *
 * Explicit Draft write:
 *   npx tsx scripts/case-study-agent/cli.ts ./path/to/case-study.json --write-draft
 *
 * There is intentionally no publish option.
 */

import {
  loadCaseStudyAgentMemory,
} from "./caseStudyAgentMemory";

import fs from "node:fs";
import path from "node:path";

import {
  relationshipSlugs,
  sanitizeProjectForCms,
} from "./cmsPayload";

import { runQualityGate } from "./qualityGate";

import {
  PackageValidationError,
  validateCaseStudyPackage,
} from "./validatePackage";

function usage() {
  console.log(`
Gold Standard Case Study Agent

Usage:
  npx tsx scripts/case-study-agent/cli.ts <package.json>
  npx tsx scripts/case-study-agent/cli.ts <package.json> --write-draft

Modes:
  default         Validate + quality-check + dry-run preview only
  --write-draft   Create/update a Payload DRAFT after all gates pass

There is no publish mode.
`);
}

function fail(message: string): never {
  console.error(`\nERROR: ${message}\n`);
  process.exit(1);
}

function qualityIcon(
  severity: "error" | "warning" | "info",
): string {
  if (severity === "error") return "✗";
  if (severity === "warning") return "!";
  return "·";
}

async function main() {
  loadCaseStudyAgentMemory();

  const args = process.argv.slice(2);

  if (
    args.length === 0 ||
    args.includes("--help") ||
    args.includes("-h")
  ) {
    usage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const unknownFlags = args.filter(
    (arg) =>
      arg.startsWith("--") &&
      arg !== "--write-draft",
  );

  if (unknownFlags.length > 0) {
    fail(
      `Unknown option(s): ${unknownFlags.join(", ")}`,
    );
  }

  const writeDraft = args.includes("--write-draft");

  const fileArgs = args.filter(
    (arg) => !arg.startsWith("--"),
  );

  if (fileArgs.length !== 1) {
    fail(
      "Provide exactly one Case Study Agent JSON package.",
    );
  }

  const inputPath = path.resolve(fileArgs[0]);

  if (!fs.existsSync(inputPath)) {
    fail(`Package file not found: ${inputPath}`);
  }

  const stat = fs.statSync(inputPath);

  if (!stat.isFile()) {
    fail(`Package path is not a file: ${inputPath}`);
  }

  console.log(
    "\nGold Standard Case Study Agent\n",
  );

  console.log(
    `Mode: ${writeDraft ? "DRAFT WRITE" : "DRY RUN"}`,
  );

  console.log(
    `Package: ${path.relative(process.cwd(), inputPath)}`,
  );

  /* ── 1. JSON parse ──────────────────────────────────────────────── */

  let raw: unknown;

  try {
    raw = JSON.parse(
      fs.readFileSync(inputPath, "utf8"),
    );
  } catch (error) {
    fail(
      `Invalid JSON: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  console.log("✓ JSON parsed");

  /* ── 2. Runtime schema validation ───────────────────────────────── */

  let pkg;

  try {
    pkg = validateCaseStudyPackage(raw);
  } catch (error) {
    if (error instanceof PackageValidationError) {
      console.error(
        "\nRuntime validation failed:",
      );

      for (const issue of error.issues) {
        console.error(`  ✗ ${issue}`);
      }

      process.exit(1);
    }

    throw error;
  }

  console.log("✓ Runtime package validation passed");

  /* ── 3. Gold Standard quality gate ─────────────────────────────── */

  const quality = runQualityGate(pkg);

  console.log(
    `\nQuality: ${quality.status.toUpperCase()} (${quality.score}/100)`,
  );

  if (quality.issues.length === 0) {
    console.log("  ✓ No quality issues");
  } else {
    for (const issue of quality.issues) {
      console.log(
        `  ${qualityIcon(issue.severity)} ` +
          `[${issue.severity.toUpperCase()}] ` +
          `${issue.code}: ${issue.message}`,
      );
    }
  }

  /* ── 4. Publication-safe preview ───────────────────────────────── */

  const cms = sanitizeProjectForCms(pkg);
  const relationships = relationshipSlugs(pkg);

  console.log("\nCase Study:");
  console.log(`  Title: ${cms.title}`);
  console.log(`  Slug: ${cms.slug}`);
  console.log(`  Render: ${cms.renderMode}`);
  console.log(`  Kind: ${cms.projectKind}`);

  console.log("\nRelationships:");
  console.log(
    `  Company: ${relationships.companySlug ?? "—"}`,
  );
  console.log(
    `  Brand: ${relationships.brandSlug ?? "—"}`,
  );
  console.log(
    `  Industries: ${
      relationships.businessCategorySlugs.join(", ") || "—"
    }`,
  );
  console.log(
    `  Services: ${
      relationships.serviceSlugs.join(", ") || "—"
    }`,
  );
  console.log(
    `  Solutions: ${
      relationships.solutionSlugs.join(", ") || "—"
    }`,
  );

  console.log(
    `\nMetrics cleared by evidence gate: ${
      cms.metrics?.length ?? 0
    }`,
  );

  console.log(
    `Evidence sources retained outside CMS: ${
      pkg.evidence.sources.length
    }`,
  );

  console.log(
    `Evidence claims retained outside CMS: ${
      pkg.evidence.claims.length
    }`,
  );

  /* ── 5. Fail closed before any DB initialization ───────────────── */

  if (!quality.draftReady) {
    console.log(
      "\n✗ NOT DRAFT-READY — no CMS write permitted.",
    );

    process.exit(1);
  }

  console.log(
    "\n✓ Gold Standard gate says this package is DRAFT-READY.",
  );

  /* ── 6. Dry run ends here ───────────────────────────────────────── */

  if (!writeDraft) {
    console.log(
      "\nDRY RUN COMPLETE — no database connection was opened and nothing was written.",
    );

    console.log(
      "\nTo explicitly create/update a Payload Draft:",
    );

    console.log(
      `  npx tsx scripts/case-study-agent/cli.ts ${JSON.stringify(
        fileArgs[0],
      )} --write-draft`,
    );

    process.exit(0);
  }

  /* ── 7. Explicit Draft write only ───────────────────────────────── */

  if (!process.env.DATABASE_URL) {
    fail(
      "DATABASE_URL is required for --write-draft.",
    );
  }

  if (!process.env.PAYLOAD_SECRET) {
    fail(
      "PAYLOAD_SECRET is required for --write-draft.",
    );
  }

  console.log(
    "\nInitializing Payload for explicit DRAFT write…",
  );

  /**
   * Dynamic imports are intentional.
   * Dry-run mode never initializes Payload or the DB adapter.
   */
  const [{ getPayload }, configModule, writerModule] =
    await Promise.all([
      import("payload"),
      import("../../payload.config"),
      import("./writer"),
    ]);

  const payload = await getPayload({
    config: configModule.default,
  });

  const result =
    await writerModule.writeCaseStudyDraft(
      payload,
      pkg,
    );

  console.log(
    `\n✓ ${result.action.toUpperCase()} Payload Draft`,
  );

  console.log(`  ID: ${result.id}`);
  console.log(`  Slug: ${result.slug}`);
  console.log(`  Status: ${result.status}`);
  console.log(
    `  Quality score: ${result.qualityScore}/100`,
  );

  console.log(
    "\nNo publish action was performed.",
  );

  process.exit(0);
}

main().catch((error) => {
  console.error(
    "\nCase Study Agent failed:",
    error instanceof Error
      ? error.message
      : error,
  );

  process.exit(1);
});
