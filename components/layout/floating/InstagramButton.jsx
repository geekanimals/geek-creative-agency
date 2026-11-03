import { trackAttr } from "@/lib/analytics";

/** Round Instagram button — opens Geek's Instagram profile in a new tab. */
export default function InstagramButton({ url }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Geek on Instagram"
      className="fab-btn fab-btn--instagram"
      {...trackAttr("floating_contact_click", { channel: "instagram" })}
    >
      <style href="fab-instagram" precedence="default">
        {styles}
      </style>
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" />
      </svg>
      <span className="fab-tip">Follow us on Instagram</span>
    </a>
  );
}

const styles = `
.fab-btn--instagram {
  background-image: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
  color: #ffffff;
}

.fab-btn--instagram:hover {
  filter: brightness(1.08);
}
`;
