import { draftMode } from "next/headers";
import FourDoors from "@/components/doors/FourDoors";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import Offices from "@/components/contact/Offices";
import ClientForm from "@/components/forms/ClientForm";
import { getContactPage } from "@/lib/cms/contactPage";
import { CONTACT_FALLBACK } from "@/lib/site/contactFallback";
import { ogFallback } from "@/lib/seo/ogImage";

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

        {/* Hero + primary form */}
        <section className="contact-container contact-hero">
          <h1 className="contact-display contact-hero__title">
            <HighlightedLines text={hero.headingBlock} highlight={hero.headingHighlight} />
          </h1>

          <div className="contact-hero__form">
            <p className="contact-hero__eyebrow">{hero.formEyebrow}</p>
            <div className="contact-hero__form-body">
              <ClientForm />
            </div>
          </div>
        </section>

        {/* Offices — embedded Google Maps; tap opens Maps (admin: Contact Page → Offices & Map) */}
        <Offices eyebrow={offices.eyebrow} heading={offices.heading} items={offices.items} />

        {/* Four doors — each opens its own page (components/doors/doors.jsx) */}
        <FourDoors eyebrow={doors.eyebrow} heading={doors.heading} labels={doorLabels} />
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
  padding-block: 2.5rem;
}

.contact-hero__title {
  font-size: clamp(2.4rem, 6.5vw, 5.6rem);
  text-transform: uppercase;
  color: #0c0d0c;
}

.contact-hero__form {
  margin-top: 3rem;
  max-width: 42rem;
}

.contact-hero__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}

.contact-hero__form-body {
  margin-top: 1.5rem;
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
    padding-block: 4rem;
  }
}
`;
