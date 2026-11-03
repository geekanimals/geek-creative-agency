"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

const ICON_STEPS = [
  {
    label: "Idea",
    icon: <path d="M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11zM10 20h4M10.5 22h3" />,
  },
  {
    label: "Design",
    icon: <path d="M4 20l3-1 10-10-2-2L5 17l-1 3zM14 6l2 2" />,
  },
  {
    label: "Create",
    icon: <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />,
  },
  {
    label: "Influence",
    icon: (
      <>
        <circle cx="9" cy="9" r="2.4" />
        <path d="M4 19c0-2.6 2.2-4.5 5-4.5s5 1.9 5 4.5M16 7a2.4 2.4 0 0 1 0 4.8M19 19c0-1.9-1-3.3-2.4-4" />
      </>
    ),
  },
  {
    label: "Produce",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      </>
    ),
  },
  {
    label: "Pack",
    icon: <path d="M12 3l8 4v10l-8 4-8-4V7l8-4zM4 7l8 4 8-4M12 11v10" />,
  },
  {
    label: "Ship",
    icon: (
      <path d="M3 7h10v8H3zM13 10h4l3 3v2h-7zM7 18a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 18zM17 18a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />
    ),
  },
  { label: "Activate", icon: <path d="M13 3L5 13h5l-1 8 8-11h-5l1-7z" /> },
  {
    label: "Measure",
    icon: <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7" />,
  },
];

const STEP_MS = 1500; // dot rests on each step this long (incl. travel)
const TRAVEL_S = 0.55; // dot travel time between steps
const RESUME_MS = 4000; // after the visitor scrolls the strip themselves (mobile)

function Node({ label, icon, i, active }) {
  return (
    <div className="process__node" data-step={i}>
      <span
        data-dot-anchor
        className={`process__circle ${active ? "process__circle--active" : ""}`}
        style={{
          transitionDelay: active ? `${TRAVEL_S * 1000 * 0.6}ms` : "0ms",
        }} // colour lands as the dot arrives
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {icon}
        </svg>
      </span>
      <span className={`process__label ${active ? "process__label--active" : ""}`}>{label}</span>
    </div>
  );
}

/**
 * Step-by-step play-through (mobile AND desktop): a dot travels along the rail,
 * stops on each step and that step lights up; after the last step it moves to
 * the closing line, then glides back to the first step and loops.
 * On mobile/tablet (strip wider than the screen) the strip also scrolls so the
 * current step stays in view; a manual swipe pauses that for RESUME_MS.
 * Runs only while the section is on screen; off for reduced-motion users.
 */
function usePlayThrough(count, reduce) {
  const sectionRef = useRef(null);
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(-1); // -1 idle · 0..count-1 steps · count = closing line
  const [dotX, setDotX] = useState(0);
  const activeRef = useRef(-1);
  const [inView, setInView] = useState(false);
  const pausedUntil = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.5,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    // touch / mouse / wheel only come from the visitor (our scrollTo doesn't fire them)
    const pause = () => {
      pausedUntil.current = Date.now() + RESUME_MS;
    };
    sc.addEventListener("touchstart", pause, { passive: true });
    sc.addEventListener("pointerdown", pause);
    sc.addEventListener("wheel", pause, { passive: true });
    return () => {
      sc.removeEventListener("touchstart", pause);
      sc.removeEventListener("pointerdown", pause);
      sc.removeEventListener("wheel", pause);
    };
  }, []);

  // x (inside the track) of a step's circle centre, or of the closing line
  const xFor = (idx) => {
    const track = trackRef.current;
    if (!track) return 0;
    const t = track.getBoundingClientRect();
    if (idx >= count) {
      const end = track.querySelector("[data-closing]");
      if (!end) return t.width;
      const r = end.getBoundingClientRect();
      return r.left - t.left + r.width / 2; // dot goes to the centre of the closing pill
    }
    const a = track.querySelectorAll("[data-dot-anchor]")[idx];
    if (!a) return 0;
    const r = a.getBoundingClientRect();
    return r.left - t.left + r.width / 2;
  };

  // keep the dot glued to its step on resize / font load
  useLayoutEffect(() => {
    const onResize = () => setDotX(xFor(Math.max(0, activeRef.current)));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc || reduce || !inView) return;
    const tick = () => {
      const next = activeRef.current + 1 > count ? 0 : activeRef.current + 1;
      activeRef.current = next;
      setActive(next);
      setDotX(xFor(next));
      // mobile/tablet: keep the current step centred (unless the visitor is swiping)
      if (sc.scrollWidth > sc.clientWidth + 1 && Date.now() >= pausedUntil.current) {
        let target = 0;
        if (next > 0) {
          const a =
            next === count
              ? sc.querySelector("[data-closing]")
              : sc.querySelectorAll("[data-dot-anchor]")[next];
          if (a) {
            const left =
              a.getBoundingClientRect().left - sc.getBoundingClientRect().left + sc.scrollLeft;
            target = left - (sc.clientWidth - a.offsetWidth) / 2;
          }
        }
        sc.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
      }
    };
    tick();
    const id = window.setInterval(tick, STEP_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, count]);

  return { sectionRef, scrollerRef, trackRef, active, dotX };
}

export default function Process({ content = HOME_FALLBACK.process }) {
  const reduce = useReducedMotion();
  // Labels come from the admin (Home Page → Process); icons follow the position.
  const steps = (content.steps?.length ? content.steps : ICON_STEPS.map((x) => x.label)).map(
    (label, i) => ({ label, icon: ICON_STEPS[i % ICON_STEPS.length].icon }),
  );
  const { sectionRef, scrollerRef, trackRef, active, dotX } = usePlayThrough(steps.length, reduce);
  const looping = active === 0; // jump back to the start: glide a bit slower
  return (
    <section
      ref={sectionRef}
      className="process"
      style={{ background: "linear-gradient(180deg,#F5F6F4 0%, #ECF7F9 100%)" }}
    >
      <style href="process" precedence="default">
        {styles}
      </style>
      <div className="process-container process__inner">
        <p className="process__heading">
          {content.heading}{" "}
          <span className="process__heading-accent">{content.headingHighlight}</span>
        </p>

        {/* py/px give the enlarged active circle + glow room so nothing gets clipped.
            Track pr = same rail length after the closing pill as before it. */}
        <div ref={scrollerRef} className="process-no-scrollbar process__scroller">
          <div ref={trackRef} className="process__track">
            {/* rail */}
            <div className="process__rail" />
            {/* travelling dot — stops on each step */}
            {!reduce && active >= 0 && (
              <motion.span
                className="process__dot"
                style={{ boxShadow: "0 0 10px 3px rgba(50,193,223,0.55)" }}
                initial={false}
                animate={{ left: dotX }}
                transition={{
                  duration: looping ? TRAVEL_S * 1.6 : TRAVEL_S,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
            )}

            {steps.map((s, i) => (
              <div key={s.label + i} className="process__step">
                <Node label={s.label} icon={s.icon} i={i} active={active === i} />
                <span className="process__sep">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="process__chevron"
                    aria-hidden
                  >
                    <path
                      d="M5 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            ))}
            <div className="process__closing-wrap">
              <span
                data-closing
                className={`process__closing ${active === steps.length ? "process__closing--active" : ""}`}
                style={{
                  transitionDelay: active === steps.length ? `${TRAVEL_S * 1000 * 0.6}ms` : "0ms",
                }}
              >
                <span className="process-display process__closing-label">{content.trailing}</span>
              </span>
            </div>
            {/* desktop: rail continues past the pill by the same distance as before it.
                Every step and this tail grow by the same extra space (flex-auto), and 35px =
                Measure→pill base distance (40px) minus the 12px track gap. */}
            <div aria-hidden className="process__tail" />
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = `
.process {
  border-top: 1px solid #eceeeb;
}

.process__inner {
  padding-block: 2.25rem;
}

.process__heading {
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.process__heading-accent {
  color: #32c1df;
}

.process__scroller {
  margin-inline: -0.5rem;
  overflow-x: auto;
  padding: 0.75rem 0.5rem;
}

.process__track {
  position: relative;
  display: flex;
  width: max-content;
  align-items: flex-start;
  gap: 0.75rem;
  padding-left: 0.25rem;
  padding-right: 47px;
}

.process__rail {
  pointer-events: none;
  position: absolute;
  top: 1.5rem;
  right: 0;
  left: 0;
  height: 1px;
  background-color: rgba(50, 193, 223, 0.25);
}

.process__dot {
  pointer-events: none;
  position: absolute;
  top: 1.5rem;
  z-index: 0;
  width: 0.625rem;
  height: 0.625rem;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background-color: #32c1df;
}

.process__step {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.process__sep {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
}

.process__chevron {
  margin-top: 1rem;
  flex-shrink: 0;
  color: rgba(50, 193, 223, 0.6);
}

.process__closing-wrap {
  display: flex;
  height: 3rem;
  flex-shrink: 0;
  align-items: center;
}

.process__closing {
  position: relative;
  z-index: 10;
  display: flex;
  height: 3rem;
  align-items: center;
  white-space: nowrap;
  border: 1px solid rgba(50, 193, 223, 0.5);
  border-radius: 9999px;
  background-color: #ffffff;
  padding-inline: 1.25rem;
  color: #32c1df;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.process__closing--active {
  transform: scale(1.05);
  border-color: #32c1df;
  background-color: #32c1df;
  color: #ffffff;
  box-shadow: 0 0 0 6px rgba(50, 193, 223, 0.18);
}

.process__closing-label {
  font-size: 1rem;
}

.process__tail {
  display: none;
}

.process__node {
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.process__circle {
  position: relative;
  z-index: 10;
  display: flex;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(50, 193, 223, 0.5);
  border-radius: 9999px;
  background-color: #ffffff;
  color: #32c1df;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.process__circle--active {
  transform: scale(1.1);
  border-color: #32c1df;
  background-color: #32c1df;
  color: #ffffff;
  box-shadow: 0 0 0 6px rgba(50, 193, 223, 0.18);
}

.process__label {
  white-space: nowrap;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0c0d0c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.process__label--active {
  color: #137c93;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.process-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .process-container {
    padding-inline: 20px;
  }
}

.process-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

.process-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.process-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .process__closing-label {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .process__track {
    width: 100%;
    min-width: max-content;
    padding-right: 0;
  }

  .process__step {
    flex: 1 1 auto;
  }

  .process__sep {
    flex: 1 1 0%;
  }

  .process__tail {
    display: block;
    width: 28px;
    flex: 1 1 auto;
  }

  .process__node {
    width: 3rem;
    padding-bottom: 1.75rem;
  }

  .process__label {
    position: absolute;
    top: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
`;
