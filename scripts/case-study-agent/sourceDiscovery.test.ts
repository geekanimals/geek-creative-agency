/**
 * GOLD STANDARD CASE STUDY AGENT — SOURCE DISCOVERY TESTS
 *
 * No AI.
 * No network.
 * No CMS.
 * No database.
 *
 * Proves:
 * - explicit workspace-bound discovery;
 * - safe text ingestion;
 * - binary document discovery without parsing;
 * - unsupported/oversized/binary-looking files are blocked;
 * - symlinks are not followed;
 * - workspace escape is rejected;
 * - duplicate roots cannot duplicate candidates;
 * - discovery never auto-approves evidence;
 * - deterministic IDs / hashes / ordering;
 * - safety limits and input immutability.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

import {
  discoverLocalSources,
} from "./sourceDiscovery";

import type {
  DiscoverLocalSourcesRequest,
} from "./sourceDiscovery";

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

function rejectedWith(
  request: DiscoverLocalSourcesRequest,
  expected: string,
): boolean {
  try {
    discoverLocalSources(
      request,
    );

    return false;
  } catch (error) {
    return (
      error instanceof Error &&
      error.message.includes(
        expected,
      )
    );
  }
}

function sha256(
  value: string,
): string {
  return crypto
    .createHash(
      "sha256",
    )
    .update(
      Buffer.from(
        value,
        "utf8",
      ),
    )
    .digest(
      "hex",
    );
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Source Discovery tests\n",
  );

  const sandbox =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "case-study-discovery-",
      ),
    );

  const workspace =
    path.join(
      sandbox,
      "workspace",
    );

  const campaign =
    path.join(
      workspace,
      "campaign",
    );

  const nested =
    path.join(
      campaign,
      "nested",
    );

  const ignored =
    path.join(
      campaign,
      "node_modules",
    );

  const outside =
    path.join(
      sandbox,
      "outside",
    );

  fs.mkdirSync(
    nested,
    {
      recursive: true,
    },
  );

  fs.mkdirSync(
    ignored,
    {
      recursive: true,
    },
  );

  fs.mkdirSync(
    outside,
    {
      recursive: true,
    },
  );

  const readmeContent =
    "Campaign activated 500 creators.";

  fs.writeFileSync(
    path.join(
      campaign,
      "campaign-notes.md",
    ),
    readmeContent,
  );

  fs.writeFileSync(
    path.join(
      campaign,
      "metrics.csv",
    ),
    "metric,value\ncreators,500",
  );

  fs.writeFileSync(
    path.join(
      nested,
      "interview.txt",
    ),
    "Stakeholder interview notes.",
  );

  /*
   * Fake binary documents are sufficient for Discovery.
   * This phase deliberately does NOT parse their contents.
   */
  fs.writeFileSync(
    path.join(
      campaign,
      "campaign-report.pdf",
    ),
    "%PDF-test-fixture",
  );

  fs.writeFileSync(
    path.join(
      campaign,
      "campaign-brief.docx",
    ),
    "DOCX-test-fixture",
  );

  fs.writeFileSync(
    path.join(
      campaign,
      "unsupported.exe",
    ),
    "unsupported",
  );

  fs.writeFileSync(
    path.join(
      campaign,
      "large.txt",
    ),
    "x".repeat(
      256,
    ),
  );

  fs.writeFileSync(
    path.join(
      campaign,
      "binary-disguised.txt",
    ),
    Buffer.from([
      65,
      66,
      0,
      67,
    ]),
  );

  fs.writeFileSync(
    path.join(
      ignored,
      "must-not-discover.md",
    ),
    "Ignored dependency content.",
  );

  fs.writeFileSync(
    path.join(
      outside,
      "outside-secret.md",
    ),
    "Outside workspace material.",
  );

  /*
   * A directory junction avoids ordinary Windows file
   * symlink privilege requirements. On non-Windows,
   * a normal directory symlink is used.
   */
  const linkPath =
    path.join(
      campaign,
      "outside-link",
    );

  fs.symlinkSync(
    outside,
    linkPath,
    process.platform ===
      "win32"
      ? "junction"
      : "dir",
  );

  try {
    const request:
      DiscoverLocalSourcesRequest =
    {
      workspaceRoot:
        workspace,

      roots: [
        "campaign",
      ],

      maxFiles:
        50,

      maxTextBytes:
        64,
    };

    const before =
      JSON.stringify(
        request,
      );

    const result =
      discoverLocalSources(
        request,
      );

    check(
      "valid local discovery succeeds",
      Boolean(
        result,
      ),
    );

    check(
      "expected supported candidates are discovered",
      result.candidates.length ===
        5,
    );

    const notes =
      result.candidates.find(
        (candidate) =>
          candidate.reference ===
          "campaign/campaign-notes.md",
      );

    check(
      "safe text source is marked text-ready",
      notes?.contentState ===
        "text-ready",
    );

    check(
      "safe text content is preserved exactly",
      notes?.content ===
        readmeContent,
    );

    check(
      "CSV source is directly readable",
      result.candidates.some(
        (candidate) =>
          candidate.reference ===
            "campaign/metrics.csv" &&
          candidate.contentState ===
            "text-ready",
      ),
    );

    check(
      "nested supported source is discovered",
      result.candidates.some(
        (candidate) =>
          candidate.reference ===
          "campaign/nested/interview.txt",
      ),
    );

    const pdf =
      result.candidates.find(
        (candidate) =>
          candidate.reference ===
          "campaign/campaign-report.pdf",
      );

    check(
      "PDF is discovered but requires extraction",
      pdf?.contentState ===
        "requires-extraction" &&
      pdf.content ===
        undefined,
    );

    const docx =
      result.candidates.find(
        (candidate) =>
          candidate.reference ===
          "campaign/campaign-brief.docx",
      );

    check(
      "DOCX is discovered but requires extraction",
      docx?.contentState ===
        "requires-extraction" &&
      docx.content ===
        undefined,
    );

    check(
      "unsupported extension is excluded with audit reason",
      result.skipped.some(
        (entry) =>
          entry.reference ===
            "campaign/unsupported.exe" &&
          entry.reason ===
            "unsupported-extension",
      ),
    );

    check(
      "oversized text is excluded before ingestion",
      result.skipped.some(
        (entry) =>
          entry.reference ===
            "campaign/large.txt" &&
          entry.reason ===
            "text-size-limit",
      ),
    );

    check(
      "binary-looking file disguised as text is blocked",
      result.skipped.some(
        (entry) =>
          entry.reference ===
            "campaign/binary-disguised.txt" &&
          entry.reason ===
            "binary-looking-text",
      ),
    );

    const completeJson =
      JSON.stringify(
        result,
      );

    check(
      "ignored dependency directory is never discovered",
      !completeJson.includes(
        "must-not-discover",
      ),
    );

    check(
      "symlink is recorded but never followed",
      result.skipped.some(
        (entry) =>
          entry.reference ===
            "campaign/outside-link" &&
          entry.reason ===
            "symlink",
      ),
    );

    check(
      "symlink cannot expose outside-workspace content",
      !completeJson.includes(
        "outside-secret",
      ) &&
      !completeJson.includes(
        "Outside workspace material.",
      ),
    );

    check(
      "every discovered candidate explicitly requires review",
      result.candidates.every(
        (candidate) =>
          candidate.reviewRequired ===
          true,
      ),
    );

    check(
      "Discovery never auto-approves evidence",
      !completeJson.includes(
        "approved-for-extraction",
      ) &&
      !completeJson.includes(
        '"status"',
      ),
    );

    check(
      "Discovery does not invent EvidenceSource classification",
      !completeJson.includes(
        '"kind":"internal-document"',
      ) &&
      !completeJson.includes(
        '"kind":"official-brand"',
      ),
    );

    check(
      "text candidate SHA-256 is deterministic",
      notes?.sha256 ===
        sha256(
          readmeContent,
        ),
    );

    const second =
      discoverLocalSources(
        request,
      );

    const secondNotes =
      second.candidates.find(
        (candidate) =>
          candidate.reference ===
          "campaign/campaign-notes.md",
      );

    check(
      "discovery ID is stable across identical scans",
      Boolean(
        notes?.discoveryId &&
        notes.discoveryId ===
          secondNotes?.discoveryId,
      ),
    );

    check(
      "candidate ordering is deterministic",
      JSON.stringify(
        result.candidates.map(
          (candidate) =>
            candidate.reference,
        ),
      ) ===
        JSON.stringify(
          [
            ...result.candidates,
          ]
            .map(
              (candidate) =>
                candidate.reference,
            )
            .sort(
              (
                left,
                right,
              ) =>
                left.localeCompare(
                  right,
                ),
            ),
        ),
    );

    const duplicateRoots =
      discoverLocalSources({
        workspaceRoot:
          workspace,

        roots: [
          "campaign",
          "campaign",
        ],

        maxFiles:
          100,

        maxTextBytes:
          64,
      });

    check(
      "duplicate scan roots cannot duplicate discovery candidates",
      new Set(
        duplicateRoots
          .candidates
          .map(
            (candidate) =>
              candidate.reference,
          ),
      ).size ===
        duplicateRoots
          .candidates
          .length,
    );

    const directFile =
      discoverLocalSources({
        workspaceRoot:
          workspace,

        roots: [
          "campaign/campaign-notes.md",
        ],
      });

    check(
      "explicit individual file can be discovered",
      directFile.candidates.length ===
        1 &&
      directFile.candidates[0]
        ?.reference ===
        "campaign/campaign-notes.md",
    );

    /* ── Workspace boundary attacks ─────────────── */

    check(
      "parent-directory traversal is rejected",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [
            "../outside",
          ],
        },
        "escapes workspace",
      ),
    );

    check(
      "absolute scan root is rejected",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [
            outside,
          ],
        },
        "must be relative",
      ),
    );

    check(
      "missing scan root is rejected",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [
            "does-not-exist",
          ],
        },
        "root does not exist",
      ),
    );

    check(
      "empty root list is rejected",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [],
        },
        "at least one explicit scan root",
      ),
    );

    check(
      "nonexistent workspace is rejected",
      rejectedWith(
        {
          workspaceRoot:
            path.join(
              sandbox,
              "missing-workspace",
            ),

          roots: [
            "campaign",
          ],
        },
        "workspace does not exist",
      ),
    );

    const workspaceFile =
      path.join(
        sandbox,
        "workspace-file.txt",
      );

    fs.writeFileSync(
      workspaceFile,
      "not a directory",
    );

    check(
      "workspaceRoot must be a directory",
      rejectedWith(
        {
          workspaceRoot:
            workspaceFile,

          roots: [
            ".",
          ],
        },
        "workspaceRoot must be a directory",
      ),
    );

    /* ── Scan safety limits ─────────────────────── */

    check(
      "maxFiles must be positive",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [
            "campaign",
          ],

          maxFiles:
            0,
        },
        "maxFiles must be a positive integer",
      ),
    );

    check(
      "maxTextBytes must be positive",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [
            "campaign",
          ],

          maxTextBytes:
            0,
        },
        "maxTextBytes must be a positive integer",
      ),
    );

    check(
      "maxFiles cannot exceed hard safety ceiling",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [
            "campaign",
          ],

          maxFiles:
            5001,
        },
        "maxFiles cannot exceed 5000",
      ),
    );

    check(
      "scan fails closed when maxFiles is exceeded",
      rejectedWith(
        {
          workspaceRoot:
            workspace,

          roots: [
            "campaign",
          ],

          maxFiles:
            1,

          maxTextBytes:
            64,
        },
        "exceeded maxFiles=1",
      ),
    );

    /* ── Discovery metadata ─────────────────────── */

    check(
      "repository-relative references use portable separators",
      result.candidates.every(
        (candidate) =>
          !candidate.reference.includes(
            "\\",
          ),
      ),
    );

    check(
      "discovery IDs are safe deterministic lower-kebab IDs",
      result.candidates.every(
        (candidate) =>
          /^discovery-[a-z0-9]+(?:-[a-z0-9]+)*-[a-f0-9]{12}$/.test(
            candidate.discoveryId,
          ),
      ),
    );

    check(
      "Source Discovery does not mutate request",
      JSON.stringify(
        request,
      ) ===
        before,
    );
  } finally {
    fs.rmSync(
      sandbox,
      {
        recursive: true,
        force: true,
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
