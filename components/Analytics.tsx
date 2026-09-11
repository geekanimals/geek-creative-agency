"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Click-delegation bridge: any element with data-track fires an event.
 * Optional GA4 loader when NEXT_PUBLIC_GA_ID is set (no vendor hard-coded).
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("[data-track]");
      if (!el) return;
      const event = el.getAttribute("data-track");
      if (!event) return;
      let props = {};
      try {
        props = JSON.parse(el.getAttribute("data-track-props") || "{}");
      } catch {
        /* ignore */
      }
      track(event, props);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
