"use client";

import { motion, useReducedMotion } from "framer-motion";
import Band from "./ui/Band";
import Media from "./ui/Media";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

const COLS = 12;
const ROWS = 4;
const COUNT = COLS * ROWS;

/**
 * Creator mosaic. Each cell is a <Media> slot awaiting a real creator asset at
 * /assets/work/creators/<n>.jpg. The staggered whileInView reveal is the hook
 * for the later "progressively populate" animation — swap the once:true reveal
 * for a controlled sequence to bloom tiles in as the network scales.
 */
export default function Influence({ content = HOME_FALLBACK.influence }: { content?: HomePageModel["influence"] }) {
  const reduce = useReducedMotion();
  return (
    <Band
      id="for-creators"
      label={
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-geek-cyan">{content.eyebrow}</p>
          <p className="h-display mt-2 text-3xl text-ink sm:text-4xl">{content.heading}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-graphite">{content.sub}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-graphite">
            {content.list}
          </p>
          <a href={content.linkHref} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:text-geek-cyan">
            {content.linkLabel} <span aria-hidden>→</span>
          </a>
        </div>
      }
    >
      <div
        className="grid gap-1 overflow-hidden rounded-lg"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        data-mosaic="creators"
      >
        {Array.from({ length: COUNT }).map((_, i) => (
          <motion.div
            key={i}
            data-creator-index={i}
            className="relative aspect-square overflow-hidden"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.45, delay: reduce ? 0 : ((i % COLS) + Math.floor(i / COLS)) * 0.02, ease: [0.16, 1, 0.3, 1] }}
          >
            <Media need={`/assets/work/creators/${i + 1}.jpg`} label={`Creator ${i + 1}`} index={i} showSlotLabel={false} />
            {i % 11 === 5 && <div className="absolute inset-0 bg-geek-cyan/85" />}
          </motion.div>
        ))}
      </div>
    </Band>
  );
}
