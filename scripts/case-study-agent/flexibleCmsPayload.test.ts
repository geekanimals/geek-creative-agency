/**
 * GOLD STANDARD CASE STUDY AGENT — FLEXIBLE CMS PAYLOAD TESTS
 *
 * No AI.
 * No Payload client.
 * No DB.
 * No network.
 *
 * Proves:
 * - only publication-safe fields cross into CMS;
 * - internal evidence/bindings never cross;
 * - trusted relationships remain slug-based for later resolution;
 * - hero selection is deterministic;
 * - unsafe candidates fail closed;
 * - missing required identity fails closed;
 * - input candidate is never mutated.
 */

import {
  buildFlexibleCmsDraftPayload,
} from "./flexibleCmsPayload";

import type {
  GoldStandardCaseStudyCandidate,
} from "./caseStudyPipeline";

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

function expectThrow(
  name: string,
  fn: () => unknown,
  includes: string,
) {
  try {
    fn();

    console.log(`  ✗ ${name}`);
    fail++;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    const ok =
      message.includes(includes);

    if (ok) {
      console.log(`  ✓ ${name}`);
      pass++;
    } else {
      console.log(
        `  ✗ ${name} — unexpected error: ${message}`,
      );
      fail++;
    }
  }
}

function clone<T>(
  value: T,
): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
}

function candidate():
  GoldStandardCaseStudyCandidate {
  return {
    sourceIntake: {
      sources: [],
      excluded: [],
    },

    evidence: {
      candidates: [],
      verification: {
        claims: [],
      },
      claims: [],
      reconciliationAudit: [],
      reconciliationAuditResult: {
        status: "pass",
        safeToContinue: true,
        score: 100,
        summary: "Safe.",
        findings: [],
      },
    },

    portfolio: {
      projectHint: {
        title: "Sample Campaign",
        slug: "sample-campaign",
        client: "Sample Brand",
        year: 2026,
        location: "India",
      },

      relationships: {
        companySlug:
          "sample-company",

        brandSlug:
          "sample-brand",

        businessCategorySlugs: [
          "fmcg",
        ],

        serviceSlugs: [
          "influencer-marketing",
        ],
      },

      solutions: [
        {
          slug:
            "sample-solution",

          evidenceClaimIds: [
            "relationship-solution",
          ],
        },
      ],

      continuity: {
        previousProjectSlug:
          undefined,

        nextProjectSlug:
          undefined,
      },

      allowedContinuitySlugs: [],
    },

    media: {
      assets: [],
      designerAssets: [],
      compilerAssets: [],
    },

    architecture: {
      renderModeRecommendation:
        "flexible",

      chapters: [],

      metricsPlan: [],

      mediaPlan: [],

      continuityPlan:
        null,
    },

    design: {
      renderMode:
        "flexible",

      sections: [],
    },

    compiled: {
      renderMode:
        "flexible",

      cmsSections: [
        {
          blockType:
            "sectionIntro",

          heading:
            "A verified campaign story",

          body:
            "Publication-safe copy.",
        },
      ],

      bindings: [
        {
          sectionId:
            "intro",

          chapterId:
            "context",

          blockType:
            "sectionIntro",

          evidenceClaimIds: [
            "claim-context",
          ],
        },
      ],
    },

    quality: {
      status:
        "pass",

      draftReady:
        true,

      score:
        100,

      issues: [],
    },

    semanticCritic: {
      status:
        "pass",

      draftReady:
        true,

      score:
        100,

      summary:
        "Safe.",

      findings: [],
    },
  } as unknown as GoldStandardCaseStudyCandidate;
}

function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible CMS Payload tests\n",
  );

  /* ── Happy path ────────────────────────────────── */

  const clean =
    candidate();

  const before =
    JSON.stringify(
      clean,
    );

  const result =
    buildFlexibleCmsDraftPayload(
      clean,
    );

  check(
    "builds Flexible CMS payload",
    result.data.renderMode ===
      "flexible",
  );

  check(
    "preserves trusted project identity",
    result.data.title ===
      "Sample Campaign" &&
    result.data.slug ===
      "sample-campaign",
  );

  check(
    "preserves trusted optional project metadata",
    result.data.client ===
      "Sample Brand" &&
    result.data.year ===
      2026 &&
    result.data.location ===
      "India",
  );

  check(
    "uses deterministic compiled CMS sections",
    result.data.sections ===
      clean.compiled.cmsSections,
  );

  check(
    "does not copy compiler bindings into CMS payload",
    !(
      "bindings" in
      result.data
    ),
  );

  check(
    "preserves company and brand relationship slugs",
    result
      .relationships
      .companySlug ===
      "sample-company" &&
    result
      .relationships
      .brandSlug ===
      "sample-brand",
  );

  check(
    "preserves business category and service relationship slugs",
    JSON.stringify(
      result
        .relationships
        .businessCategorySlugs,
    ) ===
      JSON.stringify([
        "fmcg",
      ]) &&
    JSON.stringify(
      result
        .relationships
        .serviceSlugs,
    ) ===
      JSON.stringify([
        "influencer-marketing",
      ]),
  );

  check(
    "uses only validated Solution/IP relationships",
    JSON.stringify(
      result
        .relationships
        .solutionSlugs,
    ) ===
      JSON.stringify([
        "sample-solution",
      ]),
  );

  const serialized =
    JSON.stringify(
      result.data,
    );

  check(
    "evidence ledger does not cross CMS boundary",
    !serialized.includes(
      '"confidence"',
    ) &&
    !serialized.includes(
      '"publishable"',
    ) &&
    !serialized.includes(
      '"sourceIds"',
    ) &&
    !serialized.includes(
      '"support"',
    ),
  );

  check(
    "internal design identifiers do not cross CMS boundary",
    !serialized.includes(
      '"evidenceClaimIds"',
    ) &&
    !serialized.includes(
      '"claimId"',
    ) &&
    !serialized.includes(
      '"assetId"',
    ) &&
    !serialized.includes(
      '"targetProjectSlug"',
    ),
  );

  /* ── Hero selection ────────────────────────────── */

  const legacyHero =
    candidate();

  (
    legacyHero
      .media
      .assets as any[]
  ).push({
    id:
      "hero-one",

    title:
      "Campaign Hero",

    role:
      "campaign-hero",

    legacySrc:
      "/assets/work/sample/hero.jpg",

    provenance: {
      kind:
        "campaign-archive",
    },

    relatedClaimIds: [],
  });

  const legacyHeroResult =
    buildFlexibleCmsDraftPayload(
      legacyHero,
    );

  check(
    "single trusted legacy campaign hero becomes heroLegacySrc",
    legacyHeroResult
      .data
      .heroLegacySrc ===
      "/assets/work/sample/hero.jpg",
  );

  check(
    "legacy hero does not invent heroMedia",
    legacyHeroResult
      .data
      .heroMedia ==
      null,
  );

  const mediaHero =
    candidate();

  (
    mediaHero
      .media
      .assets as any[]
  ).push({
    id:
      "hero-two",

    title:
      "CMS Campaign Hero",

    role:
      "campaign-hero",

    mediaId:
      42,

    provenance: {
      kind:
        "user-provided",
    },

    relatedClaimIds: [],
  });

  const mediaHeroResult =
    buildFlexibleCmsDraftPayload(
      mediaHero,
    );

  check(
    "single trusted Payload campaign hero becomes heroMedia",
    mediaHeroResult
      .data
      .heroMedia ===
      42,
  );

  const ambiguousHero =
    candidate();

  (
    ambiguousHero
      .media
      .assets as any[]
  ).push(
    {
      id:
        "hero-a",

      title:
        "Hero A",

      role:
        "campaign-hero",

      legacySrc:
        "/assets/work/sample/a.jpg",

      provenance: {
        kind:
          "campaign-archive",
      },

      relatedClaimIds: [],
    },
    {
      id:
        "hero-b",

      title:
        "Hero B",

      role:
        "campaign-hero",

      legacySrc:
        "/assets/work/sample/b.jpg",

      provenance: {
        kind:
          "campaign-archive",
      },

      relatedClaimIds: [],
    },
  );

  const ambiguousHeroResult =
    buildFlexibleCmsDraftPayload(
      ambiguousHero,
    );

  check(
    "multiple trusted hero candidates remain a human decision",
    ambiguousHeroResult
      .data
      .heroMedia ==
      null &&
    ambiguousHeroResult
      .data
      .heroLegacySrc ==
      null,
  );

  /* ── Fail-closed gates ─────────────────────────── */

  const unsafeReconciliation =
    candidate();

  unsafeReconciliation
    .evidence
    .reconciliationAuditResult
    .safeToContinue =
    false;

  expectThrow(
    "unsafe reconciliation is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        unsafeReconciliation,
      ),
    "reconciliation audit",
  );

  const badQuality =
    candidate();

  badQuality
    .quality
    .draftReady =
    false;

  expectThrow(
    "non-draft-ready deterministic quality is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        badQuality,
      ),
    "quality gate",
  );

  const badCritic =
    candidate();

  badCritic
    .semanticCritic
    .draftReady =
    false;

  expectThrow(
    "non-draft-ready Semantic Critic is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        badCritic,
      ),
    "Semantic Critic",
  );

  const wrongArchitecture =
    candidate();

  (
    wrongArchitecture
      .architecture as any
  ).renderModeRecommendation =
    "standard";

  expectThrow(
    "non-Flexible Architect recommendation is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        wrongArchitecture,
      ),
    "Architect",
  );

  const wrongDesign =
    candidate();

  (
    wrongDesign
      .design as any
  ).renderMode =
    "standard";

  expectThrow(
    "non-Flexible Designer output is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        wrongDesign,
      ),
    "Designer",
  );

  const wrongCompiler =
    candidate();

  (
    wrongCompiler
      .compiled as any
  ).renderMode =
    "standard";

  expectThrow(
    "non-Flexible Compiler output is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        wrongCompiler,
      ),
    "Compiler",
  );

  const emptySections =
    candidate();

  emptySections
    .compiled
    .cmsSections =
    [];

  expectThrow(
    "candidate with no compiled CMS sections is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        emptySections,
      ),
    "no compiled CMS sections",
  );

  const leakedEvidence =
    candidate();

  (
    leakedEvidence
      .compiled
      .cmsSections[0] as any
  ).evidenceClaimIds =
    [
      "secret-claim",
    ];

  expectThrow(
    "internal evidence identifiers leaking into CMS are refused",
    () =>
      buildFlexibleCmsDraftPayload(
        leakedEvidence,
      ),
    "internal Agent field leaked",
  );

  const leakedNestedEvidence =
    candidate();

  (
    leakedNestedEvidence
      .compiled
      .cmsSections[0] as any
  ).nested =
    {
      provenance: {
        source:
          "secret",
      },
    };

  expectThrow(
    "nested provenance leaking into CMS is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        leakedNestedEvidence,
      ),
    "internal Agent field leaked",
  );

  const missingTitle =
    candidate();

  (
    missingTitle
      .portfolio
      .projectHint as any
  ).title =
    undefined;

  expectThrow(
    "missing trusted title is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        missingTitle,
      ),
    "title and slug are required",
  );

  const missingSlug =
    candidate();

  (
    missingSlug
      .portfolio
      .projectHint as any
  ).slug =
    "   ";

  expectThrow(
    "blank trusted slug is refused",
    () =>
      buildFlexibleCmsDraftPayload(
        missingSlug,
      ),
    "title and slug are required",
  );

  /* ── Mutation guard ────────────────────────────── */

  check(
    "Flexible CMS payload builder does not mutate candidate",
    JSON.stringify(
      clean,
    ) ===
      before,
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
