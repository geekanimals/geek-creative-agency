import { withPayload } from "@payloadcms/next/withPayload";

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
  images: {
    remotePatterns: [
      // Public CMS media served from Vercel Blob. Existing /public/assets are
      // local and need no remote pattern.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
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
      { source: "/career.html", destination: "/contact", permanent: true },      // careers → "Work at Geek" door
      { source: "/careers.html", destination: "/contact", permanent: true },      // defensive alias
      { source: "/privacy-policy.html", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions.html", destination: "/terms", permanent: true },
      { source: "/refund-policy.html", destination: "/terms", permanent: true },  // nearest legal doc
    ];
  },
};

// withPayload wires the Payload admin/api into the Next build. It does NOT make
// the public frontend depend on the database at runtime.
export default withPayload(nextConfig);
