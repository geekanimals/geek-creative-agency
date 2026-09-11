"use client";

import Band, { BandLabel } from "./ui/Band";
import Media from "./ui/Media";
import { workWall } from "@/lib/data/work";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

export default function WorkWall({ content = HOME_FALLBACK.work }: { content?: HomePageModel["work"] }) {
  return (
    <Band label={<BandLabel title={content.title} sub={content.sub} href="#work" />}>
      <div className="no-scrollbar -mr-5 flex gap-3 overflow-x-auto pr-5 sm:-mr-8 sm:pr-8">
        {workWall.map((w, i) => (
          <a key={w.slug} href={`#work-${w.slug}`} className="group w-36 shrink-0 sm:w-40">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
                <Media src={w.src} need={w.need} label={w.brand} index={i} showSlotLabel={false} />
              </div>
              {/* hover reveal — brand / project / view story */}
              <div className="absolute inset-0 flex flex-col justify-end bg-ink/0 p-3 opacity-0 transition-all duration-500 group-hover:bg-ink/65 group-hover:opacity-100">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-geek-cyan-bright">{w.brand}</p>
                <p className="text-sm font-semibold text-white">{w.project}</p>
                <span className="mt-1 text-[11px] font-semibold text-white">View Story →</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-graphite">{w.brand}</p>
          </a>
        ))}
        <div className="flex w-16 shrink-0 items-center justify-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-geek-cyan">&amp; more</span>
        </div>
      </div>
    </Band>
  );
}
