/**
 * Meta description helper: Google shows ~155–160 characters. Too long → cut at a
 * word boundary with "…"; too short → add a context line so the snippet says
 * who/what/where.
 */
const MAX = 158;
const MIN = 90;
const CONTEXT = "Case studies and campaigns by Geek Creative Agency, Bangalore & Delhi NCR.";

export function seoDescription(text, context = CONTEXT) {
  let d = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (d.length < MIN) d = d ? `${d.replace(/[.\s]*$/, ".")} ${context}` : context;
  if (d.length <= MAX) return d;
  const cut = d.slice(0, MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s—-]+$/, "")}…`;
}
