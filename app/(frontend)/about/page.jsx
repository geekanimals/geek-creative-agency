import { draftMode } from "next/headers";
import BuiltByGeek from "@/components/home/BuiltByGeek";
import { getAbout } from "@/lib/cms/about";
import { ABOUT_FALLBACK } from "@/lib/site/aboutFallback";
import { ogFallback } from "@/lib/seo/ogImage";

// About-specific SEO → approved About defaults (→ site defaults via layout).
// Canonical stays environment-controlled. Staging noindex handled in the layout.
export async function generateMetadata() {
  const a = await getAbout();
  const title = a.seo.metaTitle || ABOUT_FALLBACK.seo.metaTitle;
  const description = a.seo.metaDescription || ABOUT_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: {
      title,
      description,
      url: "/about",
      type: "website",
      images: a.seo.ogImage ? [{ url: a.seo.ogImage }] : ogFallback(title),
    },
    ...(a.seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Render a heading line with one word highlighted in cyan (art direction). */
function Highlighted({ text, word }) {
  if (!word || !text.includes(word)) return <>{text}</>;
  const [before, ...rest] = text.split(word);
  return (
    <>
      {before}
      <span className="about__accent">{word}</span>
      {rest.join(word)}
    </>
  );
}

export default async function AboutPage() {
  const { isEnabled: draft } = await draftMode();
  const about = await getAbout({ draft });
  const { hero, evolution, win, geekWay } = about;

  return (
    <>
      <style href="about" precedence="default">
        {styles}
      </style>
      <main id="main" className="about">
        {draft && <div className="about__draft">Preview — draft (not public)</div>}

        {/* Hero */}
        <section className="about-container about-hero">
          <h1 className="about-display about-hero__title">
            {hero.headingLine1}
            <br />
            <span className="about__accent">{hero.headingLine2}</span>
          </h1>
          <div className="about-hero__copy">
            <p className="about-display about-hero__lead">{hero.lead}</p>
            {hero.paragraphs.map((p, i) => (
              <p key={i} className="about-hero__para">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Since 2008 — evolution */}
        <section className="about-evo">
          <div className="about-container about-evo__inner">
            <p className="about__eyebrow">{evolution.eyebrow}</p>
            <div className="about-evo__eras">
              {evolution.eras.map((e, i) => (
                <span
                  key={e.label + i}
                  className={`about-display about-evo__era ${i === evolution.eras.length - 1 ? "about-evo__era--last" : ""}`}
                >
                  {e.label}
                </span>
              ))}
            </div>
            <h2 className="about-display about-evo__heading">
              {evolution.headingMain}{" "}
              <span className="about-evo__muted">{evolution.headingMuted}</span>
            </h2>
          </div>
        </section>

        {/* The one thing that didn't change */}
        <section className="about-win">
          <div
            className="about-win__glow"
            style={{
              background:
                "radial-gradient(60% 70% at 50% 40%, rgba(50,193,223,0.30) 0%, transparent 60%)",
            }}
          />
          <div className="about-container about-win__inner">
            <p className="about-win__eyebrow">{win.eyebrow}</p>
            <h2 className="about-display about-win__heading">
              {win.headingLine1}
              <br />
              <Highlighted text={win.headingLine2} word={win.highlight} />
            </h2>
            <p className="about-win__sub">{win.subcopy}</p>
          </div>
        </section>

        {/* The Geek Way — editorial list */}
        <section className="about-container about-way">
          <h2 className="about-display about-way__heading">{geekWay.heading}</h2>
          <div className="about-way__list">
            {geekWay.principles.map((p, i) => (
              <div key={p.title + i} className="about-way__row">
                <span className="about-way__num">{String(i + 1).padStart(2, "0")}</span>
                <h3
                  className={`about-display about-way__title ${i === geekWay.principles.length - 1 ? "about-way__title--last" : ""}`}
                >
                  {p.title}
                </h3>
                <p className="about-way__body">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* We're builders too — reuse the homepage Built by Geek section */}
        <BuiltByGeek />
      </main>
    </>
  );
}

const styles = `
.about {
  padding-top: 6rem;
}

.about__draft {
  background-color: #fbbf24;
  padding: 0.5rem 1.25rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
}

.about__accent {
  color: #32c1df;
}

.about__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

/* Hero */
.about-hero {
  padding-block: 3rem;
}

.about-hero__title {
  font-size: clamp(3rem, 11vw, 10rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.about-hero__copy {
  margin-top: 2.5rem;
  max-width: 46ch;
}

.about-hero__copy > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.about-hero__lead {
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.about-hero__para {
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

/* Evolution */
.about-evo {
  border-top: 1px solid #eceeeb;
  background-color: #f5f6f4;
}

.about-evo__inner {
  padding-block: 4rem;
}

.about-evo__eras {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 0.5rem;
}

.about-evo__era {
  font-size: clamp(1.8rem, 5vw, 4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.about-evo__era--last {
  color: #32c1df;
}

.about-evo__heading {
  margin-top: 3rem;
  max-width: 18ch;
  font-size: clamp(1.8rem, 4.5vw, 3.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.about-evo__muted {
  color: #5a5f5c;
}

/* The one thing that didn't change */
.about-win {
  position: relative;
  overflow: hidden;
  background-color: #08252e;
  padding-block: 5rem;
  color: #ffffff;
}

.about-win__glow {
  pointer-events: none;
  position: absolute;
  inset: 0px;
  opacity: 0.6;
}

.about-win__inner {
  position: relative;
  text-align: center;
}

.about-win__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #63d0ea;
}

.about-win__heading {
  margin-top: 1.5rem;
  font-size: clamp(2.6rem, 8vw, 7rem);
  text-transform: uppercase;
}

.about-win__sub {
  margin-top: 1.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
}

/* The Geek Way */
.about-way {
  padding-block: 4rem;
}

.about-way__heading {
  font-size: clamp(2rem, 5vw, 4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.about-way__list {
  margin-top: 2.5rem;
  border-top: 1px solid #eceeeb;
}

.about-way__list > :not([hidden]) ~ :not([hidden]) {
  border-top: 1px solid #eceeeb;
}

.about-way__row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  column-gap: 1.25rem;
  padding-block: 1.25rem;
}

.about-way__num {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  color: #32c1df;
}

.about-way__title {
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.about-way__title--last {
  color: #32c1df;
}

.about-way__body {
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.about-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .about-container {
    padding-inline: 20px;
  }
}

.about-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .about {
    padding-top: 7rem;
  }

  .about-hero {
    padding-block: 5rem;
  }

  .about-evo__inner {
    padding-block: 6rem;
  }

  .about-win {
    padding-block: 7rem;
  }

  .about-win__sub {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .about-way {
    padding-block: 6rem;
  }

  .about-way__row {
    grid-template-columns: 3rem minmax(0, 16ch) 1fr;
    column-gap: 2rem;
  }

  .about-way__title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .about-way__body {
    grid-column: span 1 / span 1;
  }
}
`;
