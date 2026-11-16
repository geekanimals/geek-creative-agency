import { draftMode } from "next/headers";
import FourDoors from "@/components/doors/FourDoors";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import Offices from "@/components/contact/Offices";
import { getContactPage } from "@/lib/cms/contactPage";
import { CONTACT_FALLBACK } from "@/lib/site/contactFallback";
import { ogFallback } from "@/lib/seo/ogImage";
import { SITE } from "@/lib/site";

export async function generateMetadata() {
  const { seo } = await getContactPage();
  const title = seo.metaTitle || CONTACT_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || CONTACT_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: {
      title,
      description,
      url: "/contact",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ContactPage() {
  const { isEnabled: draft } = await draftMode();
  const { hero, doors, offices } = await getContactPage({ draft });
  // Door labels for the (code-owned) Four Doors — CMS relabels only.
  const doorLabels = Object.fromEntries(
    doors.items.map((d) => [d.key, { title: d.title, sub: d.sub }]),
  );

  return (
    <>
      <style href="contact" precedence="default">
        {styles}
      </style>
      <main id="main" className="contact">
        {draft && <div className="contact__draft">Preview — draft (not public)</div>}

        {/* Hero */}
        <section className="contact-container contact-hero">
          <h1 className="contact-display contact-hero__title">
            <HighlightedLines text={hero.headingBlock} highlight={hero.headingHighlight} />
          </h1>
        </section>

        {/* Four doors first — each opens its own page + form (components/doors/doors.jsx) */}
        <FourDoors eyebrow={doors.eyebrow} heading={doors.heading} labels={doorLabels} />

        {/* Direct line — phone + business email */}
        <section className="contact-container contact-direct" aria-labelledby="contact-direct-title">
          <div className="contact-direct__head">
            <p className="contact__eyebrow">Prefer to talk?</p>
            <h2 id="contact-direct-title" className="contact-display contact-direct__title">
              Call or write to us directly.
            </h2>
          </div>
          <div className="contact-direct__grid">
            <a href={`tel:${SITE.contact.tel}`} className="contact-direct__card">
              <span className="contact-direct__label">Call</span>
              <span className="contact-display contact-direct__value">{SITE.contact.phone}</span>
              <span className="contact-direct__hint">Speak to the Geek team</span>
            </a>
            <a href={`mailto:${SITE.contact.email}`} className="contact-direct__card">
              <span className="contact-direct__label">Email</span>
              <span className="contact-display contact-direct__value contact-direct__value--email">
                {SITE.contact.email}
              </span>
              <span className="contact-direct__hint">We reply within 1–2 working days</span>
            </a>
          </div>
        </section>

        {/* Offices — embedded Google Maps; tap opens Maps (admin: Contact Page → Offices & Map) */}
        <Offices eyebrow={offices.eyebrow} heading={offices.heading} items={offices.items} />
      </main>
    </>
  );
}

const styles = `
.contact {
  padding-top: 6rem;
}

.contact__draft {
  background-color: #fbbf24;
  padding: 0.5rem 1.25rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
}

.contact-hero {
  padding-block: 2.5rem 2rem;
}

.contact-hero__title {
  font-size: clamp(2.4rem, 6.5vw, 5.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}


/* Direct line */
.contact__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}
.contact-direct {
  padding-block: 3rem;
  border-top: 1px solid #eceeeb;
}
.contact-direct__title {
  margin-top: 0.75rem;
  font-size: clamp(1.8rem, 4vw, 3rem);
  text-transform: uppercase;
  color: #0c0d0c;
}
.contact-direct__grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.contact-direct__card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid #eceeeb;
  border-radius: 1rem;
  color: #0c0d0c;
  text-decoration: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}
.contact-direct__card:hover,
.contact-direct__card:focus-visible {
  border-color: #32c1df;
  box-shadow: 0 14px 30px -20px rgba(50, 193, 223, 0.7);
  transform: translateY(-2px);
}
.contact-direct__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #5a5f5c;
}
.contact-direct__value {
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  overflow-wrap: anywhere;
}
.contact-direct__value--email {
  font-size: clamp(1.1rem, 2.4vw, 1.75rem);
  letter-spacing: -0.02em;
}
.contact-direct__hint {
  font-size: 0.875rem;
  color: #5a5f5c;
}
@media (min-width: 640px) {
  .contact-direct {
    padding-block: 4rem;
  }
  .contact-direct__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
  .contact-direct__card {
    padding: 2rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .contact-direct__card { transition: none; }
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.contact-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .contact-container {
    padding-inline: 20px;
  }
}

.contact-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .contact {
    padding-top: 7rem;
  }

  .contact-hero {
    padding-block: 4rem 3rem;
  }
}
`;
