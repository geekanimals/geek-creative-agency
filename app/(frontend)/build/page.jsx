import Link from "next/link";
import { draftMode } from "next/headers";
import Band from "@/components/ui/Band";
import BuildSteps from "@/components/build/BuildSteps";
import BuildShowcase from "@/components/build/BuildShowcase";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { getBuildPage } from "@/lib/cms/buildPage";
import { getWorkProjects } from "@/lib/cms/projects";
import { buildStories } from "@/lib/data/work";
import { BUILD_FALLBACK } from "@/lib/site/buildFallback";
import { ogFallback } from "@/lib/seo/ogImage";

/**
 * /build — how Geek takes a brand from zero (opened from the Home "Build." band).
 * Content: admin → Pages → Build Page; empty fields use lib/site/buildFallback.ts.
 */
export async function generateMetadata() {
  const { seo } = await getBuildPage();
  const title = seo.metaTitle || BUILD_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || BUILD_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/build" },
    openGraph: {
      title,
      description,
      url: "/build",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title, "Build"),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BuildPage() {
  const { isEnabled: draft } = await draftMode();
  const [page, projects] = await Promise.all([getBuildPage({ draft }), getWorkProjects()]);
  const { hero, phases, steps, capabilities, showcase, portfolio, proof, cta } = page;

  // Home "Build." cards first, then the chosen brand-building case studies.
  const published = new Map(
    projects.filter((p) => p.publishStatus === "published").map((p) => [p.slug, p]),
  );
  const cards = [
    ...buildStories.map((s) => ({
      key: s.slug,
      href: s.href,
      src: s.src,
      need: s.need,
      brand: s.brand,
      project: s.project,
      blurb: s.blurb,
    })),
    ...showcase.storySlugs
      .map((slug) => published.get(slug))
      .filter(Boolean)
      .map((p) => ({
        key: p.slug,
        href: `/work/${p.slug}`,
        src: p.heroImage,
        need: p.heroImageNeed,
        brand: p.brand,
        project: p.headline || p.project,
        blurb: p.project,
      })),
  ];

  return (
    <>
      <style href="build-page" precedence="default">
        {styles}
      </style>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Build", path: "/build" },
        ])}
      />
      <main id="main" className="bpage">
        {draft && <div className="bpage__draft">Preview — draft (not public)</div>}

        {/* Hero */}
        <section className="bpage-container bpage-hero">
          <p className="bpage-display bpage-hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="bpage-display bpage-hero__title">
            <HighlightedLines text={hero.heading} highlight={hero.highlight} />
          </h1>
          <p className="bpage-hero__intro">{hero.intro}</p>
        </section>

        {/* Geek's three-phase model: Creation → Activation → Building */}
        <Band
          id="phases"
          label={
            <div>
              <p className="bpage-label__eyebrow">{phases.eyebrow}</p>
              <h2 className="bpage-display bpage-label__heading">{phases.heading}</h2>
            </div>
          }
        >
          <ol className="bpage-phases">
            {phases.items.map((p, i) => (
              <li key={p.title} className="bpage-phases__item">
                <span className="bpage-phases__label">
                  {p.label || `Phase ${String(i + 1).padStart(2, "0")}`}
                </span>
                <h3 className="bpage-display bpage-phases__title">{p.title}</h3>
                {p.subtitle && <p className="bpage-phases__subtitle">{p.subtitle}</p>}
                {p.body && <p className="bpage-phases__body">{p.body}</p>}
              </li>
            ))}
          </ol>
        </Band>

        {/* The 0 → 100 playbook */}
        <BuildSteps
          eyebrow={steps.eyebrow}
          heading={steps.heading}
          closing={steps.closing}
          items={steps.items}
        />

        {/* What we build */}
        <Band label={<h2 className="bpage-display bpage-caps__heading">{capabilities.heading}</h2>}>
          <ul className="bpage-caps__list">
            {capabilities.items.map((c) => (
              <li key={c} className="bpage-display bpage-caps__item">
                {c}
              </li>
            ))}
          </ul>
        </Band>

        {/* Brands we've built */}
        <BuildShowcase eyebrow={showcase.eyebrow} heading={showcase.heading} cards={cards} />

        {/* Brand launches & branding listed in Geek's credentials (names only) */}
        {portfolio.items.length > 0 && (
          <Band label={<h2 className="bpage-display bpage-label__heading">{portfolio.heading}</h2>}>
            <ul className="bpage-portfolio">
              {portfolio.items.map((name) => (
                <li key={name} className="bpage-display bpage-portfolio__item">
                  {name}
                </li>
              ))}
            </ul>
            {portfolio.note && <p className="bpage-portfolio__note">{portfolio.note}</p>}
          </Band>
        )}

        {/* Real numbers from the case studies */}
        {proof.items.length > 0 && (
          <Band
            label={
              <div>
                <p className="bpage-proof__eyebrow">{proof.eyebrow}</p>
                <h2 className="bpage-display bpage-proof__heading">{proof.heading}</h2>
              </div>
            }
          >
            <div className="bpage-proof__grid">
              {proof.items.map((p) => {
                const inner = (
                  <>
                    <span className="bpage-display bpage-proof__value">{p.value}</span>
                    <span className="bpage-proof__label">{p.label}</span>
                  </>
                );
                return p.href ? (
                  <Link key={p.value + p.label} href={p.href} className="bpage-proof__item">
                    {inner}
                  </Link>
                ) : (
                  <div key={p.value + p.label} className="bpage-proof__item">
                    {inner}
                  </div>
                );
              })}
            </div>
          </Band>
        )}

        {/* CTA */}
        <section className="bpage-container bpage-cta">
          <h2 className="bpage-display bpage-cta__heading">
            <HighlightedLines text={cta.heading} highlight={cta.highlight} />
          </h2>
          <div className="bpage-cta__actions">
            <Link href={cta.href} className="bpage-cta__button">
              {cta.label} <span aria-hidden>→</span>
            </Link>
            {cta.secondaryLabel && cta.secondaryHref && (
              <Link href={cta.secondaryHref} className="bpage-cta__secondary">
                {cta.secondaryLabel}
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

const styles = `
.bpage {
  padding-top: 6rem;
}

.bpage__draft {
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

.bpage-hero {
  padding-block: 2.5rem 3rem;
}

.bpage-hero__eyebrow {
  font-size: 1.75rem;
  color: #32c1df;
}

.bpage-hero__title {
  margin-top: 1rem;
  font-size: clamp(2.4rem, 6.5vw, 5.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.bpage-hero__intro {
  margin-top: 2rem;
  max-width: 46ch;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #5a5f5c;
}

.bpage-label__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.bpage-label__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.bpage-phases {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.bpage-phases__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
  padding: 1.5rem 1.25rem;
  color: #ffffff;
}

.bpage-phases__item:nth-child(2) {
  background-color: #0f5a6b;
}

.bpage-phases__item:nth-child(3) {
  background-color: #32c1df;
  color: #0c0d0c;
}

.bpage-phases__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.75;
}

.bpage-phases__title {
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
}

.bpage-phases__subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.bpage-phases__item:nth-child(3) .bpage-phases__subtitle {
  color: #0c0d0c;
}

.bpage-phases__body {
  margin-top: 0.25rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  opacity: 0.85;
}

.bpage-portfolio {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
}

.bpage-portfolio__item {
  font-size: clamp(1.4rem, 3vw, 2.25rem);
  color: #0c0d0c;
}

.bpage-portfolio__note {
  margin-top: 1.25rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.bpage-caps__heading {
  font-size: 1.5rem;
  color: #0c0d0c;
}

.bpage-caps__list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
}

.bpage-caps__item {
  font-size: clamp(1.6rem, 3.6vw, 2.75rem);
  color: #0c0d0c;
}

.bpage-caps__item:nth-child(even) {
  color: #32c1df;
}

.bpage-proof__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.bpage-proof__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.bpage-proof__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.bpage-proof__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
  padding: 1.5rem 1.25rem;
  color: #ffffff;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

a.bpage-proof__item:hover {
  transform: translateY(-0.125rem);
}

.bpage-proof__value {
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: #32c1df;
}

.bpage-proof__label {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.bpage-cta {
  padding-block: 4rem 5rem;
}

.bpage-cta__heading {
  font-size: clamp(2.2rem, 6vw, 4.8rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.bpage-cta__actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
}

.bpage-cta__button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background-color: #0c0d0c;
  padding: 0.9rem 1.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffffff;
  transition: background-color 200ms ease;
}

.bpage-cta__button:hover {
  background-color: #32c1df;
  color: #0c0d0c;
}

.bpage-cta__secondary {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
  border-bottom: 1px solid #32c1df;
  padding-bottom: 2px;
}

.bpage-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .bpage-container {
    padding-inline: 20px;
  }
}

.bpage-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .bpage {
    padding-top: 7rem;
  }

  .bpage-hero {
    padding-block: 4rem;
  }

  .bpage-caps__heading,
  .bpage-label__heading,
  .bpage-proof__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .bpage-proof__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .bpage-phases {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bpage-proof__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
`;
