import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP mailer for every website form (Client / Creator / Career / Vendor).
 * Configure in .env.local (local) or the server's .env.local (live):
 *   SMTP_HOST, SMTP_PORT (465 = SSL, 587 = STARTTLS), SMTP_USER, SMTP_PASS,
 *   MAIL_FROM  ("Geek Creative Agency <hello@yourdomain.com>"),
 *   LEAD_TO_EMAIL (comma-separated inboxes that receive the leads).
 */
const env = (k: string) => (process.env[k] ?? "").trim();

export function isSmtpConfigured(): boolean {
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS") && env("LEAD_TO_EMAIL"));
}

export function mailFrom(): string {
  return env("MAIL_FROM") || `Geek Creative Agency <${env("SMTP_USER")}>`;
}

export function leadInboxes(): string[] {
  return env("LEAD_TO_EMAIL").split(",").map((s) => s.trim()).filter(Boolean);
}

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) return transporter;
  const port = Number(env("SMTP_PORT") || 465);
  const secureEnv = env("SMTP_SECURE").toLowerCase();
  transporter = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port,
    secure: secureEnv ? secureEnv === "true" : port === 465, // 465 → SSL, 587 → STARTTLS
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}
