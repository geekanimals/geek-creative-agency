"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Hand-drawn brush accent for a single key word (BUILD / CREATE / INFLUENCE /
 * MATTER). Draws an animated underline stroke on scroll-in. Used sparingly.
 */
export default function BrushWord({
  children,
  className = "",
  color = "#32C1DF",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute -bottom-[0.18em] left-0 z-0 w-full"
        height="0.34em"
        viewBox="0 0 300 24"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.path
          d="M4 15 C 60 6, 120 20, 180 12 S 280 8, 296 14"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
