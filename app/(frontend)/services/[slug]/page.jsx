import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getService, getServiceSlugs } from "@/lib/cms/services";
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
  return (await getServiceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Services — Geek" };
  const title = s.seo.metaTitle || `${s.label} — Geek Creative Agency`;
  const description = seoDescription(
    s.seo.metaDescription || s.shortSummary || `${s.label} by Geek Creative Agency.`,
  );
  return {
    title,
    description,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: {
      title,
      description,
      url: `/services/${s.slug}`,
      type: "website",
      images: s.seo.ogImage ? [{ url: s.seo.ogImage }] : ogFallback(title, "Service"),
    },
    ...(s.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const s = await getService(slug, { draft });
  if (!s) notFound();

  return (
    <HubShell draft={draft}>
      <style href="service-pg" precedence="default">
        {styles}
      </style>
      <HubHero eyebrow="Service" title={s.heading} summary={s.shortSummary} />
      {s.introduction && (
        <HubSection heading="Overview">
          <Prose text={s.introduction} />
        </HubSection>
      )}
      {s.capabilities.length > 0 && (
        <HubSection heading="Capabilities">
          <div className="service-pg__caps">
            {s.capabilities.map((c) => (
              <div key={c.title}>
                <h3 className="service-pg__cap-title">{c.title}</h3>
                {c.description && <p className="service-pg__cap-desc">{c.description}</p>}
              </div>
            ))}
          </div>
        </HubSection>
      )}
      {s.approach && (
        <HubSection heading="Approach">
          <Prose text={s.approach} />
        </HubSection>
      )}
      {s.industries.length > 0 && (
        <HubSection heading="Industries">
          <RefChips items={s.industries} routePrefix="/industries" />
        </HubSection>
      )}
      {s.companies.length > 0 && (
        <HubSection heading="Companies">
          <RefChips items={s.companies} routePrefix="/companies" />
        </HubSection>
      )}
      {s.brands.length > 0 && (
        <HubSection heading="Brands">
          <RefChips items={s.brands} routePrefix="/brands" />
        </HubSection>
      )}
      {s.solutions.length > 0 && (
        <HubSection heading="Solutions & IP">
          <RefChips items={s.solutions} routePrefix="/solutions" />
        </HubSection>
      )}
      {s.projects.length > 0 && (
        <HubSection heading="Selected Work">
          <ProjectCardGrid projects={s.projects} />
        </HubSection>
      )}
    </HubShell>
  );
}

const styles = `
.service-pg__caps {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
}

.service-pg__cap-title {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #0c0d0c;
}

.service-pg__cap-desc {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

@media (min-width: 640px) {
  .service-pg__caps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
