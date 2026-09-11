/**
 * GOLD STANDARD IMPORT PACK — core entities (Phase 11.29).
 * Drafts only. Attribution discipline: Geek is the creator-activation execution
 * partner; wider campaigns and their lead agencies (Edelman / Wunderman Thompson /
 * PepsiCo Design) are named as wider context, never claimed as Geek's own.
 */
import type { IndustryRecord, CompanyRecord, BrandRecord, ServiceRecord, SolutionRecord } from "./types";

const RESEARCH_DATE = "2026-09-02";

/* ── FMCG (Industry) ────────────────────────────────────────────────────── */
export const fmcg: IndustryRecord = {
  slug: "fmcg",
  name: "FMCG",
  shortSummary:
    "Fast-moving consumer goods marketing in India — high-frequency, low-consideration, shelf-competitive — and where creator marketing genuinely moves trial and repeat.",
  introduction: [
    "FMCG marketing is a different discipline from the considered-purchase categories most agencies cut their teeth on. A packet of chips, a soft drink, a sachet of shampoo is a low-consideration, high-frequency, impulse purchase. Nobody researches it for a week. The decision is made in seconds, often at the shelf, often on habit. That single fact reshapes everything: the job is rarely to persuade with a long argument, it is to stay top-of-mind, look appealing at the point of decision, and remove every last gram of friction to trial.",
    "Four forces define the category. First, repeat purchase: lifetime value comes from frequency, not a one-time conversion, so brand affinity compounds. Second, intense shelf competition: dozens of SKUs fight for the same eye-level centimetres and the same rupee. Third, a relentless launch cadence: new flavours, limited editions, festival and occasion packs arrive constantly and each needs noise fast. Fourth, India's regional diversity: language, taste, price sensitivity and platform behaviour vary enormously across the country, so a single national creative rarely does the whole job.",
    "This is why creators fit FMCG so well. The category's needs — product demonstration, sampling, social proof, seeding, gifting, packaging reveals, flavour launches, occasion marketing and a steady supply of authentic user-generated content — map almost one-to-one onto what a well-run creator programme produces. A creator showing a real person opening a real pack in a real kitchen is trial made contagious. Regional creators localise a launch in a way a national film cannot. And because FMCG launches are frequent and time-boxed, an always-ready creator base is worth more than a cold list assembled from scratch every time.",
    "Creator tiers each earn their place. Nano creators (roughly under 10k followers) bring the highest trust and the most authentic UGC, and are the backbone of mass seeding and regional reach. Micro creators (~10k–100k) balance reach with credibility and are the workhorses of most FMCG activations. Macro creators (~100k–1M) add scale and a sense of occasion for a launch moment. Celebrity/mega creators buy instant fame and mass awareness but at a cost that only a headline moment justifies. The craft is matching the tier to the job — trial and proof lean nano/micro; a launch spike leans macro/celebrity — not defaulting to the biggest names.",
    "Two operating models are often confused. Product seeding sends product to a broad creator base with light or no obligation, optimising for organic, authentic mentions and reach at low unit cost — ideal for trial and buzz. Managed activation is a briefed, tracked, deliverable-bound programme: defined content, approvals, timelines and reporting — ideal when the brand needs guaranteed coverage and measurable output. Most strong FMCG programmes blend both: a managed core for guaranteed narrative, a seeded long tail for authenticity and scale.",
    "Barter creator economics deserve honesty, because they are routinely mis-described. Barter is not \"free influencers.\" It is an alternative value exchange: the brand offers product, experience, packaging personalisation, community status or creative collaboration instead of (or alongside) cash, and the creator accepts because the value to them is real. Run well, barter unlocks scale that a pure paid model cannot afford, and it selects for creators who genuinely like the brand. Run badly — treating creators as free labour — it produces resentment, thin content and churn. The difference is whether the exchange is respectful and the value genuine.",
    "Finally, scale changes the problem, not just the number. Running 20 creators is a coordination task a single person can hold in their head. Running 2,000 creators is an operations problem: sourcing and validating at volume, personalising outreach, shipping physical hampers with courier tracking, chasing approvals, catching non-posts, deduplicating, and reconciling what actually went live against what was promised. Most influencer failures at scale are logistics failures, not creative ones. An agency that has genuinely run thousands of creators has built the muscle — the checklists, the tracking, the courier discipline — that a 20-creator shop simply has not.",
    "Geek's proof point in FMCG is its multi-year Lay's (PepsiCo) creator work — the creator-activation layer across Smile Deke Dekho, Heartwork and MyLaysRelationchip, culminating in the Friends of Lay's creator community and the Influencer Relationship Management approach. Scope is stated carefully throughout: Geek executed and reported the creator-activation layer; the wider campaigns involved PepsiCo and its lead creative/PR partners, whose figures are cited as wider context, not as Geek's own.",
  ].join("\n\n"),
  faqs: [
    { question: "What makes FMCG influencer marketing different from other categories?", answer: "FMCG purchases are low-consideration, high-frequency and impulse-driven, with intense shelf competition and constant launches. Creator work therefore optimises for trial, authentic demonstration and repeat top-of-mind presence at scale, rather than long persuasion — and it lives or dies on logistics as much as creative." },
    { question: "What is barter influencer marketing?", answer: "An alternative value exchange where a brand offers product, experience, packaging personalisation or community status instead of (or alongside) a cash fee, and the creator participates because the value to them is genuine. It is not \"free influencers\" — done respectfully it unlocks scale and selects for creators who actually like the brand." },
    { question: "What is product seeding versus managed activation?", answer: "Seeding sends product to a broad creator base with light obligation, optimising for organic reach and authenticity at low unit cost. Managed activation is a briefed, tracked, deliverable-bound programme with approvals, timelines and reporting. Strong FMCG programmes usually blend a managed core with a seeded long tail." },
    { question: "Why does running 2,000 creators differ from running 20?", answer: "At 20, coordination fits in one person's head. At 2,000 it becomes an operations problem — sourcing and validating at volume, personalised outreach, courier-tracked hamper logistics, approval chasing, non-post detection and reconciliation. Most large influencer failures are logistics failures, not creative ones." },
    { question: "Which creator tier is right for an FMCG launch?", answer: "Match tier to job: nano/micro for trial, authentic UGC and regional reach; macro for a launch spike and sense of occasion; celebrity only for a headline awareness moment where the cost is justified. The mistake is defaulting to the biggest names." },
  ],
  searchStrategy: {
    primaryKeyword: "FMCG influencer marketing agency India",
    secondaryKeywords: [
      "FMCG influencer marketing", "FMCG marketing agency India", "influencer marketing for food brands",
      "FMCG creator marketing", "FMCG product seeding", "FMCG barter influencer marketing",
      "FMCG marketing case studies", "FMCG UGC campaigns",
    ],
    searchIntent: "mixed",
    targetMarket: "India",
    keywordResearchDate: RESEARCH_DATE,
    relatedQuestions: [
      "What makes FMCG marketing different?", "How do creators fit FMCG?",
      "What is barter influencer marketing?", "Product seeding vs managed activation?",
    ],
    preferredInternalAnchors: ["FMCG influencer marketing", "creator marketing for food brands"],
    searchNotes:
      "Commercial + informational category-authority page. SERP mixes agency listicles (commercial) with definitional queries (informational). Differentiate with real practitioner depth + Lay's proof rather than generic FMCG-marketing filler. Do NOT claim wider-campaign metrics as Geek's.",
  },
  seo: {
    metaTitle: "FMCG Influencer Marketing Agency in India | Geek Creative Agency",
    metaDescription: "How creator marketing actually moves trial and repeat for FMCG brands in India — seeding, barter economics, mass creator operations and multi-year Lay's proof.",
  },
};

/* ── PepsiCo (Company) ──────────────────────────────────────────────────── */
export const pepsico: CompanyRecord = {
  slug: "pepsico",
  name: "PepsiCo",
  website: "https://www.pepsico.com",
  businessCategorySlugs: ["fmcg"],
  shortSummary:
    "The Geek × PepsiCo relationship — a multi-year creator-marketing history across PepsiCo food brands, with Lay's as the deepest thread.",
  introduction: [
    "This is not a corporate biography of PepsiCo — the web already has thousands of those. Its purpose is narrower and more useful: to archive Geek Creative Agency's working relationship and creator-marketing history with PepsiCo's brands in India, with Lay's as the deepest and best-documented thread.",
    "PepsiCo is the parent company; its India food and beverage portfolio includes brands such as Lay's, Kurkure, Doritos, Pepsi, Mountain Dew, Slice, Mirinda, 7UP and Quaker. An important taxonomy point that recurs across this site: PepsiCo is the Company; Pepsi and Lay's are separate Brands within it. A \"Pepsi campaign\" is a campaign for the Pepsi brand under the PepsiCo company — never a campaign for a company called \"Pepsi.\"",
    "Geek's relationship with PepsiCo went beyond a single Lay's campaign. First-party correspondence from 2020 referenced Geek's creator work across PepsiCo food brands and named, among others, a Lay's \"Smile\" engagement and a Quaker influencer engagement. Those private communications are not reproduced here — no email contents, names, commercial terms or negotiations are exposed — but they establish that the engagement spanned more than one brand and more than one campaign. Where a specific brand's work is not yet independently documented on this site, it is mentioned as portfolio context only, not written up as a case study.",
    "The Lay's relationship is where the story is richest, and it is documented in full on the Lay's brand hub. In brief, it runs from creator acquisition (Smile Deke Dekho) through reactivation of that same community (Heartwork), to database-scale activation (MyLaysRelationchip), to institutionalising the community as an ongoing relationship layer (Friends of Lay's) — the arc that Geek later productised as Influencer Relationship Management.",
    "The through-line across these engagements is creator operations as a durable asset. The learning that matters is not \"we ran a campaign\" but \"we kept the relationships.\" Recurring campaign relationships mean the same creators are approached again with history and context; creator validation and profiling compound across campaigns; economics improve because a warm, willing community costs less to activate than a cold list; and a genuine community produces inbound — creators asking to participate — rather than only outbound recruitment. That is the difference between influencer marketing as a series of disposable campaigns and creator marketing as a compounding relationship.",
    "A Lay's portfolio timeline appears on the Lay's hub, ordered chronologically where dates are known. This company page deliberately keeps brand write-ups shallow apart from Lay's: other PepsiCo brands are named as related portfolio evidence only where defensible, and are not turned into fabricated case studies in this phase.",
  ].join("\n\n"),
  faqs: [
    { question: "Has Geek worked with PepsiCo?", answer: "Yes. Geek has a multi-year creator-marketing history with PepsiCo brands in India, deepest and best-documented on Lay's, spanning creator acquisition, reactivation, database-scale activation and an ongoing creator community." },
    { question: "Which PepsiCo campaigns has Geek worked on?", answer: "The fully documented work is the Lay's creator-activation portfolio — Smile Deke Dekho, Heartwork, MyLaysRelationchip and the Friends of Lay's community — with additional Lay's activations catalogued as evidence permits. First-party records also reference Geek creator work on other PepsiCo food brands, mentioned here as portfolio context rather than written-up case studies." },
    { question: "How has PepsiCo used creator marketing?", answer: "PepsiCo's Lay's brand has repeatedly used large-scale creator and influencer programmes — packaging personalisation, gratitude and gifting activations, and Valentine's flavour launches — often at the scale of hundreds to thousands of creators. Geek's role in these was the creator-activation execution layer." },
    { question: "What is the relationship between PepsiCo and Lay's?", answer: "PepsiCo is the parent Company; Lay's is one of its Brands. Every Lay's project in this graph is modelled as company = PepsiCo, brand = Lay's." },
    { question: "Is Pepsi a company or a brand?", answer: "In this graph, PepsiCo is the Company. Pepsi and Lay's are separate Brands within PepsiCo. A campaign for Pepsi is modelled as company = PepsiCo, brand = Pepsi — there is no company called \"Pepsi.\"" },
  ],
  searchStrategy: {
    primaryKeyword: "PepsiCo marketing campaigns India",
    secondaryKeywords: [
      "PepsiCo influencer marketing", "PepsiCo India campaigns", "PepsiCo digital marketing case studies",
      "PepsiCo creator marketing", "PepsiCo social media campaigns", "PepsiCo Lay's campaigns",
    ],
    searchIntent: "branded",
    targetMarket: "India",
    keywordResearchDate: RESEARCH_DATE,
    relatedQuestions: ["Has Geek worked with PepsiCo?", "Is Pepsi a company or a brand?", "Which PepsiCo campaigns has Geek worked on?"],
    preferredInternalAnchors: ["Geek × PepsiCo", "PepsiCo creator marketing"],
    searchNotes:
      "Branded + informational. Do NOT compete as a generic PepsiCo bio. Unique value = archive of Geek's PepsiCo creator history. Enforce PepsiCo=Company / Pepsi=Brand distinction (explicit Agent test). Never expose 2020 email contents or commercials.",
  },
  seo: {
    metaTitle: "PepsiCo × Geek Creative Agency — Creator Marketing History",
    metaDescription: "Geek's multi-year creator-marketing relationship with PepsiCo brands in India, anchored by a deep Lay's portfolio. PepsiCo is the company; Lay's and Pepsi are brands.",
  },
};

/* ── Lay's (Brand) — centerpiece hub ────────────────────────────────────── */
export const lays: BrandRecord = {
  slug: "lays",
  name: "Lay's",
  companySlug: "pepsico",
  portfolioGroup: "Foods",
  businessCategorySlugs: ["fmcg"],
  shortSummary:
    "A multi-year Lay's creator story — from acquiring a creator community, to reactivating it, to activating it at database scale, to institutionalising it as an always-on relationship.",
  introduction: [
    "This is not a list of campaigns Geek ran for Lay's. It is the story of how a creator community was built, kept and compounded over several years — and how that turned influencer marketing, campaign by campaign, into a relationship system.",
    "The spine of the story is five moves. Smile Deke Dekho acquired a creator community at scale around Lay's packaging personalisation. Heartwork reactivated that same community — Lay's later sent its gratitude packs to fan-club members, including the creators built earlier, which is one of the strongest continuity facts in this whole graph. MyLaysRelationchip scaled activation across the accumulated influencer database for a Valentine's flavour launch, and explicitly generated inbound: hundreds of additional creators asked to participate. Friends of Lay's institutionalised that community as an ongoing relationship layer rather than a one-off list. And Influencer Relationship Management is the productised learning — the method the brand's evolution taught.",
    "Scope and attribution are stated honestly throughout, because these were large campaigns with multiple partners. Lay's packaging and gratitude campaigns were led publicly by PepsiCo and its creative/PR agencies (independent media credited Edelman and Wunderman Thompson on the packaging work, and PepsiCo Design on Heartwork). Geek's role was the creator-activation execution layer — sourcing, validating, briefing, gifting logistics, publishing and reporting the influencer programme. Wider-campaign figures (total impressions, brand-partner reach, master-film results) belong to the wider campaign and are cited as independent context; Geek-scope figures come from Geek's own creator-activation reports and are labelled as such. The two are never merged.",
    "A note on the community itself: the reason each campaign got cheaper, faster and more willing was that Geek did not rebuild the list every time. Creators who personalised a pack in one campaign were the warm base for the next; their history, handles, formats and reliability were known. That is the mechanism behind reactivation, database-scale activation and, ultimately, inbound demand — and it is exactly what Influencer Relationship Management names.",
    "The campaigns below are grouped as Programs (the ongoing community layer — Friends of Lay's) and Campaigns (time-boxed activations — Smile Deke Dekho, Heartwork, MyLaysRelationchip, #KHOL, Paper-Thin/Wafer-Thin, Sizzlin' Hot, Gourmet, KFC Bangladesh). Not every Lay's campaign belongs to the IRM storyline; the additional activations demonstrate the breadth of the relationship without being forced into a single narrative.",
  ].join("\n\n"),
  faqs: [
    { question: "How many campaigns has Geek done for Lay's?", answer: "This graph documents the core relationship arc — Smile Deke Dekho, Heartwork, MyLaysRelationchip and the Friends of Lay's community — plus additional activations (#KHOL, Paper-Thin/Wafer-Thin, Sizzlin' Hot, Gourmet, KFC Bangladesh) catalogued as first-party evidence supports them." },
    { question: "Did Geek create the entire Lay's Smile Deke Dekho campaign?", answer: "No. The wider Smile Deke Dekho campaign was led publicly by PepsiCo with Edelman and Wunderman Thompson. Geek's role was the creator-activation execution layer. Wider-campaign figures (e.g. ~185–200M+ impressions reported publicly) are wider-campaign metrics, not Geek-only metrics." },
    { question: "What connects the Lay's campaigns?", answer: "A single, growing creator community. Smile acquired it, Heartwork reactivated it (gratitude packs went to the earlier fan-club creators), MyLaysRelationchip activated it at database scale, and Friends of Lay's institutionalised it — the arc Geek productised as Influencer Relationship Management." },
    { question: "What is Friends of Lay's?", answer: "Geek's name for the ongoing Lay's creator community/relationship layer — the always-on base of profiled, validated, repeatedly-activated creators, as opposed to a fresh list built per campaign. Later public use of the phrase by PepsiCo is not claimed as Geek-managed unless proven." },
  ],
  press: [
    { publisher: "Exchange4media", headline: "Lay's 'Smile Deke Dekho' campaign records 185 million impressions", url: "https://www.exchange4media.com/marketing-news/lays-wunderman-thompson-campaign-records-185-million-impressions-101187.html", sourceType: "trade-publication", geekMentioned: false, featured: true, publicationDate: "2020-01-01", validationNote: "Validates the WIDER Smile Deke Dekho campaign (publicly credited to Wunderman Thompson) and its 185M-impression scale — wider-campaign context, not a Geek mention or Geek-only metric." },
    { publisher: "afaqs", headline: "Lay's puts a smile on their packs", url: "https://www.afaqs.com/news/social-media/lays-puts-a-smile-on-their-packs", sourceType: "independent-editorial", geekMentioned: false, validationNote: "Independent coverage of the Lay's Smile packaging-personalisation activation — wider-campaign context." },
    { publisher: "adgully", headline: "Lay's embarks on influencer outreach to praise 'Heartwork'", url: "https://www.adgully.com/lay-s-embarks-on-influencer-outreach-to-praise-heartwork-94267.html", sourceType: "independent-editorial", geekMentioned: false, featured: true, publicationDate: "2020-07-01", validationNote: "Independent validation of the Heartwork influencer outreach (1400+ influencers, gratitude packs to fan-club creators) — supports the Smile→Heartwork community-continuity claim." },
    { publisher: "medianews4u", headline: "Lay's brings alive the importance of every 'Relationchip' this Valentine's", url: "https://www.medianews4u.com/lays-rolls-out-an-engaging-brand-banter-this-valentines-day-brings-alive-the-importance-of-every-relationchip/", sourceType: "independent-editorial", geekMentioned: false, publicationDate: "2021-02-01", validationNote: "Independent coverage of the #Relationchip Valentine's launch (3,000+ micro-influencers reported publicly) — wider-campaign context; public figures differ in scope from Geek's creator-activation report." },
  ],
  awards: [
    { awardBody: "Good Design Award", programName: "Good Design (Lay's Heartwork)", category: "Communication / Campaign", url: "https://good-design.org/projects/lays-heartwork-campaign/", geekCredited: false, creditedOrganizations: ["PepsiCo Design"], validationNote: "Heartwork recognised via PepsiCo Design's submission. Credited to PepsiCo Design, NOT Geek — recorded as wider-campaign recognition with correct attribution." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's influencer marketing campaigns",
    secondaryKeywords: [
      "Lay's Smile Deke Dekho", "Lay's Heartwork campaign", "MyLaysRelationchip",
      "Friends of Lay's", "Lay's creator marketing", "Lay's India influencer campaign",
    ],
    searchIntent: "branded",
    targetMarket: "India",
    keywordResearchDate: RESEARCH_DATE,
    relatedQuestions: ["What connects the Lay's campaigns?", "What is Friends of Lay's?", "Did Geek create the entire Lay's campaign?"],
    preferredInternalAnchors: ["Lay's creator community", "Friends of Lay's", "MyLaysRelationchip"],
    searchNotes:
      "Centerpiece brand hub. Branded intent dominated by PepsiCo/Lay's official + press. Win on the relationship narrative + Geek-scope evidence, not on out-ranking Lay's.com. STRICT scope labels: public Smile/Relationchip figures are wider-campaign, publicly credited to Edelman/WT; keep separate from Geek activation reports.",
  },
  seo: {
    metaTitle: "Lay's Creator Marketing — From Campaigns to a Creator Community | Geek",
    metaDescription: "How Geek's Lay's creator work evolved from acquisition (Smile Deke Dekho) to reactivation (Heartwork) to database-scale activation (MyLaysRelationchip) to an always-on community (Friends of Lay's).",
  },
};

/* ── Influencer Marketing (Service) ─────────────────────────────────────── */
export const influencerMarketing: ServiceRecord = {
  slug: "influencer-marketing",
  label: "Influencer Marketing",
  order: 10,
  hero: {
    heading: "Influencer marketing that survives contact with scale",
    shortSummary: "Strategy, sourcing, validation, logistics and reporting for creator campaigns — from 20 creators to a few thousand.",
  },
  introduction: [
    "Influencer marketing is the practice of reaching an audience through the trusted voices they already follow, rather than through the brand's own paid channels. Done well it is not \"posting for money\" — it is matching the right creators to the right message, giving them enough freedom to be authentic, and running the whole thing as a managed operation with real measurement.",
    "Most of the value — and most of the failure — is in the parts nobody sees. A serious influencer marketing agency manages strategy (who are we trying to reach, and why creators at all), sourcing (finding creators who fit), validation (are the followers and engagement real, is the creator brand-safe), commercials (fee or barter, usage, exclusivity), briefing (clear enough to guide, loose enough to stay authentic), approvals (client and legal, without killing spontaneity), coordination and fulfilment (getting product/hampers physically delivered, on time, tracked), publishing (windows, sequencing, hashtags) and reporting (what actually went live, reach, engagement, and honest scope). The creative is the tip; the operation is the iceberg.",
    "The tier question — nano vs micro vs macro vs celebrity — is a matching problem, covered in depth on the FMCG hub. Paid and barter are two commercial models: paid guarantees deliverables and control; barter is an alternative value exchange (product, experience, status, collaboration) that unlocks scale and selects for genuine affinity when run respectfully. It is never \"free influencers.\" Product seeding is the light-touch, broad, organic-optimised end of the spectrum; managed activation is the briefed, tracked, deliverable-bound end. UGC overlaps but is not identical: influencer marketing is creator-led and often briefed, while UGC is any user-generated content the brand can amplify — the best programmes generate both.",
    "Mass influencer marketing is a distinct competence. Coordinating a few thousand creators means personalised outreach at volume, courier-tracked physical logistics, approval and non-post detection, deduplication and reconciliation of promised-versus-live content. Regional influencer marketing adds language, platform and taste localisation. And the details that protect the brand — content usage rights, exclusivity windows, realistic timelines, and measurement that separates tracked from estimated and Geek-scope from wider-campaign — are where amateur programmes quietly leak value or over-claim results.",
    "The most valuable output of running influencer campaigns repeatedly is not the campaign — it is the relationship. Creators you have worked with, validated and treated well become a warm, willing base you can reactivate faster and cheaper than any cold list. That compounding asset is what Geek formalised as Influencer Relationship Management, and it is where a mature influencer marketing practice stops being a series of one-off campaigns.",
    "Geek's real-world proof is its multi-year Lay's (PepsiCo) creator-activation work across Smile Deke Dekho, Heartwork and MyLaysRelationchip, and the Friends of Lay's community. Scope is stated carefully: Geek executed the creator-activation layer; wider-campaign figures belong to the wider campaign and its lead partners.",
  ].join("\n\n"),
  capabilities: [
    { title: "Strategy", description: "Whether creators are the right lever at all, for whom, and to what measurable end." },
    { title: "Sourcing & validation", description: "Finding fitting creators and checking that followers, engagement and brand-safety are real — the step most programmes skip." },
    { title: "Commercials", description: "Paid, barter or blended value exchange, plus usage rights and exclusivity — negotiated respectfully and kept confidential." },
    { title: "Briefing & approvals", description: "Direction clear enough to guide and loose enough to stay authentic, moved through client/legal without killing spontaneity." },
    { title: "Coordination & fulfilment", description: "Getting product and personalised hampers physically delivered, on time, with courier tracking — the make-or-break of mass activation." },
    { title: "Publishing & reporting", description: "Sequencing, windows and hashtags, then honest measurement that separates tracked from estimated and Geek-scope from wider-campaign." },
  ],
  approach:
    "Geek runs influencer marketing as an operation, not a shopping list. Every programme is scoped to a measurable job, sourced and validated before a rupee or a pack moves, and reconciled afterwards against what was actually promised. Metrics are always labelled by scope. And wherever possible, the creators are kept — profiled and retained — so the next campaign starts warm. That retention practice is the bridge to Influencer Relationship Management.",
  faqs: [
    { question: "What does an influencer marketing agency actually manage?", answer: "Strategy, sourcing, validation, commercials, briefing, approvals, coordination, physical fulfilment, publishing and reporting. The visible creative is a small part; most value and most failure live in validation and logistics." },
    { question: "What is the difference between paid and barter influencer marketing?", answer: "Paid uses a cash fee and guarantees deliverables and control. Barter is an alternative value exchange — product, experience, status or collaboration — that unlocks scale and selects for genuine affinity when run respectfully. Barter is not \"free influencers.\"" },
    { question: "What is the difference between UGC and influencer marketing?", answer: "Influencer marketing is creator-led and usually briefed; UGC is any user-generated content the brand can amplify. They overlap, and strong programmes deliberately generate both." },
    { question: "How is mass influencer marketing different?", answer: "At a few thousand creators it becomes a logistics and operations discipline — personalised outreach at volume, courier-tracked hampers, approval and non-post detection, deduplication and reconciliation — not just a bigger content brief." },
    { question: "How should influencer results be measured honestly?", answer: "By separating tracked from estimated, organic from paid, and the agency's activation scope from the wider campaign's totals. Merging those inflates results and erodes trust." },
  ],
  searchStrategy: {
    primaryKeyword: "influencer marketing agency India",
    secondaryKeywords: [
      "influencer marketing company India", "micro influencer marketing agency India", "nano influencer agency India",
      "barter influencer marketing agency", "creator marketing agency India", "product seeding agency India",
      "mass influencer marketing", "Instagram influencer marketing agency", "influencer campaign management",
    ],
    searchIntent: "commercial",
    targetMarket: "India",
    keywordResearchDate: RESEARCH_DATE,
    relatedQuestions: ["What does an influencer marketing agency manage?", "Paid vs barter influencer marketing?", "What is mass influencer marketing?"],
    preferredInternalAnchors: ["influencer marketing agency", "creator campaign management", "influencer relationship management"],
    searchNotes:
      "Primary commercial pillar; highest-competition head term. Win on operational depth (validation, logistics, scope-honest measurement) + Lay's proof + the IRM differentiator. Avoid keyword-stuffed listicle style.",
  },
  seo: {
    metaTitle: "Influencer Marketing Agency in India | Geek Creative Agency",
    metaDescription: "Strategy, sourcing, validation, logistics and honest measurement for creator campaigns at any scale — from 20 creators to a few thousand — proven on multi-year Lay's work.",
  },
};

/* ── Influencer Relationship Management (Solution) ──────────────────────── */
export const irm: SolutionRecord = {
  slug: "influencer-relationship-management",
  name: "Influencer Relationship Management",
  solutionType: "proprietary-ip",
  relatedServiceSlugs: ["influencer-marketing"],
  shortSummary:
    "The structured practice of retaining, understanding, segmenting and repeatedly activating creators — instead of rebuilding a new influencer list for every campaign.",
  introduction: [
    "Influencer Relationship Management (IRM) is Geek's name for a simple but under-practised idea: treat creators as a relationship you keep, not a list you rent. Formally, it is the structured practice of retaining, understanding, segmenting and repeatedly activating creators, rather than rebuilding a fresh influencer list for every campaign.",
    "The distinction from influencer marketing is precise. Influencer marketing asks: \"Who should promote this campaign?\" IRM asks: \"Who have we already built a relationship with, what do we know about them, and who should we activate again?\" The first question restarts from zero each time. The second compounds — every campaign makes the next one faster, cheaper, more willing and better-targeted, because the community, its history and its profiles carry forward.",
    "IRM is a lifecycle, not a database. The framework runs Discover → Profile → Segment → Activate → Recognise → Listen → Reward → Reactivate → Measure — and then loops. You discover and profile creators, segment them by fit and behaviour, activate the right segment for a given brief, recognise and reward participation so the relationship stays warm, listen to what creators tell you (including inbound requests to join), reactivate warm creators for the next moment, and measure honestly at each step. The retention loop is the point.",
    "The Lay's evolution is the clearest illustration — but the history must be told accurately, not rewritten. Not every early Lay's campaign \"used IRM\"; IRM is the name for what the sequence taught. Smile Deke Dekho demonstrated creator acquisition at scale. Heartwork demonstrated reactivation — the gratitude packs went to the fan-club community built earlier. MyLaysRelationchip demonstrated database-scale activation, and generated inbound demand (creators asking to participate). Friends of Lay's represented institutionalising that community as an ongoing relationship layer. IRM productises the learning across all of it. Accordingly, only MyLaysRelationchip and Friends of Lay's carry a formal IRM Solution relationship in this graph; Smile and Heartwork are linked as historical context, not retroactively re-labelled.",
    "The payoff of IRM is measurable in the things one-off influencer marketing never gets: lower activation cost on a warm base, faster time-to-live, higher willing participation, richer targeting from accumulated profiles, and inbound creators who ask to be involved. It is the difference between renting reach and owning a relationship.",
  ].join("\n\n"),
  whatItSolves: {
    heading: "The cost of starting from zero every time",
    body: "Most brands rebuild their influencer list for every campaign — re-sourcing, re-validating, re-negotiating and re-briefing strangers each time. That is slow, expensive, and throws away the goodwill and knowledge earned last time. IRM solves it by making the creator community a retained, profiled, segmentable asset that gets warmer and cheaper to activate with every campaign, and that eventually produces inbound demand instead of only outbound recruitment.",
  },
  methodology: [
    { title: "Discover", description: "Continuously find creators who fit the brand, beyond the needs of any single campaign." },
    { title: "Profile", description: "Record who each creator is — audience, formats, reliability, past participation, region and affinity." },
    { title: "Segment", description: "Group creators by fit and behaviour so each brief activates the right subset, not the whole list." },
    { title: "Activate", description: "Brief and mobilise the chosen segment for a specific campaign or launch moment." },
    { title: "Recognise", description: "Acknowledge participation so the relationship is a two-way one, not extraction." },
    { title: "Listen", description: "Capture creator feedback and inbound interest — the signal that the community is alive." },
    { title: "Reward", description: "Give real value back — product, status, collaboration, early access — to keep the base warm." },
    { title: "Reactivate", description: "Bring warm creators back for the next moment faster and cheaper than any cold list." },
    { title: "Measure", description: "Track retention, repeat participation and activation cost over time, with honest scope labels." },
  ],
  faqs: [
    { question: "What is Influencer Relationship Management?", answer: "The structured practice of retaining, understanding, segmenting and repeatedly activating creators, instead of rebuilding a new influencer list for every campaign. It treats the creator community as a compounding asset." },
    { question: "How is IRM different from influencer marketing?", answer: "Influencer marketing asks \"who should promote this campaign?\" and restarts each time. IRM asks \"who have we already built a relationship with, what do we know, and who should we activate again?\" — so each campaign makes the next faster, cheaper and more willing." },
    { question: "Did every old Lay's campaign use IRM?", answer: "No. IRM is the name for what the Lay's sequence taught. Smile showed acquisition, Heartwork showed reactivation, MyLaysRelationchip showed database-scale activation, and Friends of Lay's institutionalised the community. Only MyLaysRelationchip and Friends of Lay's carry a formal IRM relationship; earlier campaigns are historical context." },
    { question: "What does IRM improve in practice?", answer: "Lower activation cost on a warm base, faster time-to-live, higher willing participation, better targeting from accumulated profiles, and inbound creators asking to join — outcomes a one-off list cannot produce." },
  ],
  searchStrategy: {
    primaryKeyword: "influencer relationship management",
    secondaryKeywords: [
      "creator relationship management", "influencer CRM", "creator CRM", "influencer community management",
      "influencer retention", "long term influencer partnerships", "influencer loyalty program",
      "always-on influencer marketing", "creator database management",
    ],
    searchIntent: "mixed",
    targetMarket: "India",
    keywordResearchDate: RESEARCH_DATE,
    relatedQuestions: ["What is influencer relationship management?", "How is IRM different from influencer marketing?", "Did every old Lay's campaign use IRM?"],
    preferredInternalAnchors: ["Influencer Relationship Management", "creator community", "always-on creator marketing"],
    searchNotes:
      "Geek IP / methodology page. Commercial + informational; lower volume, higher differentiation. Own the definition. Do NOT rewrite Lay's history as if IRM existed from the start — narrate the evolution accurately (Smile/Heartwork = context, MyLays/Friends = formal relationship).",
  },
  seo: {
    metaTitle: "Influencer Relationship Management (IRM) | Geek Creative Agency",
    metaDescription: "Retain, profile, segment and repeatedly activate creators instead of renting a new list every campaign. The method Geek's multi-year Lay's creator work produced.",
  },
};

export const entities = { fmcg, pepsico, lays, influencerMarketing, irm };
