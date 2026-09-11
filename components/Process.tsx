"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
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

function Node({ label, icon, i }: { label: string; icon: ReactNode; i: number }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2" data-step={i}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-geek-cyan/50 bg-white text-geek-cyan">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {icon}
        </svg>
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink">{label}</span>
    </div>
  );
}

export default function Process({ content = HOME_FALLBACK.process }: { content?: HomePageModel["process"] }) {
  const reduce = useReducedMotion();
  return (
    <section className="border-t border-mist" style={{ background: "linear-gradient(180deg,#F5F6F4 0%, #ECF7F9 100%)" }}>
      <div className="mx-auto max-w-edge px-5 py-9 sm:px-8">
        <p className="mb-7 text-xs font-bold uppercase tracking-[0.14em] text-graphite">
          {content.heading} <span className="text-geek-cyan">{content.headingHighlight}</span>
        </p>

        <div className="no-scrollbar overflow-x-auto pb-2">
          <div className="relative flex min-w-max items-start gap-3">
            {/* cyan pulse rail (subtle now; ready to drive a fuller animation) */}
            <div className="pointer-events-none absolute left-0 right-0 top-6 h-px bg-geek-cyan/25">
              {!reduce && (
                <motion.span
                  className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-geek-cyan"
                  style={{ boxShadow: "0 0 10px 2px rgba(50,193,223,0.6)" }}
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>

            {steps.map((s, i) => (
              <div key={s.label} className="relative flex items-start gap-3">
                <Node label={s.label} icon={s.icon} i={i} />
                {i < steps.length - 1 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-3.5 shrink-0 text-geek-cyan/60" aria-hidden>
                    <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
            <div className="ml-4 shrink-0 self-center whitespace-nowrap">
              <span className="h-display text-lg text-geek-cyan sm:text-xl">{content.trailing}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
