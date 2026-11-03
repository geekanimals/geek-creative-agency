"use client";

import { useMemo, useState } from "react";

/**
 * Logo wall grid with category filter chips. Gets ready-to-render logos
 * (optimised src/srcSet built on the server in LogoWall.jsx).
 */
export default function LogoGrid({ logos, categories }) {
  const [active, setActive] = useState("all");

  const chips = useMemo(() => {
    const counts = logos.reduce((m, l) => ((m[l.category] = (m[l.category] || 0) + 1), m), {});
    const list = categories.filter((c) => counts[c.id]).map((c) => ({ ...c, count: counts[c.id] }));
    if (counts.more) list.push({ id: "more", label: "More", count: counts.more });
    return [{ id: "all", label: "All brands", count: logos.length }, ...list];
  }, [logos, categories]);

  const shown = active === "all" ? logos : logos.filter((l) => l.category === active);

  return (
    <>
      <div className="logos__filters" role="tablist" aria-label="Filter brands">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            className={`logos__chip ${active === c.id ? "is-active" : ""}`}
            onClick={() => setActive(c.id)}
          >
            {c.label}
            <span className="logos__chip-count">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="logos__frame">
      <ul className="logos__grid" key={active}>
        {shown.map((c, i) => (
          <li
            key={c.name}
            className={`logos__cell ${c.img ? "" : "logos__cell--text"}`}
            style={{ animationDelay: `${Math.min(i, 18) * 25}ms` }}
          >
            <div className="logos__mark">
              {c.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.img.src}
                  srcSet={c.img.srcSet}
                  sizes={c.img.sizes}
                  width={160}
                  height={80}
                  alt={`${c.name} logo`}
                  className="logos__img"
                  loading={i < 12 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <span className="logos__word">{c.name}</span>
              )}
            </div>
            {c.img && <span className="logos__name">{c.name}</span>}
          </li>
        ))}
      </ul>
      </div>
    </>
  );
}
