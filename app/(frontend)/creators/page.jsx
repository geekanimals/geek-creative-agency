import { draftMode } from "next/headers";
import Media from "@/components/ui/Media";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import CreatorForm from "@/components/forms/CreatorForm";
import FourDoors from "@/components/doors/FourDoors";
import { getCreatorsPage } from "@/lib/cms/creatorsPage";
import { CREATORS_FALLBACK } from "@/lib/site/creatorsFallback";
import { ogFallback } from "@/lib/seo/ogImage";

/** Real creator content from Geek campaigns (public campaign posts / creator videos). */
const CREATOR_MOSAIC = [
  "/assets/work/kurkure/kurkure-chatpata-cheese/creator-01.jpg",
  "/assets/work/lays/lays-paper-thin-wafer-thin/hero.jpg",
  "/assets/work/kurkure/kurkure-puffballs/creator-02.jpg",
  "/assets/work/sting/sting-macha-de-challenge/sting-macha-de-challenge-creator-01.jpg",
  "/assets/work/doritos/doritos-chips-nahi-fire/hero.jpg",
  "/assets/work/mountain-dew/mountain-dew-conquer-with-courage/mountain-dew-conquer-with-courage-creator-01.jpg",
  "/assets/work/pepsi/pepsi-check-my-fizz/pepsi-check-my-fizz-creator-01.jpg",
  "/assets/work/lays/mylaysrelationchip/mylaysrelationchip-creator-01.jpg",
  "/assets/work/kurkure/kurkure-puffballs/hero.jpg",
];

export async function generateMetadata() {
  const { seo } = await getCreatorsPage();
  const title = seo.metaTitle || CREATORS_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || CREATORS_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/creators" },
    openGraph: {
      title,
      description,
      url: "/creators",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CreatorsPage() {
  const { isEnabled: draft } = await draftMode();
  const { hero, oneDegree, whyGeek, join } = await getCreatorsPage({ draft });

  return (
    <>
      <style href="creators" precedence="default">
        {styles}
      </style>
      <main id="main" className="creators">
        {draft && <div className="creators__draft">Preview — draft (not public)</div>}

        {/* Hero */}
        <section className="creators-container creators-hero">
          <div>
            <h1 className="creators-display creators-hero__title">
              <HighlightedLines text={hero.headingBlock} highlight={hero.headingHighlight} />
            </h1>
            <p className="creators-hero__subline">{hero.subline}</p>
            <a href={hero.ctaHref} className="creators-hero__cta">
              {hero.ctaLabel} <span aria-hidden>→</span>
            </a>
          </div>
          {/* creator mosaic (decorative slots — code-controlled) */}
          <div className="creators-mosaic">
            {CREATOR_MOSAIC.map((src, i) => (
              <div key={src} className="creators-mosaic__tile">
                <Media
                  src={src}
                  label={`Geek creator content ${i + 1}`}
                  index={i}
                  showSlotLabel={false}
                />
                {i === 4 && <div className="creators-mosaic__tint" />}
              </div>
            ))}
          </div>
        </section>

        {/* One degree of separation */}
        <section className="creators-degree">
          <div className="creators-container creators-degree__inner">
            <h2 className="creators-display creators-degree__heading">
              <HighlightedLines text={oneDegree.heading} />
            </h2>
            <p className="creators-degree__body">{oneDegree.body}</p>
            <div className="creators-degree__list">
              {oneDegree.opportunities.map((o) => (
                <span key={o} className="creators-display creators-degree__item">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Why Geek */}
        <section className="creators-container creators-why">
          <p className="creators__eyebrow">{whyGeek.eyebrow}</p>
          <h2 className="creators-display creators-why__heading">
            <HighlightedLines text={whyGeek.heading} highlight={whyGeek.headingHighlight} />
          </h2>
        </section>

        {/* Registration form (form itself is code-controlled) */}
        <section id="join" className="creators-join">
          <div className="creators-join__inner">
            <p className="creators__eyebrow">{join.eyebrow}</p>
            <h2 className="creators-display creators-join__heading">{join.heading}</h2>
            <p className="creators-join__sub">{join.subcopy}</p>
            <div className="creators-join__form">
              <CreatorForm />
            </div>
          </div>
        </section>

        {/* The other doors — same as at the end of every door page */}
        <FourDoors eyebrow="Other doors." heading="Looking for something else?" exclude="creator" />
      </main>
    </>
  );
}

const styles = `
.creators {
  padding-top: 6rem;
}

.creators__draft {
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

.creators__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

/* Hero */
.creators-hero {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: center;
  gap: 2rem;
  padding-block: 2.5rem;
}

.creators-hero__title {
  font-size: clamp(2.6rem, 6.5vw, 5.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.creators-hero__subline {
  margin-top: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.creators-hero__cta {
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background-color: #0c0d0c;
  padding: 0.875rem 1.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffffff;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.creators-hero__cta:hover {
  background-color: #32c1df;
}

.creators-mosaic {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.creators-mosaic__tile {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 0.375rem;
}

.creators-mosaic__tint {
  position: absolute;
  inset: 0px;
  background-color: rgba(50, 193, 223, 0.85);
}

/* One degree of separation */
.creators-degree {
  border-top: 1px solid #eceeeb;
  background-color: #0c0d0c;
  color: #ffffff;
}

.creators-degree__inner {
  padding-block: 4rem;
}

.creators-degree__heading {
  font-size: clamp(2.2rem, 6vw, 5rem);
  text-transform: uppercase;
}

.creators-degree__body {
  margin-top: 1.25rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.creators-degree__list {
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 0.75rem;
}

.creators-degree__item {
  font-size: 1.25rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
}

/* Why Geek */
.creators-why {
  padding-block: 4rem;
}

.creators-why__heading {
  margin-top: 1.25rem;
  font-size: clamp(2rem, 5.5vw, 4.4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

/* Registration */
.creators-join {
  border-top: 1px solid #eceeeb;
  background-color: #f5f6f4;
}

.creators-join__inner {
  margin-inline: auto;
  max-width: 42rem;
  padding: 4rem 1.25rem;
}

.creators-join__heading {
  margin-top: 1rem;
  font-size: 1.875rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.creators-join__sub {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.creators-join__form {
  margin-top: 2rem;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.creators-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .creators-container {
    padding-inline: 20px;
  }
}

.creators-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .creators {
    padding-top: 7rem;
  }

  .creators-hero {
    padding-block: 4rem;
  }

  .creators-degree__inner,
  .creators-why {
    padding-block: 6rem;
  }

  .creators-degree__item {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .creators-join__inner {
    padding: 6rem 2rem;
  }

  .creators-join__heading {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .creators-hero {
    grid-template-columns: minmax(0, 52%) minmax(0, 48%);
  }
}
`;
