import { BRAND_CATEGORY, clients, KNOWN_LOGOS } from "@/lib/data/clients";

/**
 * The homepage "We've made a few friends along the way" strip.
 *
 *   1. Clients from the admin (Home Page → Logos → Other client logos), or the
 *      built-in list in lib/data/clients.ts while that admin list is empty.
 *   2. Every brand with a PUBLISHED case study is added automatically, using the
 *      Brand logo uploaded on that case study.
 *
 * One entry per brand (matched by name, ignoring case/punctuation). A case-study
 * logo fills in a client that has no logo yet; anything still missing uses the
 * known brand logo from lib/data/clients.ts (KNOWN_LOGOS).
 */
export type FriendLogo = { name: string; logo?: string; category?: string };

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function buildFriendLogos(
  adminLogos: FriendLogo[],
  stories: { brand: string; brandLogo?: string; publishStatus?: string }[],
): FriendLogo[] {
  const base: FriendLogo[] = adminLogos.length
    ? adminLogos
    : clients.map((c) => ({ name: c.name, logo: c.logo }));

  const out: FriendLogo[] = [];
  const index = new Map<string, number>();
  const add = (f: FriendLogo) => {
    const k = key(f.name);
    if (!k) return;
    const at = index.get(k);
    if (at === undefined) {
      index.set(k, out.length);
      out.push({ name: f.name, logo: f.logo });
    } else if (!out[at].logo && f.logo) {
      out[at] = { ...out[at], logo: f.logo };
    }
  };

  base.forEach(add);
  stories
    // Joint promos ("Lay's × Kurkure × KFC") are already covered by each brand's own tile.
    .filter((s) => s.publishStatus === "published" && s.brand && !/\s×\s/.test(s.brand))
    .forEach((s) => add({ name: s.brand, logo: s.brandLogo }));
  // Any brand still without an image gets its known logo (lib/data/clients.ts).
  return out.map((f) => ({
    ...f,
    logo: f.logo || KNOWN_LOGOS[key(f.name)],
    category: BRAND_CATEGORY[key(f.name)] || "more",
  }));
}
