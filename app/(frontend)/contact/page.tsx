import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import FourDoors from "@/components/FourDoors";
import { HighlightedLines } from "@/components/content/HighlightedLines";
import { ClientForm } from "@/components/forms/Forms";
import { getContactPage } from "@/lib/cms/contactPage";
import { CONTACT_FALLBACK } from "@/lib/site/contactFallback";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPage();
  const title = seo.metaTitle || CONTACT_FALLBACK.seo.metaTitle;
  const description = seo.metaDescription || CONTACT_FALLBACK.seo.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: { title, description, url: "/contact", type: "website", images: seo.ogImage ? [{ url: seo.ogImage }] : undefined },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ContactPage() {
  const { isEnabled: draft } = await draftMode();
  const { hero, doors } = await getContactPage({ draft });
  // Door labels for the (code-owned) Four Doors — CMS relabels only.
  const doorLabels = Object.fromEntries(doors.items.map((d) => [d.key, { title: d.title, sub: d.sub }]));

  return (
    <>
      <Nav />
      <main id="main" className="pt-24 sm:pt-28">
        {draft && (
          <div className="bg-amber-400 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink">
            Preview — draft (not public)
          </div>
        )}

        {/* Hero + primary form */}
        <section className="mx-auto max-w-edge px-5 py-10 sm:px-8 sm:py-16">
          <h1 className="h-display text-[clamp(2.4rem,6.5vw,5.6rem)] uppercase text-ink">
            <HighlightedLines text={hero.headingBlock} highlight={hero.headingHighlight} />
          </h1>

          <div className="mt-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">{hero.formEyebrow}</p>
            <div className="mt-6">
              <ClientForm />
            </div>
          </div>
        </section>

        {/* Four routes (reuses the modal/form system — forms are code-controlled) */}
        <FourDoors eyebrow={doors.eyebrow} heading={doors.heading} labels={doorLabels} />
      </main>
      <EndFooter />
    </>
  );
}
