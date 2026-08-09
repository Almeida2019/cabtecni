import type { Metadata } from "next";
import { SiteChrome } from "./components/SiteChrome";
import { getDictionary } from "./i18n";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, localePath } from "./i18n/config";
import { SITE, resolveOrigin } from "./site-config";
import { THEME_SCRIPT } from "./theme-script";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(DEFAULT_LOCALE);
  const origin = await resolveOrigin();

  const languages = Object.fromEntries(
    LOCALES.map((l) => [LOCALE_META[l].htmlLang, `${origin}${localePath(l, "/")}`]),
  );

  return {
    metadataBase: new URL(origin),
    title: { default: t.meta.siteTitle, template: `%s | ${SITE.shortName}` },
    description: t.meta.siteDescription,
    applicationName: SITE.shortName,
    authors: [{ name: SITE.name }],
    alternates: {
      canonical: origin,
      languages: { ...languages, "x-default": `${origin}/` },
    },
    icons: {
      icon: "/brand/logos/apple-touch-icon.png",
      shortcut: "/brand/logos/apple-touch-icon.png",
      apple: "/brand/logos/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      url: origin,
      siteName: SITE.shortName,
      locale: "en",
      title: t.meta.siteTitle,
      description: t.meta.ogDescription,
      images: [{ url: `${origin}/og.png`, width: 1693, height: 929, alt: `${SITE.shortName} ${SITE.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.siteTitle,
      description: t.meta.ogDescription,
      images: [`${origin}/og.png`],
    },
  };
}

export const viewport = {
  // Matches light --bg / dark --bg so mobile browser chrome blends in.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060f1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout. `lang` is corrected per locale by app/[locale]/layout.tsx.
 * suppressHydrationWarning is required because the anti-flash script mutates
 * <html> before React hydrates.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preload" href="/brand/fonts/poppins-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/brand/fonts/poppins-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <SiteChrome />
      </body>
    </html>
  );
}
