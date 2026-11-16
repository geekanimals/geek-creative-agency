import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL, IS_STAGING, isCanonicalHost } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  // Staging builds, and any host that is not the canonical one (test
  // subdomain, server IP, localhost), block all crawling.
  if (IS_STAGING || !isCanonicalHost(host)) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    // /admin + /api are the Payload CMS surfaces — never indexable content.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/thank-you"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
