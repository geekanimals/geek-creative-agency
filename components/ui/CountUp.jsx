"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Count-up statistic that fires once when scrolled into view.
 * Props: value (number), suffix? (string, default ""), duration? (seconds,
 * default 1.8), className? (string — styled by the caller).
 * No styles of its own: it renders a bare <span> that the caller styles.
 */
export default function CountUp({ value, suffix = "", duration = 1.8, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  const decimals = value % 1 !== 0 ? (value.toString().split(".")[1]?.length ?? 1) : 0;

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      // clamp to [0,1] so a throttled/backgrounded rAF can never flash a
      // negative or overshoot value
      const t = Math.min(Math.max((now - start) / (duration * 1000), 0), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    // guarantee the final value even if rAF is throttled (background tab)
    const guarantee = setTimeout(() => setDisplay(value), duration * 1000 + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(guarantee);
    };
  }, [inView, value, duration, reduce]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
