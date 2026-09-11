/**
 * Case-study data model. One shape drives every project — no per-project
 * layouts. Media uses the same {src?/need?} contract as the homepage <Media>:
 * `src` renders the real asset, `need` documents the file still required.
 */

export type MediaRef = {
  src?: string;
  need?: string;
  alt: string;
  video?: string; // optional mp4 path (desktop)
  videoMobile?: string; // optional lighter/portrait mp4 for small screens
  ratio?: string; // e.g. "16/9", "4/5", "1/1"
  /** true → object-contain on a light mat (never crops archival text/UI). */
  contain?: boolean;
};

/** A single figure — stored as a string so nothing is ever inferred/rounded. */
export type Stat = { value: string; label: string };

/** Visual tone for editorial blocks. "miller" = authentic Miller heritage
 *  palette (black / cream / gold / red) used only for archival/heritage moments. */
export type BlockTone = "light" | "paper" | "dark" | "navy" | "miller";

/**
 * Flexible editorial + layout blocks (the case-study canvas). Media blocks show
 * real assets or labelled slots; typographic blocks carry the story so it reads
 * on headline-scan alone.
 */
export type ContentBlock =
  // media
  | { type: "full-image"; media: MediaRef; label?: string; caption?: string }
  | { type: "full-video"; media: MediaRef; label?: string; caption?: string }
  | { type: "two-column"; media: [MediaRef, MediaRef]; caption?: string }
  | { type: "image-copy"; media: MediaRef; copy: string; side?: "left" | "right" }
  | { type: "gallery-h"; media: MediaRef[]; label?: string }
  | { type: "gallery-v"; media: MediaRef[]; label?: string }
  | { type: "creator-mosaic"; media: MediaRef[] }
  | { type: "social-grid"; media: MediaRef[]; label?: string }
  // editorial / typographic
  | { type: "statement"; text: string; accent?: string; sub?: string; tone?: BlockTone; size?: "big" | "giant" | "mega" }
  | { type: "vs"; left: { big: string; small?: string }; right: { big: string; small?: string }; note?: string; tone?: BlockTone }
  | { type: "stat-band"; heading?: string; note?: string; tone?: BlockTone; stats: { value: string; label: string; note?: string }[] }
  | { type: "steps"; heading?: string; items: string[]; tone?: BlockTone }
  | { type: "funnel"; items: string[]; note?: string; tone?: BlockTone }
  | { type: "award"; medal: string; org: string; year: string; category: string; project?: string; note?: string };

export type CaseStudy = {
  slug: string;
  brand: string;
  brandSlug: string;
  project: string;
  year?: number;

  // taxonomy (arrays of slugs — see lib/work/taxonomy.ts)
  businessCategory: string[];
  services: string[];
  campaignTypes: string[];
  /** internal objective/results structuring — NOT a public filter yet. */
  businessOutcomes?: string[];

  // hero media
  heroImage?: string;
  heroImageNeed?: string;
  heroVideo?: string;
  heroVideoMobile?: string; // lighter/portrait hero cut for small screens

  headline: string;
  oneLineSummary: string;

  // story (all optional — the template omits empty sections)
  challenge?: { question: string; copy?: string };
  insight?: { copy: string };
  idea?: { statement: string; copy?: string };
  execution?: ContentBlock[];

  stats?: Stat[]; // "The Impact" — omitted entirely when absent

  gallery?: MediaRef[]; // "The Work"

  quote?: { text: string; attribution?: string };

  whyItMattered?: string;

  nextProject?: string; // slug; auto-derived when absent

  /**
   * Publishing gate. "draft" = never routable/indexable in production, excluded
   * from sitemap / related / next-project; appears in the Work grid only as a
   * non-clickable placeholder. "published" = fully public. Defaults to draft.
   */
  publishStatus?: "draft" | "published";

  featured?: boolean;
  homepageFeatured?: boolean;

  // SEO / social
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;

  /** internal flag: story not yet written (grid + metadata only). */
  storyPending?: boolean;

  // ── INTERNAL-ONLY — must never render publicly ────────────────────────
  /** provenance of any figures/claims. */
  verificationStatus?: "verified" | "partially-verified" | "needs-confirmation";
  /** where each figure/claim came from. */
  sourceNotes?: string[];
  /**
   * Draft/provisional copy that is NOT yet confirmed. Rendered only in
   * development (with a DRAFT tag); omitted entirely from production so
   * provisional assumptions are never presented as final Geek claims.
   */
  draft?: {
    challengeCopy?: string;
    insight?: string;
    ideaCopy?: string;
    whyItMattered?: string;
  };
};
