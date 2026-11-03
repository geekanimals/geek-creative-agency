import fs from "node:fs";
import path from "node:path";

import FlexibleCaseStudy from "@/components/work/case-study/FlexibleCaseStudy";

export const dynamic = "force-dynamic";

export default function AgentPreviewPage() {
  const reviewPath = path.join(
    process.cwd(),
    "content",
    "case-study-agent-input",
    "kurkure-masaba.request.review.json",
  );

  const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));

  const candidate = review.candidate;

  const project = {
    slug: candidate.portfolio.projectHint.slug,

    brand: "Kurkure",
    brandSlug: candidate.portfolio.relationships.brandSlug,

    project: candidate.portfolio.projectHint.title,

    businessCategory: candidate.portfolio.relationships.businessCategorySlugs ?? [],

    services: candidate.portfolio.relationships.serviceSlugs ?? [],

    campaignTypes: [],

    headline: candidate.portfolio.projectHint.title,

    oneLineSummary: candidate.architecture.narrativeThesis,

    publishStatus: "draft",
    featured: false,

    renderMode: "flexible",

    sections: candidate.compiled.cmsSections,

    metricsList: [],

    source: "static",
  };

  return (
    <>
      <style href="ap-masaba" precedence="default">
        {styles}
      </style>
      <main id="main">
        <div className="ap-masaba__banner">
          Agent Preview — Kurkure x Masaba · Draft · Not Published
        </div>

        <FlexibleCaseStudy project={project} />
      </main>
    </>
  );
}

const styles = `
.ap-masaba__banner {
  background-color: #fbbf24;
  padding: 0.5rem 1.25rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
}
`;
