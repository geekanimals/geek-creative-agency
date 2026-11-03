import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";

/**
 * RETIRED — replaced by one admin entry per page (globals/DoorPageGlobals.ts).
 * Kept registered but hidden only so its (empty) database table isn't dropped in
 * the same migration that creates the new pages (which made the migration tool
 * stop and ask rename-vs-create questions). Safe to delete in a later migration.
 *
 * Text for the three "door" pages: /build-my-brand, /careers and /partners.
 * The forms and their fields stay fixed in code (components/forms/*); this only
 * edits the heading, intro text and SEO of each page. Empty = the approved text.
 */
const doorTab = (label: string, name: string, path: string, headingHint: string) => ({
  label,
  description: `The ${path} page.`,
  fields: [
    {
      name,
      type: "group" as const,
      label: false as const,
      fields: [
        { name: "title", type: "text" as const, admin: { description: `Big heading, e.g. “${headingHint}”` } },
        { name: "intro", type: "textarea" as const, admin: { description: "The paragraph under the heading." } },
        seoField({ hideLabel: false }),
      ],
    },
  ],
});

export const DoorPages: GlobalConfig = {
  slug: "door-pages",
  label: "Door Pages (Brand / Careers / Partners)",
  admin: {
    hidden: true,
    group: "Pages",
    description: "Heading, intro and SEO for /build-my-brand, /careers and /partners. The forms are fixed.",
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
        doorTab("Build my brand", "client", "/build-my-brand", "Build my brand."),
        doorTab("Careers", "career", "/careers", "Work at Geek."),
        doorTab("Partners", "vendor", "/partners", "Work with Geek."),
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidateTag, revalidatePath } = await import("next/cache");
          revalidateTag("door-pages", "max");
          for (const p of ["/build-my-brand", "/careers", "/partners"]) revalidatePath(p);
        } catch {
          /* not in a request context */
        }
        return doc;
      },
    ],
  },
};
