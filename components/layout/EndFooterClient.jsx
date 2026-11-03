"use client";

import { useState } from "react";
import Link from "next/link";
import BrushWord from "@/components/ui/BrushWord";
import GeekLogo from "@/components/ui/GeekLogo";
import { FLOATING_CONTACT } from "@/components/layout/floating/contactConfig";

/**
 * Footer: cyan CTA band, then a dark sitemap footer with every page linked.
 * CTA/tagline/copyright from the admin (Footer), socials from Site Settings,
 * offices from Contact Page → Offices & Map. Link columns live in FOOTER_LINKS.
 */
const FOOTER_LINKS = [
  {
    title: "Geek",
    links: [
      { label: "About Geek", href: "/about" },
      { label: "What We Do", href: "/what-we-do" },
      { label: "The Work", href: "/work" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "What we do",
    links: [
      { label: "Build brands", href: "/build" },
      { label: "Create campaigns", href: "/create" },
      { label: "Influence & creators", href: "/influence" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { label: "Build my brand", href: "/build-my-brand", note: "Clients" },
      { label: "Work with brands", href: "/creators", note: "Creators" },
      { label: "Work at Geek", href: "/careers", note: "Jobs" },
      { label: "Partner with Geek", href: "/partners", note: "Vendors" },
    ],
  },
  {
    title: "Explore work",
    links: [
      { label: "PepsiCo", href: "/work/pepsico" },
      { label: "Titan Company", href: "/work/titan-company" },
      { label: "Marico", href: "/work/marico" },
      { label: "The Coolest Job", href: "/work/the-coolest-job" },
      { label: "High Ultra Lounge", href: "/work/high-ultra-lounge" },
    ],
  },
];

/* Brand logos for the social row (official shapes, brand colours). */
const SOCIAL_ICON = {
  instagram: {
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
    svg: (
      <g fill="none" stroke="#fff" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="4.6" />
        <circle cx="12" cy="12" r="3.8" />
        <circle cx="17.1" cy="6.9" r="1" fill="#fff" stroke="none" />
      </g>
    ),
  },
  linkedin: {
    bg: "#0a66c2",
    svg: <path fill="#fff" d="M7.2 19.5H4.1V9.4h3.1v10.1ZM5.6 8a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Zm14.1 11.5h-3.1v-4.9c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6v5h-3.1V9.4h3v1.4c.4-.8 1.4-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8v5.5Z" />,
  },
  youtube: {
    bg: "#ff0000",
    svg: <path fill="#fff" d="M20.6 8.3a2.3 2.3 0 0 0-1.6-1.6C17.6 6.3 12 6.3 12 6.3s-5.6 0-7 .4a2.3 2.3 0 0 0-1.6 1.6C3 9.7 3 12 3 12s0 2.3.4 3.7a2.3 2.3 0 0 0 1.6 1.6c1.4.4 7 .4 7 .4s5.6 0 7-.4a2.3 2.3 0 0 0 1.6-1.6c.4-1.4.4-3.7.4-3.7s0-2.3-.4-3.7ZM10.2 14.6V9.4l4.7 2.6-4.7 2.6Z" />,
  },
  x: {
    bg: "#000000",
    svg: <path fill="#fff" d="M17 4.5h2.7l-5.9 6.7 6.9 8.3h-5.4l-4.2-5.1-4.8 5.1H3.6l6.3-6.9-6.6-8.1h5.5l3.8 4.7L17 4.5Zm-.9 13.4h1.5L8 6H6.4l9.7 11.9Z" />,
  },
  facebook: {
    bg: "#1877f2",
    svg: <path fill="#fff" d="M13.4 20.5v-7.3h2.5l.4-2.9h-2.9V8.5c0-.8.2-1.4 1.4-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.9h2.5v7.3h2.9Z" />,
  },
  gmail: {
    bg: "#ffffff",
    svg: (
      <g>
        <path fill="#4285f4" d="M5 18.5h2.6v-6.3L4 9.5v7.5c0 .8.6 1.5 1 1.5Z" />
        <path fill="#34a853" d="M16.4 18.5H19c.8 0 1-.7 1-1.5V9.5l-3.6 2.7v6.3Z" />
        <path fill="#fbbc04" d="M16.4 7.6v4.6L20 9.5V8c0-1.4-1.6-2.2-2.7-1.4l-.9 1Z" />
        <path fill="#ea4335" d="M7.6 12.2V7.6L12 10.9l4.4-3.3v4.6L12 15.5l-4.4-3.3Z" />
        <path fill="#c5221f" d="M4 8v1.5l3.6 2.7V7.6l-.9-1C5.6 5.8 4 6.6 4 8Z" />
      </g>
    ),
  },
};

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/** One link column. On phones the title is a button that expands/collapses the
 *  list (smooth height animation); from 640px up every list is always open. */
function FooterCol({ col, id, open, onToggle }) {
  return (
    <div className={`footer__col ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="footer__col-title"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        {col.title}
        <span className="footer__col-icon" aria-hidden />
      </button>
      <div className="footer__col-body" id={id}>
        <ul>
          {col.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="footer__link">
                <span>{l.label}</span>
                {l.note && <span className="footer__note">{l.note}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function EndFooterClient({ footer, socials = [], offices = [], meetingUrl = "" }) {
  const { cta, tagline, copyrightText } = footer;
  const copyright = copyrightText || `© ${new Date().getFullYear()} Geek Creative Agency`;
  // Phones: only one link column open at a time.
  const [openCol, setOpenCol] = useState(-1);
  const email = FLOATING_CONTACT.contactEmail;
  const socialItems = [
    ...socials.map((s) => ({ key: s.platform + s.url, platform: s.platform, label: s.label, href: s.url, external: true })),
    ...(email ? [{ key: "gmail", platform: "gmail", label: "Email", href: `mailto:${email}`, external: false }] : []),
  ];

  return (
    <footer className="footer">
      <style href="footer" precedence="default">
        {styles}
      </style>

      {/* Cyan CTA band */}
      <div className="footer__band">
        <div className="footer__band-art" aria-hidden>
          <svg className="footer__band-lines" viewBox="0 0 1200 220" preserveAspectRatio="none">
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={-50} y1={i * 20} x2={1250} y2={i * 20 - 120} stroke="#ffffff" strokeOpacity={0.18} strokeWidth={1} />
            ))}
          </svg>
        </div>
        <div className="footer-container footer__band-inner">
          <h2 className="footer__heading">
            <span className="footer__heading-text">
              {cta.headingPrefix} <BrushWord color="#083038">{cta.headingHighlight}</BrushWord> {cta.headingSuffix}
            </span>
          </h2>
          <a href={cta.buttonHref} data-track="contact_cta_click" data-track-props='{"from":"footer"}' className="footer__cta">
            {cta.buttonLabel} <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* Dark sitemap footer */}
      <div className="footer__main">
        <div className="footer-container">
          <div className="footer__grid">
            <div className="footer__about">
              <GeekLogo variant="white" className="footer__logo" />
              {tagline && <p className="footer__tagline">{tagline}</p>}
              <div className="footer__actions">
                {meetingUrl && (
                  <a href={meetingUrl} target="_blank" rel="noopener" className="footer__pill footer__pill--solid">
                    Book a meeting <span aria-hidden>↗</span>
                  </a>
                )}
                <Link href="/contact" className="footer__pill">
                  Contact us <span aria-hidden>→</span>
                </Link>
              </div>
              {socialItems.length > 0 && (
                <ul className="footer__socials" aria-label="Geek on social media">
                  {socialItems.map((s) => {
                    const icon = SOCIAL_ICON[s.platform];
                    return (
                      <li key={s.key}>
                        <a
                          href={s.href}
                          {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="footer__social"
                          aria-label={s.platform === "gmail" ? `Email Geek at ${email}` : `Geek on ${s.label}`}
                          title={s.platform === "gmail" ? email : s.label}
                        >
                          <span className="footer__social-icon" style={{ background: icon?.bg || "#32c1df" }}>
                            {icon ? (
                              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                                {icon.svg}
                              </svg>
                            ) : (
                              <span className="footer__social-letter">{s.label.slice(0, 1)}</span>
                            )}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <nav className="footer__cols" aria-label="Footer">
              {FOOTER_LINKS.map((col, i) => (
                <FooterCol
                  key={col.title}
                  col={col}
                  id={`fcol-${i}`}
                  open={openCol === i}
                  onToggle={() => setOpenCol((o) => (o === i ? -1 : i))}
                />
              ))}
            </nav>
          </div>

          {offices.length > 0 && (
            <div className="footer__offices">
              {offices.map((o) => (
                <a key={o.city} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery || o.address)}`} target="_blank" rel="noopener" className="footer__office">
                  <span className="footer__office-city">{o.city}</span>
                  <span className="footer__office-addr">{o.address}</span>
                </a>
              ))}
            </div>
          )}

          <div className="footer__wordmark" aria-hidden>
            GEEK
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">{copyright}</p>
            <ul className="footer__legal">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer__legal-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="footer__top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top <span aria-hidden>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = `
.footer { border-top: 1px solid #eceeeb; }

.footer__band { position: relative; overflow: hidden; background-color: #32c1df; color: #ffffff; }
.footer__band-art { pointer-events: none; position: absolute; inset: 0; }
.footer__band-lines { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.3; }
.footer__band-inner {
  position: relative; display: flex; flex-direction: column; align-items: flex-start;
  justify-content: space-between; gap: 1.5rem; padding-block: 3rem;
}
.footer__heading { font-size: clamp(1.8rem, 4.5vw, 3.4rem); }
.footer__heading-text { font-family: var(--font-brush), cursive; line-height: 1; }
.footer__cta {
  display: inline-flex; flex-shrink: 0; align-items: center; gap: 0.75rem; border-radius: 9999px;
  background-color: #08252e; padding: 1rem 2rem; font-size: 0.875rem; line-height: 1.25rem;
  font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #ffffff;
  transition: background-color 150ms ease, transform 150ms ease;
}
.footer__cta:hover { background-color: #0c0d0c; transform: translateY(-1px); }

.footer__main { position: relative; overflow: hidden; background: #0c0d0c; color: #ffffff; padding-top: 4rem; }
.footer__grid { display: grid; gap: 3rem; }
.footer__logo.glogo { height: 2.1rem; width: auto; }
.footer__tagline { margin-top: 1.1rem; max-width: 22rem; font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,0.7); }
.footer__actions { margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.6rem; }
.footer__pill {
  display: inline-flex; align-items: center; gap: 0.5rem; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.25); padding: 0.6rem 1.1rem; font-size: 0.82rem; font-weight: 600;
  color: #ffffff; text-decoration: none; transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;
}
.footer__pill:hover { border-color: #32c1df; color: #32c1df; }
.footer__pill--solid { background: #32c1df; border-color: #32c1df; color: #0c0d0c; }
.footer__pill--solid:hover { background: #ffffff; border-color: #ffffff; color: #0c0d0c; }
.footer__socials { list-style: none; margin: 1.75rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.6rem; }
.footer__social { display: block; border-radius: 9999px; text-decoration: none; }
.footer__social-icon {
  display: grid; place-items: center; width: 2.6rem; height: 2.6rem; border-radius: 9999px;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.12); transition: transform 180ms ease, box-shadow 180ms ease;
}
.footer__social:hover .footer__social-icon { transform: translateY(-3px); box-shadow: 0 0 0 2px #32c1df, 0 10px 20px -8px rgba(50,193,223,0.6); }
.footer__social:focus-visible { outline: 2px solid #32c1df; outline-offset: 3px; }
.footer__social-letter { font-weight: 700; color: #fff; }
.footer__email {
  display: inline-block; margin-top: 1rem; font-size: 0.9rem; color: rgba(255,255,255,0.75); text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.25); transition: color 150ms ease, border-color 150ms ease;
}
.footer__email:hover { color: #32c1df; border-color: #32c1df; }

.footer__cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.25rem 1.5rem; }
.footer__col-title {
  display: flex; width: 100%; align-items: center; justify-content: space-between;
  margin: 0 0 1rem; padding: 0; border: 0; background: none; cursor: default; text-align: left;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #32c1df;
}
.footer__col-icon { display: none; }
.footer__col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.7rem; }
.footer__link {
  display: inline-flex; align-items: baseline; gap: 0.5rem; font-size: 0.95rem; color: rgba(255,255,255,0.82);
  text-decoration: none; transition: color 150ms ease, transform 150ms ease;
}
.footer__link:hover { color: #ffffff; transform: translateX(3px); }
.footer__note {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4);
}

.footer__offices {
  margin-top: 3.5rem; display: grid; gap: 1rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.12);
}
.footer__office { display: grid; gap: 0.3rem; text-decoration: none; }
.footer__office-city { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #ffffff; }
.footer__office-addr { font-size: 0.85rem; line-height: 1.55; color: rgba(255,255,255,0.55); transition: color 150ms ease; }
.footer__office:hover .footer__office-addr { color: #32c1df; }

.footer__wordmark {
  position: relative;
  margin-top: 2.5rem; font-family: var(--font-display), system-ui, sans-serif; font-weight: 700;
  font-size: clamp(5rem, 22vw, 19rem); line-height: 0.8; letter-spacing: -0.06em; text-align: center;
  user-select: none; white-space: nowrap;
  /* Brand cyan fading into the dark, with a slow light sweep across it. */
  background:
    linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%) -150% 0 / 60% 100% no-repeat,
    linear-gradient(180deg, #5fd6ee 0%, #32c1df 35%, #137c93 70%, rgba(12,13,12,0) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 1px rgba(95, 214, 238, 0.35);
  opacity: 0.9;
  filter: drop-shadow(0 18px 40px rgba(50, 193, 223, 0.18));
  animation: footer-shine 7s ease-in-out infinite;
}
@keyframes footer-shine {
  0%, 55% { background-position: -150% 0, 0 0; }
  100% { background-position: 250% 0, 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .footer__wordmark { animation: none; }
}

.footer__bottom {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.5rem;
  padding-block: 1.5rem; border-top: 1px solid rgba(255,255,255,0.12);
}
.footer__copyright { margin: 0; font-size: 0.78rem; color: rgba(255,255,255,0.5); }
.footer__legal { list-style: none; margin: 0; padding: 0; display: flex; gap: 1.25rem; }
.footer__legal-link { font-size: 0.78rem; color: rgba(255,255,255,0.5); text-decoration: none; }
.footer__legal-link:hover { color: #ffffff; }
.footer__top {
  margin-left: auto; border: 0; background: none; cursor: pointer; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.6);
}
.footer__top:hover { color: #32c1df; }

.footer-container { width: 100%; max-width: 1400px; margin-inline: auto; padding-inline: 32px; }

@media (max-width: 639px) {
  .footer-container { padding-inline: 20px; }
  .footer__main { padding-top: 3rem; padding-bottom: 4.5rem; }
  .footer__top { margin-left: 0; }
  .footer__link { flex-direction: column; align-items: flex-start; gap: 0.1rem; }

  /* Accordion columns on phones */
  .footer__cols { grid-template-columns: minmax(0, 1fr); gap: 0; border-top: 1px solid rgba(255,255,255,0.12); }
  .footer__col { border-bottom: 1px solid rgba(255,255,255,0.12); }
  .footer__col-title { margin: 0; padding: 1.1rem 0; cursor: pointer; font-size: 0.78rem; }
  .footer__col-icon {
    display: block; position: relative; width: 14px; height: 14px; flex: none;
  }
  .footer__col-icon::before, .footer__col-icon::after {
    content: ""; position: absolute; left: 0; top: 6px; width: 14px; height: 2px; border-radius: 2px;
    background: #ffffff; transition: transform 250ms ease, opacity 250ms ease;
  }
  .footer__col-icon::after { transform: rotate(90deg); }
  .footer__col.is-open .footer__col-icon::after { transform: rotate(0deg); opacity: 0; }
  .footer__col-body {
    display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms ease;
  }
  .footer__col-body > ul {
    overflow: hidden; min-height: 0; padding-bottom: 0; transition: padding-bottom 300ms ease;
  }
  .footer__col.is-open .footer__col-body { grid-template-rows: 1fr; }
  .footer__col.is-open .footer__col-body > ul { padding-bottom: 1.2rem; }
  .footer__offices { margin-top: 2rem; padding-top: 0; border-top: 0; }
}
@media (min-width: 640px) {
  .footer__band-inner { padding-block: 3.5rem; }
  .footer__offices { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
}
@media (min-width: 768px) {
  .footer__band-inner { flex-direction: row; align-items: center; }
}
@media (min-width: 1024px) {
  .footer__grid { grid-template-columns: minmax(0, 1.1fr) minmax(0, 2.4fr); gap: 4rem; }
  .footer__cols { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
`;
