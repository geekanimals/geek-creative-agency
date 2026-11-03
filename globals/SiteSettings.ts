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
  admin: { group: "Header, Footer & Settings" },
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
          label: "Floating buttons (Meeting, WhatsApp, Instagram)",
          description: "The round buttons at the bottom-right of every page.",
          fields: [
            { name: "floatingContact", type: "group", label: false, fields: [
              { name: "whatsappNumber", label: "WhatsApp number", type: "text", admin: {
                placeholder: "919876543210",
                description: "Country code + number, digits only (e.g. 919876543210). Set it and a tap opens a chat straight with this number. Empty = WhatsApp opens with the message and asks which chat.",
              }, validate: (v: unknown) => (!v || /^\+?[\d\s-]{8,18}$/.test(String(v)) ? true : "Use digits only, with country code — e.g. 919876543210.") },
              { name: "whatsappMessage", label: "WhatsApp message", type: "textarea", admin: {
                description: "Pre-filled in the chat when someone taps the button.",
              } },
              { name: "instagramUrl", label: "Instagram link", type: "text", admin: {
                placeholder: "https://www.instagram.com/geekanimals",
                description: "Empty = uses the Instagram link from the “Social links” tab.",
              } },
              { name: "meetingUrl", label: "Book a meeting link", type: "text", admin: {
                placeholder: "https://calendly.com/geek/30min",
                description: "Your Calendly (free plan), Google Calendar appointment page or Cal.com link. Connect that tool to Google Calendar once, and days/times already busy in your calendar are never shown. Empty = meeting button hidden.",
              }, validate: (v: unknown) => (!v || /^https:\/\/\S+$/.test(String(v)) ? true : "Paste the full https:// booking link.") },
              { name: "meetingLabel", label: "Meeting button text", type: "text", admin: {
                placeholder: "Book a meeting",
                description: "Shown on hover and as the popup title.",
              } },
              { name: "hideButtons", label: "Hide all buttons", type: "checkbox", defaultValue: false },
            ] },
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
