"use client";

import { ReactNode } from "react";

/**
 * Infinite horizontal marquee. Renders children twice (-50% keyframe) for a
 * seamless loop. Pauses on hover.
 */
export default function Marquee({
  children,
  className = "",
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
