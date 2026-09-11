import { renderOG, ogSize, ogContentType } from "@/lib/og";
import { projectBySlug } from "@/lib/work/projects";

export const runtime = "edge";
export const alt = "Geek case study";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  return renderOG({
    eyebrow: p?.brand ?? "Geek",
    title: p?.project ?? "The Work",
    tag: "Case Study",
  });
}
