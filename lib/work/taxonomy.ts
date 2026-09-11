/**
 * Central taxonomy for the Work system. Add categories/services/campaign types
 * HERE — never scatter labels through components. Brands are NOT listed here:
 * they are derived from project data (see filters.ts → deriveBrands).
 *
 * `slug` is the stable URL/query value; `label` is what the UI shows.
 */
export type TaxonomyItem = { slug: string; label: string };

/** Which URL query key each filter dimension uses. */
export const FILTER_KEYS = {
  category: "category",
  brand: "brand",
  service: "service",
  campaign: "campaign",
} as const;
export type FilterKey = keyof typeof FILTER_KEYS;

export const businessCategories: TaxonomyItem[] = [
  { slug: "fmcg", label: "FMCG" },
  { slug: "food-beverage", label: "Food & Beverage" },
  { slug: "hospitality", label: "Hospitality" },
  { slug: "it-technology", label: "IT / Technology" },
  { slug: "retail", label: "Retail" },
  { slug: "fashion", label: "Fashion" },
  { slug: "beauty-personal-care", label: "Beauty & Personal Care" },
  { slug: "automobile", label: "Automobile" },
  { slug: "education", label: "Education" },
  { slug: "real-estate", label: "Real Estate" },
  { slug: "financial-services", label: "Financial Services" },
  { slug: "aviation", label: "Aviation" },
  { slug: "d2c", label: "D2C" },
  { slug: "lifestyle", label: "Lifestyle" },
  { slug: "healthcare", label: "Healthcare" },
  { slug: "sustainability", label: "Sustainability" },
  { slug: "social-impact", label: "Social Impact" },
  { slug: "b2b", label: "B2B" },
];

// SERVICE = what Geek did. (No "Brand Launch" here — that is a campaign type.)
export const services: TaxonomyItem[] = [
  { slug: "brand-strategy", label: "Brand Strategy" },
  { slug: "brand-positioning", label: "Brand Positioning" },
  { slug: "branding", label: "Branding" },
  { slug: "naming", label: "Naming" },
  { slug: "creative-strategy", label: "Creative Strategy" },
  { slug: "campaign-ideation", label: "Campaign Ideation" },
  { slug: "integrated-creative", label: "Integrated Creative" },
  { slug: "digital", label: "Digital" },
  { slug: "social-media", label: "Social Media" },
  { slug: "content", label: "Content" },
  { slug: "video-film", label: "Video / Film" },
  { slug: "influencer-marketing", label: "Influencer Marketing" },
  { slug: "creator-marketing", label: "Creator Marketing" },
  { slug: "celebrity", label: "Celebrity" },
  { slug: "ugc", label: "UGC" },
  { slug: "regional-marketing", label: "Regional Marketing" },
  { slug: "media", label: "Media" },
  { slug: "paid-social", label: "Paid Social" },
  { slug: "events", label: "Events" },
  { slug: "experiential", label: "Experiential" },
  { slug: "activation", label: "Activation" },
  { slug: "design", label: "Design" },
  { slug: "print", label: "Print" },
  { slug: "production", label: "Production" },
  { slug: "event-ip", label: "Event IP Development" },
  { slug: "fnb-communication", label: "F&B Communication" },
  { slug: "packaging-fulfilment", label: "Packaging / Fulfilment" },
  { slug: "pr-earned-media", label: "PR / Earned Media" },
];

// CAMPAIGN TYPE = what kind of campaign/project it was.
export const campaignTypes: TaxonomyItem[] = [
  { slug: "brand-launch", label: "Brand Launch" },
  { slug: "product-launch", label: "Product Launch" },
  { slug: "store-venue-launch", label: "Venue / Store Launch" },
  { slug: "integrated-campaign", label: "Integrated Campaign" },
  { slug: "mass-creator-campaign", label: "Mass Creator Campaign" },
  { slug: "influencer-campaign", label: "Influencer Campaign" },
  { slug: "celebrity-campaign", label: "Celebrity Campaign" },
  { slug: "micro-influencer-campaign", label: "Micro Influencer Campaign" },
  { slug: "barter-campaign", label: "Barter Campaign" },
  { slug: "ugc-campaign", label: "UGC Campaign" },
  { slug: "social-campaign", label: "Social Campaign" },
  { slug: "digital-campaign", label: "Digital Campaign" },
  { slug: "interactive-experience", label: "Interactive Experience" },
  { slug: "event-activation", label: "Event Activation" },
  { slug: "cause-campaign", label: "Cause Campaign" },
  { slug: "employer-branding", label: "Employer Branding Campaign" },
  { slug: "content-campaign", label: "Content Campaign" },
  { slug: "community-campaign", label: "Community Campaign" },
  { slug: "referral-campaign", label: "Referral Campaign" },
  { slug: "recruitment-campaign", label: "Recruitment Campaign" },
  { slug: "long-term-partnership", label: "Long-Term Partnership" },
  { slug: "brand-building", label: "Brand Building" },
];

/**
 * BUSINESS OUTCOME — internal structuring dimension (objectives/results).
 * NOT a public Work filter yet; kept centrally configurable.
 */
export const businessOutcomes: TaxonomyItem[] = [
  { slug: "awareness", label: "Awareness" },
  { slug: "brand-launch", label: "Brand Launch" },
  { slug: "consideration", label: "Consideration" },
  { slug: "engagement", label: "Engagement" },
  { slug: "content-generation", label: "Content Generation" },
  { slug: "community-building", label: "Community Building" },
  { slug: "footfall", label: "Footfall" },
  { slug: "traffic", label: "Traffic" },
  { slug: "leads", label: "Leads" },
  { slug: "acquisition", label: "Acquisition" },
  { slug: "sales", label: "Sales" },
  { slug: "retention", label: "Retention" },
  { slug: "brand-love", label: "Brand Love" },
  { slug: "advocacy", label: "Advocacy" },
  { slug: "earned-media", label: "Earned Media" },
];

/** slug → label lookups (used by chips + case-study metadata). */
export const categoryMap = Object.fromEntries(businessCategories.map((t) => [t.slug, t.label]));
export const serviceMap = Object.fromEntries(services.map((t) => [t.slug, t.label]));
export const campaignMap = Object.fromEntries(campaignTypes.map((t) => [t.slug, t.label]));

export function labelFor(dimension: FilterKey, slug: string, brandLabels?: Record<string, string>): string {
  switch (dimension) {
    case "category":
      return categoryMap[slug] ?? slug;
    case "service":
      return serviceMap[slug] ?? slug;
    case "campaign":
      return campaignMap[slug] ?? slug;
    case "brand":
      return brandLabels?.[slug] ?? slug;
  }
}
