import { draftMode } from "next/headers";
import Hero from "@/components/home/Hero";
import MediaChanged from "@/components/home/MediaChanged";
import LogoWall from "@/components/home/LogoWall";
import Build from "@/components/home/Build";
import Create from "@/components/home/Create";
import Influence from "@/components/home/Influence";
import Proof from "@/components/home/Proof";
import Process from "@/components/home/Process";
import BuiltByGeek from "@/components/home/BuiltByGeek";
import GeekWay from "@/components/home/GeekWay";
import WorkWall from "@/components/home/WorkWall";
import FourDoors from "@/components/doors/FourDoors";
import { getHomePage } from "@/lib/cms/homePage";
import { getSiteSettings } from "@/lib/cms/globals";
import { getGeekOsCreators } from "@/lib/geekos/creators";
import { getWorkProjects } from "@/lib/cms/projects";
import { buildFriendLogos } from "@/lib/site/friendLogos";

// Homepage inherits the site-default SEO (layout / Site Settings) unless an
// editor sets homepage-specific overrides — returning {} keeps the layout
// metadata exactly, so nothing drifts when no override exists.
export async function generateMetadata() {
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
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: "/",
      locale: "en_IN",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Home() {
  const { isEnabled: draft } = await draftMode();
  const [home, creators, projects] = await Promise.all([
    getHomePage({ draft }),
    getGeekOsCreators(48),
    getWorkProjects(),
  ]);
  // "The Work." slider: published case studies (with a picture) not already in
  // the curated first cards — loaded by "& more" / sliding to the end.
  // Logo strip: admin clients + every brand with a published case study.
  const friendLogos = buildFriendLogos(home.logoWall.logos, projects);
  const bySlug = new Map(
    projects.filter((p) => p.publishStatus === "published").map((p) => [p.slug, p]),
  );
  // "The Work." first cards (admin order); picture/brand come from the case study itself.
  const workCards = home.work.cards.map((c) => {
    const p = bySlug.get(c.key);
    return p
      ? {
          ...c,
          src: c.src ?? p.heroImage,
          brand: c.brand || p.brand,
          project: c.project || p.project,
        }
      : c;
  });
  const curated = new Set(workCards.map((c) => c.key));
  const moreWork = projects
    .filter((p) => p.publishStatus === "published" && p.heroImage && !curated.has(p.slug))
    .map((p) => ({
      key: p.slug,
      href: `/work/${p.slug}`,
      brand: p.brand,
      project: p.project,
      src: p.heroImage,
    }));
  return (
    <>
      <style href="home" precedence="default">
        {styles}
      </style>
      <main id="main">
        {draft && <div className="home__draft">Preview — draft (not public)</div>}
        {/* Header and footer come from app/(frontend)/layout.jsx. */}
        <Hero content={home.hero} video={home.videos.hero} />
        <MediaChanged content={home.mediaChanged} />
        <LogoWall content={home.logoWall} logos={friendLogos} />
        <Build content={home.build} video={home.videos.build} />
        <Create content={home.create} />
        <Influence content={home.influence} creators={creators} />
        <Proof content={home.proof} />
        <Process content={home.process} />
        <BuiltByGeek content={home.builtByGeek} video={home.videos.builtByGeek} />
        <GeekWay content={home.geekWay} />
        <WorkWall content={{ ...home.work, cards: workCards }} more={moreWork} />
        <FourDoors />
      </main>
    </>
  );
}

const styles = `
.home__draft {
  background-color: #fbbf24;
  padding: 0.5rem 1.25rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
}
`;
