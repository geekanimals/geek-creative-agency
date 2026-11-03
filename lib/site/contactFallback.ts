/**
 * Approved Contact page content as a normalized UI model + static fallback.
 * The page renders this shape from the `contact-page` Global or this fallback,
 * so /contact always renders even when the CMS/DB is unavailable.
 *
 * CMS owns only the editorial copy (hero heading, the form eyebrow, the Four
 * Doors section headings and the four door labels). Everything functional stays
 * code-controlled: the forms, their fields/validation, the /api/lead handler,
 * and the door colours/icons/order (see components/doors/doors.jsx). A CMS/DB
 * outage and a form-backend (Resend) outage are separate failure domains — a DB
 * outage here still renders the page AND the working form.
 */
export type ContactSeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };

/** The four fixed contact "doors". `key` maps to a code-owned form + styling;
 *  the CMS may only override the display `title`/`sub`. */
export type ContactDoorKey = "client" | "creator" | "career" | "vendor";
export type ContactDoor = { key: ContactDoorKey; title: string; sub: string };

/** An office card: map + address. `mapQuery` (optional) is what Google Maps
 *  searches for; empty → the address itself. */
export type ContactOffice = { city: string; address: string; mapQuery?: string };

export type ContactPageModel = {
  hero: { headingBlock: string; headingHighlight: string; formEyebrow: string };
  doors: { eyebrow: string; heading: string; items: ContactDoor[] };
  offices: { eyebrow: string; heading: string; items: ContactOffice[] };
  seo: ContactSeo;
};

export const CONTACT_FALLBACK: ContactPageModel = {
  hero: {
    headingBlock: "What should\nwe make matter next?",
    headingHighlight: "matter",
    formEyebrow: "Tell us the problem",
  },
  doors: {
    eyebrow: "Four doors.",
    heading: "What brings you to Geek?",
    items: [
      { key: "client", title: "Build my brand.", sub: "For Clients." },
      { key: "creator", title: "Work with brands.", sub: "For Creators." },
      { key: "career", title: "Work at Geek.", sub: "For Jobs." },
      { key: "vendor", title: "Work with Geek.", sub: "For Vendors / Partners." },
    ],
  },
  offices: {
    eyebrow: "The G spot.",
    heading: "Come say hi.",
    items: [
      {
        city: "Bangalore",
        address: "No. 33, 4th Floor, 1st Main, Ganganagar Gramatana, HMT Layout, CBI Road, Bangalore - 560032",
        mapQuery: "HMT Layout, CBI Road, Ganganagar, Bengaluru 560032",
      },
      {
        city: "Delhi NCR",
        address: "Level 12, Building No. 8, Tower-C, DLF Cyber City Phase II, Gurgaon - 122002, Haryana, India",
        mapQuery: "Building No. 8, Tower C, DLF Cyber City Phase II, Gurugram 122002",
      },
    ],
  },
  seo: {
    metaTitle: "Contact — Geek Creative Agency",
    metaDescription: "What should we make matter next? Tell us the problem — we'll take it from there.",
  },
};
