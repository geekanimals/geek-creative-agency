import Link from "next/link";

/**
 * Internal-linking block for STANDARD/FLEXIBLE case studies only — never
 * rendered on flagship pages (flagship art direction is untouched). Surfaces the
 * project's portfolio relationships as a linear discovery trail + link chips.
 * Renders nothing when the project has no relationships (e.g. static entries).
 */
export default function ProjectDiscovery({ project }) {
  const industry = project.industries?.[0];
  const service = project.serviceRefs?.[0];
  const trail = [
    industry && { name: industry.name, href: `/industries/${industry.slug}` },
    project.companyRef && {
      name: project.companyRef.name,
      href: `/companies/${project.companyRef.slug}`,
    },
    project.brandRef && {
      name: project.brandRef.name,
      href: `/brands/${project.brandRef.slug}`,
    },
    service && { name: service.name, href: `/services/${service.slug}` },
    project.solutionRefs?.[0] && {
      name: project.solutionRefs[0].name,
      href: `/solutions/${project.solutionRefs[0].slug}`,
    },
  ].filter(Boolean);

  // All refs here are already routability-gated in fromCms — every link resolves.
  const hasAny =
    (project.industries?.length ?? 0) +
      (project.solutionRefs?.length ?? 0) +
      (project.serviceRefs?.length ?? 0) >
      0 ||
    !!project.companyRef ||
    !!project.brandRef;
  if (!hasAny) return null;

  const chip = "pdisc__chip";

  return (
    <section className="pdisc-container pdisc">
      <style href="pdisc" precedence="default">
        {styles}
      </style>
      {trail.length > 1 && (
        <ol className="pdisc__trail">
          {trail.map((t, i) => (
            <li key={t.href} className="pdisc__step">
              {i > 0 && (
                <span aria-hidden className="pdisc__arrow">
                  →
                </span>
              )}
              <Link href={t.href} className="pdisc__step-link">
                {t.name}
              </Link>
            </li>
          ))}
        </ol>
      )}
      <h2 className="pdisc__title">Explore</h2>
      <div className="pdisc__chips">
        {project.companyRef && (
          <Link href={`/companies/${project.companyRef.slug}`} className={chip}>
            {project.companyRef.name}
          </Link>
        )}
        {project.brandRef && (
          <Link href={`/brands/${project.brandRef.slug}`} className={chip}>
            {project.brandRef.name}
          </Link>
        )}
        {project.industries?.map((i) => (
          <Link key={i.slug} href={`/industries/${i.slug}`} className={chip}>
            {i.name}
          </Link>
        ))}
        {project.serviceRefs?.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className={chip}>
            {s.name}
          </Link>
        ))}
        {project.solutionRefs?.map((s) => (
          <Link key={s.slug} href={`/solutions/${s.slug}`} className={chip}>
            {s.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

const styles = `
.pdisc {
  border-top: 1px solid #eceeeb;
  padding-block: 2.5rem;
}

.pdisc__trail {
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #5a5f5c;
}

.pdisc__step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pdisc__arrow {
  color: #eceeeb;
}

.pdisc__step-link {
  margin-block: -0.5rem;
  display: inline-block;
  padding-block: 0.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.pdisc__step-link:hover {
  color: #32c1df;
}

.pdisc__title {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #137c93;
}

.pdisc__chips {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pdisc__chip {
  border: 1px solid #eceeeb;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #0c0d0c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.pdisc__chip:hover {
  border-color: #32c1df;
  color: #32c1df;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.pdisc-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .pdisc-container {
    padding-inline: 20px;
  }
}
`;
