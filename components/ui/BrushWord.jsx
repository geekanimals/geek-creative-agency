"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Hand-drawn brush accent for a single key word (BUILD / CREATE / INFLUENCE /
 * MATTER). Draws an animated underline stroke on scroll-in. Used sparingly.
 * Props: children (ReactNode), className? (string), color? (string, default "#32C1DF").
 */
export default function BrushWord({ children, className = "", color = "#32C1DF" }) {
  const reduce = useReducedMotion();
  return (
    <span className={`brush ${className}`}>
      <style href="brush" precedence="default">
        {styles}
      </style>
      <span className="brush__text">{children}</span>
      <svg
        className="brush__stroke"
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

const styles = `
.brush {
  position: relative;
  display: inline-block;
}

.brush__text {
  position: relative;
  z-index: 10;
}

.brush__stroke {
  position: absolute;
  bottom: -0.18em;
  left: 0px;
  z-index: 0;
  width: 100%;
}
`;
