/**
 * Central video-slot config. Every homepage motion slot is wired to read from
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
