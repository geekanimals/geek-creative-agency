import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import Process from "@/components/Process";
import Band from "@/components/ui/Band";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { getWhatWeDo } from "@/lib/cms/whatWeDo";
import { WHAT_WE_DO_FALLBACK } from "@/lib/site/whatWeDoFallback";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getWhatWeDo();
  const title = seo.metaTitle || WHAT_WE_DO_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || WHAT_WE_DO_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/what-we-do" },
    openGraph: { title, description, url: "/what-we-do", type: "website", images: seo.ogImage ? [{ url: seo.ogImage }] : undefined },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function WhatWeDoPage() {
  const { isEnabled: draft } = await draftMode();
  const { hero, capabilities, cta } = await getWhatWeDo({ draft });

  return (
    <>
      <Nav />
      <main id="main" className="pt-24 sm:pt-28">
        {draft && (
          <div className="bg-amber-400 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink">
            Preview — draft (not public)
          </div>
        )}

        {/* Hero */}
        <section className="mx-auto max-w-edge px-5 py-10 sm:px-8 sm:py-16">
          <h1 className="h-display text-[clamp(2.4rem,6.5vw,5.6rem)] uppercase text-ink">
            <HighlightedLines text={hero.block1} />
          </h1>
          <h1 className="h-display mt-2 text-[clamp(2.4rem,6.5vw,5.6rem)] uppercase text-graphite">
            <HighlightedLines text={hero.block2} highlight={hero.highlight} />
          </h1>
          <p className="mt-8 max-w-[40ch] text-lg text-graphite">{hero.intro}</p>
        </section>

        {/* Capabilities */}
        {capabilities.map((c) => (
          <Band
            key={c.label}
            label={
              <div>
                <h2 className="h-display text-3xl uppercase text-geek-cyan sm:text-4xl">{c.label}</h2>
                <ul className="mt-3 space-y-1">
                  {c.items.map((it) => (
                    <li key={it} className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">{it}</li>
                  ))}
                </ul>
              </div>
            }
          >
            <p className="h-display text-[clamp(1.8rem,4.5vw,3.6rem)] uppercase leading-[0.95] text-ink">
              <HighlightedLines text={c.thought} highlight={c.thoughtHighlight} />
            </p>
            {c.linkLabel && c.linkHref && (
              <a href={c.linkHref} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition hover:text-geek-cyan">
                {c.linkLabel} <span aria-hidden>→</span>
              </a>
            )}
          </Band>
        ))}

        {/* Process rail (from the big idea to the last mile → we make it happen) */}
        <Process />

        {/* CTA */}
        <section className="mx-auto max-w-edge px-5 py-16 text-center sm:px-8 sm:py-24">
          <a href={cta.href} className="inline-flex items-center gap-3 rounded-full bg-ink px-9 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-geek-cyan">
            {cta.label} <span aria-hidden>→</span>
          </a>
        </section>
      </main>
      <EndFooter />
    </>
  );
}
