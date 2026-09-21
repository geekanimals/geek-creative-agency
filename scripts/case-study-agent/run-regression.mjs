import {
  readdirSync,
} from "node:fs";

import {
  dirname,
  join,
  relative,
  resolve,
} from "node:path";

import {
  fileURLToPath,
} from "node:url";

import {
  createRequire,
} from "node:module";

import {
  spawnSync,
} from "node:child_process";

const require =
  createRequire(import.meta.url);

const currentDir =
  dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );

const repoRoot =
  resolve(
    currentDir,
    "..",
    "..",
  );

const agentDir =
  join(
    repoRoot,
    "scripts",
    "case-study-agent",
  );

/**
 * Use the repository-pinned tsx executable.
 * Never depend on npx downloading/resolving a runtime dynamically.
 */
const tsxCli =
  require.resolve(
    "tsx/cli",
  );

const tests =
  readdirSync(
    agentDir,
    {
      withFileTypes:
        true,
    },
  )
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(
          ".test.ts",
        ),
    )
    .map(
      (entry) =>
        join(
          agentDir,
          entry.name,
        ),
    )
    .sort(
      (a, b) =>
        a.localeCompare(b),
    );

if (
  tests.length <
  33
) {
  console.error(
    `Expected at least 33 Agent test files, found ${tests.length}.`,
  );

  process.exit(1);
}

let passedFiles =
  0;

let passedAssertions =
  0;

let failedAssertions =
  0;

const uncountedFiles =
  [];

for (
  const testFile
  of tests
) {
  const displayPath =
    relative(
      repoRoot,
      testFile,
    );

  console.log(
    "\n============================================================",
  );

  console.log(
    `RUNNING: ${displayPath}`,
  );

  console.log(
    "============================================================",
  );

  const result =
    spawnSync(
      process.execPath,
      [
        tsxCli,
        testFile,
      ],
      {
        cwd:
          repoRoot,

        encoding:
          "utf8",

        windowsHide:
          true,
      },
    );

  if (
    result.stdout
  ) {
    process.stdout.write(
      result.stdout,
    );
  }

  if (
    result.stderr
  ) {
    process.stderr.write(
      result.stderr,
    );
  }

  if (
    result.error
  ) {
    console.error(
      `\nREGRESSION RUNNER ERROR: ${result.error.message}`,
    );

    process.exit(1);
  }

  if (
    result.status !==
    0
  ) {
    console.error(
      `\n❌ REGRESSION STOPPED`,
    );

    console.error(
      `FAILED TEST: ${displayPath}`,
    );

    process.exit(
      result.status ??
      1,
    );
  }

  passedFiles++;

  const combinedOutput =
    [
      result.stdout ?? "",
      result.stderr ?? "",
    ].join("\n");

  const match =
    combinedOutput.match(
      /(?:PASS|FAIL)\s*[—-]\s*(\d+)\s+passed,\s*(\d+)\s+failed/i,
    );

  if (
    !match
  ) {
    uncountedFiles.push(
      displayPath,
    );

    continue;
  }

  passedAssertions +=
    Number(
      match[1],
    );

  failedAssertions +=
    Number(
      match[2],
    );
}

console.log(
  "\n============================================================",
);

console.log(
  "CASE STUDY AGENT — FINAL REGRESSION",
);

console.log(
  "============================================================",
);

console.log(
  `TEST FILES PASSED: ${passedFiles} / ${tests.length}`,
);

console.log(
  `COUNTED ASSERTIONS PASSED: ${passedAssertions}`,
);

console.log(
  `COUNTED ASSERTIONS FAILED: ${failedAssertions}`,
);

console.log(
  `UNCOUNTED TEST FILES: ${uncountedFiles.length}`,
);

if (
  uncountedFiles.length >
  0
) {
  console.log(
    "\nUncounted files:",
  );

  for (
    const file
    of uncountedFiles
  ) {
    console.log(
      ` - ${file}`,
    );
  }
}

if (
  passedFiles !==
    tests.length ||
  failedAssertions !==
    0 ||
  uncountedFiles.length !==
    0
) {
  console.error(
    "\n❌ FULL CASE STUDY AGENT REGRESSION FAILED",
  );

  process.exit(1);
}

console.log(
  "\n✅ FULL CASE STUDY AGENT REGRESSION PASSED",
);