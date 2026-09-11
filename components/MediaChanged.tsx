"use client";

import { motion, useReducedMotion } from "framer-motion";
import Media from "./ui/Media";
import BrushWord from "./ui/BrushWord";

type Era = {
  pre: string;
  post: string;
  need?: string;
  label?: string;
  transitional?: boolean;
};

const eras: Era[] = [
  { pre: "The web", post: "changed.", label: "Web · early Geek sites", need: "/assets/work/archive/web.jpg" },
  { pre: "Social", post: "changed.", label: "Social · Fastrack / Lyfe", need: "/assets/work/archive/social.jpg" },
  { pre: "Mobile", post: "changed.", label: "Mobile · Geek app / iPad", need: "/assets/work/archive/mobile.jpg" },
  { pre: "Creators", post: "changed everything.", label: "Creators · influencer mosaics", need: "/assets/work/archive/creators.jpg" },
  { pre: "It'll", post: "change again.", transitional: true },
  { pre: "Our job", post: "won't.", label: "Geek", need: "/assets/work/archive/geek.jpg" },
];

function Arrow() {
  return (
    <span className="mt-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-geek-cyan text-geek-cyan">
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function MediaChanged() {
  const reduce = useReducedMotion();
  return (
    <section id="what-we-do" className="border-t border-mist bg-white">
      <div className="no-scrollbar overflow-x-auto">
        <div className="mx-auto flex min-w-max items-stretch gap-px bg-mist">
          {eras.map((e, i) => (
            <motion.div
              key={e.pre + e.post}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className="flex w-[220px] shrink-0 flex-col justify-between bg-white p-5 sm:w-[240px]"
            >
              <div className="relative mb-4 h-16 w-full overflow-hidden rounded-md">
                {e.transitional ? (
                  // elegant transitional visual — a shifting cyan light, not a dark box
                  <div className="relative h-full w-full overflow-hidden bg-geek-navy">
                    <motion.div
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(110deg, rgba(50,193,223,0) 0%, rgba(50,193,223,0.55) 50%, rgba(50,193,223,0) 100%)" }}
                      animate={reduce ? {} : { x: ["-60%", "60%"] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 12px)" }} />
                  </div>
                ) : (
                  <Media need={e.need} label={e.label} index={i} showSlotLabel={false} />
                )}
              </div>
              <div>
                <p className="h-display text-lg leading-tight text-ink sm:text-xl">
                  {e.pre} <span className="text-graphite">{e.post}</span>
                </p>
                <Arrow />
              </div>
            </motion.div>
          ))}

          {/* Cyan finale — resolves into MAKE BRANDS MATTER */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex w-[280px] shrink-0 flex-col justify-center overflow-hidden bg-geek-cyan p-6 text-white sm:w-[340px]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: "radial-gradient(70% 90% at 90% 10%, rgba(255,255,255,0.35) 0%, transparent 55%)" }} />
            <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Make brands</p>
            <h3 className="relative h-display mt-1 text-3xl uppercase sm:text-4xl">
              <BrushWord color="#ffffff">Matter.</BrushWord>
            </h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
