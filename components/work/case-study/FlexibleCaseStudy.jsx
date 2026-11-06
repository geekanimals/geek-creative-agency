import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { resolveMedia } from "@/lib/cms/media";
import { resolveBlockVideo } from "@/lib/cms/video";
import Media, { optimizedProps } from "@/components/ui/Media";
import VideoPlayer from "@/components/ui/VideoPlayer";
import RelatedAndNext from "@/components/work/case-study/RelatedAndNext";
import { workFilterHref } from "@/lib/work/routes";

/* Resolve a block's media (CMS upload or legacy path) to a src/alt. */
function blockMedia(b) {
  return resolveMedia(b.media, b.legacySrc, b.alt);
}

function Figure({ m, className = "", ratio = "16/9" }) {
  if (!m) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <div className={`flex-cs__figure ${className}`} style={{ aspectRatio: ratio }}>
      <img
        {...optimizedProps(m.src)}
        alt={m.alt}
        className="flex-cs__img"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Semantic tone resolution for Lay's Heartwork editorial blocks.
 * Determines tone from block content/identity rather than array index.
 * Dark sections: Chapter 01, 03, 05, Metrics, Chapter 07 (and retailer artwork if present), Chapter 09.
 * All other Heartwork sections default to light.
 */
function getHeartworkBlockTone(block) {
  if (block.blockType === "sectionIntro") {
    const eyebrow = block.eyebrow ?? "";
    if (
      eyebrow.includes("CHAPTER 01") ||
      eyebrow.includes("CHAPTER 03") ||
      eyebrow.includes("CHAPTER 05") ||
      eyebrow.includes("CHAPTER 07") ||
      eyebrow.includes("CHAPTER 09")
    ) {
      return "dark";
    }
    return "light";
  }

  if (block.blockType === "metrics") {
    return "dark";
  }

  if (block.blockType === "mediaBlock") {
    const src = block.legacySrc ?? "";
    if (src.includes("retailers")) {
      return "dark";
    }
    return "light";
  }

  return "light";
}

/**
 * FLEXIBLE renderer — composes a project from CMS `sections` blocks. Content
 * semantics come from the CMS; all styling lives here (React owns presentation).
 * Uses the site's existing design tokens so it reads as part of the Geek site.
 */
export default function FlexibleCaseStudy({ project, pool, evidence = null }) {
  const sections = project.sections ?? [];
  const hero = resolveMedia(undefined, project.heroImage);
  const isHeartwork = project.slug === "lays-heartwork";

  return (
    <article>
      <style href="flex-cs" precedence="default">
        {styles}
      </style>
      {/* HERO */}
      <header className="flex-cs-container flex-cs__hero">
        <div className="flex-cs__intro">
          <Link href={workFilterHref("brand", project.brandSlug)} className="flex-cs__brand">
            {project.brand}
            {project.year ? <span className="flex-cs__year"> · {project.year}</span> : null}
          </Link>
          <h1 className="flex-cs-display flex-cs__title">{project.headline}</h1>
          {project.oneLineSummary && <p className="flex-cs__summary">{project.oneLineSummary}</p>}
        </div>
        {hero && (project.heroVideo || project.heroYoutube) ? (
          <div className="flex-cs__hero-media" style={{ aspectRatio: "16/9" }}>
            <Media
              src={hero.src}
              label={hero.alt || project.project}
              showSlotLabel={false}
              video={project.heroVideo}
              videoMobile={project.heroVideoMobile}
              youtube={project.heroYoutube}
              priority
            />
          </div>
        ) : (
          hero && (
            <div className="flex-cs__hero-media" style={{ aspectRatio: "16/9" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...optimizedProps(hero.src, "100vw", true)}
                alt={hero.alt || project.project}
                className="flex-cs__img"
                fetchPriority="high"
              />
            </div>
          )
        )}
      </header>

      {/* SECTIONS */}
      <div className="flex-cs__sections">
        {sections.map((block, i) => {
          const key = `${block.blockType}-${i}`;
          const isDark = isHeartwork && getHeartworkBlockTone(block) === "dark";

          switch (block.blockType) {
            case "sectionIntro":
              return (
                <section
                  key={key}
                  className={isDark ? "flex-cs-tone--dark" : "flex-cs-tone--light"}
                >
                  <div className="flex-cs-container flex-cs__pad flex-cs__pad--intro">
                    {block.eyebrow && (
                      <p
                        className={`flex-cs__eyebrow flex-cs__eyebrow--intro ${isDark ? "flex-cs__eyebrow--dark" : ""}`}
                      >
                        {block.eyebrow}
                      </p>
                    )}
                    <h2
                      className={`flex-cs-display flex-cs__intro-heading ${isDark ? "flex-cs__intro-heading--dark" : ""}`}
                    >
                      {block.heading}
                    </h2>
                    {block.body && (
                      <p
                        className={`flex-cs__intro-body ${isDark ? "flex-cs__intro-body--dark" : ""}`}
                      >
                        {block.body}
                      </p>
                    )}
                  </div>
                </section>
              );
            case "richText":
              return (
                <section
                  key={key}
                  className={isDark ? "flex-cs-tone--dark" : "flex-cs-tone--white"}
                >
                  <div
                    className={`flex-cs__rich ${isDark ? "flex-cs__copy--dark" : "flex-cs__copy--light"}`}
                  >
                    <RichText data={block.content} />
                  </div>
                </section>
              );
            case "mediaBlock":
              return (
                <section key={key} className={isDark ? "flex-cs-tone--ink" : "flex-cs-tone--white"}>
                  <div className="flex-cs-container flex-cs__pad flex-cs__pad--media">
                    <Figure m={blockMedia(block)} />
                    {(block.caption || block.credit) && (
                      <p className={`flex-cs__caption ${isDark ? "flex-cs__caption--dark" : ""}`}>
                        {[block.caption, block.credit].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </section>
              );
            case "videoBlock": {
              const v = resolveBlockVideo(block.video);
              if (!v) return null;
              return (
                <section key={key} className={isDark ? "flex-cs-tone--ink" : "flex-cs-tone--white"}>
                  <div className="flex-cs-container flex-cs__pad flex-cs__pad--media">
                    <VideoPlayer video={v} title={block.caption || project.project} />
                    {(block.caption || block.credit) && (
                      <p className={`flex-cs__caption ${isDark ? "flex-cs__caption--dark" : ""}`}>
                        {[block.caption, block.credit].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </section>
              );
            }
            case "fullBleedMedia": {
              const m = blockMedia(block);
              return (
                <section key={key} className="flex-cs-tone--ink flex-cs__bleed">
                  {m && (
                    <div className="flex-cs__bleed-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        {...optimizedProps(m.src)}
                        alt={m.alt}
                        className="flex-cs__img"
                        loading="lazy"
                        decoding="async"
                      />
                      {block.overlayHeading && (
                        <div className="flex-cs__bleed-overlay">
                          <div className="flex-cs-container">
                            <h2 className="flex-cs-display flex-cs__bleed-heading">
                              {block.overlayHeading}
                            </h2>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            }
            case "splitContent": {
              const m = blockMedia(block);
              const mediaRight = block.mediaSide === "right";
              return (
                <section
                  key={key}
                  className={isDark ? "flex-cs-tone--dark" : "flex-cs-tone--white"}
                >
                  <div className="flex-cs-container flex-cs__split">
                    <div className={mediaRight ? "flex-cs__split-media--right" : ""}>
                      <Figure m={m} ratio="4/5" />
                    </div>
                    <div
                      className={`flex-cs__split-copy ${isDark ? "flex-cs__copy--dark" : "flex-cs__copy--light"}`}
                    >
                      <RichText data={block.content} />
                    </div>
                  </div>
                </section>
              );
            }
            case "mediaGallery":
              return (
                <section
                  key={key}
                  className={isDark ? "flex-cs-tone--dark" : "flex-cs-tone--white"}
                >
                  <div className="flex-cs-container flex-cs__pad">
                    {block.heading && (
                      <p
                        className={`flex-cs__eyebrow flex-cs__eyebrow--gallery ${isDark ? "flex-cs__eyebrow--dark" : ""}`}
                      >
                        {block.heading}
                      </p>
                    )}
                    <div className="flex-cs__gallery">
                      {(block.items ?? []).map((it, j) => (
                        <Figure key={j} m={blockMedia(it)} ratio="1/1" />
                      ))}
                    </div>
                  </div>
                </section>
              );
            case "metrics":
              return (
                <section
                  key={key}
                  className={isDark ? "flex-cs-tone--dark" : "flex-cs-tone--paper"}
                >
                  <div className="flex-cs-container flex-cs__pad flex-cs__pad--metrics">
                    {block.heading && (
                      <p
                        className={`flex-cs__eyebrow flex-cs__eyebrow--metrics ${isDark ? "flex-cs__eyebrow--dark" : ""}`}
                      >
                        {block.heading}
                      </p>
                    )}
                    <div className="flex-cs__metrics">
                      {(block.items ?? []).map((s, j) => (
                        <div key={j}>
                          <div className="flex-cs-display flex-cs__metric-value">
                            {s.prefix}
                            {s.value}
                            {s.suffix}
                          </div>
                          <p
                            className={`flex-cs__metric-label ${isDark ? "flex-cs__metric-label--dark" : ""}`}
                          >
                            {s.label}
                          </p>
                          {s.note && (
                            <p
                              className={`flex-cs__metric-note ${isDark ? "flex-cs__metric-note--dark" : ""}`}
                            >
                              {s.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            case "quote":
              return (
                <section key={key} className="flex-cs-tone--dark">
                  <div className="flex-cs-container flex-cs__pad flex-cs__pad--center">
                    <p className="flex-cs-display flex-cs__quote">“{block.quote}”</p>
                    {block.attribution && (
                      <p className="flex-cs__attribution">{block.attribution}</p>
                    )}
                  </div>
                </section>
              );
            case "cta":
              return (
                <section
                  key={key}
                  className={isDark ? "flex-cs-tone--dark" : "flex-cs-tone--light"}
                >
                  <div className="flex-cs-container flex-cs__pad flex-cs__pad--center">
                    <h2
                      className={`flex-cs-display flex-cs__cta-heading ${isDark ? "flex-cs__cta-heading--dark" : ""}`}
                    >
                      {block.heading}
                    </h2>
                    {block.body && (
                      <p className={`flex-cs__cta-body ${isDark ? "flex-cs__cta-body--dark" : ""}`}>
                        {block.body}
                      </p>
                    )}
                    {block.buttonHref && block.buttonLabel && (
                      <Link href={block.buttonHref} className="flex-cs__cta-button">
                        {block.buttonLabel}
                      </Link>
                    )}
                  </div>
                </section>
              );
            default:
              return null;
          }
        })}
      </div>

      {evidence}
      <RelatedAndNext project={project} pool={pool} />
    </article>
  );
}

const styles = `
/* ---------- Hero ---------- */
.flex-cs__hero {
  padding-top: 6rem;
}

.flex-cs__intro {
  padding-block: 2rem;
}

.flex-cs__brand {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #137c93;
}

.flex-cs__brand:hover {
  color: #32c1df;
}

.flex-cs__year {
  color: #5a5f5c;
}

.flex-cs__title {
  margin-top: 0.75rem;
  font-size: clamp(2.4rem, 6vw, 5rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.flex-cs__summary {
  margin-top: 1rem;
  max-width: 46ch;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

.flex-cs__hero-media {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: #0c0d0c;
}

.flex-cs__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flex-cs__figure {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #eceeeb;
}

/* ---------- Sections ---------- */
.flex-cs__sections {
  border-top: 1px solid #eceeeb;
}

.flex-cs__sections > section {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.flex-cs-tone--dark {
  background-color: #0c0d0c;
  color: #ffffff;
}

.flex-cs-tone--light {
  background-color: #ffffff;
  color: #0c0d0c;
}

.flex-cs-tone--white {
  background-color: #ffffff;
}

.flex-cs-tone--paper {
  background-color: #f5f6f4;
}

.flex-cs-tone--ink {
  background-color: #0c0d0c;
}

.flex-cs__pad {
  padding-block: 4rem;
}

.flex-cs__pad--media {
  padding-block: 3rem;
}

.flex-cs__pad--center {
  padding-block: 5rem;
  text-align: center;
}

.flex-cs__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.flex-cs__eyebrow--dark {
  color: #63d0ea;
}

.flex-cs__eyebrow--intro {
  margin-bottom: 1rem;
}

.flex-cs__eyebrow--gallery {
  margin-bottom: 1.5rem;
}

.flex-cs__eyebrow--metrics {
  margin-bottom: 2rem;
}

/* sectionIntro */
.flex-cs__intro-heading {
  max-width: 20ch;
  font-size: clamp(2rem, 5vw, 4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.flex-cs__intro-heading--dark {
  color: #ffffff;
}

.flex-cs__intro-body {
  margin-top: 1.25rem;
  max-width: 60ch;
  font-size: 1.125rem;
  line-height: 1.625;
  color: #5a5f5c;
}

.flex-cs__intro-body--dark {
  color: rgba(255, 255, 255, 0.8);
}

/* richText + splitContent copy */
.flex-cs__rich {
  margin-inline: auto;
  max-width: 70ch;
  padding: 3.5rem 1.25rem;
}

.flex-cs__rich,
.flex-cs__split-copy {
  font-size: 1.125rem;
  line-height: 1.625;
}

.flex-cs__copy--light {
  color: rgba(12, 13, 12, 0.8);
}

.flex-cs__copy--dark {
  color: rgba(255, 255, 255, 0.8);
}

/* Rich-text typography: headings, lists and spacing inside richText / splitContent */
.flex-cs__rich > * + *,
.flex-cs__split-copy > * + * {
  margin-top: 1rem;
}

.flex-cs__rich h2,
.flex-cs__rich h3,
.flex-cs__split-copy h2,
.flex-cs__split-copy h3 {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  text-transform: uppercase;
  color: #0c0d0c;
}

.flex-cs__rich h2,
.flex-cs__split-copy h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
}

.flex-cs__rich h3,
.flex-cs__split-copy h3 {
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
}

.flex-cs__rich * + h2,
.flex-cs__rich * + h3,
.flex-cs__split-copy * + h2,
.flex-cs__split-copy * + h3 {
  margin-top: 2rem;
}

.flex-cs__copy--dark h2,
.flex-cs__copy--dark h3 {
  color: #ffffff;
}

.flex-cs__rich ul,
.flex-cs__rich ol,
.flex-cs__split-copy ul,
.flex-cs__split-copy ol {
  padding-left: 1.4em;
}

.flex-cs__rich ul,
.flex-cs__split-copy ul {
  list-style: disc;
}

.flex-cs__rich ol,
.flex-cs__split-copy ol {
  list-style: decimal;
}

.flex-cs__rich li + li,
.flex-cs__split-copy li + li {
  margin-top: 0.5rem;
}

.flex-cs__rich li::marker,
.flex-cs__split-copy li::marker {
  color: #32c1df;
  font-weight: 700;
}

.flex-cs__rich em,
.flex-cs__split-copy em {
  font-style: italic;
}

/* mediaBlock */
.flex-cs__caption {
  margin-top: 0.75rem;
  font-size: 11px;
  color: #5a5f5c;
}

.flex-cs__caption--dark {
  color: rgba(255, 255, 255, 0.6);
}

/* fullBleedMedia */
.flex-cs__bleed {
  position: relative;
}

.flex-cs__bleed-frame {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 420px;
  overflow: hidden;
}

.flex-cs__bleed-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  background-color: rgba(12, 13, 12, 0.3);
}

.flex-cs__bleed-heading {
  max-width: 16ch;
  font-size: clamp(2rem, 6vw, 5rem);
  text-transform: uppercase;
  color: #ffffff;
}

/* splitContent */
.flex-cs__split {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: center;
  gap: 2rem;
  padding-block: 4rem;
}

/* mediaGallery */
.flex-cs__gallery {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

/* metrics */
.flex-cs__metrics {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 2rem;
  row-gap: 2.5rem;
}

/* line-height stays from .flex-cs-display (it overrode leading-none in the original cascade) */
.flex-cs__metric-value {
  font-size: clamp(2.6rem, 7vw, 5.5rem);
  color: #32c1df;
}

.flex-cs__metric-label {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.flex-cs__metric-label--dark {
  color: rgba(255, 255, 255, 0.9);
}

.flex-cs__metric-note {
  margin-top: 0.25rem;
  font-size: 11px;
  color: rgba(90, 95, 92, 0.7);
}

.flex-cs__metric-note--dark {
  color: rgba(255, 255, 255, 0.6);
}

/* quote */
.flex-cs__quote {
  margin-inline: auto;
  max-width: 24ch;
  font-size: clamp(1.6rem, 4vw, 3rem);
  text-transform: uppercase;
}

.flex-cs__attribution {
  margin-top: 1.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #63d0ea;
}

/* cta */
.flex-cs__cta-heading {
  margin-inline: auto;
  max-width: 20ch;
  font-size: clamp(1.8rem, 5vw, 3.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.flex-cs__cta-heading--dark {
  color: #ffffff;
}

.flex-cs__cta-body {
  margin-inline: auto;
  margin-top: 1.25rem;
  max-width: 52ch;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

.flex-cs__cta-body--dark {
  color: rgba(255, 255, 255, 0.8);
}

.flex-cs__cta-button {
  margin-top: 2rem;
  display: inline-block;
  border-radius: 9999px;
  background-color: #32c1df;
  padding: 0.75rem 1.75rem;
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

.flex-cs__cta-button:hover {
  background-color: #137c93;
  color: #ffffff;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.flex-cs-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .flex-cs-container {
    padding-inline: 20px;
  }
}

.flex-cs-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .flex-cs__hero {
    padding-top: 7rem;
  }

  .flex-cs__summary {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .flex-cs__rich {
    padding-inline: 2rem;
  }

  .flex-cs__pad--intro {
    padding-block: 6rem;
  }

  .flex-cs__pad--metrics {
    padding-block: 5rem;
  }

  .flex-cs__gallery,
  .flex-cs__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .flex-cs__split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .flex-cs__split-media--right {
    order: 2;
  }
}

@media (min-width: 1024px) {
  .flex-cs__gallery,
  .flex-cs__metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
