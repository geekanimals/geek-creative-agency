import { renderOG, ogSize, ogContentType } from "@/lib/og";

export const alt = "Geek Creative Agency — We build brands. Then we make them matter.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOG({ eyebrow: "Creative agency · India", title: "We build brands. Then we make them matter." });
}
