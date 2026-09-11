"use client";

import { motion, useReducedMotion } from "framer-motion";
import Band, { BandLabel } from "./ui/Band";
import { HighlightedLines } from "./content/HighlightedLines";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

export default function GeekWay({ content = HOME_FALLBACK.geekWay }: { content?: HomePageModel["geekWay"] }) {
  const reduce = useReducedMotion();
  const principles = content.principles;
  return (
    <>
      <Band id="insights" label={<BandLabel title={content.title} />}>
        {/* editorial, typography-led — no cards */}
        <div className="divide-y divide-mist border-t border-mist">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-4 sm:grid-cols-[auto_minmax(0,10ch)_1fr] sm:gap-x-8"
            >
              <span className="text-xs font-bold text-geek-cyan">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h-display text-2xl uppercase text-ink sm:text-3xl">{p.title}</h3>
              <p className="col-span-2 text-sm text-graphite sm:col-span-1">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </Band>

      {/* dramatic finale — significant visual weight */}
      <section className="relative overflow-hidden bg-geek-navy py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(60% 70% at 50% 40%, rgba(50,193,223,0.30) 0%, transparent 60%)" }}
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-edge px-5 text-center sm:px-8"
        >
          <h3 className="h-display text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.92]">
            <HighlightedLines text={content.finaleBlock} highlight={content.finaleHighlight} />
          </h3>
          <p className="mt-6 text-base text-white/60 sm:text-lg">{content.finaleSub}</p>
        </motion.div>
      </section>
    </>
  );
}
