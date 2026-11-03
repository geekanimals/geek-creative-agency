import Link from "next/link";
import Media from "@/components/ui/Media";
import { categoryMap } from "@/lib/work/taxonomy";
import { canOpenCaseStudy, featuredStories } from "@/lib/work/projects";
import { trackAttr } from "@/lib/analytics";

function Story({ project, index, className = "" }) {
  const cat = project.businessCategory[0] ? categoryMap[project.businessCategory[0]] : "";
  const open = canOpenCaseStudy(project);
  const inner = (
    <>
      <div className="feat__media">
        <Media
          src={project.heroImage}
          need={project.heroImageNeed}
          label={project.brand}
          index={index}
          showSlotLabel={false}
          // First story is the LCP image on /work: load it first, at the right size.
          priority={index === 0}
          sizes="(max-width: 1024px) 85vw, 800px"
        />
      </div>
      <div className="feat__shade" />
      <div className="feat__body">
        <span className="feat__index">{String(index + 1).padStart(2, "0")}</span>
        <div>
          {cat && <span className="feat__cat">{cat}</span>}
          <p className="feat__brand">{project.brand}</p>
          <h3 className="feat-display feat__title">{project.project}</h3>
          <span className="feat__cta">{open ? "View Story →" : "Case study coming soon"}</span>
        </div>
      </div>
    </>
  );
  const cls = `feat__story ${className}`;
  if (!open) return <div className={`${cls} feat__story--static`}>{inner}</div>;
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`${cls} feat__story--link`}
      {...trackAttr("case_study_view", {
        slug: project.slug,
        from: "featured",
      })}
    >
      {inner}
    </Link>
  );
}

/** Featured Stories — an editorial composition, deliberately not a card grid.
 *  `stories` defaults to the static featured set; the server can pass a
 *  CMS-merged list. */
export default function FeaturedStories({ stories = featuredStories() }) {
  if (stories.length < 3) return null;

  return (
    <section className="feat-container feat">
      <style href="feat" precedence="default">
        {styles}
      </style>
      <p className="feat__eyebrow">Featured Stories</p>

      {/* desktop: asymmetric editorial composition */}
      <div className="feat__desktop">
        <Story project={stories[0]} index={0} className="feat__story--wide feat__story--tall" />
        <Story project={stories[1]} index={1} className="feat__story--narrow feat__story--tall" />
        {stories[2] && (
          <Story
            project={stories[2]}
            index={2}
            className="feat__story--narrow feat__story--short"
          />
        )}
        {stories[3] && (
          <Story project={stories[3]} index={3} className="feat__story--wide feat__story--short" />
        )}
      </div>

      {/* mobile: horizontal editorial swipe */}
      <div className="feat-no-scrollbar feat__swipe">
        {stories.map((p, i) => (
          <Story key={p.slug} project={p} index={i} className="feat__story--swipe" />
        ))}
      </div>
    </section>
  );
}

const styles = `
.feat {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}

.feat__eyebrow {
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #32c1df;
}

.feat__desktop {
  display: none;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

.feat__swipe {
  margin-right: -1.25rem;
  display: flex;
  scroll-snap-type: x mandatory;
  gap: 1rem;
  overflow-x: auto;
  padding-right: 1.25rem;
}

.feat__story {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: #0c0d0c;
}

.feat__story--static {
  cursor: default;
}

.feat__story--link:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: #32c1df;
}

.feat__story--wide {
  grid-column: span 7 / span 7;
}

.feat__story--narrow {
  grid-column: span 5 / span 5;
}

.feat__story--tall {
  min-height: 380px;
}

.feat__story--short {
  min-height: 300px;
}

.feat__story--swipe {
  aspect-ratio: 4/5;
  width: 82vw;
  flex-shrink: 0;
  scroll-snap-align: start;
}

.feat__media {
  position: absolute;
  inset: 0px;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 900ms;
}

.feat__story:hover .feat__media {
  transform: scale(1.04);
}

.feat__shade {
  position: absolute;
  inset: 0px;
  background-image: linear-gradient(to top, #0c0d0c, rgba(12, 13, 12, 0.25), transparent);
}

.feat__body {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
}

.feat__index {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
}

.feat__cat {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #63d0ea;
}

.feat__brand {
  margin-top: 0.25rem;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.75);
}

.feat__title {
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #ffffff;
}

.feat__cta {
  margin-top: 0.75rem;
  display: inline-block;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.8);
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.feat__story:hover .feat__cta {
  color: #ffffff;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.feat-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .feat-container {
    padding-inline: 20px;
  }
}

.feat-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

.feat-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.feat-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .feat__body {
    padding: 1.75rem;
  }

  .feat__title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}

@media (min-width: 768px) {
  .feat__desktop {
    display: grid;
  }

  .feat__swipe {
    display: none;
  }
}
`;
