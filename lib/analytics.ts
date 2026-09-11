/**
 * Provider-agnostic analytics. Events flow to GA4 (gtag) and/or GTM (dataLayer)
 * when present; in dev they log to the console. Nothing is hard-wired to a
 * vendor — set NEXT_PUBLIC_GA_ID to enable GA4 (see components/Analytics.tsx).
 *
 * Event names (contract):
 *  brand_form_open · brand_form_submit
 *  creator_form_open · creator_form_submit
 *  career_form_open · career_form_submit
 *  vendor_form_open · vendor_form_submit
 *  work_filter_used · case_study_view · case_study_next_click
 *  creator_signup · contact_cta_click · hero_work_click
 */
export type TrackProps = Record<string, unknown>;

export function track(event: string, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    if (typeof w.gtag === "function") w.gtag("event", event, props);
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...props });
  } catch {
    /* never let analytics break the UI */
  }
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[track]", event, props);
  }
}

/**
 * For server components: returns data-attributes read by the client
 * AnalyticsBridge on click. e.g. <a {...trackAttr("hero_work_click")} />
 */
export function trackAttr(event: string, props: TrackProps = {}) {
  return {
    "data-track": event,
    ...(Object.keys(props).length ? { "data-track-props": JSON.stringify(props) } : {}),
  } as const;
}
