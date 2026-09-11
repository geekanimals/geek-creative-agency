import Link from "next/link";
import Media from "../ui/Media";
import { CaseStudy as CaseStudyType, ContentBlock, MediaRef, BlockTone } from "@/lib/work/types";
import { categoryMap, serviceMap, campaignMap } from "@/lib/work/taxonomy";
import { relatedProjects, nextProjectFor } from "@/lib/work/filters";
import { trackAttr } from "@/lib/analytics";

/* ── tone system (Geek palette + authentic Miller heritage palette) ─────── */

const TONE: Record<BlockTone, string> = {
  light: "bg-white text-ink",
  paper: "bg-paper text-ink",
  dark: "bg-ink text-white",
  navy: "bg-geek-navy text-white",
  miller: "text-[#F4ECD6]", // cream on near-black (bg set inline)
};
const MILLER_BG = "#0a0806";
const MILLER_GOLD = "#C8A24B";
const isDarkTone = (t?: BlockTone) => t === "dark" || t === "navy" || t === "miller";
function accentColor(tone?: BlockTone) {
  if (tone === "miller") return MILLER_GOLD;
  return "#32C1DF"; // geek cyan
}

/** Renders text with \n line-breaks and an optional accent phrase highlighted. */
function Lines({ text, accent, tone }: { text: string; accent?: string; tone?: BlockTone }) {
  const color = accentColor(tone);
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {accent && line.includes(accent)
            ? line.split(accent).map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && <span style={{ color }}>{accent}</span>}
                </span>
              ))
            : line}
        </span>
      ))}
    </>
  );
}

/** Full-bleed section wrapper with tone background. */
function Bleed({ tone = "light", children, className = "" }: { tone?: BlockTone; children: React.ReactNode; className?: string }) {
  const style = tone === "miller" ? { backgroundColor: MILLER_BG } : undefined;
  return (
    <section className={`${TONE[tone]} ${className}`} style={style}>
      <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">{children}</div>
    </section>
  );
}

/* ── small helpers ─────────────────────────────────────────────────────── */

function Frame({ media, index = 0, ratio, label, caption }: { media: MediaRef; index?: number; ratio?: string; label?: string; caption?: string }) {
  // Archival media never crops text/UI: contain by default; opt out with contain:false (e.g. film).
  const contain = media.contain !== false && !media.video;
  return (
    <figure>
      <div
        className={`relative w-full overflow-hidden rounded-lg ring-1 ring-black/5 ${contain ? "bg-paper" : "bg-ink"}`}
        style={{ aspectRatio: ratio || media.ratio || "16/9" }}
      >
        <Media src={media.src} need={media.need} label={media.alt} index={index} showSlotLabel video={media.video} videoMobile={media.videoMobile} contain={contain} />
      </div>
      {(label || caption) && (
        <figcaption className="mt-2 flex flex-wrap items-center gap-x-3 text-[11px] text-graphite">
          {label && <span className="font-bold uppercase tracking-[0.14em] text-geek-deep">{label}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

function MetaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-mist px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite transition-colors hover:border-geek-cyan hover:text-geek-deep"
    >
      {children}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">{children}</p>;
}

/** Draft copy is shown ONLY in development, never in production. */
const DEV = process.env.NODE_ENV !== "production";

function DraftNote({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`mt-5 rounded-md border border-dashed p-4 text-sm ${dark ? "border-white/25 text-white/70" : "border-amber-400/60 text-graphite"}`}>
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-amber-500">Draft — not final · dev only</span>
      {children}
    </div>
  );
}

/* ── editorial + media block renderer (self-contained, full-bleed) ──────── */

const SIZE = {
  big: "text-[clamp(1.9rem,4.5vw,3.4rem)]",
  giant: "text-[clamp(2.4rem,6vw,5rem)]",
  mega: "text-[clamp(2.8rem,8vw,7rem)]",
};

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "statement":
      return (
        <Bleed tone={block.tone}>
          <h2 className={`h-display max-w-[20ch] uppercase leading-[0.95] ${SIZE[block.size ?? "giant"]}`}>
            <Lines text={block.text} accent={block.accent} tone={block.tone} />
          </h2>
          {block.sub && (
            <p className={`mt-6 max-w-[60ch] text-lg leading-relaxed ${isDarkTone(block.tone) ? "text-white/70" : "text-graphite"}`}>{block.sub}</p>
          )}
        </Bleed>
      );

    case "vs":
      return (
        <Bleed tone={block.tone ?? "navy"}>
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
            <div className="text-center sm:text-right">
              <p className="h-display text-[clamp(1.8rem,4vw,3rem)] uppercase">{block.left.big}</p>
              {block.left.small && <p className="mt-2 text-sm uppercase tracking-[0.12em] text-white/55">{block.left.small}</p>}
            </div>
            <div className="text-center text-sm font-bold uppercase tracking-[0.24em] text-geek-cyan-bright">vs</div>
            <div className="text-center sm:text-left">
              <p className="h-display text-[clamp(1.8rem,4vw,3rem)] uppercase">{block.right.big}</p>
              {block.right.small && <p className="mt-2 text-sm uppercase tracking-[0.12em] text-white/55">{block.right.small}</p>}
            </div>
          </div>
          {block.note && <p className="mx-auto mt-8 max-w-[52ch] text-center text-sm text-white/50">{block.note}</p>}
        </Bleed>
      );

    case "stat-band":
      return (
        <Bleed tone={block.tone ?? "light"}>
          {block.heading && <SectionLabel>{block.heading}</SectionLabel>}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {block.stats.map((s) => (
              <div key={s.label}>
                <div className={`h-display text-[clamp(2.6rem,7vw,5.5rem)] leading-none ${block.tone === "miller" ? "" : "text-geek-cyan"}`} style={block.tone === "miller" ? { color: MILLER_GOLD } : undefined}>
                  {s.value}
                </div>
                <div className="mt-3 h-px w-12" style={{ backgroundColor: accentColor(block.tone) }} />
                <p className={`mt-3 text-sm font-semibold uppercase tracking-[0.14em] ${isDarkTone(block.tone) ? "text-white/70" : "text-graphite"}`}>{s.label}</p>
                {s.note && <p className={`mt-1 text-[11px] ${isDarkTone(block.tone) ? "text-white/40" : "text-graphite/70"}`}>{s.note}</p>}
              </div>
            ))}
          </div>
          {block.note && <p className={`mt-8 text-xs uppercase tracking-[0.12em] ${isDarkTone(block.tone) ? "text-white/40" : "text-graphite/70"}`}>{block.note}</p>}
        </Bleed>
      );

    case "steps":
      return (
        <Bleed tone={block.tone ?? "paper"}>
          {block.heading && <SectionLabel>{block.heading}</SectionLabel>}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {block.items.map((it, i) => (
              <span key={i} className={`h-display text-2xl uppercase sm:text-3xl ${isDarkTone(block.tone) ? "text-white/90" : "text-ink"}`}>
                {it}
                {i < block.items.length - 1 && <span className="ml-8 text-geek-cyan">·</span>}
              </span>
            ))}
          </div>
        </Bleed>
      );

    case "funnel":
      return (
        <Bleed tone={block.tone ?? "dark"}>
          <div className="mx-auto flex max-w-[24ch] flex-col items-center gap-4 text-center">
            {block.items.map((it, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <span className="h-display text-[clamp(1.8rem,5vw,3.4rem)] uppercase">{it}</span>
                {i < block.items.length - 1 && <span className="text-2xl text-geek-cyan" aria-hidden>↓</span>}
              </div>
            ))}
          </div>
          {block.note && <p className="mx-auto mt-8 max-w-[52ch] text-center text-sm text-white/50">{block.note}</p>}
        </Bleed>
      );

    case "award":
      return (
        <Bleed tone="navy">
          <div className="text-center">
            <p className="h-display text-[clamp(2.4rem,7vw,5rem)] uppercase" style={{ color: MILLER_GOLD }}>{block.medal}</p>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-geek-cyan-bright">{block.org} · {block.year}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-white/70">{block.category}</p>
            {block.project && <p className="mt-6 h-display text-2xl uppercase sm:text-3xl">{block.project}</p>}
            {block.note && <p className="mx-auto mt-6 max-w-[46ch] text-sm text-white/55">{block.note}</p>}
          </div>
        </Bleed>
      );

    // ── media blocks (constrained light containers) ──
    case "full-image":
    case "full-video":
      return (
        <Bleed tone="light">
          <Frame media={block.media} label={block.label} caption={block.caption} />
        </Bleed>
      );
    case "two-column":
      return (
        <Bleed tone="light">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Frame media={block.media[0]} ratio="1/1" />
            <Frame media={block.media[1]} ratio="1/1" index={1} />
          </div>
          {block.caption && <p className="mt-3 text-[11px] text-graphite">{block.caption}</p>}
        </Bleed>
      );
    case "image-copy":
      return (
        <Bleed tone="light">
          <div className={`grid grid-cols-1 items-center gap-6 md:grid-cols-2 ${block.side === "left" ? "" : "md:[&>*:first-child]:order-2"}`}>
            <Frame media={block.media} ratio={block.media.ratio || "4/5"} />
            <p className="text-lg leading-relaxed text-ink/80">{block.copy}</p>
          </div>
        </Bleed>
      );
    case "gallery-h":
      return (
        <Bleed tone="light">
          {block.label && <SectionLabel>{block.label}</SectionLabel>}
          <div className="no-scrollbar -mr-5 flex gap-4 overflow-x-auto pr-5 sm:-mr-8 sm:pr-8">
            {block.media.map((m, i) => (
              <div key={i} className="w-64 shrink-0 sm:w-72">
                <Frame media={m} ratio={m.ratio || "3/4"} index={i} />
              </div>
            ))}
          </div>
        </Bleed>
      );
    case "gallery-v":
      return (
        <Bleed tone="light">
          {block.label && <SectionLabel>{block.label}</SectionLabel>}
          <div className="grid grid-cols-1 gap-4">
            {block.media.map((m, i) => (
              <Frame key={i} media={m} index={i} />
            ))}
          </div>
        </Bleed>
      );
    case "creator-mosaic":
    case "social-grid":
      return (
        <Bleed tone="light">
          {"label" in block && block.label && <SectionLabel>{block.label}</SectionLabel>}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {block.media.map((m, i) => (
              <Frame key={i} media={m} ratio="1/1" index={i} />
            ))}
          </div>
        </Bleed>
      );
  }
}

/* ── related tile (visible tags, no explanatory text) ──────────────────── */

function RelatedTile({ project, index }: { project: CaseStudyType; index: number }) {
  const cat = project.businessCategory[0] ? categoryMap[project.businessCategory[0]] : "";
  const camp = project.campaignTypes[0] ? campaignMap[project.campaignTypes[0]] : "";
  return (
    <Link href={`/work/${project.slug}`} className="group block" {...trackAttr("case_study_view", { slug: project.slug, from: "more_like_this" })}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]">
          <Media src={project.heroImage} need={project.heroImageNeed} label={project.brand} index={index} showSlotLabel={false} />
        </div>
      </div>
      <p className="mt-3 font-display text-base font-semibold text-ink">{project.brand}</p>
      <p className="text-sm text-graphite">{project.project}</p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-geek-deep">
        {[cat, camp].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}

/* ── template ──────────────────────────────────────────────────────────── */

export default function CaseStudy({ project }: { project: CaseStudyType }) {
  const related = relatedProjects(project, 3);
  const next = nextProjectFor(project);

  return (
    <article>
      {/* HERO */}
      <header className="mx-auto max-w-edge px-5 pt-24 sm:px-8 sm:pt-28">
        <div className="py-8">
          <Link href={`/work?brand=${project.brandSlug}`} className="text-sm font-semibold uppercase tracking-[0.16em] text-geek-deep hover:text-geek-cyan">
            {project.brand}
            {project.year ? <span className="text-graphite"> · India · {project.year}</span> : null}
          </Link>
          <h1 className="h-display mt-3 text-[clamp(2.4rem,6vw,5rem)] uppercase text-ink">{project.headline}</h1>
          <p className="mt-4 max-w-[46ch] text-lg text-graphite sm:text-xl">{project.oneLineSummary}</p>
        </div>

        <div className="relative w-full overflow-hidden rounded-xl bg-ink" style={{ aspectRatio: "16/9" }}>
          <Media
            src={project.heroImage}
            need={project.heroImageNeed || "/assets/work/" + project.slug + "/hero.jpg"}
            label={`${project.brand} — ${project.project}`}
            showSlotLabel
            video={project.heroVideo}
            videoMobile={project.heroVideoMobile}
            priority
          />
        </div>

        {/* restrained, clickable metadata */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.businessCategory.map((s) => (
            <MetaLink key={s} href={`/work?category=${s}`}>{categoryMap[s] ?? s}</MetaLink>
          ))}
          {project.campaignTypes.map((s) => (
            <MetaLink key={s} href={`/work?campaign=${s}`}>{campaignMap[s] ?? s}</MetaLink>
          ))}
          {project.services.map((s) => (
            <MetaLink key={s} href={`/work?service=${s}`}>{serviceMap[s] ?? s}</MetaLink>
          ))}
        </div>
      </header>

      {project.storyPending ? (
        <div className="mx-auto max-w-edge px-5 py-16 sm:px-8">
          <p className="rounded-lg border border-mist bg-paper p-6 text-sm text-graphite">
            Full case study coming soon — this project is live in the Work index and filters. Story, imagery and any
            verified figures will be added here.
          </p>
        </div>
      ) : (
        <>
          {/* THE CHALLENGE */}
          {project.challenge && (
            <section className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
              <SectionLabel>The Challenge</SectionLabel>
              <h2 className="h-display max-w-[20ch] text-[clamp(1.9rem,4.5vw,3.6rem)] uppercase text-ink">{project.challenge.question}</h2>
              {project.challenge.copy && <p className="mt-6 max-w-[52ch] text-lg text-graphite">{project.challenge.copy}</p>}
              {!project.challenge.copy && DEV && project.draft?.challengeCopy && (
                <DraftNote>{project.draft.challengeCopy}</DraftNote>
              )}
            </section>
          )}

          {/* THE INSIGHT (optional) */}
          {(project.insight || (DEV && project.draft?.insight)) && (
            <section className="border-t border-mist bg-paper">
              <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
                <SectionLabel>The Insight</SectionLabel>
                {project.insight ? (
                  <p className="h-display max-w-[24ch] text-[clamp(1.6rem,3.5vw,2.8rem)] text-ink">{project.insight.copy}</p>
                ) : (
                  <DraftNote>{project.draft!.insight}</DraftNote>
                )}
              </div>
            </section>
          )}

          {/* THE IDEA */}
          {project.idea && (
            <section className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
              <SectionLabel>The Idea</SectionLabel>
              <h2 className="h-display max-w-[18ch] text-[clamp(2rem,5.5vw,4.4rem)] uppercase text-ink">{project.idea.statement}</h2>
              {project.idea.copy && <p className="mt-6 max-w-[52ch] text-lg text-graphite">{project.idea.copy}</p>}
              {!project.idea.copy && DEV && project.draft?.ideaCopy && <DraftNote>{project.draft.ideaCopy}</DraftNote>}
            </section>
          )}

          {/* THE STORY — flexible editorial blocks, each full-bleed & self-toned */}
          {project.execution && project.execution.length > 0 && (
            <div className="border-t border-mist [&>section]:border-t [&>section]:border-black/5">
              {project.execution.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </div>
          )}

          {/* WHAT GEEK DID */}
          {project.services.length > 0 && (
            <section className="border-t border-mist bg-ink text-white">
              <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-20">
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan-bright">What Geek Did</p>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {project.services.map((s) => (
                    <Link key={s} href={`/work?service=${s}`} className="h-display text-2xl uppercase text-white/90 transition-colors hover:text-geek-cyan sm:text-3xl">
                      {serviceMap[s] ?? s}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* THE IMPACT (only when real stats exist) */}
          {project.stats && project.stats.length > 0 && (
            <section className="border-t border-mist">
              <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
                <SectionLabel>The Impact</SectionLabel>
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                  {project.stats.map((st) => (
                    <div key={st.label}>
                      <div className="h-display text-[clamp(2.6rem,7vw,5rem)] leading-none text-geek-cyan">{st.value}</div>
                      <div className="mt-3 h-px w-12 bg-geek-cyan" />
                      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-graphite">{st.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* THE WORK gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="border-t border-mist">
              <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-20">
                <SectionLabel>The Work</SectionLabel>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.gallery.map((m, i) => (
                    <Frame key={i} media={m} index={i} ratio={m.ratio || "4/3"} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* QUOTE (optional) */}
          {project.quote && (
            <section className="border-t border-mist bg-paper">
              <div className="mx-auto max-w-edge px-5 py-16 text-center sm:px-8 sm:py-24">
                <p className="h-display mx-auto max-w-[26ch] text-[clamp(1.6rem,3.5vw,3rem)] text-ink">“{project.quote.text}”</p>
                {project.quote.attribution && <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-graphite">{project.quote.attribution}</p>}
              </div>
            </section>
          )}

          {/* WHY IT MATTERED */}
          {(project.whyItMattered || (DEV && project.draft?.whyItMattered)) && (
            <section className="border-t border-mist bg-geek-navy text-white">
              <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
                <SectionLabel>Why It Mattered</SectionLabel>
                {project.whyItMattered ? (
                  <p className="h-display max-w-[22ch] text-[clamp(1.8rem,4.5vw,3.6rem)] uppercase">{project.whyItMattered}</p>
                ) : (
                  <DraftNote dark>{project.draft!.whyItMattered}</DraftNote>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* MORE LIKE THIS */}
      {related.length > 0 && (
        <section className="border-t border-mist">
          <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-20">
            <SectionLabel>More Like This</SectionLabel>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p, i) => (
                <RelatedTile key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEXT PROJECT */}
      {next && (
        <section className="border-t border-mist">
          <Link href={`/work/${next.slug}`} className="group block" {...trackAttr("case_study_next_click", { from: project.slug, to: next.slug })}>
            <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden bg-ink">
              <div className="h-full w-full opacity-70 transition-all duration-[900ms] group-hover:scale-[1.05] group-hover:opacity-90">
                <Media src={next.heroImage} need={next.heroImageNeed} label={next.brand} showSlotLabel={false} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/30 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-geek-cyan-bright">Next Project</p>
                <p className="h-display mt-3 text-[clamp(1.8rem,5vw,4rem)] uppercase">{next.headline}</p>
                <span className="mt-4 text-sm font-semibold uppercase tracking-[0.14em]">View Story →</span>
              </div>
            </div>
          </Link>
        </section>
      )}
    </article>
  );
}
