"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Editorial desktop filter control — a text trigger + a clean panel of links.
 * Each option is a page whose URL keeps the current path (/work/fmcg → /work/fmcg/lays).
 * One value per filter: picking another value of the same filter replaces it, and
 * clicking the active value removes it (`clearHref`).
 */
export default function FilterDropdown({ groupKey, label, items, activeSlug, clearHref }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = Boolean(activeSlug);

  return (
    <div ref={ref} className="fdrop">
      <style href="fdrop" precedence="default">
        {styles}
      </style>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`fdrop__trigger ${isActive ? "fdrop__trigger--selected" : "fdrop__trigger--idle"}`}
      >
        {label}
        {isActive && <span className="fdrop__badge">1</span>}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`fdrop__chevron ${open ? "fdrop__chevron--open" : ""}`}
          aria-hidden
        >
          <path
            d="M2 3.5 5 6.5 8 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="fdrop__panel">
          <div className="fdrop__list">
            {items.map((it) => {
              const active = it.slug === activeSlug;
              return (
                <Link
                  key={it.slug}
                  href={active ? clearHref : it.href}
                  onClick={() => {
                    setOpen(false);
                    track("work_filter_used", {
                      group: groupKey,
                      value: it.slug,
                      action: active ? "remove" : "add",
                    });
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`fdrop__item ${active ? "fdrop__item--active" : ""}`}
                >
                  <span className={`fdrop__check ${active ? "fdrop__check--active" : ""}`}>
                    {active && <span className="fdrop__dot" />}
                  </span>
                  <span className="fdrop__label">{it.label}</span>
                  <span className="fdrop__count">{it.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
.fdrop {
  position: relative;
}

.fdrop__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.fdrop__trigger--selected {
  color: #137c93;
}

.fdrop__trigger--idle {
  color: #0c0d0c;
}

.fdrop__trigger--idle:hover {
  color: #32c1df;
}

.fdrop__badge {
  display: flex;
  height: 1rem;
  min-width: 1rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #32c1df;
  padding-inline: 0.25rem;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
}

.fdrop__chevron {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.fdrop__chevron--open {
  transform: rotate(180deg);
}

.fdrop__panel {
  position: absolute;
  left: 0px;
  top: 100%;
  z-index: 40;
  margin-top: 0.75rem;
  width: 17rem;
  border: 1px solid #eceeeb;
  background-color: #ffffff;
  padding: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.fdrop__item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.fdrop__item:hover {
  background-color: #f5f6f4;
}

.fdrop__item--active {
  color: #0c0d0c;
}

.fdrop__list {
  max-height: 55vh;
  overflow-y: auto;
}

.fdrop__check {
  display: flex;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9dcd8;
  border-radius: 9999px;
}

.fdrop__check--active {
  border-color: #32c1df;
}

.fdrop__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #32c1df;
}

.fdrop__label {
  flex: 1 1 0%;
}

.fdrop__count {
  font-size: 0.75rem;
  line-height: 1rem;
  font-variant-numeric: tabular-nums;
  color: #9aa09c;
}

.fdrop__item--active .fdrop__count {
  color: #137c93;
}

`;
