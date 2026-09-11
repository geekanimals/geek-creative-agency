import type { CollectionConfig } from "payload";
import { isEditorUp, isAdminOrOwner } from "../access/roles";

/**
 * PUBLIC website media (images, videos, posters, logos) NEWLY uploaded through
 * the CMS. Served via Vercel Blob (public CDN URLs). This does NOT touch the
 * existing /public/assets/** — those stay exactly where they are; this
 * collection is only for new CMS-managed media.
 *
 * `read` is public (these are public website assets). Payload auto-adds
 * width/height/mimeType/filesize/focalPoint + createdAt/updatedAt.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Media", useAsTitle: "filename", description: "Public CMS-managed media. (Existing /public/assets are unaffected.)" },
  access: {
    read: () => true, // public website assets
    create: isEditorUp,
    update: isEditorUp,
    delete: isAdminOrOwner,
  },
  upload: {
    focalPoint: true,
    // Explicit MIME allowlist. SVG is DELIBERATELY excluded (uploaded SVGs can
    // carry scripts) — raster + web video only. Byte-size and pixel-dimension
    // limits are enforced at the platform layer (Vercel serverless request-body
    // limit + Vercel Blob), not re-implemented here as fragile collection logic;
    // Sharp rejects malformed/oversized images during derivative generation.
    mimeTypes: [
      "image/jpeg", "image/png", "image/webp", "image/avif", "image/gif",
      "video/mp4", "video/webm", "video/quicktime",
    ],
    // Restrained, technically sensible responsive set (not an excessive matrix):
    //  thumb  → grid thumbnails      · card → work cards
    //  content→ in-article imagery   · hero → full-bleed heroes
    //  og     → fixed 1200×630 social/OpenGraph crop
    // Sizes apply to raster images only; videos/SV/GIF are stored as-is.
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 768 },
      { name: "content", width: 1280 },
      { name: "hero", width: 1920 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
  },
  fields: [
    { name: "altText", type: "text", required: true, admin: { description: "Describe the image for accessibility & SEO. Required." } },
    { name: "caption", type: "text" },
    { name: "credit", type: "text", admin: { description: "Photographer / source / attribution." } },
    {
      name: "rightsStatus",
      type: "select",
      required: true,
      defaultValue: "geek-owned",
      options: [
        { label: "Geek Owned", value: "geek-owned" },
        { label: "Client Archive", value: "client-archive" },
        { label: "Licensed", value: "licensed" },
        { label: "Press Reference Only", value: "press-reference" },
        { label: "Unknown", value: "unknown" },
        { label: "HOLD — do not publish", value: "hold" },
      ],
      admin: { description: "Usage rights. 'HOLD' = not cleared for public use." },
    },
    { name: "rightsNotes", type: "textarea", admin: { description: "Licence terms, expiry, restrictions, approval source." } },
    { name: "usageRestrictions", type: "text", admin: { description: "e.g. 'No public event photography of identifiable guests.'" } },
  ],
};
