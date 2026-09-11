import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import CaseStudy from "@/components/work/CaseStudy";
import FlexibleCaseStudy from "@/components/work/FlexibleCaseStudy";
import ProjectDiscovery from "@/components/work/ProjectDiscovery";
import EvidenceRecognition from "@/components/work/EvidenceRecognition";
import ProjectFaqs from "@/components/work/ProjectFaqs";
import { getFlagshipRenderer } from "@/components/work/flagshipRegistry";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { IS_PROD } from "@/lib/work/projects";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/cms/projects";

export async function generateStaticParams() {
  // Production: published only. Dev: include drafts for review. CMS ∪ static;
  // falls back to static slugs if the CMS is unavailable at build.
  const slugs = await getAllProjectSlugs(!IS_PROD);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const p = await getProjectBySlug(slug, { draft });
  if (!p) return { title: "Work — Geek" };
  const title = p.seoTitle || `${p.project} — ${p.brand} | Geek`;
  const description = p.metaDescription || p.oneLineSummary;
  const image = p.ogImage || p.heroImage;
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title, description, url: `/work/${p.slug}`, type: "article", images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const project = await getProjectBySlug(slug, { draft });

  // Never expose unpublished work in production unless in an authorised preview.
  const published = project?.publishStatus === "published";
  if (!project || (!published && IS_PROD && !draft)) notFound();

  const showDraftBanner = draft || !published;

  // Hybrid dispatch — one uniform path for CMS and static projects.
  let body: React.ReactNode;
  if (project.renderMode === "flagship") {
    const Renderer = getFlagshipRenderer(project.flagshipRendererKey);
    body = <Renderer project={project} />;
  } else if (project.renderMode === "flexible") {
    body = <FlexibleCaseStudy project={project} />;
  } else {
    body = <CaseStudy project={project} />;
  }

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.project, path: `/work/${project.slug}` },
        ])}
      />
      <Nav />
      <main id="main">
        {showDraftBanner && (
          <div className="bg-amber-400 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink">
            {draft ? "Preview — draft (not public)" : "Draft preview — dev only · not public until published"}
          </div>
        )}
        {body}
        {/* Gold Standard evidence + AEO — standard/flexible only; each renders
            nothing when empty, so existing projects are visually unchanged.
            Flagship art direction is never touched. */}
        {project.renderMode !== "flagship" && (
          <>
            <EvidenceRecognition press={project.press} awards={project.awards} />
            <ProjectFaqs faqs={project.faqs} />
          </>
        )}
        {/* Portfolio discovery links — standard/flexible only; flagship art direction untouched. */}
        {project.renderMode !== "flagship" && <ProjectDiscovery project={project} />}
      </main>
      <EndFooter />
    </>
  );
}
