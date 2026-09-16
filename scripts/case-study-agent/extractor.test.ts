/**
 * GOLD STANDARD CASE STUDY AGENT — EVIDENCE EXTRACTOR TESTS
 *
 * No real OpenAI call.
 * No network.
 * No Payload.
 * No database.
 *
 * Proves:
 * - source IDs are operator-controlled;
 * - support excerpts must be exact verbatim substrings;
 * - dangling / invented sources fail closed;
 * - confidence and publishable cannot be model-generated here;
 * - conflicting facts may survive as separate candidates;
 * - zero defensible claims is allowed.
 */

import {
  extractEvidence,
} from "./extractor";

import type {
  ExtractEvidenceRequest,
} from "./extractor";

function fakeClient(
  outputText: string | undefined,
) {
  return {
    responses: {
      create: async () => ({
        output_text:
          outputText,
      }),
    },
  } as never;
}

function clone<T>(
  value: T,
): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
}

let pass = 0;
let fail = 0;

function check(
  name: string,
  condition: boolean,
) {
  if (condition) {
    console.log(
      `  ✓ ${name}`,
    );
    pass++;
  } else {
    console.log(
      `  ✗ ${name}`,
    );
    fail++;
  }
}

async function expectReject(
  name: string,
  request: ExtractEvidenceRequest,
  output: unknown,
  expectedMessage: string,
) {
  let rejected = false;

  try {
    await extractEvidence(
      request,
      {
        client:
          fakeClient(
            JSON.stringify(
              output,
            ),
          ),
      },
    );
  } catch (error) {
    rejected =
      error instanceof Error &&
      error.message.includes(
        expectedMessage,
      );
  }

  check(
    name,
    rejected,
  );
}

const REQUEST: ExtractEvidenceRequest = {
  sources: [
    {
      id:
        "geek-report",

      kind:
        "internal-document",

      title:
        "Geek campaign report",

      content:
        [
          "Geek tracked 1,058 creators activated.",
          "The activation recorded 4.76M tracked reach.",
          "The report described approximately ₹158L estimated creator media value.",
          "This comparison was not audited ROI.",
          "Heartwork reused creators acquired through Smile Deke Dekho.",
        ].join("\n"),
    },

    {
      id:
        "media-report",

      kind:
        "independent-editorial",

      title:
        "Independent campaign coverage",

      publisher:
        "Example Trade Publication",

      content:
        [
          "The wider campaign generated 8M+ organic reach.",
          "More than 4,300 posts and Stories were reported across the wider campaign.",
          "The wider campaign involved partner-brand amplification.",
        ].join("\n"),
    },

    {
      id:
        "older-report",

      kind:
        "campaign-archive",

      title:
        "Older campaign archive",

      content:
        "An earlier archive recorded 1,020 creators activated.",
    },
  ],

  model:
    "fake-model",
};

const VALID_OUTPUT = {
  claims: [
    {
      id:
        "metric-geek-creators",

      type:
        "metric",

      statement:
        "Geek tracked 1,058 creators activated.",

      sourceIds: [
        "geek-report",
      ],

      support: [
        {
          sourceId:
            "geek-report",

          excerpt:
            "Geek tracked 1,058 creators activated.",
        },
      ],
    },

    {
      id:
        "metric-wider-reach",

      type:
        "metric",

      statement:
        "The wider campaign generated 8M+ organic reach.",

      sourceIds: [
        "media-report",
      ],

      support: [
        {
          sourceId:
            "media-report",

          excerpt:
            "The wider campaign generated 8M+ organic reach.",
        },
      ],
    },

    {
      id:
        "fact-not-roi",

      type:
        "fact",

      statement:
        "The creator media value comparison was not audited ROI.",

      sourceIds: [
        "geek-report",
      ],

      support: [
        {
          sourceId:
            "geek-report",

          excerpt:
            "The report described approximately ₹158L estimated creator media value.",
        },

        {
          sourceId:
            "geek-report",

          excerpt:
            "This comparison was not audited ROI.",
        },
      ],
    },

    {
      id:
        "relationship-smile-heartwork",

      type:
        "relationship",

      statement:
        "Heartwork reused creators acquired through Smile Deke Dekho.",

      sourceIds: [
        "geek-report",
      ],

      support: [
        {
          sourceId:
            "geek-report",

          excerpt:
            "Heartwork reused creators acquired through Smile Deke Dekho.",
        },
      ],
    },

    /**
     * Deliberately conflicting with metric-geek-creators.
     *
     * Extraction is allowed to preserve both.
     * Reconciliation happens later.
     */
    {
      id:
        "metric-older-creators",

      type:
        "metric",

      statement:
        "An earlier archive recorded 1,020 creators activated.",

      sourceIds: [
        "older-report",
      ],

      support: [
        {
          sourceId:
            "older-report",

          excerpt:
            "An earlier archive recorded 1,020 creators activated.",
        },
      ],
    },
  ],
};

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Evidence Extractor tests\n",
  );

  const requestBefore =
    JSON.stringify(
      REQUEST,
    );

  /* ── Valid extraction ────────────────────────────── */

  const valid =
    await extractEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify(
              VALID_OUTPUT,
            ),
          ),
      },
    );

  check(
    "valid evidence extraction succeeds",
    valid.claims.length ===
      5,
  );

  check(
    "metric claim type survives",
    valid.claims[0]
      .type ===
      "metric",
  );

  check(
    "exact support excerpt survives unchanged",
    valid.claims[0]
      .support[0]
      .excerpt ===
      "Geek tracked 1,058 creators activated.",
  );

  check(
    "multiple support excerpts are preserved",
    valid.claims.find(
      (claim) =>
        claim.id ===
        "fact-not-roi",
    )?.support.length ===
      2,
  );

  check(
    "conflicting source claims may coexist before reconciliation",
    valid.claims.some(
      (claim) =>
        claim.id ===
        "metric-geek-creators",
    ) &&
      valid.claims.some(
        (claim) =>
          claim.id ===
          "metric-older-creators",
      ),
  );

  check(
    "Extractor does not add confidence",
    !(
      "confidence" in
      valid.claims[0]
    ),
  );

  check(
    "Extractor does not add publishable",
    !(
      "publishable" in
      valid.claims[0]
    ),
  );

  /* ── Zero claims is legitimate ───────────────────── */

  const zero =
    await extractEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            JSON.stringify({
              claims: [],
            }),
          ),
      },
    );

  check(
    "zero defensible claims is accepted",
    zero.claims.length ===
      0,
  );

  /* ── Duplicate claim IDs ─────────────────────────── */

  const duplicate =
    clone(VALID_OUTPUT);

  duplicate.claims[1].id =
    duplicate.claims[0].id;

  await expectReject(
    "duplicate candidate claim IDs are rejected",
    clone(REQUEST),
    duplicate,
    "Duplicate Evidence Extractor claim id",
  );

  /* ── Invalid claim type ──────────────────────────── */

  const badType =
    clone(VALID_OUTPUT) as any;

  badType.claims[0].type =
    "financial-return";

  await expectReject(
    "unknown claim type is rejected",
    clone(REQUEST),
    badType,
    "invalid claim type",
  );

  /* ── Invented source ID ──────────────────────────── */

  const inventedSource =
    clone(VALID_OUTPUT);

  inventedSource
    .claims[0]
    .sourceIds = [
      "invented-source",
    ];

  inventedSource
    .claims[0]
    .support[0]
    .sourceId =
    "invented-source";

  await expectReject(
    "invented trusted source ID is rejected",
    clone(REQUEST),
    inventedSource,
    "unknown trusted source",
  );

  /* ── Support source not declared ─────────────────── */

  const undeclaredSupport =
    clone(VALID_OUTPUT);

  undeclaredSupport
    .claims[0]
    .support[0]
    .sourceId =
    "media-report";

  await expectReject(
    "support source must be declared in claim.sourceIds",
    clone(REQUEST),
    undeclaredSupport,
    "is not declared in claim.sourceIds",
  );

  /* ── Fabricated excerpt ──────────────────────────── */

  const fabricatedExcerpt =
    clone(VALID_OUTPUT);

  fabricatedExcerpt
    .claims[0]
    .support[0]
    .excerpt =
    "Geek activated more than 1,058 creators.";

  await expectReject(
    "fabricated support excerpt is rejected",
    clone(REQUEST),
    fabricatedExcerpt,
    "is not verbatim in trusted source",
  );

  /* ── Edited punctuation ──────────────────────────── */

  const editedPunctuation =
    clone(VALID_OUTPUT);

  editedPunctuation
    .claims[0]
    .support[0]
    .excerpt =
    "Geek tracked 1,058 creators activated!";

  await expectReject(
    "edited verbatim punctuation is rejected",
    clone(REQUEST),
    editedPunctuation,
    "is not verbatim in trusted source",
  );

  /* ── Dangling sourceId ───────────────────────────── */

  const danglingSource =
    clone(VALID_OUTPUT);

  danglingSource
    .claims[0]
    .sourceIds.push(
      "media-report",
    );

  await expectReject(
    "declared source without support excerpt is rejected",
    clone(REQUEST),
    danglingSource,
    "provides no support excerpt",
  );

  /* ── Duplicate source IDs ────────────────────────── */

  const duplicateSources =
    clone(VALID_OUTPUT);

  duplicateSources
    .claims[0]
    .sourceIds = [
      "geek-report",
      "geek-report",
    ];

  await expectReject(
    "duplicate claim source IDs are rejected",
    clone(REQUEST),
    duplicateSources,
    "sourceIds contains duplicates",
  );

  /* ── Duplicate support excerpt ───────────────────── */

  const duplicateSupport =
    clone(VALID_OUTPUT);

  duplicateSupport
    .claims[0]
    .support.push({
      sourceId:
        "geek-report",

      excerpt:
        "Geek tracked 1,058 creators activated.",
    });

  await expectReject(
    "duplicate support excerpt is rejected",
    clone(REQUEST),
    duplicateSupport,
    "duplicate support excerpt",
  );

  /* ── Empty support ───────────────────────────────── */

  const emptySupport =
    clone(VALID_OUTPUT);

  emptySupport
    .claims[0]
    .support = [];

  await expectReject(
    "claim without support fails closed",
    clone(REQUEST),
    emptySupport,
    "requires at least one verbatim support excerpt",
  );

  /* ── Confidence injection ────────────────────────── */

  const confidenceInjection =
    clone(VALID_OUTPUT) as any;

  confidenceInjection
    .claims[0]
    .confidence =
    "high";

  await expectReject(
    "Extractor model cannot decide confidence",
    clone(REQUEST),
    confidenceInjection,
    "unknown field: confidence",
  );

  /* ── Publishable injection ───────────────────────── */

  const publishableInjection =
    clone(VALID_OUTPUT) as any;

  publishableInjection
    .claims[0]
    .publishable =
    true;

  await expectReject(
    "Extractor model cannot decide publishable",
    clone(REQUEST),
    publishableInjection,
    "unknown field: publishable",
  );

  /* ── Unknown root field ──────────────────────────── */

  const rootInjection =
    clone(VALID_OUTPUT) as any;

  rootInjection.quality =
    {
      score:
        100,
    };

  await expectReject(
    "unknown Extractor root field is rejected",
    clone(REQUEST),
    rootInjection,
    "unknown field: quality",
  );

  /* ── Invalid trusted request ─────────────────────── */

  const duplicateRequest =
    clone(REQUEST);

  duplicateRequest
    .sources[1]
    .id =
    duplicateRequest
      .sources[0]
      .id;

  let duplicateRequestRejected =
    false;

  try {
    await extractEvidence(
      duplicateRequest,
      {
        client:
          fakeClient(
            JSON.stringify({
              claims: [],
            }),
          ),
      },
    );
  } catch (error) {
    duplicateRequestRejected =
      error instanceof Error &&
      error.message.includes(
        "Duplicate Evidence Extractor source id",
      );
  }

  check(
    "duplicate trusted source IDs are rejected before model call",
    duplicateRequestRejected,
  );

  const emptySourceRequest =
    clone(REQUEST);

  emptySourceRequest
    .sources[0]
    .content =
    "";

  let emptySourceRejected =
    false;

  try {
    await extractEvidence(
      emptySourceRequest,
      {
        client:
          fakeClient(
            JSON.stringify({
              claims: [],
            }),
          ),
      },
    );
  } catch (error) {
    emptySourceRejected =
      error instanceof Error &&
      error.message.includes(
        "has no content",
      );
  }

  check(
    "empty trusted source content is rejected",
    emptySourceRejected,
  );

  /* ── Invalid JSON ────────────────────────────────── */

  let invalidJsonRejected =
    false;

  try {
    await extractEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(
            "{ not valid json",
          ),
      },
    );
  } catch (error) {
    invalidJsonRejected =
      error instanceof Error &&
      error.message.includes(
        "invalid JSON",
      );
  }

  check(
    "malformed structured output is rejected",
    invalidJsonRejected,
  );

  /* ── Empty model output ──────────────────────────── */

  let emptyOutputRejected =
    false;

  try {
    await extractEvidence(
      clone(REQUEST),
      {
        client:
          fakeClient(""),
      },
    );
  } catch (error) {
    emptyOutputRejected =
      error instanceof Error &&
      error.message.includes(
        "no structured output",
      );
  }

  check(
    "empty Extractor model output is rejected",
    emptyOutputRejected,
  );

  /* ── Input mutation ──────────────────────────────── */

  check(
    "Extractor does not mutate trusted request",
    JSON.stringify(
      REQUEST,
    ) ===
      requestBefore,
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

main().catch(
  (error) => {
    console.error(error);

    process.exit(1);
  },
);
