import fs from "node:fs";
import path from "node:path";
import {
  createHash,
} from "node:crypto";
import {
  fileURLToPath,
} from "node:url";

/**
 * GOLD STANDARD CASE STUDY AGENT
 * Mandatory runtime memory loader.
 *
 * This module does not alter Agent reasoning.
 *
 * Its only responsibility is to fail closed unless the
 * mandatory operating contract can be loaded and validated
 * before a real Case Study Agent workflow proceeds.
 */

export const CASE_STUDY_AGENT_PRE_RUN_FILE =
  "CASE_STUDY_AGENT_PRE_RUN.md";

export const CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE =
  "GOLD_STANDARD_CASE_STUDY_AGENT_MEMORY.md";

export const CASE_STUDY_AGENT_MEMORY_VERSION =
  "1.0";

export const CASE_STUDY_AGENT_MEMORY_STATUS =
  "CANONICAL / MANDATORY";

const PRE_RUN_REQUIRED_MARKERS = [
  "# Case Study Agent \u2014 Mandatory Memory Loader",
  "## Required before every case-study run",
  "Read `GOLD_STANDARD_CASE_STUDY_AGENT_MEMORY.md` in full.",
  "Do not continue if the file cannot be loaded.",
  "Never infer a Solution merely from a Service.",
  "Never auto-publish.",
] as const;

const CANONICAL_REQUIRED_MARKERS = [
  "# Gold Standard Case Study Agent \u2014 Canonical Memory & Workflow",
  "**Status:** CANONICAL / MANDATORY",
  "**Version:** 1.0",
  "> **MANDATORY PRE-RUN RULE**",
  "# 21. Mandatory Pre-Run Contract",
  "# 22. Mandatory Run Gates",
  "# 23. Fail-Closed Rules",
  "SEO copy must obey the same evidence rules as visible case-study copy.",
  "The Agent must never manufacture a stronger story than the evidence supports.",
] as const;

export type CaseStudyAgentMemoryFile = Readonly<{
  path: string;
  bytes: number;
  sha256: string;
  content: string;
}>;

export type CaseStudyAgentMemoryContract = Readonly<{
  status:
    typeof CASE_STUDY_AGENT_MEMORY_STATUS;

  version:
    typeof CASE_STUDY_AGENT_MEMORY_VERSION;

  preRun:
    CaseStudyAgentMemoryFile;

  canonical:
    CaseStudyAgentMemoryFile;
}>;

export type CaseStudyAgentMemoryLoadOptions = {
  /**
   * Test support only.
   *
   * Production callers should not provide this value.
   * The default is the directory containing this module.
   */
  baseDirectory?: string;
};

function defaultBaseDirectory(): string {
  return path.dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );
}

function hashBytes(
  value: Buffer,
): string {
  return createHash(
    "sha256",
  )
    .update(
      value,
    )
    .digest(
      "hex",
    );
}

function readMandatoryUtf8File(
  filePath: string,
  label: string,
): CaseStudyAgentMemoryFile {
  if (
    !fs.existsSync(
      filePath,
    )
  ) {
    throw new Error(
      `Case Study Agent memory gate failed: mandatory ${label} file is missing: ${filePath}`,
    );
  }

  const stat =
    fs.statSync(
      filePath,
    );

  if (
    !stat.isFile()
  ) {
    throw new Error(
      `Case Study Agent memory gate failed: mandatory ${label} path is not a file: ${filePath}`,
    );
  }

  let bytes:
    Buffer;

  try {
    bytes =
      fs.readFileSync(
        filePath,
      );
  } catch (
    error
  ) {
    throw new Error(
      `Case Study Agent memory gate failed: cannot read mandatory ${label} file: ${
        error instanceof Error
          ? error.message
          : String(
              error,
            )
      }`,
    );
  }

  if (
    bytes.length ===
    0
  ) {
    throw new Error(
      `Case Study Agent memory gate failed: mandatory ${label} file is empty.`,
    );
  }

  const content =
    bytes.toString(
      "utf8",
    );

  /**
   * Node replaces malformed UTF-8 with U+FFFD.
   * Treat that as corruption and fail closed.
   */
  if (
    content.includes(
      "\uFFFD",
    )
  ) {
    throw new Error(
      `Case Study Agent memory gate failed: mandatory ${label} file contains invalid UTF-8.`,
    );
  }

  return Object.freeze({
    path:
      filePath,

    bytes:
      bytes.length,

    sha256:
      hashBytes(
        bytes,
      ),

    content,
  });
}

function assertMarkers(
  content: string,
  markers:
    readonly string[],
  label: string,
): void {
  for (
    const marker of
    markers
  ) {
    if (
      !content.includes(
        marker,
      )
    ) {
      throw new Error(
        `Case Study Agent memory gate failed: mandatory ${label} contract marker is missing: ${JSON.stringify(
          marker,
        )}`,
      );
    }
  }
}

function assertCanonicalMetadata(
  content: string,
): void {
  const status =
    content.match(
      /^\*\*Status:\*\*\s*(.+)$/m,
    )?.[1]
      ?.trim();

  if (
    status !==
    CASE_STUDY_AGENT_MEMORY_STATUS
  ) {
    throw new Error(
      `Case Study Agent memory gate failed: canonical memory status must be "${CASE_STUDY_AGENT_MEMORY_STATUS}".`,
    );
  }

  const version =
    content.match(
      /^\*\*Version:\*\*\s*(.+)$/m,
    )?.[1]
      ?.trim();

  if (
    version !==
    CASE_STUDY_AGENT_MEMORY_VERSION
  ) {
    throw new Error(
      `Case Study Agent memory gate failed: canonical memory version must be "${CASE_STUDY_AGENT_MEMORY_VERSION}".`,
    );
  }
}

/**
 * Load and validate BOTH mandatory Case Study Agent memory files.
 *
 * Reading is deliberately synchronous so the contract gate completes
 * before any downstream Agent work is allowed to start.
 */
export function loadCaseStudyAgentMemory(
  options:
    CaseStudyAgentMemoryLoadOptions =
      {},
): CaseStudyAgentMemoryContract {
  const baseDirectory =
    options.baseDirectory
      ? path.resolve(
          options.baseDirectory,
        )
      : defaultBaseDirectory();

  const preRun =
    readMandatoryUtf8File(
      path.join(
        baseDirectory,
        CASE_STUDY_AGENT_PRE_RUN_FILE,
      ),
      "pre-run memory",
    );

  const canonical =
    readMandatoryUtf8File(
      path.join(
        baseDirectory,
        CASE_STUDY_AGENT_CANONICAL_MEMORY_FILE,
      ),
      "canonical memory",
    );

  assertMarkers(
    preRun.content,
    PRE_RUN_REQUIRED_MARKERS,
    "pre-run memory",
  );

  assertMarkers(
    canonical.content,
    CANONICAL_REQUIRED_MARKERS,
    "canonical memory",
  );

  assertCanonicalMetadata(
    canonical.content,
  );

  return Object.freeze({
    status:
      CASE_STUDY_AGENT_MEMORY_STATUS,

    version:
      CASE_STUDY_AGENT_MEMORY_VERSION,

    preRun,

    canonical,
  });
}
