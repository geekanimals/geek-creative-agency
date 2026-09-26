import {
  HubSection,
  PortfolioHero,
  PortfolioStats,
  PortfolioStory,
  BrandShowcase,
  ProjectCardGrid,
} from "@/components/hubs/Hub";

import type { IndustryHub } from "@/lib/cms/businessCategories";

export default function FMCGIndustryPage({
  industry,
}: {
  industry: IndustryHub;
}) {
  const positioning =
    industry.slug === "fmcg-beverages"
      ? "Building beverage brands people remember."
      : "Turning everyday products into cultural moments.";

  return (
    <>
      <PortfolioHero
        title={industry.name}
        summary={industry.shortSummary || positioning}
        image={industry.hero}
      />

      <PortfolioStory
        heading="The FMCG Opportunity"
        text={
          industry.introduction ||
          "FMCG brands influence everyday consumer choices through products, experiences and storytelling."
        }
      />

      <PortfolioStats
        items={[
          {
            value: "2B+",
            label: "Global consumers",
          },
          {
            value: "Daily",
            label: "Purchase moments",
          },
          {
            value: "Creator",
            label: "Driven discovery",
          },
        ]}
      />

      {industry.companies.length > 0 && (
        <HubSection heading="Featured Company">
          {industry.companies.map((company) => (
            <a
              key={company.slug}
              href={`/companies/${company.slug}`}
              className="block rounded-2xl border border-mist p-10 transition hover:border-geek-cyan"
            >
              <h2 className="font-display text-4xl uppercase text-ink">
                {company.name}
              </h2>
              <p className="mt-4 text-lg text-graphite">
                Explore the brands, campaigns and creative work behind this global FMCG leader.
              </p>
            </a>
          ))}
        </HubSection>
      )}

      {industry.brands.length > 0 && <BrandShowcase brands={industry.brands} />}

      {industry.projects.length > 0 && (
        <HubSection heading="Campaign Stories">
          <ProjectCardGrid projects={industry.projects} />
        </HubSection>
      )}
    </>
  );
}
