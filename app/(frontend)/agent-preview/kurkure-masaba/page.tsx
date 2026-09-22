import fs from "node:fs";
import path from "node:path";

import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import FlexibleCaseStudy from "@/components/work/FlexibleCaseStudy";
import type { ResolvedProject } from "@/lib/cms/projects";

export const dynamic = "force-dynamic";

export default function AgentPreviewPage() {
  const reviewPath = path.join(
    process.cwd(),
    "content",
    "case-study-agent-input",
    "kurkure-masaba.request.review.json",
  );

  const review = JSON.parse(
    fs.readFileSync(reviewPath, "utf8"),
  );

  const candidate = review.candidate;

  const project = {
    slug: candidate.portfolio.projectHint.slug,

    brand: "Kurkure",
    brandSlug: candidate.portfolio.relationships.brandSlug,

    project: candidate.portfolio.projectHint.title,

    businessCategory:
      candidate.portfolio.relationships.businessCategorySlugs ?? [],

    services:
      candidate.portfolio.relationships.serviceSlugs ?? [],

    campaignTypes: [],

    headline:
      candidate.portfolio.projectHint.title,

    oneLineSummary:
      candidate.architecture.narrativeThesis,

    publishStatus: "draft",
    featured: false,

    renderMode: "flexible",

    sections:
      candidate.compiled.cmsSections,

    metricsList: [],

    source: "static",
  } as unknown as ResolvedProject;

  return (
    <>
      <Nav />

      <main id="main">
        <div className="bg-amber-400 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink">
          Agent Preview — Kurkure x Masaba · Draft · Not Published
        </div>

        <FlexibleCaseStudy project={project} />
      </main>

      <EndFooter />
    </>
  );
}
