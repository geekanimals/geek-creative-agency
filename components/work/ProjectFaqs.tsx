import type { FaqItem } from "@/lib/cms/projects";

/**
 * READER FAQ / AEO (Phase 11.26) — accessible, progressive-enhancement FAQ for
 * standard/flexible Project pages. Uses native <details>/<summary> so it works
 * with NO JavaScript, is keyboard-accessible for free, and the answer text is
 * real visible content (never hidden SEO-only text). Renders nothing when empty.
 *
 * Structured data (FAQPage JSON-LD) is intentionally NOT emitted here — current
 * Google guidance restricts FAQ rich results, and the section must be useful to
 * readers without any rich-result treatment. Revisit JSON-LD separately.
 */
export default function ProjectFaqs({ faqs = [] }: { faqs?: FaqItem[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="border-t border-mist bg-paper">
      <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-20">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">Questions &amp; Answers</p>
        <h2 className="h-display mb-8 text-[clamp(1.6rem,3.5vw,2.8rem)] uppercase text-ink">Frequently Asked</h2>
        <div className="mx-auto max-w-[70ch] divide-y divide-mist border-y border-mist">
          {faqs.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{f.question}</span>
                <span aria-hidden className="mt-1 shrink-0 text-geek-cyan transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-[64ch] whitespace-pre-line text-base leading-relaxed text-graphite">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
