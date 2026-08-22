import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../i18n";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, localePath, type Locale } from "../i18n/config";
import { SITE, resolveOrigin } from "../site-config";

/** English is served from the site root, so only the other locales get a
    prefixed route. `/en` deliberately 404s to avoid duplicate content. */
export function generateStaticParams() {
  return LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw) || raw === DEFAULT_LOCALE) return {};
  const locale = raw as Locale;
  const t = getDictionary(locale);
  const origin = await resolveOrigin();

  const languages = Object.fromEntries(
    LOCALES.map((l) => [LOCALE_META[l].htmlLang, `${origin}${localePath(l, "/")}`]),
  );

  return {
    metadataBase: new URL(origin),
    // `absolute` stops the root layout's `template: "%s | Cabtecni"` applying
    // to this segment's own title, which had rendered "Cabtecni | Soluções ...
    // | Cabtecni" on /pt, /es and /fr. `template` must be repeated alongside
    // it: declaring `absolute` alone also clears the inherited template for
    // CHILD routes, which silently dropped the suffix from "Sobre Nós |
    // Cabtecni". Both keys together is the documented combination.
    title: { absolute: t.meta.siteTitle, template: `%s | ${SITE.shortName}` },
    description: t.meta.siteDescription,
    alternates: {
      canonical: `${origin}${localePath(locale, "/")}`,
      languages: { ...languages, "x-default": `${origin}/` },
    },
    openGraph: {
      type: "website",
      url: `${origin}${localePath(locale, "/")}`,
      siteName: SITE.shortName,
      locale: LOCALE_META[locale].htmlLang,
      title: t.meta.siteTitle,
      description: t.meta.ogDescription,
      images: [{ url: `${origin}/og.jpg`, width: 1200, height: 630, alt: `${SITE.shortName} ${SITE.tagline}` }],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  // `/en` would duplicate the root English pages, so it is not a valid route.
  if (!isLocale(raw) || raw === DEFAULT_LOCALE) notFound();

  // `<html lang>` is set server-side in the root layout from the pathname that
  // middleware.ts forwards, so the client-side correction that used to live
  // here is gone — it only ever fixed the DOM after hydration.
  return <>{children}</>;
}
