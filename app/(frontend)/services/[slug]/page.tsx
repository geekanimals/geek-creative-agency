import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getService, getServiceSlugs } from "@/lib/cms/services";
import { HubShell, HubHero, HubSection, Prose, RefChips, ProjectCardGrid } from "@/components/hubs/Hub";

export const dynamicParams = true;
export const revalidate = 3600; // ISR safety net; on-demand revalidation (Project/entity hooks) refreshes sooner

export async function generateStaticParams() {
  return (await getServiceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Services — Geek" };
  const title = s.seo.metaTitle || `${s.label} — Geek Creative Agency`;
  const description = s.seo.metaDescription || s.shortSummary || `${s.label} by Geek Creative Agency.`;
  return {
    title, description,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title, description, url: `/services/${s.slug}`, type: "website", images: s.seo.ogImage ? [{ url: s.seo.ogImage }] : undefined },
    ...(s.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const s = await getService(slug, { draft });
  if (!s) notFound();

  return (
    <HubShell draft={draft}>
      <HubHero eyebrow="Service" title={s.heading} summary={s.shortSummary} />
      {s.introduction && <HubSection heading="Overview"><Prose text={s.introduction} /></HubSection>}
      {s.capabilities.length > 0 && (
        <HubSection heading="Capabilities">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {s.capabilities.map((c) => (
              <div key={c.title}>
                <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
                {c.description && <p className="mt-1 text-sm text-graphite">{c.description}</p>}
              </div>
            ))}
          </div>
        </HubSection>
      )}
      {s.approach && <HubSection heading="Approach"><Prose text={s.approach} /></HubSection>}
      {s.industries.length > 0 && <HubSection heading="Industries"><RefChips items={s.industries} routePrefix="/industries" /></HubSection>}
      {s.companies.length > 0 && <HubSection heading="Companies"><RefChips items={s.companies} routePrefix="/companies" /></HubSection>}
      {s.brands.length > 0 && <HubSection heading="Brands"><RefChips items={s.brands} routePrefix="/brands" /></HubSection>}
      {s.solutions.length > 0 && <HubSection heading="Solutions & IP"><RefChips items={s.solutions} routePrefix="/solutions" /></HubSection>}
      {s.projects.length > 0 && <HubSection heading="Selected Work"><ProjectCardGrid projects={s.projects} /></HubSection>}
    </HubShell>
  );
}
