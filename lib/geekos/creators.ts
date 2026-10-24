import "server-only";

/**
 * Live Instagram-connected creators from Geek Influencer OS (Supabase).
 *
 * Reads the public, read-only RPC `website_instagram_creators` (see
 * docs/geek-os/website_instagram_creators.sql) with the Geek OS *publishable*
 * (anon) key — the same key the Geek OS web app already ships to browsers.
 * It returns only handle + profile picture + follower count; no private data.
 *
 * Fail-soft: missing env, network error or bad data → [] and the homepage
 * mosaic simply shows its placeholder tiles. Never throws.
 */
export type GeekCreator = { username: string; picture: string; followers: number | null };

const REVALIDATE_SECONDS = 600; // refresh the list every 10 minutes
const HANDLE_RE = /^[A-Za-z0-9._]{1,30}$/;
const PIC_HOST_RE = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i;

function safePicture(url: unknown): string | null {
  if (typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" || !PIC_HOST_RE.test(u.hostname)) return null;
    // Instagram CDN links are signed and expire; `oe` is the expiry as a hex
    // unix timestamp. Skip links that are already dead (or will die before the
    // next refresh) so the mosaic never shows a broken tile.
    const oe = u.searchParams.get("oe");
    if (oe && /^[0-9a-f]+$/i.test(oe) && parseInt(oe, 16) * 1000 < Date.now() + REVALIDATE_SECONDS * 1000) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function getGeekOsCreators(limit = 48): Promise<GeekCreator[]> {
  const base = (process.env.GEEK_OS_SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (process.env.GEEK_OS_SUPABASE_ANON_KEY || "").trim();
  if (!base || !key) return [];
  try {
    const res = await fetch(`${base}/rest/v1/rpc/website_instagram_creators`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_limit: Math.min(limit, 100) }),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["geek-os-creators"] },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) return [];
    const seen = new Set<string>();
    const out: GeekCreator[] = [];
    for (const r of rows as Array<Record<string, unknown>>) {
      const username = typeof r.username === "string" ? r.username.trim().replace(/^@/, "") : "";
      const picture = safePicture(r.profile_picture_url);
      if (!HANDLE_RE.test(username) || !picture || seen.has(username.toLowerCase())) continue;
      seen.add(username.toLowerCase());
      out.push({ username, picture, followers: typeof r.followers_count === "number" ? r.followers_count : null });
      if (out.length >= limit) break;
    }
    return out;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[geek-os] creators fetch failed; showing placeholder mosaic:", e instanceof Error ? e.message : e);
    return [];
  }
}
