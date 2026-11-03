"use client";

import Media from "@/components/ui/Media";
import AutoVideo from "@/components/ui/AutoVideo";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { heroPoster } from "@/lib/data/work";
import { VIDEO, videoProps } from "@/lib/video";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

export default function Hero({ content = HOME_FALLBACK.hero, video = null }) {
  const reel = videoProps(video, VIDEO.hero);
  return (
    <section id="top" className="hero">
      <style href="hero" precedence="default">
        {styles}
      </style>
      {/* blue ray / tech background */}
      <div className="hero__bg" aria-hidden>
        <div
          className="hero__glow"
          style={{
            background:
              "radial-gradient(60% 80% at 78% 30%, rgba(50,193,223,0.14) 0%, rgba(50,193,223,0) 60%)",
          }}
        />
        <svg className="hero__rays" viewBox="0 0 600 500" preserveAspectRatio="xMaxYMid slice">
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1={620}
              y1={-40 + i * 18}
              x2={-40}
              y2={120 + i * 46}
              stroke="#32C1DF"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
          ))}
        </svg>
      </div>

      <div className="hero-container hero__grid">
        {/* Headline */}
        <div className="hero__copy">
          {/* Entrance animations are CSS (start at first paint, no wait for JS). */}
          <h1 className="hero-display hero__title hero-in hero-in--title">
            <HighlightedLines text={content.headingBlock} highlight={content.headingHighlight} />
          </h1>

          <p className="hero__sub hero-in hero-in--sub">{content.subline}</p>

          <div className="hero__ctas hero-in hero-in--ctas">
            <a
              href={content.ctaPrimary.href}
              data-track="hero_work_click"
              className="hero__cta hero__cta--primary"
            >
              {content.ctaPrimary.label} <span aria-hidden>→</span>
            </a>
            <a
              href={content.ctaSecondary.href}
              data-track="contact_cta_click"
              data-track-props='{"from":"hero"}'
              className="hero__cta hero__cta--secondary"
            >
              {content.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* Showreel media container */}
        <div className="hero__media hero-in hero-in--media">
          <div className="hero__frame">
            {/* Showreel — set in the admin (Home Page → Videos: upload or YouTube link);
                lib/video.ts is the code fallback, the poster collage the static fallback. */}
            <AutoVideo
              desktop={reel.video}
              mobile={reel.videoMobile}
              youtube={reel.youtube}
              posterImg={reel.poster}
            >
              <div className="hero__poster">
                {heroPoster.map((p, i) => (
                  <div key={p.slug} className="hero__tile">
                    <Media
                      src={p.src}
                      need={p.need}
                      label={p.brand}
                      index={i}
                      showSlotLabel={i % 2 === 0}
                      priority={i < 2}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </AutoVideo>

            {/* showreel affordance */}
            <div className="hero__overlay">
              <span className="hero__badge">
                <span className="hero__play">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                    <path d="M3 2l7 4-7 4z" />
                  </svg>
                </span>
                Showreel · Muted
              </span>
              <span className="hero__note">Real Geek work</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = `
/* Hero entrance — same motion as before (fade/slide, expo-out), run by CSS. */
@keyframes hero-in-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes hero-in-up-sm { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes hero-in-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes hero-in-zoom { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
.hero-in { animation-fill-mode: both; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
.hero-in--title { animation-name: hero-in-up; animation-duration: 0.8s; }
.hero-in--sub { animation-name: hero-in-fade; animation-duration: 0.7s; animation-delay: 0.3s; animation-timing-function: ease; }
.hero-in--ctas { animation-name: hero-in-up-sm; animation-duration: 0.7s; animation-delay: 0.45s; animation-timing-function: ease; }
.hero-in--media { animation-name: hero-in-zoom; animation-duration: 0.9s; animation-delay: 0.2s; }
@media (prefers-reduced-motion: reduce) {
  .hero-in { animation: none; }
}

.hero {
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  padding-top: 6rem;
}

.hero__bg {
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.hero__glow {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 70%;
}

.hero__rays {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 66.666667%;
  opacity: 0.5;
}

.hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: center;
  gap: 2rem;
  padding-bottom: 3rem;
}

.hero__copy {
  position: relative;
  z-index: 10;
}

.hero__title {
  font-size: clamp(2.6rem, 6vw, 5.4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.hero__sub {
  margin-top: 1.25rem;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: #5a5f5c;
}

.hero__ctas {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hero__cta--primary {
  border: 1px solid rgba(12, 13, 12, 0.25);
  color: #0c0d0c;
}

.hero__cta--primary:hover {
  border-color: #32c1df;
  background-color: #32c1df;
  color: #ffffff;
}

.hero__cta--secondary {
  background-color: #0c0d0c;
  color: #ffffff;
}

.hero__cta--secondary:hover {
  background-color: #32c1df;
}

.hero__media {
  position: relative;
  z-index: 0;
}

.hero__frame {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 1rem;
  background-color: #0c0d0c;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.hero__poster {
  display: grid;
  height: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 3px;
}

.hero__tile {
  position: relative;
  overflow: hidden;
}

.hero__overlay {
  pointer-events: none;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background-image: linear-gradient(to top, rgba(12, 13, 12, 0.85), transparent);
  padding: 2.5rem 1rem 1rem;
}

.hero__badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.hero__play {
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #32c1df;
  color: #0c0d0c;
}

.hero__note {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.hero-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .hero-container {
    padding-inline: 20px;
  }
}

.hero-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .hero {
    padding-top: 7rem;
  }

  .hero__frame {
    aspect-ratio: 16 / 11;
  }
}

@media (min-width: 1024px) {
  .hero__grid {
    grid-template-columns: minmax(0, 42%) minmax(0, 58%);
    padding-bottom: 4rem;
  }
}
`;
