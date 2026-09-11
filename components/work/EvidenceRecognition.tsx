import type { PressItem, AwardItem } from "@/lib/cms/projects";

/**
 * EVIDENCE & RECOGNITION (Phase 11.26) — a tasteful, optional section for
 * standard/flexible Project pages. Renders ONLY the subsections that have data,
 * and nothing at all when there is none. Flagship pages never mount this.
 *
 * Honesty rules (Section 12):
 *   • Independent media and Official/Partner sources are shown in SEPARATE
 *     groups — official/brand/partner coverage is never presented as independent.
 *   • A "Geek featured" marker appears ONLY when geekMentioned is true; coverage
 *     that merely validates the campaign is never dressed up as a Geek mention.
 *   • Citations are ORDINARY EDITORIAL LINKS: crawlable, opened in a new tab with
 *     rel="noopener". We deliberately do NOT blanket-add `nofollow`/`noreferrer` —
 *     these are genuine references (independent media, official/partner sources,
 *     award & campaign archives), not paid placements, and belong in the normal
 *     web citation graph (the destination publisher also gets normal referrer
 *     info). A genuinely paid/sponsored/affiliate link would instead carry
 *     rel="sponsored" and/or rel="nofollow" — none exist in this editorial
 *     section today, so no such qualification is applied.
 */

const SOURCE_LABEL: Record<PressItem["sourceType"], string> = {
  "independent-editorial": "Independent editorial",
  "trade-publication": "Trade publication",
  "official-brand": "Official brand source",
  "partner-ngo": "Partner / NGO",
  "campaign-archive": "Campaign archive",
  other: "Source",
};

/** Independent media vs. official/partner sources — drives the two groups. */
const isIndependent = (t: PressItem["sourceType"]) => t === "independent-editorial" || t === "trade-publication";

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// Ordinary editorial citation link: new tab, safe, and CRAWLABLE (no nofollow/
// noreferrer). See the policy note in the file header.
const EXTERNAL = { target: "_blank", rel: "noopener" } as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">{children}</p>;
}

function PressCard({ item }: { item: PressItem }) {
  const date = formatDate(item.publicationDate);
  return (
    <article className="flex flex-col rounded-lg border border-mist bg-white p-5 transition-colors hover:border-geek-cyan">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-sm font-bold uppercase tracking-[0.1em] text-geek-deep">{item.publisher}</span>
        {date && <span className="text-[11px] text-graphite">{date}</span>}
        {item.geekMentioned && (
          <span className="rounded-full bg-geek-cyan/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-geek-deep">
            Geek featured
          </span>
        )}
      </div>
      <h4 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">{item.headline}</h4>
      {item.validationNote && <p className="mt-2 text-sm leading-relaxed text-graphite">{item.validationNote}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
        <a href={item.url} {...EXTERNAL} className="text-sm font-semibold uppercase tracking-[0.1em] text-geek-deep hover:text-geek-cyan">
          Read story →
        </a>
        {item.archiveUrl && (
          <a href={item.archiveUrl} {...EXTERNAL} className="text-[11px] uppercase tracking-[0.1em] text-graphite hover:text-geek-deep">
            Archived
          </a>
        )}
      </div>
    </article>
  );
}

function PressGroup({ label, items }: { label: string; items: PressItem[] }) {
  if (items.length === 0) return null;
  // Featured first, otherwise preserve editor order.
  const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured));
  return (
    <div className="mt-10 first:mt-0">
      <SectionLabel>{label}</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((item, i) => (
          <PressCard key={`${item.url}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function AwardCard({ item }: { item: AwardItem }) {
  const credited = item.creditedOrganizations.length > 0 ? item.creditedOrganizations.join(", ") : undefined;
  return (
    <article className="rounded-lg border border-mist bg-paper p-5">
      <div className="flex flex-wrap items-baseline gap-x-3">
        {item.result && <span className="font-display text-lg font-bold text-geek-deep">{item.result}</span>}
        <span className="text-sm font-bold uppercase tracking-[0.1em] text-ink">{item.programName || item.awardBody}</span>
        {item.year != null && <span className="text-[11px] text-graphite">{item.year}</span>}
      </div>
      {item.category && <p className="mt-1 text-sm text-graphite">{item.category}</p>}
      {item.validationNote && <p className="mt-2 text-sm leading-relaxed text-graphite">{item.validationNote}</p>}
      <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-graphite/80">
        {item.geekCredited ? "Geek credited" : credited ? `Credited: ${credited}` : "Campaign recognition"}
      </p>
      {item.url && (
        <a href={item.url} {...EXTERNAL} className="mt-3 inline-block text-sm font-semibold uppercase tracking-[0.1em] text-geek-deep hover:text-geek-cyan">
          View source →
        </a>
      )}
    </article>
  );
}

export default function EvidenceRecognition({ press = [], awards = [] }: { press?: PressItem[]; awards?: AwardItem[] }) {
  const independent = press.filter((p) => isIndependent(p.sourceType));
  const official = press.filter((p) => !isIndependent(p.sourceType));
  if (press.length === 0 && awards.length === 0) return null;

  return (
    <section className="border-t border-mist">
      <div className="mx-auto max-w-edge px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="h-display mb-10 text-[clamp(1.6rem,3.5vw,2.8rem)] uppercase text-ink">Evidence &amp; Recognition</h2>
        <PressGroup label="Press & Independent Coverage" items={independent} />
        <PressGroup label="Official & Partner Sources" items={official} />
        {awards.length > 0 && (
          <div className="mt-10">
            <SectionLabel>Awards &amp; Recognition</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {awards.map((a, i) => (
                <AwardCard key={`${a.awardBody}-${i}`} item={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
