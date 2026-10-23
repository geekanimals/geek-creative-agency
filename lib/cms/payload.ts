import "server-only";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * Cached Payload local-API client for server-side reads. Never imported by
 * client components. All CMS access flows through the helpers in lib/cms/* —
 * components never call Payload directly.
 *
 *  • CMS not configured (DATABASE_URL or PAYLOAD_SECRET empty) → never try to
 *    connect; callers fall back to static content and log nothing per call
 *    (one warning per process instead).
 *  • A failed connection is not cached forever: the next request retries.
 */
const present = (k: string) => (process.env[k] ?? "").trim().length > 0;

export function isCmsConfigured(): boolean {
  return present("DATABASE_URL") && present("PAYLOAD_SECRET");
}

export class CmsNotConfiguredError extends Error {
  constructor() {
    super("CMS not configured (DATABASE_URL / PAYLOAD_SECRET missing) — serving static content");
    this.name = "CmsNotConfiguredError";
  }
}

export function isCmsNotConfiguredError(e: unknown): boolean {
  return e instanceof Error && e.name === "CmsNotConfiguredError";
}

let warned = false;
let cached: Promise<Payload> | null = null;

export function getPayloadClient(): Promise<Payload> {
  if (!isCmsConfigured()) {
    if (!warned) {
      warned = true;
      // eslint-disable-next-line no-console
      console.warn("[cms] DATABASE_URL / PAYLOAD_SECRET not set — CMS disabled, serving static content. Fill .env.local to enable it.");
    }
    return Promise.reject(new CmsNotConfiguredError());
  }
  if (!cached) {
    cached = getPayload({ config }).catch((e) => {
      cached = null; // allow a retry on the next request
      throw e;
    });
  }
  return cached;
}
