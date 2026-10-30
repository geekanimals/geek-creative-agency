/**
 * Work / project data.
 * `src`  — real asset under /public (renders immediately when present).
 * `need` — the exact file path required to replace the slot (drives <Media>
 *          and the generated asset checklist). Never fabricate these.
 */

export type WorkItem = {
  slug: string;
  brand: string;
  project: string;
  folder: string;
  src?: string; // e.g. "/assets/work/doritos/hero.jpg" once the real file exists
  need?: string; // required path shown in the empty slot
  tall?: boolean;
};

const hero = (folder: string) => `/assets/work/${folder}/hero.jpg`;

// Section 11 — The Work wall (slugs = real /work/<slug> case-study pages; real assets only)
export const workWall: WorkItem[] = [
  { slug: "the-coolest-job", brand: "Miller High Life", project: "The Coolest Job", folder: "the-coolest-job", src: "/assets/work/the-coolest-job/hero/hero-poster.jpg", tall: true },
  { slug: "high-ultra-lounge", brand: "High Ultra Lounge", project: "Built to be Experienced", folder: "high-ultra-lounge", src: "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg" },
  { slug: "lays-heartwork", brand: "Lay's", project: "Heartwork", folder: "lays", src: "/assets/work/lays/heartwork/heartwork-hero.jpg" },
  { slug: "mylaysrelationchip", brand: "Lay's", project: "#MyLaysRelationchip", folder: "lays", src: "/assets/work/lays/mylaysrelationchip/mylaysrelationchip-hero.jpg" },
  { slug: "doritos-for-the-bold", brand: "Doritos", project: "#ForTheBold", folder: "doritos", src: "/assets/work/doritos/doritos-for-the-bold/hero.jpg", tall: true },
  { slug: "kurkure-masaba", brand: "Kurkure", project: "Kurkure x Masaba", folder: "kurkure", src: "/assets/work/kurkure/kurkure-masaba/kurkure-masaba-hero.jpg" },
  { slug: "sting-energy", brand: "Sting", project: "#EnergyBoleTohSting", folder: "sting", src: "/assets/work/sting/sting-energy/hero.jpg" },
  { slug: "sustainify", brand: "Sustainify", project: "Green Action Platform", folder: "sustainify", src: "/assets/work/sustainify/earth-maintenance-system.png" },
];

// Section 4 — BUILD stories (real assets only)
export type BuildStory = WorkItem & { blurb: string };
export const buildStories: BuildStory[] = [
  { slug: "the-coolest-job", brand: "The Coolest Job", project: "A brand launch people wanted to be part of.", folder: "the-coolest-job", src: "/assets/work/the-coolest-job/hero/hero-poster.jpg", blurb: "Miller / Millet High Life launch artwork." },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "A brand built to be experienced.", folder: "high-ultra-lounge", src: "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg", blurb: "Venue · launch & event communications." },
  { slug: "high-on-power", brand: "High Ultra Lounge", project: "High on Power.", folder: "high-ultra-lounge", src: "/assets/work/high-ultra-lounge/high-on-power/high-on-power-menu-centre-fold.jpg", blurb: "Menu · cocktails · standees." },
];

// Section 5 — CREATE gallery (real creator content from Geek campaigns)
export const createGallery: WorkItem[] = [
  { slug: "kurkure-chatpata-cheese", brand: "Kurkure", project: "Chatpata Cheese", folder: "kurkure", src: "/assets/work/kurkure/kurkure-chatpata-cheese/creator-01.jpg", tall: true },
  { slug: "lays-paper-thin-wafer-thin", brand: "Lay's", project: "#PaperThinWaferThin", folder: "lays", src: "/assets/work/lays/lays-paper-thin-wafer-thin/hero.jpg" },
  { slug: "sting-macha-de-challenge", brand: "Sting", project: "#StingMachaDeChallenge", folder: "sting", src: "/assets/work/sting/sting-macha-de-challenge/sting-macha-de-challenge-creator-01.jpg" },
  { slug: "doritos-chips-nahi-fire", brand: "Doritos", project: "#ChipsNahiFire", folder: "doritos", src: "/assets/work/doritos/doritos-chips-nahi-fire/hero.jpg" },
  { slug: "kurkure-puffballs", brand: "Kurkure", project: "#CountthePuffs", folder: "kurkure", src: "/assets/work/kurkure/kurkure-puffballs/creator-02.jpg", tall: true },
  { slug: "mountain-dew-conquer-with-courage", brand: "Mountain Dew", project: "Creator challenge", folder: "mountain-dew", src: "/assets/work/mountain-dew/mountain-dew-conquer-with-courage/mountain-dew-conquer-with-courage-creator-01.jpg" },
  { slug: "pepsi-check-my-fizz", brand: "Pepsi", project: "#CheckMyFizz", folder: "pepsi", src: "/assets/work/pepsi/pepsi-check-my-fizz/pepsi-check-my-fizz-creator-01.jpg" },
  { slug: "mylaysrelationchip", brand: "Lay's", project: "#MyLaysRelationchip", folder: "lays", src: "/assets/work/lays/mylaysrelationchip/mylaysrelationchip-creator-01.jpg", tall: true },
];

// Hero showreel poster collage — real assets only
export const heroPoster: WorkItem[] = [
  { slug: "the-coolest-job", brand: "The Coolest Job", project: "Miller High Life", folder: "the-coolest-job", src: "/assets/work/the-coolest-job/hero/hero-poster.jpg" },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "Venue", folder: "high-ultra-lounge", src: "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg" },
  { slug: "lays-heartwork", brand: "Lay's", project: "Heartwork", folder: "lays", src: "/assets/work/lays/heartwork/heartwork-hero.jpg" },
  { slug: "doritos-blame-it-on-crunch", brand: "Doritos", project: "#BlameItOnCrunch", folder: "doritos", src: "/assets/work/doritos/doritos-blame-it-on-crunch/hero.jpg" },
  { slug: "mylaysrelationchip", brand: "Lay's", project: "#MyLaysRelationchip", folder: "lays", src: "/assets/work/lays/mylaysrelationchip/mylaysrelationchip-hero.jpg" },
  { slug: "kurkure-bore-no-more", brand: "Kurkure", project: "#BoreNoMore", folder: "kurkure", src: "/assets/work/kurkure/kurkure-bore-no-more/kurkure-bore-no-more-hero.jpg" },
];

// Section 9 — BUILT BY GEEK (real assets available — Geek's own initiatives)
export const builtByGeek: (WorkItem & { kicker: string })[] = [
  {
    slug: "give-back-to-gurugram",
    brand: "Give Back to Gurugram",
    project: "A city became our client.",
    kicker: "A city became our client.",
    folder: "give-back-to-gurugram",
    src: "/assets/work/give-back-to-gurugram/together-for-gurugram.png",
  },
  {
    slug: "sustainify",
    brand: "Sustainify",
    project: "Then Earth did.",
    kicker: "Then Earth did.",
    folder: "sustainify",
    src: "/assets/work/sustainify/earth-maintenance-system.png",
  },
];
