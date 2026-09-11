/**
 * Environment handling for the CMS foundation.
 *
 * DESIGN: this module is NEVER imported by the public frontend and is NEVER
 * auto-invoked at module load, config load, or build. The static Geek site must
 * build and render with zero CMS variables present. Validation is opt-in —
 * call `assertCmsEnv()` from CMS runtime/ops contexts (the `cms:check-env`
 * script, a seed script, a health check) where the CMS is genuinely expected to
 * run, and it fails loudly with a precise, aggregated message.
 */

/** Variables the CMS needs to actually run (admin + API + DB). */
const REQUIRED_CMS = ["DATABASE_URL", "PAYLOAD_SECRET"] as const;
/** Needed only for CMS media uploads (admin works read-only without it). */
const REQUIRED_FOR_UPLOADS = ["BLOB_READ_WRITE_TOKEN"] as const;

export type CmsEnvReport = {
  ok: boolean;
  missingRequired: string[];
  missingForUploads: string[];
  siteUrl: string;
  isProduction: boolean;
};

function present(name: string): boolean {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0;
}

/** Non-throwing status report (safe to call anywhere, e.g. a health endpoint). */
export function cmsEnvReport(): CmsEnvReport {
  return {
    missingRequired: REQUIRED_CMS.filter((k) => !present(k)),
    missingForUploads: REQUIRED_FOR_UPLOADS.filter((k) => !present(k)),
    ok: REQUIRED_CMS.every(present),
    siteUrl: siteUrl(),
    isProduction: process.env.NODE_ENV === "production",
  };
}

/**
 * Throws a clear, aggregated error when a genuinely-required CMS variable is
 * absent. Call this where the CMS must run — not from the frontend.
 */
export function assertCmsEnv({ requireUploads = false }: { requireUploads?: boolean } = {}): void {
  const r = cmsEnvReport();
  const missing = [...r.missingRequired, ...(requireUploads ? r.missingForUploads : [])];
  if (missing.length > 0) {
    throw new Error(
      `[CMS env] Missing required variable(s): ${missing.join(", ")}.\n` +
        `Set them for this environment (local: .env.local · Vercel: Project → Settings → Environment Variables).\n` +
        `See .env.example. The public static site does not need these — only /admin and /api do.`,
    );
  }
}

/** Canonical site origin — env-driven, localhost fallback for local dev. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
