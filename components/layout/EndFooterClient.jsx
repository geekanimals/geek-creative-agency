"use client";

import BrushWord from "@/components/ui/BrushWord";
import GeekLogo from "@/components/ui/GeekLogo";

/**
 * Footer presentation (unchanged design/behaviour, incl. the hand-lettered
 * highlight and CTA band). Content comes from CMS via the <EndFooter> server
 * wrapper; social links come from Site Settings (single source).
 * Props: footer (FooterModel), socials (SocialLink[]) — both from "@/lib/site/fallbacks".
 */
export default function EndFooterClient({ footer, socials }) {
  const { cta, tagline, copyrightText } = footer;
  const copyright = copyrightText || `© ${new Date().getFullYear()} Geek Creative Agency`;

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
              <line
                key={i}
                x1={-50}
                y1={i * 20}
                x2={1250}
                y2={i * 20 - 120}
                stroke="#ffffff"
                strokeOpacity={0.18}
                strokeWidth={1}
              />
            ))}
          </svg>
        </div>
        <div className="footer-container footer__band-inner">
          <h2 className="footer__heading">
            <span className="footer__heading-text">
              {cta.headingPrefix} <BrushWord color="#083038">{cta.headingHighlight}</BrushWord>{" "}
              {cta.headingSuffix}
            </span>
          </h2>
          <a
            href={cta.buttonHref}
            data-track="contact_cta_click"
            data-track-props='{"from":"footer"}'
            className="footer__cta"
          >
            {cta.buttonLabel} <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* Slim footer strip */}
      <div className="footer__strip">
        <div className="footer-container footer__strip-inner">
          <div className="footer__brand">
            <GeekLogo variant="cyan" />
            <p className="footer__tagline">{tagline}</p>
          </div>
          <div className="footer__socials">
            {socials.map((s) => (
              <a
                key={s.platform + s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="footer__copyright">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

const styles = `
.footer {
  border-top: 1px solid #eceeeb;
}

.footer__band {
  position: relative;
  overflow: hidden;
  background-color: #32c1df;
  color: #ffffff;
}

.footer__band-art {
  pointer-events: none;
  position: absolute;
  inset: 0px;
}

.footer__band-lines {
  position: absolute;
  inset: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.footer__band-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding-block: 3rem;
}

.footer__heading {
  font-size: clamp(1.8rem, 4.5vw, 3.4rem);
}

.footer__heading-text {
  font-family: var(--font-brush), cursive;
  line-height: 1;
}

.footer__cta {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.75rem;
  border-radius: 9999px;
  background-color: #08252e;
  padding: 1rem 2rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffffff;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.footer__cta:hover {
  background-color: #0c0d0c;
}

.footer__strip {
  background-color: #ffffff;
}

.footer__strip-inner {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 2rem;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.footer__tagline {
  display: none;
  max-width: 34ch;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #5a5f5c;
}

.footer__socials {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.5rem;
  row-gap: 0px;
}

.footer__social {
  padding-block: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a5f5c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.footer__social:hover {
  color: #32c1df;
}

.footer__copyright {
  font-size: 11px;
  color: rgba(90, 95, 92, 0.7);
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.footer-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .footer-container {
    padding-inline: 20px;
  }
}

@media (min-width: 640px) {
  .footer__tagline {
    display: block;
  }
}

@media (min-width: 768px) {
  .footer__band-inner {
    flex-direction: row;
    align-items: center;
  }

  .footer__strip-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
`;
