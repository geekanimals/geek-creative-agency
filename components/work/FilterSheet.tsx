"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FilterKey, TaxonomyItem } from "@/lib/work/taxonomy";
import { Filters } from "@/lib/work/filters";

type Group = { key: FilterKey; label: string; items: TaxonomyItem[] };

export default function FilterSheet({
  open,
  onClose,
  groups,
  filters,
  onToggle,
  onClear,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  groups: Group[];
  filters: Filters;
  onToggle: (key: FilterKey, slug: string) => void;
  onClear: () => void;
  resultCount: number;
}) {
  const [expanded, setExpanded] = useState<FilterKey | null>("category");

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[110] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden />
          <motion.div
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-white"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-mist px-5 py-4">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Filter Work</span>
              <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-graphite">×</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {groups.map((g) => {
                const isOpen = expanded === g.key;
                const sel = filters[g.key];
                return (
                  <div key={g.key} className="border-b border-mist">
                    <button
                      onClick={() => setExpanded(isOpen ? null : g.key)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-sm font-semibold uppercase tracking-[0.1em] text-ink">
                        {g.label}
                        {sel.length > 0 && <span className="ml-2 text-geek-cyan">({sel.length})</span>}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 10 10" className={`transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden>
                        <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="flex flex-wrap gap-2 px-5 pb-5">
                        {g.items.map((it) => {
                          const active = sel.includes(it.slug);
                          return (
                            <button
                              key={it.slug}
                              onClick={() => onToggle(g.key, it.slug)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors ${
                                active ? "border-geek-cyan bg-geek-cyan text-white" : "border-mist text-graphite"
                              }`}
                            >
                              {it.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* sticky actions */}
            <div className="flex items-center gap-3 border-t border-mist p-4">
              <button onClick={onClear} className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
                Clear all
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-ink py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-geek-cyan"
              >
                Show {resultCount} {resultCount === 1 ? "Project" : "Projects"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
