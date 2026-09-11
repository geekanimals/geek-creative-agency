/**
 * Developer-controlled allowlist of FLAGSHIP renderer keys. The CMS may only
 * store one of these values — it can never inject an arbitrary React component
 * name. The registry that maps each key → a React component lives in
 * components/work/flagshipRegistry.tsx; an unknown/missing key fails safe there.
 *
 * This file contains NO React, so it is safe to import from Payload collection
 * config (server) and from the frontend alike.
 */
export const FLAGSHIP_RENDERER_KEYS = ["high-ultra-lounge", "the-coolest-job"] as const;
export type FlagshipRendererKey = (typeof FLAGSHIP_RENDERER_KEYS)[number];

export const RENDER_MODES = ["standard", "flexible", "flagship"] as const;
export type RenderMode = (typeof RENDER_MODES)[number];

export const isFlagshipKey = (v: unknown): v is FlagshipRendererKey =>
  typeof v === "string" && (FLAGSHIP_RENDERER_KEYS as readonly string[]).includes(v);
