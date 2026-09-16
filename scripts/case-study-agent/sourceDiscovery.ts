/**
 * GOLD STANDARD CASE STUDY AGENT — SOURCE DISCOVERY
 *
 * Explicit local repository locations
 *   → deterministic scan
 *   → discovery candidates
 *   → HUMAN / OPERATOR REVIEW
 *   → Trusted Source Manifest
 *
 * SECURITY / TRUST BOUNDARY:
 *
 * Discovery is NOT evidence approval.
 *
 * A discovered file:
 * - is NOT trusted evidence;
 * - is NOT approved for extraction;
 * - is NOT publication-ready;
 * - cannot enter the Evidence Pipeline directly.
 *
 * This module performs NO:
 * - AI calls;
 * - network access;
 * - URL fetching;
 * - Drive access;
 * - Payload / CMS access;
 * - database access;
 * - publishing.
 *
 * Symlinks are never followed.
 * Scan roots must remain inside the explicit workspace root.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/* ── Supported formats ─────────────────────────────── */

/**
 * These formats can be safely read directly as UTF-8 text.
 */
export const DISCOVERY_TEXT_EXTENSIONS = [
  ".txt",
  ".md",
  ".markdown",
  ".csv",
  ".tsv",
  ".json",
  ".html",
  ".htm",
] as const;

/**
 * These formats may be useful campaign sources, but this
 * module does NOT attempt to parse them.
 *
 * They remain discovery candidates requiring a later,
 * explicit extraction step.
 */
export const DISCOVERY_DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
] as const;

const IGNORED_DIRECTORY_NAMES =
  new Set([
    ".git",
    ".next",
    ".vercel",
    "node_modules",
  ]);

const SAFE_LIMIT_MAX_FILES =
  5000;

const DEFAULT_MAX_FILES =
  500;

const DEFAULT_MAX_TEXT_BYTES =
  1024 * 1024;

/* ── Types ─────────────────────────────────────────── */

export type DiscoveryContentState =
  | "text-ready"
  | "requires-extraction";

export type SourceDiscoveryCandidate = {
  /**
   * Deterministic discovery-only identifier.
   *
   * This is NOT automatically an EvidenceSource ID.
   */
  discoveryId:
    string;

  title:
    string;

  /**
   * Repository-relative path only.
   */
  reference:
    string;

  extension:
    string;

  sizeBytes:
    number;

  sha256:
    string;

  contentState:
    DiscoveryContentState;

  /**
   * Present only for directly readable text formats.
   *
   * Presence here does NOT approve the content for
   * evidence extraction.
   */
  content?:
    string;

  /**
   * Explicit reminder that discovery itself never
   * approves material.
   */
  reviewRequired:
    true;
};

export type SourceDiscoverySkipReason =
  | "unsupported-extension"
  | "text-size-limit"
  | "binary-looking-text"
  | "symlink";

export type SourceDiscoverySkippedEntry = {
  reference:
    string;

  reason:
    SourceDiscoverySkipReason;
};

export type DiscoverLocalSourcesRequest = {
  /**
   * Absolute workspace boundary.
   */
  workspaceRoot:
    string;

  /**
   * Explicit relative files/directories to scan.
   *
   * Examples:
   * [
   *   "campaign-material",
   *   "research/lays"
   * ]
   *
   * Absolute paths and ../ traversal are forbidden.
   */
  roots:
    string[];

  /**
   * Hard protection against unexpectedly large scans.
   */
  maxFiles?:
    number;

  /**
   * Maximum size for direct UTF-8 text ingestion.
   *
   * Larger text files are discovered but not read.
   */
  maxTextBytes?:
    number;
};

export type SourceDiscoveryResult = {
  candidates:
    SourceDiscoveryCandidate[];

  skipped:
    SourceDiscoverySkippedEntry[];

  scannedFileCount:
    number;
};

/* ── Helpers ───────────────────────────────────────── */

function normalizeReference(
  value: string,
): string {
  return value
    .split(
      path.sep,
    )
    .join("/");
}

function isWithinWorkspace(
  workspaceRoot: string,
  candidatePath: string,
): boolean {
  const relative =
    path.relative(
      workspaceRoot,
      candidatePath,
    );

  return (
    relative === "" ||
    (
      !relative.startsWith(
        `..${path.sep}`,
      ) &&
      relative !== ".." &&
      !path.isAbsolute(
        relative,
      )
    )
  );
}

function assertRelativeScanRoot(
  value: unknown,
): asserts value is string {
  if (
    typeof value !==
      "string" ||
    !value.trim()
  ) {
    throw new Error(
      "Source Discovery root must be a non-empty relative path.",
    );
  }

  const trimmed =
    value.trim();

  if (
    path.isAbsolute(
      trimmed,
    )
  ) {
    throw new Error(
      `Source Discovery root must be relative: ${trimmed}`,
    );
  }

  const normalized =
    path.normalize(
      trimmed,
    );

  if (
    normalized ===
      ".." ||
    normalized.startsWith(
      `..${path.sep}`,
    )
  ) {
    throw new Error(
      `Source Discovery root escapes workspace: ${trimmed}`,
    );
  }
}

function validatePositiveInteger(
  value: number,
  context: string,
) {
  if (
    !Number.isInteger(
      value,
    ) ||
    value <= 0
  ) {
    throw new Error(
      `${context} must be a positive integer.`,
    );
  }
}

function sha256(
  buffer: Buffer,
): string {
  return crypto
    .createHash(
      "sha256",
    )
    .update(
      buffer,
    )
    .digest(
      "hex",
    );
}

function discoveryIdForReference(
  reference: string,
): string {
  const digest =
    crypto
      .createHash(
        "sha256",
      )
      .update(
        reference,
      )
      .digest(
        "hex",
      )
      .slice(
        0,
        12,
      );

  const basename =
    path
      .basename(
        reference,
        path.extname(
          reference,
        ),
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      )
      .slice(
        0,
        48,
      ) ||
    "source";

  return `discovery-${basename}-${digest}`;
}

function isTextExtension(
  extension: string,
): boolean {
  return (
    DISCOVERY_TEXT_EXTENSIONS as readonly string[]
  ).includes(
    extension,
  );
}

function isDocumentExtension(
  extension: string,
): boolean {
  return (
    DISCOVERY_DOCUMENT_EXTENSIONS as readonly string[]
  ).includes(
    extension,
  );
}

function looksBinary(
  buffer: Buffer,
): boolean {
  /**
   * NUL bytes are a conservative signal that a file
   * carrying a text extension is actually binary.
   */
  return buffer.includes(
    0,
  );
}

/* ── Discovery engine ──────────────────────────────── */

export function discoverLocalSources(
  request:
    DiscoverLocalSourcesRequest,
): SourceDiscoveryResult {
  if (
    typeof request.workspaceRoot !==
      "string" ||
    !request.workspaceRoot.trim()
  ) {
    throw new Error(
      "Source Discovery requires workspaceRoot.",
    );
  }

  const workspaceRoot =
    path.resolve(
      request.workspaceRoot,
    );

  if (
    !fs.existsSync(
      workspaceRoot,
    )
  ) {
    throw new Error(
      `Source Discovery workspace does not exist: ${workspaceRoot}`,
    );
  }

  const workspaceStat =
    fs.lstatSync(
      workspaceRoot,
    );

  if (
    !workspaceStat.isDirectory()
  ) {
    throw new Error(
      "Source Discovery workspaceRoot must be a directory.",
    );
  }

  if (
    !Array.isArray(
      request.roots,
    ) ||
    request.roots.length ===
      0
  ) {
    throw new Error(
      "Source Discovery requires at least one explicit scan root.",
    );
  }

  const maxFiles =
    request.maxFiles ??
    DEFAULT_MAX_FILES;

  validatePositiveInteger(
    maxFiles,
    "Source Discovery maxFiles",
  );

  if (
    maxFiles >
    SAFE_LIMIT_MAX_FILES
  ) {
    throw new Error(
      `Source Discovery maxFiles cannot exceed ${SAFE_LIMIT_MAX_FILES}.`,
    );
  }

  const maxTextBytes =
    request.maxTextBytes ??
    DEFAULT_MAX_TEXT_BYTES;

  validatePositiveInteger(
    maxTextBytes,
    "Source Discovery maxTextBytes",
  );

  const candidates:
    SourceDiscoveryCandidate[] =
    [];

  const skipped:
    SourceDiscoverySkippedEntry[] =
    [];

  const discoveredReferences =
    new Set<string>();

  let scannedFileCount =
    0;

  function scan(
    absolutePath: string,
  ) {
    if (
      !isWithinWorkspace(
        workspaceRoot,
        absolutePath,
      )
    ) {
      throw new Error(
        "Source Discovery attempted to leave workspace boundary.",
      );
    }

    const stat =
      fs.lstatSync(
        absolutePath,
      );

    const reference =
      normalizeReference(
        path.relative(
          workspaceRoot,
          absolutePath,
        ),
      );

    if (
      stat.isSymbolicLink()
    ) {
      skipped.push({
        reference,
        reason:
          "symlink",
      });

      return;
    }

    if (
      stat.isDirectory()
    ) {
      const directoryName =
        path.basename(
          absolutePath,
        );

      if (
        IGNORED_DIRECTORY_NAMES.has(
          directoryName,
        )
      ) {
        return;
      }

      const children =
        fs
          .readdirSync(
            absolutePath,
          )
          .sort(
            (
              left,
              right,
            ) =>
              left.localeCompare(
                right,
              ),
          );

      for (
        const child
        of children
      ) {
        scan(
          path.join(
            absolutePath,
            child,
          ),
        );
      }

      return;
    }

    if (
      !stat.isFile()
    ) {
      return;
    }

    scannedFileCount++;

    if (
      scannedFileCount >
      maxFiles
    ) {
      throw new Error(
        `Source Discovery exceeded maxFiles=${maxFiles}.`,
      );
    }

    if (
      discoveredReferences.has(
        reference,
      )
    ) {
      return;
    }

    discoveredReferences.add(
      reference,
    );

    const extension =
      path
        .extname(
          absolutePath,
        )
        .toLowerCase();

    if (
      !isTextExtension(
        extension,
      ) &&
      !isDocumentExtension(
        extension,
      )
    ) {
      skipped.push({
        reference,
        reason:
          "unsupported-extension",
      });

      return;
    }

    const buffer =
      fs.readFileSync(
        absolutePath,
      );

    const baseCandidate = {
      discoveryId:
        discoveryIdForReference(
          reference,
        ),

      title:
        path.basename(
          absolutePath,
        ),

      reference,

      extension,

      sizeBytes:
        buffer.byteLength,

      sha256:
        sha256(
          buffer,
        ),

      reviewRequired:
        true as const,
    };

    if (
      isDocumentExtension(
        extension,
      )
    ) {
      candidates.push({
        ...baseCandidate,

        contentState:
          "requires-extraction",
      });

      return;
    }

    if (
      buffer.byteLength >
      maxTextBytes
    ) {
      skipped.push({
        reference,
        reason:
          "text-size-limit",
      });

      return;
    }

    if (
      looksBinary(
        buffer,
      )
    ) {
      skipped.push({
        reference,
        reason:
          "binary-looking-text",
      });

      return;
    }

    candidates.push({
      ...baseCandidate,

      contentState:
        "text-ready",

      content:
        buffer.toString(
          "utf8",
        ),
    });
  }

  const resolvedRoots =
    request.roots
      .map(
        (root) => {
          assertRelativeScanRoot(
            root,
          );

          const absolute =
            path.resolve(
              workspaceRoot,
              root.trim(),
            );

          if (
            !isWithinWorkspace(
              workspaceRoot,
              absolute,
            )
          ) {
            throw new Error(
              `Source Discovery root escapes workspace: ${root}`,
            );
          }

          if (
            !fs.existsSync(
              absolute,
            )
          ) {
            throw new Error(
              `Source Discovery root does not exist: ${root}`,
            );
          }

          return absolute;
        },
      )
      .sort(
        (
          left,
          right,
        ) =>
          left.localeCompare(
            right,
          ),
      );

  for (
    const root
    of resolvedRoots
  ) {
    scan(
      root,
    );
  }

  candidates.sort(
    (
      left,
      right,
    ) =>
      left.reference.localeCompare(
        right.reference,
      ),
  );

  skipped.sort(
    (
      left,
      right,
    ) =>
      left.reference.localeCompare(
        right.reference,
      ),
  );

  return {
    candidates,
    skipped,
    scannedFileCount,
  };
}
