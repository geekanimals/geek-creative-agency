import { draftMode } from "next/headers";
import DoorPage from "@/components/doors/DoorPage";
import VendorForm from "@/components/forms/VendorForm";
import { getDoorCopy } from "@/lib/cms/pageCopy";
import { ogFallback } from "@/lib/seo/ogImage";

// Heading, intro + SEO are editable in the admin: Pages → Partners Page.
export async function generateMetadata() {
  const { seo } = await getDoorCopy("vendor");
  const title = seo.metaTitle || "Work with Geek — Vendors & Partners | Geek Creative Agency";
  const description =
    seo.metaDescription ||
    "Production, printing, fabrication, venues, tech — partner with Geek Creative Agency. Tell us what you do.";
  return {
    title,
    description,
    alternates: { canonical: "/partners" },
    openGraph: {
      title,
      description,
      url: "/partners",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function PartnersPage() {
  const { isEnabled: draft } = await draftMode();
  const copy = await getDoorCopy("vendor", { draft });
  return (
    <DoorPage door="vendor" title={copy.title} intro={copy.intro}>
      <VendorForm />
    </DoorPage>
  );
}
