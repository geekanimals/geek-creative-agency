import fs from "node:fs";
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

function read(
  relativePath: string,
): string {
  return fs.readFileSync(
    path.resolve(
      process.cwd(),
      relativePath,
    ),
    "utf8",
  );
}

function countOccurrences(
  source: string,
  value: string,
): number {
  if (!value) {
    return 0;
  }

  return source
    .split(value)
    .length - 1;
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Preview Boundary regression tests\n",
  );

  const route =
    read(
      "app/(frontend)/api/preview/route.ts",
    );

  const page =
    read(
      "app/(frontend)/work/[slug]/page.tsx",
    );

  const projects =
    read(
      "lib/cms/projects.ts",
    );

  /* ── Secure preview entry ─────────────────────── */

  const secretCheck =
    route.indexOf(
      "if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET)",
    );

  const draftEnable =
    route.indexOf(
      "const dm = await draftMode();",
    );

  check(
    "preview route validates PREVIEW_SECRET",
    secretCheck >= 0,
  );

  check(
    "preview secret is validated before draft mode is enabled",
    secretCheck >= 0 &&
      draftEnable > secretCheck,
  );

  check(
    "invalid preview token returns 401",
    route.includes(
      'new Response("Invalid or missing preview token.", { status: 401 })',
    ),
  );

  check(
    "project preview redirects only through /work slug path",
    route.includes(
      'slug ? `/work/${encodeURIComponent(slug)}` : "/work"',
    ),
  );

  check(
    "preview route keeps same-origin path protection",
    route.includes(
      "url.origin !== origin",
    ) &&
      route.includes(
        'input[1] === "/" || input[1] === "\\\\"',
      ),
  );

  check(
    "preview route contains no CMS create mutation",
    !route.includes(
      "payload.create",
    ),
  );

  check(
    "preview route contains no CMS update mutation",
    !route.includes(
      "payload.update",
    ),
  );

  /* ── Page → exact draft lookup ────────────────── */

  check(
    "case-study page reads Next draftMode",
    countOccurrences(
      page,
      "await draftMode()",
    ) >= 2,
  );

  check(
    "metadata and page both require exact CMS draft during preview",
    countOccurrences(
      page,
      "getProjectBySlug(slug, { draft, requireCmsDraft: draft })",
    ) === 2,
  );

  check(
    "production page still blocks unpublished non-preview projects",
    page.includes(
      "(!published && IS_STRICT_PROD && !draft)",
    ),
  );

  check(
    "draft preview is visibly identified to human reviewer",
    page.includes(
      'draft ? "Preview',
    ) &&
      page.includes(
        "not public",
      ),
  );

  /* ── CMS lookup boundary ──────────────────────── */

  const functionStart =
    projects.indexOf(
      "export async function getProjectBySlug(",
    );

  const nextFunction =
    projects.indexOf(
      "/** All routable slugs",
      functionStart,
    );

  const lookup =
    functionStart >= 0 &&
    nextFunction > functionStart
      ? projects.slice(
          functionStart,
          nextFunction,
        )
      : "";

  check(
    "project lookup accepts requireCmsDraft safety option",
    lookup.includes(
      "requireCmsDraft?: boolean;",
    ),
  );

  check(
    "project lookup sends draft flag to Payload",
    lookup.includes(
      "draft,",
    ),
  );

  check(
    "Payload access override occurs only on draft lookup",
    lookup.includes(
      "overrideAccess: draft",
    ),
  );

  check(
    "published-only rule remains for normal lookup",
    lookup.includes(
      'doc && (draft || doc._status === "published")',
    ),
  );

  const failClosed =
    lookup.indexOf(
      "if (draft && requireCmsDraft)",
    );

  /**
   * There are two legitimate staticBySlug() calls:
   * 1. Flagship compatibility merge inside a valid CMS result.
   * 2. Final static fallback when no CMS project is returned.
   *
   * K6 must guard the SECOND one.
   */
  const staticFallback =
    lookup.lastIndexOf(
      "const s = staticBySlug(slug);",
    );

  check(
    "exact-draft preview fails closed before static fallback",
    failClosed >= 0 &&
      staticFallback > failClosed,
  );

  check(
    "normal lookup retains static fallback",
    staticFallback >= 0 &&
      lookup.includes(
        "return s ? fromStatic(s) : null;",
      ),
  );

  check(
    "project lookup contains no CMS mutation",
    !lookup.includes(
      "payload.create",
    ) &&
      !lookup.includes(
        "payload.update",
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
