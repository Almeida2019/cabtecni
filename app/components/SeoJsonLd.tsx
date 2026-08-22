import { getDictionary } from "../i18n";
import { LOCALES, LOCALE_META, localePath, type Locale } from "../i18n/config";
import { SITE, resolveOrigin } from "../site-config";

/**
 * Organization + LocalBusiness structured data.
 *
 * Rendered per view rather than in a layout: the root layout wraps every
 * locale, so emitting it there would put English data on /pt, /es and /fr.
 */
export async function SeoJsonLd({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const origin = await resolveOrigin();

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${origin}/#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: `${origin}${localePath(locale, "/")}`,
    logo: `${origin}/brand/logos/cabtecni-colour.png`,
    image: `${origin}/og.jpg`,
    description: t.meta.siteDescription,
    email: SITE.email,
    telephone: SITE.telephone,
    sameAs: [SITE.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    openingHours: SITE.openingHours,
    areaServed: [{ "@type": "Country", name: "Angola" }],
    knowsAbout: t.serviceData.map((s) => s.title),
    availableLanguage: LOCALES.map((l) => LOCALE_META[l].htmlLang),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
