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
  src?: string; // e.g. "/assets/work/doritos/hero.jpg" or "/assets/legacy-geek/thebiereclub.png"
  need?: string; // required path shown in empty slot
  tall?: boolean;
  contain?: boolean; // object-contain for logo assets
};

const hero = (folder: string) => `/assets/work/${folder}/hero.jpg`;

// Section 11 — The Work wall
export const workWall: WorkItem[] = [
  { slug: "the-coolest-job", brand: "Miller High Life", project: "The Coolest Job", folder: "the-coolest-job", src: "/assets/work/the-coolest-job/hero/hero-poster.jpg", need: hero("the-coolest-job"), tall: true },
  { slug: "the-biere-club", brand: "The Biere Club", project: "Identity to Experience", folder: "the-biere-club", src: "/assets/legacy-geek/thebiereclub.png", need: hero("the-biere-club"), contain: true },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "Built to be Experienced", folder: "high-ultra", src: "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg", need: hero("high-ultra") },
  { slug: "doritos", brand: "Doritos", project: "Creator Engine", folder: "doritos", need: hero("doritos"), tall: true },
  { slug: "lays", brand: "Lay's", project: "Creator Campaign", folder: "lays", src: "/assets/work/lays/heartwork/heartwork-hero.jpg", need: hero("lays") },
  { slug: "kurkure", brand: "Kurkure", project: "Culture Play", folder: "kurkure", src: "/assets/legacy-geek/Kurkure.png", need: hero("kurkure"), contain: true },
  { slug: "sting", brand: "Sting", project: "Energy at Scale", folder: "sting", need: hero("sting") },
  { slug: "foreo", brand: "Foreo", project: "Beauty, Amplified", folder: "foreo", need: hero("foreo"), tall: true },
  { slug: "croma", brand: "Croma", project: "Retail, Reimagined", folder: "croma", src: "/assets/legacy-geek/croma.png", need: hero("croma"), contain: true },
  { slug: "tanishq", brand: "Tanishq", project: "Craft & Emotion", folder: "tanishq", src: "/assets/legacy-geek/Tanishq.png", need: hero("tanishq"), contain: true },
  { slug: "fastrack", brand: "Fastrack", project: "Move On", folder: "fastrack", need: hero("fastrack") },
  { slug: "lyfe", brand: "Lyfe", project: "Everyday Icon", folder: "lyfe", src: "/assets/legacy-geek/lyfe.png", need: hero("lyfe"), contain: true },
];

// Section 4 — BUILD stories (each needs a set: logo, menu, invitation, signage…)
export type BuildStory = WorkItem & { blurb: string };
export const buildStories: BuildStory[] = [
  { slug: "the-biere-club", brand: "The Biere Club", project: "From identity to experience.", folder: "the-biere-club", src: "/assets/legacy-geek/thebiereclub.png", need: "/assets/work/the-biere-club/hero.jpg", contain: true, blurb: "Logo · menu · invitations · coasters · signage." },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "A brand built to be experienced.", folder: "high-ultra", src: "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg", need: "/assets/work/high-ultra/hero.jpg", blurb: "Venue · launch & event communications." },
  { slug: "the-coolest-job", brand: "The Coolest Job", project: "A brand launch people wanted to be part of.", folder: "the-coolest-job", src: "/assets/work/the-coolest-job/hero/hero-poster.jpg", need: "/assets/work/the-coolest-job/hero.jpg", blurb: "Miller / Miller High Life launch artwork." },
];

// Section 5 — CREATE gallery
export const createGallery: WorkItem[] = [
  { slug: "fastrack", brand: "Fastrack", project: "Move On", folder: "fastrack", need: hero("fastrack"), tall: true },
  { slug: "durex", brand: "Durex", project: "Say It", folder: "durex", need: hero("durex") },
  { slug: "lyfe", brand: "Lyfe", project: "Everyday Icon", folder: "lyfe", src: "/assets/legacy-geek/lyfe.png", need: hero("lyfe"), contain: true },
  { slug: "gone-mad", brand: "Gone Mad", project: "Unhinged", folder: "gone-mad", need: hero("gone-mad") },
  { slug: "icare", brand: "iCare", project: "Care Campaign", folder: "icare", need: hero("icare"), tall: true },
  { slug: "respect-the-road", brand: "Respect The Road", project: "Safety, Loud", folder: "respect-the-road", need: hero("respect-the-road") },
  { slug: "croma", brand: "Croma", project: "Retail, Reimagined", folder: "croma", src: "/assets/legacy-geek/croma.png", need: hero("croma"), contain: true },
  { slug: "tanishq", brand: "Tanishq", project: "Craft & Emotion", folder: "tanishq", src: "/assets/legacy-geek/Tanishq.png", need: hero("tanishq"), contain: true, tall: true },
];

// Hero showreel poster collage — priority projects
export const heroPoster: WorkItem[] = [
  { slug: "the-coolest-job", brand: "The Coolest Job", project: "Miller High Life", folder: "the-coolest-job", src: "/assets/work/the-coolest-job/hero/hero-poster.jpg", need: "/assets/work/the-coolest-job/hero.jpg" },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "Venue", folder: "high-ultra", src: "/assets/work/high-ultra-lounge/venue-on-ground/high-view-rooftop-venue-night.jpg", need: "/assets/work/high-ultra/hero.jpg" },
  { slug: "the-biere-club", brand: "The Biere Club", project: "Identity", folder: "the-biere-club", src: "/assets/legacy-geek/thebiereclub.png", need: "/assets/work/the-biere-club/hero.jpg", contain: true },
  { slug: "doritos", brand: "Doritos", project: "Creators", folder: "doritos", need: "/assets/work/doritos/hero.jpg" },
  { slug: "lays", brand: "Lay's", project: "Creators", folder: "lays", src: "/assets/work/lays/heartwork/heartwork-hero.jpg", need: "/assets/work/lays/hero.jpg" },
  { slug: "fastrack", brand: "Fastrack", project: "Move On", folder: "fastrack", need: "/assets/work/fastrack/hero.jpg" },
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
