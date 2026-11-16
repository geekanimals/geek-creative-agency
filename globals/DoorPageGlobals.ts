import type { GlobalConfig, Tab } from "payload";
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
  extraTabs = [],
}: {
  slug: string;
  label: string;
  path: string;
  headingHint: string;
  extraTabs?: Tab[];
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
          ...extraTabs,
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

/** Careers → "Open roles": the jobs and internships listed above the form. */
const careerOpeningsTab: Tab = {
  label: "Open roles",
  description: "Jobs listed on /careers. Untick “Open” to hide a role without deleting it. No roles = “no openings right now” message.",
  fields: [
    {
      name: "openings",
      type: "array",
      labels: { singular: "Role", plural: "Roles" },
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", required: true, admin: { description: "e.g. Senior Copywriter" } },
        {
          type: "row",
          fields: [
            {
              name: "jobType",
              label: "Type",
              type: "select",
              required: true,
              defaultValue: "full-time",
              options: [
                { label: "Full-time", value: "full-time" },
                { label: "Internship", value: "internship" },
                { label: "Part-time", value: "part-time" },
                { label: "Contract", value: "contract" },
              ],
              admin: { width: "33%" },
            },
            { name: "team", type: "text", admin: { width: "33%", description: "e.g. Creative, Digital, Tech" } },
            { name: "location", type: "text", admin: { width: "33%", description: "e.g. Bangalore / Gurugram / Remote" } },
          ],
        },
        { name: "experience", type: "text", admin: { description: "e.g. 2–4 years" } },
        { name: "summary", type: "textarea", admin: { description: "Two or three lines about the role." } },
        { name: "responsibilities", type: "textarea", admin: { description: "One point per line." } },
        { name: "requirements", type: "textarea", admin: { description: "One point per line." } },
        { name: "open", type: "checkbox", defaultValue: true, admin: { description: "Show this role on the site." } },
      ],
    },
    {
      name: "internship",
      type: "group",
      label: "Internships box",
      fields: [
        { name: "show", type: "checkbox", defaultValue: true, admin: { description: "Show the internships box." } },
        { name: "heading", type: "text", admin: { description: "Empty = “Internships at Geek.”" } },
        { name: "body", type: "textarea", admin: { description: "Empty = the standard internship text." } },
      ],
    },
  ],
};

export const CareersPage = doorPageGlobal({
  slug: "careers-page",
  label: "Careers Page",
  path: "/careers",
  headingHint: "Work at Geek.",
  extraTabs: [careerOpeningsTab],
});

export const PartnersPage = doorPageGlobal({
  slug: "partners-page",
  label: "Partners Page",
  path: "/partners",
  headingHint: "Work with Geek.",
});
