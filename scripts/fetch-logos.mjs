/**
 * Downloads every brand logo in lib/data/clients.ts (KNOWN_LOGOS) into
 * public/assets/clients/<key>.<ext>, so the site serves its own copies instead
 * of hot-linking Wikimedia (which rate-limits servers with HTTP 429).
 *
 *   node scripts/fetch-logos.mjs
 *
 * Then commit public/assets/clients/. lib/data/clients.ts automatically uses a
 * local file when it exists (see LOCAL_LOGOS in that file).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = await readFile(path.join(root, "lib/data/clients.ts"), "utf8");
const block = src.slice(src.indexOf("export const KNOWN_LOGOS"), src.indexOf("};", src.indexOf("export const KNOWN_LOGOS")));
const WIKI = "https://upload.wikimedia.org/wikipedia/";
const entries = [...block.matchAll(/^\s*"?([\w]+)"?:\s*(`[^`]+`|"[^"]+")/gm)].map(([, key, raw]) => [
  key,
  raw.slice(1, -1).replace("${WIKI}", WIKI),
]);

const outDir = path.join(root, "public/assets/clients");
await mkdir(outDir, { recursive: true });

let ok = 0;
for (const [key, url] of entries) {
  if (!/^https?:\/\//.test(url)) continue; // already local
  const ext = (url.split("?")[0].match(/\.(png|jpe?g|webp|svg)$/i)?.[1] || "png").toLowerCase();
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "GeekCreativeAgencyWebsite/1.0 (https://geekcreativeagency.com; logo cache)" },
    });
    if (res.ok) {
      await writeFile(path.join(outDir, `${key}.${ext}`), Buffer.from(await res.arrayBuffer()));
      console.log(`✓ ${key}.${ext}`);
      ok++;
      break;
    }
    console.log(`… ${key}: HTTP ${res.status}, retry ${attempt}`);
    await new Promise((r) => setTimeout(r, 2500 * attempt));
  }
  await new Promise((r) => setTimeout(r, 700)); // be gentle with Wikimedia
}
console.log(`\nDone: ${ok} logos saved in public/assets/clients/`);
