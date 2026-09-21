import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { ResolvedProject } from "@/lib/cms/projects";
import { resolveMedia, type MediaLike } from "@/lib/cms/media";
import RelatedAndNext from "./RelatedAndNext";

/* Resolve a block's media (CMS upload or legacy path) to a src/alt. */
function blockMedia(b: { media?: MediaLike; legacySrc?: string | null; alt?: string | null }) {
  return resolveMedia(b.media, b.legacySrc, b.alt);
}

function Figure({ m, className = "", ratio = "16/9" }: { m: ReturnType<typeof blockMedia>; className?: string; ratio?: string }) {
  if (!m) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <div className={`relative overflow-hidden rounded-lg bg-mist ${className}`} style={{ aspectRatio: ratio }}>
      <img src={m.src} alt={m.alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
    </div>
  );
}

type SectionBlock = NonNullable<ResolvedProject["sections"]>[number];

/**
 * Semantic tone resolution for Lay's Heartwork editorial blocks.
 * Determines tone from block content/identity rather than array index.
 * Dark sections: Chapter 01, 03, 05, Metrics, Chapter 07 (and retailer artwork if present), Chapter 09.
 * All other Heartwork sections default to light.
 */
function getHeartworkBlockTone(block: SectionBlock): "dark" | "light" {
  if (block.blockType === "sectionIntro") {
    const eyebrow = block.eyebrow ?? "";
    if (
      eyebrow.includes("CHAPTER 01") ||
      eyebrow.includes("CHAPTER 03") ||
      eyebrow.includes("CHAPTER 05") ||
      eyebrow.includes("CHAPTER 07") ||
      eyebrow.includes("CHAPTER 09")
    ) {
      return "dark";
    }
    return "light";
  }

  if (block.blockType === "metrics") {
    return "dark";
  }

  if (block.blockType === "mediaBlock") {
    const src = block.legacySrc ?? "";
    if (src.includes("retailers")) {
      return "dark";
    }
    return "light";
  }

  return "light";
}

/**
 * FLEXIBLE renderer — composes a project from CMS `sections` blocks. Content
 * semantics come from the CMS; all styling lives here (React owns presentation).
 * Uses the site's existing design tokens so it reads as part of the Geek site.
 */
export default function FlexibleCaseStudy({ project }: { project: ResolvedProject }) {
  const sections = project.sections ?? [];
  const hero = resolveMedia(undefined, project.heroImage);
  const isHeartwork = project.slug === "lays-heartwork";

  return (
    <article>
      {/* HERO */}
      <header className="mx-auto max-w-edge px-5 pt-24 sm:px-8 sm:pt-28">
        <div className="py-8">
          <Link href={`/work?brand=${project.brandSlug}`} className="text-sm font-semibold uppercase tracking-[0.16em] text-geek-deep hover:text-geek-cyan">
            {project.brand}
            {project.year ? <span className="text-graphite"> · {project.year}</span> : null}
          </Link>
          <h1 className="h-display mt-3 text-[clamp(2.4rem,6vw,5rem)] uppercase text-ink">{project.headline}</h1>
          {project.oneLineSummary && <p className="mt-4 max-w-[46ch] text-lg text-graphite sm:text-xl">{project.oneLineSummary}</p>}
        </div>
        {hero && (
          <div className="relative w-full overflow-hidden rounded-xl bg-ink" style={{ aspectRatio: "16/9" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.src} alt={hero.alt || project.project} className="h-full w-full object-cover" />
          </div>
        )}
      </header>

      {/* SECTIONS */}
      <div className="border-t border-mist [&>section]:border-t [&>section]:border-black/5">
        {sections.map((block, i) => {
          const key = `${block.blockType}-${i}`;
          const isDark = isHeartwork && getHeartworkBlockTone(block) === "dark";

          switch (block.blockType) {
            case "sectionIntro":
              return (
                <section key={key} className={isDark ? "bg-ink text-white" : "bg-white text-ink"}>
                  <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
                    {block.eyebrow && (
                      <p className={`mb-4 text-xs font-bold uppercase tracking-[0.2em] ${isDark ? "text-geek-cyan-bright" : "text-geek-cyan"}`}>
                        {block.eyebrow}
                      </p>
                    )}
                    <h2 className={`h-display max-w-[20ch] text-[clamp(2rem,5vw,4rem)] uppercase ${isDark ? "text-white" : "text-ink"}`}>
                      {block.heading}
                    </h2>
                    {block.body && (
                      <p className={`mt-5 max-w-[60ch] text-lg leading-relaxed ${isDark ? "text-white/80" : "text-graphite"}`}>
                        {block.body}
                      </p>
                    )}
                  </div>
                </section>
              );
            case "richText":
              return (
                <section key={key} className={isDark ? "bg-ink text-white" : "bg-white"}>
                  <div className={`prose-geek mx-auto max-w-[70ch] px-5 py-14 text-lg leading-relaxed sm:px-8 ${isDark ? "text-white/80" : "text-ink/80"}`}>
                    <RichText data={block.content} />
                  </div>
                </section>
              );
            case "mediaBlock":
              return (
                <section key={key} className={isDark ? "bg-ink" : "bg-white"}>
                  <div className="mx-auto max-w-edge px-5 py-12 sm:px-8">
                    <Figure m={blockMedia(block)} />
                    {(block.caption || block.credit) && (
                      <p className={`mt-3 text-[11px] ${isDark ? "text-white/60" : "text-graphite"}`}>
                        {[block.caption, block.credit].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </section>
              );
            case "fullBleedMedia": {
              const m = blockMedia(block);
              return (
                <section key={key} className="relative bg-ink">
                  {m && (
                    <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.src} alt={m.alt} className="h-full w-full object-cover" loading="lazy" />
                      {block.overlayHeading && (
                        <div className="absolute inset-0 flex items-center bg-ink/30">
                          <div className="mx-auto w-full max-w-edge px-5 sm:px-8">
                            <h2 className="h-display max-w-[16ch] text-[clamp(2rem,6vw,5rem)] uppercase text-white">{block.overlayHeading}</h2>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            }
            case "splitContent": {
              const m = blockMedia(block);
              const mediaRight = block.mediaSide === "right";
              return (
                <section key={key} className={isDark ? "bg-ink text-white" : "bg-white"}>
                  <div className="mx-auto grid max-w-edge grid-cols-1 items-center gap-8 px-5 py-16 sm:px-8 md:grid-cols-2">
                    <div className={mediaRight ? "md:order-2" : ""}><Figure m={m} ratio="4/5" /></div>
                    <div className={`prose-geek text-lg leading-relaxed ${isDark ? "text-white/80" : "text-ink/80"}`}><RichText data={block.content} /></div>
                  </div>
                </section>
              );
            }
            case "mediaGallery":
              return (
                <section key={key} className={isDark ? "bg-ink text-white" : "bg-white"}>
                  <div className="mx-auto max-w-edge px-5 py-16 sm:px-8">
                    {block.heading && (
                      <p className={`mb-6 text-xs font-bold uppercase tracking-[0.2em] ${isDark ? "text-geek-cyan-bright" : "text-geek-cyan"}`}>
                        {block.heading}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {(block.items ?? []).map((it, j) => <Figure key={j} m={blockMedia(it)} ratio="1/1" />)}
                    </div>
                  </div>
                </section>
              );
            case "metrics":
              return (
                <section key={key} className={isDark ? "bg-ink text-white" : "bg-paper"}>
                  <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-20">
                    {block.heading && (
                      <p className={`mb-8 text-xs font-bold uppercase tracking-[0.2em] ${isDark ? "text-geek-cyan-bright" : "text-geek-cyan"}`}>
                        {block.heading}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                      {(block.items ?? []).map((s, j) => (
                        <div key={j}>
                          <div className="h-display text-[clamp(2.6rem,7vw,5.5rem)] leading-none text-geek-cyan">
                            {s.prefix}{s.value}{s.suffix}
                          </div>
                          <p className={`mt-3 text-sm font-semibold uppercase tracking-[0.14em] ${isDark ? "text-white/90" : "text-graphite"}`}>{s.label}</p>
                          {s.note && <p className={`mt-1 text-[11px] ${isDark ? "text-white/60" : "text-graphite/70"}`}>{s.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            case "quote":
              return (
                <section key={key} className="bg-ink text-white">
                  <div className="mx-auto max-w-edge px-5 py-20 text-center sm:px-8">
                    <p className="h-display mx-auto max-w-[24ch] text-[clamp(1.6rem,4vw,3rem)] uppercase">“{block.quote}”</p>
                    {block.attribution && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-geek-cyan-bright">{block.attribution}</p>}
                  </div>
                </section>
              );
            case "cta":
              return (
                <section key={key} className={isDark ? "bg-ink text-white" : "bg-white text-ink"}>
                  <div className="mx-auto max-w-edge px-5 py-20 text-center sm:px-8">
                    <h2 className={`h-display mx-auto max-w-[20ch] text-[clamp(1.8rem,5vw,3.6rem)] uppercase ${isDark ? "text-white" : "text-ink"}`}>{block.heading}</h2>
                    {block.body && <p className={`mx-auto mt-5 max-w-[52ch] text-lg ${isDark ? "text-white/80" : "text-graphite"}`}>{block.body}</p>}
                    {block.buttonHref && block.buttonLabel && (
                      <Link href={block.buttonHref} className="mt-8 inline-block rounded-full bg-geek-cyan px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition hover:bg-geek-deep hover:text-white">
                        {block.buttonLabel}
                      </Link>
                    )}
                  </div>
                </section>
              );
            default:
              return null;
          }
        })}
      </div>

      <RelatedAndNext project={project} />
    </article>
  );
}
