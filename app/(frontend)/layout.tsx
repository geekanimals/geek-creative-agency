import type { Metadata } from "next";
import { Space_Grotesk, Inter, Caveat } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { SITE, IS_STAGING } from "@/lib/site";
import { getSiteSettings } from "@/lib/cms/globals";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const brush = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-brush",
  display: "swap",
});

// Default/global metadata resolves from CMS Site Settings (SEO), with the static
// SITE values as fallback. Page- and project-specific metadata always overrides
// these. Canonical origin stays ENVIRONMENT-controlled (SITE.url /
// NEXT_PUBLIC_SITE_URL) — never editor-set — so no page can point canonical at
// an arbitrary domain.
export async function generateMetadata(): Promise<Metadata> {
  const { seo, name } = await getSiteSettings();
  const ogImages = seo.defaultOgImage ? [{ url: seo.defaultOgImage }] : undefined;
  return {
    metadataBase: new URL(SITE.url),
    title: seo.titleTemplate ? { default: seo.defaultTitle, template: seo.titleTemplate } : seo.defaultTitle,
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
    twitter: { card: "summary_large_image", title: seo.defaultTitle, description: seo.defaultDescription, images: seo.defaultOgImage ? [seo.defaultOgImage] : undefined },
    robots: IS_STAGING
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    alternateName: settings.short,
    url: SITE.url,
    logo: `${SITE.url}/geek-logo-cyan.png`,
    description: settings.description,
    ...(settings.socials.length ? { sameAs: settings.socials.map((s) => s.url) } : {}),
  };
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${brush.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Analytics />
      </body>
    </html>
  );
}
