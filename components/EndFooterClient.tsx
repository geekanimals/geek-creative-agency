"use client";

import BrushWord from "./ui/BrushWord";
import GeekLogo from "./ui/GeekLogo";
import type { FooterModel, SocialLink } from "@/lib/site/fallbacks";

/**
 * Footer presentation (unchanged design/behaviour, incl. the hand-lettered
 * highlight and CTA band). Content comes from CMS via the <EndFooter> server
 * wrapper; social links come from Site Settings (single source).
 */
export default function EndFooterClient({ footer, socials }: { footer: FooterModel; socials: SocialLink[] }) {
  const { cta, tagline, copyrightText } = footer;
  const copyright = copyrightText || `© ${new Date().getFullYear()} Geek Creative Agency`;

  return (
    <footer className="border-t border-mist">
      {/* Cyan CTA band */}
      <div className="relative overflow-hidden bg-geek-cyan text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1200 220" preserveAspectRatio="none">
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={-50} y1={i * 20} x2={1250} y2={i * 20 - 120} stroke="#ffffff" strokeOpacity={0.18} strokeWidth={1} />
            ))}
          </svg>
        </div>
        <div className="relative mx-auto flex max-w-edge flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center">
          <h2 className="text-[clamp(1.8rem,4.5vw,3.4rem)]">
            <span className="font-brush leading-none">
              {cta.headingPrefix}{" "}
              <BrushWord color="#083038">{cta.headingHighlight}</BrushWord>{" "}
              {cta.headingSuffix}
            </span>
          </h2>
          <a
            href={cta.buttonHref}
            data-track="contact_cta_click"
            data-track-props='{"from":"footer"}'
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-geek-navy px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-ink"
          >
            {cta.buttonLabel} <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* Slim footer strip */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-edge flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <GeekLogo variant="cyan" className="h-7" />
            <p className="hidden max-w-[34ch] text-xs text-graphite sm:block">{tagline}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <a
                key={s.platform + s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-[0.1em] text-graphite transition hover:text-geek-cyan"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-graphite/70">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
