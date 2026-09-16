/**
 * GOLD STANDARD CASE STUDY AGENT
 * FLEXIBLE CLI REVIEW-PACKAGE INTEGRATION TESTS
 *
 * Uses a structurally valid 100/100 review package.
 *
 * Every scenario deliberately fails BEFORE Payload initialization.
 * No CMS or database connection is made.
 */

import {
  spawnSync,
} from "node:child_process";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  buildFlexibleReviewPackage,
} from "./flexibleReviewPackage";

import {
  buildCleanFlexibleCandidate,
} from "./flexibleTestFixtures";

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

type CliResult = {
  status:
    number | null;

  output:
    string;
};

function runCli(
  args: string[],
  envOverrides:
    Record<
      string,
      string | undefined
    > = {},
): CliResult {
  const cliPath =
    path.resolve(
      "scripts/case-study-agent/flexibleCli.ts",
    );

  const tsxCliPath =
    path.resolve(
      "node_modules/tsx/dist/cli.mjs",
    );

  const env = {
    ...process.env,
  } as
    Record<
      string,
      string | undefined
    >;

  for (
    const [
      key,
      value,
    ] of
    Object.entries(
      envOverrides,
    )
  ) {
    if (
      value ===
      undefined
    ) {
      delete env[key];
    } else {
      env[key] =
        value;
    }
  }

  const result =
    spawnSync(
      process.execPath,
      [
        tsxCliPath,
        cliPath,
        ...args,
      ],
      {
        cwd:
          process.cwd(),

        env:
          env as NodeJS.ProcessEnv,

        encoding:
          "utf8",

        timeout:
          30000,
      },
    );

  return {
    status:
      result.status,

    output:
      `${
        result.stdout ?? ""
      }\n${
        result.stderr ?? ""
      }`,
  };
}

function beforePayload(
  result:
    CliResult,
): boolean {
  return (
    result.status !==
      0 &&
    !result.output.includes(
      "Initializing Payload",
    )
  );
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible CLI review integration tests\n",
  );

  const tempDirectory =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "case-study-agent-",
      ),
    );

  try {
    const candidate =
      buildCleanFlexibleCandidate();

    const reviewPackage =
      buildFlexibleReviewPackage(
        candidate,
      );

    const reviewPath =
      path.join(
        tempDirectory,
        "valid-review.json",
      );

    fs.writeFileSync(
      reviewPath,
      `${
        JSON.stringify(
          reviewPackage,
          null,
          2,
        )
      }\n`,
      "utf8",
    );

    /* 1. Fixture itself is a real benchmark-clean review package */

    check(
      "integration fixture benchmarks at 100/100",
      reviewPackage
        .benchmark
        .machineScore ===
        100 &&
      reviewPackage
        .benchmark
        .machinePassed ===
        true,
    );

    check(
      "integration fixture has valid SHA-256 fingerprint",
      /^[a-f0-9]{64}$/.test(
        reviewPackage
          .candidateHash,
      ),
    );

    /* 2. Correct package but WRONG human-approved hash */

    const wrongHash =
      "a".repeat(
        64,
      ) ===
        reviewPackage
          .candidateHash
        ? "b".repeat(
            64,
          )
        : "a".repeat(
            64,
          );

    const wrongHashResult =
      runCli(
        [
          "write",
          reviewPath,
          "--write-draft",
          "--human-approved",
          "--approved-hash",
          wrongHash,
        ],
        {
          DATABASE_URL:
            "postgresql://test@case-study-staging.example/test",

          CASE_STUDY_AGENT_STAGING_DB_MARKER:
            "case-study-staging",

          PAYLOAD_SECRET:
            "test-only-secret",

          PAYLOAD_DB_PUSH:
            undefined,

          VERCEL_ENV:
            undefined,
        },
      );

    check(
      "valid review package with wrong approved hash is refused",
      wrongHashResult
        .output
        .includes(
          "Approved hash does not match the exact candidate",
        ),
    );

    check(
      "wrong approved hash fails before Payload initialization",
      beforePayload(
        wrongHashResult,
      ),
    );

    /* 3. Correct package + correct hash, but wrong database */

    const wrongDatabaseResult =
      runCli(
        [
          "write",
          reviewPath,
          "--write-draft",
          "--human-approved",
          "--approved-hash",
          reviewPackage
            .candidateHash,
        ],
        {
          DATABASE_URL:
            "postgresql://test@production.example/test",

          CASE_STUDY_AGENT_STAGING_DB_MARKER:
            "case-study-staging",

          PAYLOAD_SECRET:
            "test-only-secret",

          PAYLOAD_DB_PUSH:
            undefined,

          VERCEL_ENV:
            undefined,
        },
      );

    check(
      "valid approved package with wrong database is refused",
      wrongDatabaseResult
        .output
        .includes(
          "does not match the approved staging database marker",
        ),
    );

    check(
      "database mismatch fails before Payload initialization",
      beforePayload(
        wrongDatabaseResult,
      ),
    );

    /* 4. Correct package + hash, but missing staging marker */

    const missingMarkerResult =
      runCli(
        [
          "write",
          reviewPath,
          "--write-draft",
          "--human-approved",
          "--approved-hash",
          reviewPackage
            .candidateHash,
        ],
        {
          DATABASE_URL:
            "postgresql://test@case-study-staging.example/test",

          CASE_STUDY_AGENT_STAGING_DB_MARKER:
            undefined,

          PAYLOAD_SECRET:
            "test-only-secret",

          PAYLOAD_DB_PUSH:
            undefined,

          VERCEL_ENV:
            undefined,
        },
      );

    check(
      "valid approved package without staging marker is refused",
      missingMarkerResult
        .output
        .includes(
          "CASE_STUDY_AGENT_STAGING_DB_MARKER",
        ),
    );

    check(
      "missing staging marker fails before Payload initialization",
      beforePayload(
        missingMarkerResult,
      ),
    );

    /* 5. Correct package + hash, but production Vercel runtime */

    const productionResult =
      runCli(
        [
          "write",
          reviewPath,
          "--write-draft",
          "--human-approved",
          "--approved-hash",
          reviewPackage
            .candidateHash,
        ],
        {
          DATABASE_URL:
            "postgresql://test@case-study-staging.example/test",

          CASE_STUDY_AGENT_STAGING_DB_MARKER:
            "case-study-staging",

          PAYLOAD_SECRET:
            "test-only-secret",

          PAYLOAD_DB_PUSH:
            undefined,

          VERCEL_ENV:
            "production",
        },
      );

    check(
      "valid approved package is refused in Vercel production",
      productionResult
        .output
        .includes(
          "Vercel production environment",
        ),
    );

    check(
      "production runtime fails before Payload initialization",
      beforePayload(
        productionResult,
      ),
    );

    /* 6. Correct package + hash, but unsafe schema push */

    const pushResult =
      runCli(
        [
          "write",
          reviewPath,
          "--write-draft",
          "--human-approved",
          "--approved-hash",
          reviewPackage
            .candidateHash,
        ],
        {
          DATABASE_URL:
            "postgresql://test@case-study-staging.example/test",

          CASE_STUDY_AGENT_STAGING_DB_MARKER:
            "case-study-staging",

          PAYLOAD_SECRET:
            "test-only-secret",

          PAYLOAD_DB_PUSH:
            "true",

          VERCEL_ENV:
            undefined,
        },
      );

    check(
      "valid approved package with PAYLOAD_DB_PUSH=true is refused",
      pushResult
        .output
        .includes(
          "PAYLOAD_DB_PUSH=true",
        ),
    );

    check(
      "unsafe schema push fails before Payload initialization",
      beforePayload(
        pushResult,
      ),
    );
  } finally {
    fs.rmSync(
      tempDirectory,
      {
        recursive:
          true,

        force:
          true,
      },
    );
  }

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  process.exit(
    fail === 0
      ? 0
      : 1,
  );
}

main();
