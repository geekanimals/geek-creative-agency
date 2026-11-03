import type { GlobalConfig } from "payload";
import { isEditorUp } from "../access/roles";
import { seoField } from "../fields/seoFields";
import { revalidatePageHook } from "./revalidate";
import { videoField } from "../fields/video";

/**
 * HOMEPAGE content. One tab per section, in the order they appear on the page
 * (Hero → Media changed → Logos → Build → Create → Influence → Proof → Process →
 * Built by Geek → The Geek Way → The Work → SEO). Each tab holds that section's
 * text, pictures and video. Every list left empty keeps the built-in defaults
 * (lib/site/homeFallback.ts), so the page never renders blank. The section set
 * and order stay fixed by the design; the creator mosaic comes live from Geek OS.
 *
 * Drafts enabled → editors preview before publishing (see /api/preview).
 */
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  admin: {
    group: "Pages",
    description: "The homepage ( / ). The tabs follow the page from top to bottom — each section's text, images and video are in its own tab. Save a draft and use Preview before publishing.",
    preview: () => {
      const secret = process.env.PREVIEW_SECRET;
      return secret ? `/api/preview?secret=${encodeURIComponent(secret)}&path=/` : "/";
    },
  },
  versions: { drafts: true },
  access: { read: ({ req: { user } }) => (user ? true : { _status: { equals: "published" } }), update: isEditorUp, readVersions: isEditorUp },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "hero", type: "group", label: false, fields: [
              { name: "headingBlock", type: "textarea", admin: { description: "The big headline. Use line breaks for the three lines." } },
              { name: "headingHighlight", type: "text", admin: { description: "Word/phrase shown highlighted cyan (e.g. “matter.”)." } },
              { name: "subline", type: "text" },
              { type: "row", fields: [
                { name: "ctaPrimaryLabel", type: "text", admin: { width: "25%" } },
                { name: "ctaPrimaryHref", type: "text", admin: { width: "25%" } },
                { name: "ctaSecondaryLabel", type: "text", admin: { width: "25%" } },
                { name: "ctaSecondaryHref", type: "text", admin: { width: "25%" } },
              ] },
              videoField({ name: "video", label: "Hero showreel video", description: "The big showreel next to the headline. Upload a video OR paste a YouTube link. Empty = the photo collage." }),
            ] },
          ],
        },
        {
          label: "Media changed",
          fields: [
            { name: "mediaChanged", type: "group", label: false, admin: { description: "The strip under the hero: “The web changed. Social changed. …”. Each card shows a VIDEO if one is set, otherwise the IMAGE. Leave the list empty to keep the current cards." }, fields: [
              { name: "eras", type: "array", labels: { singular: "Card", plural: "Cards" }, fields: [
                { type: "row", fields: [
                  { name: "pre", type: "text", required: true, admin: { width: "40%", description: "Dark words, e.g. “The web”" } },
                  { name: "post", type: "text", required: true, admin: { width: "60%", description: "Grey words, e.g. “changed.”" } },
                ] },
                { type: "row", fields: [
                  { name: "image", type: "upload", relationTo: "media", filterOptions: { mimeType: { contains: "image" } }, admin: { width: "50%", description: "Card image (also the poster while a video loads)." } },
                  { name: "href", type: "text", admin: { width: "50%", description: "Optional link when the card is clicked, e.g. /work/tanishq" } },
                ] },
                videoField({ name: "video", label: "Card video (optional)", description: "Upload a video OR paste a YouTube link. Plays muted on loop; leave “None” to show the image." }),
                { name: "label", type: "text", admin: { description: "Short description of the picture (for SEO / screen readers)." } },
                { name: "animated", type: "checkbox", label: "Use the animated cyan card instead of an image", admin: { description: "Like the “It’ll change again.” card." } },
              ] },
              { type: "row", fields: [
                { name: "finaleKicker", type: "text", admin: { width: "50%", description: "Cyan end card, small line (e.g. “Make brands”)." } },
                { name: "finaleWord", type: "text", admin: { width: "50%", description: "Big brush word (e.g. “Matter.”)." } },
              ] },
            ] },
          ],
        },
        {
          label: "Logos",
          fields: [
            { name: "logoWall", type: "group", label: false, admin: { description: "The “We've made a few friends along the way” logo strip. Brands with a published case study are added automatically (with the Brand logo from that case study). Add the other clients below." }, fields: [
              { name: "heading", type: "text" },
              { name: "headingHighlight", type: "text", admin: { description: "Word highlighted cyan (e.g. “friends”)." } },
              { name: "logos", label: "Other client logos", type: "array", labels: { singular: "Client", plural: "Clients" },
                admin: { description: "Clients without a case study (e.g. Coca-Cola, Durex). Drag to reorder. Leave the list empty to keep the current set." },
                fields: [
                  { type: "row", fields: [
                    { name: "name", type: "text", required: true, admin: { width: "50%", description: "Shown next to the logo." } },
                    { name: "logo", type: "upload", relationTo: "media", filterOptions: { mimeType: { contains: "image" } }, admin: { width: "50%", description: "Logo image (PNG/WebP, transparent if possible)." } },
                  ] },
                ],
              },
            ] },
          ],
        },
        {
          label: "Build",
          fields: [
            { name: "build", type: "group", label: false, admin: { description: "“Build.” band. The cards open their case studies; the button opens /build." }, fields: [
              { name: "title", type: "text" },
              { name: "sub", type: "text" },
              { name: "trailing", type: "text" },
              { name: "buttonLabel", type: "text", admin: { description: "Button that opens the /build page (e.g. “See how we build”). Edit that page in Pages → Build Page." } },
              videoField({ name: "video", label: "First card video", description: "Plays on the first card (The Coolest Job). Upload a video OR paste a YouTube link. Empty = the image." }),
              { name: "cards", type: "array", labels: { singular: "Card", plural: "Cards" }, admin: { description: "The picture cards. Drag to reorder. Empty = the current three (The Coolest Job, High Ultra Lounge, High on Power)." }, fields: [
                { type: "row", fields: [
                  { name: "image", type: "upload", relationTo: "media", filterOptions: { mimeType: { contains: "image" } }, required: true, admin: { width: "50%" } },
                  { name: "href", type: "text", required: true, admin: { width: "50%", description: "Opens on click, e.g. /work/the-coolest-job" } },
                ] },
                { type: "row", fields: [
                  { name: "title", type: "text", required: true, admin: { width: "33%", description: "White title on the picture (e.g. “The Coolest Job”)." } },
                  { name: "line", type: "text", admin: { width: "33%", description: "Cyan line under it." } },
                  { name: "blurb", type: "text", admin: { width: "34%", description: "Small grey line under the card." } },
                ] },
              ] },
            ] },
          ],
        },
        {
          label: "Create",
          fields: [
            { name: "create", type: "group", label: false, admin: { description: "“Create.” band. Use a line break in the sub for the two lines." }, fields: [
              { name: "title", type: "text" },
              { name: "sub", type: "textarea" },
              { name: "buttonLabel", type: "text", admin: { description: "Button that opens the /create page (e.g. “See how we run campaigns”). Edit that page in Pages → Create Page." } },
              { name: "cards", type: "array", labels: { singular: "Photo", plural: "Photos" }, admin: { description: "The creator photos in the slider. Drag to reorder. Empty = the current eight." }, fields: [
                { type: "row", fields: [
                  { name: "image", type: "upload", relationTo: "media", filterOptions: { mimeType: { contains: "image" } }, required: true, admin: { width: "40%" } },
                  { name: "title", type: "text", required: true, admin: { width: "25%", description: "Brand shown on the photo." } },
                  { name: "href", type: "text", required: true, admin: { width: "35%", description: "Case study, e.g. /work/kurkure-puffballs" } },
                ] },
              ] },
            ] },
          ],
        },
        {
          label: "Influence",
          fields: [
            { name: "influence", type: "group", label: false, admin: { description: "“Influence.” band. The creator photos come live from Geek Influencer OS." }, fields: [
              { name: "eyebrow", type: "text" },
              { name: "heading", type: "text" },
              { name: "sub", type: "text" },
              { name: "list", type: "text", admin: { description: "e.g. “Celebrity. Macro. Micro. Nano. UGC. Regional.”" } },
              { type: "row", fields: [
                // No longer shown on the site (the link went nowhere) — kept hidden so saved data stays intact.
                { name: "linkLabel", type: "text", admin: { width: "50%", hidden: true } },
                { name: "linkHref", type: "text", admin: { width: "50%", hidden: true } },
              ] },
              { name: "buttonLabel", type: "text", admin: { description: "Button that opens the /influence page (e.g. “See how influence works”). Edit that page in Pages → Influence Page." } },
            ] },
          ],
        },
        {
          label: "Proof",
          fields: [
            { name: "proof", type: "group", label: false, admin: { description: "“Proof.” band: heading + the brand number rows." }, fields: [
              { name: "eyebrow", type: "text" },
              { name: "sub", type: "text" },
              { name: "cases", type: "array", labels: { singular: "Brand", plural: "Brands" }, admin: { description: "One row of numbers per brand. Only real numbers from a campaign report. Empty = the current Doritos + Lay's rows." }, fields: [
                { type: "row", fields: [
                  { name: "brand", type: "text", required: true, admin: { width: "30%" } },
                  { name: "image", type: "upload", relationTo: "media", filterOptions: { mimeType: { contains: "image" } }, admin: { width: "35%", description: "Small thumbnail." } },
                  { name: "href", type: "text", admin: { width: "35%", description: "Optional link, e.g. /work/lays-heartwork" } },
                ] },
                { name: "stats", type: "array", labels: { singular: "Number", plural: "Numbers" }, fields: [
                  { type: "row", fields: [
                    { name: "value", type: "number", required: true, admin: { width: "30%", description: "e.g. 27.5" } },
                    { name: "suffix", type: "text", admin: { width: "20%", description: "e.g. M+" } },
                    { name: "label", type: "text", required: true, admin: { width: "50%", description: "e.g. Engagements" } },
                  ] },
                ] },
              ] },
            ] },
          ],
        },
        {
          label: "Process",
          fields: [
            { name: "process", type: "group", label: false, admin: { description: "The process rail: heading + the steps." }, fields: [
              { name: "heading", type: "text" },
              { name: "headingHighlight", type: "text", admin: { description: "Part of the heading highlighted cyan (e.g. “to the last mile.”)." } },
              { name: "trailing", type: "text", admin: { description: "e.g. “We make it happen.”" } },
              { name: "steps", type: "array", labels: { singular: "Step", plural: "Steps" }, admin: { description: "The steps on the rail, in order (the icons follow the order). Empty = Idea → Design → Create → Influence → Produce → Pack → Ship → Activate → Measure." }, fields: [
                { name: "label", type: "text", required: true },
              ] },
            ] },
          ],
        },
        {
          label: "Built by Geek",
          fields: [
            { name: "builtByGeek", type: "group", label: false, admin: { description: "The dark “Built by Geek” section: headings, the story cards and the first story's video." }, fields: [
              { name: "eyebrow", type: "text" },
              { name: "headingBlock", type: "textarea", admin: { description: "Main heading. Use a line break for the two lines." } },
              { name: "headingCyan", type: "text", admin: { description: "The cyan line under the heading (e.g. “We write our own.”)." } },
              { name: "closing", type: "text", admin: { description: "The closing statement." } },
              { name: "closingHighlight", type: "text", admin: { description: "Word highlighted cyan (e.g. “exist.”)." } },
              videoField({ name: "video", label: "First story video", description: "Plays on the first story (Give Back to Gurugram). Upload a video OR paste a YouTube link. Empty = the image." }),
              { name: "stories", type: "array", labels: { singular: "Story", plural: "Stories" }, admin: { description: "The big story cards. Empty = Give Back to Gurugram + Sustainify." }, fields: [
                { type: "row", fields: [
                  { name: "image", type: "upload", relationTo: "media", filterOptions: { mimeType: { contains: "image" } }, required: true, admin: { width: "50%" } },
                  { name: "href", type: "text", required: true, admin: { width: "50%", description: "e.g. /work/sustainify or a full https:// link" } },
                ] },
                { type: "row", fields: [
                  { name: "title", type: "text", required: true, admin: { width: "50%", description: "e.g. Sustainify" } },
                  { name: "kicker", type: "text", admin: { width: "50%", description: "e.g. Then Earth did." } },
                ] },
              ] },
            ] },
          ],
        },
        {
          label: "The Geek Way",
          fields: [
            { name: "geekWay", type: "group", label: false, fields: [
              { name: "title", type: "text" },
              { name: "principles", type: "array", labels: { singular: "Principle", plural: "Principles" }, fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "text" },
              ] },
              { name: "finaleBlock", type: "textarea", admin: { description: "The big finale. Use a line break for the two lines (e.g. “We win” / “when you win.”)." } },
              { name: "finaleHighlight", type: "text", admin: { description: "Word(s) highlighted cyan. Separate several with commas, e.g. “We, you”." } },
              { name: "finaleSub", type: "text" },
            ] },
          ],
        },
        {
          label: "The Work",
          fields: [
            { name: "work", type: "group", label: false, admin: { description: "“The Work.” slider: heading + which case studies come first." }, fields: [
              { name: "title", type: "text" },
              { name: "sub", type: "text" },
              { name: "stories", type: "relationship", relationTo: "projects", hasMany: true, admin: { description: "Case studies shown first in the slider, in this order (their hero image is used). The rest load with “& more”. Empty = the current eight." } },
            ] },
          ],
        },
        {
          label: "SEO",
          admin: { description: "Optional — falls back to the site defaults (Site Settings), then the approved static values." },
          fields: [
            seoField({ hideLabel: true }),
            // Old "Videos" tab — the videos now live in each section's own tab. Kept
            // hidden so anything already saved here still plays (used when the
            // section's own video is empty).
            { name: "videos", type: "group", label: false, admin: { hidden: true }, fields: [
              videoField({ name: "hero", label: "Hero showreel" }),
              videoField({ name: "build", label: "“Build.” first card" }),
              videoField({ name: "builtByGeek", label: "“Built by Geek” first story" }),
            ] },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePageHook({ tag: "home-page", path: "/" })],
  },
};
