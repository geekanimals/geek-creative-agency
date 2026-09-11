import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { revalidateGlobals } from "./hooks";

/**
 * FOOTER content — the closing call-to-action and the small footer strip. CMS
 * controls the words; React keeps the layout, the brush highlight, colours and
 * animation. Social links live in Site Settings (single source), not here.
 */
export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: { group: "Site" },
  versions: true,
  access: { read: () => true, update: isEditorUp },
  fields: [
    {
      name: "cta",
      type: "group",
      label: "Closing call-to-action",
      admin: { description: "The large cyan band above the footer. The highlighted word is hand-lettered by the design." },
      fields: [
        { type: "row", fields: [
          { name: "headingPrefix", type: "text", admin: { width: "40%", description: "Text before the highlighted word." } },
          { name: "headingHighlight", type: "text", admin: { width: "20%", description: "The hand-lettered word." } },
          { name: "headingSuffix", type: "text", admin: { width: "40%", description: "Text after it." } },
        ] },
        { type: "row", fields: [
          { name: "buttonLabel", type: "text", admin: { width: "50%" } },
          { name: "buttonHref", type: "text", admin: { width: "50%", description: "e.g. /contact" } },
        ] },
      ],
    },
    { name: "tagline", type: "text", admin: { description: "Short line beside the logo in the footer strip." } },
    { name: "copyrightText", type: "text", admin: { description: "Leave empty to show “© <current year> Geek Creative Agency”." } },
  ],
  hooks: { afterChange: [revalidateGlobals] },
};
