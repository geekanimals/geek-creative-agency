import CaseStudyView, { caseStudyMetadata } from "@/components/work/case-study/CaseStudyView";
import WorkFilterPage, {
  resolveWorkSegments,
  workFilterMetadata,
  workValueParams,
} from "@/components/work/browse/WorkFilterPage";
import { IS_STRICT_PROD } from "@/lib/work/projects";
import { getAllProjectSlugs } from "@/lib/cms/projects";

/**
 * /work/<slug> is either
 *  - a case study          /work/the-coolest-job
 *  - a filter page         /work/fmcg, /work/doritos, /work/influencer-marketing
 * A story always wins when both share a slug (see lib/work/routes.ts).
 * Deeper paths (/work/fmcg/doritos/…) live in ./[...rest].
 */
export async function generateStaticParams() {
  // Stories — production: published only; dev/preview: drafts too. CMS ∪ static,
  // with a static fallback if the CMS is unavailable at build.
  const stories = await getAllProjectSlugs(!IS_STRICT_PROD);
  const values = await workValueParams();
  return [...new Set([...stories, ...values])].map((slug) => ({ slug }));
}

async function isFilterPage(slug) {
  const resolved = await resolveWorkSegments([slug]);
  return Boolean(resolved && !resolved.story);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (await isFilterPage(slug)) return workFilterMetadata([slug]);
  return caseStudyMetadata(slug);
}

export default async function WorkSlugPage({ params }) {
  const { slug } = await params;
  if (await isFilterPage(slug)) return <WorkFilterPage segments={[slug]} />;
  return <CaseStudyView slug={slug} />;
}
