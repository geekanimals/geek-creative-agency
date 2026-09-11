import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getBrand, getBrandSlugs } from "@/lib/cms/brands";
import { HubShell, HubTrail, HubHero, HubSection, Prose, RefChips, ProjectCardGrid } from "@/components/hubs/Hub";

export const dynamicParams = true;
export const revalidate = 3600; // ISR safety net; on-demand revalidation (Project/entity hooks) refreshes sooner

export async function generateStaticParams() {
  return (await getBrandSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBrand(slug);
  if (!b) return { title: "Brands — Geek" };
  const title = b.seo.metaTitle || `${b.name} — Geek Creative Agency`;
  const description = b.seo.metaDescription || b.shortSummary || `Geek's work with ${b.name}.`;
  return {
    title, description,
    alternates: { canonical: `/brands/${b.slug}` },
    openGraph: { title, description, url: `/brands/${b.slug}`, type: "website", images: b.seo.ogImage ? [{ url: b.seo.ogImage }] : undefined },
    ...(b.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const b = await getBrand(slug, { draft });
  if (!b) notFound();

  return (
    <HubShell draft={draft}>
      <HubTrail items={[
        { name: b.industries[0]?.name ?? "", href: b.industries[0] ? `/industries/${b.industries[0].slug}` : undefined },
        { name: b.company?.name ?? "", href: b.company ? `/companies/${b.company.slug}` : undefined },
        { name: b.name },
      ]} />
      <HubHero eyebrow={[b.company?.name, b.portfolioGroup].filter(Boolean).join(" · ") || "Brand"} title={b.name} summary={b.shortSummary} />
      {b.introduction && <HubSection heading="Overview"><Prose text={b.introduction} /></HubSection>}
      {b.services.length > 0 && <HubSection heading="Services"><RefChips items={b.services} routePrefix="/services" /></HubSection>}
      {b.solutions.length > 0 && <HubSection heading="Solutions & IP"><RefChips items={b.solutions} routePrefix="/solutions" /></HubSection>}
      {b.programs.length > 0 && <HubSection heading="Programs"><ProjectCardGrid projects={b.programs} /></HubSection>}
      {b.campaigns.length > 0 && <HubSection heading="Campaigns"><ProjectCardGrid projects={b.campaigns} /></HubSection>}
      {b.activations.length > 0 && <HubSection heading="Activations"><ProjectCardGrid projects={b.activations} /></HubSection>}
    </HubShell>
  );
}
