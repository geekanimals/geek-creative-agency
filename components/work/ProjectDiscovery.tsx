import Link from "next/link";
import type { ResolvedProject } from "@/lib/cms/projects";

/**
 * Internal-linking block for STANDARD/FLEXIBLE case studies only — never
 * rendered on flagship pages (flagship art direction is untouched). Surfaces the
 * project's portfolio relationships as a linear discovery trail + link chips.
 * Renders nothing when the project has no relationships (e.g. static entries).
 */
export default function ProjectDiscovery({ project }: { project: ResolvedProject }) {
  const industry = project.industries?.[0];
  const service = project.serviceRefs?.[0];
  const trail = [
    industry && { name: industry.name, href: `/industries/${industry.slug}` },
    project.companyRef && { name: project.companyRef.name, href: `/companies/${project.companyRef.slug}` },
    project.brandRef && { name: project.brandRef.name, href: `/brands/${project.brandRef.slug}` },
    service && { name: service.name, href: `/services/${service.slug}` },
    project.solutionRefs?.[0] && { name: project.solutionRefs[0].name, href: `/solutions/${project.solutionRefs[0].slug}` },
  ].filter(Boolean) as { name: string; href: string }[];

  // All refs here are already routability-gated in fromCms — every link resolves.
  const hasAny =
    (project.industries?.length ?? 0) + (project.solutionRefs?.length ?? 0) + (project.serviceRefs?.length ?? 0) > 0 ||
    !!project.companyRef || !!project.brandRef;
  if (!hasAny) return null;

  const chip = "rounded-full border border-mist px-4 py-2 text-sm font-semibold text-ink transition hover:border-geek-cyan hover:text-geek-cyan";

  return (
    <section className="mx-auto max-w-edge border-t border-mist px-5 py-10 sm:px-8">
      {trail.length > 1 && (
        <ol className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-graphite">
          {trail.map((t, i) => (
            <li key={t.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-mist">→</span>}
              <Link href={t.href} className="transition hover:text-geek-cyan">{t.name}</Link>
            </li>
          ))}
        </ol>
      )}
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-geek-deep">Explore</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.companyRef && <Link href={`/companies/${project.companyRef.slug}`} className={chip}>{project.companyRef.name}</Link>}
        {project.brandRef && <Link href={`/brands/${project.brandRef.slug}`} className={chip}>{project.brandRef.name}</Link>}
        {project.industries?.map((i) => <Link key={i.slug} href={`/industries/${i.slug}`} className={chip}>{i.name}</Link>)}
        {project.serviceRefs?.map((s) => <Link key={s.slug} href={`/services/${s.slug}`} className={chip}>{s.name}</Link>)}
        {project.solutionRefs?.map((s) => <Link key={s.slug} href={`/solutions/${s.slug}`} className={chip}>{s.name}</Link>)}
      </div>
    </section>
  );
}
