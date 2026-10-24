"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

const steps: { label: string; icon: ReactNode }[] = [
  { label: "Idea", icon: <path d="M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11zM10 20h4M10.5 22h3" /> },
  { label: "Design", icon: <path d="M4 20l3-1 10-10-2-2L5 17l-1 3zM14 6l2 2" /> },
  { label: "Create", icon: <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" /> },
  { label: "Influence", icon: <><circle cx="9" cy="9" r="2.4" /><path d="M4 19c0-2.6 2.2-4.5 5-4.5s5 1.9 5 4.5M16 7a2.4 2.4 0 0 1 0 4.8M19 19c0-1.9-1-3.3-2.4-4" /></> },
  { label: "Produce", icon: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" /></> },
  { label: "Pack", icon: <path d="M12 3l8 4v10l-8 4-8-4V7l8-4zM4 7l8 4 8-4M12 11v10" /> },
  { label: "Ship", icon: <path d="M3 7h10v8H3zM13 10h4l3 3v2h-7zM7 18a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 18zM17 18a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" /> },
  { label: "Activate", icon: <path d="M13 3L5 13h5l-1 8 8-11h-5l1-7z" /> },
  { label: "Measure", icon: <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7" /> },
];

const STEP_MS = 1500; // dot rests on each step this long (incl. travel)
const TRAVEL_S = 0.55; // dot travel time between steps
const RESUME_MS = 4000; // after the visitor scrolls the strip themselves (mobile)

function Node({ label, icon, i, active }: { label: string; icon: ReactNode; i: number; active: boolean }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center gap-2 lg:w-12 lg:pb-7" data-step={i}>
      <span
        data-dot-anchor
        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
          active
            ? "scale-110 border-geek-cyan bg-geek-cyan text-white shadow-[0_0_0_6px_rgba(50,193,223,0.18)]"
            : "border-geek-cyan/50 bg-white text-geek-cyan"
        }`}
        style={{ transitionDelay: active ? `${TRAVEL_S * 1000 * 0.6}ms` : "0ms" }} // colour lands as the dot arrives
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {icon}
        </svg>
      </span>
      <span className={`whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 lg:absolute lg:left-1/2 lg:top-14 lg:-translate-x-1/2 ${active ? "text-geek-deep" : "text-ink"}`}>{label}</span>
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
function usePlayThrough(count: number, reduce: boolean | null) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1); // -1 idle · 0..count-1 steps · count = closing line
  const [dotX, setDotX] = useState(0);
  const activeRef = useRef(-1);
  const [inView, setInView] = useState(false);
  const pausedUntil = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    // touch / mouse / wheel only come from the visitor (our scrollTo doesn't fire them)
    const pause = () => { pausedUntil.current = Date.now() + RESUME_MS; };
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
  const xFor = (idx: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const t = track.getBoundingClientRect();
    if (idx >= count) {
      const end = track.querySelector<HTMLElement>("[data-closing]");
      if (!end) return t.width;
      const r = end.getBoundingClientRect();
      return r.left - t.left + r.width / 2; // dot goes to the centre of the closing pill
    }
    const a = track.querySelectorAll<HTMLElement>("[data-dot-anchor]")[idx];
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
              ? sc.querySelector<HTMLElement>("[data-closing]")
              : sc.querySelectorAll<HTMLElement>("[data-dot-anchor]")[next];
          if (a) {
            const left = a.getBoundingClientRect().left - sc.getBoundingClientRect().left + sc.scrollLeft;
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

export default function Process({ content = HOME_FALLBACK.process }: { content?: HomePageModel["process"] }) {
  const reduce = useReducedMotion();
  const { sectionRef, scrollerRef, trackRef, active, dotX } = usePlayThrough(steps.length, reduce);
  const looping = active === 0; // jump back to the start: glide a bit slower
  return (
    <section ref={sectionRef} className="border-t border-mist" style={{ background: "linear-gradient(180deg,#F5F6F4 0%, #ECF7F9 100%)" }}>
      <div className="mx-auto max-w-edge px-5 py-9 sm:px-8">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-graphite">
          {content.heading} <span className="text-geek-cyan">{content.headingHighlight}</span>
        </p>

        {/* py/px give the enlarged active circle + glow room so nothing gets clipped.
            Track pr = same rail length after the closing pill as before it. */}
        <div ref={scrollerRef} className="no-scrollbar -mx-2 overflow-x-auto px-2 py-3">
          <div ref={trackRef} className="relative flex w-max items-start gap-3 pl-1 pr-[47px] lg:w-full lg:min-w-max lg:pr-0">
            {/* rail */}
            <div className="pointer-events-none absolute left-0 right-0 top-6 h-px bg-geek-cyan/25" />
            {/* travelling dot — stops on each step */}
            {!reduce && active >= 0 && (
              <motion.span
                className="pointer-events-none absolute top-6 z-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-geek-cyan"
                style={{ boxShadow: "0 0 10px 3px rgba(50,193,223,0.55)" }}
                initial={false}
                animate={{ left: dotX }}
                transition={{ duration: looping ? TRAVEL_S * 1.6 : TRAVEL_S, ease: [0.65, 0, 0.35, 1] }}
              />
            )}

            {steps.map((s, i) => (
              <div key={s.label} className="relative flex items-start gap-3 lg:flex-auto">
                <Node label={s.label} icon={s.icon} i={i} active={active === i} />
                <span className="flex shrink-0 justify-center lg:flex-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-4 shrink-0 text-geek-cyan/60" aria-hidden>
                    <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            ))}
            <div className="flex h-12 shrink-0 items-center">
              <span
                data-closing
                className={`relative z-10 flex h-12 items-center whitespace-nowrap rounded-full border px-5 transition-all duration-300 ${
                  active === steps.length
                    ? "scale-105 border-geek-cyan bg-geek-cyan text-white shadow-[0_0_0_6px_rgba(50,193,223,0.18)]"
                    : "border-geek-cyan/50 bg-white text-geek-cyan"
                }`}
                style={{ transitionDelay: active === steps.length ? `${TRAVEL_S * 1000 * 0.6}ms` : "0ms" }}
              >
                <span className="h-display text-base sm:text-lg">{content.trailing}</span>
              </span>
            </div>
            {/* desktop: rail continues past the pill by the same distance as before it.
                Every step and this tail grow by the same extra space (flex-auto), and 35px =
                Measure→pill base distance (40px) minus the 12px track gap. */}
            <div aria-hidden className="hidden lg:block lg:w-[28px] lg:flex-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
