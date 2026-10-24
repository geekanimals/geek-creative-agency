import "server-only";
import { getPayloadClient, isCmsConfigured } from "@/lib/cms/payload";

export type CmsAdminProblem = "not-configured" | "db-unreachable" | null;

/**
 * Checks, before the Payload admin renders, whether the CMS can actually run.
 * Payload's admin needs the database on its very first render (it checks for
 * users), so without this the /admin route crashes with a generic 500.
 * Returns null when everything is fine.
 */
export async function getCmsAdminProblem(): Promise<CmsAdminProblem> {
  if (!isCmsConfigured()) return "not-configured";
  try {
    await getPayloadClient();
    return null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[cms] /admin: could not connect to the database:", e instanceof Error ? e.message : e);
    return "db-unreachable";
  }
}
