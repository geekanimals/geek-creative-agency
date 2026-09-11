import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Geek Creative Agency",
  description: "How Geek Creative Agency handles the information you share through this website and our forms.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy — Geek", description: "How Geek handles your information.", url: "/privacy", type: "website" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="—"
      intro="This placeholder outlines the sections a final privacy policy will cover. Replace each block with counsel-approved copy before launch."
      sections={[
        { heading: "Information We Collect", body: ["Details you submit through our forms (for example: name, company, email, phone and your message).", "Basic, privacy-respecting analytics about how the site is used."] },
        { heading: "How We Use It", body: ["To respond to enquiries and applications, and to improve the website.", "We do not sell your personal information."] },
        { heading: "Analytics & Cookies", body: ["We use lightweight analytics events to understand site usage. Final cookie/consent details to be confirmed with counsel."] },
        { heading: "Data Sharing", body: ["Form submissions may be delivered to Geek via an email provider. Third-party processors will be listed here."] },
        { heading: "Your Rights", body: ["How to request access to, correction of, or deletion of your information — to be finalised per applicable law."] },
        { heading: "Contact", body: ["How to reach Geek about privacy matters — to be added."] },
      ]}
    />
  );
}
