/**
 * Share-image fallback for pages with no admin/cover image: a branded card with
 * the page title (served by app/(frontend)/og/route.jsx). Keeps every page's
 * WhatsApp / LinkedIn / X preview from showing up blank.
 */
const BRAND_SUFFIX = /\s*[—|–-]\s*(Geek Creative Agency|Geek Insights|Geek)\s*$/i;

export function ogFallback(title, eyebrow = "Geek Creative Agency") {
  const clean = String(title || "")
    .replace(BRAND_SUFFIX, "")
    .replace(BRAND_SUFFIX, "")
    .trim();
  const q = new URLSearchParams({ title: clean || "Geek Creative Agency", eyebrow });
  return [{ url: `/og?${q}`, width: 1200, height: 630, alt: clean || "Geek Creative Agency" }];
}
