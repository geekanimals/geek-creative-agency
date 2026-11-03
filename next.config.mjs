import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Baseline security headers, applied site-wide. Deliberately conservative so
// they do NOT break the Payload admin, its same-origin live-preview iframe
// (X-Frame-Options SAMEORIGIN, not DENY), Vercel Blob media, analytics or the
// lead form. No CSP: a correct CSP for the admin + Blob + analytics is fragile,
// so it is intentionally omitted rather than shipped broken. HSTS is provided
// automatically by Vercel on the production custom domain.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build pages with at most 3 workers (3 DB connections each — see the pool in
  // payload.config.ts), so a build never exhausts Supabase's 15-client pooler
  // while the live site is also connected.
  experimental: { cpus: 3 },
  // This folder is the project root (a stray package-lock.json in the home
  // folder otherwise makes Next guess wrong and print a warning).
  turbopack: { root: projectRoot },
  // The dev-only "N" badge sat on top of the Share button (bottom-left).
  // Build/runtime errors still show their overlay without it.
  devIndicators: false,
  images: {
    remotePatterns: [
      // Public CMS media served from Vercel Blob. Existing /public/assets are
      // local and need no remote pattern.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Brand logos on the homepage logo wall (optimised + cached as WebP).
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "beardo.in" },
    ],
    // Optimised copies are reused for 31 days (case-study photos rarely change).
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Preserve SEO equity of the LEGITIMATE legacy URLs from the old single-page
  // geekcreativeagency.com. `permanent: true` emits a 308 (permanent, treated by
  // search engines like a 301). The old sitemap.xml was spam (200+ obfuscated
  // URLs like /tqorgt); those are deliberately NOT redirected — they fall through
  // to a normal 404 so the injected spam index is dropped, not migrated. The old
  // homepage sections were same-page anchors (#who-we-are etc.), so they resolve
  // to "/" and need no redirect. See docs/PRODUCTION_REDIRECT_MAP.md.
  async redirects() {
    return [
      { source: "/career.html", destination: "/careers", permanent: true },      // careers page
      { source: "/careers.html", destination: "/careers", permanent: true },      // defensive alias
      { source: "/privacy-policy.html", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions.html", destination: "/terms", permanent: true },
      { source: "/refund-policy.html", destination: "/terms", permanent: true },  // nearest legal doc
    ];
  },
};

// withPayload wires the Payload admin/api into the Next build. It does NOT make
// the public frontend depend on the database at runtime.
export default withPayload(nextConfig);
