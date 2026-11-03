import { getImageProps } from "next/image";
import { preload } from "react-dom";
import AutoVideo from "./AutoVideo";

/** Local /assets and CMS (Vercel Blob) photos go through Next's image optimizer:
 *  resized per screen + WebP/AVIF, instead of shipping multi-MB originals. */
const OPTIMIZABLE_REMOTE = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//;
const canOptimize = (src) =>
  typeof src === "string" &&
  !/\.(svg|gif)(\?|$)/i.test(src) &&
  ((src.startsWith("/") && !src.startsWith("//")) || OPTIMIZABLE_REMOTE.test(src));

export function optimizedProps(src, sizes, priority) {
  if (!canOptimize(src)) {
    if (priority && typeof src === "string") preload(src, { as: "image", fetchPriority: "high" });
    return { src };
  }
  try {
    const { props } = getImageProps({
      src,
      alt: "",
      width: 1920,
      height: 1080,
      sizes:
        sizes || (priority ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 900px"),
      quality: 75,
    });
    // Priority (LCP) images: <link rel="preload"> in <head>, so the phone starts
    // downloading it right away instead of after the CSS/JS.
    if (priority) {
      preload(props.src, {
        as: "image",
        imageSrcSet: props.srcSet,
        imageSizes: props.sizes,
        fetchPriority: "high",
      });
    }
    return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
  } catch {
    return { src };
  }
}

/**
 * Production media element.
 *  - `src` set  → renders the real asset (object-cover).
 *  - `src` unset → renders a clean, on-brand ASSET SLOT that documents the
 *    exact file required (`need`) so nothing is ever a fabricated visual.
 *  - `video` set → renders a video layer over the image/slot (see AutoVideo:
 *    autoplay/muted/loop/playsInline, in-view only, reduced-motion → static).
 *    This makes every slot video-ready with no further code changes.
 *
 * Backgrounds use only charcoal / deep-cyan / navy (approved palette).
 *
 * Props:
 *  src?           string
 *  need?          string  — required file path, e.g. "/assets/work/doritos/hero.jpg"
 *  label?         string  — brand / description (alt text + slot heading)
 *  caption?       string
 *  index?         number
 *  showSlotLabel? boolean — show heading + path inside empty slot
 *  className?     string
 *  imgClassName?  string
 *  video?         string  — optional mp4 (desktop)
 *  videoMobile?   string  — optional lighter/portrait mp4
 *  youtube?       string  — YouTube video id (muted looping background)
 *  priority?      boolean — set for the LCP image (eager, high fetchpriority)
 *  contain?       boolean — object-contain (no crop) — for archival text/UI
 *  sizes?         string  — how wide the image shows (responsive `sizes`); sensible default
 */

const tints = ["#08252E", "#0F5A6B", "#0C0D0C", "#0d4351", "#0a4b5a"];

export default function Media({
  src,
  need,
  label = "",
  caption,
  index = 0,
  showSlotLabel = true,
  className = "",
  imgClassName = "",
  video,
  videoMobile,
  youtube,
  priority = false,
  contain = false,
  sizes,
}) {
  // Video-ready: wrap the still (image or slot) in an AutoVideo layer.
  if (video || videoMobile || youtube) {
    return (
      <AutoVideo
        desktop={video || ""}
        mobile={videoMobile}
        youtube={youtube}
        posterImg={src}
        className={className}
      >
        <Media
          src={src}
          need={need}
          label={label}
          caption={caption}
          index={index}
          showSlotLabel={showSlotLabel}
          imgClassName={imgClassName}
          priority={priority}
          contain={contain}
          sizes={sizes}
        />
      </AutoVideo>
    );
  }

  if (src) {
    return (
      <>
        <style href="media" precedence="default">
          {styles}
        </style>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...optimizedProps(src, sizes, priority)}
          alt={`${label}${caption ? " — " + caption : ""}`.trim()}
          className={`media__img ${contain ? "media__img--contain" : "media__img--cover"} ${imgClassName} ${className}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" } : {})}
        />
      </>
    );
  }

  const bg = tints[index % tints.length];
  const style = {
    backgroundColor: bg,
    backgroundImage:
      "radial-gradient(120% 120% at 100% 0%, rgba(50,193,223,0.22) 0%, rgba(50,193,223,0) 45%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)",
  };

  return (
    <div style={style} className={`media__slot ${className}`} data-asset-needed={need || undefined}>
      <style href="media" precedence="default">
        {styles}
      </style>
      {showSlotLabel && (
        <div className="media__slot-body">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="media__icon"
            aria-hidden
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8.5" cy="9.5" r="1.6" fill="currentColor" />
            <path
              d="M4 17l5-4 4 3 3-2 4 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {label && <p className="media__label">{label}</p>}
          {need && <code className="media__need">{need}</code>}
        </div>
      )}
    </div>
  );
}

const styles = `
.media__img {
  width: 100%;
  height: 100%;
}

.media__img--cover {
  -o-object-fit: cover;
  object-fit: cover;
}

.media__img--contain {
  -o-object-fit: contain;
  object-fit: contain;
}

.media__slot {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #ffffff;
}

.media__slot-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: 0.75rem;
  text-align: center;
}

.media__icon {
  margin-bottom: 0.5rem;
  color: rgba(50, 193, 223, 0.8);
}

.media__label {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
}

.media__need {
  margin-top: 0.25rem;
  max-width: 92%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-feature-settings: normal;
  font-variation-settings: normal;
  font-size: 9px;
  letter-spacing: -0.025em;
  color: rgba(99, 208, 234, 0.7);
}
`;
