import {
  dirname,
  join,
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

function runStep(
  title,
  command,
  args,
) {
  console.log(
    "\n============================================================",
  );

  console.log(
    title,
  );

  console.log(
    "============================================================",
  );

  const result =
    spawnSync(
      command,
      args,
      {
        cwd:
          repoRoot,

        stdio:
          "inherit",

        windowsHide:
          true,
      },
    );

  if (
    result.error
  ) {
    console.error(
      `\nVerification runner error: ${result.error.message}`,
    );

    process.exit(1);
  }

  if (
    result.status !==
    0
  ) {
    console.error(
      `\n❌ ${title} FAILED`,
    );

    process.exit(
      result.status ??
      1,
    );
  }

  console.log(
    `\n✅ ${title} PASSED`,
  );
}

/**
 * 1. Complete Agent regression.
 */
runStep(
  "AGENT REGRESSION",
  process.execPath,
  [
    join(
      currentDir,
      "run-regression.mjs",
    ),
  ],
);

/**
 * 2. TypeScript verification using the repository-pinned
 * TypeScript compiler, never a dynamically resolved npx tool.
 */
runStep(
  "TYPESCRIPT",
  process.execPath,
  [
    require.resolve(
      "typescript/bin/tsc",
    ),
    "--noEmit",
  ],
);

/**
 * 3. Whitespace/error-marker verification over Agent code plus
 * the two website/CMS integration files historically touched by K6.
 */
runStep(
  "GIT DIFF CHECK",
  "git",
  [
    "diff",
    "--check",
    "--",
    "scripts/case-study-agent",
    ":(literal)app/(frontend)/work/[slug]/page.tsx",
    "lib/cms/projects.ts",
  ],
);

console.log(
  "\n============================================================",
);

console.log(
  "CASE STUDY AGENT — ENGINEERING VERIFICATION",
);

console.log(
  "============================================================",
);

console.log(
  "Regression:  PASS",
);

console.log(
  "TypeScript:  PASS",
);

console.log(
  "Diff check:  PASS",
);

console.log(
  "\n✅ CASE STUDY AGENT ENGINEERING GATE PASSED",
);