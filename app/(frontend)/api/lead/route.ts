import { NextRequest } from "next/server";

/**
 * Live lead handler for the Four-Doors forms.
 *
 * It is provider-agnostic — set ONE of the env vars below and leads start
 * delivering with zero code changes. Checked in this order:
 *
 *   RESEND_API_KEY + LEAD_TO_EMAIL   → email via Resend            (recommended)
 *   FORMSPREE_ENDPOINT               → forward to a Formspree form
 *   LEAD_WEBHOOK_URL                 → POST raw JSON to any webhook
 *   LEAD_SLACK_WEBHOOK               → post a message to Slack
 *   (none set)                       → logged server-side, 200 OK (dev mode)
 *
 * See .env.example.
 */

export const runtime = "nodejs";

const FORMS = ["client", "creator", "career", "vendor"] as const;
type FormKind = (typeof FORMS)[number];

// Strict input schema: only these fields are accepted (anything else is dropped
// before delivery), each capped in length. Prevents giant/nested payloads and
// junk fields reaching the email/provider.
const ALLOWED_FIELDS = new Set<string>([
  "_form", "company_website", // control + honeypot
  "name", "company", "designation", "email", "phone", "budget", "timeline", "goal", // client
  "instagram", "city", "category", "followers", "links", // creator
  "role", "linkedin", "portfolio", "why", // career
  "service", "website", "about", // vendor
]);
const MAX_BODY_BYTES = 16 * 1024; // 16KB — a contact form never needs more
const MAX_FIELD_LEN = 5000; // generous for the longest textarea; rejects abuse

/** Keep only allowed string fields, trimmed + length-capped. Non-strings dropped. */
function sanitizeBody(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!ALLOWED_FIELDS.has(k)) continue;
    if (typeof v !== "string") continue;
    out[k] = v.slice(0, MAX_FIELD_LEN);
  }
  return out;
}

/** Is any delivery provider configured? (Resend / Formspree / webhook / Slack.) */
function hasProvider(): boolean {
  return Boolean(
    (process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL) ||
      process.env.FORMSPREE_ENDPOINT ||
      process.env.LEAD_WEBHOOK_URL ||
      process.env.LEAD_SLACK_WEBHOOK,
  );
}

// very light in-memory rate limit (per warm instance)
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function isEmail(v: unknown): boolean {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function subjectFor(kind: FormKind, d: Record<string, string>): string {
  const handle = (d.instagram || "").replace(/^@/, "");
  switch (kind) {
    case "client":
      return `NEW GEEK BRAND LEAD — ${d.company || d.name || "Website"}`;
    case "creator":
      return `NEW GEEK CREATOR — @${handle || d.name || "unknown"}`;
    case "career":
      return `NEW GEEK CAREER APPLICATION — ${[d.name, d.role].filter(Boolean).join(" / ") || "Applicant"}`;
    case "vendor":
      return `NEW GEEK PARTNER / VENDOR — ${d.company || d.name || "Website"}`;
  }
}

function toRows(data: Record<string, string>): [string, string][] {
  return Object.entries(data)
    .filter(([k]) => k !== "_form" && k !== "company_website")
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([k, v]) => [k.replace(/(^|_)([a-z])/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()), v]);
}

async function deliver(kind: FormKind, data: Record<string, string>): Promise<boolean> {
  const rows = toRows(data);
  const subject = subjectFor(kind, data);
  const sourceLine = `Source form: ${kind.toUpperCase()}`;
  const text = [sourceLine, "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n");
  const html =
    `<h2 style="font-family:sans-serif">${subject}</h2>` +
    `<p style="font-family:sans-serif;color:#5A5F5C;margin:0 0 12px">${sourceLine}</p>` +
    `<table style="font-family:sans-serif;border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#5A5F5C;vertical-align:top"><b>${k}</b></td><td style="padding:4px 0">${escapeHtml(
            v
          )}</td></tr>`
      )
      .join("") +
    `</table>`;

  // 1) Resend email
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LEAD_TO_EMAIL = process.env.LEAD_TO_EMAIL;
  if (RESEND_API_KEY && LEAD_TO_EMAIL) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || "Geek Website <onboarding@resend.dev>",
        to: LEAD_TO_EMAIL.split(",").map((s) => s.trim()),
        reply_to: isEmail(data.email) ? data.email : undefined,
        subject,
        html,
        text,
      }),
    });
    return res.ok;
  }

  // 2) Formspree
  const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT;
  if (FORMSPREE_ENDPOINT) {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, _form: kind, ...data }),
    });
    return res.ok;
  }

  // 3) Generic webhook
  const LEAD_WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL;
  if (LEAD_WEBHOOK_URL) {
    const res = await fetch(LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: kind, subject, fields: data, receivedAt: new Date().toISOString() }),
    });
    return res.ok;
  }

  // 4) Slack incoming webhook
  const LEAD_SLACK_WEBHOOK = process.env.LEAD_SLACK_WEBHOOK;
  if (LEAD_SLACK_WEBHOOK) {
    const res = await fetch(LEAD_SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `*${subject}*\n${text}` }),
    });
    return res.ok;
  }

  // 5) No provider configured — log for dev and report not-delivered
  // eslint-disable-next-line no-console
  console.log(`[GEEK lead:${kind}] (no provider configured)\n${text}`);
  return false;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export async function POST(req: NextRequest) {
  // Body-size guard: reject oversized payloads before parsing.
  const declaredLen = Number(req.headers.get("content-length") ?? "0");
  if (declaredLen > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request too large." }, { status: 413 });
  }
  let text: string;
  try {
    text = await req.text();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Enforce the ceiling in ACTUAL UTF-8 BYTES, not JS UTF-16 code units:
  // `text.length` undercounts multibyte characters (an emoji is 1–2 code units
  // but 4 bytes), so a crafted multibyte body could exceed MAX_BODY_BYTES on the
  // wire while passing a `.length` check. Buffer.byteLength measures the wire size.
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request too large." }, { status: 413 });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Strict allowlist + per-field length cap.
  const body = sanitizeBody(parsed);

  const kind = body._form as FormKind;
  if (!FORMS.includes(kind)) {
    return Response.json({ ok: false, error: "Unknown form." }, { status: 400 });
  }

  // Honeypot — bots fill this hidden field. Pretend success, drop silently.
  if (body.company_website && body.company_website.trim() !== "") {
    return Response.json({ ok: true, delivered: false });
  }

  // Minimal validation — vendor form uses `company` instead of `name`
  const who = (body.name || body.company || "").trim();
  if (who.length < 2) {
    return Response.json({ ok: false, error: "Please add your name." }, { status: 422 });
  }
  if (body.email && !isEmail(body.email)) {
    return Response.json({ ok: false, error: "Please use a valid email." }, { status: 422 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many requests — try again shortly." }, { status: 429 });
  }

  // In PRODUCTION a missing provider is a real failure, not a silent success —
  // otherwise leads are dropped invisibly. In dev we allow the log-only path.
  if (!hasProvider()) {
    if (process.env.NODE_ENV === "production") {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify({ type: "lead", form: kind, delivered: false, reason: "no-provider-configured", at: new Date().toISOString() }));
      return Response.json({ ok: false, error: "We couldn't submit that right now — please email us directly." }, { status: 503 });
    }
  }

  try {
    const delivered = await deliver(kind, body);
    // PII-safe structured log — NEVER log the lead's name/company/email/subject.
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ type: "lead", form: kind, delivered, at: new Date().toISOString() }));
    return Response.json({ ok: true, delivered });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[GEEK lead] delivery error", err);
    return Response.json({ ok: false, error: "Could not send right now — please email us." }, { status: 502 });
  }
}
