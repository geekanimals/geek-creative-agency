import "server-only";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * Cached Payload local-API client for server-side reads. Never imported by
 * client components. All CMS access flows through the helpers in
 * lib/cms/projects.ts — components never call Payload directly.
 */
let cached: Promise<Payload> | null = null;

export function getPayloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}
