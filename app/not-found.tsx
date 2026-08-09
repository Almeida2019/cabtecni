import type { Metadata } from "next";
import Link from "next/link";
import { InteriorHero } from "./components/InteriorHero";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { getDictionary } from "./i18n";
import { DEFAULT_LOCALE, localePath } from "./i18n/config";
import { navItems } from "./navigation";

export const metadata: Metadata = {
  title: getDictionary(DEFAULT_LOCALE).notFound.title,
  description: getDictionary(DEFAULT_LOCALE).notFound.description,
  robots: { index: false, follow: true },
};

/**
 * Always English: a 404 can be triggered by any URL, including ones with no
 * valid locale segment, so there is no reliable locale to read here.
 */
export default function NotFound() {
  const locale = DEFAULT_LOCALE;
  const t = getDictionary(locale);

  return (
    <main>
      <SiteHeader locale={locale} />
      <div id="main-content">
        <InteriorHero
          eyebrow={t.notFound.heroKicker}
          title={t.notFound.heroTitle}
          description={t.notFound.heroDescription}
          image="/images/cabtecni/hero-industry.webp"
        />

        <section className="interior-section">
          <div className="site-shell">
            <div className="interior-heading">
              <p>{t.notFound.kicker}</p>
              <h2>{t.notFound.heading}</h2>
            </div>
            <div className="capability-list-grid">
              {navItems(t).map((item, index) => (
                <article key={item.key}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3><Link href={localePath(locale, item.path)}>{item.label}</Link></h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-cta">
          <div className="site-shell page-cta-inner">
            <div>
              <p>{t.notFound.ctaKicker}</p>
              <h2>{t.notFound.ctaHeading}</h2>
            </div>
            <Link href={localePath(locale, "/contact")}>
              {t.notFound.ctaButton} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
      <SiteFooter locale={locale} />
    </main>
  );
}
