import type { ResolvedProject } from "@/lib/cms/projects";
import { categoryMap, serviceMap, campaignMap } from "@/lib/work/taxonomy";

/**
 * Work search (/api/work-search). Searches every published case study by
 * title, brand, company, client, category, service, campaign type, year,
 * summary and the full story text (section eyebrows, headings, paragraphs,
 * rich text, captions, metrics, quotes).
 *
 * Runs over the same cached project list /work already uses (getWorkProjects),
 * so a search adds no database query.
 */

/** Story keys whose string values are visible copy. Ids, urls, media are ignored. */
const TEXT_KEYS = new Set([
  "text", "heading", "eyebrow", "body", "caption", "overlayHeading", "label", "value", "note",
  "attribution", "statement", "copy", "question", "title", "alt", "description",
]);

function collectText(node: unknown, out: string[], depth = 0): void {
  if (!node || depth > 12) return;
  if (Array.isArray(node)) {
    for (const n of node) collectText(n, out, depth + 1);
    return;
  }
  if (typeof node !== "object") return;
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (typeof v === "string") {
      if (TEXT_KEYS.has(k) && v.trim() && !/^https?:\/\//.test(v)) out.push(v);
    } else if (v && typeof v === "object") {
      collectText(v, out, depth + 1);
    }
  }
}

/** Lowercase, strip accents and punctuation, "&" → "and". */
export function normalize(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type Field = { text: string; words: string[]; weight: number };
export type SearchDoc = { slug: string; fields: Field[]; all: string };

const field = (parts: (string | undefined | null)[], weight: number): Field => {
  const text = normalize(parts.filter(Boolean).join(" "));
  return { text, words: text ? text.split(" ") : [], weight };
};

export function buildSearchDocs(projects: ResolvedProject[]): SearchDoc[] {
  return projects.map((p) => {
    const story: string[] = [];
    collectText(p.sections, story);
    collectText(
      [p.challenge, p.insight, p.idea, p.execution, p.quote, p.stats, p.metricsList, p.press, p.awards, p.faqs],
      story,
    );
    if (p.whyItMattered) story.push(p.whyItMattered);
    const fields = [
      field([p.project, p.brand, p.brandRef?.name, p.slug.replace(/-/g, " ")], 10),
      field([p.company, p.companyRef?.name], 6),
      field(
        [
          ...p.businessCategory.map((c) => categoryMap[c] ?? c),
          ...p.services.map((s) => serviceMap[s] ?? s),
          ...p.campaignTypes.map((c) => campaignMap[c] ?? c),
          ...(p.industries ?? []).map((r) => r.name),
          ...(p.serviceRefs ?? []).map((r) => r.name),
          p.year ? String(p.year) : "",
        ],
        5,
      ),
      field([p.headline, p.oneLineSummary, (p as { cardSummary?: string }).cardSummary, p.metaDescription], 3),
      field(story, 1),
    ];
    return { slug: p.slug, fields, all: fields.map((f) => f.text).join(" ") };
  });
}

/** One typo: a missing, extra or wrong letter, or two letters swapped ("pespi"). */
function nearMatch(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    const diff: number[] = [];
    for (let k = 0; k < a.length && diff.length < 3; k++) if (a[k] !== b[k]) diff.push(k);
    if (diff.length === 2 && diff[1] === diff[0] + 1 && a[diff[0]] === b[diff[1]] && a[diff[1]] === b[diff[0]]) return true;
  }
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/**
 * Score one query word against a field: whole word > word start > inside a word
 * > one typo. In long story text only whole words and word starts count, so
 * "lays" does not pull in every story that says "plays".
 */
function tokenScore(tok: string, f: Field): number {
  if (!f.text) return 0;
  const loose = f.weight >= 3;
  let best = 0;
  for (const w of f.words) {
    if (w === tok) return 3;
    if (w.startsWith(tok)) best = Math.max(best, 2);
    else if (loose && tok.length >= 3 && w.includes(tok)) best = Math.max(best, 1);
    else if (loose && tok.length >= 4 && best < 0.6 && nearMatch(tok, w)) best = 0.6;
  }
  return best;
}

export type SearchHit = { slug: string; score: number };

/**
 * Every query word must match somewhere in the story (AND). Ranked by where it
 * matched (title/brand first, then company, taxonomy, summary, story text), with
 * a bonus when the whole phrase appears.
 */
export function searchDocs(docs: SearchDoc[], query: string, limit = 200): SearchHit[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = [...new Set(q.split(" "))].filter((t) => t.length > 1 || /\d/.test(t)).slice(0, 8);
  if (!tokens.length) return [];
  const hits: SearchHit[] = [];
  for (const d of docs) {
    let score = 0;
    let ok = true;
    for (const tok of tokens) {
      let tokBest = 0;
      for (const f of d.fields) {
        const s = tokenScore(tok, f);
        if (s) tokBest = Math.max(tokBest, s * f.weight);
      }
      if (!tokBest) { ok = false; break; }
      score += tokBest;
    }
    if (!ok) continue;
    if (tokens.length > 1) {
      for (const f of d.fields) if (f.text.includes(q)) { score += 4 * f.weight; break; }
    }
    hits.push({ slug: d.slug, score: Math.round(score * 10) / 10 });
  }
  hits.sort((a, b) => b.score - a.score);
  // When some stories match by name/brand, drop the ones that only mention the word in passing.
  const top = hits[0]?.score ?? 0;
  const floor = top >= 15 ? top * 0.08 : 0;
  return hits.filter((h) => h.score >= floor).slice(0, limit);
}
