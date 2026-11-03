import Link from "next/link";
import Band from "@/components/ui/Band";

/**
 * The 0 → 100 playbook: numbered steps, each tied to a real case study.
 * Props: { eyebrow, heading, closing?, items: [{ title, body, linkLabel?, linkHref? }] }
 */
export default function BuildSteps({ eyebrow, heading, closing, items = [] }) {
  return (
    <Band
      id="playbook"
      label={
        <div>
          <p className="bsteps__eyebrow">{eyebrow}</p>
          <h2 className="bsteps-display bsteps__heading">{heading}</h2>
        </div>
      }
    >
      <style href="build-steps" precedence="default">
        {styles}
      </style>
      <ol className="bsteps__list">
        {items.map((s, i) => (
          <li key={s.title} className="bsteps__step">
            <span className="bsteps-display bsteps__num" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="bsteps__body">
              <h3 className="bsteps-display bsteps__title">{s.title}</h3>
              <p className="bsteps__text">{s.body}</p>
              {s.linkLabel && s.linkHref && (
                <Link href={s.linkHref} className="bsteps__link">
                  See {s.linkLabel} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
      {closing && <p className="bsteps-display bsteps__closing">{closing}</p>}
    </Band>
  );
}

const styles = `
.bsteps__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.bsteps__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.bsteps__list {
  list-style: none;
}

.bsteps__step {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 1.75rem;
  border-top: 1px solid rgba(12, 13, 12, 0.1);
}

.bsteps__step:first-child {
  border-top: 0;
  padding-top: 0;
}

.bsteps__num {
  font-size: 2rem;
  color: #32c1df;
}

.bsteps__title {
  font-size: 1.5rem;
  color: #0c0d0c;
}

.bsteps__text {
  margin-top: 0.75rem;
  max-width: 60ch;
  font-size: 1rem;
  line-height: 1.65;
  color: #5a5f5c;
}

.bsteps__link {
  display: inline-block;
  margin-top: 0.875rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
  border-bottom: 1px solid #32c1df;
  padding-bottom: 2px;
}

.bsteps__link:hover {
  color: #32c1df;
}

.bsteps__closing {
  margin-top: 1rem;
  padding-top: 1.75rem;
  border-top: 1px solid rgba(12, 13, 12, 0.1);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  color: #32c1df;
}

.bsteps-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1;
}

@media (min-width: 640px) {
  .bsteps__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .bsteps__step {
    grid-template-columns: 6rem minmax(0, 1fr);
    gap: 1.5rem;
    padding-block: 2.25rem;
  }

  .bsteps__num {
    font-size: 3.25rem;
  }

  .bsteps__title {
    font-size: 2rem;
  }

  .bsteps__text {
    font-size: 1.0625rem;
  }
}
`;
