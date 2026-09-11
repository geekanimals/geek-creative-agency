"use client";

import { motion, useReducedMotion } from "framer-motion";
import Media from "./ui/Media";
import { HighlightedLines } from "./content/HighlightedLines";
import { builtByGeek } from "@/lib/data/work";
import { VIDEO } from "@/lib/video";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

export default function BuiltByGeek({ content = HOME_FALLBACK.builtByGeek }: { content?: HomePageModel["builtByGeek"] }) {
  const reduce = useReducedMotion();
  return (
    <section id="about" className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(60% 50% at 15% 0%, rgba(50,193,223,0.22) 0%, transparent 55%)" }}
      />

      <div className="relative mx-auto max-w-edge px-5 sm:px-8">
        {/* dramatic headline */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-geek-cyan-bright">{content.eyebrow}</p>
          <h2 className="h-display mt-4 text-[clamp(2rem,5vw,4.2rem)] uppercase">
            <HighlightedLines text={content.headingBlock} />
          </h2>
          <p className="h-display mt-2 text-[clamp(2rem,5vw,4.2rem)] uppercase text-geek-cyan">
            {content.headingCyan}
          </p>
        </motion.div>

        {/* two large stories */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {builtByGeek.map((s, i) => (
            <motion.a
              key={s.slug}
              href={`#work-${s.slug}`}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-[16/11] overflow-hidden rounded-xl ring-1 ring-white/10"
            >
              <div className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]">
                <Media src={s.src} need={s.need} label={s.brand} index={i + 1} video={i === 0 ? VIDEO.builtByGeek.desktop : undefined} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-geek-cyan-bright">{s.kicker}</p>
                <h3 className="h-display mt-2 text-[clamp(1.6rem,3vw,2.8rem)] uppercase">{s.brand}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 transition group-hover:text-white">
                  View Story <span aria-hidden>→</span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* closing statement */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
          className="h-display mt-14 max-w-[20ch] text-[clamp(1.8rem,4vw,3.6rem)] uppercase"
        >
          <HighlightedLines text={content.closing} highlight={content.closingHighlight} />
        </motion.p>
      </div>
    </section>
  );
}
