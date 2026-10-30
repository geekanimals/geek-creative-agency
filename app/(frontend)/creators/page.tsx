import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import Media from "@/components/ui/Media";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { CreatorForm } from "@/components/forms/Forms";
import { getCreatorsPage } from "@/lib/cms/creatorsPage";
import { CREATORS_FALLBACK } from "@/lib/site/creatorsFallback";

/** Real creator content from Geek campaigns (public campaign posts / creator videos). */
const CREATOR_MOSAIC = [
  "/assets/work/kurkure/kurkure-chatpata-cheese/creator-01.jpg",
  "/assets/work/lays/lays-paper-thin-wafer-thin/hero.jpg",
  "/assets/work/kurkure/kurkure-puffballs/creator-02.jpg",
  "/assets/work/sting/sting-macha-de-challenge/sting-macha-de-challenge-creator-01.jpg",
  "/assets/work/doritos/doritos-chips-nahi-fire/hero.jpg",
  "/assets/work/mountain-dew/mountain-dew-conquer-with-courage/mountain-dew-conquer-with-courage-creator-01.jpg",
  "/assets/work/pepsi/pepsi-check-my-fizz/pepsi-check-my-fizz-creator-01.jpg",
  "/assets/work/lays/mylaysrelationchip/mylaysrelationchip-creator-01.jpg",
  "/assets/work/kurkure/kurkure-puffballs/hero.jpg",
];

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCreatorsPage();
  const title = seo.metaTitle || CREATORS_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || CREATORS_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/creators" },
    openGraph: { title, description, url: "/creators", type: "website", images: seo.ogImage ? [{ url: seo.ogImage }] : undefined },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CreatorsPage() {
  const { isEnabled: draft } = await draftMode();
  const { hero, oneDegree, whyGeek, join } = await getCreatorsPage({ draft });

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
        <section className="mx-auto grid max-w-edge grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,52%)_minmax(0,48%)]">
          <div>
            <h1 className="h-display text-[clamp(2.6rem,6.5vw,5.6rem)] uppercase text-ink">
              <HighlightedLines text={hero.headingBlock} highlight={hero.headingHighlight} />
            </h1>
            <p className="mt-6 text-lg font-semibold uppercase tracking-[0.08em] text-graphite">{hero.subline}</p>
            <a href={hero.ctaHref} className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-geek-cyan">
              {hero.ctaLabel} <span aria-hidden>→</span>
            </a>
          </div>
          {/* creator mosaic (decorative slots — code-controlled) */}
          <div className="grid grid-cols-3 gap-2">
            {CREATOR_MOSAIC.map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-md">
                <Media src={src} label={`Geek creator content ${i + 1}`} index={i} showSlotLabel={false} />
                {i === 4 && <div className="absolute inset-0 bg-geek-cyan/85" />}
              </div>
            ))}
          </div>
        </section>

        {/* One degree of separation */}
        <section className="border-t border-mist bg-ink text-white">
          <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="h-display text-[clamp(2.2rem,6vw,5rem)] uppercase">
              <HighlightedLines text={oneDegree.heading} />
            </h2>
            <p className="mt-5 text-lg text-white/60">{oneDegree.body}</p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {oneDegree.opportunities.map((o) => (
                <span key={o} className="h-display text-xl uppercase text-white/90 sm:text-2xl">{o}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Why Geek */}
        <section className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">{whyGeek.eyebrow}</p>
          <h2 className="h-display mt-5 text-[clamp(2rem,5.5vw,4.4rem)] uppercase text-ink">
            <HighlightedLines text={whyGeek.heading} highlight={whyGeek.headingHighlight} />
          </h2>
        </section>

        {/* Registration form (form itself is code-controlled) */}
        <section id="join" className="border-t border-mist bg-paper">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">{join.eyebrow}</p>
            <h2 className="h-display mt-4 text-3xl uppercase text-ink sm:text-4xl">{join.heading}</h2>
            <p className="mt-3 text-sm text-graphite">{join.subcopy}</p>
            <div className="mt-8">
              <CreatorForm />
            </div>
          </div>
        </section>
      </main>
      <EndFooter />
    </>
  );
}
