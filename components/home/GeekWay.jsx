"use client";

import { motion, useReducedMotion } from "framer-motion";
import Band, { BandLabel } from "@/components/ui/Band";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

export default function GeekWay({ content = HOME_FALLBACK.geekWay }) {
  const reduce = useReducedMotion();
  const principles = content.principles;
  return (
    <>
      <style href="gway" precedence="default">
        {styles}
      </style>
      <Band id="insights" label={<BandLabel title={content.title} />}>
        {/* editorial, typography-led — no cards */}
        <div className="gway__list">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="gway__row"
            >
              <span className="gway__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="gway-display gway__title">{p.title}</h3>
              <p className="gway__body">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </Band>

      {/* dramatic finale — significant visual weight */}
      <section className="gway__finale">
        <div
          className="gway__finale-glow"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 40%, rgba(50,193,223,0.30) 0%, transparent 60%)",
          }}
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="gway-container gway__finale-inner"
        >
          <h3 className="gway-display gway__finale-title">
            <HighlightedLines text={content.finaleBlock} highlight={content.finaleHighlight} />
          </h3>
          <p className="gway__finale-sub">{content.finaleSub}</p>
        </motion.div>
      </section>
    </>
  );
}

const styles = `
.gway__list {
  border-top: 1px solid #eceeeb;
}

.gway__list > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 1px;
  border-bottom-width: 0;
  border-color: #eceeeb;
}

.gway__row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  column-gap: 1.25rem;
  padding-block: 1rem;
}

.gway__num {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  color: #32c1df;
}

.gway__title {
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.gway__body {
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.gway__finale {
  position: relative;
  overflow: hidden;
  background-color: #08252e;
  padding-block: 4rem;
  color: #ffffff;
}

.gway__finale-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.6;
}

.gway__finale-inner {
  position: relative;
  text-align: center;
}

.gway__finale-title {
  font-size: clamp(2.6rem, 8vw, 7rem);
  text-transform: uppercase;
}

.gway__finale-sub {
  margin-top: 1.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.gway-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .gway-container {
    padding-inline: 20px;
  }
}

.gway-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .gway__row {
    grid-template-columns: auto minmax(0, 10ch) 1fr;
    column-gap: 2rem;
  }

  .gway__title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .gway__body {
    grid-column: span 1 / span 1;
  }

  .gway__finale {
    padding-block: 6rem;
  }

  .gway__finale-sub {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
`;
