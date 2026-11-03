export const metadata = {
  title: "Thank you — Geek",
  description: "Thanks for reaching out to Geek.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

/**
 * Utility confirmation page. Forms currently confirm inline ("Sent — thank
 * you"); this page exists for flows that prefer a redirect on success.
 */
export default function ThankYouPage() {
  return (
    <>
      <style href="thanks" precedence="default">
        {styles}
      </style>
      <main id="main" className="thanks">
        <div className="thanks-container thanks__inner">
          <p className="thanks__eyebrow">Got it</p>
          <h1 className="thanks-display thanks__title">
            Thanks. We&apos;ll <span className="thanks__accent">be in touch.</span>
          </h1>
          <p className="thanks__body">
            Your message is on its way to the Geek team. In the meantime, take a look at the work.
          </p>
          <div className="thanks__actions">
            <a href="/work" className="thanks__btn thanks__btn--primary">
              See the Work <span aria-hidden>→</span>
            </a>
            <a href="/" className="thanks__btn thanks__btn--ghost">
              Back to Geek
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

const styles = `
.thanks {
  display: flex;
  min-height: 70vh;
  align-items: center;
  padding-top: 6rem;
}

.thanks__inner {
  text-align: center;
}

.thanks__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.thanks__title {
  margin-top: 1rem;
  font-size: clamp(2.4rem, 7vw, 6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.thanks__accent {
  color: #32c1df;
}

.thanks__body {
  margin-inline: auto;
  margin-top: 1.5rem;
  max-width: 42ch;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

.thanks__actions {
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.thanks__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.875rem 1.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.thanks__btn--primary {
  background-color: #0c0d0c;
  color: #ffffff;
}

.thanks__btn--primary:hover {
  background-color: #32c1df;
}

.thanks__btn--ghost {
  border: 1px solid rgba(12, 13, 12, 0.25);
  color: #0c0d0c;
}

.thanks__btn--ghost:hover {
  border-color: #32c1df;
  color: #137c93;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.thanks-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .thanks-container {
    padding-inline: 20px;
  }
}

.thanks-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .thanks {
    padding-top: 7rem;
  }
}
`;
