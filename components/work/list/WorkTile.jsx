import Link from "next/link";
import Media from "@/components/ui/Media";
import { categoryMap } from "@/lib/work/taxonomy";
import { canOpenCaseStudy } from "@/lib/work/projects";
import { trackAttr } from "@/lib/analytics";

/** A single work tile. Published → links to the story; draft → non-clickable placeholder. */
/**
 * `basePath` is the page the grid sits on: "/work" → /work/<slug>, or a filter
 * page like "/work/lays" → /work/lays/<slug>.
 */
export default function WorkTile({ project, index = 0, basePath = "/work" }) {
  const category = project.businessCategory[0] ? categoryMap[project.businessCategory[0]] : "";
  const open = canOpenCaseStudy(project);

  const visual = (
    <div className="tile__visual">
      <div className="tile__media">
        <Media
          src={project.heroImage}
          need={project.heroImageNeed}
          label={project.brand}
          index={index}
          showSlotLabel={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
        />
      </div>
      <div className={`tile__overlay ${project.heroImage ? "tile__overlay--hover" : ""}`}>
        {category && <span className="tile__category">{category}</span>}
        <span className="tile__brand">{project.brand}</span>
        <span className="tile__project">{project.project}</span>
        <span className="tile__cta">{open ? "View Story →" : "Case study coming soon"}</span>
      </div>
    </div>
  );

  if (!open) {
    return (
      <div
        className="tile tile--static"
        aria-label={`${project.brand} — ${project.project} (case study coming soon)`}
      >
        <style href="tile" precedence="default">
          {styles}
        </style>
        {visual}
      </div>
    );
  }

  return (
    <Link
      href={`${basePath}/${project.slug}`}
      className="tile tile--link"
      {...trackAttr("case_study_view", {
        slug: project.slug,
        from: "work_grid",
      })}
    >
      <style href="tile" precedence="default">
        {styles}
      </style>
      {visual}
    </Link>
  );
}

const styles = `
.tile {
  display: block;
}

.tile--static {
  cursor: default;
}

.tile--link:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: #32c1df;
}

.tile__visual {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
}

.tile__media {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 800ms;
}

.tile:hover .tile__media {
  transform: scale(1.05);
}

.tile__overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-image: linear-gradient(to top, rgba(12, 13, 12, 0.85), rgba(12, 13, 12, 0.1), transparent);
  padding: 1.25rem;
  opacity: 1;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.tile__overlay--hover {
  opacity: 0;
}

.tile:hover .tile__overlay--hover {
  opacity: 1;
}

.tile__category {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #63d0ea;
}

.tile__brand {
  margin-top: 0.25rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}

.tile__project {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  color: #ffffff;
}

.tile__cta {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffffff;
}
`;
