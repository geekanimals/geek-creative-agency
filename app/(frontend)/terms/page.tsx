import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use — Geek Creative Agency",
  description: "The terms that apply to your use of the Geek Creative Agency website.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Use — Geek", description: "Terms for using the Geek website.", url: "/terms", type: "website" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="—"
      intro="This placeholder outlines the sections a final terms document will cover. Replace each block with counsel-approved copy before launch."
      sections={[
        { heading: "Using This Site", body: ["This website is provided for information about Geek Creative Agency and its work."] },
        { heading: "Intellectual Property", body: ["Brand names, logos and campaign work shown belong to their respective owners; Geek content belongs to Geek. Final wording to be confirmed."] },
        { heading: "Submissions", body: ["Information you send through our forms is handled per our Privacy Policy."] },
        { heading: "No Warranty", body: ["Standard site availability and accuracy disclaimers — to be finalised by counsel."] },
        { heading: "Limitation of Liability", body: ["To be finalised by counsel."] },
        { heading: "Contact", body: ["How to reach Geek about these terms — to be added."] },
      ]}
    />
  );
}
