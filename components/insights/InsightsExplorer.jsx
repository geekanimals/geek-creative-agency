"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Media from "../ui/Media";
import { insightCategories, insightCategoryMap, isArticleDraft } from "@/lib/insights";

export default function InsightsExplorer({ articles }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  const setCategory = (slug) => {
    router.replace(slug ? `${pathname}?category=${slug}` : pathname, {
      scroll: false,
    });
  };

  const all = articles;
  const list = active ? all.filter((a) => a.category === active) : all;

  return (
    <div>
      <style href="insx" precedence="default">
        {styles}
      </style>
      {/* Category filter */}
      <div className="insx__bar">
        <div className="insx-no-scrollbar insx-container insx__cats">
          <button
            onClick={() => setCategory("")}
            className={`insx__cat ${active === "" ? "insx__cat--active" : ""}`}
          >
            All
          </button>
          {insightCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`insx__cat ${active === c.slug ? "insx__cat--active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="insx-container insx__list">
        {list.length === 0 ? (
          <div className="insx__empty">
            <p className="insx-display insx__empty-title">New thinking, coming soon.</p>
            <p className="insx__empty-text">We&apos;re writing. Check back shortly.</p>
          </div>
        ) : (
          <div className="insx__grid">
            {list.map((a, i) => (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="insx__card">
                <div className="insx__media">
                  <div className="insx__media-inner">
                    <Media
                      src={a.heroImage}
                      need={a.heroImageNeed}
                      label={a.title}
                      index={i}
                      showSlotLabel={false}
                    />
                  </div>
                  {isArticleDraft(a) && <span className="insx__draft">Draft · dev</span>}
                </div>
                <p className="insx__category">{insightCategoryMap[a.category]}</p>
                <h3 className="insx__title">{a.title}</h3>
                {a.dek && <p className="insx__dek">{a.dek}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = `
.insx__bar {
  border-top: 1px solid #eceeeb;
  border-bottom: 1px solid #eceeeb;
}

.insx__cats {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-block: 0.75rem;
}

.insx__cat {
  white-space: nowrap;
  padding-block: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #5a5f5c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.insx__cat:not(.insx__cat--active):hover {
  color: #0c0d0c;
}

.insx__cat--active {
  color: #137c93;
}

.insx__list {
  padding-block: 2.5rem;
}

.insx__empty {
  display: flex;
  min-height: 36vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.insx__empty-title {
  max-width: 20ch;
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.insx__empty-text {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.insx__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.insx__card {
  display: block;
}

.insx__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
}

.insx__media-inner {
  height: 100%;
  width: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.insx__card:hover .insx__media-inner {
  transform: scale(1.05);
}

.insx__draft {
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  border-radius: 9999px;
  background-color: #fbbf24;
  padding: 0.25rem 0.5rem;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #0c0d0c;
}

.insx__category {
  margin-top: 0.75rem;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #137c93;
}

.insx__title {
  margin-top: 0.25rem;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #0c0d0c;
}

.insx__card:hover .insx__title {
  color: #32c1df;
}

.insx__dek {
  margin-top: 0.25rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.insx-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .insx-container {
    padding-inline: 20px;
  }
}

.insx-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

.insx-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.insx-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .insx__empty-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .insx__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .insx__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
