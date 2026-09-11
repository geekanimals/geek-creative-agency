import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getSolution, getSolutionSlugs } from "@/lib/cms/solutions";
import { HubShell, HubHero, HubSection, Prose, RefChips, ProjectCardGrid } from "@/components/hubs/Hub";

export const dynamicParams = true;
export const revalidate = 3600; // ISR safety net; on-demand revalidation (Project/entity hooks) refreshes sooner

export async function generateStaticParams() {
  return (await getSolutionSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) return { title: "Solutions — Geek" };
  const title = s.seo.metaTitle || `${s.name} — Geek Creative Agency`;
  const description = s.seo.metaDescription || s.shortSummary || `${s.name}, a Geek solution.`;
  return {
    title, description,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: { title, description, url: `/solutions/${s.slug}`, type: "website", images: s.seo.ogImage ? [{ url: s.seo.ogImage }] : undefined },
    ...(s.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const s = await getSolution(slug, { draft });
  if (!s) notFound();

  return (
    <HubShell draft={draft}>
      <HubHero eyebrow={s.solutionType ? `Geek Solution · ${s.solutionType.replace(/-/g, " ")}` : "Geek Solution / IP"} title={s.name} summary={s.shortSummary} />
      {s.introduction && <HubSection heading="Overview"><Prose text={s.introduction} /></HubSection>}
      {s.whatItSolves && (s.whatItSolves.heading || s.whatItSolves.body) && (
        <HubSection heading={s.whatItSolves.heading || "What it solves"}>
          {s.whatItSolves.body && <Prose text={s.whatItSolves.body} />}
        </HubSection>
      )}
      {s.relatedServices.length > 0 && <HubSection heading="Part of / related to"><RefChips items={s.relatedServices} routePrefix="/services" /></HubSection>}
      {s.methodology.length > 0 && (
        <HubSection heading="Methodology">
          <ol className="space-y-4">
            {s.methodology.map((m, i) => (
              <li key={m.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-xs font-bold text-geek-cyan">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{m.title}</h3>
                  {m.description && <p className="mt-1 text-sm text-graphite">{m.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </HubSection>
      )}
      {s.industries.length > 0 && <HubSection heading="Industries"><RefChips items={s.industries} routePrefix="/industries" /></HubSection>}
      {s.brands.length > 0 && <HubSection heading="Brands"><RefChips items={s.brands} routePrefix="/brands" /></HubSection>}
      {s.implementations.length > 0 && <HubSection heading="Implementations"><ProjectCardGrid projects={s.implementations} /></HubSection>}
    </HubShell>
  );
}
