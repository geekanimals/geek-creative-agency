export const metadata = {
  title: "Page not found — Geek",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <style href="nf" precedence="default">
        {styles}
      </style>
      <main id="main" className="nf">
        <div className="nf-container">
          <p className="nf__eyebrow">404</p>
          <h1 className="nf-display nf__title">
            Looks like
            <br />
            this idea went
            <br />
            <span className="nf__accent">somewhere else.</span>
          </h1>
          <div className="nf__actions">
            <a href="/" className="nf__btn nf__btn--primary">
              Back to Geek <span aria-hidden>→</span>
            </a>
            <a href="/work" className="nf__btn nf__btn--ghost">
              See the Work
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

const styles = `
.nf {
  display: flex;
  min-height: 70vh;
  align-items: center;
  padding-top: 6rem;
}

.nf__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.nf__title {
  margin-top: 1rem;
  max-width: 16ch;
  font-size: clamp(2.4rem, 7vw, 6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.nf__accent {
  color: #32c1df;
}

.nf__actions {
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.nf__btn {
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

.nf__btn--primary {
  background-color: #0c0d0c;
  color: #ffffff;
}

.nf__btn--primary:hover {
  background-color: #32c1df;
}

.nf__btn--ghost {
  border: 1px solid rgba(12, 13, 12, 0.25);
  color: #0c0d0c;
}

.nf__btn--ghost:hover {
  border-color: #32c1df;
  color: #137c93;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.nf-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .nf-container {
    padding-inline: 20px;
  }
}

.nf-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .nf {
    padding-top: 7rem;
  }
}
`;
