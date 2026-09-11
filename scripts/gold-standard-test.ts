/**
 * Gold Standard content-model tests (no DB).
 * Run: npx tsx scripts/gold-standard-test.ts
 *
 * Covers: tab composition, field-name stability (agent-writable), internal
 * Search Strategy field-access gating, external-URL validation, the enum
 * identifier-length fix, and that Search Strategy / press / awards / FAQ do NOT
 * make a thin entity public-routable.
 */
import {
  goldStandardTabs, searchStrategyField, pressCoverageField, awardsField, faqsField,
} from "../fields/goldStandard";
import { fieldIsAnyStaff } from "../access/roles";
import { entityIsPublicRoutable } from "../lib/cms/routable";

let pass = 0, fail = 0;
const check = (name: string, got: unknown, want: unknown) => {
  const ok = got === want;
  console.log(`  ${ok ? "✓" : "✗"} ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  ok ? pass++ : fail++;
};
const asReq = (role?: string) => ({ req: { user: role ? { role } : null } }) as never;
type F = { name?: string; type?: string; required?: boolean; defaultValue?: unknown; validate?: (v: unknown) => unknown; fields?: F[]; access?: { read?: (a: never) => boolean }; enumName?: (a: { tableName?: string }) => string };
const names = (fields: F[] = []): string[] => fields.flatMap((f) => (f.type === "row" ? names(f.fields) : f.name ? [f.name] : []));

console.log("tab composition:");
const all = goldStandardTabs({ press: true, awards: true, faqs: true, searchStrategy: true });
check("all four → 3 tabs", all.length, 3);
check("tab 1 label", (all[0] as { label: string }).label, "Evidence & Recognition");
check("tab 2 label", (all[1] as { label: string }).label, "FAQ");
check("tab 3 label", (all[2] as { label: string }).label, "Search Strategy — Internal");
const evidenceNames = names((all[0] as { fields: F[] }).fields);
check("Evidence tab has pressCoverage + awards", evidenceNames.join(","), "pressCoverage,awards");
const faqsOnly = goldStandardTabs({ faqs: true, searchStrategy: true });
check("faqs+searchStrategy → 2 tabs (no Evidence)", faqsOnly.length, 2);
check("first is FAQ", (faqsOnly[0] as { label: string }).label, "FAQ");
const pressOnly = goldStandardTabs({ press: true });
check("press only → 1 Evidence tab, only pressCoverage", names((pressOnly[0] as { fields: F[] }).fields).join(","), "pressCoverage");
check("empty opts → 0 tabs", goldStandardTabs({}).length, 0);

console.log("field-name stability (agent-writable):");
check("searchStrategy group name", (searchStrategyField() as F).name, "searchStrategy");
check("pressCoverage array name", (pressCoverageField() as F).name, "pressCoverage");
check("awards array name", (awardsField() as F).name, "awards");
check("faqs array name", (faqsField() as F).name, "faqs");

console.log("internal Search Strategy field-access gating:");
const ss = searchStrategyField() as F;
check("has access.read", typeof ss.access?.read, "function");
check("anon read denied", ss.access!.read!(asReq()), false);
check("editor read allowed", ss.access!.read!(asReq("editor")), true);
check("access.read is fieldIsAnyStaff", ss.access!.read === fieldIsAnyStaff, true);

console.log("enum identifier-length fix (worst case: business_categories version table):");
const flatten = (fields: F[]): F[] => fields.flatMap((f) => (f.type === "row" ? flatten(f.fields!) : [f]));
const intent = flatten((searchStrategyField() as F).fields!).find((f) => f.name === "searchIntent")!;
const worst = intent.enumName!({ tableName: "_business_categories_v_version_search_strategy" });
check("searchIntent enum ≤ 63 chars", worst.length <= 63, true);
console.log(`    (${worst} = ${worst.length} chars)`);

console.log("external-URL validation (press url):");
const pressFields = (pressCoverageField() as F).fields!;
const urlField = pressFields.flatMap((f) => (f.type === "row" ? f.fields! : [f])).find((f) => f.name === "url") as F;
check("required url rejects empty", typeof urlField.validate!(""), "string");
check("rejects javascript: scheme", typeof urlField.validate!("javascript:alert(1)"), "string");
check("rejects non-url", typeof urlField.validate!("not a url"), "string");
check("accepts https url", urlField.validate!("https://example.com/story"), true);

console.log("routability NOT affected by Search Strategy / press / faqs (Section 28):");
check("company with only searchStrategy → NOT routable", entityIsPublicRoutable("companies", { _status: "published", slug: "x", searchStrategy: { primaryKeyword: "k" } }), false);
check("brand with only press/faqs → NOT routable", entityIsPublicRoutable("brands", { _status: "published", slug: "x", pressCoverage: [{ publisher: "p" }], faqs: [{ question: "q", answer: "a" }] }), false);
check("company WITH introduction → routable", entityIsPublicRoutable("companies", { _status: "published", slug: "x", introduction: "Real editorial content." }), true);

console.log(`\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
