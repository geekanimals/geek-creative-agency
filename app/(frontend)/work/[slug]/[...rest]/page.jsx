import { notFound } from "next/navigation";
import CaseStudyView, { caseStudyMetadata } from "@/components/work/case-study/CaseStudyView";
import WorkFilterPage, {
  resolveWorkSegments,
  workFilterMetadata,
} from "@/components/work/browse/WorkFilterPage";

/**
 * Everything deeper than /work/<slug>, following the path the visitor took:
 *  - stacked filters           /work/fmcg/doritos
 *  - a story from that page    /work/fmcg/doritos/doritos-for-the-bold
 * Built on first visit, then cached. Unknown or mismatched paths → 404.
 */
export async function generateStaticParams() {
  return [];
}

async function read(params) {
  const { slug, rest } = await params;
  const segments = [slug, ...rest];
  return { segments, resolved: await resolveWorkSegments(segments) };
}

export async function generateMetadata({ params }) {
  const { segments, resolved } = await read(params);
  if (!resolved) return { title: "Work — Geek Creative Agency" };
  if (resolved.story) return caseStudyMetadata(resolved.story);
  return workFilterMetadata(segments);
}

export default async function WorkPathPage({ params }) {
  const { segments, resolved } = await read(params);
  if (!resolved) notFound();
  if (resolved.story) {
    return <CaseStudyView slug={resolved.story} from={segments.slice(0, -1)} />;
  }
  return <WorkFilterPage segments={segments} />;
}
