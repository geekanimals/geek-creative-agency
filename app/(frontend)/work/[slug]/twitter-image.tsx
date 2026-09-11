import { ogSize, ogContentType } from "@/lib/og";

// Route-segment config declared directly (Next 16 / Turbopack forbids
// re-exporting `runtime`). Only the image component is re-used.
export { default } from "./opengraph-image";
export const runtime = "edge";
export const alt = "Geek case study";
export const size = ogSize;
export const contentType = ogContentType;
