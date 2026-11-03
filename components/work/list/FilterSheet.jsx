"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Mobile filter sheet. Every option is a link that keeps the current path
 * (/work/fmcg → /work/fmcg/ugc); one value per filter.
 */
export default function FilterSheet({ open, onClose, menu, hasFilters }) {
  const [expanded, setExpanded] = useState(menu.find((g) => g.active)?.key ?? "category");

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <style href="fsheet" precedence="default">
        {styles}
      </style>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fsheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fsheet__backdrop" onClick={onClose} aria-hidden />
            <motion.div
              className="fsheet__panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="fsheet__head">
                <span className="fsheet__title">Filter Work</span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="fsheet__close"
                >
                  ×
                </button>
              </div>

              <div className="fsheet__body">
                {menu.map((g) => {
                  const isOpen = expanded === g.key;
                  const groupActive = Boolean(g.active);
                  return (
                    <div key={g.key} className="fsheet__group">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : g.key)}
                        aria-expanded={isOpen}
                        className="fsheet__group-toggle"
                      >
                        <span className="fsheet__group-label">
                          {g.label}
                          {groupActive && <span className="fsheet__group-count">(1)</span>}
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 10 10"
                          className={`fsheet__chevron ${isOpen ? "fsheet__chevron--open" : ""}`}
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
                      {isOpen && (
                        <div className="fsheet__options">
                          {g.items.map((it) => {
                            const on = g.active === it.slug;
                            return (
                              <Link
                                key={it.slug}
                                href={on ? g.clearHref : it.href}
                                onClick={() => {
                                  onClose();
                                  track("work_filter_used", {
                                    group: g.key,
                                    value: it.slug,
                                    action: on ? "remove" : "add",
                                  });
                                }}
                                aria-current={on ? "page" : undefined}
                                className={`fsheet__option ${on ? "fsheet__option--active" : ""}`}
                              >
                                {it.label}
                                <span className="fsheet__option-count">{it.count}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* sticky actions */}
              <div className="fsheet__actions">
                {hasFilters && (
                  <Link href="/work" onClick={onClose} className="fsheet__clear">
                    Clear
                  </Link>
                )}
                <button type="button" onClick={onClose} className="fsheet__show">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const styles = `
.fsheet {
  position: fixed;
  inset: 0px;
  z-index: 110;
}

.fsheet__backdrop {
  position: absolute;
  inset: 0px;
  background-color: rgba(12, 13, 12, 0.5);
}

.fsheet__panel {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  max-height: 88vh;
  flex-direction: column;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  background-color: #ffffff;
}

.fsheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eceeeb;
  padding: 1rem 1.25rem;
}

.fsheet__title {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #0c0d0c;
}

.fsheet__close {
  font-size: 1.5rem;
  line-height: 1;
  color: #5a5f5c;
}

.fsheet__body {
  flex: 1 1 0%;
  overflow-y: auto;
}

.fsheet__group {
  border-bottom: 1px solid #eceeeb;
}

.fsheet__group-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  text-align: left;
}

.fsheet__group-label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #0c0d0c;
}

.fsheet__group-count {
  margin-left: 0.5rem;
  color: #32c1df;
}

.fsheet__chevron {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.fsheet__chevron--open {
  transform: rotate(180deg);
}

.fsheet__options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-inline: 1.25rem;
  padding-bottom: 1.25rem;
}

.fsheet__option {
  border: 1px solid #eceeeb;
  border-radius: 9999px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #5a5f5c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.fsheet__option--active {
  border-color: #32c1df;
  background-color: #32c1df;
  color: #ffffff;
}

.fsheet__option {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.fsheet__option-count {
  font-size: 10px;
  opacity: 0.6;
}

.fsheet__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-top: 1px solid #eceeeb;
  padding: 1rem;
}

.fsheet__clear {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #5a5f5c;
}

.fsheet__show {
  flex: 1 1 0%;
  background-color: #0c0d0c;
  padding-block: 0.875rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #ffffff;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.fsheet__show:hover {
  background-color: #32c1df;
}

@media (min-width: 1024px) {
  .fsheet {
    display: none;
  }
}
`;
