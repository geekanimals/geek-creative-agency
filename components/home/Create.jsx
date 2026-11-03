"use client";

import Link from "next/link";
import Band, { BandLabel } from "@/components/ui/Band";
import Media from "@/components/ui/Media";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

export default function Create({ content = HOME_FALLBACK.create }) {
  return (
    <Band
      label={
        <div>
          <BandLabel
            title={<span className="create__title-accent">{content.title}</span>}
            sub={<HighlightedLines text={content.sub} />}
          />
          {/* Opens /create — how Geek runs campaigns (admin: Pages → Create Page) */}
          <Link href="/create" className="create__button">
            <span>{content.buttonLabel || "See how we run campaigns"}</span>
            <span className="create__button-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      }
    >
      <style href="create" precedence="default">
        {styles}
      </style>
      <div className="create-no-scrollbar create__rail">
        {content.cards.map((w, i) => (
          <Link key={w.key} href={w.href} className="create__card">
            <div className="create__media">
              <Media src={w.src} label={w.brand} index={i} sizes="200px" />
            </div>
            {w.src && (
              <div className="create__caption">
                <p className="create__brand">{w.brand}</p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </Band>
  );
}

const styles = `
.create__button {
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

.create__button:hover {
  color: #32c1df;
  gap: 0.9rem;
}

.create__button-arrow {
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

.create__button:hover .create__button-arrow {
  transform: translateX(2px);
}

.create__title-accent {
  color: #32c1df;
}

.create__rail {
  margin-right: -1.25rem;
  display: flex;
  scroll-snap-type: x proximity;
  gap: 0.75rem;
  overflow-x: auto;
  padding-right: 1.25rem;
}

.create__card {
  position: relative;
  aspect-ratio: 4 / 5;
  width: 10rem;
  flex-shrink: 0;
  scroll-snap-align: start;
  overflow: hidden;
  border-radius: 0.5rem;
}

.create__media {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.create__card:hover .create__media {
  transform: scale(1.06);
}

.create__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(to top, rgba(12, 13, 12, 0.75), transparent);
  padding: 0.75rem;
}

.create__brand {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.create-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.create-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .create__rail {
    margin-right: -2rem;
    padding-right: 2rem;
  }

  .create__card {
    width: 12rem;
  }
}
`;
