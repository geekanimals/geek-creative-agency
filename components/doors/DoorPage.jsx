import FourDoors from "@/components/doors/FourDoors";
import { doorByKey } from "@/components/doors/doors";

const STEPS = [
  { title: "Fill the form", body: "A few details so we know who you are and what you need." },
  { title: "We review", body: "The right person at Geek reads it — not a bot." },
  { title: "We get in touch", body: "Over email or phone, if there's a fit." },
];

/**
 * Page layout for one door (Build my brand / Work at Geek / Work with Geek):
 * door colour + icon, heading and intro on the left, the form on the right,
 * and the other doors underneath. The form itself is passed as `children`.
 */
export default function DoorPage({ door: key, title, intro, children }) {
  const door = doorByKey(key);

  return (
    <>
      <style href="door-page" precedence="default">
        {styles}
      </style>
      <main id="main" className="door-page">
        <section className="door-page-container door-page__grid">
          <div className="door-page__intro">
            <p className="door-page__eyebrow">
              <span className="door-page__icon" style={{ backgroundColor: door.color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {door.icon}
                </svg>
              </span>
              {door.pageSub}
            </p>
            <h1 className="door-page-display door-page__title">{title || door.title}</h1>
            <p className="door-page__lede">{intro}</p>

            <ol className="door-page__steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="door-page__step">
                  <span className="door-page__step-num" style={{ color: door.color }}>
                    0{i + 1}
                  </span>
                  <span>
                    <span className="door-page__step-title">{s.title}</span>
                    <span className="door-page__step-body">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="door-page__card" style={{ borderTopColor: door.color }}>
            {children}
          </div>
        </section>

        <FourDoors eyebrow="Other doors." heading="Looking for something else?" exclude={key} />
      </main>
    </>
  );
}

const styles = `
.door-page {
  padding-top: 6rem;
}

.door-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  padding-top: 2.5rem;
  padding-bottom: 4rem;
}

.door-page__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #137c93;
}

.door-page__icon {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: #ffffff;
}

.door-page__title {
  margin-top: 1.25rem;
  font-size: clamp(2.6rem, 6.5vw, 5.4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.door-page__lede {
  margin-top: 1.25rem;
  max-width: 44ch;
  font-size: 1rem;
  line-height: 1.6;
  color: #5a5f5c;
}

.door-page__steps {
  margin-top: 2.5rem;
  display: grid;
  gap: 1.25rem;
  border-top: 1px solid #eceeeb;
  padding-top: 2rem;
}

.door-page__step {
  display: flex;
  gap: 1rem;
}

.door-page__step-num {
  flex-shrink: 0;
  min-width: 1.75rem;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5rem;
}

.door-page__step-title {
  display: block;
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: #0c0d0c;
}

.door-page__step-body {
  display: block;
  font-size: 0.875rem;
  line-height: 1.4rem;
  color: #5a5f5c;
}

.door-page__card {
  border: 1px solid #eceeeb;
  border-top-width: 4px;
  border-radius: 0.75rem;
  background-color: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 24px 48px -24px rgba(12, 13, 12, 0.18);
}

/* ---- type/layout helpers (local copy) ---- */
.door-page-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .door-page-container {
    padding-inline: 20px;
  }
}

.door-page-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .door-page {
    padding-top: 7rem;
  }

  .door-page__lede {
    font-size: 1.125rem;
  }

  .door-page__card {
    padding: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .door-page__grid {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 4rem;
    align-items: start;
    padding-top: 4rem;
    padding-bottom: 6rem;
  }

  .door-page__intro {
    position: sticky;
    top: 7rem;
  }
}
`;
