import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getSolution, getSolutionSlugs } from "@/lib/cms/solutions";
import {
  HubShell,
  HubHero,
  HubSection,
  Prose,
  RefChips,
  ProjectCardGrid,
} from "@/components/hubs/Hub";
import { ogFallback } from "@/lib/seo/ogImage";
import { seoDescription } from "@/lib/seo/description";

export const dynamicParams = true;
export const revalidate = 3600; // ISR safety net; on-demand revalidation (Project/entity hooks) refreshes sooner

export async function generateStaticParams() {
  return (await getSolutionSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) return { title: "Solutions — Geek" };
  const title = s.seo.metaTitle || `${s.name} — Geek Creative Agency`;
  const description = seoDescription(
    s.seo.metaDescription || s.shortSummary || `${s.name}, a Geek solution.`,
  );
  return {
    title,
    description,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: {
      title,
      description,
      url: `/solutions/${s.slug}`,
      type: "website",
      images: s.seo.ogImage ? [{ url: s.seo.ogImage }] : ogFallback(title, "Solution"),
    },
    ...(s.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function SolutionPage({ params }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const s = await getSolution(slug, { draft });
  if (!s) notFound();

  return (
    <HubShell draft={draft}>
      <style href="solution-pg" precedence="default">
        {styles}
      </style>
      <HubHero
        eyebrow={
          s.solutionType
            ? `Geek Solution · ${s.solutionType.replace(/-/g, " ")}`
            : "Geek Solution / IP"
        }
        title={s.name}
        summary={s.shortSummary}
      />
      {s.introduction && (
        <HubSection heading="Overview">
          <Prose text={s.introduction} />
        </HubSection>
      )}
      {s.whatItSolves && (s.whatItSolves.heading || s.whatItSolves.body) && (
        <HubSection heading={s.whatItSolves.heading || "What it solves"}>
          {s.whatItSolves.body && <Prose text={s.whatItSolves.body} />}
        </HubSection>
      )}
      {s.relatedServices.length > 0 && (
        <HubSection heading="Part of / related to">
          <RefChips items={s.relatedServices} routePrefix="/services" />
        </HubSection>
      )}
      {s.methodology.length > 0 && (
        <HubSection heading="Methodology">
          <ol className="solution-pg__steps">
            {s.methodology.map((m, i) => (
              <li key={m.title} className="solution-pg__step">
                <span className="solution-pg__num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="solution-pg__title">{m.title}</h3>
                  {m.description && <p className="solution-pg__desc">{m.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </HubSection>
      )}
      {s.industries.length > 0 && (
        <HubSection heading="Industries">
          <RefChips items={s.industries} routePrefix="/industries" />
        </HubSection>
      )}
      {s.brands.length > 0 && (
        <HubSection heading="Brands">
          <RefChips items={s.brands} routePrefix="/brands" />
        </HubSection>
      )}
      {s.implementations.length > 0 && (
        <HubSection heading="Implementations">
          <ProjectCardGrid projects={s.implementations} />
        </HubSection>
      )}
    </HubShell>
  );
}

const styles = `
.solution-pg__steps > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.solution-pg__step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
}

.solution-pg__num {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  color: #32c1df;
}

.solution-pg__title {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #0c0d0c;
}

.solution-pg__desc {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}
`;
