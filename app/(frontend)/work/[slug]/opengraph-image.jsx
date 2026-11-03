import { renderOG, ogSize, ogContentType } from "@/lib/og";
import { projectBySlug, projects } from "@/lib/work/projects";
import { categoryMap, serviceMap, campaignMap } from "@/lib/work/taxonomy";
import { brandLabelMap } from "@/lib/work/filters";

export const alt = "Geek case study";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (p) return renderOG({ eyebrow: p.brand, title: p.project, tag: "Case Study" });
  // /work/<value> filter pages (category, brand, service, campaign type)
  const label =
    categoryMap[slug] ?? brandLabelMap(projects)[slug] ?? serviceMap[slug] ?? campaignMap[slug];
  return renderOG({ eyebrow: "Geek", title: label ? `${label} Work` : "The Work", tag: "Work" });
}
