import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { revalidateGlobals } from "./hooks";

/**
 * SITE SETTINGS — site-wide identity, social links (the single source), and
 * default/global SEO. Page- and project-specific SEO always wins over these
 * defaults. The canonical production origin is intentionally NOT here: it stays
 * environment-controlled (NEXT_PUBLIC_SITE_URL) so an editor can never point
 * every page's canonical at an arbitrary domain.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Site" },
  versions: true,
  access: { read: () => true, update: isEditorUp },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "name", type: "text", admin: { description: "Full agency name." } },
            { name: "short", type: "text", admin: { description: "Short name (e.g. Geek)." } },
            { name: "description", type: "textarea", admin: { description: "One–two sentence agency descriptor (also the default meta description)." } },
          ],
        },
        {
          label: "Social links",
          fields: [
            {
              name: "socialLinks",
              type: "array",
              labels: { singular: "Social link", plural: "Social links" },
              admin: { description: "The single source of social links — the footer and JSON-LD read these." },
              fields: [
                { name: "platform", type: "select", required: true, options: [
                  { label: "Instagram", value: "instagram" },
                  { label: "LinkedIn", value: "linkedin" },
                  { label: "YouTube", value: "youtube" },
                  { label: "X", value: "x" },
                  { label: "Facebook", value: "facebook" },
                ] },
                { name: "label", type: "text", admin: { description: "Display label (defaults to the platform name)." } },
                { name: "url", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Default SEO",
          admin: { description: "Fallback metadata. Individual pages and projects override these." },
          fields: [
            { name: "seo", type: "group", fields: [
              { name: "defaultTitle", type: "text", admin: { description: "Homepage / default browser title." } },
              { name: "titleTemplate", type: "text", admin: { description: "Optional, e.g. “%s | Geek”. Leave empty — existing pages set complete titles." } },
              { name: "defaultDescription", type: "textarea" },
              { name: "defaultOgImage", type: "upload", relationTo: "media", admin: { description: "Default social share image." } },
              { name: "orgName", type: "text", admin: { description: "Organization name for structured data." } },
            ] },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobals] },
};
