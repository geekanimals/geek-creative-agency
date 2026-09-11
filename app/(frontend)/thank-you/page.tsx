import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";

export const metadata: Metadata = {
  title: "Thank you — Geek",
  description: "Thanks for reaching out to Geek.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

/**
 * Utility confirmation page. Forms currently confirm inline ("Sent — thank
 * you"); this page exists for flows that prefer a redirect on success.
 */
export default function ThankYouPage() {
  return (
    <>
      <Nav />
      <main id="main" className="flex min-h-[70vh] items-center pt-24 sm:pt-28">
        <div className="mx-auto w-full max-w-edge px-5 text-center sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">Got it</p>
          <h1 className="h-display mt-4 text-[clamp(2.4rem,7vw,6rem)] uppercase text-ink">
            Thanks. We&apos;ll <span className="text-geek-cyan">be in touch.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[42ch] text-lg text-graphite">
            Your message is on its way to the Geek team. In the meantime, take a look at the work.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="/work" className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-geek-cyan">
              See the Work <span aria-hidden>→</span>
            </a>
            <a href="/" className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-geek-cyan hover:text-geek-deep">
              Back to Geek
            </a>
          </div>
        </div>
      </main>
      <EndFooter />
    </>
  );
}
