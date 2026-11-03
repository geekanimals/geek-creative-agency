import Band from "@/components/ui/Band";
import { trackAttr } from "@/lib/analytics";

/**
 * "Visit us" — one card per office with an embedded Google Map.
 * Tapping a card (map included) opens the location in Google Maps
 * (the app on phones, a new tab on desktop).
 * Props: { eyebrow, heading, items: [{ city, address, mapQuery? }] } — from the Contact Global.
 */
const embedUrl = (q) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
const openUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function Offices({ eyebrow, heading, items = [] }) {
  if (!items.length) return null;

  return (
    <>
      <style href="contact-offices" precedence="default">
        {styles}
      </style>
      <Band
        id="offices"
        label={
          <div>
            <p className="offices__eyebrow">{eyebrow}</p>
            <h2 className="offices-display offices__heading">{heading}</h2>
          </div>
        }
      >
        <div className={`offices__grid ${items.length === 1 ? "offices__grid--one" : ""}`}>
          {items.map((o) => {
            const q = o.mapQuery || o.address;
            return (
              <a
                key={o.city + o.address}
                href={openUrl(q)}
                target="_blank"
                rel="noopener noreferrer"
                className="offices__card"
                aria-label={`Open ${o.city} office in Google Maps`}
                {...trackAttr("office_map_click", { city: o.city })}
              >
                <span className="offices__map">
                  <iframe
                    src={embedUrl(q)}
                    title={`Map — ${o.city} office`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </span>
                <span className="offices__body">
                  <span className="offices__city">{o.city}</span>
                  <span className="offices__address">{o.address}</span>
                  <span className="offices__cta">
                    Open in Google Maps <span aria-hidden>→</span>
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </Band>
    </>
  );
}

const styles = `
.offices__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.offices__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.offices__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.offices__card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid rgba(12, 13, 12, 0.12);
  background-color: #ffffff;
  color: #0c0d0c;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.offices__card:hover {
  border-color: #32c1df;
  transform: translateY(-2px);
}

.offices__card:focus-visible {
  outline: 2px solid #32c1df;
  outline-offset: 2px;
}

.offices__map {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  background-color: #eef0ee;
}

/* The map is a picture here: taps go to the card link (opens Google Maps). */
.offices__map iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  pointer-events: none;
}

.offices__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
}

.offices__city {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.offices__address {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: rgba(12, 13, 12, 0.7);
}

.offices__cta {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.offices-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .offices__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .offices__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .offices__grid--one {
    grid-template-columns: minmax(0, 1fr);
  }
}
`;
