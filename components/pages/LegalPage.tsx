import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";

export type LegalSection = { heading: string; body: string[] };

/**
 * Reusable legal layout. Content is passed as editable blocks — final legal
 * copy is dropped into the `sections` array without touching this component.
 * No legal obligations are fabricated; placeholder blocks are clearly marked.
 */
export default function LegalPage({
  title,
  updated,
  intro,
  sections,
  placeholder = true,
}: {
  title: string;
  updated?: string;
  intro?: string;
  sections: LegalSection[];
  placeholder?: boolean;
}) {
  return (
    <>
      <Nav />
      <main id="main" className="pt-24 sm:pt-28">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
          <h1 className="h-display text-[clamp(2.4rem,6vw,4.4rem)] uppercase text-ink">{title}</h1>
          {updated && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">Last updated: {updated}</p>}

          {placeholder && (
            <div className="mt-6 rounded-md border border-dashed border-amber-400/60 p-4 text-sm text-graphite">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-amber-500">Editable placeholder</span>
              This is a structured placeholder layout. Final {title.toLowerCase()} wording should be supplied/approved by
              Geek&apos;s legal counsel before launch — no legal obligations have been invented.
            </div>
          )}

          {intro && <p className="mt-8 text-lg leading-relaxed text-ink/80">{intro}</p>}

          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">{s.heading}</h2>
                <div className="mt-3 space-y-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="leading-relaxed text-ink/75">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 text-sm text-graphite">
            Questions? <a href="/contact" className="font-semibold text-geek-deep hover:text-geek-cyan">Contact Geek →</a>
          </p>
        </div>
      </main>
      <EndFooter />
    </>
  );
}
