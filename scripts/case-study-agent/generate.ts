/**
 * GOLD STANDARD CASE STUDY AGENT — GENERATION CLI
 *
 * Generates an evidence-grounded Case Study Agent package from a trusted
 * operator request file.
 *
 * NO Payload.
 * NO database.
 * NO publishing.
 *
 * Usage:
 *
 *   OPENAI_API_KEY=... \
 *   npx tsx scripts/case-study-agent/generate.ts \
 *     ./content/case-study-agent-input/example.json
 *
 * Optional:
 *
 *   --out ./content/case-study-agent-generated/example.json
 *
 * The generated package can later be inspected with:
 *
 *   npx tsx scripts/case-study-agent/cli.ts <generated-package.json>
 */

import {
  loadCaseStudyAgentMemory,
} from "./caseStudyAgentMemory";

import fs from "node:fs";
import path from "node:path";

import {
  generateCaseStudy,
} from "./generator";

import type {
  GenerateCaseStudyRequest,
} from "./generator";

/* ── CLI helpers ──────────────────────────────────────────────────── */

function usage() {
  console.log(`
Gold Standard Case Study Agent — Generate

Usage:
  npx tsx scripts/case-study-agent/generate.ts <request.json>
  npx tsx scripts/case-study-agent/generate.ts <request.json> --out <package.json>

Required environment:
  OPENAI_API_KEY

Optional environment:
  CASE_STUDY_AGENT_MODEL
`);
}

function fail(message: string): never {
  console.error(`\nERROR: ${message}\n`);
  process.exit(1);
}

function parseArgs(args: string[]) {
  if (
    args.length === 0 ||
    args.includes("--help") ||
    args.includes("-h")
  ) {
    usage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  let input: string | undefined;
  let output: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--out") {
      const next = args[i + 1];

      if (!next || next.startsWith("--")) {
        fail("--out requires a file path.");
      }

      output = next;
      i++;
      continue;
    }

    if (arg.startsWith("--")) {
      fail(`Unknown option: ${arg}`);
    }

    if (input) {
      fail(
        "Provide exactly one generation request JSON file.",
      );
    }

    input = arg;
  }

  if (!input) {
    fail(
      "Generation request JSON file is required.",
    );
  }

  return {
    input,
    output,
  };
}

/* ── Request loading ──────────────────────────────────────────────── */

function loadRequest(
  filePath: string,
): GenerateCaseStudyRequest {
  const absolute =
    path.resolve(filePath);

  if (!fs.existsSync(absolute)) {
    fail(
      `Generation request not found: ${absolute}`,
    );
  }

  const stat =
    fs.statSync(absolute);

  if (!stat.isFile()) {
    fail(
      `Generation request is not a file: ${absolute}`,
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(
      fs.readFileSync(
        absolute,
        "utf8",
      ),
    );
  } catch (error) {
    fail(
      `Invalid request JSON: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    fail(
      "Generation request root must be an object.",
    );
  }

  return parsed as GenerateCaseStudyRequest;
}

/* ── Output path ──────────────────────────────────────────────────── */

function defaultOutputPath(
  requestPath: string,
): string {
  const basename =
    path.basename(
      requestPath,
      path.extname(requestPath),
    );

  return path.resolve(
    "content",
    "case-study-agent-generated",
    `${basename}.generated.json`,
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */

async function main() {
  loadCaseStudyAgentMemory();

  const {
    input,
    output,
  } = parseArgs(
    process.argv.slice(2),
  );

  if (!process.env.OPENAI_API_KEY) {
    fail(
      "OPENAI_API_KEY is required for generation.",
    );
  }

  const inputPath =
    path.resolve(input);

  const outputPath =
    output
      ? path.resolve(output)
      : defaultOutputPath(inputPath);

  const request =
    loadRequest(inputPath);

  console.log(
    "\nGold Standard Case Study Agent — Generate\n",
  );

  console.log(
    `Input: ${path.relative(
      process.cwd(),
      inputPath,
    )}`,
  );

  console.log(
    `Model: ${
      request.model ??
      process.env.CASE_STUDY_AGENT_MODEL ??
      "gpt-5.6"
    }`,
  );

  console.log(
    `Sources: ${
      request.sources?.length ?? 0
    }`,
  );

  console.log(
    "\nGenerating evidence-grounded case study…",
  );

  const built =
    await generateCaseStudy(
      request,
    );

  fs.mkdirSync(
    path.dirname(outputPath),
    {
      recursive: true,
    },
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      built.package,
      null,
      2,
    ) + "\n",
    "utf8",
  );

  console.log(
    "\nGeneration complete.",
  );

  console.log(
    `Quality: ${built.quality.status.toUpperCase()} (${built.quality.score}/100)`,
  );

  console.log(
    `Draft-ready: ${
      built.quality.draftReady
        ? "YES"
        : "NO"
    }`,
  );

  if (
    built.quality.issues.length > 0
  ) {
    console.log(
      "\nQuality issues:",
    );

    for (
      const issue
      of built.quality.issues
    ) {
      console.log(
        `  [${issue.severity.toUpperCase()}] ${issue.code}: ${issue.message}`,
      );
    }
  }

  console.log(
    `\nGenerated package: ${path.relative(
      process.cwd(),
      outputPath,
    )}`,
  );

  console.log(
    "\nNo CMS connection was opened. Nothing was published or written to Payload.",
  );

  console.log(
    "\nInspect the generated package with:",
  );

  console.log(
    `  npx tsx scripts/case-study-agent/cli.ts ${JSON.stringify(
      path.relative(
        process.cwd(),
        outputPath,
      ),
    )}`,
  );

  process.exit(0);
}

main().catch((error) => {
  console.error(
    "\nGeneration failed:",
    error instanceof Error
      ? error.message
      : error,
  );

  process.exit(1);
});
