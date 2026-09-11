import type { ReactNode } from "react";
import type { CaseStudy } from "@/lib/work/types";
import type { FlagshipRendererKey } from "@/lib/work/renderers";
import HighUltraLounge from "./HighUltraLounge";
import CaseStudy_ from "./CaseStudy";

/**
 * FLAGSHIP RENDERER REGISTRY — the ONLY place a flagship key maps to a React
 * component. The CMS stores a restricted key (see lib/work/renderers.ts); it can
 * never inject an arbitrary import. Unknown/missing keys fail safe to the shared
 * standard template. Add a future flagship renderer by adding one entry here.
 */
type Renderer = (props: { project: CaseStudy }) => ReactNode;

const flagshipRenderers: Record<FlagshipRendererKey, Renderer> = {
  "high-ultra-lounge": HighUltraLounge,
  // The Coolest Job keeps the shared editorial template as its "art direction",
  // driven by its code-controlled execution blocks; the CMS owns the envelope.
  "the-coolest-job": CaseStudy_,
};

export function getFlagshipRenderer(key?: string | null): Renderer {
  if (key && key in flagshipRenderers) return flagshipRenderers[key as FlagshipRendererKey];
  return CaseStudy_; // safe fallback — never render an unknown key
}
