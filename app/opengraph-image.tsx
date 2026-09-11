import { renderOG, ogSize, ogContentType } from "@/lib/og";

export const runtime = "edge";
export const alt = "Geek Creative Agency — We build brands. Then we make them matter.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOG({ eyebrow: "Geek Creative Agency", title: "We build brands. Then we make them matter." });
}
