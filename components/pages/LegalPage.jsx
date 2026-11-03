// LegalSection = { heading: string; body: string[] }

/**
 * Reusable legal layout. Content is passed as editable blocks — final legal
 * copy is dropped into the `sections` array without touching this component.
 * No legal obligations are fabricated; placeholder blocks are clearly marked.
 */
export default function LegalPage({ title, updated, intro, sections, placeholder = true }) {
  return (
    <>
      <style href="legal" precedence="default">
        {styles}
      </style>
      <main id="main" className="legal">
        <div className="legal__inner">
          <h1 className="legal-display legal__title">{title}</h1>
          {updated && <p className="legal__updated">Last updated: {updated}</p>}

          {placeholder && (
            <div className="legal__notice">
              <span className="legal__notice-label">Editable placeholder</span>
              This is a structured placeholder layout. Final {title.toLowerCase()} wording should be
              supplied/approved by Geek&apos;s legal counsel before launch — no legal obligations
              have been invented.
            </div>
          )}

          {intro && <p className="legal__intro">{intro}</p>}

          <div className="legal__sections">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="legal__heading">{s.heading}</h2>
                <div className="legal__body">
                  {s.body.map((p, i) => (
                    <p key={i} className="legal__para">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="legal__contact">
            Questions?{" "}
            <a href="/contact" className="legal__contact-link">
              Contact Geek →
            </a>
          </p>
        </div>
      </main>
    </>
  );
}

const styles = `
.legal {
  padding-top: 6rem;
}

.legal__inner {
  margin-inline: auto;
  max-width: 48rem;
  padding: 2.5rem 1.25rem;
}

.legal__title {
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.legal__updated {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.legal__notice {
  margin-top: 1.5rem;
  border: 1px dashed rgba(251, 191, 36, 0.6);
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.legal__notice-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f59e0b;
}

.legal__intro {
  margin-top: 2rem;
  font-size: 1.125rem;
  line-height: 1.625;
  color: rgba(12, 13, 12, 0.8);
}

.legal__sections {
  margin-top: 2.5rem;
}

.legal__sections > :not([hidden]) ~ :not([hidden]) {
  margin-top: 2.5rem;
}

.legal__heading {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  color: #0c0d0c;
}

.legal__body {
  margin-top: 0.75rem;
}

.legal__body > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.75rem;
}

.legal__para {
  line-height: 1.625;
  color: rgba(12, 13, 12, 0.75);
}

.legal__contact {
  margin-top: 3rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.legal__contact-link {
  font-weight: 600;
  color: #137c93;
}

.legal__contact-link:hover {
  color: #32c1df;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.legal-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .legal {
    padding-top: 7rem;
  }

  .legal__inner {
    padding: 4rem 2rem;
  }
}
`;
