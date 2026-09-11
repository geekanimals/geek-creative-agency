"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Drop-in video layer for any media slot. Final assets can be added later with
 * NO component changes — just set the paths in lib/video.ts.
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
  posterImg,
  children,
  className = "",
}: {
  desktop?: string;
  mobile?: string;
  posterImg?: string;
  children: ReactNode; // the poster/static visual (e.g. <Media/>)
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>();
  const [ready, setReady] = useState(false);

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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, reduce]);

  const showVideo = !reduce && !!src;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* poster / static fallback — always present */}
      <div className="absolute inset-0">{children}</div>
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
