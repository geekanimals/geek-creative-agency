"use client";

import Band, { BandLabel } from "./ui/Band";
import Media from "./ui/Media";
import { HighlightedLines } from "./content/HighlightedLines";
import { createGallery } from "@/lib/data/work";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

export default function Create({ content = HOME_FALLBACK.create }: { content?: HomePageModel["create"] }) {
  return (
    <Band
      label={<BandLabel title={<span className="text-geek-cyan">{content.title}</span>} sub={<HighlightedLines text={content.sub} />} href="#work" />}
    >
      <div className="no-scrollbar -mr-5 flex snap-x gap-3 overflow-x-auto pr-5 sm:-mr-8 sm:pr-8">
        {createGallery.map((w, i) => (
          <a key={w.slug} href={`#work-${w.slug}`} className="group relative aspect-[4/5] w-40 shrink-0 snap-start overflow-hidden rounded-lg sm:w-48">
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
              <Media src={w.src} need={w.need} label={w.brand} index={i} />
            </div>
            {w.src && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-3">
                <p className="text-sm font-semibold text-white">{w.brand}</p>
              </div>
            )}
          </a>
        ))}
      </div>
    </Band>
  );
}
