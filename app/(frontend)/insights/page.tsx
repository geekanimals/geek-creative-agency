import { Suspense } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import InsightsExplorer from "@/components/insights/InsightsExplorer";
import { getInsightsIndex } from "@/lib/cms/insights";

export const metadata: Metadata = {
  title: "Insights — What we're geeking out on | Geek",
  description:
    "Geek's thinking on brand building, the creator economy, social & culture, and what's next. New editorial, coming soon.",
  alternates: { canonical: "/insights" },
  openGraph: { title: "Insights — Geek", description: "What we're geeking out on.", url: "/insights", type: "website" },
};

export default async function InsightsPage() {
  const articles = await getInsightsIndex();
  return (
    <>
      <Nav />
      <main id="main" className="pt-24 sm:pt-28">
        <section className="mx-auto max-w-edge px-5 pb-8 pt-6 sm:px-8 sm:pb-10">
          <h1 className="h-display text-[clamp(2.6rem,7vw,6rem)] uppercase text-ink">
            What we&apos;re
            <br />
            <span className="text-geek-cyan">geeking out on.</span>
          </h1>
          <p className="mt-3 text-base text-graphite sm:text-lg">Thinking out loud — brand, creators, culture, and what&apos;s next.</p>
        </section>

        <Suspense fallback={<div className="mx-auto max-w-edge px-5 py-16 text-sm text-graphite sm:px-8">Loading…</div>}>
          <InsightsExplorer articles={articles} />
        </Suspense>
      </main>
      <EndFooter />
    </>
  );
}
