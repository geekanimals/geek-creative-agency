import { ogSize, ogContentType } from "@/lib/og";

// Route-segment config must be declared DIRECTLY (Next 16 / Turbopack forbids
// re-exporting `runtime` et al.). Only the image component is re-used.
export { default } from "./opengraph-image";
export const runtime = "edge";
export const alt = "Geek Creative Agency — We build brands. Then we make them matter.";
export const size = ogSize;
export const contentType = ogContentType;
