"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { trackAttr } from "@/lib/analytics";

/**
 * "Book a meeting" floating button. Opens the booking page (Calendly free plan,
 * Google Calendar appointment schedule, or Cal.com) in a popup on this site.
 * The booking tool is connected to Google Calendar, so a slot that is already
 * busy there is never offered — double bookings can't happen.
 */
function embedUrl(raw) {
  try {
    const u = new URL(raw);
    if (/calendly\.com$/.test(u.hostname)) {
      u.searchParams.set("embed_type", "Inline");
      u.searchParams.set("hide_gdpr_banner", "1");
      if (typeof window !== "undefined") u.searchParams.set("embed_domain", window.location.hostname);
    }
    if (/cal\.com$/.test(u.hostname)) u.searchParams.set("embed", "true");
    if (u.hostname === "calendar.google.com" && u.pathname.includes("/appointments/")) {
      u.pathname = u.pathname.replace(/\/u\/\d+\//, "/");
      u.searchParams.set("gv", "true");
    }
    return u.toString();
  } catch {
    return raw;
  }
}

export default function MeetingButton({ url, label = "Book a meeting" }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!open) return;
    setSrc(embedUrl(url));
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, url]);

  if (!url) return null;

  return (
    <>
      <style href="fab-meeting" precedence="default">
        {styles}
      </style>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className="fab-btn fab-btn--meet"
        {...trackAttr("floating_contact_click", { channel: "meeting" })}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
          <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
          <path d="M12 12.5v3.2l2.2 1.3" />
        </svg>
        <span className="fab-tip">{label}</span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
        <div className="meet-modal" role="dialog" aria-modal="true" aria-label={label} onClick={() => setOpen(false)}>
          <div className="meet-modal__panel" onClick={(e) => e.stopPropagation()}>
            <div className="meet-modal__bar">
              <span className="meet-modal__title">{label}</span>
              <a href={url} target="_blank" rel="noopener" className="meet-modal__ext">
                Open in new tab ↗
              </a>
              <button type="button" className="meet-modal__close" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            {src && <iframe src={src} title={label} className="meet-modal__frame" />}
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}

const styles = `
.fab-btn--meet {
  position: relative;
  border: 0;
  cursor: pointer;
  background-color: #32c1df;
  color: #0c0d0c;
}
.fab-btn--meet:hover { background-color: #2ab0cc; }

.meet-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(12, 13, 12, 0.55);
  backdrop-filter: blur(2px);
}
.meet-modal__panel {
  display: flex;
  flex-direction: column;
  width: min(1000px, 100%);
  height: min(760px, calc(100dvh - 32px));
  overflow: hidden;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 30px 80px rgba(12, 13, 12, 0.35);
}
.meet-modal__bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem 0.75rem 1.25rem;
  border-bottom: 1px solid #eceeeb;
}
.meet-modal__title { font-weight: 700; color: #0c0d0c; }
.meet-modal__ext { margin-left: auto; font-size: 0.8rem; font-weight: 600; color: #137c93; }
.meet-modal__close {
  width: 2rem; height: 2rem; border: 0; border-radius: 9999px; cursor: pointer;
  background: #f5f6f4; color: #0c0d0c; font-size: 1.25rem; line-height: 1;
}
.meet-modal__frame { flex: 1; width: 100%; border: 0; }
@media (max-width: 639px) {
  .meet-modal { padding: 0; }
  .meet-modal__panel { height: 100dvh; border-radius: 0; }
  .meet-modal__ext { display: none; }
}
`;
