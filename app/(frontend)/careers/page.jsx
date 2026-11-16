import { draftMode } from "next/headers";
import DoorPage from "@/components/doors/DoorPage";
import CareerForm from "@/components/forms/CareerForm";
import OpenRoles from "@/components/careers/OpenRoles";
import { getCareerOpenings, getDoorCopy } from "@/lib/cms/pageCopy";
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
  const [copy, roles] = await Promise.all([
    getDoorCopy("career", { draft }),
    getCareerOpenings({ draft }),
  ]);
  const count = roles.openings.length;
  return (
    <DoorPage
      door="career"
      title={copy.title}
      intro={copy.intro}
      introLink={{
        href: "#open-roles",
        label: count ? `See ${count} open ${count === 1 ? "role" : "roles"}` : "Open roles & internships",
      }}
      after={<OpenRoles openings={roles.openings} internship={roles.internship} />}
    >
      <CareerForm />
    </DoorPage>
  );
}
