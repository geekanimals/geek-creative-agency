/**
 * CLAUDE-ASSISTED CASE STUDY → CMS DRAFT  (Option 4)
 *
 * Claude writes a case-study JSON file (see template.json + README.md in this
 * folder). This script checks it and saves it to the CMS as a DRAFT. It never
 * publishes: a person previews the draft in /admin and clicks Publish.
 *
 *   npm run case-study:draft -- content/claude-case-studies/<slug>.json            (check only)
 *   npm run case-study:draft -- content/claude-case-studies/<slug>.json --write    (save draft)
 *   ... --write --update     (replace an existing project's DRAFT; the live version stays as is)
 *
 * Safety rules enforced here:
 *  - every metric must name its source (no figure without evidence);
 *  - brand / company / services / industries / solutions must already exist
 *    in the CMS (never auto-created, never guessed);
 *  - flagship (bespoke) projects are never touched;
 *  - always saved with _status "draft"; there is no publish option.
 */
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";

type Metric = { value: string; label: string; prefix?: string; suffix?: string; note?: string; source: string };
type Input = {
  slug: string;
  title: string;
  client?: string;
  year?: number;
  location?: string;
  shortSummary?: string;
  cardSummary?: string;
  projectKind?: "campaign" | "ongoing-program" | "platform" | "activation";
  featured?: boolean;
  order?: number;
  heroLegacySrc?: string;
  heroVideo?: string;
  taxonomy?: {
    company?: string;
    brand?: string;
    services?: string[];
    industries?: string[];
    solutions?: string[];
    campaignTypes?: string[];
  };
  story?: {
    headline?: string;
    challenge?: { question?: string; copy?: string };
    insight?: string;
    idea?: { statement?: string; copy?: string };
    execution?: string;
    outcome?: string;
    quote?: { text?: string; attribution?: string };
  };
  metrics?: Metric[];
  seo?: { metaTitle?: string; metaDescription?: string; noindex?: boolean };
  faqs?: { question: string; answer: string }[];
  pressCoverage?: Record<string, unknown>[];
  awards?: Record<string, unknown>[];
  searchStrategy?: Record<string, unknown>;
  sources?: { id: string; title: string; note?: string }[];
};

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);
const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;

function validate(d: Input) {
  if (!str(d.title)) err("title is required.");
  if (!str(d.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) err("slug must be lowercase words joined by hyphens, e.g. lays-heartwork.");
  if (d.year != null && (!Number.isInteger(d.year) || d.year < 2000 || d.year > 2100)) err("year must be a 4-digit year.");
  if (!str(d.shortSummary)) warn("shortSummary is empty (shown at the top of the case study).");
  if (!str(d.story?.challenge?.copy) && !str(d.story?.idea?.copy) && !str(d.story?.execution)) err("story needs at least a challenge, idea or execution.");

  const sourceIds = new Set((d.sources ?? []).map((s) => s.id));
  (d.metrics ?? []).forEach((m, i) => {
    const at = `metrics[${i}]`;
    if (!str(m.value) || !str(m.label)) err(`${at}: value and label are required.`);
    if (!str(m.source)) err(`${at} ("${m.label ?? ""}"): every figure needs a source. Remove it or add where it comes from.`);
    else if (sourceIds.size && !sourceIds.has(m.source)) err(`${at}: source "${m.source}" is not listed in "sources".`);
  });
  if (!(d.metrics ?? []).length) warn("no metrics: fine if the material has no verified figures.");

  const t = d.seo?.metaTitle ?? "";
  const desc = d.seo?.metaDescription ?? "";
  if (!str(t)) warn("seo.metaTitle is empty (a default is used).");
  else if (t.length > 60) warn(`seo.metaTitle is ${t.length} characters; aim for 60 or fewer.`);
  if (!str(desc)) warn("seo.metaDescription is empty (shortSummary is used).");
  else if (desc.length > 160) warn(`seo.metaDescription is ${desc.length} characters; aim for 160 or fewer.`);
  (d.faqs ?? []).forEach((f, i) => { if (!str(f.question) || !str(f.answer)) err(`faqs[${i}]: question and answer are required.`); });
  if (d.heroLegacySrc && !d.heroLegacySrc.startsWith("/")) err("heroLegacySrc must be a /public path such as /assets/work/x.jpg.");
}

async function main() {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const write = args.includes("--write");
  const allowUpdate = args.includes("--update");
  if (!file) throw new Error("Give the case-study JSON file, e.g. npm run case-study:draft -- content/claude-case-studies/my-case.json");

  const raw = fs.readFileSync(path.resolve(file), "utf8");
  const data = JSON.parse(raw) as Input;
  validate(data);

  nextEnv.loadEnvConfig(process.cwd());
  if (String(process.env.PAYLOAD_DB_PUSH).toLowerCase() === "true") throw new Error("PAYLOAD_DB_PUSH=true is not allowed for this script. Set it empty in .env.local.");
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URL and PAYLOAD_SECRET must be set in .env.local.");

  const { getPayload } = await import("payload");
  const config = (await import("../../payload.config")).default;
  const payload = await getPayload({ config });

  // Resolve taxonomy by slug. Missing entries are errors: never auto-create.
  const one = async (collection: string, slug?: string) => {
    if (!slug) return undefined;
    const r = await payload.find({ collection: collection as never, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true, draft: true });
    if (!r.docs[0]) { err(`${collection} "${slug}" does not exist in the CMS. Create it in /admin first or fix the slug.`); return undefined; }
    return (r.docs[0] as { id: number | string }).id;
  };
  const many = async (collection: string, slugs?: string[]) => {
    const ids: (number | string)[] = [];
    for (const s of slugs ?? []) { const id = await one(collection, s); if (id != null) ids.push(id); }
    return ids;
  };
  const tx = data.taxonomy ?? {};
  const company = await one("companies", tx.company);
  const brand = await one("brands", tx.brand);
  const services = await many("services", tx.services);
  const businessCategories = await many("business-categories", tx.industries);
  const solutions = await many("solutions", tx.solutions);

  const existing = await payload.find({ collection: "projects", where: { slug: { equals: data.slug } }, limit: 1, depth: 0, overrideAccess: true, draft: true });
  const current = existing.docs[0] as { id: number | string; renderMode?: string; _status?: string } | undefined;
  if (current?.renderMode === "flagship") err(`"${data.slug}" is a flagship (bespoke) project and is never changed by this script.`);
  if (current && !allowUpdate) err(`A project with slug "${data.slug}" already exists. Use a new slug, or add --update to replace its draft (the live version is not changed).`);

  for (const w of warnings) console.log(`  ! ${w}`);
  if (errors.length) {
    console.error(`\n✖ ${errors.length} problem(s), nothing saved:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const doc = {
    title: data.title,
    slug: data.slug,
    client: data.client,
    year: data.year,
    location: data.location,
    shortSummary: data.shortSummary,
    cardSummary: data.cardSummary,
    renderMode: "standard",
    projectKind: data.projectKind ?? "campaign",
    featured: data.featured ?? false,
    order: data.order ?? 100,
    heroLegacySrc: data.heroLegacySrc,
    heroVideo: data.heroVideo,
    company,
    brand,
    services,
    businessCategories,
    solutions,
    campaignTypes: tx.campaignTypes ?? [],
    headline: data.story?.headline,
    challenge: data.story?.challenge,
    insight: data.story?.insight,
    idea: data.story?.idea,
    execution: data.story?.execution,
    outcome: data.story?.outcome,
    quote: data.story?.quote,
    // `source` is internal evidence and is stripped before saving.
    metrics: (data.metrics ?? []).map(({ source: _s, ...m }) => m),
    seo: data.seo,
    faqs: data.faqs ?? [],
    pressCoverage: data.pressCoverage ?? [],
    awards: data.awards ?? [],
    searchStrategy: data.searchStrategy,
    _status: "draft",
  };

  console.log(`\nCase study: ${data.title}  (/work/${data.slug})`);
  console.log(`  metrics: ${doc.metrics.length} · FAQs: ${doc.faqs.length} · press: ${doc.pressCoverage.length} · awards: ${doc.awards.length}`);
  console.log(`  company: ${tx.company ?? "-"} · brand: ${tx.brand ?? "-"} · services: ${(tx.services ?? []).join(", ") || "-"}`);

  if (!write) {
    console.log("\n✓ Check passed. Nothing saved. Run again with --write to save it as a draft.");
    process.exit(0);
  }

  const saved = current
    ? await payload.update({ collection: "projects", id: current.id, data: doc as never, draft: true, overrideAccess: true })
    : await payload.create({ collection: "projects", data: doc as never, draft: true, overrideAccess: true });

  console.log(`\n✓ Saved as DRAFT (not live). Open: /admin/collections/projects/${(saved as { id: number | string }).id}`);
  console.log("  Use the Preview button there, then click Publish when it looks right.");
  process.exit(0);
}

main().catch((e) => {
  console.error(`\n✖ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
