/**
 * GOLD STANDARD CASE STUDY AGENT
 * FLEXIBLE OPERATOR CLI
 *
 * TWO STRICTLY SEPARATED MODES
 *
 * 1. GENERATE
 *
 *    request.json
 *      → Full Flexible Agent
 *      → Gold Standard candidate
 *      → deterministic benchmark
 *      → review-package.json
 *
 *    NO Payload.
 *    NO database.
 *    NO CMS mutation.
 *
 * 2. WRITE
 *
 *    reviewed review-package.json
 *      + explicit --human-approved
 *      + explicit --write-draft
 *      + exact --approved-hash
 *      → staging safety preflight
 *      → Payload DRAFT only
 *
 *    NO AI regeneration.
 *    NO publish mode.
 */

import fs from "node:fs";
import path from "node:path";

import type {
  BuildCaseStudyCandidateRequest,
} from "./caseStudyPipeline";

import {
  buildFlexibleReviewPackage,
  validateFlexibleReviewPackage,
} from "./flexibleReviewPackage";

/* ── CLI helpers ──────────────────────────────────── */

function usage(): void {
  console.log(`
Gold Standard Case Study Agent — Flexible Operator

GENERATE
  npx tsx scripts/case-study-agent/flexibleCli.ts generate <request.json>
  npx tsx scripts/case-study-agent/flexibleCli.ts generate <request.json> --out <review-package.json>

WRITE REVIEWED CANDIDATE TO STAGING DRAFT
  npx tsx scripts/case-study-agent/flexibleCli.ts write <review-package.json> --write-draft --human-approved --approved-hash <sha256>

Generate mode:
  - runs the full Flexible Case Study Agent
  - creates a review package
  - calculates the Flexible benchmark
  - prints the exact candidate SHA-256
  - NEVER initializes Payload
  - NEVER writes to a database

Write mode:
  - does NOT rerun AI
  - validates the review-package fingerprint
  - recomputes and validates the benchmark
  - requires the exact reviewed SHA-256
  - requires explicit human approval
  - verifies the configured staging database BEFORE Payload initializes
  - creates/updates Payload DRAFT only

There is intentionally NO publish command.
`);
}

function fail(
  message: string,
): never {
  console.error(
    `\nERROR: ${message}\n`,
  );

  process.exit(
    1,
  );
}

function readJsonFile(
  filePath: string,
): unknown {
  if (
    !fs.existsSync(
      filePath,
    )
  ) {
    fail(
      `File not found: ${filePath}`,
    );
  }

  const stat =
    fs.statSync(
      filePath,
    );

  if (
    !stat.isFile()
  ) {
    fail(
      `Path is not a file: ${filePath}`,
    );
  }

  let raw:
    string;

  try {
    raw =
      fs.readFileSync(
        filePath,
        "utf8",
      );
  } catch (
    error
  ) {
    fail(
      `Cannot read file: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }

  try {
    return JSON.parse(
      raw,
    );
  } catch (
    error
  ) {
    fail(
      `Invalid JSON in ${filePath}: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }
}

function isRecord(
  value: unknown,
): value is
  Record<
    string,
    unknown
  > {
  return (
    value !==
      null &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value,
    )
  );
}

function valueAfterFlag(
  args: string[],
  flag: string,
): string | undefined {
  const index =
    args.indexOf(
      flag,
    );

  if (
    index ===
    -1
  ) {
    return undefined;
  }

  const value =
    args[
      index + 1
    ];

  if (
    !value ||
    value.startsWith(
      "--",
    )
  ) {
    fail(
      `${flag} requires a value.`,
    );
  }

  return value;
}

/* ── GENERATE ─────────────────────────────────────── */

async function runGenerate(
  args: string[],
): Promise<void> {
  const allowedFlags =
    new Set([
      "--out",
    ]);

  for (
    let index = 0;
    index <
    args.length;
    index++
  ) {
    const arg =
      args[index];

    if (
      arg.startsWith(
        "--",
      )
    ) {
      if (
        !allowedFlags.has(
          arg,
        )
      ) {
        fail(
          `Unknown generate option: ${arg}`,
        );
      }

      if (
        arg ===
        "--out"
      ) {
        index++;
      }
    }
  }

  const outputArg =
    valueAfterFlag(
      args,
      "--out",
    );

  const positional =
    args.filter(
      (
        arg,
        index,
      ) => {
        if (
          arg.startsWith(
            "--",
          )
        ) {
          return false;
        }

        if (
          index >
            0 &&
          args[
            index - 1
          ] ===
            "--out"
        ) {
          return false;
        }

        return true;
      },
    );

  if (
    positional.length !==
    1
  ) {
    fail(
      "Generate mode requires exactly one request JSON file.",
    );
  }

  const inputPath =
    path.resolve(
      positional[0],
    );

  const rawRequest =
    readJsonFile(
      inputPath,
    );

  if (
    !isRecord(
      rawRequest,
    )
  ) {
    fail(
      "Case Study Agent request JSON must contain an object.",
    );
  }

  if (
    !process.env
      .OPENAI_API_KEY
  ) {
    fail(
      "OPENAI_API_KEY is required to generate a new Flexible case-study candidate.",
    );
  }

  const outputPath =
    outputArg
      ? path.resolve(
          outputArg,
        )
      : path.join(
          path.dirname(
            inputPath,
          ),
          `${
            path.parse(
              inputPath,
            ).name
          }.review.json`,
        );

  if (
    fs.existsSync(
      outputPath,
    )
  ) {
    fail(
      `Review package already exists: ${outputPath}. Refusing to overwrite a human-review artifact.`,
    );
  }

  const outputDirectory =
    path.dirname(
      outputPath,
    );

  if (
    !fs.existsSync(
      outputDirectory,
    )
  ) {
    fail(
      `Output directory does not exist: ${outputDirectory}`,
    );
  }

  console.log(
    "\nGold Standard Case Study Agent — Flexible",
  );

  console.log(
    "Mode: GENERATE / REVIEW ONLY",
  );

  console.log(
    `Request: ${path.relative(
      process.cwd(),
      inputPath,
    )}`,
  );

  console.log(
    "\nRunning full Case Study Agent…",
  );

  /**
   * Dynamic import keeps write-mode isolated from AI execution.
   */
  const {
    buildCaseStudyCandidate,
  } =
    await import(
      "./caseStudyPipeline"
    );

  const candidate =
    await buildCaseStudyCandidate(
      rawRequest as
        BuildCaseStudyCandidateRequest,
    );

  const reviewPackage =
    buildFlexibleReviewPackage(
      candidate,
    );

  /**
   * Exclusive create:
   * a review artifact is never silently overwritten.
   */
  fs.writeFileSync(
    outputPath,
    `${
      JSON.stringify(
        reviewPackage,
        null,
        2,
      )
    }\n`,
    {
      encoding:
        "utf8",

      flag:
        "wx",
    },
  );

  console.log(
    "\n✓ REVIEW PACKAGE CREATED",
  );

  console.log(
    `  File: ${path.relative(
      process.cwd(),
      outputPath,
    )}`,
  );

  console.log(
    `  Project: ${
      candidate
        .portfolio
        .projectHint
        .title ??
      "(untitled)"
    }`,
  );

  console.log(
    `  Slug: ${
      candidate
        .portfolio
        .projectHint
        .slug ??
      "(missing)"
    }`,
  );

  console.log(
    `  Quality: ${candidate.quality.score}/100`,
  );

  console.log(
    `  Semantic Critic: ${candidate.semanticCritic.score}/100`,
  );

  console.log(
    `  Reconciliation Audit: ${candidate.evidence.reconciliationAuditResult.score}/100`,
  );

  console.log(
    `  Flexible Benchmark: ${reviewPackage.benchmark.machineScore}/100`,
  );

  console.log(
    `  Benchmark machine pass: ${
      reviewPackage
        .benchmark
        .machinePassed
        ? "YES"
        : "NO — HUMAN REVIEW REQUIRED"
    }`,
  );

  console.log(
    "\nCANDIDATE SHA-256",
  );

  console.log(
    `  ${reviewPackage.candidateHash}`,
  );

  console.log(
    "\nHuman review is required before any CMS action.",
  );

  console.log(
    "Payload was NOT initialized. No database write was performed.",
  );
}

/* ── WRITE ────────────────────────────────────────── */

async function runWrite(
  args: string[],
): Promise<void> {
  const allowedFlags =
    new Set([
      "--write-draft",
      "--human-approved",
      "--approved-hash",
    ]);

  for (
    let index = 0;
    index <
    args.length;
    index++
  ) {
    const arg =
      args[index];

    if (
      arg.startsWith(
        "--",
      )
    ) {
      if (
        !allowedFlags.has(
          arg,
        )
      ) {
        fail(
          `Unknown write option: ${arg}`,
        );
      }

      if (
        arg ===
        "--approved-hash"
      ) {
        index++;
      }
    }
  }

  const writeDraft =
    args.includes(
      "--write-draft",
    );

  const humanApproved =
    args.includes(
      "--human-approved",
    );

  const approvedHash =
    valueAfterFlag(
      args,
      "--approved-hash",
    );

  const positional =
    args.filter(
      (
        arg,
        index,
      ) => {
        if (
          arg.startsWith(
            "--",
          )
        ) {
          return false;
        }

        if (
          index >
            0 &&
          args[
            index - 1
          ] ===
            "--approved-hash"
        ) {
          return false;
        }

        return true;
      },
    );

  if (
    positional.length !==
    1
  ) {
    fail(
      "Write mode requires exactly one review-package JSON file.",
    );
  }

  if (
    !writeDraft
  ) {
    fail(
      "Write mode requires explicit --write-draft.",
    );
  }

  if (
    !humanApproved
  ) {
    fail(
      "Write mode requires explicit --human-approved.",
    );
  }

  if (
    !approvedHash
  ) {
    fail(
      "Write mode requires --approved-hash <exact candidate SHA-256>.",
    );
  }

  if (
    !/^[a-f0-9]{64}$/.test(
      approvedHash,
    )
  ) {
    fail(
      "--approved-hash must be a 64-character lowercase SHA-256 digest.",
    );
  }

  const inputPath =
    path.resolve(
      positional[0],
    );

  const rawPackage =
    readJsonFile(
      inputPath,
    );

  /**
   * Recompute:
   * - exact candidate hash;
   * - deterministic benchmark.
   *
   * Any changed review artifact fails here.
   */
  const reviewPackage =
    validateFlexibleReviewPackage(
      rawPackage,
    );

  if (
    approvedHash !==
    reviewPackage
      .candidateHash
  ) {
    fail(
      "Approved hash does not match the exact candidate in the review package.",
    );
  }

  const authorization = {
    humanApproved:
      true,

    allowCmsDraftWrite:
      true,

    target:
      "staging",
  } as const;

  console.log(
    "\nGold Standard Case Study Agent — Flexible",
  );

  console.log(
    "Mode: EXPLICIT STAGING DRAFT WRITE",
  );

  console.log(
    `Review package: ${path.relative(
      process.cwd(),
      inputPath,
    )}`,
  );

  console.log(
    `Approved SHA-256: ${approvedHash}`,
  );

  console.log(
    `Benchmark: ${reviewPackage.benchmark.machineScore}/100`,
  );

  /**
   * Import ONLY the writer first.
   *
   * Its exported preflight verifies:
   * - human approval;
   * - explicit write opt-in;
   * - staging target;
   * - PAYLOAD_DB_PUSH safety;
   * - DATABASE_URL exists;
   * - approved staging marker exists;
   * - DATABASE_URL matches staging marker;
   * - Vercel production environment is refused.
   *
   * This happens BEFORE Payload or payload.config is imported.
   */
  const writerModule =
    await import(
      "./flexibleWriter"
    );

  writerModule
    .assertFlexibleDraftWriteAuthorization(
      authorization,
    );

  if (
    !process.env
      .PAYLOAD_SECRET
  ) {
    fail(
      "PAYLOAD_SECRET is required before initializing Payload for a staging draft write.",
    );
  }

  console.log(
    "\n✓ Staging database preflight passed.",
  );

  console.log(
    "Initializing Payload for DRAFT write only…",
  );

  /**
   * Payload and database adapter are initialized only after
   * every operator/package/staging preflight above has passed.
   */
  const [
    {
      getPayload,
    },
    configModule,
  ] =
    await Promise.all([
      import(
        "payload"
      ),

      import(
        "../../payload.config"
      ),
    ]);

  const payload =
    await getPayload({
      config:
        configModule.default,
    });

  /**
   * Writer independently repeats all critical gates again
   * at the actual mutation boundary.
   */
  const result =
    await writerModule
      .writeFlexibleCaseStudyDraft(
        payload,
        reviewPackage
          .candidate,
        authorization,
      );

  console.log(
    `\n✓ ${result.action.toUpperCase()} PAYLOAD DRAFT`,
  );

  console.log(
    `  ID: ${result.id}`,
  );

  console.log(
    `  Slug: ${result.slug}`,
  );

  console.log(
    `  Status: ${result.status}`,
  );

  console.log(
    `  Quality: ${result.qualityScore}/100`,
  );

  console.log(
    `  Semantic Critic: ${result.semanticCriticScore}/100`,
  );

  console.log(
    `  Reconciliation Audit: ${result.reconciliationAuditScore}/100`,
  );

  console.log(
    "\nNo AI was rerun during CMS write.",
  );

  console.log(
    "No publish action was performed.",
  );
}

/* ── Entry point ──────────────────────────────────── */

async function main():
  Promise<void> {
  const args =
    process.argv.slice(
      2,
    );

  if (
    args.length ===
      0 ||
    args.includes(
      "--help",
    ) ||
    args.includes(
      "-h",
    )
  ) {
    usage();

    process.exit(
      args.length ===
        0
        ? 1
        : 0,
    );
  }

  const mode =
    args[0];

  const modeArgs =
    args.slice(
      1,
    );

  if (
    mode ===
    "generate"
  ) {
    await runGenerate(
      modeArgs,
    );

    return;
  }

  if (
    mode ===
    "write"
  ) {
    await runWrite(
      modeArgs,
    );

    return;
  }

  fail(
    `Unknown mode "${mode}". Use "generate" or "write".`,
  );
}

main().catch(
  (
    error,
  ) => {
    console.error(
      "\nFlexible Case Study Agent failed:",
      error instanceof Error
        ? error.message
        : error,
    );

    process.exit(
      1,
    );
  },
);
