import { Suspense } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import WorkExplorer from "@/components/work/WorkExplorer";
import FeaturedStories from "@/components/work/FeaturedStories";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { getWorkProjects } from "@/lib/cms/projects";

export const metadata: Metadata = {
  title: "The Work — Geek Creative Agency",
  description:
    "Ideas that made an impact. Explore Geek's work by business category, brand, service and campaign type.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "The Work — Geek Creative Agency",
    description: "Ideas that made an impact.",
    url: "/work",
    type: "website",
  },
};

export default async function WorkPage() {
  // Unified list: static registry + published CMS projects (CMS wins), with
  // automatic static fallback if the CMS is unavailable.
  const allProjects = await getWorkProjects();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
      <Nav />
      <main id="main" className="pt-24 sm:pt-28">
        {/* Hero */}
        <section className="mx-auto max-w-edge px-5 pb-8 pt-6 sm:px-8 sm:pb-10">
          <h1 className="h-display text-[clamp(2.6rem,7vw,6rem)] uppercase text-ink">The Work.</h1>
          <p className="mt-3 text-base text-graphite sm:text-lg">Ideas that made an impact.</p>
        </section>

        {/* Featured editorial intro */}
        <FeaturedStories />

        {/* Explore all work → filters */}
        <div className="mx-auto max-w-edge px-5 pb-2 pt-10 sm:px-8">
          <h2 className="h-display text-2xl uppercase text-ink sm:text-3xl">Explore All Work.</h2>
        </div>

        <Suspense fallback={<div className="mx-auto max-w-edge px-5 py-16 text-sm text-graphite sm:px-8">Loading work…</div>}>
          <WorkExplorer projects={allProjects} />
        </Suspense>
      </main>
      <EndFooter />
    </>
  );
}
