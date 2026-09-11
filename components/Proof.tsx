"use client";

import Band from "./ui/Band";
import CountUp from "./ui/CountUp";
import Media from "./ui/Media";
import { proof } from "@/lib/data/proof";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

export default function Proof({ content = HOME_FALLBACK.proof }: { content?: HomePageModel["proof"] }) {
  return (
    <Band
      id="proof"
      label={
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-geek-cyan">{content.eyebrow}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-graphite">
            {content.sub}
          </p>
        </div>
      }
      trailing={
        <div className="flex flex-col gap-2">
          {proof.map((c, i) => (
            <div key={c.brand} className="relative h-16 overflow-hidden rounded-md">
              <Media src={c.src} need={c.need} label={c.brand} index={i} showSlotLabel={false} />
              <span className="absolute bottom-2 left-3 text-xs font-bold uppercase tracking-[0.1em] text-white">{c.brand}</span>
            </div>
          ))}
        </div>
      }
    >
      <div className="space-y-6">
        {proof.map((c) => (
          <div key={c.brand} className="grid grid-cols-[70px_1fr] items-center gap-4 sm:grid-cols-[90px_1fr]">
            <p className="h-display text-xl text-ink sm:text-2xl">{c.brand}</p>
            <div className="grid grid-cols-3 gap-4">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <div className="h-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-none text-geek-cyan">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-graphite">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Band>
  );
}
