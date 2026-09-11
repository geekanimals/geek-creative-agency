"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Media from "../ui/Media";
import { insightCategories, insightCategoryMap, isArticleDraft, type Article } from "@/lib/insights";

export default function InsightsExplorer({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  const setCategory = (slug: string) => {
    router.replace(slug ? `${pathname}?category=${slug}` : pathname, { scroll: false });
  };

  const all = articles;
  const list = active ? all.filter((a) => a.category === active) : all;

  return (
    <div>
      {/* Category filter */}
      <div className="border-y border-mist">
        <div className="no-scrollbar mx-auto flex max-w-edge gap-6 overflow-x-auto px-5 py-5 sm:px-8">
          <button
            onClick={() => setCategory("")}
            className={`whitespace-nowrap text-sm font-semibold uppercase tracking-[0.1em] transition-colors ${active === "" ? "text-geek-deep" : "text-graphite hover:text-ink"}`}
          >
            All
          </button>
          {insightCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`whitespace-nowrap text-sm font-semibold uppercase tracking-[0.1em] transition-colors ${active === c.slug ? "text-geek-deep" : "text-graphite hover:text-ink"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mx-auto max-w-edge px-5 py-10 sm:px-8">
        {list.length === 0 ? (
          <div className="flex min-h-[36vh] flex-col items-center justify-center text-center">
            <p className="h-display max-w-[20ch] text-2xl uppercase text-ink sm:text-3xl">New thinking, coming soon.</p>
            <p className="mt-3 text-sm text-graphite">We&apos;re writing. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]">
                    <Media src={a.heroImage} need={a.heroImageNeed} label={a.title} index={i} showSlotLabel={false} />
                  </div>
                  {isArticleDraft(a) && (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-ink">Draft · dev</span>
                  )}
                </div>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-geek-deep">{insightCategoryMap[a.category]}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink group-hover:text-geek-cyan">{a.title}</h3>
                {a.dek && <p className="mt-1 line-clamp-2 text-sm text-graphite">{a.dek}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
