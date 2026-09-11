/**
 * Section 7 — PROOF. Real supplied numbers only. Do not fabricate.
 */
export type ProofStat = { value: number; suffix?: string; label: string };
export type ProofCase = { brand: string; folder: string; need: string; src?: string; stats: ProofStat[] };

export const proof: ProofCase[] = [
  {
    brand: "Doritos",
    folder: "doritos",
    need: "/assets/work/doritos/campaign.jpg",
    stats: [
      { value: 2229, label: "Creators" },
      { value: 3942, label: "Content Assets" },
      { value: 27.5, suffix: "M+", label: "Engagements" },
    ],
  },
  {
    brand: "Lay's",
    folder: "lays",
    need: "/assets/work/lays/campaign.jpg",
    stats: [
      { value: 1058, label: "Creators" },
      { value: 1738, label: "Content Assets" },
      { value: 3.81, suffix: "M", label: "Engagements" },
    ],
  },
];
