import WhatsAppButton from "@/components/layout/floating/WhatsAppButton";
import InstagramButton from "@/components/layout/floating/InstagramButton";
import MeetingButton from "@/components/layout/floating/MeetingButton";
import { FLOATING_CONTACT } from "@/components/layout/floating/contactConfig";
import { getFloatingContact, getSiteSettings } from "@/lib/cms/globals";

/**
 * Floating contact buttons, bottom-right on every page (rendered once by
 * app/(frontend)/layout.jsx). Each button is its own component.
 * Values come from the admin (Site Settings → “WhatsApp & Instagram buttons”);
 * ./contactConfig.js is the code fallback for anything left empty there.
 */
export default async function FloatingContact() {
  const [settings, admin] = await Promise.all([getSiteSettings(), getFloatingContact()]);
  if (admin.hidden) return null;
  const number = admin.whatsappNumber || FLOATING_CONTACT.whatsappNumber;
  const message = admin.whatsappMessage || FLOATING_CONTACT.whatsappMessage;
  const instagram =
    admin.instagramUrl ||
    FLOATING_CONTACT.instagramUrl ||
    settings.socials.find((s) => /instagram/i.test(s.label) || /instagram\.com/i.test(s.url))?.url;

  const meetingUrl = admin.meetingUrl || FLOATING_CONTACT.meetingUrl;
  const meetingLabel = admin.meetingLabel || FLOATING_CONTACT.meetingLabel;

  return (
    <div className="fab" role="complementary" aria-label="Contact Geek">
      <style href="fab" precedence="default">
        {styles}
      </style>
      <MeetingButton url={meetingUrl} label={meetingLabel} />
      <WhatsAppButton number={number} message={message} />
      <InstagramButton url={instagram} />
    </div>
  );
}

const styles = `
.fab {
  position: fixed;
  right: calc(20px + env(safe-area-inset-right, 0px));
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  z-index: 45;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fab-btn {
  display: flex;
  width: 3.25rem;
  height: 3.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  box-shadow: 0 10px 24px -6px rgba(12, 13, 12, 0.35), 0 2px 6px rgba(12, 13, 12, 0.15);
  transition-property: transform, background-color, filter, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Label pill that pops out to the left of each button on hover/focus. */
.fab-btn { position: relative; }
.fab-tip {
  position: absolute;
  right: calc(100% + 0.65rem);
  top: 50%;
  white-space: nowrap;
  border-radius: 9999px;
  background: #0c0d0c;
  color: #ffffff;
  padding: 0.45rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: 0 8px 20px -6px rgba(12, 13, 12, 0.35);
  opacity: 0;
  transform: translate(6px, -50%);
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms ease;
}
.fab-btn:hover .fab-tip,
.fab-btn:focus-visible .fab-tip {
  opacity: 1;
  transform: translate(0, -50%);
}
/* On first load, all three labels pop out once so visitors see what each does. */
@media (hover: hover) and (min-width: 640px) and (prefers-reduced-motion: no-preference) {
  .fab-tip { animation: fab-tip-intro 3.4s ease 1.2s 1 backwards; }
  .fab-btn:nth-child(2) .fab-tip { animation-delay: 1.35s; }
  .fab-btn:nth-child(3) .fab-tip { animation-delay: 1.5s; }
}
@keyframes fab-tip-intro {
  0% { opacity: 0; transform: translate(6px, -50%); }
  12%, 85% { opacity: 1; transform: translate(0, -50%); }
  100% { opacity: 0; transform: translate(6px, -50%); }
}

.fab-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 14px 28px -6px rgba(12, 13, 12, 0.4), 0 3px 8px rgba(12, 13, 12, 0.18);
}

.fab-btn:focus-visible {
  outline: 2px solid #32c1df;
  outline-offset: 3px;
}

@media (max-width: 639px) {
  .fab {
    right: calc(16px + env(safe-area-inset-right, 0px));
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    gap: 0.625rem;
  }

  .fab-btn {
    width: 3rem;
    height: 3rem;
  }

  .fab-tip {
    display: none;
  }
}

@media print {
  .fab {
    display: none;
  }
}
`;
