import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import BuiltByGeek from "@/components/BuiltByGeek";
import { getAbout } from "@/lib/cms/about";
import { ABOUT_FALLBACK } from "@/lib/site/aboutFallback";

// About-specific SEO → approved About defaults (→ site defaults via layout).
// Canonical stays environment-controlled. Staging noindex handled in the layout.
export async function generateMetadata(): Promise<Metadata> {
  const a = await getAbout();
  const title = a.seo.metaTitle || ABOUT_FALLBACK.seo.metaTitle;
  const description = a.seo.metaDescription || ABOUT_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: { title, description, url: "/about", type: "website", images: a.seo.ogImage ? [{ url: a.seo.ogImage }] : undefined },
    ...(a.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Render a heading line with one word highlighted in cyan (art direction). */
function Highlighted({ text, word }: { text: string; word: string }) {
  if (!word || !text.includes(word)) return <>{text}</>;
  const [before, ...rest] = text.split(word);
  return (
    <>
      {before}
      <span className="text-geek-cyan">{word}</span>
      {rest.join(word)}
    </>
  );
}

export default async function AboutPage() {
  const { isEnabled: draft } = await draftMode();
  const about = await getAbout({ draft });
  const { hero, evolution, win, geekWay } = about;

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
        <section className="mx-auto max-w-edge px-5 py-12 sm:px-8 sm:py-20">
          <h1 className="h-display text-[clamp(3rem,11vw,10rem)] uppercase text-ink">
            {hero.headingLine1}
            <br />
            <span className="text-geek-cyan">{hero.headingLine2}</span>
          </h1>
          <div className="mt-10 max-w-[46ch] space-y-4">
            <p className="h-display text-[clamp(1.4rem,3vw,2.2rem)] uppercase text-ink">{hero.lead}</p>
            {hero.paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-graphite">{p}</p>
            ))}
          </div>
        </section>

        {/* Since 2008 — evolution */}
        <section className="border-t border-mist bg-paper">
          <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">{evolution.eyebrow}</p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
              {evolution.eras.map((e, i) => (
                <span
                  key={e.label + i}
                  className={`h-display text-[clamp(1.8rem,5vw,4rem)] uppercase ${i === evolution.eras.length - 1 ? "text-geek-cyan" : "text-ink"}`}
                >
                  {e.label}
                </span>
              ))}
            </div>
            <h2 className="h-display mt-12 max-w-[18ch] text-[clamp(1.8rem,4.5vw,3.6rem)] uppercase text-ink">
              {evolution.headingMain} <span className="text-graphite">{evolution.headingMuted}</span>
            </h2>
          </div>
        </section>

        {/* The one thing that didn't change */}
        <section className="relative overflow-hidden bg-geek-navy py-20 text-white sm:py-28">
          <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(60% 70% at 50% 40%, rgba(50,193,223,0.30) 0%, transparent 60%)" }} />
          <div className="relative mx-auto max-w-edge px-5 text-center sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan-bright">{win.eyebrow}</p>
            <h2 className="h-display mt-6 text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.92]">
              {win.headingLine1}
              <br />
              <Highlighted text={win.headingLine2} word={win.highlight} />
            </h2>
            <p className="mt-6 text-base text-white/60 sm:text-lg">{win.subcopy}</p>
          </div>
        </section>

        {/* The Geek Way — editorial list */}
        <section className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-24">
          <h2 className="h-display text-[clamp(2rem,5vw,4rem)] uppercase text-ink">{geekWay.heading}</h2>
          <div className="mt-10 divide-y divide-mist border-t border-mist">
            {geekWay.principles.map((p, i) => (
              <div key={p.title + i} className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-5 sm:grid-cols-[3rem_minmax(0,16ch)_1fr] sm:gap-x-8">
                <span className="text-xs font-bold text-geek-cyan">{String(i + 1).padStart(2, "0")}</span>
                <h3 className={`h-display text-2xl uppercase sm:text-3xl ${i === geekWay.principles.length - 1 ? "text-geek-cyan" : "text-ink"}`}>{p.title}</h3>
                <p className="col-span-2 text-sm text-graphite sm:col-span-1">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* We're builders too — reuse the homepage Built by Geek section */}
        <BuiltByGeek />
      </main>
      <EndFooter />
    </>
  );
}
