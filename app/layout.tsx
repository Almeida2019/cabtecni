import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteChrome } from "./components/SiteChrome";
import { getDictionary } from "./i18n";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, localePath } from "./i18n/config";
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
      images: [{ url: `${origin}/og.jpg`, width: 1200, height: 630, alt: `${SITE.shortName} ${SITE.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.siteTitle,
      description: t.meta.ogDescription,
      images: [`${origin}/og.jpg`],
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
 * Root layout. This is the only place `<html>` is rendered, and layouts receive
 * no params, so the locale comes from the pathname that middleware.ts forwards
 * as `x-pathname`. Previously this was hardcoded to "en" and patched after
 * hydration, which left the server HTML — what crawlers read — labelling every
 * localised page as English.
 *
 * suppressHydrationWarning is required because the anti-flash script mutates
 * <html> before React hydrates.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const segment = (await headers()).get("x-pathname")?.split("/")[1] ?? "";
  const lang = isLocale(segment) ? LOCALE_META[segment].htmlLang : LOCALE_META[DEFAULT_LOCALE].htmlLang;

  return (
    <html lang={lang} suppressHydrationWarning>
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
