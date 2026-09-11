import type { Media as CmsMedia } from "@/payload-types";

/**
 * Resolve a media reference to a public URL, understanding BOTH sources:
 *  - a CMS Media record (Payload upload on Vercel Blob) → its `url`
 *  - a legacy string path under /public/assets (existing assets, not migrated)
 *
 * Centralised so no brittle URL-string logic is scattered through components.
 */
export type MediaLike = string | number | CmsMedia | null | undefined;

export type ResolvedMedia = {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  /** responsive size URLs when available (CMS media only). */
  sizes?: Record<string, string | undefined>;
} | null;

export function resolveMedia(ref: MediaLike, legacySrc?: string | null, altOverride?: string | null): ResolvedMedia {
  // CMS Media record (populated relationship)
  if (ref && typeof ref === "object" && "url" in ref && ref.url) {
    const sizes: Record<string, string | undefined> = {};
    const s = (ref as CmsMedia).sizes as Record<string, { url?: string | null }> | undefined;
    if (s) for (const [k, v] of Object.entries(s)) sizes[k] = v?.url ?? undefined;
    return {
      src: ref.url,
      alt: altOverride || ref.altText || "",
      width: ref.width,
      height: ref.height,
      sizes,
    };
  }
  // Legacy /public/assets path
  if (typeof legacySrc === "string" && legacySrc.trim()) {
    return { src: legacySrc, alt: altOverride || "" };
  }
  // A bare string ref (also treated as a legacy path)
  if (typeof ref === "string" && ref.trim()) {
    return { src: ref, alt: altOverride || "" };
  }
  return null;
}
