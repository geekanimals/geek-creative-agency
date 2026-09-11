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

// Section 11 — The Work wall
export const workWall: WorkItem[] = [
  { slug: "the-coolest-job", brand: "Miller High Life", project: "The Coolest Job", folder: "the-coolest-job", need: hero("the-coolest-job"), tall: true },
  { slug: "the-biere-club", brand: "The Biere Club", project: "Identity to Experience", folder: "the-biere-club", need: hero("the-biere-club") },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "Built to be Experienced", folder: "high-ultra", need: hero("high-ultra") },
  { slug: "doritos", brand: "Doritos", project: "Creator Engine", folder: "doritos", need: hero("doritos"), tall: true },
  { slug: "lays", brand: "Lay's", project: "Creator Campaign", folder: "lays", need: hero("lays") },
  { slug: "kurkure", brand: "Kurkure", project: "Culture Play", folder: "kurkure", need: hero("kurkure") },
  { slug: "sting", brand: "Sting", project: "Energy at Scale", folder: "sting", need: hero("sting") },
  { slug: "foreo", brand: "Foreo", project: "Beauty, Amplified", folder: "foreo", need: hero("foreo"), tall: true },
  { slug: "croma", brand: "Croma", project: "Retail, Reimagined", folder: "croma", need: hero("croma") },
  { slug: "tanishq", brand: "Tanishq", project: "Craft & Emotion", folder: "tanishq", need: hero("tanishq") },
  { slug: "fastrack", brand: "Fastrack", project: "Move On", folder: "fastrack", need: hero("fastrack") },
  { slug: "lyfe", brand: "Lyfe", project: "Everyday Icon", folder: "lyfe", need: hero("lyfe") },
];

// Section 4 — BUILD stories (each needs a set: logo, menu, invitation, signage…)
export type BuildStory = WorkItem & { blurb: string };
export const buildStories: BuildStory[] = [
  { slug: "the-biere-club", brand: "The Biere Club", project: "From identity to experience.", folder: "the-biere-club", need: "/assets/work/the-biere-club/hero.jpg", blurb: "Logo · menu · invitations · coasters · signage." },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "A brand built to be experienced.", folder: "high-ultra", need: "/assets/work/high-ultra/hero.jpg", blurb: "Venue · launch & event communications." },
  { slug: "the-coolest-job", brand: "The Coolest Job", project: "A brand launch people wanted to be part of.", folder: "the-coolest-job", need: "/assets/work/the-coolest-job/hero.jpg", blurb: "Miller / Millet High Life launch artwork." },
];

// Section 5 — CREATE gallery
export const createGallery: WorkItem[] = [
  { slug: "fastrack", brand: "Fastrack", project: "Move On", folder: "fastrack", need: hero("fastrack"), tall: true },
  { slug: "durex", brand: "Durex", project: "Say It", folder: "durex", need: hero("durex") },
  { slug: "lyfe", brand: "Lyfe", project: "Everyday Icon", folder: "lyfe", need: hero("lyfe") },
  { slug: "gone-mad", brand: "Gone Mad", project: "Unhinged", folder: "gone-mad", need: hero("gone-mad") },
  { slug: "icare", brand: "iCare", project: "Care Campaign", folder: "icare", need: hero("icare"), tall: true },
  { slug: "respect-the-road", brand: "Respect The Road", project: "Safety, Loud", folder: "respect-the-road", need: hero("respect-the-road") },
  { slug: "croma", brand: "Croma", project: "Retail, Reimagined", folder: "croma", need: hero("croma") },
  { slug: "tanishq", brand: "Tanishq", project: "Craft & Emotion", folder: "tanishq", need: hero("tanishq"), tall: true },
];

// Hero showreel poster collage — priority projects
export const heroPoster: WorkItem[] = [
  { slug: "the-coolest-job", brand: "The Coolest Job", project: "Miller High Life", folder: "the-coolest-job", need: "/assets/work/the-coolest-job/hero.jpg" },
  { slug: "high-ultra", brand: "High Ultra Lounge", project: "Venue", folder: "high-ultra", need: "/assets/work/high-ultra/hero.jpg" },
  { slug: "the-biere-club", brand: "The Biere Club", project: "Identity", folder: "the-biere-club", need: "/assets/work/the-biere-club/hero.jpg" },
  { slug: "doritos", brand: "Doritos", project: "Creators", folder: "doritos", need: "/assets/work/doritos/hero.jpg" },
  { slug: "lays", brand: "Lay's", project: "Creators", folder: "lays", need: "/assets/work/lays/hero.jpg" },
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
