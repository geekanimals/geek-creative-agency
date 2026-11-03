import { draftMode } from "next/headers";
import DoorPage from "@/components/doors/DoorPage";
import CareerForm from "@/components/forms/CareerForm";
import { getDoorCopy } from "@/lib/cms/pageCopy";
import { ogFallback } from "@/lib/seo/ogImage";

// Heading, intro + SEO are editable in the admin: Pages → Careers Page.
export async function generateMetadata() {
  const { seo } = await getDoorCopy("career");
  const title = seo.metaTitle || "Work at Geek — Careers | Geek Creative Agency";
  const description =
    seo.metaDescription ||
    "Want to build brands that matter? Apply to work at Geek Creative Agency — share your details and upload your resume.";
  return {
    title,
    description,
    alternates: { canonical: "/careers" },
    openGraph: {
      title,
      description,
      url: "/careers",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CareersPage() {
  const { isEnabled: draft } = await draftMode();
  const copy = await getDoorCopy("career", { draft });
  return (
    <DoorPage door="career" title={copy.title} intro={copy.intro}>
      <CareerForm />
    </DoorPage>
  );
}
