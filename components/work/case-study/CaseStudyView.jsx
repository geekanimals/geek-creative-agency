import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import CaseStudy from "@/components/work/case-study/CaseStudy";
import FlexibleCaseStudy from "@/components/work/case-study/FlexibleCaseStudy";
import ProjectDiscovery from "@/components/work/case-study/ProjectDiscovery";
import EvidenceRecognition from "@/components/work/case-study/EvidenceRecognition";
import ProjectFaqs from "@/components/work/case-study/ProjectFaqs";
import { getFlagshipRenderer } from "@/components/work/case-study/flagshipRegistry";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { serviceMap } from "@/lib/work/taxonomy";

const absUrl = (u) => (/^https?:/.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);
import { IS_STRICT_PROD } from "@/lib/work/projects";
import { getProjectBySlug, getWorkProjects } from "@/lib/cms/projects";
import { projectsForFilters, resolveWorkPath, workPathHref } from "@/lib/work/routes";
import { ogFallback } from "@/lib/seo/ogImage";
import { seoDescription } from "@/lib/seo/description";

/**
 * Case study page, shared by /work/<slug> and /work/<filters…>/<slug>
 * (e.g. /work/fmcg/doritos/doritos-for-the-bold, opened from that filter page),
 * so the URL keeps the place the story was opened from. The canonical URL is always
 * /work/<slug>, so search engines see one page per story.
 */

/**
 * The filter page the story was opened from: `from` is its path segments
 * (["fmcg", "lays"]) → the resolved filters, or null when it is not a filter path.
 */
async function resolveFrom(from) {
  if (!from?.length) return null;
  const resolved = resolveWorkPath(from, await getWorkProjects());
  if (!resolved || resolved.story || resolved.filters.length !== from.length) return null;
  return resolved.filters;
}

export async function caseStudyMetadata(slug) {
  const { isEnabled: draft } = await draftMode();
  const p = await getProjectBySlug(slug, { draft, requireCmsDraft: draft });
  if (!p) return { title: "Work — Geek" };
  const title = p.seoTitle || `${p.project} — ${p.brand} | Geek`;
  const description = seoDescription(p.metaDescription || p.oneLineSummary);
  const image = p.ogImage || p.heroImage;
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `/work/${p.slug}`,
      type: "article",
      images: image ? [{ url: image }] : ogFallback(title, "Case Study"),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyView({ slug, from = [] }) {
  const { isEnabled: draft } = await draftMode();
  const project = await getProjectBySlug(slug, {
    draft,
    requireCmsDraft: draft,
  });

  // Never expose unpublished work in production unless in an authorised preview.
  const published = project?.publishStatus === "published";
  if (!project || (!published && IS_STRICT_PROD && !draft)) notFound();

  // Opened from a filter page: the story must match every filter in the path, else 404.
  const context = await resolveFrom(from);
  if (from?.length && (!context || projectsForFilters(context, [project]).length === 0)) {
    notFound();
  }

  const showDraftBanner = draft || !published;

  // "More Like This" / "Next Project" pool: every PUBLISHED case study (CMS +
  // static), trimmed to card fields so client renderers stay light.
  const pool = (await getWorkProjects())
    .filter((p) => p.publishStatus === "published")
    .map((p) => ({
      slug: p.slug,
      brand: p.brand,
      brandSlug: p.brandSlug,
      project: p.project,
      headline: p.headline,
      heroImage: p.heroImage,
      heroImageNeed: p.heroImageNeed,
      businessCategory: p.businessCategory,
      services: p.services,
      campaignTypes: p.campaignTypes,
      featured: p.featured,
      publishStatus: p.publishStatus,
      nextProject: p.nextProject,
    }));

  // Hybrid dispatch — one uniform path for CMS and static projects.
  let body;
  if (project.renderMode === "flagship") {
    const Renderer = getFlagshipRenderer(project.flagshipRendererKey);
    body = <Renderer project={project} pool={pool} />;
  } else if (project.renderMode === "flexible") {
    // Press + FAQs sit inside the story, before "Next project".
    body = (
      <FlexibleCaseStudy
        project={project}
        pool={pool}
        evidence={
          <>
            <EvidenceRecognition press={project.press} awards={project.awards} />
            <ProjectFaqs faqs={project.faqs} />
          </>
        }
      />
    );
  } else {
    body = <CaseStudy project={project} pool={pool} />;
  }

  return (
    <>
      <style href="work-detail" precedence="default">
        {styles}
      </style>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": `${SITE_URL}/work/${project.slug}#casestudy`,
          url: `${SITE_URL}/work/${project.slug}`,
          name: project.project,
          headline: project.headline || project.project,
          description: project.metaDescription || project.oneLineSummary,
          ...(project.ogImage || project.heroImage
            ? { image: absUrl(project.ogImage || project.heroImage) }
            : {}),
          creator: { "@id": `${SITE_URL}/#organization` },
          ...(project.brand ? { about: { "@type": "Brand", name: project.brand } } : {}),
          ...(project.services?.length
            ? { keywords: project.services.map((x) => serviceMap[x] ?? x).join(", ") }
            : {}),
          inLanguage: "en-IN",
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          ...(context
            ? [
                ...context.map((f, i) => ({
                  name: f.option.label,
                  path: workPathHref(from.slice(0, i + 1)),
                })),
                { name: project.project, path: `${workPathHref(from)}/${project.slug}` },
              ]
            : [{ name: project.project, path: `/work/${project.slug}` }]),
        ])}
      />
      <main id="main">
        {showDraftBanner && (
          <div className="work-detail__draft">
            {draft
              ? "Preview — draft (not public)"
              : "Draft preview — dev only · not public until published"}
          </div>
        )}
        {body}
        {/* Gold Standard evidence + AEO — standard/flexible only; each renders
            nothing when empty, so existing projects are visually unchanged.
            Flagship art direction is never touched. */}
        {project.renderMode !== "flagship" && project.renderMode !== "flexible" && (
          <>
            <EvidenceRecognition press={project.press} awards={project.awards} />
            <ProjectFaqs faqs={project.faqs} />
          </>
        )}
        {/* Portfolio discovery links — standard/flexible only; flagship art direction untouched. */}
        {project.renderMode !== "flagship" && <ProjectDiscovery project={project} />}
      </main>
    </>
  );
}

const styles = `
.work-detail__draft {
  background-color: #fbbf24;
  padding: 0.5rem 1.25rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #0c0d0c;
}
`;
