import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Media from "@/components/ui/Media";
import { insightCategoryMap, isArticleDraft, isProd } from "@/lib/insights";
import { getInsightBySlug, getAllInsightSlugs } from "@/lib/cms/insights";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE, abs } from "@/lib/site";
import { ogFallback } from "@/lib/seo/ogImage";
import { seoDescription } from "@/lib/seo/description";

export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs(!isProd); // include drafts in dev only
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getInsightBySlug(slug);
  if (!a) return { title: "Insights — Geek" };
  const title = a.seoTitle || `${a.title} | Geek Insights`;
  const description = seoDescription(
    a.metaDescription || a.dek || "Geek Insights.",
    "Insights from Geek Creative Agency.",
  );
  return {
    title,
    description,
    alternates: { canonical: `/insights/${a.slug}` },
    openGraph: {
      title,
      description,
      url: `/insights/${a.slug}`,
      type: "article",
      images:
        a.ogImage || a.heroImage
          ? [{ url: a.ogImage || a.heroImage }]
          : ogFallback(title, "Geek Insights"),
    },
    twitter: { card: "summary_large_image", title, description },
    ...(isProd ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const a = await getInsightBySlug(slug, { draft });
  // Never publish drafts: a static/dev draft 404s in production; a CMS draft is
  // only returned when draft (preview) mode is on, so anon never sees one.
  if (!a || (isArticleDraft(a) && isProd && !draft)) notFound();

  const published = !isArticleDraft(a);
  return (
    <>
      <style href="ins-detail" precedence="default">
        {styles}
      </style>
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
            image: a.ogImage || a.heroImage ? [abs(a.ogImage || a.heroImage)] : undefined,
            datePublished: a.date,
            articleSection: insightCategoryMap[a.category],
            author: { "@type": "Organization", name: SITE.name },
            publisher: {
              "@type": "Organization",
              name: SITE.name,
              logo: { "@type": "ImageObject", url: abs("/geek-logo-cyan.png") },
            },
            mainEntityOfPage: abs(`/insights/${a.slug}`),
          }}
        />
      )}
      <main id="main" className="ins-detail">
        <article className="ins-detail__article">
          <Link href={`/insights?category=${a.category}`} className="ins-detail__category">
            {insightCategoryMap[a.category]}
          </Link>
          <h1 className="ins-detail-display ins-detail__title">{a.title}</h1>
          {a.dek && <p className="ins-detail__dek">{a.dek}</p>}
          {a.readMins && <p className="ins-detail__read">{a.readMins} min read</p>}

          {isArticleDraft(a) && (
            <div className="ins-detail__draft">
              <span className="ins-detail__draft-label">
                {a.source === "cms" ? "Preview — draft (not public)" : "Draft — dev only"}
              </span>
              {a.source === "cms"
                ? "This is an unpublished draft shown via secure Preview."
                : "This is a development placeholder article. It is hidden in production until real copy is published."}
            </div>
          )}

          {(a.heroImage || a.heroImageNeed) && (
            <div className="ins-detail__hero">
              <Media src={a.heroImage} need={a.heroImageNeed} label={a.title} showSlotLabel />
            </div>
          )}

          <div className="ins-detail__body">
            {a.bodyRich ? (
              <RichText data={a.bodyRich} className="ins-detail__rich" />
            ) : (
              a.body?.map((p, i) => (
                <p key={i} className="ins-detail__para">
                  {p}
                </p>
              ))
            )}
          </div>

          <Link href="/insights" className="ins-detail__back">
            ← All Insights
          </Link>
        </article>
      </main>
    </>
  );
}

const styles = `
.ins-detail {
  padding-top: 6rem;
}

.ins-detail__article {
  margin-inline: auto;
  max-width: 48rem;
  padding: 2.5rem 1.25rem;
}

.ins-detail__category {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #137c93;
}

.ins-detail__category:hover {
  color: #32c1df;
}

.ins-detail__title {
  margin-top: 1rem;
  font-size: clamp(2rem, 5vw, 3.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.ins-detail__dek {
  margin-top: 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #5a5f5c;
}

.ins-detail__read {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #5a5f5c;
}

.ins-detail__draft {
  margin-top: 1.5rem;
  border: 1px dashed rgba(251, 191, 36, 0.6);
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

.ins-detail__draft-label {
  margin-bottom: 0.25rem;
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #f59e0b;
}

.ins-detail__hero {
  position: relative;
  margin-top: 2rem;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: #0c0d0c;
}

.ins-detail__body {
  margin-top: 2.5rem;
  max-width: none;
}

.ins-detail__rich,
.ins-detail__para {
  font-size: 1.125rem;
  line-height: 1.625;
  color: rgba(12, 13, 12, 0.8);
}

.ins-detail__para {
  margin-bottom: 1.25rem;
}

/* Rich-text descendants. (The original also listed [&_h2]:h-display, but
   Tailwind never generated it since h-display is not a Tailwind utility, so
   it had no effect and is intentionally not ported.) */
.ins-detail__rich h2 {
  margin-top: 2rem;
  font-size: 1.5rem;
  line-height: 2rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

.ins-detail__rich h3 {
  margin-top: 1.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #0c0d0c;
}

.ins-detail__rich p {
  margin-bottom: 1.25rem;
}

.ins-detail__rich a {
  color: #137c93;
  text-decoration-line: underline;
}

.ins-detail__rich ul {
  margin-bottom: 1.25rem;
  list-style-type: disc;
  padding-left: 1.5rem;
}

.ins-detail__rich ol {
  margin-bottom: 1.25rem;
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.ins-detail__rich blockquote {
  margin-block: 1.5rem;
  border-left: 2px solid #32c1df;
  padding-left: 1.25rem;
  color: #0c0d0c;
}

.ins-detail__back {
  margin-top: 3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #0c0d0c;
}

.ins-detail__back:hover {
  color: #32c1df;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.ins-detail-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .ins-detail {
    padding-top: 7rem;
  }

  .ins-detail__article {
    padding: 3.5rem 2rem;
  }
}
`;
