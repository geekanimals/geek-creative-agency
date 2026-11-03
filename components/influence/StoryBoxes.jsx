import Link from "next/link";
import Band from "@/components/ui/Band";

/**
 * Grid of "story boxes" — text cards with a small tag, a title and a line of
 * detail; a card with `href` opens its case study. Used for hampers and case
 * studies on /influence.
 * Props: { id?, eyebrow, heading, intro?, items: [{ title, body, tag?, href? }], dark? }
 */
export default function StoryBoxes({ id, eyebrow, heading, intro, items = [], dark = false }) {
  if (!items.length) return null;
  return (
    <Band
      id={id}
      label={
        <div>
          <p className="sbox__eyebrow">{eyebrow}</p>
          <h2 className="sbox-display sbox__heading">{heading}</h2>
          {intro && <p className="sbox__intro">{intro}</p>}
        </div>
      }
    >
      <style href="story-boxes" precedence="default">
        {styles}
      </style>
      <ul className={`sbox__grid ${dark ? "sbox__grid--dark" : ""}`}>
        {items.map((it) => {
          const inner = (
            <>
              {it.tag && <span className="sbox__tag">{it.tag}</span>}
              <span className="sbox-display sbox__title">{it.title}</span>
              <span className="sbox__body">{it.body}</span>
              {it.href && (
                <span className="sbox__more">
                  Read the case study <span aria-hidden>→</span>
                </span>
              )}
            </>
          );
          return (
            <li key={it.title} className="sbox__cell">
              {it.href ? (
                <Link href={it.href} className="sbox__card sbox__card--link">
                  {inner}
                </Link>
              ) : (
                <div className="sbox__card">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Band>
  );
}

const styles = `
.sbox__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.sbox__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.sbox__intro {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #5a5f5c;
}

.sbox__grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.sbox__cell {
  display: flex;
}

.sbox__card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(12, 13, 12, 0.1);
  background-color: #f6f7f6;
  padding: 1.25rem;
  color: #0c0d0c;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms ease;
}

.sbox__card--link:hover {
  transform: translateY(-0.125rem);
  border-color: #32c1df;
}

.sbox__grid--dark .sbox__card {
  border-color: transparent;
  background-color: #0c0d0c;
  color: #ffffff;
}

.sbox__grid--dark .sbox__cell:nth-child(3n + 2) .sbox__card {
  background-color: #0f5a6b;
}

.sbox__tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #32c1df;
}

.sbox__title {
  font-size: 1.25rem;
}

.sbox__body {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #5a5f5c;
}

.sbox__grid--dark .sbox__body {
  color: rgba(255, 255, 255, 0.8);
}

.sbox__more {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sbox-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

@media (min-width: 640px) {
  .sbox__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .sbox__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .sbox__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
