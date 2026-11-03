import { trackAttr } from "@/lib/analytics";

/**
 * Round WhatsApp button — always opens WhatsApp (app on phone, WhatsApp Web on
 * desktop) with `message` pre-filled. With `number` set (digits with country
 * code) it opens a chat straight with that number; without it, WhatsApp asks
 * which chat to send the message to.
 */
export default function WhatsAppButton({ number, message }) {
  const digits = (number || "").replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  const href = `https://wa.me/${digits}${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Geek on WhatsApp"
      className="fab-btn fab-btn--whatsapp"
      {...trackAttr("floating_contact_click", { channel: "whatsapp" })}
    >
      <style href="fab-whatsapp" precedence="default">
        {styles}
      </style>
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
        <path
          fill="currentColor"
          d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.94 12.94 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.56l-.4-.24-3.97 1.04 1.06-3.86-.26-.4A10.76 10.76 0 0 1 5.2 16c0-5.97 4.86-10.82 10.84-10.82 5.96 0 10.8 4.85 10.8 10.82 0 5.96-4.84 10.8-10.8 10.8Zm5.93-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.32.33-.54.1-.22.05-.4-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.62-.38Z"
        />
      </svg>
      <span className="fab-tip">Chat on WhatsApp</span>
    </a>
  );
}

const styles = `
.fab-btn--whatsapp {
  background-color: #25d366;
  color: #ffffff;
}

.fab-btn--whatsapp:hover {
  background-color: #1ebe5b;
}
`;
