"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GeekLogo from "@/components/ui/GeekLogo";

/**
 * Header presentation (unchanged design/behaviour). Content comes from CMS via
 * the <Nav> server wrapper; this component only renders the normalized model.
 * Props: nav (NavModel from "@/lib/site/fallbacks": { items, cta }).
 */
export default function NavClient({ nav }) {
  const links = nav.items;
  const cta = nav.cta;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // The header now lives in the shared layout, so it stays mounted between pages.
  // Close the mobile menu on every route change. The header's slide-in replays only
  // when you move to another SECTION (/work → /about), not inside one — so picking a
  // filter (/work/fmcg → /work/fmcg/pepsi) doesn't make the header vanish and slide back.
  const pathname = usePathname();
  const section = pathname.split("/")[1] || "home";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    // rAF-throttled, with hysteresis (on above 40px, off below 8px) so a page
    // whose height shifts near the threshold can't flip the state in a loop.
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 8 : y > 40));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const ext = (external, newTab) =>
    external || newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <header
      key={section}
      // Slide-in is CSS (.nav-enter): visible at first paint, no wait for JS.
      className={`nav nav-enter ${scrolled ? "nav--scrolled" : ""}`}
    >
      <style href="nav" precedence="default">
        {styles}
      </style>
      <div className="nav-container nav__bar">
        <a href="/" aria-label="Geek — home">
          <GeekLogo variant="cyan" className="nav__logo" />
        </a>

        <nav className="nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href} {...ext(l.external, l.newTab)} className="nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          {cta && (
            <a href={cta.href} className="nav__cta">
              {cta.label}
            </a>
          )}
          <button
            className="nav__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__burger">
              <span
                className={`nav__burger-line nav__burger-line--top ${open ? "nav__burger-line--open-a" : ""}`}
              />
              <span
                className={`nav__burger-line nav__burger-line--bottom ${open ? "nav__burger-line--open-b" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="nav__panel">
          <nav className="nav__panel-links">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...ext(l.external, l.newTab)}
                onClick={() => setOpen(false)}
                className="nav__panel-link"
              >
                {l.label}
              </a>
            ))}
            {cta && (
              <a
                href={cta.href}
                onClick={() => setOpen(false)}
                className="nav__panel-link nav__panel-link--cta"
              >
                {cta.label} →
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

const styles = `
/* Header slide-in (was framer-motion) — CSS so it shows at first paint. */
@keyframes nav-enter { from { opacity: 0; transform: translateY(-80px); } to { opacity: 1; transform: none; } }
.nav-enter { animation: nav-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .nav-enter { animation: none; }
}

.nav {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  z-index: 50;
  background-color: transparent;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.nav--scrolled {
  background-color: rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.nav__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
}

.glogo.nav__logo {
  height: 1.5rem;
}

.nav__links {
  display: none;
  align-items: center;
  gap: 2rem;
}

.nav__link {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: rgba(12, 13, 12, 0.8);
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.nav__link:hover {
  color: #0c0d0c;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav__cta {
  display: none;
  border-radius: 9999px;
  background-color: #32c1df;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffffff;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.nav__cta:hover {
  background-color: #137c93;
}

.nav__toggle {
  margin-right: -0.625rem;
  display: flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
}

.nav__burger {
  position: relative;
  display: block;
  width: 1.5rem;
  height: 0.875rem;
}

.nav__burger-line {
  position: absolute;
  left: 0px;
  display: block;
  width: 1.5rem;
  height: 0.125rem;
  background-color: #0c0d0c;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.nav__burger-line--top {
  top: 0px;
}

.nav__burger-line--bottom {
  top: 0.75rem;
}

.nav__burger-line--open-a {
  top: 0.375rem;
  transform: rotate(45deg);
}

.nav__burger-line--open-b {
  top: 0.375rem;
  transform: rotate(-45deg);
}

.nav__panel {
  max-height: calc(100dvh - 72px);
  overflow-y: auto;
  border-top: 1px solid #eceeeb;
  background-color: #ffffff;
  padding: 1rem 1.25rem;
}

.nav__panel-links {
  display: flex;
  flex-direction: column;
}

.nav__panel-link {
  padding-block: 0.625rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 500;
  color: #0c0d0c;
}

.nav__panel-link--cta {
  font-weight: 600;
  color: #137c93;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.nav-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .nav-container {
    padding-inline: 20px;
  }
}

@media (min-width: 640px) {
  .glogo.nav__logo {
    height: 1.75rem;
  }

  .nav__cta {
    display: inline-block;
  }

  .nav__panel {
    padding-inline: 2rem;
  }
}

@media (min-width: 1024px) {
  .nav__links {
    display: flex;
  }

  .nav__toggle,
  .nav__panel {
    display: none;
  }
}
`;
