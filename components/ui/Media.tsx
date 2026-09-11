import { CSSProperties } from "react";
import AutoVideo from "./AutoVideo";

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
 */
type Props = {
  src?: string;
  need?: string; // required file path, e.g. "/assets/work/doritos/hero.jpg"
  label?: string; // brand / description (alt text + slot heading)
  caption?: string;
  index?: number;
  showSlotLabel?: boolean; // show heading + path inside empty slot
  className?: string;
  imgClassName?: string;
  video?: string; // optional mp4 (desktop)
  videoMobile?: string; // optional lighter/portrait mp4
  priority?: boolean; // set for the LCP image (eager, high fetchpriority)
  contain?: boolean; // object-contain (no crop) — for archival text/UI
};

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
  priority = false,
  contain = false,
}: Props) {
  // Video-ready: wrap the still (image or slot) in an AutoVideo layer.
  if (video || videoMobile) {
    return (
      <AutoVideo desktop={video || ""} mobile={videoMobile} posterImg={src} className={className}>
        <Media src={src} need={need} label={label} caption={caption} index={index} showSlotLabel={showSlotLabel} imgClassName={imgClassName} priority={priority} contain={contain} />
      </AutoVideo>
    );
  }

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${label}${caption ? " — " + caption : ""}`.trim()}
        className={`h-full w-full ${contain ? "object-contain" : "object-cover"} ${imgClassName} ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? ({ fetchPriority: "high" } as Record<string, string>) : {})}
      />
    );
  }

  const bg = tints[index % tints.length];
  const style: CSSProperties = {
    backgroundColor: bg,
    backgroundImage:
      "radial-gradient(120% 120% at 100% 0%, rgba(50,193,223,0.22) 0%, rgba(50,193,223,0) 45%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)",
  };

  return (
    <div
      style={style}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden text-white ${className}`}
      data-asset-needed={need || undefined}
    >
      {showSlotLabel && (
        <div className="flex flex-col items-center px-3 text-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mb-2 text-geek-cyan/80" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="9.5" r="1.6" fill="currentColor" />
            <path d="M4 17l5-4 4 3 3-2 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {label && (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-white/90">{label}</p>
          )}
          {need && (
            <code className="mt-1 max-w-[92%] truncate text-[9px] tracking-tight text-geek-cyan-bright/70">
              {need}
            </code>
          )}
        </div>
      )}
    </div>
  );
}
