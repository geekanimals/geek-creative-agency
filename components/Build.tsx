"use client";

import Band, { BandLabel } from "./ui/Band";
import Media from "./ui/Media";
import { buildStories } from "@/lib/data/work";
import { VIDEO } from "@/lib/video";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

export default function Build({ content = HOME_FALLBACK.build }: { content?: HomePageModel["build"] }) {
  return (
    <Band
      id="work"
      label={<BandLabel title={<span className="text-geek-cyan">{content.title}</span>} sub={content.sub} href="#work" />}
      trailing={
        <p className="text-[11px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-graphite">
          {content.trailing}
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {buildStories.map((s, i) => (
          <a key={s.slug} href={`#work-${s.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:aspect-[3/4] lg:aspect-[4/3]">
              <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                <Media src={s.src} need={s.need} label={s.brand} caption={s.blurb} index={i} video={i === 0 ? VIDEO.build.desktop : undefined} />
              </div>
              {s.src && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-4">
                  <p className="font-display text-lg font-semibold text-white">{s.brand}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-geek-cyan-bright">{s.project}</p>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">{s.blurb}</p>
          </a>
        ))}
      </div>
    </Band>
  );
}
