import { Fragment } from "react";
import Link from "next/link";
import Media from "@/components/ui/Media";

/** Page shell shared by every portfolio hub. React owns all art direction; the
 *  CMS only supplies copy + relationships. */
export function HubShell({ draft, children }) {
  return (
    <>
      <style href="hub" precedence="default">
        {styles}
      </style>
      <main id="main" className="hub-shell__main">
        {draft && <div className="hub-draft">Preview — draft (not public)</div>}
        {children}
      </main>
    </>
  );
}

/** Linear discovery trail: Industry → Company → Brand → Service → Solution.
 *  Only shows the steps that exist (no empty/irrelevant steps). */
export function HubTrail({ items }) {
  const shown = items.filter((i) => i.name);
  if (shown.length === 0) return null;
  return (
    <nav aria-label="Discovery trail" className="hub-container hub-trail">
      <style href="hub" precedence="default">
        {styles}
      </style>
      <ol className="hub-trail__list">
        {shown.map((i, n) => (
          <Fragment key={`${i.name}-${n}`}>
            {n > 0 && (
              <li aria-hidden className="hub-trail__sep">
                →
              </li>
            )}
            <li>
              {i.href ? (
                <Link href={i.href} className="hub-trail__link">
                  {i.name}
                </Link>
              ) : (
                <span className="hub-trail__current">{i.name}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

export function HubHero({ eyebrow, title, summary }) {
  return (
    <section className="hub-container hub-hero">
      <style href="hub" precedence="default">
        {styles}
      </style>
      {eyebrow && <p className="hub-hero__eyebrow">{eyebrow}</p>}
      <h1 className="hub-display hub-hero__title">{title}</h1>
      {summary && <p className="hub-hero__summary">{summary}</p>}
    </section>
  );
}

export function HubSection({ heading, children }) {
  return (
    <section className="hub-container hub-section">
      <style href="hub" precedence="default">
        {styles}
      </style>
      <h2 className="hub-section__heading">{heading}</h2>
      <div className="hub-section__body">{children}</div>
    </section>
  );
}

export function Prose({ text }) {
  return (
    <p className="hub-prose">
      <style href="hub" precedence="default">
        {styles}
      </style>
      {text}
    </p>
  );
}

/** Pill links to related entities. */
export function RefChips({ items, routePrefix }) {
  if (!items.length) return null;
  return (
    <div className="hub-chips">
      <style href="hub" precedence="default">
        {styles}
      </style>
      {items.map((r) => (
        <Link key={r.slug} href={`${routePrefix}/${r.slug}`} className="hub-chip">
          {r.name}
        </Link>
      ))}
    </div>
  );
}

/** Case-study cards → /work/[slug]. Never duplicates project copy. */
export function ProjectCardGrid({ projects }) {
  if (!projects.length) return null;
  return (
    <div className="hub-cards">
      <style href="hub" precedence="default">
        {styles}
      </style>
      {projects.map((p, i) => (
        <Link key={p.slug} href={`/work/${p.slug}`} className="hub-card">
          <div className="hub-card__media">
            <div className="hub-card__zoom">
              <Media src={p.heroImage} label={p.title} index={i} showSlotLabel={false} />
            </div>
          </div>
          {p.brand && <p className="hub-card__brand">{p.brand}</p>}
          <h3 className="hub-card__title">{p.title}</h3>
        </Link>
      ))}
    </div>
  );
}

const styles = `
.hub-shell__main {
  padding-top: 6rem;
}

.hub-draft {
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

.hub-trail {
  padding-top: 1.5rem;
}

.hub-trail__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.hub-trail__sep {
  color: #eceeeb;
}

.hub-trail__link {
  display: inline-block;
  margin-block: -0.5rem;
  padding-block: 0.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hub-trail__link:hover {
  color: #32c1df;
}

.hub-trail__current {
  color: #0c0d0c;
}

.hub-hero {
  padding-block: 2rem;
}

.hub-hero__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.hub-hero__title {
  margin-top: 0.75rem;
  font-size: clamp(2.4rem, 6vw, 5rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.hub-hero__summary {
  margin-top: 1rem;
  max-width: 60ch;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

.hub-section {
  border-top: 1px solid #eceeeb;
  padding-block: 2.5rem;
}

.hub-section__heading {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #137c93;
}

.hub-section__body {
  margin-top: 1.25rem;
}

.hub-prose {
  max-width: 68ch;
  font-size: 1rem;
  line-height: 1.625;
  color: rgba(12, 13, 12, 0.8);
}

.hub-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hub-chip {
  border: 1px solid #eceeeb;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #0c0d0c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hub-chip:hover {
  border-color: #32c1df;
  color: #32c1df;
}

.hub-cards {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.hub-card {
  display: block;
}

.hub-card__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
}

.hub-card__zoom {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.hub-card:hover .hub-card__zoom {
  transform: scale(1.05);
}

.hub-card__brand {
  margin-top: 0.75rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #137c93;
}

.hub-card__title {
  margin-top: 0.25rem;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #0c0d0c;
}

.hub-card:hover .hub-card__title {
  color: #32c1df;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.hub-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .hub-container {
    padding-inline: 20px;
  }
}

.hub-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .hub-shell__main {
    padding-top: 7rem;
  }

  .hub-hero {
    padding-block: 3rem;
  }

  .hub-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .hub-cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
