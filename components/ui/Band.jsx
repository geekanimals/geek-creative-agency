/**
 * Editorial section band: a narrow left label rail + wide content area,
 * separated by thin rules — the core layout unit of the homepage.
 * On mobile the rail stacks above the content.
 */
export default function Band({
  id,
  label,
  children,
  trailing, // optional tiny copy shown at the far right (desktop)
  className = "",
  contentClassName = "",
  divider = true,
}) {
  return (
    <section id={id} className={`band ${divider ? "band--divider" : ""} ${className}`}>
      <style href="band" precedence="default">
        {styles}
      </style>
      <div className="band-container">
        <div className="band__grid">
          <div className="band__label">{label}</div>
          <div className={`band__content ${contentClassName}`}>
            <div className={trailing ? "band__row" : undefined}>
              <div className="band__main">{children}</div>
              {trailing && <div className="band__trailing">{trailing}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Standard label-rail contents: title, optional sub copy, optional arrow. */
export function BandLabel({ title, sub, href, titleClassName = "" }) {
  return (
    <div>
      <style href="band" precedence="default">
        {styles}
      </style>
      <h2 className={`band-display band-label__title ${titleClassName}`}>{title}</h2>
      {sub && <p className="band-label__sub">{sub}</p>}
      {href && (
        <a href={href} aria-label="Learn more" className="band-label__arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 7h9M7.5 3.5 11 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
}

const styles = `
.band--divider {
  border-top: 1px solid #eceeeb;
}

.band__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
  padding-block: 2.25rem;
}

.band__content,
.band__main {
  min-width: 0;
}

.band__row {
  display: flex;
  align-items: stretch;
  gap: 1.5rem;
}

.band__main {
  flex: 1 1 0%;
}

.band__trailing {
  display: none;
  width: 10rem;
  flex-shrink: 0;
  align-self: center;
}

.band-label__title {
  font-size: 1.875rem;
  color: #0c0d0c;
}

.band-label__sub {
  margin-top: 0.5rem;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.625;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.band-label__arrow {
  margin-top: 0.75rem;
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border: 1px solid #32c1df;
  border-radius: 9999px;
  color: #32c1df;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.band-label__arrow:hover {
  background-color: #32c1df;
  color: #ffffff;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.band-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .band-container {
    padding-inline: 20px;
  }
}

.band-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .band-label__title {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}

@media (min-width: 768px) {
  .band__grid {
    grid-template-columns: 180px 1fr;
    gap: 2rem;
    padding-block: 2.75rem;
  }

  .band__label {
    padding-top: 0.25rem;
  }
}

@media (min-width: 1024px) {
  .band__grid {
    grid-template-columns: 200px 1fr;
  }
}

@media (min-width: 1280px) {
  .band__trailing {
    display: block;
  }
}
`;
