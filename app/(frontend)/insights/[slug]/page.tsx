import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import Media from "@/components/ui/Media";
import { insightCategoryMap, isArticleDraft, isProd } from "@/lib/insights";
import { getInsightBySlug, getAllInsightSlugs } from "@/lib/cms/insights";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE, abs } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs(!isProd); // include drafts in dev only
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getInsightBySlug(slug);
  if (!a) return { title: "Insights — Geek" };
  const title = a.seoTitle || `${a.title} | Geek Insights`;
  const description = a.metaDescription || a.dek || "Geek Insights.";
  return {
    title,
    description,
    alternates: { canonical: `/insights/${a.slug}` },
    openGraph: {
      title,
      description,
      url: `/insights/${a.slug}`,
      type: "article",
      images: a.ogImage || a.heroImage ? [{ url: (a.ogImage || a.heroImage) as string }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
    ...(isProd ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const a = await getInsightBySlug(slug, { draft });
  // Never publish drafts: a static/dev draft 404s in production; a CMS draft is
  // only returned when draft (preview) mode is on, so anon never sees one.
  if (!a || (isArticleDraft(a) && isProd && !draft)) notFound();

  const published = !isArticleDraft(a);
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: a.title, path: `/insights/${a.slug}` },
        ])}
      />
      {/* Article schema only for genuine published articles */}
      {published && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.metaDescription || a.dek,
            image: a.ogImage || a.heroImage ? [abs((a.ogImage || a.heroImage) as string)] : undefined,
            datePublished: a.date,
            articleSection: insightCategoryMap[a.category],
            author: { "@type": "Organization", name: SITE.name },
            publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: abs("/geek-logo-cyan.png") } },
            mainEntityOfPage: abs(`/insights/${a.slug}`),
          }}
        />
      )}
      <Nav />
      <main id="main" className="pt-24 sm:pt-28">
        <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
          <Link href={`/insights?category=${a.category}`} className="text-xs font-bold uppercase tracking-[0.16em] text-geek-deep hover:text-geek-cyan">
            {insightCategoryMap[a.category]}
          </Link>
          <h1 className="h-display mt-4 text-[clamp(2rem,5vw,3.6rem)] uppercase text-ink">{a.title}</h1>
          {a.dek && <p className="mt-4 text-lg text-graphite">{a.dek}</p>}
          {a.readMins && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-graphite">{a.readMins} min read</p>}

          {isArticleDraft(a) && (
            <div className="mt-6 rounded-md border border-dashed border-amber-400/60 p-4 text-sm text-graphite">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-amber-500">
                {a.source === "cms" ? "Preview — draft (not public)" : "Draft — dev only"}
              </span>
              {a.source === "cms"
                ? "This is an unpublished draft shown via secure Preview."
                : "This is a development placeholder article. It is hidden in production until real copy is published."}
            </div>
          )}

          {(a.heroImage || a.heroImageNeed) && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-ink">
              <Media src={a.heroImage} need={a.heroImageNeed} label={a.title} showSlotLabel />
            </div>
          )}

          <div className="prose mt-10 max-w-none">
            {a.bodyRich ? (
              <RichText data={a.bodyRich} className="text-lg leading-relaxed text-ink/80 [&_h2]:h-display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_p]:mb-5 [&_a]:text-geek-deep [&_a]:underline [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-geek-cyan [&_blockquote]:pl-5 [&_blockquote]:text-ink" />
            ) : (
              a.body?.map((p, i) => (
                <p key={i} className="mb-5 text-lg leading-relaxed text-ink/80">{p}</p>
              ))
            )}
          </div>

          <Link href="/insights" className="mt-12 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:text-geek-cyan">
            ← All Insights
          </Link>
        </article>
      </main>
      <EndFooter />
    </>
  );
}
