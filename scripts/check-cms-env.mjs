#!/usr/bin/env node
/**
 * Ops pre-flight: verify the CMS environment before deploying/migrating.
 * Run: `npm run cms:check-env` (loads .env.local / .env via the shell/CI).
 * Exits non-zero with a precise message when a required CMS variable is absent.
 * The public static site does NOT need these — this check is for CMS runtime.
 */
const REQUIRED = ["DATABASE_URL", "PAYLOAD_SECRET", "NEXT_PUBLIC_SITE_URL"];
const UPLOADS = ["BLOB_READ_WRITE_TOKEN"];

const set = (k) => typeof process.env[k] === "string" && process.env[k].trim().length > 0;
const missing = REQUIRED.filter((k) => !set(k));
const missingUploads = UPLOADS.filter((k) => !set(k));

for (const k of [...REQUIRED, ...UPLOADS]) console.log(`  ${set(k) ? "✓" : "✗"} ${k}`);

if (missing.length) {
  console.error(`\n✗ Missing required CMS variable(s): ${missing.join(", ")}`);
  console.error("  Set them in .env.local (dev) or Vercel env (deployed). See .env.example.");
  process.exit(1);
}
if (missingUploads.length) console.warn(`\n⚠ CMS media uploads need: ${missingUploads.join(", ")} (admin still works read-only).`);
console.log("\n✓ CMS environment OK.");
