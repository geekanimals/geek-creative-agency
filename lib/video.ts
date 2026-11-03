import type { VideoModel } from "@/lib/cms/video";

/**
 * Central video-slot config — the CODE FALLBACK. Videos are normally set in the
 * admin panel (Home Page → Videos: upload or YouTube link); these paths are used
 * only when the admin slot is empty. Every homepage motion slot is wired to read from
 * here — when the final MP4s are produced, just fill these paths and the slots
 * light up with NO component changes. Empty string = show the static poster.
 *
 * Recommended: 1080p (or 720p) H.264 MP4, muted, short loop, well-compressed.
 * Provide `mobile` as a lighter/portrait cut where useful.
 */
export type VideoSlot = { desktop: string; mobile?: string; poster?: string };

export const VIDEO: Record<string, VideoSlot> = {
  hero: { desktop: "", mobile: "", poster: "/assets/work/showreel-poster.jpg" }, // /assets/work/showreel.mp4
  mediaChanged: { desktop: "" }, // /assets/video/media-changed.mp4
  build: { desktop: "" }, // /assets/video/build.mp4
  influence: { desktop: "" }, // /assets/video/influence.mp4
  builtByGeek: { desktop: "" }, // /assets/video/built-by-geek.mp4
  geekWay: { desktop: "" }, // /assets/video/geek-way.mp4
  process: { desktop: "" }, // /assets/video/last-mile.mp4
};

export const hasVideo = (slot: VideoSlot | undefined): boolean => !!slot && !!slot.desktop;

/**
 * Props for <Media>/<AutoVideo> from an admin video (upload or YouTube),
 * falling back to the code slot above when the admin left it empty.
 */
export function videoProps(cms: VideoModel | undefined, slot?: VideoSlot) {
  if (cms?.kind === "youtube") return { youtube: cms.youtubeId, poster: cms.poster };
  if (cms?.kind === "file") return { video: cms.src, videoMobile: cms.mobileSrc, poster: cms.poster };
  if (slot?.desktop) return { video: slot.desktop, videoMobile: slot.mobile, poster: slot.poster };
  return { poster: slot?.poster };
}
