"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { projects as staticProjects } from "@/lib/work/projects";
import type { CaseStudy } from "@/lib/work/types";
import {
  Filters,
  countActive,
  filterGroups,
  filterProjects,
  parseFilters,
  serializeFilters,
  brandLabelMap,
} from "@/lib/work/filters";
import { FilterKey, labelFor } from "@/lib/work/taxonomy";
import { track } from "@/lib/analytics";
import FilterDropdown from "./FilterDropdown";
import FilterSheet from "./FilterSheet";
import WorkTile from "./WorkTile";

/** `projects` defaults to the static registry so the grid still works if the
 *  server passes nothing (or CMS is unavailable and the page fell back). */
export default function WorkExplorer({ projects = staticProjects }: { projects?: CaseStudy[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const filters = parseFilters(searchParams);
  const groups = filterGroups(projects);
  const brandLabels = brandLabelMap(projects);

  const results = filterProjects(filters, projects);
  const total = projects.length;
  const active = countActive(filters);

  function apply(next: Filters) {
    const qs = serializeFilters(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggle(key: FilterKey, slug: string) {
    const cur = filters[key];
    const active = cur.includes(slug);
    const next: Filters = {
      ...filters,
      [key]: active ? cur.filter((s) => s !== slug) : [...cur, slug],
    };
    track("work_filter_used", { group: key, value: slug, action: active ? "remove" : "add" });
    apply(next);
  }

  function clearAll() {
    apply({ category: [], brand: [], service: [], campaign: [] });
  }

  // flat list of active chips
  const chips: { key: FilterKey; slug: string; label: string }[] = [];
  (Object.keys(filters) as FilterKey[]).forEach((key) =>
    filters[key].forEach((slug) => chips.push({ key, slug, label: labelFor(key, slug, brandLabels) }))
  );

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="border-y border-mist">
        <div className="mx-auto max-w-edge px-5 sm:px-8">
          {/* desktop */}
          <div className="hidden items-center gap-8 py-5 lg:flex">
            {groups.map((g) => (
              <FilterDropdown
                key={g.key}
                label={g.label}
                items={g.items}
                selected={filters[g.key]}
                onToggle={(slug) => toggle(g.key, slug)}
              />
            ))}
            {active > 0 && (
              <button
                onClick={clearAll}
                className="ml-auto text-sm font-semibold uppercase tracking-[0.1em] text-graphite transition-colors hover:text-ink"
              >
                Clear all
              </button>
            )}
          </div>

          {/* mobile */}
          <div className="flex items-center justify-between py-4 lg:hidden">
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Filter Work
              {active > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-geek-cyan px-1 text-[10px] font-bold text-white">{active}</span>
              )}
            </button>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
              {active ? `${results.length} of ${total}` : `${total} Projects`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Active chips + count (desktop) ── */}
      <div className="mx-auto max-w-edge px-5 pt-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={`${c.key}-${c.slug}`}
                  onClick={() => toggle(c.key, c.slug)}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink"
                >
                  {c.label}
                  <span className="text-graphite transition-colors group-hover:text-geek-cyan">×</span>
                </button>
              ))}
            </div>
          )}
          <span className="ml-auto hidden text-xs font-semibold uppercase tracking-[0.12em] text-graphite lg:block">
            {active ? `Showing ${results.length} of ${total} Projects` : `${total} Projects`}
          </span>
        </div>
      </div>

      {/* ── Grid / empty state ── */}
      <div className="mx-auto max-w-edge px-5 py-8 sm:px-8">
        {results.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <p className="h-display max-w-[18ch] text-2xl uppercase text-ink sm:text-3xl">
              No work matches that combination yet.
            </p>
            <button onClick={clearAll} className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-geek-deep hover:text-geek-cyan">
              Try removing a filter →
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <WorkTile project={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        groups={groups}
        filters={filters}
        onToggle={toggle}
        onClear={clearAll}
        resultCount={results.length}
      />
    </div>
  );
}
