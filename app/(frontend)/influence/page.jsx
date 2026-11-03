import Link from "next/link";
import { draftMode } from "next/headers";
import Band from "@/components/ui/Band";
import BuildSteps from "@/components/build/BuildSteps";
import StoryBoxes from "@/components/influence/StoryBoxes";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { getInfluencePage } from "@/lib/cms/influencePage";
import { INFLUENCE_FALLBACK } from "@/lib/site/influenceFallback";
import { ogFallback } from "@/lib/seo/ogImage";

/**
 * /influence — Geek's influencer marketing, A to Z (opened from the Home
 * "Influence." band), with the Geek Influencer OS brand login.
 * Content: admin → Pages → Influence Page; empty fields use lib/site/influenceFallback.ts.
 */
export async function generateMetadata() {
  const { seo } = await getInfluencePage();
  const title = seo.metaTitle || INFLUENCE_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || INFLUENCE_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/influence" },
    openGraph: {
      title,
      description,
      url: "/influence",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title, "Influence"),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** External links (Geek Influencer OS) open in a new tab; site links use Link. */
function Go({ href, className, children }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function InfluencePage() {
  const { isEnabled: draft } = await draftMode();
  const { hero, tiers, models, steps, platform, hampers, stories, clients, cta } =
    await getInfluencePage({ draft });

  return (
    <>
      <style href="influence-page" precedence="default">
        {styles}
      </style>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Influence", path: "/influence" },
        ])}
      />
      <main id="main" className="ipage">
        {draft && <div className="ipage__draft">Preview — draft (not public)</div>}

        {/* Hero */}
        <section className="ipage-container ipage-hero">
          <p className="ipage-display ipage-hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="ipage-display ipage-hero__title">
            <HighlightedLines text={hero.heading} highlight={hero.highlight} />
          </h1>
          <p className="ipage-hero__intro">{hero.intro}</p>
          <div className="ipage-actions">
            <Go href={hero.primaryHref} className="ipage-btn ipage-btn--dark">
              {hero.primaryLabel} <span aria-hidden>→</span>
            </Go>
            <Go href={hero.brandLoginHref} className="ipage-btn ipage-btn--line">
              {hero.brandLoginLabel} <span aria-hidden>↗</span>
            </Go>
          </div>
        </section>

        {/* Creator tiers */}
        <Band label={<h2 className="ipage-display ipage-label__heading">{tiers.heading}</h2>}>
          <ul className="ipage-tiers">
            {tiers.items.map((t) => (
              <li key={t} className="ipage-display ipage-tiers__item">
                {t}
              </li>
            ))}
          </ul>
        </Band>

        {/* Six models */}
        <Band
          id="models"
          label={
            <div>
              <p className="ipage-label__eyebrow">{models.eyebrow}</p>
              <h2 className="ipage-display ipage-label__heading">{models.heading}</h2>
            </div>
          }
        >
          <ol className="ipage-models">
            {models.items.map((m, i) => (
              <li key={m.title} className="ipage-models__item">
                <span className="ipage-models__num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="ipage-display ipage-models__title">{m.title}</h3>
                {m.tag && <p className="ipage-models__tag">{m.tag}</p>}
                <p className="ipage-models__body">{m.body}</p>
              </li>
            ))}
          </ol>
        </Band>

        {/* A to Z process */}
        <BuildSteps
          eyebrow={steps.eyebrow}
          heading={steps.heading}
          closing={steps.closing}
          items={steps.items}
        />

        {/* Geek Influencer OS — brand login */}
        <section id="platform" className="ipage-os">
          <div className="ipage-container ipage-os__grid">
            <div>
              <p className="ipage-label__eyebrow">{platform.eyebrow}</p>
              <h2 className="ipage-display ipage-os__heading">
                <HighlightedLines text={platform.heading} />
              </h2>
              <p className="ipage-os__body">{platform.body}</p>
              <div className="ipage-actions">
                <Go href={platform.buttonHref} className="ipage-btn ipage-btn--cyan">
                  {platform.buttonLabel} <span aria-hidden>↗</span>
                </Go>
                {platform.creatorLabel && platform.creatorHref && (
                  <Go href={platform.creatorHref} className="ipage-os__creator">
                    {platform.creatorLabel} <span aria-hidden>→</span>
                  </Go>
                )}
              </div>
            </div>
            <ul className="ipage-os__features">
              {platform.features.map((f) => (
                <li key={f} className="ipage-os__feature">
                  <span className="ipage-os__tick" aria-hidden>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Hampers — story boxes */}
        <StoryBoxes
          id="hampers"
          eyebrow={hampers.eyebrow}
          heading={hampers.heading}
          intro={hampers.intro}
          items={hampers.items}
          dark
        />

        {/* Case studies — story boxes */}
        <StoryBoxes
          id="case-studies"
          eyebrow={stories.eyebrow}
          heading={stories.heading}
          items={stories.items}
        />

        {/* Clients */}
        <Band label={<h2 className="ipage-display ipage-label__heading">{clients.heading}</h2>}>
          <ul className="ipage-clients">
            {clients.items.map((c) => (
              <li key={c} className="ipage-display ipage-clients__item">
                {c}
              </li>
            ))}
          </ul>
        </Band>

        {/* CTA */}
        <section className="ipage-container ipage-cta">
          <h2 className="ipage-display ipage-cta__heading">
            <HighlightedLines text={cta.heading} highlight={cta.highlight} />
          </h2>
          <div className="ipage-actions">
            <Go href={cta.href} className="ipage-btn ipage-btn--dark">
              {cta.label} <span aria-hidden>→</span>
            </Go>
            {cta.secondaryLabel && cta.secondaryHref && (
              <Go href={cta.secondaryHref} className="ipage-btn ipage-btn--line">
                {cta.secondaryLabel} <span aria-hidden>↗</span>
              </Go>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

const styles = `
.ipage {
  padding-top: 6rem;
}

.ipage__draft {
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

.ipage-hero {
  padding-block: 2.5rem 3rem;
}

.ipage-hero__eyebrow {
  font-size: 1.75rem;
  color: #32c1df;
}

.ipage-hero__title {
  margin-top: 1rem;
  font-size: clamp(2.4rem, 6.5vw, 5.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.ipage-hero__intro {
  margin-top: 2rem;
  max-width: 48ch;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #5a5f5c;
}

.ipage-actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
}

.ipage-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.9rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

.ipage-btn--dark {
  background-color: #0c0d0c;
  color: #ffffff;
}

.ipage-btn--dark:hover {
  background-color: #32c1df;
  color: #0c0d0c;
}

.ipage-btn--line {
  border: 1.5px solid #0c0d0c;
  color: #0c0d0c;
}

.ipage-btn--line:hover {
  border-color: #32c1df;
  color: #32c1df;
}

.ipage-btn--cyan {
  background-color: #32c1df;
  color: #0c0d0c;
}

.ipage-btn--cyan:hover {
  background-color: #ffffff;
}

.ipage-label__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.ipage-label__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.ipage-tiers,
.ipage-clients {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
}

.ipage-tiers__item {
  font-size: clamp(1.6rem, 3.6vw, 2.75rem);
  color: #0c0d0c;
}

.ipage-tiers__item:nth-child(even) {
  color: #32c1df;
}

.ipage-clients__item {
  font-size: clamp(1.25rem, 2.6vw, 2rem);
  color: #0c0d0c;
}

.ipage-clients__item:nth-child(3n + 2) {
  color: #32c1df;
}

.ipage-models {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.ipage-models__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(12, 13, 12, 0.1);
  padding: 1.5rem 1.25rem;
}

.ipage-models__num {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #32c1df;
}

.ipage-models__title {
  font-size: 1.6rem;
  color: #0c0d0c;
}

.ipage-models__tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.ipage-models__body {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #5a5f5c;
}

.ipage-os {
  background-color: #0c0d0c;
  color: #ffffff;
  padding-block: 4rem;
}

.ipage-os__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2.5rem;
}

.ipage-os__heading {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 4.5vw, 3.75rem);
  text-transform: uppercase;
  color: #ffffff;
}

.ipage-os__body {
  margin-top: 1.5rem;
  max-width: 48ch;
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78);
}

.ipage-os__creator {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffffff;
  border-bottom: 1px solid #32c1df;
  padding-bottom: 2px;
}

.ipage-os__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-self: center;
}

.ipage-os__feature {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.06);
  padding: 1rem 1.25rem;
  font-size: 1rem;
  line-height: 1.4;
}

.ipage-os__tick {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: #32c1df;
  color: #0c0d0c;
  font-size: 0.8rem;
  font-weight: 700;
}

.ipage-cta {
  padding-block: 4rem 5rem;
}

.ipage-cta__heading {
  font-size: clamp(2.2rem, 6vw, 4.8rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.ipage-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .ipage-container {
    padding-inline: 20px;
  }
}

.ipage-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.95;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .ipage {
    padding-top: 7rem;
  }

  .ipage-hero {
    padding-block: 4rem;
  }

  .ipage-label__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .ipage-models {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .ipage-models {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ipage-os {
    padding-block: 6rem;
  }

  .ipage-os__grid {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 4rem;
  }
}
`;
