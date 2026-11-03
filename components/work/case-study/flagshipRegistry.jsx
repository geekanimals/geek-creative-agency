import HighUltraLounge from "@/components/work/case-study/HighUltraLounge";
import CaseStudy_ from "@/components/work/case-study/CaseStudy";

/**
 * FLAGSHIP RENDERER REGISTRY — the ONLY place a flagship key maps to a React
 * component. The CMS stores a restricted key (see lib/work/renderers.ts); it can
 * never inject an arbitrary import. Unknown/missing keys fail safe to the shared
 * standard template. Add a future flagship renderer by adding one entry here.
 */
// Renderer = (props: { project: CaseStudy; pool?: CaseStudy[] }) => ReactNode
// Keys are the FlagshipRendererKey values from lib/work/renderers.ts.

const flagshipRenderers = {
  "high-ultra-lounge": HighUltraLounge,
  // The Coolest Job keeps the shared editorial template as its "art direction",
  // driven by its code-controlled execution blocks; the CMS owns the envelope.
  "the-coolest-job": CaseStudy_,
};

export function getFlagshipRenderer(key) {
  if (key && key in flagshipRenderers) return flagshipRenderers[key];
  return CaseStudy_; // safe fallback — never render an unknown key
}
