import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";

/**
 * One admin entry per "door" page — /build-my-brand, /careers, /partners.
 * Each holds that page's heading, intro and SEO. The form on the page and its
 * fields stay fixed in code (components/forms/*). Empty = the approved text.
 */
function doorPageGlobal({
  slug,
  label,
  path,
  headingHint,
}: {
  slug: string;
  label: string;
  path: string;
  headingHint: string;
}): GlobalConfig {
  return {
    slug,
    label,
    admin: {
      group: "Pages",
      description: `The ${path} page — heading, intro and SEO. The form itself is fixed.`,
      preview: () => {
        const secret = process.env.PREVIEW_SECRET;
        return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=${path}` : path;
      },
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
            label: "Page text",
            fields: [
              { name: "title", type: "text", admin: { description: `Big heading, e.g. “${headingHint}”` } },
              { name: "intro", type: "textarea", admin: { description: "The paragraph under the heading." } },
            ],
          },
          { label: "SEO", fields: [seoField({ hideLabel: true })] },
        ],
      },
    ],
    hooks: { afterChange: [revalidatePageHook({ tag: slug, path })] },
  };
}

export const BuildMyBrandPage = doorPageGlobal({
  slug: "build-my-brand-page",
  label: "Build My Brand Page",
  path: "/build-my-brand",
  headingHint: "Build my brand.",
});

export const CareersPage = doorPageGlobal({
  slug: "careers-page",
  label: "Careers Page",
  path: "/careers",
  headingHint: "Work at Geek.",
});

export const PartnersPage = doorPageGlobal({
  slug: "partners-page",
  label: "Partners Page",
  path: "/partners",
  headingHint: "Work with Geek.",
});
