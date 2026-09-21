import {
  generateFlexibleSeo,
  runFlexibleSeoQualityGate,
} from "./flexibleSeo";

import type {
  FlexibleSeoDraft,
  FlexibleSeoRequest,
} from "./flexibleSeo";

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
  fn: () => Promise<unknown>,
  contains: string,
): Promise<void> {
  try {
    await fn();

    console.log(
      `  ✗ ${name} — expected rejection`,
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
        `  ✓ ${name}`,
      );

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
    JSON.stringify(
      value,
    ),
  ) as T;
}

const REQUEST:
  FlexibleSeoRequest =
{
  project: {
    title:
      "Lay's Heartwork",

    slug:
      "lays-heartwork",

    client:
      "Lay's",

    year:
      2020,

    location:
      "India",
  },

  publishableClaims: [
    {
      id:
        "claim-001",

      type:
        "metric",

      statement:
        "The campaign sent 1,400 packs across two phases.",
    },
    {
      id:
        "claim-002",

      type:
        "metric",

      statement:
        "The campaign engaged 1,058 influencers.",
    },
    {
      id:
        "claim-003",

      type:
        "fact",

      statement:
        "The activity ran from 1 July to 14 September 2020.",
    },
  ],

  storyText: [
    "Lay's Heartwork used a large creator activation to carry the campaign story through influencer participation.",
    "Across two phases, 1,400 packs were sent and 1,058 influencers were engaged.",
  ],
};

const GOOD:
  FlexibleSeoDraft =
{
  metaTitle:
    "Lay's Heartwork Influencer Campaign | Geek",

  metaDescription:
    "Explore how Lay's Heartwork used influencer participation in India across a campaign that engaged 1,058 creators.",

  primaryKeyword:
    "Lay's Heartwork campaign",

  secondaryKeywords: [
    "Lay's influencer campaign",
    "Heartwork campaign",
    "influencer marketing case study",
  ],

  searchIntent:
    "branded",

  targetMarket:
    "India",

  preferredInternalAnchors: [
    "Lay's",
    "Influencer Marketing",
    "FMCG work",
  ],

  searchNotes:
    "Keep the page focused on the branded Heartwork campaign and avoid conflating it with other Lay's creator programs.",
};

async function main() {
  console.log(
    "Gold Standard Case Study Agent — Flexible SEO tests\n",
  );

  const quality =
    runFlexibleSeoQualityGate(
      REQUEST,
      GOOD,
    );

  check(
    "valid SEO draft passes deterministic gate",
    quality.draftReady ===
      true,
  );

  check(
    "valid SEO draft receives no error findings",
    !quality.issues.some(
      (issue) =>
        issue.severity ===
        "error",
    ),
  );

  const hallucinatedNumber =
    clone(
      GOOD,
    );

  hallucinatedNumber.metaDescription =
    "Explore how Lay's Heartwork reached 999 million consumers through an influencer participation campaign in India.";

  const numberQuality =
    runFlexibleSeoQualityGate(
      REQUEST,
      hallucinatedNumber,
    );

  check(
    "unsupported SEO number fails closed",
    numberQuality.draftReady ===
      false &&
      numberQuality.issues.some(
        (issue) =>
          issue.code ===
          "SEO_UNSUPPORTED_NUMBER",
      ),
  );

  const unsupportedSuperlative =
    clone(
      GOOD,
    );

  unsupportedSuperlative.metaTitle =
    "Lay's Biggest Heartwork Campaign | Geek";

  const superlativeQuality =
    runFlexibleSeoQualityGate(
      REQUEST,
      unsupportedSuperlative,
    );

  check(
    "unsupported SEO superlative fails closed",
    superlativeQuality.draftReady ===
      false &&
      superlativeQuality.issues.some(
        (issue) =>
          issue.code ===
          "SEO_UNSUPPORTED_SUPERLATIVE",
      ),
  );

  const fakeResearch =
    clone(
      GOOD,
    );

  fakeResearch.searchNotes =
    "Current SERP shows strong search volume for this campaign.";

  const researchQuality =
    runFlexibleSeoQualityGate(
      REQUEST,
      fakeResearch,
    );

  check(
    "SEO cannot pretend live search research occurred",
    researchQuality.draftReady ===
      false &&
      researchQuality.issues.some(
        (issue) =>
          issue.code ===
          "SEO_FALSE_RESEARCH_SIGNAL",
      ),
  );

  const before =
    JSON.stringify(
      REQUEST,
    );

  const fakeClient =
    {
      responses: {
        create:
          async () => ({
            output_text:
              JSON.stringify(
                GOOD,
              ),
          }),
      },
    };

  const generated =
    await generateFlexibleSeo(
      REQUEST,
      {
        client:
          fakeClient as never,
      },
    );

  check(
    "SEO Agent returns deterministic canonical path",
    generated.canonicalPath ===
      "/work/lays-heartwork",
  );

  check(
    "SEO Agent preserves generated meta title",
    generated.metaTitle ===
      GOOD.metaTitle,
  );

  check(
    "SEO Agent passes deterministic quality gate",
    generated.quality.draftReady ===
      true,
  );

  check(
    "SEO Agent does not mutate request",
    JSON.stringify(
      REQUEST,
    ) ===
      before,
  );

  const extraFieldClient =
    {
      responses: {
        create:
          async () => ({
            output_text:
              JSON.stringify({
                ...GOOD,

                noindex:
                  false,
              }),
          }),
      },
    };

  await expectReject(
    "model cannot add noindex control",
    () =>
      generateFlexibleSeo(
        REQUEST,
        {
          client:
            extraFieldClient as never,
        },
      ),
    'unexpected field "noindex"',
  );

  const canonicalFieldClient =
    {
      responses: {
        create:
          async () => ({
            output_text:
              JSON.stringify({
                ...GOOD,

                canonical:
                  "https://example.com/fake",
              }),
          }),
      },
    };

  await expectReject(
    "model cannot control canonical URL",
    () =>
      generateFlexibleSeo(
        REQUEST,
        {
          client:
            canonicalFieldClient as never,
        },
      ),
    'unexpected field "canonical"',
  );

  console.log(
    `\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`,
  );

  if (
    fail >
    0
  ) {
    process.exitCode =
      1;
  }
}

main().catch(
  (
    error,
  ) => {
    console.error(
      error,
    );

    process.exitCode =
      1;
  },
);
