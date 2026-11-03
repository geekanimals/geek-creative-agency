import Link from "next/link";
import Media from "@/components/ui/Media";
import { categoryMap, campaignMap } from "@/lib/work/taxonomy";
import { relatedProjects, nextProjectFor } from "@/lib/work/filters";
import { trackAttr } from "@/lib/analytics";

/* ── related tile (visible tags, no explanatory text) ──────────────────── */
function RelatedTile({ project, index }) {
  const cat = project.businessCategory[0] ? categoryMap[project.businessCategory[0]] : "";
  const camp = project.campaignTypes[0] ? campaignMap[project.campaignTypes[0]] : "";
  return (
    <Link
      href={`/work/${project.slug}`}
      className="rel-tile"
      {...trackAttr("case_study_view", {
        slug: project.slug,
        from: "more_like_this",
      })}
    >
      <div className="rel-tile__visual">
        <div className="rel-tile__media">
          <Media
            src={project.heroImage}
            need={project.heroImageNeed}
            label={project.brand}
            index={index}
            showSlotLabel={false}
          />
        </div>
      </div>
      <p className="rel-tile__brand">{project.brand}</p>
      <p className="rel-tile__project">{project.project}</p>
      <p className="rel-tile__tags">{[cat, camp].filter(Boolean).join(" · ")}</p>
    </Link>
  );
}

/**
 * Shared "More Like This" + "Next Project" footer for every case study.
 * Uses the central related/next logic (a project never recommends itself,
 * and the Next module is hidden when no other published project exists).
 */
export default function RelatedAndNext({ project, pool }) {
  const related = relatedProjects(project, 3, pool);
  const next = nextProjectFor(project, pool);
  return (
    <>
      <style href="rel" precedence="default">
        {styles}
      </style>
      {related.length > 0 && (
        <section className="rel">
          <div className="rel-container rel__inner">
            <p className="rel__eyebrow">More Like This</p>
            <div className="rel__grid">
              {related.map((p, i) => (
                <RelatedTile key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {next && (
        <section className="rel-next">
          <Link
            href={`/work/${next.slug}`}
            className="rel-next__link"
            {...trackAttr("case_study_next_click", {
              from: project.slug,
              to: next.slug,
            })}
          >
            <div className="rel-next__frame">
              <div className="rel-next__media">
                <Media
                  src={next.heroImage}
                  need={next.heroImageNeed}
                  label={next.brand}
                  showSlotLabel={false}
                />
              </div>
              <div className="rel-next__overlay">
                <p className="rel-next__eyebrow">Next Project</p>
                <p className="rel-display rel-next__headline">{next.headline}</p>
                <span className="rel-next__cta">View Story →</span>
              </div>
            </div>
          </Link>
        </section>
      )}
    </>
  );
}

const styles = `
.rel {
  border-top: 1px solid #eceeeb;
  background-color: #ffffff;
}

.rel__inner {
  padding-block: 4rem;
}

.rel__eyebrow {
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.rel__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.rel-tile {
  display: block;
}

.rel-tile__visual {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
}

.rel-tile__media {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.rel-tile:hover .rel-tile__media {
  transform: scale(1.05);
}

.rel-tile__brand {
  margin-top: 0.75rem;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  color: #0c0d0c;
}

.rel-tile__project {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.rel-tile__tags {
  margin-top: 0.5rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #137c93;
}

.rel-next {
  border-top: 1px solid #eceeeb;
}

.rel-next__link {
  display: block;
}

.rel-next__frame {
  position: relative;
  width: 100%;
  height: 46vh;
  min-height: 320px;
  overflow: hidden;
  background-color: #0c0d0c;
}

.rel-next__media {
  width: 100%;
  height: 100%;
  opacity: 0.7;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 900ms;
}

.rel-next__link:hover .rel-next__media {
  transform: scale(1.05);
  opacity: 0.9;
}

.rel-next__overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(12, 13, 12, 0.3);
  text-align: center;
  color: #ffffff;
}

.rel-next__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #63d0ea;
}

.rel-next__headline {
  margin-top: 0.75rem;
  font-size: clamp(1.8rem, 5vw, 4rem);
  text-transform: uppercase;
}

.rel-next__cta {
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.rel-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .rel-container {
    padding-inline: 20px;
  }
}

.rel-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .rel__inner {
    padding-block: 5rem;
  }

  .rel__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
