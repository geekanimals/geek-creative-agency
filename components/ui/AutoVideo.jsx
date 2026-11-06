"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Drop-in video layer for any media slot. The video comes from the admin panel
 * (fields/video.ts → upload OR YouTube link), with lib/video.ts as the code fallback.
 *
 * - `desktop`/`mobile` → an uploaded MP4/WebM
 * - `youtube`          → a YouTube video id, shown as a muted looping background
 *
 * - autoplay · muted · loop · playsInline
 * - desktop + mobile sources (chooses by viewport)
 * - poster/static fallback ALWAYS rendered underneath (so it's the LCP/no-JS state)
 * - prefers-reduced-motion → poster only, never autoplays
 * - plays only while in view (pauses off-screen) to save CPU/network
 */
export default function AutoVideo({
  desktop,
  mobile,
  youtube,
  posterImg,
  children, // the poster/static visual (e.g. <Media/>)
  className = "",
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [src, setSrc] = useState();
  const [ready, setReady] = useState(false);
  const boxRef = useRef(null);
  const [inView, setInView] = useState(false);

  // YouTube: load the embed only once the slot scrolls into view
  useEffect(() => {
    if (!youtube || reduce) return;
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [youtube, reduce]);

  // pick source by viewport
  useEffect(() => {
    if (reduce) return;
    const pick = () => setSrc(window.innerWidth < 768 && mobile ? mobile : desktop);
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, [desktop, mobile, reduce]);

  // play only while in view
  useEffect(() => {
    const el = ref.current;
    if (!el || !src || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, reduce]);

  const showVideo = !reduce && !youtube && !!src;
  const showYoutube = !reduce && !!youtube && inView;
  const ytParams = `autoplay=1&mute=1&loop=1&playlist=${youtube}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1`;

  return (
    <div ref={boxRef} className={`avideo ${className}`}>
      <style href="avideo" precedence="default">
        {styles}
      </style>
      {/* poster / static fallback — always present */}
      <div className="avideo__poster">{children}</div>
      {showVideo && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={posterImg}
          onCanPlay={() => setReady(true)}
          className={`avideo__video ${ready ? "avideo__video--ready" : ""}`}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {showYoutube && (
        <div className="avideo__yt" aria-hidden>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtube}?${ytParams}`}
            title="Background video"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            onLoad={() => setReady(true)}
            className={`avideo__yt-frame ${ready ? "avideo__video--ready" : ""}`}
          />
        </div>
      )}
    </div>
  );
}

const styles = `
.avideo {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.avideo__poster {
  position: absolute;
  inset: 0px;
}

.avideo__video {
  position: absolute;
  inset: 0px;
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.avideo__video--ready {
  opacity: 1;
}

/* YouTube background: cover the slot like object-fit: cover (16:9 source) */
.avideo__yt {
  position: absolute;
  inset: 0px;
  overflow: hidden;
  pointer-events: none;
  container-type: size;
}

.avideo__yt-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: max(100cqw, 177.78cqh);
  height: max(100cqh, 56.25cqw);
  transform: translate(-50%, -50%);
  border: 0;
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.avideo__yt-frame.avideo__video--ready {
  opacity: 1;
}
`;
