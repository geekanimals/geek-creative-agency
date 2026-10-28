"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Band from "./ui/Band";
import Media from "./ui/Media";
import { HOME_FALLBACK, type HomePageModel } from "@/lib/site/homeFallback";
import type { GeekCreator } from "@/lib/geekos/creators";

const COLS = 12;
const ROWS = 4;
const COUNT = COLS * ROWS; // 48 tiles — always the 48 latest creators

/** One creator tile: Instagram profile picture → opens their Instagram. */
function CreatorTile({ creator }: { creator: GeekCreator }) {
  const [broken, setBroken] = useState(false);
  return (
    <a
      href={`https://www.instagram.com/${encodeURIComponent(creator.username)}/`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`@${creator.username} on Instagram`}
      title={`@${creator.username}`}
      className="group absolute inset-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-geek-cyan"
    >
      {/* Loaded straight from Instagram's CDN by the browser (no-referrer), exactly
          like Geek OS does — Instagram blocks server-side fetching of these. */}
      {broken ? (
        // Picture failed to load (expired / blocked): keep the tile clickable and
        // show the creator's initial instead of an empty dark box.
        <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-geek-cyan to-ink text-2xl font-semibold uppercase text-white">
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
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        onError={() => setBroken(true)}
      />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/75 to-transparent px-1 pb-0.5 pt-3 text-center text-[9px] font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
        @{creator.username}
      </span>
    </a>
  );
}

/**
 * Creator mosaic. Tiles are filled with live Instagram-connected creators from
 * Geek Influencer OS (profile picture → their Instagram). When fewer creators
 * are available (or Geek OS isn't configured) the remaining cells stay as the
 * on-brand placeholder tiles, so the layout never changes.
 */
export default function Influence({
  content = HOME_FALLBACK.influence,
  creators = [],
}: {
  content?: HomePageModel["influence"];
  creators?: GeekCreator[];
}) {
  const reduce = useReducedMotion();
  return (
    <Band
      id="for-creators"
      label={
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-geek-cyan">{content.eyebrow}</p>
          <p className="h-display mt-2 text-3xl text-ink sm:text-4xl">{content.heading}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-graphite">{content.sub}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-graphite">
            {content.list}
          </p>
          <a href={content.linkHref} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:text-geek-cyan">
            {content.linkLabel} <span aria-hidden>→</span>
          </a>
        </div>
      }
    >
      <div
        className="grid grid-cols-6 gap-1 overflow-hidden rounded-lg sm:grid-cols-8 lg:grid-cols-12"
        data-mosaic="creators"
      >
        {Array.from({ length: COUNT }).map((_, i) => {
          const creator = creators[i];
          return (
            <motion.div
              key={creator ? creator.username : `slot-${i}`}
              data-creator-index={i}
              className="relative aspect-square overflow-hidden"
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.45, delay: reduce ? 0 : ((i % COLS) + Math.floor(i / COLS)) * 0.02, ease: [0.16, 1, 0.3, 1] }}
            >
              {creator ? (
                <CreatorTile creator={creator} />
              ) : (
                <>
                  <Media need={`/assets/work/creators/${i + 1}.jpg`} label={`Creator ${i + 1}`} index={i} showSlotLabel={false} />
                  {i % 11 === 5 && <div className="absolute inset-0 bg-geek-cyan/85" />}
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </Band>
  );
}
