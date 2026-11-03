"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@/lib/analytics";

/**
 * Floating "Share" button (bottom-left, every page). Opens a sheet with share
 * targets; each icon opens that app with this page's link ready to send.
 * Instagram and Snapchat have no web "share a link" URL on desktop, so on phones
 * they use the system share sheet (where both apps appear), and on desktop the
 * link is copied and the app's inbox opens so it can be pasted.
 */

const enc = encodeURIComponent;

const ICON = {
  whatsapp: (
    <path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.94 12.94 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.56l-.4-.24-3.97 1.04 1.06-3.86-.26-.4A10.76 10.76 0 0 1 5.2 16c0-5.97 4.86-10.82 10.84-10.82 5.96 0 10.8 4.85 10.8 10.82 0 5.96-4.84 10.8-10.8 10.8Zm5.93-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.32.33-.54.1-.22.05-.4-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.62-.38Z" />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2.4">
      <rect x="5" y="5" width="22" height="22" rx="6.5" />
      <circle cx="16" cy="16" r="5.2" />
      <circle cx="22.8" cy="9.2" r="1.3" fill="currentColor" stroke="none" />
    </g>
  ),
  snapchat: (
    <path fill="currentColor" stroke="#0c0d0c" strokeWidth="1.3" strokeLinejoin="round" d="M16 4.5c-3.9 0-6.6 2.9-6.6 6.7v3.2c-.8.2-1.6-.2-2.2.4-.5.6.1 1.4 1 1.7l1.1.4c-.5 1.6-1.9 3.3-3.8 4-.5.2-.4.8.1 1 1 .4 2 .5 2.4 1.1.3.5.2 1.3.9 1.4.8.1 1.8-.3 3 .1 1.3.4 2.2 1.9 4.1 1.9s2.8-1.5 4.1-1.9c1.2-.4 2.2 0 3-.1.7-.1.6-.9.9-1.4.4-.6 1.4-.7 2.4-1.1.5-.2.6-.8.1-1-1.9-.7-3.3-2.4-3.8-4l1.1-.4c.9-.3 1.5-1.1 1-1.7-.6-.6-1.4-.2-2.2-.4v-3.2c0-3.8-2.7-6.7-6.6-6.7Z" />
  ),
  telegram: (
    <path fill="currentColor" d="M26.6 6.3 4.9 14.7c-1.5.6-1.5 1.4-.3 1.8l5.6 1.7 2.1 6.6c.3.8.5 1.1 1.1 1.1.5 0 .7-.2 1-.5l2.7-2.6 5.6 4.1c1 .6 1.8.3 2.1-1l3.7-17.4c.4-1.6-.6-2.3-1.9-1.7Zm-4.1 4.4-10.1 9.1-.4 4.2-1.9-6 11.8-7.6c.6-.4 1.1-.1.6.3Z" />
  ),
  facebook: (
    <path fill="currentColor" d="M18.2 28V17.3h3.6l.5-4.2h-4.1v-2.7c0-1.2.3-2 2.1-2h2.2V4.6c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.3 1.9-5.3 5.5v3.1H10.4v4.2H14V28h4.2Z" />
  ),
  x: (
    <path fill="currentColor" d="M22.7 5h3.9l-8.5 9.7L28 27h-7.8l-6.1-8-7 8H3.2l9.1-10.4L2.8 5h8l5.5 7.3L22.7 5Zm-1.4 19.7h2.2L10.4 7.2H8.1l13.2 17.5Z" />
  ),
  linkedin: (
    <path fill="currentColor" d="M9.6 26H5.3V12.2h4.3V26ZM7.4 10.3a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM26.7 26h-4.3v-6.7c0-1.6 0-3.7-2.2-3.7s-2.6 1.8-2.6 3.6V26h-4.3V12.2h4.1v1.9h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.6V26Z" />
  ),
  email: (
    <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round">
      <rect x="4.5" y="7.5" width="23" height="17" rx="2.5" />
      <path d="m5.5 9 10.5 8 10.5-8" />
    </g>
  ),
  sms: (
    <path fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" d="M6 7.5h20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H13l-6 4.5v-4.5H6a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
  ),
  copy: (
    <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
      <path d="M13.5 18.5a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M18.5 13.5a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l1.5-1.5" />
    </g>
  ),
  more: (
    <g fill="currentColor">
      <circle cx="8" cy="16" r="2.4" />
      <circle cx="16" cy="16" r="2.4" />
      <circle cx="24" cy="16" r="2.4" />
    </g>
  ),
};

const isMobile = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState({ url: "", title: "" });
  const [canNative, setCanNative] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPage({ url: window.location.href.split("#")[0], title: document.title });
    setCanNative(typeof navigator.share === "function");
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const copy = async () => {
    try {
      // Some browsers leave writeText pending (permission prompt) — fall back after 800ms.
      await Promise.race([
        navigator.clipboard.writeText(page.url),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 800)),
      ]);
    } catch {
      const t = document.createElement("textarea");
      t.value = page.url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const native = async () => {
    try {
      await navigator.share({ title: page.title, text: page.title, url: page.url });
    } catch {
      /* cancelled */
    }
  };

  // Instagram / Snapchat: system share sheet on phones; copy + open the app on desktop.
  const viaApp = (desktopUrl) => async () => {
    if (isMobile() && canNative) return native();
    await copy();
    window.open(desktopUrl, "_blank", "noopener");
  };

  const u = enc(page.url);
  const msg = enc(`${page.title} ${page.url}`);
  const targets = [
    { id: "whatsapp", label: "WhatsApp", bg: "#25d366", href: `https://wa.me/?text=${msg}` },
    { id: "instagram", label: "Instagram", bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%)", onClick: viaApp("https://www.instagram.com/direct/inbox/") },
    { id: "snapchat", label: "Snapchat", bg: "#fffc00", fg: "#ffffff", href: `https://www.snapchat.com/scan?attachmentUrl=${u}` },
    { id: "telegram", label: "Telegram", bg: "#229ed9", href: `https://t.me/share/url?url=${u}&text=${enc(page.title)}` },
    { id: "facebook", label: "Facebook", bg: "#1877f2", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: "x", label: "X", bg: "#0c0d0c", href: `https://twitter.com/intent/tweet?url=${u}&text=${enc(page.title)}` },
    { id: "linkedin", label: "LinkedIn", bg: "#0a66c2", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { id: "email", label: "Email", bg: "#5a5f5c", href: `mailto:?subject=${enc(page.title)}&body=${msg}` },
    { id: "sms", label: "Message", bg: "#34c759", href: `sms:?&body=${msg}` },
    { id: "copy", label: copied ? "Copied!" : "Copy link", bg: "#137c93", onClick: copy },
    ...(canNative ? [{ id: "more", label: "More", bg: "#e6e8e5", fg: "#0c0d0c", onClick: native }] : []),
  ];

  return (
    <>
      <style href="share-fab" precedence="default">
        {styles}
      </style>
      <button
        type="button"
        className="share-fab"
        aria-label="Share this page"
        onClick={() => {
          setOpen(true);
          track("share_open");
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="18" cy="5.5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="18.5" r="2.5" />
          <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" />
        </svg>
        <span className="share-fab__tip">Share this page</span>
      </button>

      {open &&
        createPortal(
          <div className="share-modal" role="dialog" aria-modal="true" aria-label="Share this page" onClick={() => setOpen(false)}>
            <div className="share-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="share-sheet__head">
                <div>
                  <p className="share-sheet__title">Share this page</p>
                  <p className="share-sheet__page">{page.title}</p>
                </div>
                <button type="button" className="share-sheet__close" onClick={() => setOpen(false)} aria-label="Close">
                  ×
                </button>
              </div>

              <div className="share-sheet__grid">
                {targets.map((t) => {
                  const inner = (
                    <>
                      <span className="share-sheet__icon" style={{ background: t.bg, color: t.fg || "#fff" }}>
                        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
                          {ICON[t.id]}
                        </svg>
                      </span>
                      <span className="share-sheet__label">{t.label}</span>
                    </>
                  );
                  const onTrack = () => track("share_click", { channel: t.id });
                  return t.href ? (
                    <a key={t.id} href={t.href} target={/^(mailto|sms):/.test(t.href) ? undefined : "_blank"} rel="noopener noreferrer" className="share-sheet__item" onClick={onTrack}>
                      {inner}
                    </a>
                  ) : (
                    <button key={t.id} type="button" className="share-sheet__item" onClick={() => { onTrack(); t.onClick(); }}>
                      {inner}
                    </button>
                  );
                })}
              </div>

              <div className="share-sheet__link">
                <span className="share-sheet__url">{page.url}</span>
                <button type="button" className="share-sheet__copy" onClick={copy}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

const styles = `
.share-fab {
  position: fixed;
  left: calc(20px + env(safe-area-inset-left, 0px));
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  z-index: 45;
  display: flex;
  width: 3.25rem;
  height: 3.25rem;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  background: #0c0d0c;
  color: #ffffff;
  /* white ring keeps it visible over the dark footer */
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 10px 24px -6px rgba(12, 13, 12, 0.35), 0 2px 6px rgba(12, 13, 12, 0.15);
  transition: transform 200ms ease, background-color 200ms ease;
}
.share-fab:hover { transform: translateY(-2px) scale(1.05); background: #137c93; }
.share-fab:focus-visible { outline: 2px solid #32c1df; outline-offset: 3px; }
.share-fab__tip {
  position: absolute;
  left: calc(100% + 0.65rem);
  top: 50%;
  white-space: nowrap;
  border-radius: 9999px;
  background: #0c0d0c;
  color: #fff;
  padding: 0.45rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  transform: translate(-6px, -50%);
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms ease;
}
.share-fab:hover .share-fab__tip,
.share-fab:focus-visible .share-fab__tip { opacity: 1; transform: translate(0, -50%); }

.share-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0 0 calc(88px + env(safe-area-inset-bottom, 0px)) calc(20px + env(safe-area-inset-left, 0px));
  background: rgba(12, 13, 12, 0.35);
  animation: share-fade 160ms ease both;
}
.share-sheet {
  width: min(400px, calc(100vw - 40px));
  border-radius: 1.25rem;
  background: #ffffff;
  padding: 1.25rem;
  box-shadow: 0 30px 80px rgba(12, 13, 12, 0.35);
  animation: share-up 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.share-sheet__head { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
.share-sheet__title { margin: 0; font-weight: 700; font-size: 1.05rem; color: #0c0d0c; }
.share-sheet__page {
  margin: 0.15rem 0 0; font-size: 0.8rem; color: #5a5f5c;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.share-sheet__close {
  margin-left: auto; flex: none; width: 2rem; height: 2rem; border: 0; border-radius: 9999px;
  background: #f1f3f0; color: #0c0d0c; font-size: 1.25rem; line-height: 1; cursor: pointer;
}
.share-sheet__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.9rem 0.5rem; }
.share-sheet__item {
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  border: 0; background: none; padding: 0.25rem 0; cursor: pointer; text-decoration: none; color: #0c0d0c;
}
.share-sheet__icon {
  display: grid; place-items: center; width: 3.1rem; height: 3.1rem; border-radius: 9999px;
  transition: transform 150ms ease;
}
.share-sheet__item:hover .share-sheet__icon { transform: translateY(-2px) scale(1.06); }
.share-sheet__label { font-size: 0.72rem; font-weight: 600; color: #3a3f3c; }
.share-sheet__link {
  display: flex; align-items: center; gap: 0.5rem; margin-top: 1.1rem;
  border: 1px solid #e3e6e2; border-radius: 9999px; padding: 0.35rem 0.35rem 0.35rem 0.9rem;
}
.share-sheet__url { flex: 1; min-width: 0; font-size: 0.78rem; color: #5a5f5c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.share-sheet__copy {
  flex: none; border: 0; border-radius: 9999px; background: #0c0d0c; color: #fff;
  padding: 0.45rem 0.9rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;
}
@keyframes share-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes share-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (max-width: 639px) {
  .share-fab {
    left: calc(16px + env(safe-area-inset-left, 0px));
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    width: 3rem; height: 3rem;
  }
  .share-fab__tip { display: none; }
  .share-modal { align-items: flex-end; justify-content: center; padding: 0; }
  .share-sheet { width: 100%; border-radius: 1.25rem 1.25rem 0 0; padding-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px)); }
}
@media print { .share-fab { display: none; } }
`;
