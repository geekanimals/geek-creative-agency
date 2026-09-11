"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GeekLogo from "./ui/GeekLogo";
import type { NavModel } from "@/lib/site/fallbacks";

/**
 * Header presentation (unchanged design/behaviour). Content comes from CMS via
 * the <Nav> server wrapper; this component only renders the normalized model.
 */
export default function NavClient({ nav }: { nav: NavModel }) {
  const links = nav.items;
  const cta = nav.cta;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ext = (external?: boolean, newTab?: boolean) =>
    external || newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-edge items-center justify-between px-5 py-4 sm:px-8">
        <a href="/" aria-label="Geek — home">
          <GeekLogo variant="cyan" className="h-6 sm:h-7" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...ext(l.external, l.newTab)}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {cta && (
            <a
              href={cta.href}
              className="hidden rounded-full bg-geek-cyan px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-geek-deep sm:inline-block"
            >
              {cta.label}
            </a>
          )}
          <button
            className="lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 bg-ink" />
              <span className="block h-0.5 w-6 bg-ink" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-mist bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...ext(l.external, l.newTab)}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-ink"
              >
                {l.label}
              </a>
            ))}
            {cta && (
              <a href={cta.href} onClick={() => setOpen(false)} className="text-lg font-semibold text-geek-deep">
                {cta.label} →
              </a>
            )}
          </nav>
        </div>
      )}
    </motion.header>
  );
}
