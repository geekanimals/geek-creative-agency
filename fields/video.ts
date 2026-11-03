import type { Field } from "payload";

/**
 * One reusable "video" field for every place the site shows a video.
 * The editor picks how to add it:
 *   - Upload  → an MP4/WebM from the Media library (plays muted, looped, inline)
 *   - YouTube → paste any YouTube link (watch, youtu.be, shorts or embed URL)
 * plus an optional poster image shown before the video loads.
 *
 * Read on the frontend with resolveVideo() (lib/cms/video.ts).
 */
const YOUTUBE_RE =
  /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)[\w-]{6,}/i;

const INSTAGRAM_RE = /^(https?:\/\/)?(www\.)?instagram\.com\/([\w.]+\/)?(reel|reels|p|tv)\/[\w-]+/i;

export function videoField({
  name,
  label,
  description,
}: {
  name: string;
  label?: string;
  description?: string;
}): Field {
  return {
    name,
    label: label ?? "Video",
    type: "group",
    admin: {
      description:
        description ?? "Upload a video file OR paste a YouTube link. Leave empty to show the image instead.",
    },
    fields: [
      {
        name: "source",
        label: "Video source",
        type: "radio",
        defaultValue: "none",
        admin: { layout: "horizontal" },
        options: [
          { label: "No video", value: "none" },
          { label: "Upload a video", value: "upload" },
          { label: "YouTube link", value: "youtube" },
        ],
      },
      {
        name: "file",
        label: "Video file",
        type: "upload",
        relationTo: "media",
        filterOptions: { mimeType: { contains: "video" } },
        admin: {
          condition: (_, sibling) => sibling?.source === "upload",
          description: "MP4 (H.264) or WebM. Keep it short and well compressed — it autoplays muted and loops.",
        },
      },
      {
        name: "mobileFile",
        label: "Mobile video (optional)",
        type: "upload",
        relationTo: "media",
        filterOptions: { mimeType: { contains: "video" } },
        admin: {
          condition: (_, sibling) => sibling?.source === "upload",
          description: "A lighter or portrait cut for phones. Leave empty to use the main video.",
        },
      },
      {
        name: "youtubeUrl",
        label: "YouTube link (case-study video blocks also accept Instagram)",
        type: "text",
        admin: {
          condition: (_, sibling) => sibling?.source === "youtube",
          placeholder: "https://www.youtube.com/watch?v=…",
          description:
            "Any YouTube link works: watch, youtu.be, Shorts or embed. In a case-study Video block you can also paste an Instagram reel or post link.",
        },
        validate: (value: unknown, { siblingData }: { siblingData?: { source?: string } }) => {
          if (siblingData?.source !== "youtube") return true;
          if (!value || typeof value !== "string") return "Paste a YouTube link.";
          const v = value.trim();
          if (YOUTUBE_RE.test(v) || INSTAGRAM_RE.test(v)) return true;
          return "That doesn't look like a YouTube or Instagram link.";
        },
      },
      {
        name: "poster",
        label: "Poster image (optional)",
        type: "upload",
        relationTo: "media",
        filterOptions: { mimeType: { contains: "image" } },
        admin: {
          condition: (_, sibling) => sibling?.source === "upload" || sibling?.source === "youtube",
          description: "Shown before the video plays. Leave empty to keep the current image.",
        },
      },
    ],
  };
}
