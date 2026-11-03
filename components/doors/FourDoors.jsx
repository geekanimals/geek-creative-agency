import Link from "next/link";
import Band from "@/components/ui/Band";
import { DOORS } from "@/components/doors/doors";
import { trackAttr } from "@/lib/analytics";

/**
 * "Four doors" — each card opens its own page (see components/doors/doors.jsx).
 * Optional editorial overrides (from the Contact Global): the CMS may only
 * relabel; keys, colours, icons, order and pages stay code-owned.
 * Props: { eyebrow?, heading?, labels?: { [doorKey]: { title?, sub? } }, exclude? }
 */
export default function FourDoors({ eyebrow, heading, labels, exclude } = {}) {
  const doors = DOORS.filter((d) => d.key !== exclude);

  return (
    <>
      <style href="doors" precedence="default">
        {styles}
      </style>
      <Band
        id="contact"
        label={
          <div>
            <p className="doors__eyebrow">{eyebrow ?? "Four doors."}</p>
            <p className="doors-display doors__heading">{heading ?? "What brings you to Geek?"}</p>
          </div>
        }
      >
        <div className={`doors__grid ${doors.length === 3 ? "doors__grid--three" : ""}`}>
          {doors.map((d) => (
            <Link
              key={d.key}
              href={d.href}
              className="doors__door"
              style={{ backgroundColor: d.color }}
              {...trackAttr("door_click", { door: d.key })}
            >
              <span className="doors__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {d.icon}
                </svg>
              </span>
              <span className="doors__text">
                <span className="doors__title">{labels?.[d.key]?.title ?? d.title}</span>
                <span className="doors__sub">{labels?.[d.key]?.sub ?? d.sub}</span>
              </span>
              <span className="doors__arrow" aria-hidden>
                →
              </span>
            </Link>
          ))}
        </div>
      </Band>
    </>
  );
}

const styles = `
.doors__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.doors__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.doors__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.doors__door {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 0.5rem;
  padding: 1.25rem;
  text-align: left;
  color: #ffffff;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.doors__door:hover {
  transform: translateY(-0.125rem);
}

.doors__icon {
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.15);
}

.doors__text {
  min-width: 0;
  flex: 1 1 0%;
}

.doors__title {
  display: block;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
}

.doors__sub {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}

.doors__arrow {
  font-size: 1.25rem;
  line-height: 1.75rem;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.doors__door:hover .doors__arrow {
  transform: translateX(0.25rem);
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.doors-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .doors__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .doors__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .doors__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .doors__grid--three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
