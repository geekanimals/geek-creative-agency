/**
 * GOLD STANDARD IMPORT PACK — Lay's projects (Phase 11.29). Drafts only.
 *
 * METRIC INTEGRITY IS MANDATORY. Every figure carries a scope label in its `note`
 * or surrounding prose:
 *   (Geek) = Geek creator-activation report · (wider) = wider campaign, publicly
 *   reported · (estimated) = estimated/perceived value, NOT audited ROI ·
 *   (program) = Geek historical program/database figure.
 * Where a figure cannot be verified against an original campaign report it is
 * OMITTED from public content and marked MISSING/UNVERIFIED in the Evidence Ledger.
 * Solution=IRM is attached ONLY to MyLaysRelationchip and Friends of Lay's.
 */
import type { ProjectRecord } from "./types";

const IM = ["influencer-marketing"];
const FMCG = ["fmcg"];

/* 1 — SMILE DEKE DEKHO (Acquire; NO IRM — predates the formalised solution) */
export const smileDekeDekho: ProjectRecord = {
  slug: "smile-deke-dekho",
  title: "Lay's Smile Deke Dekho",
  client: "Lay's (PepsiCo)",
  year: 2019,
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  shortSummary: "The packaging-personalisation activation that acquired Lay's creator community at scale.",
  cardSummary: "Acquiring a creator community around personalised Lay's packs.",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Role in the story", heading: "Acquire", body: "Smile Deke Dekho is where the Lay's creator community began. Lay's put smiles on its packs and personalised packaging for creators, turning a packaging idea into a wave of authentic social content. For Geek this campaign's lasting value was not a single burst of reach — it was the creator base it acquired, which later campaigns would reactivate." },
    { blockType: "sectionIntro", heading: "Scope & attribution", body: "The wider Smile Deke Dekho campaign was led publicly by PepsiCo with Edelman and Wunderman Thompson, and was reported by independent trade media at roughly 185–200M+ impressions with 750+ influencers. Those are WIDER-CAMPAIGN figures and are cited here as independent context, not as Geek metrics. Geek's role was the creator-activation execution layer — sourcing, personalised gifting logistics, publishing and reporting the influencer programme." },
    { blockType: "metrics", heading: "Wider campaign — independently reported", items: [
      { value: "185M+", label: "Impressions", note: "(wider) Exchange4media — whole campaign, credited to Wunderman Thompson" },
      { value: "750+", label: "Influencers", note: "(wider) publicly reported for the packaging activation" },
      { value: "8.2M", label: "Engagements", note: "(wider) publicly reported; ~75% earned" },
    ] },
    { blockType: "sectionIntro", heading: "The continuity that mattered", body: "The most important outcome for the relationship graph is that the creators mobilised here became a known, warm community. Lay's Heartwork later sent gratitude packs to fan-club members — the very creators built through the Smile activation — which is one of the strongest continuity facts across the whole Lay's story." },
    { blockType: "cta", heading: "See how the community was reactivated", body: "Heartwork rebuilt on the relationships Smile acquired.", buttonLabel: "Lay's Heartwork", buttonHref: "/work/lays-heartwork" },
  ],
  press: [
    { publisher: "Exchange4media", headline: "Lay's 'Smile Deke Dekho' campaign records 185 million impressions", url: "https://www.exchange4media.com/marketing-news/lays-wunderman-thompson-campaign-records-185-million-impressions-101187.html", sourceType: "trade-publication", geekMentioned: false, featured: true, validationNote: "Validates the wider campaign scale; publicly credited to Wunderman Thompson — not a Geek mention." },
    { publisher: "afaqs", headline: "Lay's puts a smile on their packs", url: "https://www.afaqs.com/news/social-media/lays-puts-a-smile-on-their-packs", sourceType: "independent-editorial", geekMentioned: false, validationNote: "Independent coverage of the packaging-personalisation activation (wider context)." },
    { publisher: "Social Samosa", headline: "Case Study: With 750+ influencers Lay's attempted an Instagram roadblock", url: "https://www.socialsamosa.com/2019/12/case-study-lays-product-packaging/", sourceType: "independent-editorial", geekMentioned: false, validationNote: "Independent case-study of the 750+ influencer packaging activation (wider scope)." },
  ],
  faqs: [
    { question: "Did Geek run the whole Smile Deke Dekho campaign?", answer: "No. The wider campaign was led by PepsiCo with Edelman and Wunderman Thompson. Geek executed the creator-activation layer. The 185M+ impressions and 750+ influencers reported publicly are wider-campaign figures." },
    { question: "Why does Smile Deke Dekho matter to the Lay's story?", answer: "It acquired the creator community that later campaigns reactivated — Heartwork's gratitude packs went to these same fan-club creators." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's Smile Deke Dekho campaign", secondaryKeywords: ["Lay's smile packs", "Lay's packaging influencer campaign", "Lay's personalised packs creators"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "CONFLICT: Geek first-party archive figures (e.g. 1,450+ influencers, 210M impressions, 25M engagement, 90%+ organic, 2,500+ features) differ from public reporting (750+ influencers, 185M impressions, 8.2M engagement, 75% earned). Recorded as CONFLICT in the ledger; public wider-campaign figures shown here, Geek-scope figures withheld from public until scope is reconcilable. Publicly credited to Edelman/WT.",
  },
  seo: { metaTitle: "Lay's Smile Deke Dekho — Creator Activation | Geek Creative Agency", metaDescription: "How the Lay's packaging-personalisation activation acquired a creator community Geek would reactivate for years — with honest scope on the wider campaign's numbers." },
};

/* 2 — HEARTWORK (Reactivate; built on Smile creators) */
export const heartwork: ProjectRecord = {
  slug: "lays-heartwork",
  title: "Lay's Heartwork",
  client: "Lay's (PepsiCo)",
  year: 2020,
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  shortSummary: "A gratitude campaign that reactivated the Lay's creator community built through Smile Deke Dekho.",
  cardSummary: "Reactivating the creator community with gratitude packs.",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Role in the story", heading: "Reactivate", body: "Heartwork thanked India's unsung heroes and, crucially for the relationship graph, sent Lay's gratitude packs to fan-club members — including the creators acquired through Smile Deke Dekho. This is the campaign that proved the community was an asset you could return to, not a list you rebuild." },
    { blockType: "sectionIntro", heading: "Geek creator-activation scope", body: "The figures below are from Geek's own creator-activation report and describe Geek's tracked activation subset, not the entire campaign. They are distinct from the wider Heartwork campaign (PepsiCo Design, brand-partner collaborations), whose separate figures are noted afterward." },
    { blockType: "metrics", heading: "Geek creator-activation report", items: [
      { value: "1,400", label: "Influencers reached / packs", note: "(Geek)" },
      { value: "1,058", label: "Creators activated", note: "(Geek)" },
      { value: "1,738", label: "Tracked posts + Stories", note: "(Geek) 853 posts + 885 Stories" },
      { value: "4.76M", label: "Tracked reach", note: "(Geek) tracked subset — not whole-campaign reach" },
      { value: "3.81M", label: "Engagement", note: "(Geek) tracked" },
      { value: "75%", label: "Organic participation", note: "(Geek)" },
    ] },
    { blockType: "sectionIntro", heading: "Historical creator economics (not audited ROI)", body: "Geek's report recorded a historical estimated creator-economics comparison: roughly ₹14L spend against roughly ₹158L estimated creator media value, i.e. a stated ~₹1.44Cr value comparison. These are historical, estimated creator-economics figures — not audited ROI, and not a financial return claim." },
    { blockType: "sectionIntro", heading: "Wider campaign context", body: "Independent media reported the broader Heartwork campaign at 1,400+ influencers, 8M+ total organic reach, 4,300+ posts/Stories, ~70,000 conversations and ~50M impressions via leading partner brands. Those wider figures include brand-partner amplification beyond Geek's tracked activation and are kept separate here." },
    { blockType: "cta", heading: "See the campaign that scaled the database", body: "MyLaysRelationchip activated the accumulated community at database scale.", buttonLabel: "MyLaysRelationchip", buttonHref: "/work/mylaysrelationchip" },
  ],
  press: [
    { publisher: "adgully", headline: "Lay's embarks on influencer outreach to praise 'Heartwork'", url: "https://www.adgully.com/lay-s-embarks-on-influencer-outreach-to-praise-heartwork-94267.html", sourceType: "independent-editorial", geekMentioned: false, featured: true, publicationDate: "2020-07-01", validationNote: "Independent validation of the Heartwork influencer outreach and gratitude-pack mechanic; supports Smile→Heartwork continuity." },
    { publisher: "Social Samosa", headline: "Lay's joins hands with leading brands to thank the #Heartwork of unsung heroes", url: "https://www.socialsamosa.com/2020/07/lays-india-heartwork-campaign/", sourceType: "independent-editorial", geekMentioned: false, publicationDate: "2020-07-01", validationNote: "Independent coverage of the wider campaign and partner-brand collaborations." },
  ],
  awards: [
    { awardBody: "Good Design Award", programName: "Good Design (Lay's Heartwork)", category: "Communication / Campaign", url: "https://good-design.org/projects/lays-heartwork-campaign/", geekCredited: false, creditedOrganizations: ["PepsiCo Design"], validationNote: "Recognised via PepsiCo Design's submission — credited to PepsiCo Design, not Geek." },
  ],
  faqs: [
    { question: "How did Heartwork build on Smile Deke Dekho?", answer: "Lay's sent Heartwork gratitude packs to fan-club members, including the creators acquired through Smile — reactivating an existing community rather than recruiting a new list." },
    { question: "Are the Heartwork numbers Geek's or the whole campaign's?", answer: "The 1,058 creators activated, 1,738 tracked posts+Stories and 4.76M tracked reach are from Geek's creator-activation report (a tracked subset). The wider campaign's 8M+ reach and ~50M partner-brand impressions are separate, wider-campaign figures." },
    { question: "Was the ₹1.44Cr a return on investment?", answer: "No. It is a historical, estimated creator-media-value comparison (~₹14L spend vs ~₹158L estimated media value), not audited ROI or a financial return." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's Heartwork campaign", secondaryKeywords: ["Lay's Heartwork influencers", "Lay's gratitude campaign", "Lay's Heartwork packs"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "Geek-scope figures align as a tracked SUBSET of the wider campaign (public: 1400+ influencers, 8M+ reach, 4300+ posts, 50M partner impressions). Nested scopes, not a conflict. Economics are estimated, not audited ROI. Strong continuity evidence (fan-club = Smile creators).",
  },
  seo: { metaTitle: "Lay's Heartwork — Reactivating a Creator Community | Geek", metaDescription: "The Lay's gratitude campaign that reactivated the creator community built through Smile Deke Dekho — with Geek-scope activation figures kept honest against wider-campaign totals." },
};

/* 3 — MYLAYSRELATIONCHIP (Scale; formal IRM relationship) */
export const myLaysRelationchip: ProjectRecord = {
  slug: "mylaysrelationchip",
  title: "Lay's #MyLaysRelationchip",
  client: "Lay's (PepsiCo)",
  year: 2021,
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  solutionSlugs: ["influencer-relationship-management"],
  shortSummary: "A Valentine's flavour launch activated across Lay's accumulated creator database — the strongest project-level evidence for Influencer Relationship Management.",
  cardSummary: "Database-scale creator activation for a Valentine's flavour launch.",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Role in the story", heading: "Scale", body: "#MyLaysRelationchip launched Lay's Herby Crush and Cheesy Love for Valentine's by activating the creator community accumulated over the previous campaigns at database scale. Creators shared their 'relationship status' with cue cards and hampers of the new flavours. This is the strongest project-level evidence for Influencer Relationship Management: Geek did not build a new list, it activated the existing one — and the campaign generated inbound demand." },
    { blockType: "sectionIntro", heading: "Geek creator-activation scope", body: "The figures below come from Geek's own final creator-activation report and describe Geek's activation, not the whole brand campaign. Public trade media reported the wider Valentine's campaign at different, smaller point-in-time numbers (see 'Scope & conflict')." },
    { blockType: "metrics", heading: "Geek creator-activation report", items: [
      { value: "2,900", label: "Influencers reached", note: "(Geek)" },
      { value: "2,700+", label: "Participated", note: "(Geek) 93% participation" },
      { value: "5,000+", label: "Posts + Stories", note: "(Geek) 2,300+ posts, 3,000+ Stories" },
      { value: "28M+", label: "Estimated creator reach", note: "(Geek, estimated) 70M+ combined follower base" },
      { value: "10M+", label: "Engagement", note: "(Geek)" },
      { value: "500+", label: "Inbound creators requesting to join", note: "(Geek) the clearest IRM signal" },
    ] },
    { blockType: "sectionIntro", heading: "Scope & conflict (read this before quoting a number)", body: "There is a genuine scope conflict on this campaign. Geek's report states 2,900 influencers reached and 28M+ estimated creator reach, with an estimated/perceived creator media value of ~₹5.57Cr (against ~₹21L spend; a stated ~₹5.3Cr historical value comparison — NOT audited ROI). Independent trade media, reporting the wider Valentine's campaign at a point in time, cited ~3,000+ micro-influencers, ~20 lakh (2M) views and an estimated media value of ~₹25–30 lakh, and did not mention Geek. These figures are not averaged or merged: they measure different things (Geek's full activation and retrospective estimated media value vs a public point-in-time media snapshot). Both are recorded, with scope, in the internal Evidence Ledger." },
    { blockType: "sectionIntro", heading: "Why this is the IRM proof point", body: "Geek's report explicitly refers to activating the overall influencer database, the Friends of Lay's community, expanding the influencer family, and inbound creators asking to participate. A campaign that produces 500+ unsolicited requests to join is not renting reach — it is activating a relationship. That is Influencer Relationship Management in action." },
    { blockType: "cta", heading: "The relationship layer behind the scale", body: "Friends of Lay's is the always-on community this campaign activated.", buttonLabel: "Friends of Lay's", buttonHref: "/work/friends-of-lays" },
  ],
  press: [
    { publisher: "medianews4u", headline: "Lay's brings alive the importance of every 'Relationchip' this Valentine's", url: "https://www.medianews4u.com/lays-rolls-out-an-engaging-brand-banter-this-valentines-day-brings-alive-the-importance-of-every-relationchip/", sourceType: "independent-editorial", geekMentioned: false, featured: true, publicationDate: "2021-02-01", validationNote: "Independent coverage of the #Relationchip Valentine's launch (wider scope; public figures differ from Geek report)." },
    { publisher: "BuzzInContent", headline: "Lay's onboards over 3000 micro-influencers for its Valentine's campaign", url: "https://www.buzzincontent.com/story/lay-single-s-onboards-over-3000-micro-influencers-for-its-valentine-single-s-day-campaign-what-single-s-your-relationchip-status-single/", sourceType: "independent-editorial", geekMentioned: false, publicationDate: "2021-02-01", validationNote: "Independent report of 3,000+ micro-influencers — wider-campaign point-in-time figure; conflicts in scope with Geek's report." },
  ],
  faqs: [
    { question: "How many influencers participated in #MyLaysRelationchip?", answer: "Geek's creator-activation report records ~2,900 influencers reached and 2,700+ participating (93%). Independent media reported the wider Valentine's campaign at 3,000+ micro-influencers — a different, point-in-time public figure. The scopes differ and are not merged." },
    { question: "What was the idea behind the campaign?", answer: "A Valentine's flavour launch (Herby Crush, Cheesy Love) where creators shared their 'relationship status' with cue cards and flavour hampers under #MyLaysRelationchip — activating Lay's existing creator community rather than a fresh list." },
    { question: "Why is this the strongest IRM evidence?", answer: "Geek's report explicitly describes activating the overall influencer database and the Friends of Lay's community, and records 500+ creators asking, unprompted, to participate — the defining signal of a managed creator relationship rather than a one-off list." },
    { question: "Is the ₹5.57Cr an ROI figure?", answer: "No. It is an estimated/perceived creator-media-value figure from Geek's report (against ~₹21L spend), i.e. a retrospective value comparison — not audited ROI." },
  ],
  searchStrategy: {
    primaryKeyword: "MyLaysRelationchip campaign", secondaryKeywords: ["Lay's Relationchip Valentine", "Lay's Herby Crush Cheesy Love", "Lay's micro influencer Valentine campaign", "Lay's database influencer activation"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "MAJOR CONFLICT recorded: Geek report (2,900 reached, 28M+ est. reach, ₹5.57Cr est. media value) vs public (3,000+ micro-influencers, ~2M views, ₹25–30L media value, no Geek mention). Different measurement objects; NOT averaged. Formal IRM Solution relationship is appropriate here.",
  },
  seo: { metaTitle: "Lay's #MyLaysRelationchip — Database-Scale Creator Activation | Geek", metaDescription: "The Valentine's flavour launch Geek activated across Lay's accumulated creator database — the strongest evidence for Influencer Relationship Management, with honest scope on every number." },
};

/* 4 — FRIENDS OF LAY'S (Institutionalise; ongoing program; IRM) */
export const friendsOfLays: ProjectRecord = {
  slug: "friends-of-lays",
  title: "Friends of Lay's",
  client: "Lay's (PepsiCo)",
  projectKind: "ongoing-program",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  solutionSlugs: ["influencer-relationship-management"],
  shortSummary: "Not a campaign — the always-on Lay's creator community and relationship layer that campaigns activated.",
  cardSummary: "The always-on Lay's creator community layer.",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Role in the story", heading: "Institutionalise", body: "Friends of Lay's is the relationship/community layer, not another campaign. It is Geek's name for the ongoing base of profiled, validated, repeatedly-activated Lay's creators — the asset that made each campaign faster, cheaper and more willing than the last, and the direct precursor to Influencer Relationship Management." },
    { blockType: "sectionIntro", heading: "Geek historical program figures", body: "Geek's later program analysis recorded, as historical program/database figures (not audited PepsiCo KPIs): approximately 10,000 creators reached historically, ~2,500 active creators, and ~500 repeat brand evangelists who participated in at least two campaigns. These describe Geek's managed creator database over time, not a single campaign's results." },
    { blockType: "metrics", heading: "Geek historical program/database figures", items: [
      { value: "~10,000", label: "Creators reached historically", note: "(program) Geek database figure, not an audited KPI" },
      { value: "~2,500", label: "Active creators", note: "(program)" },
      { value: "~500", label: "Repeat evangelists (2+ campaigns)", note: "(program) the retention core" },
    ] },
    { blockType: "sectionIntro", heading: "Continuity caution", body: "PepsiCo later used the phrase 'Friends of Lay's' publicly. This page does not claim that every later public use of the phrase was created or managed by Geek. The proven claim is narrower and stronger: Geek built and managed an ongoing Lay's creator community that its campaigns repeatedly activated." },
    { blockType: "cta", heading: "The method this community produced", body: "The Friends of Lay's relationship layer is what Geek productised as IRM.", buttonLabel: "Influencer Relationship Management", buttonHref: "/solutions/influencer-relationship-management" },
  ],
  faqs: [
    { question: "Is Friends of Lay's a campaign?", answer: "No. It is the ongoing creator community/relationship layer that individual Lay's campaigns activated — the always-on base of profiled, validated, repeatedly-engaged creators." },
    { question: "Did Geek create everything called 'Friends of Lay's'?", answer: "Geek built and managed the Lay's creator community that its campaigns activated. Later public uses of the phrase by PepsiCo are not claimed as Geek-managed unless specifically proven." },
  ],
  searchStrategy: {
    primaryKeyword: "Friends of Lay's", secondaryKeywords: ["Lay's creator community", "Lay's influencer community program", "Lay's fan club creators"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "Program, not campaign (projectKind=ongoing-program). Program figures are Geek historical database numbers, NOT audited PepsiCo KPIs. Public web enrichment PENDING — the named program is largely first-party; state continuity only where proven.",
  },
  seo: { metaTitle: "Friends of Lay's — The Creator Community Behind the Campaigns | Geek", metaDescription: "The always-on Lay's creator community Geek built and repeatedly activated — the relationship layer that became Influencer Relationship Management." },
};

/* 5 — LAY'S #KHOL (special-pack seeding; metrics UNVERIFIED) */
export const laysKhol: ProjectRecord = {
  slug: "lays-khol",
  title: "Lay's #KHOL",
  client: "Lay's (PepsiCo)",
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  shortSummary: "A Lay's special-pack seeding activation (Kholo Special Pack) with a telecom mechanic and creator reporting.",
  cardSummary: "Special-pack seeding with a telecom mechanic.",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Campaign context", heading: "Kholo Special Pack seeding", body: "First-party archive evidence (an October 2020 influencer brief for a Lay's Kholo Special Pack seeding, plus an influencer report) indicates a special-pack seeding activation with creator activation, a telecom/Airtel mechanic, and creator reporting. Geek's role was the creator-activation execution layer." },
    { blockType: "sectionIntro", heading: "Metric integrity — figures pending verification", body: "Headline metrics for this campaign have NOT been verified against the original campaign report and are therefore withheld rather than published. Later synthesis documents may contain numbers, but they are not published here until matched to the underlying execution/report evidence. The campaign story is told without inventing figures." },
  ],
  faqs: [
    { question: "What was Lay's #KHOL?", answer: "A Lay's special-pack (Kholo Special Pack) seeding activation with creator participation and a telecom mechanic, per first-party campaign briefs and reports. Headline metrics are pending verification against the original report." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's KHOL campaign", secondaryKeywords: ["Lay's Kholo special pack", "Lay's pack seeding influencers", "Lay's Airtel pack campaign"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "Aliases: #KHOL / Kholo Special Pack Seeding. Evidence: Influencer Brief - Lays Kholo Special Pack Seeding_21.10.2020, LaysKhol Influences Report.pdf. All headline metrics MISSING/UNVERIFIED until matched to the original report. Do NOT copy numbers from later synthesis docs. Keep DRAFT.",
  },
  seo: { metaTitle: "Lay's #KHOL — Special-Pack Creator Seeding | Geek", metaDescription: "A Lay's special-pack seeding activation with a telecom mechanic and creator reporting. Draft — headline metrics pending verification against the original campaign report." },
};

/* 6 — PAPER-THIN / WAFER-THIN (one campaign; aliases deduped) */
export const paperThinWaferThin: ProjectRecord = {
  slug: "lays-paperthin-waferthin",
  title: "Lay's Paper-Thin / Wafer-Thin",
  client: "Lay's (PepsiCo)",
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  shortSummary: "A single micro-influencer campaign around Lay's thin-chip story, consolidated from several working-title variants.",
  cardSummary: "Micro-influencer activation for the thin-chip story.",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Naming", heading: "One campaign, several working titles", body: "This is ONE campaign, not several. The archive's variants — #PaperThinWaferThin, #TheThinPossibleChip, Lay's Wafer Thin Magic, TheThinnestPossibleChip — are working titles/aliases for the same micro-influencer activation and are consolidated into a single record here." },
    { blockType: "sectionIntro", heading: "Campaign context", body: "First-party evidence (original and updated micro-influencer briefs, a dedicated campaign spreadsheet, a 'Wafer Thin Magic' sheet, client LIVE sheets and delivery sheets) indicates a micro-influencer execution around Lay's thin-chip proposition, with Geek handling the creator-activation layer." },
    { blockType: "sectionIntro", heading: "Metric integrity — figures pending verification", body: "A later Drive draft references a 2,300+ influencer scale. That figure is treated as UNVERIFIED until matched to the underlying execution/report evidence, and is not published merely because it appears in a drafted document. Headline metrics are withheld pending verification." },
  ],
  faqs: [
    { question: "Are #PaperThinWaferThin and #TheThinPossibleChip different campaigns?", answer: "No. They (with 'Wafer Thin Magic' and 'TheThinnestPossibleChip') are working-title variants of the same micro-influencer campaign, consolidated into one record." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's Wafer Thin campaign", secondaryKeywords: ["Lay's PaperThinWaferThin", "Lay's TheThinPossibleChip", "Lay's Wafer Thin Magic", "Lay's thin chip influencer campaign"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "DEDUP: one canonical title 'Paper-Thin / Wafer-Thin'; aliases preserved here for search. The later-doc '2,300+ influencers' figure is UNVERIFIED — do not publish until matched to execution evidence. Keep DRAFT.",
  },
  seo: { metaTitle: "Lay's Paper-Thin / Wafer-Thin — Micro-Influencer Activation | Geek", metaDescription: "One consolidated micro-influencer campaign around Lay's thin-chip story (several working titles). Draft — headline scale pending verification." },
};

/* 7 — SIZZLIN' HOT (organic creators + paid TVC repost; scopes reconciled) */
export const sizzlinHot: ProjectRecord = {
  slug: "lays-sizzlin-hot",
  title: "Lay's Sizzlin' Hot",
  client: "Lay's (PepsiCo)",
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  shortSummary: "A Lay's Sizzlin' Hot activation combining organic creator work with a paid TVC repost/amplification layer.",
  cardSummary: "Organic creators plus paid TVC amplification.",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Campaign context", heading: "Organic creators + paid TVC repost", body: "First-party evidence (a Lay's Sizzlin' Hot campaign sheet, an 'end' sheet, and a 'Sizzling Hot TVC Repost Paid Report') indicates two distinct layers: organic creator activation and a paid TVC repost/amplification component around the master TVC campaign." },
    { blockType: "sectionIntro", heading: "Scope reconciliation", body: "These layers must not be conflated. Geek's scope was the creator activation and the paid repost/amplification of the TVC among creators — NOT the master TVC campaign itself, which belongs to the wider brand effort. The whole TVC campaign is not attributed to Geek." },
    { blockType: "sectionIntro", heading: "Metric integrity — figures pending verification", body: "Headline metrics are withheld pending verification against the original reports, and the organic vs paid-repost vs master-TVC scopes will be labelled separately when figures are confirmed." },
  ],
  faqs: [
    { question: "Did Geek run the Lay's Sizzlin' Hot TV campaign?", answer: "No. Geek's scope was the creator activation and the paid TVC repost/amplification among creators. The master TVC campaign was part of the wider brand effort and is not attributed to Geek." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's Sizzlin Hot campaign", secondaryKeywords: ["Lay's Sizzling Hot influencers", "Lay's TVC repost creators", "Lay's Sizzlin Hot paid amplification"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "Reconcile 3 scopes: organic creator work vs paid TVC repost vs master TVC. Attribute only creator activation + paid repost to Geek. Metrics UNVERIFIED pending original reports. Keep DRAFT.",
  },
  seo: { metaTitle: "Lay's Sizzlin' Hot — Creator Activation & TVC Repost | Geek", metaDescription: "A Lay's Sizzlin' Hot activation combining organic creators with paid TVC amplification. Draft — scopes reconciled; metrics pending verification." },
};

/* 8 — LAY'S GOURMET (existence + role established; explicit evidence gap) */
export const laysGourmet: ProjectRecord = {
  slug: "lays-gourmet",
  title: "Lay's Gourmet",
  client: "Lay's (PepsiCo)",
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  shortSummary: "A Lay's Gourmet creator activation — draft record retained with an explicit evidence gap.",
  cardSummary: "Lay's Gourmet creator activation (evidence gap).",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Campaign context", heading: "Lay's Gourmet", body: "Multiple dedicated 'Lay's Gourmet' first-party sheets indicate a Lay's Gourmet creator activation in which Geek played a creator-activation role. Enough evidence exists to establish the campaign's existence and Geek's involvement." },
    { blockType: "sectionIntro", heading: "Explicit evidence gap — do not publish", body: "The available evidence is insufficient to establish dates, results, scale or strategy without inventing them. This record is therefore an intentional DRAFT with a declared evidence gap: it exists so the campaign is catalogued, but must not be published until first-party mechanic and metric evidence is confirmed. No figures are stated." },
  ],
  faqs: [
    { question: "What is known about Lay's Gourmet?", answer: "First-party sheets confirm a Lay's Gourmet creator activation with Geek involvement. Dates, mechanic detail, scale and results are not yet established and are deliberately not stated; the record remains an unpublished draft." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's Gourmet campaign", secondaryKeywords: ["Lay's Gourmet influencers", "Lay's Gourmet creator activation"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "Existence + Geek role established from 'Lay's Gourmet' sheets; mechanic/dates/metrics INSUFFICIENT → declared evidence gap. Keep DRAFT, do not publish until first-party mechanic + metrics confirmed.",
  },
  seo: { metaTitle: "Lay's Gourmet — Creator Activation | Geek", metaDescription: "A Lay's Gourmet creator activation. Draft with a declared evidence gap — not published until first-party mechanic and metrics are confirmed." },
};

/* 9 — LAY'S KFC BANGLADESH (single record; Dhaka-Meet relationship to resolve) */
export const laysKfcBangladesh: ProjectRecord = {
  slug: "lays-kfc-bangladesh",
  title: "Lay's KFC Bangladesh",
  client: "Lay's (PepsiCo)",
  projectKind: "campaign",
  renderMode: "flexible",
  companySlug: "pepsico",
  brandSlug: "lays",
  businessCategorySlugs: FMCG,
  serviceSlugs: IM,
  shortSummary: "A Lay's KFC activation in Bangladesh — single record pending resolution of its relationship to the 'Dhaka Bangladesh Meet' material.",
  cardSummary: "Lay's KFC Bangladesh activation (resolution pending).",
  sections: [
    { blockType: "sectionIntro", eyebrow: "Campaign context", heading: "Lay's KFC, Bangladesh", body: "First-party archive material ('Lays KFC Bangladesh' and a 'Dhaka Bangladesh Meet Campaign') indicates a Lay's KFC creator/meet activation in Bangladesh. This is recorded as a single draft until evidence determines the relationship between the two archive items." },
    { blockType: "sectionIntro", heading: "Resolution required — one record until proven otherwise", body: "It is not yet established whether 'Lays KFC Bangladesh' and 'Dhaka Bangladesh Meet Campaign' are (A) the same campaign, (B) phases of one activation, or (C) separate campaigns. Per the no-duplication rule, only ONE draft is created until evidence supports two. Headline metrics are withheld pending verification." },
  ],
  faqs: [
    { question: "Is 'Lays KFC Bangladesh' the same as the 'Dhaka Bangladesh Meet'?", answer: "Not yet determined. They may be the same campaign, phases of one activation, or separate campaigns. A single draft is kept until first-party evidence resolves this; no second record is created speculatively." },
  ],
  searchStrategy: {
    primaryKeyword: "Lay's KFC Bangladesh campaign", secondaryKeywords: ["Lay's Bangladesh influencers", "Dhaka Bangladesh Lay's meet", "Lay's KFC creator activation"],
    searchIntent: "branded", targetMarket: "India", keywordResearchDate: "2026-09-02",
    searchNotes: "Geography note: uses FMCG industry per spec (no separate geo taxonomy). RESOLUTION PENDING: 'Lays KFC Bangladesh' vs 'Dhaka Bangladesh Meet Campaign' = same / phases / separate? One draft only until proven. Metrics UNVERIFIED. Keep DRAFT.",
  },
  seo: { metaTitle: "Lay's KFC Bangladesh — Creator Activation | Geek", metaDescription: "A Lay's KFC creator activation in Bangladesh. Draft — relationship to the 'Dhaka Bangladesh Meet' material and metrics pending resolution." },
};

export const projects: ProjectRecord[] = [
  smileDekeDekho, heartwork, myLaysRelationchip, friendsOfLays,
  laysKhol, paperThinWaferThin, sizzlinHot, laysGourmet, laysKfcBangladesh,
];
