import type { MetadataRoute } from "next";
import { SITE_URL, IS_STAGING } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging (…vercel.app): block all crawling so it can't be indexed.
  if (IS_STAGING) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    // /admin + /api are the Payload CMS surfaces — never indexable content.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/thank-you"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
