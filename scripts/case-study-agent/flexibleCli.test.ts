/**
 * GOLD STANDARD CASE STUDY AGENT
 * FLEXIBLE CLI SAFETY TESTS
 *
 * These tests invoke the CLI as a child process.
 *
 * They deliberately NEVER provide enough authorization
 * to initialize Payload or contact a database.
 */

import {
  spawnSync,
} from "node:child_process";

import path from "node:path";

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

  const tsxCliPath =
    path.resolve(
      "node_modules/tsx/dist/cli.mjs",
    );

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
          env as
            NodeJS.ProcessEnv,

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
        result.stdout ??
        ""
      }\n${
        result.stderr ??
        ""
      }`,
  };
}

function rejectedBeforePayload(
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
    "Gold Standard Case Study Agent — Flexible CLI safety tests\n",
  );

  /* 1. No mode */

  const noArgs =
    runCli(
      [],
    );

  check(
    "no command is refused",
    noArgs.status !==
      0,
  );

  check(
    "no command never initializes Payload",
    !noArgs.output.includes(
      "Initializing Payload",
    ),
  );

  /* 2. Unknown mode */

  const unknownMode =
    runCli([
      "publish",
    ]);

  check(
    "unknown mode is refused",
    unknownMode.output.includes(
      'Unknown mode "publish"',
    ),
  );

  check(
    "there is no publish execution path",
    rejectedBeforePayload(
      unknownMode,
    ),
  );

  /* 3. Generate unknown option */

  const generateUnknown =
    runCli([
      "generate",
      "request.json",
      "--publish",
    ]);

  check(
    "generate rejects unknown option",
    generateUnknown.output.includes(
      "Unknown generate option",
    ),
  );

  check(
    "generate option failure never initializes Payload",
    rejectedBeforePayload(
      generateUnknown,
    ),
  );

  /* 4. Generate missing request */

  const generateMissing =
    runCli([
      "generate",
    ]);

  check(
    "generate requires exactly one request",
    generateMissing.output.includes(
      "requires exactly one request JSON file",
    ),
  );

  check(
    "missing generate request never initializes Payload",
    rejectedBeforePayload(
      generateMissing,
    ),
  );

  /* 5. Write without --write-draft */

  const noWriteFlag =
    runCli([
      "write",
      "review.json",
      "--human-approved",
      "--approved-hash",
      "a".repeat(
        64,
      ),
    ]);

  check(
    "write requires explicit --write-draft",
    noWriteFlag.output.includes(
      "requires explicit --write-draft",
    ),
  );

  check(
    "missing write flag never initializes Payload",
    rejectedBeforePayload(
      noWriteFlag,
    ),
  );

  /* 6. Write without human approval */

  const noApproval =
    runCli([
      "write",
      "review.json",
      "--write-draft",
      "--approved-hash",
      "a".repeat(
        64,
      ),
    ]);

  check(
    "write requires explicit human approval",
    noApproval.output.includes(
      "requires explicit --human-approved",
    ),
  );

  check(
    "missing human approval never initializes Payload",
    rejectedBeforePayload(
      noApproval,
    ),
  );

  /* 7. Write without approved hash */

  const noHash =
    runCli([
      "write",
      "review.json",
      "--write-draft",
      "--human-approved",
    ]);

  check(
    "write requires exact approved hash",
    noHash.output.includes(
      "requires --approved-hash",
    ),
  );

  check(
    "missing approved hash never initializes Payload",
    rejectedBeforePayload(
      noHash,
    ),
  );

  /* 8. Malformed hash */

  const malformedHash =
    runCli([
      "write",
      "review.json",
      "--write-draft",
      "--human-approved",
      "--approved-hash",
      "not-a-sha256",
    ]);

  check(
    "malformed approved hash is refused",
    malformedHash.output.includes(
      "64-character lowercase SHA-256",
    ),
  );

  check(
    "malformed hash never initializes Payload",
    rejectedBeforePayload(
      malformedHash,
    ),
  );

  /* 9. Unknown write option */

  const unknownWrite =
    runCli([
      "write",
      "review.json",
      "--write-draft",
      "--human-approved",
      "--approved-hash",
      "a".repeat(
        64,
      ),
      "--publish",
    ]);

  check(
    "write rejects unknown publish option",
    unknownWrite.output.includes(
      "Unknown write option: --publish",
    ),
  );

  check(
    "unknown publish option never initializes Payload",
    rejectedBeforePayload(
      unknownWrite,
    ),
  );

  /* 10. Help remains non-mutating */

  const help =
    runCli([
      "--help",
    ]);

  check(
    "help exits successfully",
    help.status ===
      0,
  );

  check(
    "help explicitly states there is no publish command",
    help.output.includes(
      "There is intentionally NO publish command.",
    ),
  );

  check(
    "help never initializes Payload",
    !help.output.includes(
      "Initializing Payload",
    ),
  );

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
