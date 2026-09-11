import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MediaChanged from "@/components/MediaChanged";
import LogoWall from "@/components/LogoWall";
import Build from "@/components/Build";
import Create from "@/components/Create";
import Influence from "@/components/Influence";
import Proof from "@/components/Proof";
import Process from "@/components/Process";
import BuiltByGeek from "@/components/BuiltByGeek";
import GeekWay from "@/components/GeekWay";
import WorkWall from "@/components/WorkWall";
import FourDoors from "@/components/FourDoors";
import EndFooter from "@/components/EndFooter";
import { getHomePage } from "@/lib/cms/homePage";
import { getSiteSettings } from "@/lib/cms/globals";

// Homepage inherits the site-default SEO (layout / Site Settings) unless an
// editor sets homepage-specific overrides — returning {} keeps the layout
// metadata exactly, so nothing drifts when no override exists.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage();
  if (!seo.metaTitle && !seo.metaDescription && !seo.ogImage && !seo.noindex) return {};
  const site = await getSiteSettings();
  const title = seo.metaTitle || site.seo.defaultTitle;
  const description = seo.metaDescription || site.seo.defaultDescription;
  const ogImage = seo.ogImage || site.seo.defaultOgImage;
  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: site.name, title, description, url: "/", locale: "en_IN", images: ogImage ? [{ url: ogImage }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: ogImage ? [ogImage] : undefined },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Home() {
  const { isEnabled: draft } = await draftMode();
  const home = await getHomePage({ draft });
  return (
    <>
      <Nav />
      <main id="main">
        {draft && (
          <div className="bg-amber-400 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink">
            Preview — draft (not public)
          </div>
        )}
        <Hero content={home.hero} />                    {/* 1  — Hero */}
        <MediaChanged />                                {/* 2  — The Media Changed (art-directed, code) */}
        <LogoWall content={home.logoWall} />            {/* 3  — Client Logo Wall */}
        <Build content={home.build} />                  {/* 4  — BUILD */}
        <Create content={home.create} />                {/* 5  — CREATE */}
        <Influence content={home.influence} />          {/* 6  — INFLUENCE */}
        <Proof content={home.proof} />                  {/* 7  — PROOF */}
        <Process content={home.process} />              {/* 8  — Big idea to last mile */}
        <BuiltByGeek content={home.builtByGeek} />      {/* 9  — Built by Geek */}
        <GeekWay content={home.geekWay} />              {/* 10 — The Geek Way */}
        <WorkWall content={home.work} />                {/* 11 — The Work */}
        <FourDoors />                                   {/* 12 — Four Doors (code defaults) */}
      </main>
      <EndFooter />                                     {/* 13 — End */}
    </>
  );
}
