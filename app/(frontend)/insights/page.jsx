import { Suspense } from "react";
import InsightsExplorer from "@/components/insights/InsightsExplorer";
import { getInsightsIndex } from "@/lib/cms/insights";
import { ogFallback } from "@/lib/seo/ogImage";

export const metadata = {
  title: "Insights — What we're geeking out on | Geek",
  description:
    "Geek's thinking on brand building, the creator economy, social & culture, and what's next.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights — Geek",
    description: "What we're geeking out on.",
    url: "/insights",
    type: "website",
    images: ogFallback("Insights"),
  },
};

export default async function InsightsPage() {
  const articles = await getInsightsIndex();
  return (
    <>
      <style href="ins-page" precedence="default">
        {styles}
      </style>
      <main id="main" className="ins-page">
        <section className="ins-page-container ins-page__hero">
          <h1 className="ins-page-display ins-page__title">
            What we&apos;re
            <br />
            <span className="ins-page__accent">geeking out on.</span>
          </h1>
          <p className="ins-page__lede">
            Thinking out loud — brand, creators, culture, and what&apos;s next.
          </p>
        </section>

        <Suspense fallback={<div className="ins-page-container ins-page__loading">Loading…</div>}>
          <InsightsExplorer articles={articles} />
        </Suspense>
      </main>
    </>
  );
}

const styles = `
.ins-page {
  padding-top: 6rem;
}

.ins-page__hero {
  padding-top: 1.5rem;
  padding-bottom: 2rem;
}

.ins-page__title {
  font-size: clamp(2.6rem, 7vw, 6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.ins-page__accent {
  color: #32c1df;
}

.ins-page__lede {
  margin-top: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #5a5f5c;
}

.ins-page__loading {
  padding-block: 4rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #5a5f5c;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.ins-page-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .ins-page-container {
    padding-inline: 20px;
  }
}

.ins-page-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .ins-page {
    padding-top: 7rem;
  }

  .ins-page__hero {
    padding-bottom: 2.5rem;
  }

  .ins-page__lede {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
`;
