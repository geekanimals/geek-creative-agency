import localFont from "next/font/local";
import Analytics from "@/components/Analytics";
import Nav from "@/components/layout/Nav";
import EndFooter from "@/components/layout/EndFooter";
import FloatingContact from "@/components/layout/floating/FloatingContact";
import ShareButton from "@/components/layout/floating/ShareButton";
import { SITE, IS_STAGING } from "@/lib/site";
import { getSiteSettings } from "@/lib/cms/globals";
import { getContactPage } from "@/lib/cms/contactPage";

// Fonts are self-hosted (files in ./fonts) so builds never depend on Google
// Fonts being reachable. Same families and weights as before:
// Space Grotesk (display), Inter (body), Caveat 700 (brush accents).
const display = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-display",
  display: "swap",
});

const sans = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

const brush = localFont({
  src: "./fonts/caveat-latin-700-normal.woff2",
  weight: "700",
  variable: "--font-brush",
  display: "swap",
});

// Default/global metadata resolves from CMS Site Settings (SEO), with the static
// SITE values as fallback. Page- and project-specific metadata always overrides
// these. Canonical origin stays ENVIRONMENT-controlled (SITE.url /
// NEXT_PUBLIC_SITE_URL) — never editor-set — so no page can point canonical at
// an arbitrary domain.
export async function generateMetadata() {
  const { seo, name } = await getSiteSettings();
  const ogImages = seo.defaultOgImage ? [{ url: seo.defaultOgImage }] : undefined;
  return {
    metadataBase: new URL(SITE.url),
    title: seo.titleTemplate
      ? { default: seo.defaultTitle, template: seo.titleTemplate }
      : seo.defaultTitle,
    description: seo.defaultDescription,
    applicationName: name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: name,
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      url: "/",
      locale: "en_IN",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.defaultOgImage ? [seo.defaultOgImage] : undefined,
    },
    robots: IS_STAGING
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export default async function RootLayout({ children }) {
  const [settings, contact] = await Promise.all([getSiteSettings(), getContactPage()]);
  // Organization (with the office addresses from Contact → Offices) + WebSite.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: settings.name,
        alternateName: settings.short,
        url: SITE.url,
        logo: `${SITE.url}/geek-logo-cyan.png`,
        description: settings.description,
        ...(settings.socials.length ? { sameAs: settings.socials.map((s) => s.url) } : {}),
        address: contact.offices.items.map((o) => ({
          "@type": "PostalAddress",
          streetAddress: o.address,
          addressLocality: o.city,
          addressCountry: "IN",
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: settings.name,
        publisher: { "@id": `${SITE.url}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${brush.variable}`}>
      <body>
        <style href="layout" precedence="base">
          {layoutStyles}
        </style>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        {children}
        <EndFooter />
        <ShareButton />
        <FloatingContact />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout styles: the document's base reset (Tailwind preflight equivalent)    */
/* and the skip link. Every component keeps all of its own styles in its own   */
/* file; nothing here is shared or reused by other files.                      */
/* -------------------------------------------------------------------------- */
const layoutStyles = `
*,
*::before,
*::after {
  box-sizing: border-box;
  border: 0 solid #e5e7eb;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
  scroll-behavior: smooth;
}

body {
  background: #ffffff;
  color: #0c0d0c;
  font-family: var(--font-sans), system-ui, sans-serif;
  line-height: inherit;
  overflow-x: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

a {
  color: inherit;
  text-decoration: inherit;
}

b,
strong {
  font-weight: bolder;
}

small {
  font-size: 80%;
}

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 1em;
}

hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}

ol,
ul,
menu {
  list-style: none;
}

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  vertical-align: middle;
}

img,
video {
  max-width: 100%;
  height: auto;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
}

button,
select {
  text-transform: none;
}

button,
[role="button"] {
  cursor: pointer;
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
  background-color: transparent;
  background-image: none;
}

:disabled {
  cursor: default;
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  color: #9ca3af;
}

textarea {
  resize: vertical;
}

table {
  border-collapse: collapse;
  text-indent: 0;
  border-color: inherit;
}

summary {
  display: list-item;
}

[hidden] {
  display: none;
}

::selection {
  background: #32c1df;
  color: #06232a;
}

:focus-visible {
  outline: 2px solid #32c1df;
  outline-offset: 2px;
  border-radius: 2px;
}

.skip-link {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.skip-link:focus {
  top: 16px;
  left: 16px;
  z-index: 200;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
  border-radius: 4px;
  background: #0c0d0c;
  padding: 8px 16px;
  color: #ffffff;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`;
