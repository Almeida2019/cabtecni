import Link from "next/link";
import { InteriorHero } from "../components/InteriorHero";
import { ProofBand } from "../components/ProofBand";
import { SeoJsonLd } from "../components/SeoJsonLd";
import { ChatWidget } from "../components/ChatWidget";
import { ScrollReveal } from "../components/ScrollReveal";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getDictionary } from "../i18n";
import { localePath, type Locale } from "../i18n/config";
import { INDUSTRY_IMAGES } from "../site-data";

export function IndustriesView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <main>
      <SiteHeader locale={locale} active="industries" path="/industries" />
      <div id="main-content">
        <InteriorHero
          eyebrow={t.industries.heroKicker}
          title={t.industries.heroTitle}
          description={t.industries.heroDescription}
          image="/images/cabtecni/offshore-fpso.webp"
        />

        <ProofBand locale={locale} />

        <section className="interior-section">
          <div className="site-shell editorial-grid">
            <div data-reveal>
              <p className="interior-kicker">{t.industries.introKicker}</p>
              <h2>{t.industries.introHeading}</h2>
            </div>
            <div className="editorial-copy" data-reveal>
              <p className="lead">{t.industries.introLead}</p>
              <p>{t.industries.introBody}</p>
            </div>
          </div>
        </section>

        <section className="industry-detail-section">
          <div className="site-shell">
            <div className="interior-heading" data-reveal>
              <p>{t.industries.gridKicker}</p>
              <h2>{t.industries.gridHeading}</h2>
            </div>
            <div className="industry-detail-grid">
              {t.industryData.map((industry, index) => (
                <article key={industry.title} data-reveal data-reveal-delay={(index % 3) + 1}>
                  <img src={INDUSTRY_IMAGES[index]} alt="" loading="lazy" decoding="async" />
                  <div>
                    <span>{t.industries.sectorLabel} {String(index + 1).padStart(2, "0")}</span>
                    <h2>{industry.title}</h2>
                    <p>{industry.description}</p>
                    <Link href={localePath(locale, "/contact")}>
                      {t.industries.discussSector} <b aria-hidden="true">→</b>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sector-approach-section">
          <div className="site-shell sector-approach-grid">
            <div data-reveal>
              <p className="interior-kicker light">{t.industries.approachKicker}</p>
              <h2>{t.industries.approachHeading}</h2>
            </div>
            <div data-reveal>
              <p>{t.industries.approachBody}</p>
              <Link href={localePath(locale, "/capabilities")}>
                {t.industries.approachCta} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="page-cta">
          <div className="site-shell page-cta-inner">
            <div>
              <p>{t.industries.ctaKicker}</p>
              <h2>{t.industries.ctaHeading}</h2>
            </div>
            <Link href={localePath(locale, "/contact")}>
              {t.industries.ctaButton} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
      <SiteFooter locale={locale} />
      <ScrollReveal />
      <SeoJsonLd locale={locale} />
      <ChatWidget locale={locale} copy={t.chat} />
    </main>
  );
}
