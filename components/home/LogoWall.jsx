import { HighlightedLines } from "@/components/content/HighlightedLines";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

import { getImageProps } from "next/image";
import LogoGrid from "@/components/home/LogoGrid";
import { LOGO_CATEGORIES } from "@/lib/data/clients";

// Our own files and CMS uploads go through next/image. Remote brand logos
// (Wikimedia, beardo.in) load straight from their CDN: Wikimedia answers a
// server's repeated fetches with HTTP 429, which broke tiles on the live site.
const OPTIMISABLE = /^\/|^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//;

/** Small, cached WebP copies via next/image, so logos load fast and from our own domain. */
function logoImg(src) {
  if (!src) return null;
  if (!OPTIMISABLE.test(src)) return { src };
  try {
    const { props } = getImageProps({ src, alt: "", width: 320, height: 160, sizes: "160px", quality: 80 });
    return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
  } catch {
    return { src };
  }
}

/**
 * "We've made a few friends along the way." — every client in one grid, with
 * category filters on top. `logos` comes from lib/site/friendLogos.ts (admin
 * clients + every brand with a published case study).
 */
export default function LogoWall({ content = HOME_FALLBACK.logoWall, logos = [] }) {
  const ready = logos.map((l) => ({
    name: l.name,
    category: l.category || "more",
    img: logoImg(l.logo),
  }));
  return (
    <section className="logos">
      <style href="logos" precedence="default">
        {styles}
      </style>
      <div className="logos-container">
        <p className="logos__heading">
          <HighlightedLines text={content.heading} highlight={content.headingHighlight} />
        </p>
        <LogoGrid logos={ready} categories={LOGO_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))} />
      </div>
    </section>
  );
}

const styles = `
.logos {
  border-top: 1px solid #eceeeb;
  background-color: #ffffff;
  padding-block: 3rem;
}

.logos__heading {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
}

/* Hairline grid: the 1px gaps show the border colour between tiles. */
.logos__frame {
  overflow: hidden;
  border: 1px solid #eceeeb;
  border-radius: 0.75rem;
  background-color: #ffffff;
}

/* Each tile draws its right + bottom hairline; the grid pokes 1px past the
   frame so the outer edge lines are clipped and only inner lines remain. */
.logos__grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 -1px -1px 0;
  padding: 0;
}

.logos__filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}

.logos__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid #e3e6e2;
  border-radius: 9999px;
  background: #ffffff;
  padding: 0.5rem 0.95rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #3a3f3c;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}

.logos__chip:hover { border-color: #32c1df; color: #0c0d0c; }

.logos__chip.is-active {
  border-color: #0c0d0c;
  background: #0c0d0c;
  color: #ffffff;
}

.logos__chip-count {
  min-width: 1.4rem;
  border-radius: 9999px;
  background: #f1f3f0;
  padding: 0.05rem 0.4rem;
  font-size: 0.7rem;
  color: #5a5f5c;
  text-align: center;
}

.logos__chip.is-active .logos__chip-count { background: #32c1df; color: #0c0d0c; }

@media (prefers-reduced-motion: reduce) {
  .logos__cell { animation: none; }
}

@keyframes logos-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

.logos__cell {
  border-right: 1px solid #eceeeb;
  border-bottom: 1px solid #eceeeb;
  animation: logos-in 380ms ease both;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  aspect-ratio: 3 / 2;
  background-color: #ffffff;
  padding: 1rem 0.75rem;
  transition: background-color 300ms ease;
}

.logos__cell:hover {
  background-color: #f6fbfc;
}

.logos__mark {
  display: flex;
  height: 3.25rem;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.logos__img {
  max-height: 100%;
  max-width: min(72%, 8.5rem);
  width: auto;
  height: auto;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: filter 300ms ease, opacity 300ms ease, transform 300ms ease;
}

.logos__cell:hover .logos__img {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.05);
}

.logos__name {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: #9a9f9c;
  transition: color 300ms ease;
}

.logos__cell:hover .logos__name {
  color: #0c0d0c;
}

.logos__word {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-align: center;
  color: rgba(90, 95, 92, 0.6);
  transition: color 300ms ease;
}

.logos__cell:hover .logos__word {
  color: #0c0d0c;
}

.logos-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .logos-container {
    padding-inline: 20px;
  }

  /* One swipeable row of chips on phones instead of four wrapped rows. */
  .logos__filters {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    margin-inline: -20px;
    padding: 0 20px 4px;
    scrollbar-width: none;
  }

  .logos__filters::-webkit-scrollbar { display: none; }

  .logos__chip { flex: none; }

  .logos__mark {
    height: 2.25rem;
  }

  .logos__word {
    font-size: 0.95rem;
  }
}

@media (min-width: 640px) {
  .logos {
    padding-block: 4rem;
  }

  .logos__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .logos__grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .logos__word {
    font-size: 1.375rem;
  }
}
`;
