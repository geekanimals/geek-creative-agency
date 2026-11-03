"use client";

import { motion, useReducedMotion } from "framer-motion";
import Media from "@/components/ui/Media";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { VIDEO, videoProps } from "@/lib/video";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

export default function BuiltByGeek({ content = HOME_FALLBACK.builtByGeek, video = null }) {
  const first = videoProps(video, VIDEO.builtByGeek);
  const reduce = useReducedMotion();
  return (
    <section id="about" className="bbg">
      <style href="bbg" precedence="default">
        {styles}
      </style>
      <div
        className="bbg__glow"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, rgba(50,193,223,0.22) 0%, transparent 55%)",
        }}
      />

      <div className="bbg-container bbg__inner">
        {/* dramatic headline */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="bbg__eyebrow">{content.eyebrow}</p>
          <h2 className="bbg-display bbg__headline">
            <HighlightedLines text={content.headingBlock} />
          </h2>
          <p className="bbg-display bbg__headline-cyan">{content.headingCyan}</p>
        </motion.div>

        {/* two large stories */}
        <div className="bbg__stories">
          {content.stories.map((s, i) => (
            <motion.a
              key={s.key}
              href={s.href}
              {...(/^https?:/.test(s.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bbg__story"
            >
              <div className="bbg__story-media">
                <Media
                  src={s.src}
                  label={s.brand}
                  index={i + 1}
                  video={i === 0 ? first.video : undefined}
                  videoMobile={i === 0 ? first.videoMobile : undefined}
                  youtube={i === 0 ? first.youtube : undefined}
                />
              </div>
              <div className="bbg__story-shade" />
              <div className="bbg__story-body">
                {s.project && <p className="bbg__kicker">{s.project}</p>}
                <h3 className="bbg-display bbg__brand">{s.brand}</h3>
                <span className="bbg__cta">
                  View Story <span aria-hidden>→</span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* closing statement */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
          className="bbg-display bbg__closing"
        >
          <HighlightedLines text={content.closing} highlight={content.closingHighlight} />
        </motion.p>
      </div>
    </section>
  );
}

const styles = `
.bbg {
  position: relative;
  overflow: hidden;
  background-color: #0c0d0c;
  padding-block: 4rem;
  color: #ffffff;
}

.bbg__glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.4;
}

.bbg__inner {
  position: relative;
}

.bbg__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #63d0ea;
}

.bbg__headline {
  margin-top: 1rem;
  font-size: clamp(2rem, 5vw, 4.2rem);
  text-transform: uppercase;
}

.bbg__headline-cyan {
  margin-top: 0.5rem;
  font-size: clamp(2rem, 5vw, 4.2rem);
  text-transform: uppercase;
  color: #32c1df;
}

.bbg__stories {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.bbg__story {
  position: relative;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.bbg__story-media {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 900ms;
}

.bbg__story:hover .bbg__story-media {
  transform: scale(1.05);
}

.bbg__story-shade {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to top, #0c0d0c, rgba(12, 13, 12, 0.25), transparent);
}

.bbg__story-body {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.5rem;
}

.bbg__kicker {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #63d0ea;
}

.bbg__brand {
  margin-top: 0.5rem;
  font-size: clamp(1.6rem, 3vw, 2.8rem);
  text-transform: uppercase;
}

.bbg__cta {
  margin-top: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.bbg__story:hover .bbg__cta {
  color: #ffffff;
}

.bbg__closing {
  margin-top: 3.5rem;
  max-width: 20ch;
  font-size: clamp(1.8rem, 4vw, 3.6rem);
  text-transform: uppercase;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.bbg-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .bbg-container {
    padding-inline: 20px;
  }
}

.bbg-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .bbg {
    padding-block: 6rem;
  }

  .bbg__story-body {
    padding: 2rem;
  }
}

@media (min-width: 768px) {
  .bbg__stories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
