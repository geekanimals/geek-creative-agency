"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Band from "@/components/ui/Band";
import Media from "@/components/ui/Media";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

const COLS = 12;
const ROWS = 4;
const COUNT = COLS * ROWS; // 48 tiles — always the 48 latest creators

/** One creator tile: Instagram profile picture → opens their Instagram. */
function CreatorTile({ creator }) {
  const [broken, setBroken] = useState(false);
  return (
    <a
      href={`https://www.instagram.com/${encodeURIComponent(creator.username)}/`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`@${creator.username} on Instagram`}
      title={`@${creator.username}`}
      className="influence__tile"
    >
      {/* Loaded straight from Instagram's CDN by the browser (no-referrer), exactly
          like Geek OS does — Instagram blocks server-side fetching of these. */}
      {broken ? (
        // Picture failed to load (expired / blocked): keep the tile clickable and
        // show the creator's initial instead of an empty dark box.
        <span className="influence__initial">
          {creator.username.replace(/[^a-z0-9]/gi, "").charAt(0) || "@"}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={creator.picture}
          alt={`@${creator.username}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="influence__img"
          onError={() => setBroken(true)}
        />
      )}
      <span className="influence__handle">@{creator.username}</span>
    </a>
  );
}

/**
 * Creator mosaic. Tiles are filled with live Instagram-connected creators from
 * Geek Influencer OS (profile picture → their Instagram). When fewer creators
 * are available (or Geek OS isn't configured) the remaining cells stay as the
 * on-brand placeholder tiles, so the layout never changes.
 */
export default function Influence({ content = HOME_FALLBACK.influence, creators = [] }) {
  const reduce = useReducedMotion();
  return (
    <Band
      id="for-creators"
      label={
        <div>
          <p className="influence__eyebrow">{content.eyebrow}</p>
          <p className="influence-display influence__heading">{content.heading}</p>
          <p className="influence__sub">{content.sub}</p>
          <p className="influence__list">{content.list}</p>
          {/* Opens /influence — influencer marketing A to Z (admin: Pages → Influence Page) */}
          <Link href="/influence" className="influence__button">
            <span>{content.buttonLabel || "See how influence works"}</span>
            <span className="influence__button-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      }
    >
      <style href="influence" precedence="default">
        {styles}
      </style>
      <div className="influence__mosaic" data-mosaic="creators">
        {Array.from({ length: COUNT }).map((_, i) => {
          const creator = creators[i];
          return (
            <motion.div
              key={creator ? creator.username : `slot-${i}`}
              data-creator-index={i}
              className="influence__cell"
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : ((i % COLS) + Math.floor(i / COLS)) * 0.02,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {creator ? (
                <CreatorTile creator={creator} />
              ) : (
                <>
                  <Media
                    need={`/assets/work/creators/${i + 1}.jpg`}
                    label={`Creator ${i + 1}`}
                    index={i}
                    showSlotLabel={false}
                  />
                  {i % 11 === 5 && <div className="influence__accent" />}
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </Band>
  );
}

const styles = `
.influence__button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1.5px solid #32c1df;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
  transition: color 200ms ease, gap 200ms ease;
}

.influence__button:hover {
  color: #32c1df;
  gap: 0.9rem;
}

.influence__button-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: #32c1df;
  color: #0c0d0c;
  font-size: 0.75rem;
  letter-spacing: 0;
  transition: transform 200ms ease;
}

.influence__button:hover .influence__button-arrow {
  transform: translateX(2px);
}

.influence__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #32c1df;
}

.influence__heading {
  margin-top: 0.5rem;
  font-size: 1.875rem;
  color: #0c0d0c;
}

.influence__sub {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.influence__list {
  margin-top: 0.75rem;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.625;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a5f5c;
}



.influence__mosaic {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.25rem;
  overflow: hidden;
  border-radius: 0.5rem;
}

.influence__cell {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.influence__accent {
  position: absolute;
  inset: 0;
  background-color: rgba(50, 193, 223, 0.85);
}

.influence__tile {
  position: absolute;
  inset: 0;
  display: block;
}

.influence__tile:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.influence__tile:focus-visible {
  box-shadow: 0 0 0 2px #32c1df;
}

.influence__initial {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom right, #32c1df, #0c0d0c);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #ffffff;
}

.influence__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.influence__tile:hover .influence__img {
  transform: scale(1.05);
}

.influence__handle {
  pointer-events: none;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
  padding: 0.75rem 0.25rem 0.125rem;
  text-align: center;
  font-size: 9px;
  font-weight: 600;
  color: #ffffff;
  opacity: 0;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.influence__tile:hover .influence__handle,
.influence__tile:focus-visible .influence__handle {
  opacity: 1;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.influence-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .influence__heading {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }

  .influence__mosaic {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .influence__mosaic {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}
`;
