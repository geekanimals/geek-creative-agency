import { Suspense } from "react";
import WorkExplorer from "@/components/work/list/WorkExplorer";
import LegacyWorkRedirect from "@/components/work/list/LegacyWorkRedirect";
import FeaturedStories from "@/components/work/list/FeaturedStories";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { getWorkProjects } from "@/lib/cms/projects";
import { FEATURED_STORY_SLUGS } from "@/lib/work/projects";
import { workPathMenu } from "@/lib/work/routes";
import { getWorkPageCopy } from "@/lib/cms/pageCopy";
import { draftMode } from "next/headers";
import { ogFallback } from "@/lib/seo/ogImage";
import { tileFields } from "@/lib/work/tileFields";

export async function generateMetadata() {
  const { seo } = await getWorkPageCopy();
  const title = seo.metaTitle || "The Work — Geek Creative Agency";
  const description =
    seo.metaDescription ||
    "Ideas that made an impact. Explore Geek's work by business category, brand, service and campaign type.";
  return {
    title,
    description,
    alternates: { canonical: "/work" },
    openGraph: {
      title,
      description: seo.metaDescription || "Ideas that made an impact.",
      url: "/work",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function WorkPage() {
  // Unified list: static registry + published CMS projects (CMS wins), with
  // automatic static fallback if the CMS is unavailable.
  const allProjects = await getWorkProjects();
  const { isEnabled: draft } = await draftMode();
  const copy = await getWorkPageCopy({ draft });
  // Featured stories come from the same CMS-merged, published-only list.
  const featured = FEATURED_STORY_SLUGS.map((slug) =>
    allProjects.find((p) => p.slug === slug),
  ).filter((p) => !!p && p.publishStatus === "published");
  return (
    <>
      <style href="work-page" precedence="default">
        {styles}
      </style>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ])}
      />
      <main id="main" className="work-page">
        {/* Hero */}
        <section className="work-page-container work-page__hero">
          <h1 className="work-page-display work-page__title">{copy.title}</h1>
          <p className="work-page__lede">{copy.lede}</p>
        </section>

        {/* Featured editorial intro */}
        <FeaturedStories stories={featured} />

        {/* Explore all work → filters (each option opens /work/<dimension>/<value>) */}
        <div className="work-page-container work-page__explore">
          <h2 className="work-page-display work-page__explore-title">{copy.exploreTitle}</h2>
        </div>

        <WorkExplorer
          projects={allProjects.map(tileFields)}
          total={allProjects.length}
          menu={workPathMenu([], allProjects)}
        />

        {/* Old /work?brand=… links → /work/… */}
        <Suspense fallback={null}>
          <LegacyWorkRedirect />
        </Suspense>
      </main>
    </>
  );
}

const styles = `
.work-page {
  padding-top: 6rem;
}

.work-page__hero {
  padding-top: 1.5rem;
  padding-bottom: 2rem;
}

.work-page__title {
  font-size: clamp(2.6rem, 7vw, 6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.work-page__lede {
  margin-top: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #5a5f5c;
}

.work-page__explore {
  padding-top: 2.5rem;
  padding-bottom: 0.5rem;
}

.work-page__explore-title {
  font-size: 1.5rem;
  text-transform: uppercase;
  color: #0c0d0c;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.work-page-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .work-page-container {
    padding-inline: 20px;
  }
}

.work-page-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .work-page {
    padding-top: 7rem;
  }

  .work-page__hero {
    padding-bottom: 2.5rem;
  }

  .work-page__lede {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .work-page__explore-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}
`;
