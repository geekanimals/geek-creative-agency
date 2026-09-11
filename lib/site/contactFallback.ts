/**
 * Approved Contact page content as a normalized UI model + static fallback.
 * The page renders this shape from the `contact-page` Global or this fallback,
 * so /contact always renders even when the CMS/DB is unavailable.
 *
 * CMS owns only the editorial copy (hero heading, the form eyebrow, the Four
 * Doors section headings and the four door labels). Everything functional stays
 * code-controlled: the forms, their fields/validation, the /api/lead handler,
 * and the door colours/icons/order (see components/FourDoors.tsx). A CMS/DB
 * outage and a form-backend (Resend) outage are separate failure domains — a DB
 * outage here still renders the page AND the working form.
 */
export type ContactSeo = { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex?: boolean };

/** The four fixed contact "doors". `key` maps to a code-owned form + styling;
 *  the CMS may only override the display `title`/`sub`. */
export type ContactDoorKey = "client" | "creator" | "career" | "vendor";
export type ContactDoor = { key: ContactDoorKey; title: string; sub: string };

export type ContactPageModel = {
  hero: { headingBlock: string; headingHighlight: string; formEyebrow: string };
  doors: { eyebrow: string; heading: string; items: ContactDoor[] };
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
  seo: {
    metaTitle: "Contact — Geek Creative Agency",
    metaDescription: "What should we make matter next? Tell us the problem — we'll take it from there.",
  },
};
