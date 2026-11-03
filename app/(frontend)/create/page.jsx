import Link from "next/link";
import { draftMode } from "next/headers";
import Band from "@/components/ui/Band";
import BuildSteps from "@/components/build/BuildSteps";
import BuildShowcase from "@/components/build/BuildShowcase";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { getCreatePage } from "@/lib/cms/createPage";
import { getWorkProjects } from "@/lib/cms/projects";
import { createGallery } from "@/lib/data/work";
import { CREATE_FALLBACK } from "@/lib/site/createFallback";
import { ogFallback } from "@/lib/seo/ogImage";

/**
 * /create — how Geek runs campaigns (opened from the Home "Create." band).
 * Content: admin → Pages → Create Page; empty fields use lib/site/createFallback.ts.
 * Shares the Build page's section components (components/build/*).
 */
export async function generateMetadata() {
  const { seo } = await getCreatePage();
  const title = seo.metaTitle || CREATE_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || CREATE_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/create" },
    openGraph: {
      title,
      description,
      url: "/create",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title, "Create"),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CreatePage() {
  const { isEnabled: draft } = await draftMode();
  const [page, projects] = await Promise.all([getCreatePage({ draft }), getWorkProjects()]);
  const { hero, phases, steps, capabilities, showcase, portfolio, proof, cta } = page;

  // Home "Create." gallery first (each opens its case study), then more campaigns.
  const published = new Map(
    projects.filter((p) => p.publishStatus === "published").map((p) => [p.slug, p]),
  );
  const fromGallery = createGallery
    .filter((w) => published.has(w.slug))
    .map((w) => {
      const p = published.get(w.slug);
      return {
        key: w.slug,
        href: `/work/${w.slug}`,
        src: w.src,
        need: w.need,
        brand: w.brand,
        project: w.project,
        blurb: p.project,
      };
    });
  const seen = new Set(fromGallery.map((c) => c.key));
  const cards = [
    ...fromGallery,
    ...showcase.storySlugs
      .filter((slug) => !seen.has(slug))
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
      <style href="create-page" precedence="default">
        {styles}
      </style>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Create", path: "/create" },
        ])}
      />
      <main id="main" className="cpage">
        {draft && <div className="cpage__draft">Preview — draft (not public)</div>}

        {/* Hero */}
        <section className="cpage-container cpage-hero">
          <p className="cpage-display cpage-hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="cpage-display cpage-hero__title">
            <HighlightedLines text={hero.heading} highlight={hero.highlight} />
          </h1>
          <p className="cpage-hero__intro">{hero.intro}</p>
        </section>

        {/* The kinds of campaigns Geek runs */}
        <Band
          id="phases"
          label={
            <div>
              <p className="cpage-label__eyebrow">{phases.eyebrow}</p>
              <h2 className="cpage-display cpage-label__heading">{phases.heading}</h2>
            </div>
          }
        >
          <ol className="cpage-phases">
            {phases.items.map((p, i) => (
              <li key={p.title} className="cpage-phases__item">
                <span className="cpage-phases__label">
                  {p.label || `Phase ${String(i + 1).padStart(2, "0")}`}
                </span>
                <h3 className="cpage-display cpage-phases__title">{p.title}</h3>
                {p.subtitle && <p className="cpage-phases__subtitle">{p.subtitle}</p>}
                {p.body && <p className="cpage-phases__body">{p.body}</p>}
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

        {/* Creator tiers */}
        <Band label={<h2 className="cpage-display cpage-caps__heading">{capabilities.heading}</h2>}>
          <ul className="cpage-caps__list">
            {capabilities.items.map((c) => (
              <li key={c} className="cpage-display cpage-caps__item">
                {c}
              </li>
            ))}
          </ul>
        </Band>

        {/* The campaigns */}
        <BuildShowcase eyebrow={showcase.eyebrow} heading={showcase.heading} cards={cards} />

        {/* What every campaign runs on (tracker stages) */}
        {portfolio.items.length > 0 && (
          <Band label={<h2 className="cpage-display cpage-label__heading">{portfolio.heading}</h2>}>
            <ul className="cpage-portfolio">
              {portfolio.items.map((name) => (
                <li key={name} className="cpage-display cpage-portfolio__item">
                  {name}
                </li>
              ))}
            </ul>
            {portfolio.note && <p className="cpage-portfolio__note">{portfolio.note}</p>}
          </Band>
        )}

        {/* Real numbers from the case studies */}
        {proof.items.length > 0 && (
          <Band
            label={
              <div>
                <p className="cpage-proof__eyebrow">{proof.eyebrow}</p>
                <h2 className="cpage-display cpage-proof__heading">{proof.heading}</h2>
              </div>
            }
          >
            <div className="cpage-proof__grid">
              {proof.items.map((p) => {
                const inner = (
                  <>
                    <span className="cpage-display cpage-proof__value">{p.value}</span>
                    <span className="cpage-proof__label">{p.label}</span>
                  </>
                );
                return p.href ? (
                  <Link key={p.value + p.label} href={p.href} className="cpage-proof__item">
                    {inner}
                  </Link>
                ) : (
                  <div key={p.value + p.label} className="cpage-proof__item">
                    {inner}
                  </div>
                );
              })}
            </div>
          </Band>
        )}

        {/* CTA */}
        <section className="cpage-container cpage-cta">
          <h2 className="cpage-display cpage-cta__heading">
            <HighlightedLines text={cta.heading} highlight={cta.highlight} />
          </h2>
          <div className="cpage-cta__actions">
            <Link href={cta.href} className="cpage-cta__button">
              {cta.label} <span aria-hidden>→</span>
            </Link>
            {cta.secondaryLabel && cta.secondaryHref && (
              <Link href={cta.secondaryHref} className="cpage-cta__secondary">
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
.cpage {
  padding-top: 6rem;
}

.cpage__draft {
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

.cpage-hero {
  padding-block: 2.5rem 3rem;
}

.cpage-hero__eyebrow {
  font-size: 1.75rem;
  color: #32c1df;
}

.cpage-hero__title {
  margin-top: 1rem;
  font-size: clamp(2.4rem, 6.5vw, 5.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.cpage-hero__intro {
  margin-top: 2rem;
  max-width: 46ch;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #5a5f5c;
}

.cpage-label__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.cpage-label__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.cpage-phases {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.cpage-phases__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
  padding: 1.5rem 1.25rem;
  color: #ffffff;
}

.cpage-phases__item:nth-child(2) {
  background-color: #0f5a6b;
}

.cpage-phases__item:nth-child(3) {
  background-color: #32c1df;
  color: #0c0d0c;
}

.cpage-phases__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.75;
}

.cpage-phases__title {
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
}

.cpage-phases__subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.cpage-phases__item:nth-child(3) .cpage-phases__subtitle {
  color: #0c0d0c;
}

.cpage-phases__body {
  margin-top: 0.25rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  opacity: 0.85;
}

.cpage-portfolio {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
}

.cpage-portfolio__item {
  font-size: clamp(1.4rem, 3vw, 2.25rem);
  color: #0c0d0c;
}

.cpage-portfolio__note {
  margin-top: 1.25rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.cpage-caps__heading {
  font-size: 1.5rem;
  color: #0c0d0c;
}

.cpage-caps__list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
}

.cpage-caps__item {
  font-size: clamp(1.6rem, 3.6vw, 2.75rem);
  color: #0c0d0c;
}

.cpage-caps__item:nth-child(even) {
  color: #32c1df;
}

.cpage-proof__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.cpage-proof__heading {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: #0c0d0c;
}

.cpage-proof__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.cpage-proof__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
  padding: 1.5rem 1.25rem;
  color: #ffffff;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

a.cpage-proof__item:hover {
  transform: translateY(-0.125rem);
}

.cpage-proof__value {
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: #32c1df;
}

.cpage-proof__label {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.cpage-cta {
  padding-block: 4rem 5rem;
}

.cpage-cta__heading {
  font-size: clamp(2.2rem, 6vw, 4.8rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.cpage-cta__actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
}

.cpage-cta__button {
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

.cpage-cta__button:hover {
  background-color: #32c1df;
  color: #0c0d0c;
}

.cpage-cta__secondary {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
  border-bottom: 1px solid #32c1df;
  padding-bottom: 2px;
}

.cpage-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .cpage-container {
    padding-inline: 20px;
  }
}

.cpage-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .cpage-phases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cpage {
    padding-top: 7rem;
  }

  .cpage-hero {
    padding-block: 4rem;
  }

  .cpage-caps__heading,
  .cpage-label__heading,
  .cpage-proof__heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .cpage-proof__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .cpage-phases {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .cpage-proof__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
