import Link from "next/link";
import { notFound } from "next/navigation";
import WorkCrumbs from "@/components/work/browse/WorkCrumbs";
import WorkExplorer from "@/components/work/list/WorkExplorer";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { getWorkProjects } from "@/lib/cms/projects";
import {
  WORK_DIMENSIONS,
  projectsForFilters,
  resolveWorkPath,
  workPathHref,
  workPathMenu,
  workValueSlugs,
} from "@/lib/work/routes";
import { ogFallback } from "@/lib/seo/ogImage";
import { seoDescription } from "@/lib/seo/description";
import { tileFields } from "@/lib/work/tileFields";

/** Every single-value /work/<value> slug — merged into /work/[slug]'s generateStaticParams. */
export async function workValueParams() {
  return workValueSlugs(await getWorkProjects());
}

/** What /work/<a>/<b>/… means: { filters, story } or null (404). */
export async function resolveWorkSegments(segments) {
  return resolveWorkPath(segments, await getWorkProjects());
}

/** Canonical URL for a set of filters: dimension order (category, brand, service, campaign). */
function canonicalHref(filters) {
  const order = WORK_DIMENSIONS.map((d) => d.key);
  const sorted = [...filters].sort(
    (a, b) => order.indexOf(a.dimension.key) - order.indexOf(b.dimension.key),
  );
  return workPathHref(sorted.map((f) => f.option.slug));
}

const joinLabels = (filters) => filters.map((f) => f.option.label).join(" × ");

/** Metadata for a filter page (/work/fmcg, /work/fmcg/lays). */
export async function workFilterMetadata(segments) {
  const projects = await getWorkProjects();
  const resolved = resolveWorkPath(segments, projects);
  if (!resolved || resolved.story || resolved.filters.length === 0) {
    return { title: "Work — Geek Creative Agency" };
  }
  const { filters } = resolved;
  const count = projectsForFilters(filters, projects).length;
  const name = joinLabels(filters);
  const title = `${name} Work — Geek Creative Agency`;
  const brands = [
    ...new Set(
      projectsForFilters(filters, projects)
        .map((p) => p.brand)
        .filter(Boolean),
    ),
  ];
  const brandList = brands.length
    ? ` for ${brands.slice(0, 4).join(", ")}${brands.length > 4 ? " and more" : ""}`
    : "";
  const description = seoDescription(
    `${name} work by Geek Creative Agency: ${count} ${count === 1 ? "case study" : "case studies"}${brandList}.`,
    "Strategy, campaigns, content and creators that made brands matter.",
  );
  const canonical = canonicalHref(filters);
  const cover = filters[filters.length - 1].option.cover;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: cover ? [{ url: cover }] : ogFallback(title, "The Work"),
    },
  };
}

/**
 * A filter page — /work/fmcg, or stacked in the order picked: /work/fmcg/lays.
 * Same filter bar and grid as /work; every link keeps the current path, and case
 * studies open underneath it (/work/fmcg/lays/<story>). 404 when nothing matches.
 */
export default async function WorkFilterPage({ segments }) {
  const projects = await getWorkProjects();
  const resolved = resolveWorkPath(segments, projects);
  if (!resolved || resolved.story || resolved.filters.length === 0) notFound();

  const { filters } = resolved;
  const slugs = filters.map((f) => f.option.slug);
  const here = workPathHref(slugs);
  const results = projectsForFilters(filters, projects);
  if (results.length === 0) notFound();

  const menu = workPathMenu(filters, projects);
  const last = filters[filters.length - 1];
  const lastGroup = menu.find((g) => g.key === last.dimension.key);
  const others = lastGroup.items.filter((o) => o.slug !== last.option.slug);
  const chips = filters.map((f, i) => ({
    key: f.dimension.key,
    label: f.option.label,
    href: workPathHref(slugs.filter((_, j) => j !== i)),
  }));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    ...filters.map((f, i) => ({ name: f.option.label, path: workPathHref(slugs.slice(0, i + 1)) })),
  ];

  return (
    <>
      <style href="wdp" precedence="default">
        {styles}
      </style>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <main id="main" className="wdp">
        <section className="wdp-container wdp__hero">
          <WorkCrumbs items={crumbs.slice(1)} />
          <p className="wdp__eyebrow">{filters.map((f) => f.dimension.label).join(" · ")}</p>
          <h1 className="wdp-display wdp__title">{joinLabels(filters)}.</h1>
          <p className="wdp__lede">
            {results.length} {results.length === 1 ? "project" : "projects"} from Geek.
          </p>
        </section>

        <WorkExplorer
          projects={results.map(tileFields)}
          total={projects.length}
          menu={menu}
          chips={chips}
          basePath={here}
        />

        {others.length > 0 && (
          <section className="wdp__more">
            <div className="wdp-container">
              <div className="wdp__more-head">
                <h2 className="wdp-display wdp__more-title">More {last.dimension.plural}.</h2>
              </div>
              <ul className="wdp__chips">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={o.href} className="wdp__chip">
                      {o.label}
                      <span className="wdp__chip-count">{o.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

const styles = `
.wdp {
  padding-top: 6rem;
}

.wdp__hero {
  padding-top: 1.5rem;
  padding-bottom: 2rem;
}

.wdp__eyebrow {
  margin-top: 1.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #32c1df;
}

.wdp__title {
  overflow-wrap: anywhere;
  margin-top: 0.75rem;
  font-size: clamp(2.6rem, 7vw, 6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.wdp__lede {
  margin-top: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #5a5f5c;
}

.wdp__more {
  border-top: 1px solid #eceeeb;
  padding-top: 3rem;
  padding-bottom: 5rem;
}

.wdp__more-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.wdp__more-title {
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.wdp__chips {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.wdp__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #eceeeb;
  border-radius: 9999px;
  padding: 0.5rem 0.875rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0c0d0c;
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.wdp__chip:hover {
  border-color: #32c1df;
  color: #137c93;
}

.wdp__chip-count {
  color: #9aa09c;
  font-variant-numeric: tabular-nums;
}

/* ---- type/layout helpers (local copy) ---- */
.wdp-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .wdp-container {
    padding-inline: 20px;
  }
}

.wdp-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .wdp {
    padding-top: 7rem;
  }

  .wdp__hero {
    padding-bottom: 2.5rem;
  }

  .wdp__lede {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .wdp__more-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}
`;
