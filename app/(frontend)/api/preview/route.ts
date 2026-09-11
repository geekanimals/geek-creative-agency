import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Secure draft preview entry. An authorised editor (via the Admin "Preview"
 * button, which injects PREVIEW_SECRET server-side) hits this route; we validate
 * the secret, enable Next draft mode, and redirect to the target route, which
 * then renders the DRAFT. Anonymous users without the secret get 401 — drafts
 * never leak publicly. Server-validated, not guessable, Next 15 + Payload 3.
 */

/**
 * Normalise a caller-supplied redirect target to a SAME-ORIGIN root-relative
 * path, or return null. Uses real URL parsing (not string-prefix heuristics) so
 * open-redirect tricks are rejected: absolute URLs, protocol-relative `//host`,
 * backslash `/\host`, control chars, and anything whose parsed origin differs
 * from ours. The result is rebuilt from pathname+search only, so no smuggled
 * host survives.
 */
function safeSameOriginPath(input: string | null, origin: string): string | null {
  if (!input || typeof input !== "string") return null;
  if (input[0] !== "/") return null; // must be root-relative
  if (input[1] === "/" || input[1] === "\\") return null; // //host or /\host
  // Reject control characters and any backslash (belt-and-suspenders).
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code < 0x20 || code === 0x7f || input[i] === "\\") return null;
  }
  let url: URL;
  try {
    url = new URL(input, origin);
  } catch {
    return null;
  }
  if (url.origin !== origin) return null; // resolved off-origin → reject
  const rebuilt = `${url.pathname}${url.search}`;
  if (!rebuilt.startsWith("/") || rebuilt.startsWith("//")) return null;
  return rebuilt;
}

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const path = searchParams.get("path"); // for non-project previews (e.g. /about, /brands/lays)

  // Validate the secret first; never echo it back or log it.
  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid or missing preview token.", { status: 401 });
  }

  // Resolve a safe, same-origin target BEFORE enabling draft mode.
  const candidate = path ?? (slug ? `/work/${encodeURIComponent(slug)}` : "/work");
  const target = safeSameOriginPath(candidate, origin) ?? "/work";

  const dm = await draftMode();
  dm.enable();
  redirect(target);
}
