/**
 * Insights editorial architecture. NO fake published articles: sample entries
 * are `draft: true` and appear only in development. `publishedArticles()` (used
 * in production) returns real, non-draft pieces only.
 */
export type InsightCategory = { slug: string; label: string };

export const insightCategories: InsightCategory[] = [
  { slug: "geek-decoded", label: "Geek Decoded" },
  { slug: "creator-economy", label: "Creator Economy" },
  { slug: "brand-building", label: "Brand Building" },
  { slug: "social-culture", label: "Social & Culture" },
  { slug: "whats-next", label: "What's Next" },
  { slug: "case-study-learnings", label: "Case Study Learnings" },
];

export const insightCategoryMap = Object.fromEntries(insightCategories.map((c) => [c.slug, c.label]));

export type Article = {
  slug: string;
  title: string;
  category: string; // category slug
  dek?: string; // standfirst
  date?: string; // ISO
  readMins?: number;
  heroImage?: string;
  heroImageNeed?: string;
  ogImage?: string;
  seoTitle?: string;
  metaDescription?: string;
  body?: string[]; // paragraphs
  /** Publishing gate — only "published" articles go public/indexed/in-sitemap. */
  publishStatus?: "draft" | "published";
};

export const isArticleDraft = (a: Article): boolean => a.publishStatus !== "published";

/**
 * DEV-ONLY placeholders so the listing + template can be reviewed. Every entry
 * is `draft: true` and is hidden in production. Replace with real pieces (and
 * drop `draft`) to publish.
 */
export const articles: Article[] = insightCategories.map((c, i) => ({
  slug: `sample-${c.slug}`,
  title: `Sample story — ${c.label}`,
  category: c.slug,
  dek: "Development placeholder. Real editorial copy to be written — no article is published yet.",
  heroImageNeed: `/assets/insights/${c.slug}/hero.jpg`,
  readMins: 4 + (i % 3),
  body: [
    "Placeholder body — this article has not been written yet.",
    "The Insights template supports a standfirst, hero image, headings and body copy, plus SEO title, meta description and a social share image.",
  ],
  publishStatus: "draft",
}));

export const isProd = process.env.NODE_ENV === "production";

/** Real, published articles only (used in production, sitemap, nav gating). */
export const publishedArticles = (): Article[] => articles.filter((a) => a.publishStatus === "published");

/** What the UI shows: everything in dev, only published in prod. */
export const visibleArticles = (): Article[] => (isProd ? publishedArticles() : articles);

export const articleBySlug = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);

/** Insights returns to the primary nav once at least this many are published. */
export const INSIGHTS_NAV_MIN = 3;
export const showInsightsInNav = (): boolean => publishedArticles().length >= INSIGHTS_NAV_MIN;
