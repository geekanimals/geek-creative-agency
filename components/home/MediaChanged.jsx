"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Media from "@/components/ui/Media";
import BrushWord from "@/components/ui/BrushWord";
import { videoProps } from "@/lib/video";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

function Arrow() {
  return (
    <span className="mchanged__arrow" aria-hidden>
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 7h9M7.5 3.5 11 7l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** The animated cyan card ("It'll change again."). */
function Transitional({ reduce }) {
  return (
    <div className="mchanged__transitional">
      <motion.div
        aria-hidden
        className="mchanged__layer"
        style={{
          background:
            "linear-gradient(110deg, rgba(50,193,223,0) 0%, rgba(50,193,223,0.55) 50%, rgba(50,193,223,0) 100%)",
        }}
        animate={reduce ? {} : { x: ["-60%", "60%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="mchanged__layer"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 12px)",
        }}
      />
    </div>
  );
}

/**
 * "The web changed. Social changed. …" — one card per era, ending in the cyan
 * MAKE BRANDS MATTER card. Each card shows a video (if set) or an image.
 * Admin: Home Page → Media changed. Props: content = { eras, finaleKicker, finaleWord }.
 */
export default function MediaChanged({ content = HOME_FALLBACK.mediaChanged }) {
  const reduce = useReducedMotion();
  return (
    <section id="what-we-do" className="mchanged">
      <style href="mchanged" precedence="default">
        {styles}
      </style>
      <div className="mchanged-container mchanged-no-scrollbar mchanged__scroller">
        <div className="mchanged__row" style={{ "--mchanged-cols": content.eras.length }}>
          {content.eras.map((e, i) => {
            const v = videoProps(e.video);
            const body = (
              <>
                <div className="mchanged__thumb">
                  {e.transitional && !e.src && !e.video ? (
                    <Transitional reduce={reduce} />
                  ) : (
                    <div className="mchanged__media">
                      <Media
                        src={e.src || v.poster}
                        label={e.label}
                        index={i}
                        showSlotLabel={false}
                        video={v.video}
                        videoMobile={v.videoMobile}
                        youtube={v.youtube}
                        sizes="(max-width: 1024px) 240px, 200px"
                      />
                    </div>
                  )}
                </div>
                <div className="mchanged__text">
                  <p className="mchanged-display mchanged__title">
                    {e.pre} <span className="mchanged__title-post">{e.post}</span>
                  </p>
                  {e.href && <Arrow />}
                </div>
              </>
            );
            return (
              <motion.div
                key={e.pre + e.post + i}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                className="mchanged__cell"
              >
                {e.href ? (
                  <Link href={e.href} className="mchanged__era mchanged__era--link">
                    {body}
                  </Link>
                ) : (
                  <div className="mchanged__era">{body}</div>
                )}
              </motion.div>
            );
          })}

          {/* Cyan finale — resolves into MAKE BRANDS MATTER */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mchanged__finale"
          >
            <div
              className="mchanged__finale-glow"
              style={{
                background:
                  "radial-gradient(70% 90% at 90% 10%, rgba(255,255,255,0.35) 0%, transparent 55%)",
              }}
            />
            <p className="mchanged__finale-kicker">{content.finaleKicker}</p>
            <h3 className="mchanged-display mchanged__finale-title">
              <BrushWord color="#ffffff">{content.finaleWord}</BrushWord>
            </h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const styles = `
.mchanged {
  border-top: 1px solid #eceeeb;
  border-bottom: 1px solid #eceeeb;
  background-color: #ffffff;
}

.mchanged__scroller {
  overflow-x: auto;
  scroll-snap-type: x proximity;
}

.mchanged__row {
  display: flex;
  min-width: max-content;
  align-items: stretch;
  gap: 1px;
  background-color: #eceeeb;
}

.mchanged__cell {
  display: flex;
  width: 220px;
  flex-shrink: 0;
  scroll-snap-align: start;
  background-color: #ffffff;
}

.mchanged__era {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  color: inherit;
}

.mchanged__thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #08252e;
}

.mchanged__media {
  width: 100%;
  height: 100%;
  transition: transform 700ms cubic-bezier(0, 0, 0.2, 1);
}

.mchanged__era--link:hover .mchanged__media {
  transform: scale(1.06);
}

.mchanged__transitional {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #08252e;
}

.mchanged__layer {
  position: absolute;
  inset: 0;
}

.mchanged__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.mchanged__title {
  font-size: 1.125rem;
  line-height: 1.2;
  color: #0c0d0c;
}

.mchanged__title-post {
  color: #5a5f5c;
}

.mchanged__arrow {
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border: 1px solid #32c1df;
  border-radius: 9999px;
  color: #32c1df;
  transition: background-color 250ms ease, color 250ms ease, transform 250ms ease;
}

.mchanged__era--link:hover .mchanged__arrow {
  background-color: #32c1df;
  color: #ffffff;
  transform: translateX(3px);
}

.mchanged__finale {
  position: relative;
  display: flex;
  width: 260px;
  flex-shrink: 0;
  scroll-snap-align: start;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: #32c1df;
  padding: 1.5rem;
  color: #ffffff;
}

.mchanged__finale-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.5;
}

.mchanged__finale-kicker {
  position: relative;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.mchanged__finale-title {
  position: relative;
  margin-top: 0.25rem;
  font-size: 1.875rem;
  text-transform: uppercase;
}

.mchanged-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .mchanged-container {
    padding-inline: 20px;
  }
}

.mchanged-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.mchanged-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mchanged-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .mchanged__cell {
    width: 240px;
  }

  .mchanged__title {
    font-size: 1.25rem;
  }

  .mchanged__finale {
    width: 300px;
  }
}

/* Desktop: everything fits in one row, no sideways scrolling. */
@media (min-width: 1280px) {
  .mchanged__row {
    display: grid;
    min-width: 0;
    grid-template-columns: repeat(var(--mchanged-cols, 6), minmax(0, 1fr)) minmax(0, 1.25fr);
  }

  .mchanged__cell,
  .mchanged__finale {
    width: auto;
  }

  .mchanged__era {
    padding: 1.25rem 1rem;
  }
}
`;
