import Link from "next/link";
import Band from "@/components/ui/Band";
import Media from "@/components/ui/Media";

/**
 * "Brands we've built" — the three cards from the Home "Build." band first, then
 * more brand-building case studies. Every card opens its case study.
 * Props: { eyebrow, heading, cards: [{ key, href, src, need, brand, project, blurb }] }
 */
export default function BuildShowcase({ eyebrow, heading, cards = [] }) {
  if (!cards.length) return null;
  return (
    <Band
      id="built"
      label={
        <div>
          <p className="bshow__eyebrow">{eyebrow}</p>
          <h2 className="bshow-display bshow__heading">{heading}</h2>
        </div>
      }
    >
      <style href="build-showcase" precedence="default">
        {styles}
      </style>
      <div className="bshow__grid">
        {cards.map((c, i) => (
          <Link key={c.key} href={c.href} className="bshow__card">
            <div className="bshow__frame">
              <div className="bshow__media">
                <Media
                  src={c.src}
                  need={c.need}
                  label={c.brand}
                  caption={c.blurb}
                  index={i}
                  showSlotLabel={false}
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                />
              </div>
              <div className="bshow__caption">
                <p className="bshow__brand">{c.brand}</p>
                {c.project && <p className="bshow__project">{c.project}</p>}
              </div>
            </div>
            {c.blurb && <p className="bshow__blurb">{c.blurb}</p>}
          </Link>
        ))}
      </div>
    </Band>
  );
}

const styles = `
.bshow__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.bshow__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.bshow__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.bshow__card {
  display: block;
}

.bshow__frame {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
}

.bshow__media {
  width: 100%;
  height: 100%;
  transition: transform 700ms cubic-bezier(0, 0, 0.2, 1);
}

.bshow__card:hover .bshow__media {
  transform: scale(1.05);
}

.bshow__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(to top, rgba(12, 13, 12, 0.85), transparent);
  padding: 1rem;
}

.bshow__brand {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #ffffff;
}

.bshow__project {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #32c1df;
}

.bshow__blurb {
  margin-top: 0.625rem;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.625;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.bshow-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1;
}

@media (min-width: 640px) {
  .bshow__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .bshow__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .bshow__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
