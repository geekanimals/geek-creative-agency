import Link from "next/link";
import Media from "../ui/Media";
import { CaseStudy } from "@/lib/work/types";
import { categoryMap } from "@/lib/work/taxonomy";
import { canOpenCaseStudy, featuredStories } from "@/lib/work/projects";
import { trackAttr } from "@/lib/analytics";

function Story({ project, index, className = "" }: { project: CaseStudy; index: number; className?: string }) {
  const cat = project.businessCategory[0] ? categoryMap[project.businessCategory[0]] : "";
  const open = canOpenCaseStudy(project);
  const inner = (
    <>
      <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]">
        <Media src={project.heroImage} need={project.heroImageNeed} label={project.brand} index={index} showSlotLabel={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <span className="font-display text-sm font-bold text-white/50">{String(index + 1).padStart(2, "0")}</span>
        <div>
          {cat && <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-geek-cyan-bright">{cat}</span>}
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">{project.brand}</p>
          <h3 className="h-display text-2xl uppercase text-white sm:text-3xl">{project.project}</h3>
          <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition group-hover:text-white">
            {open ? "View Story →" : "Case study coming soon"}
          </span>
        </div>
      </div>
    </>
  );
  const cls = `group relative block overflow-hidden rounded-xl bg-ink ${className}`;
  if (!open) return <div className={`${cls} cursor-default`}>{inner}</div>;
  return (
    <Link href={`/work/${project.slug}`} className={`${cls} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-geek-cyan`} {...trackAttr("case_study_view", { slug: project.slug, from: "featured" })}>
      {inner}
    </Link>
  );
}

/** Featured Stories — an editorial composition, deliberately not a card grid.
 *  `stories` defaults to the static featured set; the server can pass a
 *  CMS-merged list. */
export default function FeaturedStories({ stories = featuredStories() }: { stories?: CaseStudy[] }) {
  if (stories.length < 3) return null;

  return (
    <section className="mx-auto max-w-edge px-5 pb-4 pt-2 sm:px-8">
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">Featured Stories</p>

      {/* desktop: asymmetric editorial composition */}
      <div className="hidden grid-cols-12 gap-4 md:grid">
        <Story project={stories[0]} index={0} className="col-span-7 min-h-[380px]" />
        <Story project={stories[1]} index={1} className="col-span-5 min-h-[380px]" />
        {stories[2] && <Story project={stories[2]} index={2} className="col-span-5 min-h-[300px]" />}
        {stories[3] && <Story project={stories[3]} index={3} className="col-span-7 min-h-[300px]" />}
      </div>

      {/* mobile: horizontal editorial swipe */}
      <div className="no-scrollbar -mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-5 md:hidden">
        {stories.map((p, i) => (
          <Story key={p.slug} project={p} index={i} className="aspect-[4/5] w-[82vw] shrink-0 snap-start" />
        ))}
      </div>
    </section>
  );
}
