import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { revalidateGlobals } from "./hooks";

/**
 * Site NAVIGATION — the header menu items + the primary CTA. CMS controls the
 * CONTENT (labels, destinations, order, visibility); React keeps the header
 * design, animations, responsive/mobile behaviour. Desktop and mobile menus
 * consume this same list.
 */
export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: { group: "Site" },
  versions: true, // version history + rollback; changes publish on save
  access: { read: () => true, update: isEditorUp },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Menu items",
      admin: { description: "Header menu links, in order. Drag to reorder." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true, admin: { description: "Internal path (e.g. /work) or a full external URL (https://…)." } },
        { name: "enabled", type: "checkbox", defaultValue: true, admin: { description: "Uncheck to hide without deleting." } },
        { name: "openInNewTab", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "Header button",
      admin: { description: "The highlighted button on the right of the header." },
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text", admin: { description: "Where the button links (e.g. /creators)." } },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobals] },
};
