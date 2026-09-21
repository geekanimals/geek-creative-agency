import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE,
  CASE_STUDY_AGENT_MEMORY_STATUS,
  CASE_STUDY_AGENT_MEMORY_VERSION,
  CASE_STUDY_AGENT_PRE_RUN_FILE,
  loadCaseStudyAgentMemory,
} from "./caseStudyAgentMemory";

let pass =
  0;

let fail =
  0;

function check(
  name: string,
  condition: boolean,
): void {
  if (
    condition
  ) {
    console.log(
      `  [PASS] ${name}`,
    );

    pass++;
  } else {
    console.log(
      `  [FAIL] ${name}`,
    );

    fail++;
  }
}

function expectThrow(
  name: string,
  fn: () => unknown,
  contains: string,
): void {
  try {
    fn();

    console.log(
      `  [FAIL] ${name} - expected rejection`,
    );

    fail++;
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : String(
            error,
          );

    if (
      message.includes(
        contains,
      )
    ) {
      console.log(
        `  [PASS] ${name}`,
      );

      pass++;
    } else {
      console.log(
        `  [FAIL] ${name} - unexpected error: ${message}`,
      );

      fail++;
    }
  }
}

function copyRealMemoryFiles(
  targetDirectory: string,
): void {
  const real =
    loadCaseStudyAgentMemory();

  fs.copyFileSync(
    real.preRun.path,
    path.join(
      targetDirectory,
      CASE_STUDY_AGENT_PRE_RUN_FILE,
    ),
  );

  fs.copyFileSync(
    real.canonical.path,
    path.join(
      targetDirectory,
      CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE,
    ),
  );
}

function main(): void {
  console.log(
    "Gold Standard Case Study Agent - Runtime Memory tests\n",
  );

  const loaded =
    loadCaseStudyAgentMemory();

  check(
    "real mandatory memory loads",
    loaded.status ===
      CASE_STUDY_AGENT_MEMORY_STATUS &&
    loaded.version ===
      CASE_STUDY_AGENT_MEMORY_VERSION,
  );

  check(
    "pre-run memory was read in full",
    loaded.preRun.content.includes(
      "Preserve human control over the final publish decision.",
    ),
  );

  check(
    "canonical memory was read in full",
    loaded.canonical.content.includes(
      "# 26. Non-Negotiable Final Principle",
    ),
  );

  check(
    "memory fingerprints are SHA-256",
    /^[a-f0-9]{64}$/.test(
      loaded.preRun.sha256,
    ) &&
    /^[a-f0-9]{64}$/.test(
      loaded.canonical.sha256,
    ),
  );

  check(
    "runtime memory contract is frozen",
    Object.isFrozen(
      loaded,
    ) &&
    Object.isFrozen(
      loaded.preRun,
    ) &&
    Object.isFrozen(
      loaded.canonical,
    ),
  );

  check(
    "memory files contain valid UTF-8",
    !loaded.preRun.content.includes(
      "\uFFFD",
    ) &&
    !loaded.canonical.content.includes(
      "\uFFFD",
    ),
  );

  const tempRoot =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "case-study-agent-memory-",
      ),
    );

  try {
    const missingDirectory =
      path.join(
        tempRoot,
        "missing",
      );

    fs.mkdirSync(
      missingDirectory,
    );

    fs.copyFileSync(
      loaded.canonical.path,
      path.join(
        missingDirectory,
        CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE,
      ),
    );

    expectThrow(
      "missing pre-run memory fails closed",
      () =>
        loadCaseStudyAgentMemory({
          baseDirectory:
            missingDirectory,
        }),
      "mandatory pre-run memory file is missing",
    );

    const wrongVersionDirectory =
      path.join(
        tempRoot,
        "wrong-version",
      );

    fs.mkdirSync(
      wrongVersionDirectory,
    );

    copyRealMemoryFiles(
      wrongVersionDirectory,
    );

    const wrongVersionPath =
      path.join(
        wrongVersionDirectory,
        CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE,
      );

    const wrongVersion =
      fs.readFileSync(
        wrongVersionPath,
        "utf8",
      )
        .replace(
          "**Version:** 1.0",
          "**Version:** 9.9",
        );

    fs.writeFileSync(
      wrongVersionPath,
      wrongVersion,
      "utf8",
    );

    expectThrow(
      "wrong canonical version fails closed",
      () =>
        loadCaseStudyAgentMemory({
          baseDirectory:
            wrongVersionDirectory,
        }),
      'canonical memory contract marker is missing: "**Version:** 1.0"',
    );

    const missingMarkerDirectory =
      path.join(
        tempRoot,
        "missing-marker",
      );

    fs.mkdirSync(
      missingMarkerDirectory,
    );

    copyRealMemoryFiles(
      missingMarkerDirectory,
    );

    const missingMarkerPath =
      path.join(
        missingMarkerDirectory,
        CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE,
      );

    const missingMarker =
      fs.readFileSync(
        missingMarkerPath,
        "utf8",
      )
        .replace(
          "# 22. Mandatory Run Gates",
          "# 22. Altered Run Gates",
        );

    fs.writeFileSync(
      missingMarkerPath,
      missingMarker,
      "utf8",
    );

    expectThrow(
      "missing mandatory section fails closed",
      () =>
        loadCaseStudyAgentMemory({
          baseDirectory:
            missingMarkerDirectory,
        }),
      "mandatory canonical memory contract marker is missing",
    );

    const invalidUtf8Directory =
      path.join(
        tempRoot,
        "invalid-utf8",
      );

    fs.mkdirSync(
      invalidUtf8Directory,
    );

    copyRealMemoryFiles(
      invalidUtf8Directory,
    );

    const invalidUtf8Path =
      path.join(
        invalidUtf8Directory,
        CASE_STUDY_AGENT_PRE_RUN_FILE,
      );

    const validBytes =
      fs.readFileSync(
        invalidUtf8Path,
      );

    fs.writeFileSync(
      invalidUtf8Path,
      Buffer.concat([
        validBytes,
        Buffer.from([
          0xc3,
          0x28,
        ]),
      ]),
    );

    expectThrow(
      "invalid UTF-8 fails closed",
      () =>
        loadCaseStudyAgentMemory({
          baseDirectory:
            invalidUtf8Directory,
        }),
      "contains invalid UTF-8",
    );

    const emptyDirectory =
      path.join(
        tempRoot,
        "empty",
      );

    fs.mkdirSync(
      emptyDirectory,
    );

    fs.writeFileSync(
      path.join(
        emptyDirectory,
        CASE_STUDY_AGENT_PRE_RUN_FILE,
      ),
      "",
      "utf8",
    );

    fs.copyFileSync(
      loaded.canonical.path,
      path.join(
        emptyDirectory,
        CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE,
      ),
    );

    expectThrow(
      "empty mandatory memory fails closed",
      () =>
        loadCaseStudyAgentMemory({
          baseDirectory:
            emptyDirectory,
        }),
      "mandatory pre-run memory file is empty",
    );

    const loadedAgain =
      loadCaseStudyAgentMemory();

    check(
      "memory fingerprints are deterministic",
      loadedAgain.preRun.sha256 ===
        loaded.preRun.sha256 &&
      loadedAgain.canonical.sha256 ===
        loaded.canonical.sha256,
    );
  } finally {
    fs.rmSync(
      tempRoot,
      {
        recursive:
          true,

        force:
          true,
      },
    );
  }

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} - ${pass} passed, ${fail} failed`,
  );

  if (
    fail >
    0
  ) {
    process.exitCode =
      1;
  }
}

main();
