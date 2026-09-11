import EndFooterClient from "./EndFooterClient";
import { getFooter, getSiteSettings } from "@/lib/cms/globals";

/**
 * Server wrapper: resolves footer content + social links (CMS-first, static
 * fallback, cached + tagged "globals") in parallel and hands them to the client
 * footer. Pages keep rendering <EndFooter /> exactly as before.
 */
export default async function EndFooter() {
  const [footer, settings] = await Promise.all([getFooter(), getSiteSettings()]);
  return <EndFooterClient footer={footer} socials={settings.socials} />;
}
