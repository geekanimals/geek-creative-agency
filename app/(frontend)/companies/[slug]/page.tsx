import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getCompany, getCompanySlugs } from "@/lib/cms/companies";
import { HubShell, HubTrail, HubHero, HubSection, Prose, RefChips, ProjectCardGrid } from "@/components/hubs/Hub";

export const dynamicParams = true;
export const revalidate = 3600; // ISR safety net; on-demand revalidation (Project/entity hooks) refreshes sooner

export async function generateStaticParams() {
  return (await getCompanySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCompany(slug);
  if (!c) return { title: "Companies — Geek" };
  const title = c.seo.metaTitle || `${c.name} — Geek Creative Agency`;
  const description = c.seo.metaDescription || c.shortSummary || `Geek's work for ${c.name}.`;
  return {
    title, description,
    alternates: { canonical: `/companies/${c.slug}` },
    openGraph: { title, description, url: `/companies/${c.slug}`, type: "website", images: c.seo.ogImage ? [{ url: c.seo.ogImage }] : undefined },
    ...(c.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const c = await getCompany(slug, { draft });
  if (!c) notFound();

  return (
    <HubShell draft={draft}>
      <HubTrail items={[{ name: c.industries[0]?.name ?? "", href: c.industries[0] ? `/industries/${c.industries[0].slug}` : undefined }, { name: c.name }]} />
      <HubHero eyebrow="Company" title={c.name} summary={c.shortSummary} />
      {c.introduction && <HubSection heading="Overview"><Prose text={c.introduction} /></HubSection>}
      {c.industries.length > 0 && <HubSection heading="Industries"><RefChips items={c.industries} routePrefix="/industries" /></HubSection>}
      {c.portfolioGroups.map((g) => (
        <HubSection key={g.group} heading={g.group}><RefChips items={g.brands} routePrefix="/brands" /></HubSection>
      ))}
      {c.services.length > 0 && <HubSection heading="Services"><RefChips items={c.services} routePrefix="/services" /></HubSection>}
      {c.solutions.length > 0 && <HubSection heading="Solutions & IP"><RefChips items={c.solutions} routePrefix="/solutions" /></HubSection>}
      {c.projects.length > 0 && <HubSection heading="Work"><ProjectCardGrid projects={c.projects} /></HubSection>}
    </HubShell>
  );
}
