import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * Text on the /work page: the hero heading + line and the "Explore all work"
 * heading. The case studies, featured stories and filters come from Projects.
 */
export const WorkPage: GlobalConfig = {
  slug: "work-page",
  label: "Work Page",
  admin: {
    group: "Pages",
    description: "Headings on /work. The case studies themselves are managed under Work → Projects.",
  },
  versions: { drafts: true },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: "published" } }),
    update: isEditorUp,
    readVersions: isEditorUp,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Headings",
          fields: [
            { name: "title", type: "text", admin: { description: "e.g. “The Work.”" } },
            { name: "lede", type: "text", admin: { description: "e.g. “Ideas that made an impact.”" } },
            { name: "exploreTitle", type: "text", admin: { description: "e.g. “Explore All Work.”" } },
          ],
        },
        { label: "SEO", fields: [seoField({ hideLabel: true })] },
      ],
    },
  ],
  hooks: { afterChange: [revalidatePageHook({ tag: "work-page", path: "/work" })] },
};
