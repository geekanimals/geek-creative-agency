/**
 * EVIDENCE & RECOGNITION — "In the press" section for standard/flexible Project
 * pages. Renders ONLY the subsections that have data, and nothing when empty.
 * Flagship pages never mount this.
 *
 * Honesty rules (Section 12):
 *   • Independent media and Official/Partner sources are shown in SEPARATE
 *     groups — official/brand/partner coverage is never presented as independent.
 *   • A "Geek featured" marker appears ONLY when geekMentioned is true.
 *   • Citations are ordinary editorial links: crawlable, new tab, rel="noopener".
 */

const isIndependent = (t) => t === "independent-editorial" || t === "trade-publication";

function formatDate(iso) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").replace(/^archive\./, "");
  } catch {
    return "";
  }
}

const isYouTube = (url) => /youtube\.com|youtu\.be/.test(url || "");

const EXTERNAL = { target: "_blank", rel: "noopener" };

function Favicon({ url, size = 20 }) {
  const host = hostOf(url);
  if (!host) return null;
  return (
    <img
      className="evid-fav"
      src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
    />
  );
}

function Meta({ item, dark }) {
  const date = formatDate(item.publicationDate);
  return (
    <div className={`evid-meta${dark ? " evid-meta--dark" : ""}`}>
      <Favicon url={item.url} />
      <span className="evid-meta__pub">{item.publisher}</span>
      {date && <span className="evid-meta__date">{date}</span>}
      {item.geekMentioned && <span className="evid-meta__badge">Geek featured</span>}
    </div>
  );
}

function FeaturedStory({ item }) {
  return (
    <a href={item.url} {...EXTERNAL} className="evid-feature">
      <Meta item={item} dark />
      <h3 className="evid-feature__headline">“{item.headline}”</h3>
      {item.validationNote && <p className="evid-feature__note">{item.validationNote}</p>}
      <span className="evid-feature__cta">
        Read on {hostOf(item.url)} <span aria-hidden>↗</span>
      </span>
    </a>
  );
}

function StoryCard({ item }) {
  return (
    <a href={item.url} {...EXTERNAL} className="evid-card">
      <Meta item={item} />
      <h4 className="evid-card__headline">{item.headline}</h4>
      {item.validationNote && <p className="evid-card__note">{item.validationNote}</p>}
      <span className="evid-card__cta">
        Read story <span aria-hidden>↗</span>
      </span>
      {item.archiveUrl && <span className="evid-card__archive">Archived copy available</span>}
    </a>
  );
}

function OfficialSource({ item }) {
  const yt = isYouTube(item.url);
  return (
    <a href={item.url} {...EXTERNAL} className="evid-official">
      <span className={`evid-official__icon${yt ? " evid-official__icon--yt" : ""}`} aria-hidden>
        {yt ? "▶" : <Favicon url={item.url} size={16} />}
      </span>
      <span className="evid-official__text">
        <span className="evid-official__kicker">{yt ? "Watch the film" : item.publisher}</span>
        <span className="evid-official__title">{item.headline}</span>
      </span>
      <span className="evid-official__arrow" aria-hidden>↗</span>
    </a>
  );
}

function AwardCard({ item }) {
  const credited =
    item.creditedOrganizations.length > 0 ? item.creditedOrganizations.join(", ") : undefined;
  return (
    <article className="evid-award">
      <div className="evid-award__meta">
        {item.result && <span className="evid-award__result">{item.result}</span>}
        <span className="evid-award__program">{item.programName || item.awardBody}</span>
        {item.year != null && <span className="evid-meta__date">{item.year}</span>}
      </div>
      {item.category && <p className="evid-award__category">{item.category}</p>}
      {item.validationNote && <p className="evid-card__note">{item.validationNote}</p>}
      <p className="evid-award__credit">
        {item.geekCredited ? "Geek credited" : credited ? `Credited: ${credited}` : "Campaign recognition"}
      </p>
      {item.url && (
        <a href={item.url} {...EXTERNAL} className="evid-card__cta evid-award__link">
          View source ↗
        </a>
      )}
    </article>
  );
}

/**
 * @param {{ press?: import("@/lib/cms/projects").PressItem[], awards?: import("@/lib/cms/projects").AwardItem[] }} props
 */
export default function EvidenceRecognition({ press = [], awards = [] }) {
  if (press.length === 0 && awards.length === 0) return null;
  const independent = press
    .filter((p) => isIndependent(p.sourceType))
    .sort((a, b) => Number(b.featured) - Number(a.featured));
  const official = press.filter((p) => !isIndependent(p.sourceType));
  const [lead, ...rest] = independent;
  const outlets = [...new Set(independent.map((p) => p.publisher))];

  return (
    <section className="evid" aria-labelledby="evid-title">
      <style href="evid" precedence="default">
        {styles}
      </style>
      <div className="evid-container evid__inner">
        <div className="evid__head">
          <p className="evid__eyebrow">{independent.length ? "Press & coverage" : "Sources"}</p>
          <h2 id="evid-title" className="evid-display evid__title">
            {independent.length ? "In the press" : awards.length && !official.length ? "Recognition" : "Watch & read more"}
          </h2>
          {outlets.length > 0 && (
            <p className="evid__outlets">
              Covered by {outlets.slice(0, 5).join(" · ")}
              {outlets.length > 5 ? ` + ${outlets.length - 5} more` : ""}
            </p>
          )}
        </div>

        {lead && (
          <div className={`evid__stories${rest.length === 0 ? " evid__stories--single" : rest.length > 3 ? " evid__stories--many" : ""}`}>
            <FeaturedStory item={lead} />
            {rest.length > 0 && (
              <div className="evid__list">
                {rest.map((item, i) => (
                  <StoryCard key={`${item.url}-${i}`} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {official.length > 0 && (
          <div className="evid__group">
            <p className="evid__label">Official &amp; partner sources</p>
            <div className="evid__officials">
              {official.map((item, i) => (
                <OfficialSource key={`${item.url}-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {awards.length > 0 && (
          <div className="evid__group">
            <p className="evid__label">Awards &amp; recognition</p>
            <div className="evid__awards">
              {awards.map((a, i) => (
                <AwardCard key={`${a.awardBody}-${i}`} item={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const styles = `
.evid { background: #f5f6f4; border-top: 1px solid #eceeeb; }
.evid__inner { padding-block: 4rem; }
.evid__head { margin-bottom: 2.25rem; }
.evid__eyebrow, .evid__label {
  font-size: 0.75rem; line-height: 1rem; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: #137c93; margin: 0 0 0.75rem;
}
.evid__label { margin-bottom: 1rem; }
.evid__title { margin: 0; font-size: clamp(2rem, 5vw, 3.75rem); text-transform: uppercase; color: #0c0d0c; }
.evid__outlets { margin-top: 0.9rem; font-size: 0.95rem; color: #5a5f5c; }
.evid-fav { width: 20px; height: 20px; border-radius: 4px; background: #fff; flex: none; object-fit: contain; }

.evid-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 0.6rem; }
.evid-meta__pub { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #137c93; }
.evid-meta__date { font-size: 0.75rem; color: #5a5f5c; }
.evid-meta__badge {
  border-radius: 9999px; background: rgba(50,193,223,0.15); padding: 0.125rem 0.5rem;
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #137c93;
}
.evid-meta--dark .evid-meta__pub { color: #32c1df; }
.evid-meta--dark .evid-meta__date { color: rgba(255,255,255,0.6); }

.evid__stories { display: grid; gap: 1rem; }
.evid-feature {
  display: flex; flex-direction: column; gap: 1rem; border-radius: 1rem; padding: 1.75rem;
  background: #0c0d0c; color: #fff; text-decoration: none; min-height: 18rem;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.evid-feature:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(12,13,12,0.18); }
.evid-feature__headline {
  margin: 0; font-family: var(--font-display), system-ui, sans-serif; font-weight: 700;
  font-size: clamp(1.4rem, 2.6vw, 2.1rem); line-height: 1.15; letter-spacing: -0.02em; color: #fff;
}
.evid-feature__note { margin: 0; font-size: 0.9rem; line-height: 1.6; color: rgba(255,255,255,0.7); }
.evid-feature__cta {
  margin-top: auto; align-self: flex-start; border-radius: 9999px; background: #32c1df; color: #0c0d0c;
  padding: 0.55rem 1.1rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
}

.evid__list { display: grid; gap: 1rem; }
.evid-card {
  display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid #e3e6e2; border-radius: 0.85rem;
  background: #fff; padding: 1.25rem; text-decoration: none; color: inherit;
  transition: border-color 150ms ease, transform 150ms ease;
}
.evid-card:hover { border-color: #32c1df; transform: translateY(-1px); }
.evid-card__headline {
  margin: 0; font-family: var(--font-display), system-ui, sans-serif; font-size: 1.05rem;
  font-weight: 600; line-height: 1.35; color: #0c0d0c;
}
.evid-card__note { margin: 0; font-size: 0.82rem; line-height: 1.55; color: #5a5f5c; }
.evid-card__cta { margin-top: 0.25rem; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #137c93; }
.evid-card__archive { font-size: 11px; color: #5a5f5c; }

.evid__group { margin-top: 2.5rem; }
.evid__officials { display: grid; gap: 0.75rem; }
.evid-official {
  display: flex; align-items: center; gap: 0.9rem; border: 1px solid #e3e6e2; border-radius: 9999px;
  background: #fff; padding: 0.6rem 1.1rem 0.6rem 0.6rem; text-decoration: none; color: inherit;
  transition: border-color 150ms ease;
}
.evid-official:hover { border-color: #32c1df; }
.evid-official__icon {
  display: grid; place-items: center; width: 2.25rem; height: 2.25rem; flex: none; border-radius: 9999px;
  background: #eef8fb; color: #137c93; font-size: 0.8rem;
}
.evid-official__icon--yt { background: #ff0033; color: #fff; }
.evid-official__text { display: flex; flex-direction: column; min-width: 0; }
.evid-official__kicker { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #137c93; }
.evid-official__title { font-size: 0.92rem; font-weight: 600; color: #0c0d0c; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.evid-official__arrow { margin-left: auto; color: #137c93; }

.evid__awards { display: grid; gap: 1rem; }
.evid-award { border: 1px solid #e3e6e2; border-radius: 0.85rem; background: #fff; padding: 1.25rem; }
.evid-award__meta { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 0.75rem; }
.evid-award__result { font-family: var(--font-display), system-ui, sans-serif; font-size: 1.125rem; font-weight: 700; color: #137c93; }
.evid-award__program { font-size: 0.875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #0c0d0c; }
.evid-award__category { margin-top: 0.25rem; font-size: 0.875rem; color: #5a5f5c; }
.evid-award__credit { margin-top: 0.75rem; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(90,95,92,0.8); }
.evid-award__link { display: inline-block; margin-top: 0.75rem; text-decoration: none; }

.evid-container { width: 100%; max-width: 1400px; margin-inline: auto; padding-inline: 32px; }
@media (max-width: 639px) { .evid-container { padding-inline: 20px; } .evid-feature { padding: 1.35rem; min-height: 0; } }
.evid-display { font-family: var(--font-display), system-ui, sans-serif; font-weight: 700; letter-spacing: -0.045em; line-height: 0.92; text-wrap: balance; }

@media (min-width: 640px) {
  .evid__inner { padding-block: 5rem; }
  .evid__list, .evid__officials, .evid__awards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .evid__stories { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); align-items: stretch; }
  .evid__stories--single { grid-template-columns: minmax(0, 1fr); }
  .evid__stories--many { grid-template-columns: minmax(0, 1fr); }
  .evid__stories--many .evid-feature { min-height: 0; }
  .evid__stories--many .evid__list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .evid__list { grid-template-columns: minmax(0, 1fr); }
  .evid__officials, .evid__awards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
`;
