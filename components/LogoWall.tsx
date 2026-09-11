"use client";

import Marquee from "./ui/Marquee";
import { HighlightedLines } from "./content/HighlightedLines";
import { clients } from "@/lib/data/clients";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";

function Logo({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex h-16 w-40 shrink-0 items-center justify-center px-5">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={name}
          className="max-h-8 w-auto opacity-45 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
          loading="lazy"
        />
      ) : (
        <span className="whitespace-nowrap font-display text-xl font-semibold tracking-tight text-graphite/45 transition-colors duration-300 hover:text-ink">
          {name}
        </span>
      )}
    </div>
  );
}

export default function LogoWall({ content = HOME_FALLBACK.logoWall }: { content?: HomePageModel["logoWall"] }) {
  return (
    <section className="border-t border-mist bg-white py-8">
      <p className="mb-6 text-center text-sm font-bold uppercase tracking-[0.14em] text-ink">
        <HighlightedLines text={content.heading} highlight={content.headingHighlight} />
      </p>
      <Marquee>
        {clients.map((c) => (
          <Logo key={c.slug} name={c.name} logo={c.logo} />
        ))}
        <div className="flex h-16 w-40 shrink-0 items-center justify-center px-5">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-geek-cyan">&amp; more</span>
        </div>
      </Marquee>
    </section>
  );
}
