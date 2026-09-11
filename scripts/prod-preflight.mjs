#!/usr/bin/env node
/**
 * Production pre-flight validator. READ-ONLY: it never modifies the DB, uploads
 * files, deploys, changes DNS, or prints secret VALUES — it only reports whether
 * launch assumptions hold. Run with the Production-scoped env loaded, e.g.:
 *
 *   set -a; . ./.env.production.local; set +a; npm run prod:preflight
 *
 * Exit code 0 = all hard checks pass; 1 = at least one hard check failed.
 */
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "..");

let hardFail = 0;
let warn = 0;
const line = (s) => process.stdout.write(s + "\n");
const ok = (m) => line(`  ✓ ${m}`);
const bad = (m) => { line(`  ✗ ${m}`); hardFail++; };
const soft = (m) => { line(`  ! ${m}`); warn++; };

const present = (name) => typeof process.env[name] === "string" && process.env[name].trim().length > 0;

line("\nProduction pre-flight\n=====================");

// 1) Required production env present (names only, never values)
line("\nRequired env:");
for (const v of ["DATABASE_URL", "PAYLOAD_SECRET", "BLOB_READ_WRITE_TOKEN", "NEXT_PUBLIC_SITE_URL", "PREVIEW_SECRET"]) {
  present(v) ? ok(`${v} present`) : bad(`${v} MISSING`);
}

// 2) DATABASE_URL should be the transaction pooler (:6543) at runtime, and must
//    not obviously be a localhost/dev URL. (Migrations use :5432 separately.)
if (present("DATABASE_URL")) {
  const u = process.env.DATABASE_URL;
  const port = (u.match(/:(\d{4,5})\//) || [])[1];
  if (port === "6543") ok("DATABASE_URL uses the transaction pooler (:6543)");
  else if (port === "5432") soft("DATABASE_URL uses :5432 (session pooler) — expected :6543 for serverless runtime");
  else soft(`DATABASE_URL port is ${port ?? "unknown"} — confirm it is the runtime pooler`);
  if (/localhost|127\.0\.0\.1/.test(u)) bad("DATABASE_URL points at localhost — not a production DB");
}

// 3) Push must never be enabled in production
line("\nSchema-push safety:");
if (process.env.PAYLOAD_DB_PUSH === "true") bad("PAYLOAD_DB_PUSH=true — must be unset/false in Production");
else ok("PAYLOAD_DB_PUSH not enabled");
if (process.env.ALLOW_STAGING_FIXTURES === "true") bad("ALLOW_STAGING_FIXTURES=true — staging fixtures must never be enabled in Production");
else ok("ALLOW_STAGING_FIXTURES not enabled");

// 4) Secret strength (length only; never the value)
line("\nSecret strength:");
for (const v of ["PAYLOAD_SECRET", "PREVIEW_SECRET"]) {
  if (present(v)) (process.env[v].length >= 24 ? ok(`${v} length OK (>=24)`) : soft(`${v} short (<24 chars) — prefer a longer secret`));
}

// 5) Site URL must be a valid HTTPS origin (and not a vercel.app preview host)
line("\nSite URL:");
if (present("NEXT_PUBLIC_SITE_URL")) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);
    url.protocol === "https:" ? ok(`NEXT_PUBLIC_SITE_URL is HTTPS (${url.host})`) : bad(`NEXT_PUBLIC_SITE_URL is not HTTPS (${url.protocol})`);
    if (/vercel\.app$/i.test(url.hostname)) soft("NEXT_PUBLIC_SITE_URL is a *.vercel.app host — production should be the real domain (staging stays noindex)");
  } catch { bad("NEXT_PUBLIC_SITE_URL is not a valid URL"); }
}

// 6) Pool sizing sane for serverless
line("\nPool:");
{
  const max = Number(process.env.PGPOOL_MAX ?? 6);
  (max >= 1 && max <= 5) ? ok(`PGPOOL_MAX=${max} (conservative)`) : soft(`PGPOOL_MAX=${max} — 1..3 recommended for serverless behind the transaction pooler`);
}

// 7) Form provider presence (delivery is optional but report it)
line("\nForms / lead delivery:");
if (present("RESEND_API_KEY") && present("LEAD_TO_EMAIL")) ok("Resend configured (RESEND_API_KEY + LEAD_TO_EMAIL)");
else if (present("FORMSPREE_ENDPOINT") || present("LEAD_WEBHOOK_URL") || present("LEAD_SLACK_WEBHOOK")) ok("A fallback lead provider is configured");
else soft("No lead provider configured — /api/lead will log only (leads not delivered)");

// 8) Migrations present
line("\nMigrations:");
const migDir = path.join(root, "migrations");
if (existsSync(migDir)) {
  const files = readdirSync(migDir).filter((f) => /^\d{8}_\d{6}.*\.ts$/.test(f));
  files.length > 0 ? ok(`${files.length} migration file(s) present`) : bad("no migration files found");
} else bad("migrations/ directory missing");

line("\n=====================");
line(hardFail === 0 ? `PRE-FLIGHT PASS${warn ? ` (with ${warn} warning(s))` : ""}` : `PRE-FLIGHT FAIL — ${hardFail} hard check(s) failed`);
process.exit(hardFail === 0 ? 0 : 1);
