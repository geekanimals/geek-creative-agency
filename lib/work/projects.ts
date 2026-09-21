import { CaseStudy } from "./types";
import { heartwork as goldHeartwork, myLaysRelationchip as goldMyLaysRelationchip } from "@/content/gold-standard/lays/projects";

/**
 * Project data. Tags are PROVISIONAL starting classifications — edit freely
 * here without touching any component. No stats/results are invented: figures
 * appear only where real data was supplied, otherwise "The Impact" is omitted.
 *
 * Media uses `need` paths (labelled slots) until real files exist; set the
 * matching `heroImage`/`media.src` to render the real asset.
 */

const heroNeed = (folder: string) => `/assets/work/${folder}/hero.jpg`;

export const projects: CaseStudy[] = [
  // ── FLAGSHIP SAMPLE — fully populated template ──────────────────────────
  {
    slug: "the-coolest-job",
    brand: "Miller High Life",
    brandSlug: "miller-high-life",
    project: "The Coolest Job",
    year: 2011,

    businessCategory: ["fmcg", "food-beverage"],
    services: ["creative-strategy", "campaign-ideation", "integrated-creative", "digital", "social-media", "media", "experiential", "activation"],
    campaignTypes: ["brand-launch", "integrated-campaign", "interactive-experience", "recruitment-campaign"],
    businessOutcomes: ["brand-launch", "awareness", "engagement", "community-building", "acquisition", "brand-love", "advocacy"],

    // Section 01 — HERO: optimised recruitment film + poster (live HTML copy).
    // Master retained (archival, out of /public) at
    // /media-masters/the-coolest-job/hero/hero.mp4 (mpeg4, 10 MB). Web-optimised H.264:
    //   desktop ≥768px → hero-desktop.mp4 (2.0 MB) · mobile <768px → hero-mobile.mp4 (1.0 MB)
    //   reduced-motion/poster → hero-poster.webp (180 KB); hero-poster.jpg kept as fallback.
    heroVideo: "/assets/work/the-coolest-job/hero/hero-desktop.mp4",
    heroVideoMobile: "/assets/work/the-coolest-job/hero/hero-mobile.mp4",
    heroImage: "/assets/work/the-coolest-job/hero/hero-poster.webp",

    headline: "The Coolest Job",
    oneLineSummary:
      "Launching Miller High Life in India by turning its “Work Hard. Party Hard.” philosophy into a nationwide hunt for brand ambassadors.",

    // The whole documentary lives in the flexible editorial blocks.
    execution: [
      // Hero supporting statements
      { type: "statement", tone: "light", size: "mega", text: "How do you launch\na beer brand\nwhen you can't\noutspend the market?" },
      { type: "statement", tone: "dark", size: "giant", text: "You don't\nbuy attention.\n\nYou create\nsomething people\nwant to join.", accent: "want to join." },

      // 02 — The business challenge
      {
        type: "statement",
        tone: "light",
        size: "giant",
        text: "The problem\nwasn't just\nlaunching a beer.\n\nIt was\ngetting noticed.",
        sub: "Miller High Life was entering an Indian beer market where established players already commanded enormous visibility, nightlife associations and marketing muscle. Kingfisher was deeply embedded in India's entertainment, nightlife and event culture, while international premium beer brands were also competing aggressively for the same urban consumer. Miller was relatively unknown in India. And Geek did not have a budget that could win a media arms race.",
      },
      { type: "statement", tone: "navy", size: "mega", text: "We couldn't\noutspend them.\n\nSo we had to\noutthink them.", accent: "outthink them." },

      // Founder-context comparison (safe formulation, not a factual attack)
      {
        type: "vs",
        tone: "navy",
        left: { big: "One hoarding.", small: "A single high-impact placement" },
        right: { big: "One year of launch thinking.", small: "Geek's entire launch" },
        note: "Competitors could spend on a single high-impact media placement what Geek had to make work across an entire launch.",
      },
      { type: "statement", tone: "light", size: "giant", text: "The answer\ncouldn't be\nmore media.\n\nIt had to be\na better idea.", accent: "a better idea." },

      // 03 — Positioning
      {
        type: "statement",
        tone: "miller",
        size: "mega",
        text: "The\nChampagne\nof Beers.",
        sub: "In its home market, Miller High Life had an accessible, democratic American heritage. In India, it was entering the market as a premium international lifestyle proposition. Contemporary Indian reporting referred to Miller as America's “Champagne of Beers” and described the Indian rollout as part of SABMiller's higher-end lifestyle portfolio.",
      },
      { type: "statement", tone: "light", size: "giant", text: "But premium\ncan't just be\na price.\n\nIt has to become\na culture.", accent: "a culture." },

      // 04 — Brand philosophy
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/campaign/work-hard-party-hard.png", alt: "Miller High Life — Work Hard. Party Hard.", ratio: "16/9" }, label: "Brand Philosophy" },
      {
        type: "statement",
        tone: "miller",
        size: "mega",
        text: "Work hard.\nParty hard.",
        sub: "Miller's target audience was the young urban professional. Ambitious by day. Social by night. The challenge was to make that philosophy something people could identify with — not merely something advertising told them.",
      },
      { type: "statement", tone: "dark", size: "giant", text: "Don't just\ntell people\nto live it.\n\nAsk them\nto prove it.", accent: "to prove it." },

      // 05 — The idea
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/campaign/campaign-identity.png", alt: "The Coolest Job — campaign identity", ratio: "16/9" }, label: "Campaign Identity" },
      {
        type: "statement",
        tone: "light",
        size: "mega",
        text: "The\nCoolest\nJob.",
        sub: "Instead of announcing Miller High Life with a conventional beer campaign, Geek created a nationwide recruitment hunt. The job? Become one of Miller High Life's ambassadors.",
      },
      { type: "steps", tone: "paper", heading: "Get paid to be", items: ["A Party Host.", "A Socialite.", "A Connector.", "The Face of the High Life."] },
      {
        type: "statement",
        tone: "dark",
        size: "giant",
        text: "A brand launch\ndisguised\nas a job offer.",
        accent: "a job offer.",
        sub: "The recruitment film offered compensation of more than ₹1,00,000 per month. Four ambassadors would ultimately be selected.",
      },

      // 06 — Don't reveal the brand
      {
        type: "statement",
        tone: "light",
        size: "giant",
        text: "First,\nwe sold\nthe idea.\n\nNot\nthe beer.",
        accent: "the idea.",
        sub: "The Coolest Job initially created intrigue around the opportunity itself. Applicants encountered the proposition, job language and social challenge before Miller High Life became the centre of the story. The brand reveal then became another event within the campaign.",
      },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/campaign/brand-reveal.png", alt: "The Coolest Job — brand reveal", ratio: "16/9" }, label: "The Brand Reveal" },
      { type: "statement", tone: "miller", size: "giant", text: "Then\nwe revealed\nwho was hiring.\n\nMiller\nHigh Life." },

      // 07 — The recruitment ad
      { type: "statement", tone: "light", size: "giant", text: "This\nwasn't\na beer ad.\n\nIt looked\nlike a job ad.", accent: "a job ad." },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/campaign/print-radio.png", alt: "The Coolest Job — archival print & radio recruitment references", ratio: "16/9" }, label: "Archival Recruitment · Print & Radio", caption: "Times Ascent / recruitment media references" },
      { type: "statement", tone: "dark", size: "giant", text: "Early to bed,\nearly to rise?\n\nDon't apply.", accent: "Don't apply.", sub: "Archival recruitment-style headlines spoke directly to applicants, not to beer drinkers." },
      {
        type: "gallery-h",
        label: "Campaign Creative",
        media: [
          { src: "/assets/work/the-coolest-job/campaign/weekday-weekend-social-creative.jpg", alt: "The Coolest Job — weekday / weekend social creative", ratio: "4/5" },
          { src: "/assets/work/the-coolest-job/campaign/brand-responsible-drinking-creative.jpg", alt: "Miller High Life — responsible drinking creative", ratio: "4/5" },
        ],
      },

      // 08 — The application became the campaign
      { type: "statement", tone: "light", size: "giant", text: "Applying\nwasn't enough.\n\nYou had to\ncampaign\nfor the job.", accent: "campaign" },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/application/prelaunch-apply-now.jpg", alt: "The Coolest Job — apply now screen", ratio: "16/10" }, label: "Facebook Application" },
      {
        type: "two-column",
        media: [
          { src: "/assets/work/the-coolest-job/application/prelaunch-like-screen.webp", alt: "The Coolest Job — like / entry screen", ratio: "4/5" },
          { src: "/assets/work/the-coolest-job/application/prelaunch-profile.jpg", alt: "The Coolest Job — applicant profile screen", ratio: "4/5" },
        ],
      },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/application/vineeth-vincent-profile.jpg", alt: "The Coolest Job — real applicant profile", ratio: "16/10" }, label: "Real Applicant Profile" },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/application/gamified-missions-ui.jpg", alt: "The Coolest Job — missions & gamification interface", ratio: "16/10" }, label: "Missions & Gamification" },
      {
        type: "gallery-h",
        label: "Application Screens",
        media: [
          { src: "/assets/work/the-coolest-job/application/prelaunch-twitter-stream.webp", alt: "Application — Twitter stream", ratio: "3/4" },
          { src: "/assets/work/the-coolest-job/application/prelaunch-vote-requests.webp", alt: "Application — vote requests", ratio: "3/4" },
          { src: "/assets/work/the-coolest-job/application/prelaunch-about.webp", alt: "Application — about", ratio: "3/4" },
        ],
      },
      { type: "steps", tone: "paper", heading: "The mechanics", items: ["Create a Profile.", "Get Votes.", "Get Recommendations.", "Build Social Proof.", "Upload Content.", "Complete Missions.", "Compete.", "Move Up."] },

      // 09 — Before influencer marketing became a category
      {
        type: "statement",
        tone: "dark",
        size: "giant",
        text: "Before\ninfluencer marketing\nbecame a category…\n\nWe were\nalready turning\npeople into media.",
        accent: "people into media.",
        sub: "Applicants didn't simply enter the campaign. To win, they promoted themselves. They brought friends. Asked for votes. Collected recommendations. Created content. Built social influence. And introduced The Coolest Job to their own networks. What would now be called creator advocacy or influencer marketing was built directly into the mechanics of the launch.",
      },
      { type: "funnel", tone: "dark", items: ["1 Applicant", "Their Network", "More People", "More Applications", "A Community"] },
      { type: "statement", tone: "navy", size: "mega", text: "The applicants\nbecame\nthe media plan.", accent: "the media plan." },

      // 10 — Online + offline
      { type: "statement", tone: "light", size: "mega", text: "Not\ndigital\nor offline.\n\nBoth.", accent: "Both." },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/activation/channel-ecosystem.png", alt: "The Coolest Job — channel ecosystem", ratio: "16/9" }, label: "The Channel Ecosystem" },
      {
        type: "two-column",
        media: [
          { src: "/assets/work/the-coolest-job/activation/sutra-resumes.png", alt: "Recruitment / Sutra HR resumes", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/campaign/brand-creatives-grid.jpg", alt: "The Coolest Job — brand creatives grid", ratio: "4/3" },
        ],
        caption: "Recruitment support ran through job portals and HR networks alongside print, radio and PR.",
      },
      {
        type: "statement",
        tone: "paper",
        size: "big",
        text: "One\ncoordinated\nsystem.",
        sub: "Digital: Facebook, microsite, YouTube, Google, display and Twitter. Recruitment: Naukri.com, job portals, HR networks and B-school / alumni networks. Traditional: print, radio and PR — with verified references including Times of India / Times Ascent, Radio Indigo and Fever 104.",
      },
      { type: "stat-band", tone: "paper", stats: [{ value: "~3,000", label: "Professional resumes", note: "generated via Sutra HR recruitment activity" }] },

      // 11 — The Goa final
      { type: "statement", tone: "dark", size: "mega", text: "36,908\napplied.\n\nOnly 64\nmade it\nto Goa.", accent: "64" },
      { type: "statement", tone: "light", size: "giant", text: "Online\nbecame\nreal life.", accent: "real life." },
      { type: "full-video", media: { src: "/assets/work/the-coolest-job/hero/hero-poster.webp", video: "/assets/work/the-coolest-job/activation/case-study-film-web.mp4", alt: "The Coolest Job — campaign film", ratio: "16/9" }, label: "The Coolest Job — Campaign Film", caption: "Archival campaign film" },
      {
        type: "statement",
        tone: "navy",
        size: "big",
        text: "A selection.\nNot an interview.",
        sub: "The final candidates were brought together for an intensive offline experience in Goa — built around personality, social confidence and the Work Hard / Party Hard lifestyle, with a selector panel drawn from India's youth, music and nightlife culture.",
      },

      // 13 — The final four
      { type: "funnel", tone: "navy", items: ["64", "4"] },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/results/four-ambassadors.png", alt: "The four High Life ambassadors", ratio: "16/9" }, label: "The Final Four" },
      { type: "statement", tone: "miller", size: "giant", text: "Four\nHigh Life\nambassadors." },

      // 14 — The campaign didn't end when the winners were chosen
      {
        type: "statement",
        tone: "light",
        size: "giant",
        text: "Winning\nthe job\nwas only\nthe beginning.",
        accent: "the beginning.",
        sub: "For roughly the following six months, the selected ambassadors represented Miller High Life in their home markets — Delhi, Mumbai, Kolkata and Bangalore. They hosted parties and social experiences, introduced new people to the brand and continued to embody the Work Hard / Party Hard lifestyle.",
      },
      { type: "statement", tone: "dark", size: "giant", text: "A campaign\nbecame\na network\nof human\nbrand ambassadors.", accent: "a network" },

      // 15 — The iPad game / on-ground activation
      { type: "statement", tone: "light", size: "giant", text: "The idea\nleft\nthe screen.", accent: "the screen." },
      {
        type: "statement",
        tone: "miller",
        size: "giant",
        text: "Work hard.\nParty hard.\n\nBecame\na game.",
        sub: "Geek developed an on-ground Miller High Life iPad experience built around the same brand philosophy. Players sorted Work and Party imagery by physically tilting the iPad. The game measured their Work / Party balance and turned product sampling into an interactive brand experience. The original concept included deployment across 30 iPads and lead capture, and contemporary external coverage confirms the iPad experience was used as part of Miller's sampling activity.",
      },
      { type: "full-image", media: { src: "/assets/work/the-coolest-job/activation/ipad-game-live.webp", alt: "The Miller High Life iPad game interface", ratio: "16/10" }, label: "On-Ground iPad Activation" },
      { type: "steps", tone: "paper", heading: "The same idea worked", items: ["Online.", "In print.", "On radio.", "On an iPad.", "In a bar.", "At a party.", "In Goa."] },
      { type: "statement", tone: "light", size: "big", text: "That's what made\nthe launch\nintegrated." },

      // 16 — The results (2011 campaign) — clearly separated from targets & post-campaign
      {
        type: "stat-band",
        tone: "light",
        heading: "The Results · 2011 launch campaign",
        stats: [
          { value: "36,908", label: "Applications" },
          { value: "111,121", label: "Facebook fans" },
          { value: "10,000", label: "Applications in under 26 days" },
          { value: "85%", label: "Linked Miller High Life with The Coolest Job" },
          { value: "93%", label: "Said the brand championed “Work Hard. Party Hard.”" },
          { value: "64", label: "Finalists shortlisted for Goa" },
          { value: "4", label: "High Life ambassadors" },
        ],
        note: "All figures above are 2011 launch-campaign results.",
      },
      {
        type: "stat-band",
        tone: "paper",
        heading: "Original internal target · for comparison",
        stats: [
          { value: "20,000", label: "Profiles (target)" },
          { value: "40,000", label: "Facebook fans (target)" },
        ],
        note: "These were internal TARGETS — shown for comparison, not results. The campaign delivered 36,908 applications and 111,121 fans.",
      },
      {
        type: "gallery-h",
        label: "Archival Results Graphics",
        media: [
          { src: "/assets/work/the-coolest-job/results/fans-applicants.png", alt: "Results — fans & applicants", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/results/brand-linkage.png", alt: "Results — brand linkage", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/results/10000-applications.png", alt: "Results — 10,000 applications", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/results/64-shortlisted.png", alt: "Results — 64 shortlisted", ratio: "4/3" },
        ],
      },

      // 17 — Award
      {
        type: "award",
        medal: "Gold",
        org: "Big Bang Awards",
        year: "2012",
        category: "Recruitment Campaign (Any Media)",
        project: "The Coolest Job",
        note: "The Coolest Job also received a Bronze for Online Campaign in Geek's legacy awards archive — but the Gold for the recruitment idea is the real story.",
      },

      // 18 — What came next
      { type: "statement", tone: "light", size: "giant", text: "The job\nended.\n\nThe community\ndidn't.", accent: "The community" },
      {
        type: "statement",
        tone: "dark",
        size: "giant",
        text: "The launch\nbecame\na digital\necosystem.",
        accent: "a digital\necosystem.",
        sub: "The audience and social infrastructure built around The Coolest Job gave Miller a base for continued digital engagement after the original recruitment campaign. The 2012 review deck shows the Miller ecosystem expanding into additional social applications, content properties, retail discovery and promotional activity.",
      },
      {
        type: "gallery-h",
        label: "The Miller Ecosystem · 2012",
        media: [
          { src: "/assets/work/the-coolest-job/post-campaign/facebook-page-2012.webp", alt: "Miller High Life — Facebook page, 2012", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/post-campaign/miller-patrol-facebook-app.webp", alt: "Miller Patrol — Facebook app", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/post-campaign/twitter-page-2012.webp", alt: "Miller High Life — Twitter, 2012", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/post-campaign/its-miller-time-contest.webp", alt: "It's Miller Time — contest", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/post-campaign/store-locator.webp", alt: "Miller High Life — store locator", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/post-campaign/miller-blog.webp", alt: "Miller High Life — blog", ratio: "4/3" },
          { src: "/assets/work/the-coolest-job/post-campaign/downloads-page.webp", alt: "Miller High Life — downloads", ratio: "4/3" },
        ],
      },
      { type: "stat-band", tone: "paper", stats: [{ value: "271K", label: "Facebook property", note: "Post-campaign · August 2012 — NOT within the original 60-day recruitment period" }] },

      // 19 — The real long-term win
      { type: "statement", tone: "dark", size: "mega", text: "But the\nbiggest result\nisn't\non this page.", accent: "on this page." },
      {
        type: "statement",
        tone: "light",
        size: "giant",
        text: "It's the people\nwho still\nremember it.",
        accent: "remember it.",
        sub: "Many members of the finalist cohort formed strong friendships through The Coolest Job. Years later, members of that group remain connected — and when they meet, The Coolest Job, and Miller High Life, remains part of the story of how they met.",
      },
      {
        type: "two-column",
        media: [
          { src: "/assets/work/the-coolest-job/community/social-community-1.png", alt: "The Coolest Job — community", ratio: "1/1" },
          { src: "/assets/work/the-coolest-job/community/social-community-2.png", alt: "The Coolest Job — community", ratio: "1/1" },
        ],
        caption: "The community that remained.",
      },
      { type: "statement", tone: "navy", size: "mega", text: "The brand\ndidn't just\nbuild reach.\n\nIt built\nrelationships.", accent: "relationships." },
      { type: "statement", tone: "dark", size: "mega", text: "And those\nrelationships\noutlived\nthe campaign.", accent: "outlived" },

      // 20 — Why it mattered
      { type: "statement", tone: "light", size: "giant", text: "People\ndidn't just\nsee the launch.\n\nThey\napplied\nto join it.", accent: "to join it." },
      { type: "statement", tone: "paper", size: "big", text: "They campaigned for it.\nThey brought their friends.\nThey met each other.\n\nFour of them\nbecame the brand.\n\nAnd years later,\nthe story\nstill exists." },
      {
        type: "statement",
        tone: "miller",
        size: "mega",
        text: "That's what\nwe mean by\n\nmaking\na brand\nmatter.",
        accent: "matter.",
        sub: "With a fraction of the media muscle available to larger competitors, Geek turned Miller High Life's Indian launch into an idea people could participate in. Recruitment became advertising. Applicants became advocates. Social became real-world experience. The campaign became community. And the brand became part of how a group of people met, connected and remembered a moment in their lives. — Geek Creative Agency.",
      },
    ],

    featured: true,
    homepageFeatured: true,
    publishStatus: "published", // approved — live in production

    seoTitle: "The Coolest Job — How Geek Launched Miller High Life in India | Geek Creative Agency",
    metaDescription:
      "How Geek launched Miller High Life in India with The Coolest Job — an integrated recruitment, social, gamification and experiential campaign that generated 36,908 applications and built a community around the brand.",
    ogImage: "/assets/work/the-coolest-job/hero/hero-poster.jpg",

    // ── INTERNAL-ONLY (never rendered) ──────────────────────────────────
    verificationStatus: "partially-verified",
    sourceNotes: [
      "VERIFIED (Geek archive/legacy awards): 36,908 applications; 111,121 Facebook fans; 10,000 applications in <26 days; 85% brand-link; 93% philosophy association; 64 finalists; 4 ambassadors; ~3,000 resumes via Sutra HR; Gold — Big Bang Awards 2012 (Recruitment, Any Media); Bronze — Online Campaign; 271K Facebook property (Aug 2012 review deck).",
      "TARGETS (internal, not results): 20,000 profiles; 40,000 Facebook fans.",
      "FOUNDER-SUPPLIED / NOT INDEPENDENTLY VERIFIED (used only via safe public formulations): competitor dominance (Kingfisher/Heineken); the ~₹1 crore single-hoarding vs annual-budget comparison (published only as 'a single high-impact placement vs an entire launch'); Goa selector identities incl. Nikhil Chinapa (NOT named publicly — 'panel drawn from India's youth, music and nightlife culture'); six-month post-launch ambassador activity across Delhi/Mumbai/Kolkata/Bangalore; long-term finalist friendships/careers (framed conservatively).",
      "HELD / NOT PUBLISHED: 33.5% vs 7% and 111% vs 70% benchmarks; 27,000 extra submissions; 100,000 avg views/post; names of the final four; any Goa judge/VJ names; 'India's first influencer marketing campaign'; 'before Instagram existed'; ₹1 crore as hard fact.",
      "ASSETS: all media wired to public/assets/work/the-coolest-job/asset-manifest.json (V2 pack). No fabricated filenames. Rights: confirm the print/radio recruitment reference is Geek/client archive (Class A) before publish.",
    ],
  },

  // ── GRID + FILTER PROJECTS (story pending) ──────────────────────────────
  {
    slug: "the-biere-club",
    brand: "The Biere Club",
    brandSlug: "the-biere-club",
    project: "Identity to Experience",
    businessCategory: ["hospitality"],
    services: ["branding", "naming", "design", "experiential"],
    campaignTypes: ["store-venue-launch", "brand-launch"],
    heroImageNeed: heroNeed("the-biere-club"),
    headline: "THE BIERE CLUB",
    oneLineSummary: "From identity to experience — India's first microbrewery, built as a brand.",
    featured: true,
    homepageFeatured: true,
    storyPending: true,
  },
  // ── FLAGSHIP #2 — HIGH ULTRA LOUNGE (long-term brand partnership) ─────────
  // Rendered by a bespoke campaign-skin template (components/work/HighUltraLounge)
  // dispatched from the shared /work/[slug] route — this entry supplies the shared
  // metadata (routing, Work grid card, filters, related/next, SEO/OG). Copy + asset
  // selection are locked to approved source docs. Claim guardrails: 421 ft only
  // (never 444); annual scope = "planned", never "executed"; sell-out attributed to
  // the archive record; mixology credited to High's bar team; no reach/click/follower
  // metrics.
  {
    slug: "high-ultra-lounge",
    brand: "High Ultra Lounge",
    brandSlug: "high-ultra-lounge",
    project: "Building a Nightlife Brand",
    year: 2014,

    businessCategory: ["hospitality", "food-beverage"],
    services: [
      "brand-strategy",
      "creative-strategy",
      "branding",
      "social-media",
      "digital",
      "content",
      "event-ip",
      "experiential",
      "print",
      "fnb-communication",
      "media",
      "pr-earned-media",
      "activation",
      "design",
    ],
    campaignTypes: ["brand-launch", "long-term-partnership", "brand-building", "event-activation"],
    businessOutcomes: ["brand-launch", "awareness", "engagement", "footfall", "retention", "brand-love"],

    // Real, optimized venue photograph — Work grid card, related tile, next banner, OG.
    heroImage: "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg",

    headline: "WE DIDN'T JUST\nLAUNCH HIGH.\nWE BUILT ITS\nCALENDAR.",
    oneLineSummary:
      "A rooftop lounge in Bengaluru — and a multi-year creative partnership that kept giving Bengaluru reasons to return.",

    seoTitle: "High Ultra Lounge — Building a Nightlife Brand | Geek Creative Agency",
    metaDescription:
      "How Geek helped launch and build High Ultra Lounge through recurring event properties, creative campaigns, food and cocktail experiences, digital, print and on-ground execution.",

    featured: true,
    homepageFeatured: true,
    publishStatus: "published",

    verificationStatus: "partially-verified",
    sourceNotes: [
      "Story + asset selection locked to approved source docs (held in _private-source/, out of /public).",
      "GREEN (published): venue facts (2014, WTC Bengaluru, 10,000 sq ft, 421 ft); hidden-logo 'What gets you High?' teaser; Pink four editions + creative responsibility; Full Moon logo/creative/party-experience role; High On Power 10 leaders/10 cocktails + integrated system; 'Highly Politically Incorrect' sell-out as an ARCHIVE case-study record; 18 PLANNED annual campaigns (9 event / 6 sub-category / 3 weekly).",
      "RED (excluded): 9,500 organic / 1,500 reach / 200K-12K figures; Christmas Eve metrics; High On Power award; claim Geek formulated cocktails; claim Geek curated every menu; '18 executed'; #444FeetHigh.",
      "PRIVACY: private 2015-16 scope agreement + award submission relocated OUT of /public to _private-source/; standee PDF rendered to web JPG, PDF master kept out of /public.",
    ],
  },
  {
    slug: "doritos-for-the-bold",
    brand: "Doritos",
    brandSlug: "doritos",
    project: "For The Bold",
    businessCategory: ["fmcg"],
    services: ["influencer-marketing", "creator-marketing", "social-media"],
    campaignTypes: ["mass-creator-campaign"],
    businessOutcomes: ["content-generation", "engagement", "awareness"],
    heroImageNeed: heroNeed("doritos"),
    headline: "DORITOS",
    oneLineSummary: "Bold snacking, amplified through creators at scale.",
    stats: [
      { value: "2,229", label: "Creators" },
      { value: "3,942", label: "Content Assets" },
      { value: "27.5M+", label: "Engagements" },
    ],
    verificationStatus: "partially-verified",
    sourceNotes: [
      "Creator / content / engagement figures supplied by Geek (homepage Proof section).",
      "Confirm exact metric definitions against the Doritos campaign case study.",
    ],
    featured: true,
    homepageFeatured: true,
    storyPending: true,
  },
  ({
    slug: "lays-heartwork",
    brand: "Lay's",
    brandSlug: "lays",
    project: "Heartwork",
    year: 2020,
    businessCategory: ["fmcg"],
    services: ["influencer-marketing"],
    campaignTypes: ["mass-creator-campaign"],
    businessOutcomes: ["content-generation", "engagement", "awareness"],
    heroImage: "/assets/work/lays/heartwork/heartwork-hero.jpg",
    headline: goldHeartwork.headline || "A CREATOR COMMUNITY WORTH COMING BACK TO.",
    oneLineSummary: goldHeartwork.shortSummary || "A gratitude campaign that reactivated the Lay's creator community built through Smile Deke Dekho.",
    stats: [
      { value: "1,058", label: "Creators" },
      { value: "1,738", label: "Content Assets" },
      { value: "3.81M", label: "Engagements" },
    ],
    renderMode: "flexible",
    sections: goldHeartwork.sections,
    press: goldHeartwork.press,
    awards: goldHeartwork.awards,
    faqs: goldHeartwork.faqs,
    verificationStatus: "partially-verified",
    sourceNotes: [
      "Creator / content / engagement figures supplied by Geek (homepage Proof section).",
      "Confirm exact metric definitions against the Lay's Heartwork credentials deck.",
    ],
    featured: true,
    homepageFeatured: true,
    publishStatus: "draft",
  } as unknown as CaseStudy),
  ({
    slug: "mylaysrelationchip",
    brand: "Lay's",
    brandSlug: "lays",
    project: "Lay's #MyLaysRelationchip",
    year: 2021,
    businessCategory: ["fmcg"],
    services: ["influencer-marketing"],
    campaignTypes: ["mass-creator-campaign"],
    headline: goldMyLaysRelationchip.headline || "DATABASE-SCALE CREATOR ACTIVATION",
    oneLineSummary: goldMyLaysRelationchip.shortSummary || "A Valentine's flavour launch activated across Lay's accumulated creator database.",
    renderMode: "flexible",
    sections: goldMyLaysRelationchip.sections,
    press: goldMyLaysRelationchip.press,
    faqs: goldMyLaysRelationchip.faqs,
    verificationStatus: "partially-verified",
    featured: true,
    homepageFeatured: false,
    publishStatus: "draft",
  } as unknown as CaseStudy),
  {
    slug: "foreo",
    brand: "Foreo",
    brandSlug: "foreo",
    project: "Beauty, Amplified",
    businessCategory: ["beauty-personal-care", "d2c"],
    services: ["influencer-marketing", "social-media", "digital"],
    campaignTypes: ["influencer-campaign"],
    heroImageNeed: heroNeed("foreo"),
    headline: "FOREO",
    oneLineSummary: "Beauty-tech, amplified through the right creators.",
    featured: true,
    storyPending: true,
  },
  {
    slug: "fastrack",
    brand: "Fastrack",
    brandSlug: "fastrack",
    project: "Move On",
    businessCategory: ["fashion", "lifestyle"],
    services: ["creative-strategy", "campaign-ideation", "digital", "social-media"],
    campaignTypes: ["integrated-campaign", "digital-campaign"],
    heroImageNeed: heroNeed("fastrack"),
    headline: "FASTRACK",
    oneLineSummary: "A youth icon, kept culturally current.",
    featured: true,
    homepageFeatured: true,
    storyPending: true,
  },
  {
    slug: "croma",
    brand: "Croma",
    brandSlug: "croma",
    project: "Retail, Reimagined",
    businessCategory: ["retail", "it-technology"],
    services: ["digital", "social-media", "content"],
    campaignTypes: ["integrated-campaign", "content-campaign"],
    heroImageNeed: heroNeed("croma"),
    headline: "CROMA",
    oneLineSummary: "Electronics retail, made social.",
    featured: true,
    storyPending: true,
  },
  {
    slug: "lyfe",
    brand: "Lyfe",
    brandSlug: "lyfe",
    project: "Everyday Icon",
    businessCategory: ["lifestyle", "fashion"],
    services: ["branding", "social-media", "content"],
    campaignTypes: ["social-campaign"],
    heroImageNeed: heroNeed("lyfe"),
    headline: "LYFE",
    oneLineSummary: "An everyday brand with an outsized personality.",
    featured: true,
    storyPending: true,
  },
  {
    slug: "tanishq",
    brand: "Tanishq",
    brandSlug: "tanishq",
    project: "Craft & Emotion",
    businessCategory: ["retail", "fashion"],
    services: ["creative-strategy", "video-film", "digital"],
    campaignTypes: ["integrated-campaign"],
    heroImageNeed: heroNeed("tanishq"),
    headline: "TANISHQ",
    oneLineSummary: "Craft and emotion, told at scale.",
    featured: true,
    storyPending: true,
  },
  {
    slug: "kurkure",
    brand: "Kurkure",
    brandSlug: "kurkure",
    project: "Culture Play",
    businessCategory: ["fmcg"],
    services: ["influencer-marketing", "social-media", "content"],
    campaignTypes: ["mass-creator-campaign", "social-campaign"],
    heroImageNeed: heroNeed("kurkure"),
    headline: "KURKURE",
    oneLineSummary: "Playing inside culture, at creator scale.",
    featured: true,
    storyPending: true,
  },
  {
    slug: "sting",
    brand: "Sting",
    brandSlug: "sting",
    project: "Energy at Scale",
    businessCategory: ["fmcg", "food-beverage"],
    services: ["influencer-marketing", "social-media"],
    campaignTypes: ["influencer-campaign"],
    heroImageNeed: heroNeed("sting"),
    headline: "STING",
    oneLineSummary: "Energy, dialled up through creators.",
    featured: true,
    storyPending: true,
  },
];

export const projectBySlug = (slug: string): CaseStudy | undefined =>
  projects.find((p) => p.slug === slug);

// ── Publishing gate ───────────────────────────────────────────────────────
/**
 * Strict public production gate.
 * True only on Vercel Production.
 * False in local development and Vercel Preview deployments.
 */
export const IS_STRICT_PROD = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";
export const isPublished = (p: CaseStudy): boolean => p.publishStatus === "published";
/** Public, published case studies (sitemap / related / next-project / routes). */
export const publishedProjects = (): CaseStudy[] => projects.filter(isPublished);
/** A draft case study is viewable in dev and Vercel preview (for internal review). */
export const canOpenCaseStudy = (p: CaseStudy): boolean => isPublished(p) || !IS_STRICT_PROD;

/** Curated order for the /work "Featured Stories" intro (edit freely). */
export const FEATURED_STORY_SLUGS = [
  "the-coolest-job",
  "doritos-for-the-bold",
  "lays-heartwork",
  "high-ultra-lounge",
];

export function featuredStories(): CaseStudy[] {
  const picked = FEATURED_STORY_SLUGS.map((s) => projectBySlug(s)).filter(
    (p): p is CaseStudy => Boolean(p && p.featured)
  );
  // top up from any other featured projects if the curated list shrinks
  if (picked.length < 3) {
    for (const p of projects) {
      if (picked.length >= 4) break;
      if (p.featured && !picked.includes(p)) picked.push(p);
    }
  }
  return picked.slice(0, 4);
}
