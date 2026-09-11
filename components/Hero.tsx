"use client";

import { motion, useReducedMotion } from "framer-motion";
import Media from "./ui/Media";
import AutoVideo from "./ui/AutoVideo";
import { HighlightedLines } from "./content/HighlightedLines";
import { heroPoster } from "@/lib/data/work";
import { VIDEO } from "@/lib/video";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

export default function Hero({ content = HOME_FALLBACK.hero }: { content?: HomePageModel["hero"] }) {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative overflow-hidden bg-white pt-24 sm:pt-28">
      {/* blue ray / tech background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute right-0 top-0 h-full w-[70%]"
          style={{ background: "radial-gradient(60% 80% at 78% 30%, rgba(50,193,223,0.14) 0%, rgba(50,193,223,0) 60%)" }}
        />
        <svg className="absolute right-0 top-0 h-full w-2/3 opacity-50" viewBox="0 0 600 500" preserveAspectRatio="xMaxYMid slice">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={620} y1={-40 + i * 18} x2={-40} y2={120 + i * 46} stroke="#32C1DF" strokeOpacity={0.12} strokeWidth={1} />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-edge grid-cols-1 items-center gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:pb-16">
        {/* Headline */}
        <div className="relative z-10">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-display text-[clamp(2.6rem,6vw,5.4rem)] uppercase text-ink"
          >
            <HighlightedLines text={content.headingBlock} highlight={content.headingHighlight} />
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-5 text-base font-medium text-graphite"
          >
            {content.subline}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href={content.ctaPrimary.href} data-track="hero_work_click" className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-geek-cyan hover:bg-geek-cyan hover:text-white">
              {content.ctaPrimary.label} <span aria-hidden>→</span>
            </a>
            <a href={content.ctaSecondary.href} data-track="contact_cta_click" data-track-props='{"from":"hero"}' className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-geek-cyan">
              {content.ctaSecondary.label}
            </a>
          </motion.div>
        </div>

        {/* Showreel media container */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-0"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-2xl ring-1 ring-black/5 sm:aspect-[16/11]">
            {/* Showreel slot — video-ready. Set lib/video.ts → VIDEO.hero.desktop
                to activate; the poster collage below is the static fallback. */}
            <AutoVideo desktop={VIDEO.hero.desktop} mobile={VIDEO.hero.mobile} posterImg={VIDEO.hero.poster}>
              <div className="grid h-full grid-cols-3 grid-rows-2 gap-[3px]">
                {heroPoster.map((p, i) => (
                  <div key={p.slug} className="relative overflow-hidden">
                    <Media src={p.src} need={p.need} label={p.brand} index={i} showSlotLabel={i % 2 === 0} />
                  </div>
                ))}
              </div>
            </AutoVideo>

            {/* showreel affordance */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10">
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-geek-cyan text-ink">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M3 2l7 4-7 4z" /></svg>
                </span>
                Showreel · Muted
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">Real Geek work</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
