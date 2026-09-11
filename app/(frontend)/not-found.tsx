import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";

export const metadata: Metadata = {
  title: "Page not found — Geek",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="flex min-h-[70vh] items-center pt-24 sm:pt-28">
        <div className="mx-auto w-full max-w-edge px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">404</p>
          <h1 className="h-display mt-4 max-w-[16ch] text-[clamp(2.4rem,7vw,6rem)] uppercase text-ink">
            Looks like
            <br />
            this idea went
            <br />
            <span className="text-geek-cyan">somewhere else.</span>
          </h1>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/" className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-geek-cyan">
              Back to Geek <span aria-hidden>→</span>
            </a>
            <a href="/work" className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-geek-cyan hover:text-geek-deep">
              See the Work
            </a>
          </div>
        </div>
      </main>
      <EndFooter />
    </>
  );
}
