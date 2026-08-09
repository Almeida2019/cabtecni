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
import { SERVICE_IMAGES } from "../site-data";

export function ServicesView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <main>
      <SiteHeader locale={locale} active="services" path="/services" />
      <div id="main-content">
        <InteriorHero
          eyebrow={t.services.heroKicker}
          title={t.services.heroTitle}
          description={t.services.heroDescription}
          image="/images/cabtecni/hero-industry.webp"
          mobileImage="/images/cabtecni/hero-industry-mobile.webp"
        />

        <ProofBand locale={locale} />

        <section className="interior-section service-intro">
          <div className="site-shell editorial-grid">
            <div data-reveal>
              <p className="interior-kicker">{t.services.introKicker}</p>
              <h2>{t.services.introHeading}</h2>
            </div>
            <div className="editorial-copy" data-reveal>
              <p className="lead">{t.services.introLead}</p>
              <p>{t.services.introBody}</p>
            </div>
          </div>
        </section>

        <section className="service-detail-section">
          <div className="site-shell service-detail-list">
            {t.serviceData.map((service, index) => (
              <article key={service.title} data-reveal>
                <div className="service-detail-image">
                  <img src={SERVICE_IMAGES[index]} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="service-detail-copy">
                  <span>{t.services.serviceLabel} {String(index + 1).padStart(2, "0")}</span>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <p>{service.detail}</p>
                  <Link href={localePath(locale, "/contact")}>
                    {t.services.discussService} <b aria-hidden="true">→</b>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="delivery-band">
          <div className="site-shell">
            <div className="interior-heading light" data-reveal>
              <p>{t.services.deliveryKicker}</p>
              <h2>{t.services.deliveryHeading}</h2>
            </div>
            <div className="delivery-grid">
              {t.services.deliverySteps.map((step, i) => (
                <article key={step.title} data-reveal data-reveal-delay={i + 1}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-cta">
          <div className="site-shell page-cta-inner">
            <div>
              <p>{t.services.ctaKicker}</p>
              <h2>{t.services.ctaHeading}</h2>
            </div>
            <Link href={localePath(locale, "/contact")}>
              {t.services.ctaButton} <span aria-hidden="true">→</span>
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
