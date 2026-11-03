import Link from "next/link";
import Media from "@/components/ui/Media";
import { categoryMap, serviceMap, campaignMap } from "@/lib/work/taxonomy";
import { relatedProjects, nextProjectFor } from "@/lib/work/filters";
import { trackAttr } from "@/lib/analytics";
import { workFilterHref } from "@/lib/work/routes";

/* ── tone system (Geek palette + authentic Miller heritage palette) ─────── */

const TONE = {
  light: "cs-tone--light",
  paper: "cs-tone--paper",
  dark: "cs-tone--dark",
  navy: "cs-tone--navy",
  miller: "cs-tone--miller", // cream on near-black (bg set inline)
};
const MILLER_BG = "#0a0806";
const MILLER_GOLD = "#C8A24B";
const isDarkTone = (t) => t === "dark" || t === "navy" || t === "miller";
function accentColor(tone) {
  if (tone === "miller") return MILLER_GOLD;
  return "#32C1DF"; // geek cyan
}

/** Renders text with \n line-breaks and an optional accent phrase highlighted. */
function Lines({ text, accent, tone }) {
  const color = accentColor(tone);
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="cs-line">
          {accent && line.includes(accent)
            ? line.split(accent).map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && <span style={{ color }}>{accent}</span>}
                </span>
              ))
            : line}
        </span>
      ))}
    </>
  );
}

/** Full-bleed section wrapper with tone background. */
function Bleed({ tone = "light", children, className = "" }) {
  const style = tone === "miller" ? { backgroundColor: MILLER_BG } : undefined;
  return (
    <section className={`${TONE[tone]} ${className}`} style={style}>
      <div className="cs-container cs-bleed">{children}</div>
    </section>
  );
}

/* ── small helpers ─────────────────────────────────────────────────────── */

function Frame({ media, index = 0, ratio, label, caption }) {
  // Archival media never crops text/UI: contain by default; opt out with contain:false (e.g. film).
  const contain = media.contain !== false && !media.video;
  return (
    <figure>
      <div
        className={`cs-frame ${contain ? "cs-frame--contain" : "cs-frame--cover"}`}
        style={{ aspectRatio: ratio || media.ratio || "16/9" }}
      >
        <Media
          src={media.src}
          need={media.need}
          label={media.alt}
          index={index}
          showSlotLabel
          video={media.video}
          videoMobile={media.videoMobile}
          contain={contain}
        />
      </div>
      {(label || caption) && (
        <figcaption className="cs-frame__caption">
          {label && <span className="cs-frame__label">{label}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

function MetaLink({ href, children }) {
  return (
    <Link href={href} className="cs-meta-link">
      {children}
    </Link>
  );
}

function SectionLabel({ children }) {
  return <p className="cs-label">{children}</p>;
}

/** Draft copy is shown ONLY in development, never in production. */
const DEV = process.env.NODE_ENV !== "production";

function DraftNote({ children, dark = false }) {
  return (
    <div className={`cs-draft ${dark ? "cs-draft--dark" : "cs-draft--light"}`}>
      <span className="cs-draft__tag">Draft — not final · dev only</span>
      {children}
    </div>
  );
}

/* ── editorial + media block renderer (self-contained, full-bleed) ──────── */

const SIZE = {
  big: "cs-size--big",
  giant: "cs-size--giant",
  mega: "cs-size--mega",
};

function Block({ block }) {
  switch (block.type) {
    case "statement":
      return (
        <Bleed tone={block.tone}>
          <h2 className={`cs-display cs-statement ${SIZE[block.size ?? "giant"]}`}>
            <Lines text={block.text} accent={block.accent} tone={block.tone} />
          </h2>
          {block.sub && (
            <p
              className={`cs-statement__sub ${isDarkTone(block.tone) ? "cs-statement__sub--dark" : ""}`}
            >
              {block.sub}
            </p>
          )}
        </Bleed>
      );

    case "vs":
      return (
        <Bleed tone={block.tone ?? "navy"}>
          <div className="cs-vs">
            <div className="cs-vs__side cs-vs__side--left">
              <p className="cs-display cs-vs__big">{block.left.big}</p>
              {block.left.small && <p className="cs-vs__small">{block.left.small}</p>}
            </div>
            <div className="cs-vs__mid">vs</div>
            <div className="cs-vs__side cs-vs__side--right">
              <p className="cs-display cs-vs__big">{block.right.big}</p>
              {block.right.small && <p className="cs-vs__small">{block.right.small}</p>}
            </div>
          </div>
          {block.note && <p className="cs-note">{block.note}</p>}
        </Bleed>
      );

    case "stat-band":
      return (
        <Bleed tone={block.tone ?? "light"}>
          {block.heading && <SectionLabel>{block.heading}</SectionLabel>}
          <div className="cs-stats">
            {block.stats.map((s) => (
              <div key={s.label}>
                <div
                  className={`cs-display cs-stat__value ${block.tone === "miller" ? "" : "cs-stat__value--cyan"}`}
                  style={block.tone === "miller" ? { color: MILLER_GOLD } : undefined}
                >
                  {s.value}
                </div>
                <div className="cs-rule" style={{ backgroundColor: accentColor(block.tone) }} />
                <p
                  className={`cs-stat__label ${isDarkTone(block.tone) ? "cs-stat__label--dark" : ""}`}
                >
                  {s.label}
                </p>
                {s.note && (
                  <p
                    className={`cs-stat__note ${isDarkTone(block.tone) ? "cs-stat__note--dark" : ""}`}
                  >
                    {s.note}
                  </p>
                )}
              </div>
            ))}
          </div>
          {block.note && (
            <p className={`cs-stats__note ${isDarkTone(block.tone) ? "cs-stats__note--dark" : ""}`}>
              {block.note}
            </p>
          )}
        </Bleed>
      );

    case "steps":
      return (
        <Bleed tone={block.tone ?? "paper"}>
          {block.heading && <SectionLabel>{block.heading}</SectionLabel>}
          <div className="cs-steps">
            {block.items.map((it, i) => (
              <span
                key={i}
                className={`cs-display cs-steps__item ${isDarkTone(block.tone) ? "cs-steps__item--dark" : ""}`}
              >
                {it}
                {i < block.items.length - 1 && <span className="cs-steps__sep">·</span>}
              </span>
            ))}
          </div>
        </Bleed>
      );

    case "funnel":
      return (
        <Bleed tone={block.tone ?? "dark"}>
          <div className="cs-funnel">
            {block.items.map((it, i) => (
              <div key={i} className="cs-funnel__item">
                <span className="cs-display cs-funnel__text">{it}</span>
                {i < block.items.length - 1 && (
                  <span className="cs-funnel__arrow" aria-hidden>
                    ↓
                  </span>
                )}
              </div>
            ))}
          </div>
          {block.note && <p className="cs-note">{block.note}</p>}
        </Bleed>
      );

    case "award":
      return (
        <Bleed tone="navy">
          <div className="cs-award">
            <p className="cs-display cs-award__medal" style={{ color: MILLER_GOLD }}>
              {block.medal}
            </p>
            <p className="cs-award__org">
              {block.org} · {block.year}
            </p>
            <p className="cs-award__category">{block.category}</p>
            {block.project && <p className="cs-display cs-award__project">{block.project}</p>}
            {block.note && <p className="cs-award__note">{block.note}</p>}
          </div>
        </Bleed>
      );

    // ── media blocks (constrained light containers) ──
    case "full-image":
    case "full-video":
      return (
        <Bleed tone="light">
          <Frame media={block.media} label={block.label} caption={block.caption} />
        </Bleed>
      );
    case "two-column":
      return (
        <Bleed tone="light">
          <div className="cs-two-col">
            <Frame media={block.media[0]} ratio="1/1" />
            <Frame media={block.media[1]} ratio="1/1" index={1} />
          </div>
          {block.caption && <p className="cs-caption">{block.caption}</p>}
        </Bleed>
      );
    case "image-copy":
      return (
        <Bleed tone="light">
          <div className={`cs-image-copy ${block.side === "left" ? "" : "cs-image-copy--flip"}`}>
            <Frame media={block.media} ratio={block.media.ratio || "4/5"} />
            <p className="cs-image-copy__text">{block.copy}</p>
          </div>
        </Bleed>
      );
    case "gallery-h":
      return (
        <Bleed tone="light">
          {block.label && <SectionLabel>{block.label}</SectionLabel>}
          <div className="cs-no-scrollbar cs-hscroll">
            {block.media.map((m, i) => (
              <div key={i} className="cs-hscroll__item">
                <Frame media={m} ratio={m.ratio || "3/4"} index={i} />
              </div>
            ))}
          </div>
        </Bleed>
      );
    case "gallery-v":
      return (
        <Bleed tone="light">
          {block.label && <SectionLabel>{block.label}</SectionLabel>}
          <div className="cs-vgallery">
            {block.media.map((m, i) => (
              <Frame key={i} media={m} index={i} />
            ))}
          </div>
        </Bleed>
      );
    case "creator-mosaic":
    case "social-grid":
      return (
        <Bleed tone="light">
          {"label" in block && block.label && <SectionLabel>{block.label}</SectionLabel>}
          <div className="cs-mosaic">
            {block.media.map((m, i) => (
              <Frame key={i} media={m} ratio="1/1" index={i} />
            ))}
          </div>
        </Bleed>
      );
  }
}

/* ── related tile (visible tags, no explanatory text) ──────────────────── */

function RelatedTile({ project, index }) {
  const cat = project.businessCategory[0] ? categoryMap[project.businessCategory[0]] : "";
  const camp = project.campaignTypes[0] ? campaignMap[project.campaignTypes[0]] : "";
  return (
    <Link
      href={`/work/${project.slug}`}
      className="cs-rel-tile"
      {...trackAttr("case_study_view", {
        slug: project.slug,
        from: "more_like_this",
      })}
    >
      <div className="cs-rel-tile__visual">
        <div className="cs-rel-tile__media">
          <Media
            src={project.heroImage}
            need={project.heroImageNeed}
            label={project.brand}
            index={index}
            showSlotLabel={false}
          />
        </div>
      </div>
      <p className="cs-rel-tile__brand">{project.brand}</p>
      <p className="cs-rel-tile__project">{project.project}</p>
      <p className="cs-rel-tile__tags">{[cat, camp].filter(Boolean).join(" · ")}</p>
    </Link>
  );
}

/* ── template ──────────────────────────────────────────────────────────── */

export default function CaseStudy({ project, pool }) {
  const related = relatedProjects(project, 3, pool);
  const next = nextProjectFor(project, pool);

  return (
    <article>
      <style href="cs" precedence="default">
        {styles}
      </style>
      {/* HERO */}
      <header className="cs-container cs-hero">
        <div className="cs-hero__intro">
          <Link href={workFilterHref("brand", project.brandSlug)} className="cs-hero__brand">
            {project.brand}
            {project.year ? <span className="cs-hero__year"> · India · {project.year}</span> : null}
          </Link>
          <h1 className="cs-display cs-hero__title">{project.headline}</h1>
          <p className="cs-hero__summary">{project.oneLineSummary}</p>
        </div>

        <div className="cs-hero__media" style={{ aspectRatio: "16/9" }}>
          <Media
            src={project.heroImage}
            need={project.heroImageNeed || "/assets/work/" + project.slug + "/hero.jpg"}
            label={`${project.brand} — ${project.project}`}
            showSlotLabel
            video={project.heroVideo}
            videoMobile={project.heroVideoMobile}
            youtube={project.heroYoutube}
            priority
          />
        </div>

        {/* restrained, clickable metadata */}
        <div className="cs-hero__meta">
          {project.businessCategory.map((s) => (
            <MetaLink key={s} href={workFilterHref("category", s)}>
              {categoryMap[s] ?? s}
            </MetaLink>
          ))}
          {project.campaignTypes.map((s) => (
            <MetaLink key={s} href={workFilterHref("campaign", s)}>
              {campaignMap[s] ?? s}
            </MetaLink>
          ))}
          {project.services.map((s) => (
            <MetaLink key={s} href={workFilterHref("service", s)}>
              {serviceMap[s] ?? s}
            </MetaLink>
          ))}
        </div>
      </header>

      {project.storyPending ? (
        <div className="cs-container cs-pending">
          <p className="cs-pending__note">
            Full case study coming soon — this project is live in the Work index and filters. Story,
            imagery and any verified figures will be added here.
          </p>
        </div>
      ) : (
        <>
          {/* THE CHALLENGE */}
          {project.challenge && (
            <section className="cs-container cs-section">
              <SectionLabel>The Challenge</SectionLabel>
              <h2 className="cs-display cs-challenge">{project.challenge.question}</h2>
              {project.challenge.copy && (
                <p className="cs-section__copy">{project.challenge.copy}</p>
              )}
              {!project.challenge.copy && DEV && project.draft?.challengeCopy && (
                <DraftNote>{project.draft.challengeCopy}</DraftNote>
              )}
            </section>
          )}

          {/* THE INSIGHT (optional) */}
          {(project.insight || (DEV && project.draft?.insight)) && (
            <section className="cs-band cs-band--paper">
              <div className="cs-container cs-section">
                <SectionLabel>The Insight</SectionLabel>
                {project.insight ? (
                  <p className="cs-display cs-insight">{project.insight.copy}</p>
                ) : (
                  <DraftNote>{project.draft.insight}</DraftNote>
                )}
              </div>
            </section>
          )}

          {/* THE IDEA */}
          {project.idea && (
            <section className="cs-container cs-section">
              <SectionLabel>The Idea</SectionLabel>
              <h2 className="cs-display cs-idea">{project.idea.statement}</h2>
              {project.idea.copy && <p className="cs-section__copy">{project.idea.copy}</p>}
              {!project.idea.copy && DEV && project.draft?.ideaCopy && (
                <DraftNote>{project.draft.ideaCopy}</DraftNote>
              )}
            </section>
          )}

          {/* THE STORY — flexible editorial blocks, each full-bleed & self-toned */}
          {project.execution && project.execution.length > 0 && (
            <div className="cs-story">
              {project.execution.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </div>
          )}

          {/* WHAT GEEK DID */}
          {project.services.length > 0 && (
            <section className="cs-band cs-band--ink">
              <div className="cs-container cs-section cs-section--short">
                <p className="cs-did__label">What Geek Did</p>
                <div className="cs-did">
                  {project.services.map((s) => (
                    <Link
                      key={s}
                      href={workFilterHref("service", s)}
                      className="cs-display cs-did__link"
                    >
                      {serviceMap[s] ?? s}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* THE IMPACT (only when real stats exist) */}
          {project.stats && project.stats.length > 0 && (
            <section className="cs-band">
              <div className="cs-container cs-section">
                <SectionLabel>The Impact</SectionLabel>
                <div className="cs-impact">
                  {project.stats.map((st) => (
                    <div key={st.label}>
                      <div className="cs-display cs-impact__value">{st.value}</div>
                      <div className="cs-rule cs-rule--cyan" />
                      <p className="cs-stat__label">{st.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* THE WORK gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="cs-band">
              <div className="cs-container cs-section cs-section--short">
                <SectionLabel>The Work</SectionLabel>
                <div className="cs-gallery">
                  {project.gallery.map((m, i) => (
                    <Frame key={i} media={m} index={i} ratio={m.ratio || "4/3"} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* QUOTE (optional) */}
          {project.quote && (
            <section className="cs-band cs-band--paper">
              <div className="cs-container cs-section cs-section--center">
                <p className="cs-display cs-quote">“{project.quote.text}”</p>
                {project.quote.attribution && (
                  <p className="cs-quote__by">{project.quote.attribution}</p>
                )}
              </div>
            </section>
          )}

          {/* WHY IT MATTERED */}
          {(project.whyItMattered || (DEV && project.draft?.whyItMattered)) && (
            <section className="cs-band cs-band--navy">
              <div className="cs-container cs-section">
                <SectionLabel>Why It Mattered</SectionLabel>
                {project.whyItMattered ? (
                  <p className="cs-display cs-why">{project.whyItMattered}</p>
                ) : (
                  <DraftNote dark>{project.draft.whyItMattered}</DraftNote>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* MORE LIKE THIS */}
      {related.length > 0 && (
        <section className="cs-band">
          <div className="cs-container cs-section cs-section--short">
            <SectionLabel>More Like This</SectionLabel>
            <div className="cs-related">
              {related.map((p, i) => (
                <RelatedTile key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEXT PROJECT */}
      {next && (
        <section className="cs-band">
          <Link
            href={`/work/${next.slug}`}
            className="cs-next"
            {...trackAttr("case_study_next_click", { from: project.slug, to: next.slug })}
          >
            <div className="cs-next__frame">
              <div className="cs-next__media">
                <Media
                  src={next.heroImage}
                  need={next.heroImageNeed}
                  label={next.brand}
                  showSlotLabel={false}
                />
              </div>
              <div className="cs-next__overlay">
                <p className="cs-next__eyebrow">Next Project</p>
                <p className="cs-display cs-next__headline">{next.headline}</p>
                <span className="cs-next__cta">View Story →</span>
              </div>
            </div>
          </Link>
        </section>
      )}
    </article>
  );
}

/*
 * Note: elements that also carry `.cs-display` only get font-size/colour/etc. here.
 * In the original cascade the unlayered `.cs-display` rule came after Tailwind's
 * utilities, so its line-height / weight / tracking won over `leading-*` and the
 * line-height half of `text-2xl`/`text-3xl`. Leaving them out keeps that result.
 */
const styles = `
/* ---------- Tones ---------- */
.cs-tone--light {
  background-color: #ffffff;
  color: #0c0d0c;
}

.cs-tone--paper {
  background-color: #f5f6f4;
  color: #0c0d0c;
}

.cs-tone--dark {
  background-color: #0c0d0c;
  color: #ffffff;
}

.cs-tone--navy {
  background-color: #08252e;
  color: #ffffff;
}

.cs-tone--miller {
  color: #f4ecd6;
}

.cs-line {
  display: block;
}

.cs-bleed {
  padding-block: 4rem;
}

/* ---------- Helpers ---------- */
.cs-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.cs-frame--contain {
  background-color: #f5f6f4;
}

.cs-frame--cover {
  background-color: #0c0d0c;
}

.cs-frame__caption {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.75rem;
  font-size: 11px;
  color: #5a5f5c;
}

.cs-frame__label {
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #137c93;
}

.cs-meta-link {
  border: 1px solid #eceeeb;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a5f5c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.cs-meta-link:hover {
  border-color: #32c1df;
  color: #137c93;
}

.cs-label {
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.cs-draft {
  margin-top: 1.25rem;
  border-width: 1px;
  border-style: dashed;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.cs-draft--light {
  border-color: rgba(251, 191, 36, 0.6);
  color: #5a5f5c;
}

.cs-draft--dark {
  border-color: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
}

.cs-draft__tag {
  margin-bottom: 0.25rem;
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f59e0b;
}

.cs-rule {
  margin-top: 0.75rem;
  height: 1px;
  width: 3rem;
}

.cs-rule--cyan {
  background-color: #32c1df;
}

/* ---------- Editorial blocks ---------- */
.cs-size--big {
  font-size: clamp(1.9rem, 4.5vw, 3.4rem);
}

.cs-size--giant {
  font-size: clamp(2.4rem, 6vw, 5rem);
}

.cs-size--mega {
  font-size: clamp(2.8rem, 8vw, 7rem);
}

.cs-statement {
  max-width: 20ch;
  text-transform: uppercase;
}

.cs-statement__sub {
  margin-top: 1.5rem;
  max-width: 60ch;
  font-size: 1.125rem;
  line-height: 1.625;
  color: #5a5f5c;
}

.cs-statement__sub--dark {
  color: rgba(255, 255, 255, 0.7);
}

.cs-vs {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: center;
  gap: 1.5rem;
}

.cs-vs__side {
  text-align: center;
}

.cs-vs__big {
  font-size: clamp(1.8rem, 4vw, 3rem);
  text-transform: uppercase;
}

.cs-vs__small {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.cs-vs__mid {
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #63d0ea;
}

.cs-note {
  margin-inline: auto;
  margin-top: 2rem;
  max-width: 52ch;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(255, 255, 255, 0.5);
}

.cs-stats {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 2rem;
  row-gap: 2.5rem;
}

.cs-stat__value {
  font-size: clamp(2.6rem, 7vw, 5.5rem);
}

.cs-stat__value--cyan {
  color: #32c1df;
}

.cs-stat__label {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.cs-stat__label--dark {
  color: rgba(255, 255, 255, 0.7);
}

.cs-stat__note {
  margin-top: 0.25rem;
  font-size: 11px;
  color: rgba(90, 95, 92, 0.7);
}

.cs-stat__note--dark {
  color: rgba(255, 255, 255, 0.4);
}

.cs-stats__note {
  margin-top: 2rem;
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(90, 95, 92, 0.7);
}

.cs-stats__note--dark {
  color: rgba(255, 255, 255, 0.4);
}

.cs-steps {
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 0.75rem;
}

.cs-steps__item {
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.cs-steps__item--dark {
  color: rgba(255, 255, 255, 0.9);
}

.cs-steps__sep {
  margin-left: 2rem;
  color: #32c1df;
}

.cs-funnel {
  margin-inline: auto;
  display: flex;
  max-width: 24ch;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.cs-funnel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cs-funnel__text {
  font-size: clamp(1.8rem, 5vw, 3.4rem);
  text-transform: uppercase;
}

.cs-funnel__arrow {
  font-size: 1.5rem;
  line-height: 2rem;
  color: #32c1df;
}

.cs-award {
  text-align: center;
}

.cs-award__medal {
  font-size: clamp(2.4rem, 7vw, 5rem);
  text-transform: uppercase;
}

.cs-award__org {
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #63d0ea;
}

.cs-award__category {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.cs-award__project {
  margin-top: 1.5rem;
  font-size: 1.5rem;
  text-transform: uppercase;
}

.cs-award__note {
  margin-inline: auto;
  margin-top: 1.5rem;
  max-width: 46ch;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(255, 255, 255, 0.55);
}

/* media blocks */
.cs-two-col {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.cs-caption {
  margin-top: 0.75rem;
  font-size: 11px;
  color: #5a5f5c;
}

.cs-image-copy {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: center;
  gap: 1.5rem;
}

.cs-image-copy__text {
  font-size: 1.125rem;
  line-height: 1.625;
  color: rgba(12, 13, 12, 0.8);
}

.cs-hscroll {
  margin-right: -1.25rem;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-right: 1.25rem;
}

.cs-hscroll__item {
  width: 16rem;
  flex-shrink: 0;
}

.cs-vgallery {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.cs-mosaic {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

/* ---------- Hero ---------- */
.cs-hero {
  padding-top: 6rem;
}

.cs-hero__intro {
  padding-block: 2rem;
}

.cs-hero__brand {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #137c93;
}

.cs-hero__brand:hover {
  color: #32c1df;
}

.cs-hero__year {
  color: #5a5f5c;
}

.cs-hero__title {
  margin-top: 0.75rem;
  font-size: clamp(2.4rem, 6vw, 5rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.cs-hero__summary {
  margin-top: 1rem;
  max-width: 46ch;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

.cs-hero__media {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: #0c0d0c;
}

.cs-hero__meta {
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cs-pending {
  padding-block: 4rem;
}

.cs-pending__note {
  border: 1px solid #eceeeb;
  border-radius: 0.5rem;
  background-color: #f5f6f4;
  padding: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

/* ---------- Story sections ---------- */
.cs-band {
  border-top: 1px solid #eceeeb;
}

.cs-band--paper {
  background-color: #f5f6f4;
}

.cs-band--ink {
  background-color: #0c0d0c;
  color: #ffffff;
}

.cs-band--navy {
  background-color: #08252e;
  color: #ffffff;
}

.cs-section {
  padding-block: 4rem;
}

.cs-section--center {
  text-align: center;
}

.cs-section__copy {
  margin-top: 1.5rem;
  max-width: 52ch;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

.cs-challenge {
  max-width: 20ch;
  font-size: clamp(1.9rem, 4.5vw, 3.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.cs-insight {
  max-width: 24ch;
  font-size: clamp(1.6rem, 3.5vw, 2.8rem);
  color: #0c0d0c;
}

.cs-idea {
  max-width: 18ch;
  font-size: clamp(2rem, 5.5vw, 4.4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.cs-story {
  border-top: 1px solid #eceeeb;
}

.cs-story > section {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.cs-did__label {
  margin-bottom: 1.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #63d0ea;
}

.cs-did {
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 0.75rem;
}

.cs-did__link {
  font-size: 1.5rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.cs-did__link:hover {
  color: #32c1df;
}

.cs-impact {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2.5rem;
}

.cs-impact__value {
  font-size: clamp(2.6rem, 7vw, 5rem);
  color: #32c1df;
}

.cs-gallery {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.cs-quote {
  margin-inline: auto;
  max-width: 26ch;
  font-size: clamp(1.6rem, 3.5vw, 3rem);
  color: #0c0d0c;
}

.cs-quote__by {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.cs-why {
  max-width: 22ch;
  font-size: clamp(1.8rem, 4.5vw, 3.6rem);
  text-transform: uppercase;
}

/* ---------- More like this ---------- */
.cs-related {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.cs-rel-tile {
  display: block;
}

.cs-rel-tile__visual {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
}

.cs-rel-tile__media {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.cs-rel-tile:hover .cs-rel-tile__media {
  transform: scale(1.05);
}

.cs-rel-tile__brand {
  margin-top: 0.75rem;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  color: #0c0d0c;
}

.cs-rel-tile__project {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.cs-rel-tile__tags {
  margin-top: 0.5rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #137c93;
}

/* ---------- Next project ---------- */
.cs-next {
  display: block;
}

.cs-next__frame {
  position: relative;
  width: 100%;
  height: 46vh;
  min-height: 320px;
  overflow: hidden;
  background-color: #0c0d0c;
}

.cs-next__media {
  width: 100%;
  height: 100%;
  opacity: 0.7;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 900ms;
}

.cs-next:hover .cs-next__media {
  transform: scale(1.05);
  opacity: 0.9;
}

.cs-next__overlay {
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

.cs-next__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #63d0ea;
}

.cs-next__headline {
  margin-top: 0.75rem;
  font-size: clamp(1.8rem, 5vw, 4rem);
  text-transform: uppercase;
}

.cs-next__cta {
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* ---------- Breakpoints ---------- */
/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.cs-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .cs-container {
    padding-inline: 20px;
  }
}

.cs-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

.cs-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cs-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .cs-bleed,
  .cs-section {
    padding-block: 6rem;
  }

  .cs-section--short {
    padding-block: 5rem;
  }

  .cs-hero {
    padding-top: 7rem;
  }

  .cs-hero__summary {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .cs-vs {
    grid-template-columns: 1fr auto 1fr;
  }

  .cs-vs__side--left {
    text-align: right;
  }

  .cs-vs__side--right {
    text-align: left;
  }

  .cs-stats,
  .cs-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cs-steps__item,
  .cs-award__project,
  .cs-did__link {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .cs-two-col {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cs-hscroll {
    margin-right: -2rem;
    padding-right: 2rem;
  }

  .cs-hscroll__item {
    width: 18rem;
  }

  .cs-mosaic {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .cs-impact,
  .cs-related {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .cs-image-copy {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cs-image-copy--flip > *:first-child {
    order: 2;
  }
}

@media (min-width: 1024px) {
  .cs-stats,
  .cs-gallery {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
