import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_HOST, isCanonicalHost } from "@/lib/site";

/**
 * Host hygiene for SEO.
 * 1. The bare domain (geekcreativeagency.com) permanently redirects to the
 *    canonical www host, keeping path and query, so Google sees one site.
 * 2. Any other non-canonical host (test subdomain, server IP, localhost) gets
 *    "X-Robots-Tag: noindex, nofollow" so it never appears in search results.
 */
export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();
  if (CANONICAL_HOST.startsWith("www.") && host === CANONICAL_HOST.slice(4)) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  const res = NextResponse.next();
  if (!isCanonicalHost(host)) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
