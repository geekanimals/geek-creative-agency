"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import FilterDropdown from "@/components/work/list/FilterDropdown";
import FilterSheet from "@/components/work/list/FilterSheet";
import WorkTile from "@/components/work/list/WorkTile";

/**
 * Filter bar + grid shared by /work and every filter page (/work/fmcg, /work/fmcg/lays).
 *
 * Props (all prepared on the server — see lib/work/routes.ts → workPathMenu):
 *  projects  the projects to show (already filtered)
 *  total     number of published projects across all work
 *  menu      the four filter groups: options with links, active value, clearHref
 *  chips     active filters [{ key, label, href }] — href removes that filter
 *  basePath  the current page; case-study links open under it ("/work/fmcg/<story>")
 */
export default function WorkExplorer({ projects, total, menu, chips = [], basePath = "/work" }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const count = projects.length;
  const active = chips.length > 0;

  return (
    <div>
      <style href="wx" precedence="default">
        {styles}
      </style>
      {/* ── Filter bar ── */}
      <div className="wx__bar">
        <div className="wx-container">
          {/* desktop */}
          <div className="wx__desktop">
            {menu.map((g) => (
              <FilterDropdown
                key={g.key}
                groupKey={g.key}
                label={g.label}
                items={g.items}
                activeSlug={g.active}
                clearHref={g.clearHref}
              />
            ))}
            {active && (
              <Link href="/work" className="wx__clear">
                Clear all
              </Link>
            )}
          </div>

          {/* mobile */}
          <div className="wx__mobile">
            <button type="button" onClick={() => setSheetOpen(true)} className="wx__sheet-trigger">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 4h12M4 8h8M6 12h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Filter Work
              {active && <span className="wx__badge">{chips.length}</span>}
            </button>
            <span className="wx__mobile-count">
              {active ? `${count} of ${total}` : `${total} Projects`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Active filter chip + count (desktop) ── */}
      <div className="wx-container wx__chips-wrap">
        <div className="wx__chips-row">
          {active && (
            <div className="wx__chips">
              {chips.map((c) => (
                <Link key={c.key} href={c.href} className="wx__chip">
                  {c.label}
                  <span className="wx__chip-x">×</span>
                </Link>
              ))}
            </div>
          )}
          <span className="wx__count">
            {active ? `Showing ${count} of ${total} Projects` : `${total} Projects`}
          </span>
        </div>
      </div>

      {/* ── Grid / empty state ── */}
      <div className="wx-container wx__results">
        {count === 0 ? (
          <div className="wx__empty">
            <p className="wx-display wx__empty-title">No work here yet.</p>
            <Link href="/work" className="wx__empty-reset">
              See all work →
            </Link>
          </div>
        ) : (
          <motion.div layout className="wx__grid">
            {/* initial={false}: tiles are visible straight from the server HTML — no
                waiting for JavaScript before the grid shows (fade-in only for tiles
                added later). */}
            <AnimatePresence mode="popLayout" initial={false}>
              {projects.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <WorkTile project={p} index={i} basePath={basePath} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <FilterSheet
        key={basePath}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        menu={menu}
        hasFilters={active}
      />
    </div>
  );
}

const styles = `
.wx__bar {
  border-top: 1px solid #eceeeb;
  border-bottom: 1px solid #eceeeb;
}

.wx__desktop {
  display: none;
  align-items: center;
  gap: 2rem;
  padding-block: 1.25rem;
}

.wx__clear {
  margin-left: auto;
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

.wx__clear:hover {
  color: #0c0d0c;
}

.wx__mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
}

.wx__sheet-trigger {
  margin-block: -0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #0c0d0c;
}

.wx__badge {
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

.wx__mobile-count {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #5a5f5c;
}

.wx__chips-wrap {
  padding-top: 1.5rem;
}

.wx__chips-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.5rem;
}

.wx__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.wx__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0c0d0c;
}

.wx__chip-x {
  color: #5a5f5c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.wx__chip:hover .wx__chip-x {
  color: #32c1df;
}

.wx__count {
  margin-left: auto;
  display: none;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #5a5f5c;
}

.wx__results {
  padding-block: 2rem;
}

.wx__empty {
  display: flex;
  min-height: 40vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.wx__empty-title {
  max-width: 18ch;
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.wx__empty-reset {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #137c93;
}

.wx__empty-reset:hover {
  color: #32c1df;
}

.wx__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.wx-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .wx-container {
    padding-inline: 20px;
  }
}

.wx-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .wx__empty-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .wx__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .wx__desktop {
    display: flex;
  }

  .wx__mobile {
    display: none;
  }

  .wx__count {
    display: block;
  }

  .wx__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
