import { renderOG } from "@/lib/og";

/**
 * Branded share image for any page without its own image:
 * /og?title=About%20Geek&eyebrow=Geek  → 1200×630 PNG (Geek cyan / charcoal).
 * Used by lib/seo/ogImage.js; text is length-capped.
 */

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const clip = (v, n) => (v || "").trim().slice(0, n);
  const title = clip(searchParams.get("title"), 90) || "We build brands. Then we make them matter.";
  const eyebrow = clip(searchParams.get("eyebrow"), 40) || "Geek Creative Agency";
  const res = renderOG({ title, eyebrow });
  res.headers.set("Cache-Control", "public, max-age=86400, s-maxage=31536000, immutable");
  return res;
}
