import EndFooterClient from "./EndFooterClient";
import { getFloatingContact, getFooter, getSiteSettings } from "@/lib/cms/globals";
import { getContactPage } from "@/lib/cms/contactPage";

/**
 * Server wrapper: footer content, social links, office addresses and the
 * "Book a meeting" link (all CMS-first, cached + tagged) for the client footer.
 * Rendered once for every page by app/(frontend)/layout.jsx.
 */
export default async function EndFooter() {
  const [footer, settings, contact, floating] = await Promise.all([
    getFooter(),
    getSiteSettings(),
    getContactPage().catch(() => null),
    getFloatingContact(),
  ]);
  return (
    <EndFooterClient
      footer={footer}
      socials={settings.socials}
      offices={contact?.offices?.items ?? []}
      meetingUrl={floating.meetingUrl || ""}
    />
  );
}
