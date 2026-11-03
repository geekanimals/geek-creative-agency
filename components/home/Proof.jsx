"use client";

import Band from "@/components/ui/Band";
import CountUp from "@/components/ui/CountUp";
import Media from "@/components/ui/Media";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

export default function Proof({ content = HOME_FALLBACK.proof }) {
  return (
    <Band
      id="proof"
      label={
        <div>
          <p className="proof__eyebrow">{content.eyebrow}</p>
          <p className="proof__sub">{content.sub}</p>
        </div>
      }
      trailing={
        <div className="proof__thumbs">
          {content.cases.map((c, i) => (
            <div key={c.brand} className="proof__thumb">
              <Media src={c.src} label={c.brand} index={i} showSlotLabel={false} />
              <span className="proof__thumb-brand">{c.brand}</span>
            </div>
          ))}
        </div>
      }
    >
      <style href="proof" precedence="default">
        {styles}
      </style>
      <div className="proof__list">
        {content.cases.map((c) => (
          <div key={c.brand} className="proof__row">
            {c.href ? (
              <a href={c.href} className="proof-display proof__brand proof__brand--link">
                {c.brand} <span aria-hidden>→</span>
              </a>
            ) : (
              <p className="proof-display proof__brand">{c.brand}</p>
            )}
            <div className="proof__stats">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <div className="proof-display proof__value">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="proof__label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Band>
  );
}

const styles = `
.proof__brand--link {
  display: inline-block;
  transition: color 200ms ease;
}

.proof__brand--link:hover {
  color: #32c1df;
}

.proof__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.proof__sub {
  margin-top: 0.5rem;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.625;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.proof__thumbs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.proof__thumb {
  position: relative;
  height: 4rem;
  overflow: hidden;
  border-radius: 0.375rem;
}

.proof__thumb-brand {
  position: absolute;
  bottom: 0.5rem;
  left: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
}

.proof__list > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
  margin-bottom: 0;
}

.proof__row {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: center;
  gap: 0.5rem;
}

.proof__brand {
  font-size: 1.25rem;
  color: #0c0d0c;
}

.proof__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.proof__value {
  font-size: clamp(1.6rem, 3.2vw, 2.6rem);
  color: #32c1df;
}

.proof__label {
  margin-top: 0.25rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5a5f5c;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.proof-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .proof__row {
    grid-template-columns: 90px 1fr;
    gap: 1rem;
  }

  .proof__brand {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .proof__stats {
    gap: 1rem;
  }

  .proof__label {
    letter-spacing: 0.12em;
  }
}
`;
