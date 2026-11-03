import { draftMode } from "next/headers";
import DoorPage from "@/components/doors/DoorPage";
import ClientForm from "@/components/forms/ClientForm";
import { getDoorCopy } from "@/lib/cms/pageCopy";
import { ogFallback } from "@/lib/seo/ogImage";

// Heading, intro + SEO are editable in the admin: Pages → Build My Brand Page.
export async function generateMetadata() {
  const { seo } = await getDoorCopy("client");
  const title = seo.metaTitle || "Build my brand — Geek Creative Agency";
  const description =
    seo.metaDescription ||
    "Tell Geek what you're building. Strategy, creative, creators, digital and media — our team reads every brief.";
  return {
    title,
    description,
    alternates: { canonical: "/build-my-brand" },
    openGraph: {
      title,
      description,
      url: "/build-my-brand",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : ogFallback(title),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BuildMyBrandPage() {
  const { isEnabled: draft } = await draftMode();
  const copy = await getDoorCopy("client", { draft });
  return (
    <DoorPage door="client" title={copy.title} intro={copy.intro}>
      <ClientForm />
    </DoorPage>
  );
}
