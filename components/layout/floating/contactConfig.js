/**
 * Floating contact buttons — CODE DEFAULTS. Change them in the admin panel:
 * Site Settings → “WhatsApp & Instagram buttons”. These values are used only
 * for fields left empty there.
 *
 * whatsappNumber   Country code + number, digits only, e.g. "919876543210".
 *                  Set it and a tap opens a WhatsApp chat straight with Geek.
 *                  While empty, WhatsApp opens with the message ready and asks
 *                  which chat to send it to.
 * whatsappMessage  Text pre-filled in the chat when someone taps the button.
 * instagramUrl     Leave empty to use the Instagram link from Site Settings (CMS).
 */
export const FLOATING_CONTACT = {
  whatsappNumber: "", // ← put Geek's WhatsApp number here, e.g. "919876543210"
  whatsappMessage: "Hi Geek! I found you on your website and would like to talk.",
  instagramUrl: "",
  // "Book a meeting" button — paste the Calendly / Google appointment link in
  // the admin (Site Settings → buttons). Empty = button hidden.
  meetingUrl: "",
  // Email shown in the footer (Gmail icon → opens a new mail to this address).
  contactEmail: "hr@geekcreativeagency.com",
  meetingLabel: "Book a meeting",
};
