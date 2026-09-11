/**
 * Evidence citation outbound-link policy test (no DB).
 * Run: npx tsx scripts/press-link-test.ts
 *
 * Renders EvidenceRecognition and asserts ordinary editorial citations are
 * crawlable: target="_blank" + rel="noopener", and NOT blanket nofollow/noreferrer.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import EvidenceRecognition from "../components/work/EvidenceRecognition";
import type { PressItem, AwardItem } from "../lib/cms/projects";

const press: PressItem[] = [
  { publisher: "ET BrandEquity", headline: "Independent editorial story",
    url: "https://example-editorial-source.com/story", sourceType: "independent-editorial",
    geekMentioned: true, featured: true, validationNote: "Validates the campaign." },
];
const awards: AwardItem[] = [
  { awardBody: "MarCom Awards", programName: "MarCom Awards 2021", result: "Gold", year: 2021,
    url: "https://example-awards.org/entry", creditedOrganizations: ["Demo Brand"], geekCredited: false },
];

const html = renderToStaticMarkup(createElement(EvidenceRecognition, { press, awards }));

let pass = 0, fail = 0;
const check = (name: string, got: boolean, want = true) => {
  const ok = got === want;
  console.log(`  ${ok ? "✓" : "✗"} ${name}`);
  ok ? pass++ : fail++;
};

// Grab every anchor's rel/target/href.
const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
console.log(`rendered ${anchors.length} citation anchors`);
check("has at least one citation anchor", anchors.length > 0);
check("every anchor opens in a new tab (target=_blank)", anchors.every((a) => /target="_blank"/.test(a)));
check("every anchor has rel=\"noopener\"", anchors.every((a) => /rel="noopener"/.test(a)));
check("no anchor uses nofollow (ordinary editorial citation)", anchors.every((a) => !/nofollow/.test(a)));
check("no anchor uses noreferrer (publisher keeps referrer)", anchors.every((a) => !/noreferrer/.test(a)));
check("citation href is the real external URL", html.includes("https://example-editorial-source.com/story"));

console.log(`\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
