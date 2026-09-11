import { renderOG, ogSize, ogContentType } from "@/lib/og";
import { articleBySlug, insightCategoryMap } from "@/lib/insights";

export const runtime = "edge";
export const alt = "Geek Insights";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return renderOG({
    eyebrow: a ? insightCategoryMap[a.category] : "Insights",
    title: a?.title ?? "Insights",
    tag: "Insight",
  });
}
