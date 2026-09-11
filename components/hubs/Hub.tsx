import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import Media from "@/components/ui/Media";
import type { EntityRef, ProjectCard } from "@/lib/cms/portfolio";

/** Page shell shared by every portfolio hub. React owns all art direction; the
 *  CMS only supplies copy + relationships. */
export function HubShell({ draft, children }: { draft: boolean; children: ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main" className="pt-24 sm:pt-28">
        {draft && (
          <div className="bg-amber-400 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink">
            Preview — draft (not public)
          </div>
        )}
        {children}
      </main>
      <EndFooter />
    </>
  );
}

/** Linear discovery trail: Industry → Company → Brand → Service → Solution.
 *  Only shows the steps that exist (no empty/irrelevant steps). */
export function HubTrail({ items }: { items: { name: string; href?: string }[] }) {
  const shown = items.filter((i) => i.name);
  if (shown.length === 0) return null;
  return (
    <nav aria-label="Discovery trail" className="mx-auto max-w-edge px-5 pt-6 sm:px-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-graphite">
        {shown.map((i, n) => (
          <Fragment key={`${i.name}-${n}`}>
            {n > 0 && <li aria-hidden className="text-mist">→</li>}
            <li>{i.href ? <Link href={i.href} className="transition hover:text-geek-cyan">{i.name}</Link> : <span className="text-ink">{i.name}</span>}</li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

export function HubHero({ eyebrow, title, summary }: { eyebrow?: string; title: string; summary?: string }) {
  return (
    <section className="mx-auto max-w-edge px-5 py-8 sm:px-8 sm:py-12">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">{eyebrow}</p>}
      <h1 className="h-display mt-3 text-[clamp(2.4rem,6vw,5rem)] uppercase text-ink">{title}</h1>
      {summary && <p className="mt-4 max-w-[60ch] text-lg text-graphite">{summary}</p>}
    </section>
  );
}

export function HubSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-edge border-t border-mist px-5 py-10 sm:px-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-geek-deep">{heading}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Prose({ text }: { text: string }) {
  return <p className="max-w-[68ch] text-base leading-relaxed text-ink/80">{text}</p>;
}

/** Pill links to related entities. */
export function RefChips({ items, routePrefix }: { items: EntityRef[]; routePrefix: string }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((r) => (
        <Link key={r.slug} href={`${routePrefix}/${r.slug}`} className="rounded-full border border-mist px-4 py-2 text-sm font-semibold text-ink transition hover:border-geek-cyan hover:text-geek-cyan">
          {r.name}
        </Link>
      ))}
    </div>
  );
}

/** Case-study cards → /work/[slug]. Never duplicates project copy. */
export function ProjectCardGrid({ projects }: { projects: ProjectCard[] }) {
  if (!projects.length) return null;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <Link key={p.slug} href={`/work/${p.slug}`} className="group block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink">
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]">
              <Media src={p.heroImage} label={p.title} index={i} showSlotLabel={false} />
            </div>
          </div>
          {p.brand && <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-geek-deep">{p.brand}</p>}
          <h3 className="mt-1 font-display text-lg font-semibold text-ink group-hover:text-geek-cyan">{p.title}</h3>
        </Link>
      ))}
    </div>
  );
}
