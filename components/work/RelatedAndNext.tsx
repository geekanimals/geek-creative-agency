import Link from "next/link";
import Media from "../ui/Media";
import { CaseStudy as CaseStudyType } from "@/lib/work/types";
import { categoryMap, campaignMap } from "@/lib/work/taxonomy";
import { relatedProjects, nextProjectFor } from "@/lib/work/filters";
import { trackAttr } from "@/lib/analytics";

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

/**
 * Shared "More Like This" + "Next Project" footer for every case study.
 * Uses the central related/next logic (a project never recommends itself,
 * and the Next module is hidden when no other published project exists).
 */
export default function RelatedAndNext({ project }: { project: CaseStudyType }) {
  const related = relatedProjects(project, 3);
  const next = nextProjectFor(project);
  return (
    <>
      {related.length > 0 && (
        <section className="border-t border-mist bg-white">
          <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-20">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">More Like This</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p, i) => (
                <RelatedTile key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

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
    </>
  );
}
