/**
 * /create page — how Geek runs campaigns (influencer, creator, UGC, TVC
 * amplification). Normalized model + approved fallback copy. Admin: Pages →
 * Create Page. Same shape as the Build page so both share components.
 *
 * Sources (Geek's Drive + Gmail, researched via ChatGPT on 2 Nov 2026): Geek's
 * influencer client-brief questionnaire, the Campaign Master tracker, final
 * campaign reports (Kurkure × Masaba, Kurkure #BoreNoMore, Lay's #Heartwork,
 * Lay's #MyLaysRelationchip, Sting #EnergyBoleTohSting, Mountain Dew, 7UP) and
 * Beardo briefs. Only counts from final reports are used as numbers — no
 * "estimated reach", media value or savings.
 */
import type { BuildPageModel } from "@/lib/site/buildFallback";

export type CreatePageModel = BuildPageModel;

export const CREATE_FALLBACK: CreatePageModel = {
  hero: {
    eyebrow: "Create.",
    heading: "An ad gets seen.\nAn idea\ngets shared.",
    highlight: "gets shared.",
    intro:
      "Most of our campaigns don't run on media budgets. They run on people. We turn a brand's idea into something hundreds, sometimes thousands, of creators want to make and post, and we run every step in between: the brief, the creators, the boxes, the approvals and the report.",
  },
  phases: {
    eyebrow: "What we run",
    heading: "Four kinds of campaigns.",
    items: [
      {
        label: "01",
        title: "Seeding & hampers.",
        subtitle: "Boxes people want to open",
        body: "Custom hampers, letters and limited packs sent to creators across India. For Lay's #Heartwork we prepared 1,400 boxes during the lockdown.",
      },
      {
        label: "02",
        title: "Creator challenges.",
        subtitle: "Filters · dances · trends",
        body: "A mechanic people can join: an AR filter, a dance, a dare. Lay's #MyLaysRelationchip, Sting #StingMachaDeChallenge, Kurkure #CountthePuffs.",
      },
      {
        label: "03",
        title: "TVC amplification.",
        subtitle: "One ad, thousands of feeds",
        body: "We take a television commercial and put it on creator feeds, region by region. Mountain Dew, 7UP and Sting #EnergyBoleTohSting.",
      },
      {
        label: "04",
        title: "UGC & scripted reels.",
        subtitle: "Brand-ready creator content",
        body: "Scripts, shot flows and briefs for reels a brand can use: product shown, message clear, 9:16, 20–25 seconds. Our Beardo work runs this way.",
      },
    ],
  },
  steps: {
    eyebrow: "Behind every campaign",
    heading: "How we run a campaign.",
    closing: "One idea. Hundreds of creators. Every one tracked.",
    items: [
      {
        title: "Capture the brief.",
        body:
          "Our brief questionnaire starts with one rule: capture every strategic and operational detail before execution. Objective, audience, cities and languages, platforms, creator tiers, budget, barter or paid, approvals, and what success should look like.",
      },
      {
        title: "Shape the idea and the script.",
        body:
          "Then the idea people will actually want to join, and, where the brand needs it, the script: shot flow, dialogue, product moments and the line it must say. For Beardo that meant Hinglish reels, shot vertical, with the product shown in three clear steps.",
        linkLabel: "Beardo",
        linkHref: "/work/beardo-godfather-flankers-ugc",
      },
      {
        title: "Find the right creators.",
        body:
          "Creators are filtered from our database by tier, city, language and category, and the shortlist moves straight into the campaign sheet. For Mountain Dew that was 1,000 creators across Punjab, Uttar Pradesh, Delhi NCR, Rajasthan and Haryana.",
        linkLabel: "Mountain Dew",
        linkHref: "/work/mountain-dew-conquer-with-courage",
      },
      {
        title: "Talk to every one of them.",
        body:
          "No mass blasts. For Kurkure × Masaba we connected with each creator individually, briefed them and followed up after delivery. 650 were reached; 525 posted.",
        linkLabel: "Kurkure × Masaba",
        linkHref: "/work/kurkure-masaba",
      },
      {
        title: "Agree the terms.",
        body:
          "Barter or paid, decided up front. Creators sign a contract that covers deliverables, usage rights and disclosure, so every post is clear about being a partnership.",
      },
      {
        title: "Pack it. Ship it. Track it.",
        body:
          "Hampers are designed, packed and couriered across the country, with a tracking ID for every box. Lay's #Heartwork shipped 1,400 boxes in the middle of a lockdown; on Kurkure #BoreNoMore, 99% of deliveries arrived.",
        linkLabel: "Lay's #Heartwork",
        linkHref: "/work/lays-heartwork",
      },
      {
        title: "Brief, approve, publish.",
        body:
          "Creators get the talking points, hashtags and tags. Drafts are approved before they go live, posts carry the #ad / partnership label, and every live link comes back to us.",
      },
      {
        title: "Track every creator.",
        body:
          "Each creator moves through one pipeline: registered, approved, confirmed, sent to courier, delivered, campaign completed, deliverables approved, payment done. Nothing slips between a spreadsheet and a WhatsApp.",
      },
      {
        title: "Report, and learn.",
        body:
          "The final report counts what happened: creators who posted, posts, Stories, Reels, views, likes, comments and content links. It also writes down what to fix next time, from courier problems to packaging feedback.",
        linkLabel: "Kurkure #BoreNoMore",
        linkHref: "/work/kurkure-bore-no-more",
      },
    ],
  },
  capabilities: {
    heading: "Creators we work with.",
    items: ["Celebrity", "Macro", "Micro", "Nano", "UGC", "Regional"],
  },
  showcase: {
    eyebrow: "The campaigns",
    heading: "Ideas creators wanted to share.",
    storySlugs: ["kurkure-masaba", "lays-heartwork", "sting-energy", "7up-super-duper-refresher"],
  },
  portfolio: {
    heading: "What every campaign runs on.",
    note: "Our own campaign tracker — from the first filter to the last payment.",
    items: [
      "Brief questionnaire",
      "Creator filters",
      "Campaign sheets",
      "Courier tracking",
      "Creator contracts",
      "Content approvals",
      "Post-link tracking",
      "Final reports",
    ],
  },
  proof: {
    eyebrow: "From the final reports",
    heading: "What that looked like.",
    items: [
      { value: "2,700+", label: "creators took part in Lay's #MyLaysRelationchip, with 5k+ posts and Stories", href: "/work/mylaysrelationchip" },
      { value: "1,400", label: "custom boxes sent for Lay's #Heartwork, during the lockdown", href: "/work/lays-heartwork" },
      { value: "96%", label: "of creators contacted posted for Kurkure #BoreNoMore (890 of 926)", href: "/work/kurkure-bore-no-more" },
      { value: "1,686", label: "Reels, posts and Stories from 914 creators in four days for Mountain Dew", href: "/work/mountain-dew-conquer-with-courage" },
      { value: "1.3 MN", label: "views from 1,000 creator posts for 7UP in three days", href: "/work/7up-super-duper-refresher" },
      { value: "839.1K", label: "views for Sting #EnergyBoleTohSting, from 575+ creators", href: "/work/sting-energy" },
    ],
  },
  cta: {
    heading: "Got an idea\nthat needs people?",
    highlight: "needs people?",
    label: "Talk to Geek",
    href: "/build-my-brand",
    secondaryLabel: "See all campaigns",
    secondaryHref: "/work/influencer-marketing",
  },
  seo: {
    metaTitle: "How Geek Runs Creator Campaigns — Geek Creative Agency",
    metaDescription:
      "Seeding, creator challenges, TVC amplification and UGC: how Geek runs influencer campaigns with hundreds of creators, from the brief to the final report.",
  },
};
