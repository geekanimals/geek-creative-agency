/**
 * /influence page — Geek's influencer marketing, A to Z. Normalized model +
 * approved fallback copy. Admin: Pages → Influence Page.
 *
 * Sources: Geek's influencer site (contact756434.wixsite.com/my-site-2 — Models,
 * Process, Hampers, Case Studies pages and posts), Geek's final campaign reports
 * (via the case studies on this site) and Geek Influencer OS (brand login).
 * Counts are taken as published there; nothing is invented.
 */
export type InfluenceCard = { title: string; body: string; tag?: string; href?: string };
export type InfluenceSeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };

export type InfluencePageModel = {
  hero: {
    eyebrow: string;
    heading: string;
    highlight: string;
    intro: string;
    primaryLabel: string;
    primaryHref: string;
    brandLoginLabel: string;
    brandLoginHref: string;
  };
  tiers: { heading: string; items: string[] };
  models: { eyebrow: string; heading: string; items: InfluenceCard[] };
  steps: { eyebrow: string; heading: string; closing: string; items: { title: string; body: string }[] };
  platform: {
    eyebrow: string;
    heading: string;
    body: string;
    features: string[];
    buttonLabel: string;
    buttonHref: string;
    creatorLabel: string;
    creatorHref: string;
  };
  hampers: { eyebrow: string; heading: string; intro: string; items: InfluenceCard[] };
  stories: { eyebrow: string; heading: string; items: InfluenceCard[] };
  clients: { heading: string; items: string[] };
  cta: { heading: string; highlight: string; label: string; href: string; secondaryLabel: string; secondaryHref: string };
  seo: InfluenceSeo;
};

export const BRAND_LOGIN_URL = "https://bountythreads.geekcreativeagency.com/brands";

export const INFLUENCE_FALLBACK: InfluencePageModel = {
  hero: {
    eyebrow: "Influence.",
    heading: "1 or 1,000+.\nInfluence\nat scale.",
    highlight: "at scale.",
    intro:
      "Hire an army of content creators. One celebrity or a thousand creators in a week: we find them, brief them, ship to them and track every post. Brands follow the whole campaign live on Geek Influencer OS.",
    primaryLabel: "Start a campaign",
    primaryHref: "/build-my-brand",
    brandLoginLabel: "Brand login",
    brandLoginHref: BRAND_LOGIN_URL,
  },
  tiers: {
    heading: "Creators we work with.",
    items: ["Celebrity", "Macro", "Micro", "Nano", "UGC", "Regional"],
  },
  models: {
    eyebrow: "Six models",
    heading: "Pick how you want to work with creators.",
    items: [
      {
        title: "Barter.",
        tag: "Product for content",
        body: "Best for a new product. Creators receive a gift hamper and review it in return for a post, a video and a Story.",
      },
      {
        title: "Payout.",
        tag: "Paid deliverables",
        body: "Creators are paid for a post, Story or video. The brand funds the payouts to Geek in advance so the campaign runs without delays.",
      },
      {
        title: "Re-post.",
        tag: "Stretch your own post",
        body: "Creators re-post the brand's own Instagram post or film to take it far beyond the brand's followers. Doritos India and Quaker India ran this way.",
      },
      {
        title: "Cashback.",
        tag: "Ratings & reviews",
        body: "Creators order from the brand's website and the brand refunds the cost as cashback, building ratings, reviews and sales on the site.",
      },
      {
        title: "Amazon.",
        tag: "Marketplace reviews",
        body: "Creators buy the product on Amazon and the brand refunds the full bill. The refund amount is transferred to Geek in advance.",
      },
      {
        title: "Influencers Meet.",
        tag: "Store launches",
        body: "For a store launch, Geek hosts a bloggers' meet on a set date. Creators visit, get a meal, goodies or a payout, and share the experience.",
      },
    ],
  },
  steps: {
    eyebrow: "A to Z",
    heading: "How a campaign actually runs.",
    closing: "Every creator, every box, every post — tracked.",
    items: [
      {
        title: "Ideation.",
        body: "We plan the campaign from scratch around the end objective: what the brand needs people to do, feel or buy, and which creators can make that happen.",
      },
      {
        title: "Campaign design.",
        body: "The groundwork: the model (barter, payout, re-post…), creator tiers, cities and languages, the deliverables, the hashtags and the go-live date.",
      },
      {
        title: "Purchase order.",
        body: "The brand raises a purchase order and the advance, so creator payouts and shipping never hold the campaign up.",
      },
      {
        title: "Invitation.",
        body: "Every shortlisted creator gets an invitation with the campaign brief, so they know exactly what they are signing up for.",
      },
      {
        title: "Live tracking.",
        body: "We track who accepts the barter or the deal, and what each creator has agreed to deliver.",
      },
      {
        title: "Sort & filter.",
        body: "The final list is filtered by location, city and region where the brand needs it: a state, a language, a metro.",
      },
      {
        title: "Hamper & merchandise.",
        body: "The product and merchandise are sourced and packed in a hamper designed to be unboxed on camera, because the box often decides the post.",
      },
      {
        title: "Shipment.",
        body: "Packages are labelled and couriered to the final list, with every delivery tracked until it reaches the creator.",
      },
      {
        title: "Follow-up brief.",
        body: "Every creator who received a box gets the final brief and deliverables, so everyone posts on message and on time.",
      },
      {
        title: "Campaign goes live.",
        body: "Posting starts on the chosen date. We track and manage every creator's post, Story and Reel as it goes up.",
      },
      {
        title: "Reporting.",
        body: "The campaign is reported end to end: creators who posted, posts, Stories, Reels, views, engagement and the links to every piece of content.",
      },
    ],
  },
  platform: {
    eyebrow: "Geek Influencer OS",
    heading: "Your campaign, live.\nIn one login.",
    body:
      "Every Geek campaign runs on Geek Influencer OS, our own platform for creators, brands and agencies. Brands sign in to see their campaigns, approve creators and videos, and download reports, without chasing anyone on email.",
    features: [
      "See every campaign live",
      "Approve creators before they're confirmed",
      "Approve videos before they go up",
      "Download the reports",
      "Sign in with Facebook, or the login the Geek team sends you",
    ],
    buttonLabel: "Brand login",
    buttonHref: BRAND_LOGIN_URL,
    creatorLabel: "Are you a creator? Join here",
    creatorHref: "/creators#join",
  },
  hampers: {
    eyebrow: "Hampers",
    heading: "Boxes made to be opened on camera.",
    intro:
      "In a barter campaign the hamper is the first thing a creator — and their audience — sees. These are some we've built with brands.",
    items: [
      { title: "Lay's #Heartwork", tag: "Lay's", body: "A creative outer box marked with a heart, carrying three Lay's flavours, sent with personalised letters.", href: "/work/lays-heartwork" },
      { title: "Kurkure × Masaba", tag: "Kurkure", body: "A festive collaboration with Masaba Gupta: three Kurkure flavours in packs designed exclusively by her.", href: "/work/kurkure-masaba" },
      { title: "Doritos creator box", tag: "Doritos", body: "Three Doritos flavours and a selfie light, plus a few things to help creators shoot better content." },
      { title: "Sting energy kit", tag: "Sting", body: "A mini Sting bottle, a cap and a Sting T-shirt, built to energise the creators first.", href: "/work/sting-energy" },
      { title: "Pepsi × Money Heist", tag: "Pepsi", body: "A minimal golden box with special-edition Pepsi bottles and a card made only for creators." },
      { title: "Pepsi #SwagSeSolo", tag: "Pepsi", body: "A premium Valentine's hamper of Pepsi's most popular products, for celebrity creators." },
      { title: "7UP festive box", tag: "7UP", body: "A limited-edition celebration pack: two 7UP bottles and a card, with packaging worth showing off." },
      { title: "Lipton Ice Tea Holi kit", tag: "Lipton", body: "For Holi 2022: Lipton drinks, a branded bottle, Holi colours and a colourful wig. An experience, not just a product." },
      { title: "Slice summer hamper", tag: "Slice", body: "For the 2022 “Sabse Thick Sabse Tasty” challenge: a branded cap, a big Slice bottle and a mango-drink glass." },
      { title: "Dettol care hamper", tag: "Dettol", body: "Dettol's best sellers in one box: body wash, soap, sanitiser spray, wipes, disinfectant and handwash." },
      { title: "Kurkure flavour box", tag: "Kurkure", body: "Kurkure in several flavours, packed in a box as loud and colourful as the snack." },
      { title: "Pepsi home-delivery box", tag: "Pepsi", body: "Designed around the unboxing moment, for creators receiving it at home." },
    ],
  },
  stories: {
    eyebrow: "Case studies",
    heading: "Campaigns creators made famous.",
    items: [
      { title: "#MyLaysRelationchip", tag: "Lay's · Barter", body: "2,700+ creators shared their “relationchip status” for the Valentine's launch of Herby Crush and Cheesy Love.", href: "/work/mylaysrelationchip" },
      { title: "#KHOL", tag: "Lay's · Barter", body: "The Kholo Special Pack, seeded with 2,500 creators; 2,000+ took part.", href: "/work/lays-khol" },
      { title: "#SmileDekeDekho", tag: "Lay's · Barter", body: "Lay's customised packs with creators' own smiles for 350+ influencers.", href: "/work/smile-deke-dekho" },
      { title: "#KurkurexMasaba", tag: "Kurkure · Barter", body: "A limited-edition festive hamper designed by Masaba Gupta, sent to 650 creators.", href: "/work/kurkure-masaba" },
      { title: "#EnergyBoleTohSting", tag: "Sting · Barter", body: "575+ Instagram creators amplified Sting's TV commercial in March 2022.", href: "/work/sting-energy" },
      { title: "#ForTheBold", tag: "Doritos · Barter", body: "Augmented reality and creators, to take Doritos to Gen Z.", href: "/work/doritos-for-the-bold" },
      { title: "#Pepsiaurbhizyadarefreshinghai", tag: "Pepsi · Barter", body: "1,100+ creators danced to the new jingle; the hashtag was used over six times the original target." },
      { title: "#PepsiMoneyHeistParty", tag: "Pepsi · Barter", body: "Pepsi × Netflix: 1,100+ creators re-posted the film with Nora Fatehi for the Money Heist finale." },
      { title: "#MeTimeForPositiVEETy", tag: "Veet · Barter", body: "With Sara Ali Khan and Shraddha Kapoor, hundreds of creators shared their “me time”." },
      { title: "#LiptonHoli", tag: "Lipton · Barter", body: "Over 30 celebrities promoted Lipton Ice Tea's Holi hamper on Instagram." },
      { title: "#NiveaSoftFreshBatch", tag: "Nivea · Payout", body: "Discovering and empowering India's budding creators — 150+ took part." },
      { title: "#WorkoutFromHome", tag: "Gatorade · Payout", body: "With PV Sindhu's video as the start, creators from sports, fitness and yoga joined in, on a ₹1L budget." },
      { title: "#BeTheRealFit", tag: "Quaker · Re-post", body: "18 hand-picked health and fitness creators re-posted Quaker's #BeTheRealFit film." },
      { title: "#DettolSalutes", tag: "Dettol · Barter", body: "Special-edition Dettol packs, shared by creators to salute the doctors, nurses and frontline workers of COVID." },
      { title: "#KurkureKhaoKFCPao", tag: "KFC × Lay's × Kurkure", body: "Three brands, one limited budget: a barter-and-payout campaign in Bangladesh that tapped each other's customers." },
    ],
  },
  clients: {
    heading: "Brands that hired the army.",
    items: ["Lay's", "Kurkure", "Pepsi", "Doritos", "7UP", "Sting", "Gatorade", "Quaker", "KFC", "Nivea", "Dettol", "Veet", "Lipton", "Flipkart", "Zivame", "Sleepwell"],
  },
  cta: {
    heading: "Ready to\ngo viral?",
    highlight: "go viral?",
    label: "Start a campaign",
    href: "/build-my-brand",
    secondaryLabel: "Brand login",
    secondaryHref: BRAND_LOGIN_URL,
  },
  seo: {
    metaTitle: "Influencer Marketing Agency in India — Geek Creative Agency",
    metaDescription:
      "1 or 1,000+ creators: barter, payout, re-post and more. How Geek runs influencer campaigns A to Z, with brands tracking it live on Geek Influencer OS.",
  },
};
