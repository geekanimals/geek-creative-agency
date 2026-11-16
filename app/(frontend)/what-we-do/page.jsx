import { draftMode } from "next/headers";
import Process from "@/components/home/Process";
import Band from "@/components/ui/Band";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { getWhatWeDo } from "@/lib/cms/whatWeDo";
import { WHAT_WE_DO_FALLBACK } from "@/lib/site/whatWeDoFallback";
import { ogFallback } from "@/lib/seo/ogImage";

export async function generateMetadata() {
  const { seo } = await getWhatWeDo();
  const title = seo.metaTitle || WHAT_WE_DO_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || WHAT_WE_DO_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/what-we-do" },
    openGraph: {
      title,
      description,
      url: "/what-we-do",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function WhatWeDoPage() {
  const { isEnabled: draft } = await draftMode();
  const { hero, capabilities, cta } = await getWhatWeDo({ draft });

  return (
    <>
      <style href="wwd" precedence="default">
        {styles}
      </style>
      <main id="main" className="wwd">
        {draft && <div className="wwd__draft">Preview — draft (not public)</div>}

        {/* Hero */}
        <section className="wwd-container wwd-hero">
          {/* One <h1> for SEO; the two blocks keep their own look. */}
          <h1>
            <span className="wwd-display wwd-hero__title">
              <HighlightedLines text={hero.block1} />
            </span>
            <span className="wwd-display wwd-hero__title wwd-hero__title--second">
              <HighlightedLines text={hero.block2} highlight={hero.highlight} />
            </span>
          </h1>
          <p className="wwd-hero__intro">{hero.intro}</p>
        </section>

        {/* Capabilities */}
        {capabilities.map((c) => (
          <Band
            key={c.label}
            label={
              <div>
                <h2 className="wwd-display wwd-cap__label">{c.label}</h2>
                <ul className="wwd-cap__items">
                  {c.items.map((it) => (
                    <li key={it} className="wwd-cap__item">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            }
          >
            <p className="wwd-display wwd-cap__thought">
              <HighlightedLines text={c.thought} highlight={c.thoughtHighlight} />
            </p>
            {c.linkLabel && c.linkHref && (
              <a href={c.linkHref} className="wwd-cap__link">
                {c.linkLabel} <span aria-hidden>→</span>
              </a>
            )}
          </Band>
        ))}

        {/* Full service list — every discipline under one roof */}
        <section className="wwd-container wwd-services" aria-labelledby="wwd-services-title">
          <div className="wwd-services__head">
            <p className="wwd-services__eyebrow">Everything we do</p>
            <h2 id="wwd-services-title" className="wwd-display wwd-services__title">
              The full service list.
            </h2>
          </div>
          <dl className="wwd-services__list">
            {SERVICES.map((sv, i) => (
              <div key={sv.name} className="wwd-services__row">
                <dt className="wwd-services__name">
                  <span className="wwd-services__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wwd-display">{sv.name}</span>
                </dt>
                <dd className="wwd-services__desc">{sv.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Process rail (from the big idea to the last mile → we make it happen) */}
        <Process />

        {/* CTA */}
        <section className="wwd-container wwd-cta">
          <a href={cta.href} className="wwd-cta__button">
            {cta.label} <span aria-hidden>→</span>
          </a>
        </section>
      </main>
    </>
  );
}

// The full service list (first six from the original geekcreativeagency.com).
const SERVICES = [
  { name: "Advertising", desc: "360° ATL, BTL and digital campaigns." },
  { name: "Branding", desc: "Logo, design, characters, identity and collateral." },
  { name: "Video", desc: "Scripting, motion graphics, animation and promotion." },
  { name: "Web Design", desc: "Wireframes, media integration and mobile-first websites." },
  { name: "Social Media & Online Engagement", desc: "Strategy, digital PR, content creation, platform optimisation and fan-base building." },
  { name: "Product Design & UX", desc: "Concepts, UX/UI, apps and digital product development." },
  { name: "SEO & Performance", desc: "Search engine optimisation, app store and e-commerce SEO, performance marketing and analytics." },
];

const styles = `
/* Full service list */
.wwd-services {
  padding-block: 4rem;
}
.wwd-services__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}
.wwd-services__title {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 5vw, 4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}
.wwd-services__list {
  margin: 2.5rem 0 0;
  border-top: 1px solid #eceeeb;
}
.wwd-services__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.5rem;
  padding-block: 1.25rem;
  border-bottom: 1px solid #eceeeb;
}
.wwd-services__name {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  font-size: 1.35rem;
  text-transform: uppercase;
  color: #0c0d0c;
}
.wwd-services__num {
  flex: none;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #32c1df;
}
.wwd-services__desc {
  margin: 0;
  padding-left: 2.1rem;
  font-size: 1rem;
  line-height: 1.6rem;
  color: #5a5f5c;
}
@media (min-width: 640px) {
  .wwd-services {
    padding-block: 6rem;
  }
  .wwd-services__row {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 2rem;
    align-items: baseline;
    padding-block: 1.6rem;
  }
  .wwd-services__name {
    font-size: 1.75rem;
  }
  .wwd-services__desc {
    padding-left: 0;
    font-size: 1.05rem;
  }
}

.wwd {
  padding-top: 6rem;
}

.wwd__draft {
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

/* Hero */
.wwd-hero {
  padding-block: 2.5rem;
}

.wwd-hero__title {
  display: block;
  font-size: clamp(2.4rem, 6.5vw, 5.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.wwd-hero__title--second {
  margin-top: 0.5rem;
  color: #5a5f5c;
}

.wwd-hero__intro {
  margin-top: 2rem;
  max-width: 40ch;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

/* Capability bands */
.wwd-cap__label {
  font-size: 1.875rem;
  text-transform: uppercase;
  color: #32c1df;
}

.wwd-cap__items {
  margin-top: 0.75rem;
}

.wwd-cap__items > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.25rem;
}

.wwd-cap__item {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a5f5c;
}

/* line-height stays 0.92 from .wwd-display (it overrode leading-[0.95] in the original) */
.wwd-cap__thought {
  font-size: clamp(1.8rem, 4.5vw, 3.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.wwd-cap__link {
  margin-top: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0c0d0c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.wwd-cap__link:hover {
  color: #32c1df;
}

/* CTA */
.wwd-cta {
  padding-block: 4rem;
  text-align: center;
}

.wwd-cta__button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 9999px;
  background-color: #0c0d0c;
  padding: 1rem 2.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffffff;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.wwd-cta__button:hover {
  background-color: #32c1df;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.wwd-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .wwd-container {
    padding-inline: 20px;
  }
}

.wwd-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .wwd {
    padding-top: 7rem;
  }

  .wwd-hero {
    padding-block: 4rem;
  }

  .wwd-cap__label {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }

  .wwd-cta {
    padding-block: 6rem;
  }
}
`;
