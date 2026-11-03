import { resolveMedia } from "@/lib/cms/media";

/**
 * A video from the CMS "video" field (fields/video.ts), normalised for the UI:
 *   { kind: "file",    src, mobileSrc?, poster? }   → <AutoVideo>
 *   { kind: "youtube", youtubeId, poster? }         → YouTube embed
 * or null when the editor chose "No video" / left it empty.
 */
export type VideoModel =
  | { kind: "file"; src: string; mobileSrc?: string; poster?: string }
  | { kind: "youtube"; youtubeId: string; poster?: string }
  | null;

type VideoGroup = {
  source?: string | null;
  file?: unknown;
  mobileFile?: unknown;
  youtubeUrl?: string | null;
  poster?: unknown;
} | null | undefined;

/** The 11-character id from any YouTube URL (watch, youtu.be, shorts, embed, live). */
export function youtubeIdFrom(url: string | null | undefined): string | null {
  if (!url) return null;
  const s = url.trim();
  const m =
    s.match(/[?&]v=([\w-]{6,})/) ||
    s.match(/youtu\.be\/([\w-]{6,})/) ||
    s.match(/youtube\.com\/(?:embed|shorts|live)\/([\w-]{6,})/);
  return m ? m[1] : null;
}

/** "reel/ABC123" style path from an Instagram post/reel URL, or null. */
export function instagramPathFrom(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.trim().match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i);
  if (!m) return null;
  const kind = m[1].toLowerCase() === "reels" ? "reel" : m[1].toLowerCase();
  return `${kind}/${m[2]}`;
}

/**
 * Content-block video: like resolveVideo, but an Instagram link pasted in the
 * link field becomes an Instagram embed. Only case-study video blocks use this,
 * so heroes and loops keep accepting YouTube/uploads only.
 */
export function resolveBlockVideo(
  group: VideoGroup,
): VideoModel | { kind: "instagram"; path: string } {
  if (group && group.source === "youtube") {
    const path = instagramPathFrom(group.youtubeUrl);
    if (path) return { kind: "instagram", path };
  }
  return resolveVideo(group);
}

export function resolveVideo(group: VideoGroup): VideoModel {
  if (!group || !group.source || group.source === "none") return null;
  const poster = resolveMedia(group.poster as never)?.src;
  if (group.source === "youtube") {
    const youtubeId = youtubeIdFrom(group.youtubeUrl);
    return youtubeId ? { kind: "youtube", youtubeId, poster } : null;
  }
  if (group.source === "upload") {
    const src = resolveMedia(group.file as never)?.src;
    if (!src) return null;
    const mobileSrc = resolveMedia(group.mobileFile as never)?.src;
    return { kind: "file", src, mobileSrc, poster };
  }
  return null;
}
