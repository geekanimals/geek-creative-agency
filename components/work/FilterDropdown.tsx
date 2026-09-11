"use client";

import { useEffect, useRef, useState } from "react";
import { TaxonomyItem } from "@/lib/work/taxonomy";

/** Editorial desktop filter control — a text trigger + a clean toggle panel. */
export default function FilterDropdown({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: TaxonomyItem[];
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] transition-colors ${
          selected.length ? "text-geek-deep" : "text-ink hover:text-geek-cyan"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-geek-cyan px-1 text-[10px] font-bold text-white">
            {selected.length}
          </span>
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-3 max-h-[60vh] w-64 overflow-y-auto border border-mist bg-white p-2 shadow-xl">
          {items.map((it) => {
            const active = selected.includes(it.slug);
            return (
              <button
                key={it.slug}
                onClick={() => onToggle(it.slug)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-paper ${
                  active ? "text-ink" : "text-graphite"
                }`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center border ${active ? "border-geek-cyan bg-geek-cyan" : "border-mist"}`}>
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 5l2 2 4-5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {it.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
