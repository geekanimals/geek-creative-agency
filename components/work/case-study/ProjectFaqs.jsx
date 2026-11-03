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
export default function ProjectFaqs({ faqs = [] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="faqs">
      <style href="faqs" precedence="default">
        {styles}
      </style>
      <div className="faqs-container faqs__inner">
        <p className="faqs__eyebrow">Questions &amp; Answers</p>
        <h2 className="faqs-display faqs__title">Frequently Asked</h2>
        <div className="faqs__list">
          {faqs.map((f, i) => (
            <details key={i} className="faqs__item">
              <summary className="faqs__summary">
                <span>{f.question}</span>
                <span aria-hidden className="faqs__icon">
                  +
                </span>
              </summary>
              <p className="faqs__answer">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = `
.faqs {
  border-top: 1px solid #eceeeb;
  background-color: #f5f6f4;
}

.faqs__inner {
  padding-block: 4rem;
}

.faqs__eyebrow {
  margin-bottom: 1.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.faqs__title {
  margin-bottom: 2rem;
  font-size: clamp(1.6rem, 3.5vw, 2.8rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.faqs__list {
  margin-inline: auto;
  max-width: 70ch;
  border-top: 1px solid #eceeeb;
  border-bottom: 1px solid #eceeeb;
}

.faqs__list > :not([hidden]) ~ :not([hidden]) {
  border-top: 1px solid #eceeeb;
}

.faqs__item {
  padding-block: 1rem;
}

.faqs__summary {
  display: flex;
  cursor: pointer;
  list-style-type: none;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #0c0d0c;
}

.faqs__summary::marker,
.faqs__summary *::marker {
  content: none;
}

.faqs__summary::-webkit-details-marker {
  display: none;
}

.faqs__icon {
  margin-top: 0.25rem;
  flex-shrink: 0;
  color: #32c1df;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.faqs__item[open] .faqs__icon {
  transform: rotate(45deg);
}

.faqs__answer {
  margin-top: 0.75rem;
  max-width: 64ch;
  white-space: pre-line;
  font-size: 1rem;
  line-height: 1.625;
  color: #5a5f5c;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.faqs-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .faqs-container {
    padding-inline: 20px;
  }
}

.faqs-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .faqs__inner {
    padding-block: 5rem;
  }
}
`;
