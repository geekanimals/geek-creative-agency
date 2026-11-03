"use client";

import { useEffect, useRef, useState } from "react";
import Band, { BandLabel } from "@/components/ui/Band";
import Media from "@/components/ui/Media";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

const PAGE = 6; // cards added per "& more"

/**
 * "The Work." slider. Starts with the curated cards (admin: Home Page → The Work); "& more"
 * — or simply sliding to the end — loads the next published case studies from
 * the admin (`more`, passed by the homepage). When everything is shown the last
 * tile links to /work. Every card opens its case study.
 */
export default function WorkWall({ content = HOME_FALLBACK.work, more = [] }) {
  const railRef = useRef(null);
  const [count, setCount] = useState(0);
  const extra = more.slice(0, count);
  const hasMore = count < more.length;
  const cards = [...content.cards, ...extra];

  function loadMore() {
    if (!hasMore) return;
    setCount((c) => Math.min(c + PAGE, more.length));
  }

  // Sliding to the end of the rail loads the next batch automatically.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !hasMore) return;
    const onScroll = () => {
      if (rail.scrollLeft > 0 && rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 48) {
        setCount((c) => Math.min(c + PAGE, more.length));
      }
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, [hasMore, more.length]);

  function onMoreClick() {
    loadMore();
    // nudge the rail so the new cards slide into view
    requestAnimationFrame(() =>
      railRef.current?.scrollBy({ left: railRef.current.clientWidth * 0.8, behavior: "smooth" }),
    );
  }

  return (
    <Band label={<BandLabel title={content.title} sub={content.sub} href="/work" />}>
      <style href="wwall" precedence="default">
        {styles}
      </style>
      <div ref={railRef} className="wwall-no-scrollbar wwall__rail">
        {cards.map((w, i) => (
          <a key={w.key} href={w.href} className="wwall__card">
            <div className="wwall__frame">
              <div className="wwall__media">
                <Media src={w.src} label={w.brand} index={i} showSlotLabel={false} sizes="160px" />
              </div>
              {/* hover reveal — brand / project / view story */}
              <div className="wwall__reveal">
                <p className="wwall__brand">{w.brand}</p>
                <p className="wwall__project">{w.project}</p>
                <span className="wwall__view">View Story →</span>
              </div>
            </div>
            <p className="wwall__name">{w.brand}</p>
          </a>
        ))}
        {hasMore ? (
          <button
            type="button"
            onClick={onMoreClick}
            className="wwall__more"
            aria-label="Load more work"
          >
            <span className="wwall__more-label">&amp; more</span>
          </button>
        ) : (
          <a href="/work" className="wwall__more">
            <span className="wwall__more-label">{more.length ? "See all work →" : "& more"}</span>
          </a>
        )}
      </div>
    </Band>
  );
}

const styles = `
.wwall__rail {
  margin-right: -1.25rem;
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-right: 1.25rem;
}

.wwall__card {
  width: 9rem;
  flex-shrink: 0;
}

.wwall__frame {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 0.5rem;
}

.wwall__media {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.wwall__card:hover .wwall__media {
  transform: scale(1.06);
}

.wwall__reveal {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: rgba(12, 13, 12, 0);
  padding: 0.75rem;
  opacity: 0;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.wwall__card:hover .wwall__reveal {
  background-color: rgba(12, 13, 12, 0.65);
  opacity: 1;
}

.wwall__brand {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #63d0ea;
}

.wwall__project {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.wwall__view {
  margin-top: 0.25rem;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
}

.wwall__name {
  margin-top: 0.5rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.wwall__more {
  display: flex;
  width: 4rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  aspect-ratio: auto;
  text-align: center;
  cursor: pointer;
}

.wwall__more:hover .wwall__more-label {
  color: #137c93;
}

.wwall__more-label {
  transition-property: color;
  transition-duration: 150ms;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #32c1df;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.wwall-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.wwall-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .wwall__rail {
    margin-right: -2rem;
    padding-right: 2rem;
  }

  .wwall__card {
    width: 10rem;
  }
}
`;
