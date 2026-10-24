import { NextRequest } from "next/server";

import { getTransporter, isSmtpConfigured, leadInboxes, mailFrom } from "@/lib/mail/smtp";

/**
 * Live lead handler for every website form (Client / Creator / Career / Vendor —
 * Contact page, Creators page and the homepage "Four Doors").
 *
 * Delivery is SMTP only (see lib/mail/smtp.ts + .env.example):
 *   1) the lead is emailed to LEAD_TO_EMAIL (reply-to = the person who wrote)
 *   2) the person immediately gets a "Thank you for contacting Geek" email
 * With SMTP not configured: dev → logged to the terminal; production → 503.
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

/** Is SMTP configured? */
function hasProvider(): boolean {
  return isSmtpConfigured();
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

  if (!isSmtpConfigured()) {
    // No SMTP configured — log for dev and report not-delivered
    // eslint-disable-next-line no-console
    console.log(`[GEEK lead:${kind}] (SMTP not configured)\n${text}`);
    return false;
  }

  const mailer = getTransporter();
  const from = mailFrom();
  const visitorEmail = isEmail(data.email) ? data.email : null;

  // 1) the lead → Geek inbox(es). This one must succeed.
  await mailer.sendMail({
    from,
    to: leadInboxes(),
    replyTo: visitorEmail ?? undefined,
    subject,
    html,
    text,
  });

  // 2) instant "thank you" back to the visitor. Best effort — a bounce here must
  //    never lose the lead, so it's logged instead of failing the request.
  if (visitorEmail) {
    const reply = thankYouMail(kind, data);
    try {
      await mailer.sendMail({ from, to: visitorEmail, replyTo: leadInboxes()[0], subject: reply.subject, html: reply.html, text: reply.text });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[GEEK lead] thank-you email failed:", e instanceof Error ? e.message : e);
    }
  }
  return true;
}

/**
 * The auto-reply. Deliberately contains NO free text from the form except the
 * visitor's first name (escaped, capped) — so the form can't be abused to send
 * arbitrary content to arbitrary addresses through our mail server.
 */
function thankYouMail(kind: FormKind, d: Record<string, string>) {
  const first = escapeHtml((d.name || d.company || "").trim().split(/\s+/)[0]?.slice(0, 40) || "there");
  const lines: Record<FormKind, string> = {
    client: "Thanks for reaching out to Geek. Your brief is with our team and we'll get back to you within 1–2 working days.",
    creator: "Thanks for wanting to create with Geek. Our creator team will review your profile and reach out when there's a campaign that fits you.",
    career: "Thanks for applying to Geek. Our team will go through your application and get in touch if there's a fit.",
    vendor: "Thanks for your interest in partnering with Geek. Our team will review your details and get back to you.",
  };
  const subject = "Thank you for contacting Geek Creative Agency";
  const body = lines[kind];
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const text = `Hi ${first},\n\n${body}\n\nIf it's urgent, just reply to this email.\n\n— Team Geek\nGeek Creative Agency${site ? `\n${site}` : ""}`;
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0C0D0C">` +
    `<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#137C93;font-weight:700">Geek Creative Agency</p>` +
    `<h1 style="margin:0 0 16px;font-size:22px">Thank you for contacting Geek</h1>` +
    `<p style="margin:0 0 12px;line-height:1.6">Hi ${first},</p>` +
    `<p style="margin:0 0 12px;line-height:1.6">${body}</p>` +
    `<p style="margin:0 0 20px;line-height:1.6">If it's urgent, just reply to this email.</p>` +
    `<p style="margin:0;line-height:1.6">— Team Geek</p>` +
    (site ? `<p style="margin:16px 0 0"><a href="${site}" style="color:#137C93;font-weight:700">${site.replace(/^https?:\/\//, "")}</a></p>` : "") +
    `</div>`;
  return { subject, html, text };
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
