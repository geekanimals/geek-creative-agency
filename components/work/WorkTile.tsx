import Link from "next/link";
import Media from "../ui/Media";
import { CaseStudy } from "@/lib/work/types";
import { categoryMap } from "@/lib/work/taxonomy";
import { canOpenCaseStudy } from "@/lib/work/projects";
import { trackAttr } from "@/lib/analytics";

/** A single work tile. Published → links to the story; draft → non-clickable placeholder. */
export default function WorkTile({ project, index = 0 }: { project: CaseStudy; index?: number }) {
  const category = project.businessCategory[0] ? categoryMap[project.businessCategory[0]] : "";
  const open = canOpenCaseStudy(project);

  const visual = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink">
      <div className="h-full w-full transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]">
        <Media src={project.heroImage} need={project.heroImageNeed} label={project.brand} index={index} showSlotLabel={false} />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        {category && <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-geek-cyan-bright">{category}</span>}
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">{project.brand}</span>
        <span className="font-display text-lg font-semibold leading-tight text-white">{project.project}</span>
        <span className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
          {open ? "View Story →" : "Case study coming soon"}
        </span>
      </div>
    </div>
  );

  if (!open) {
    return (
      <div className="group block cursor-default" aria-label={`${project.brand} — ${project.project} (case study coming soon)`}>
        {visual}
      </div>
    );
  }

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-geek-cyan"
      {...trackAttr("case_study_view", { slug: project.slug, from: "work_grid" })}
    >
      {visual}
    </Link>
  );
}
