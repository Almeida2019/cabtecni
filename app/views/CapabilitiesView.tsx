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

export function CapabilitiesView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <main>
      <SiteHeader locale={locale} active="capabilities" path="/capabilities" />
      <div id="main-content">
        <InteriorHero
          eyebrow={t.capabilities.heroKicker}
          title={t.capabilities.heroTitle}
          description={t.capabilities.heroDescription}
          image="/images/cabtecni/capabilities-hero-angola.webp"
        />

        <ProofBand locale={locale} />

        <section className="interior-section">
          <div className="site-shell editorial-grid">
            <div data-reveal>
              <p className="interior-kicker">{t.capabilities.introKicker}</p>
              <h2>{t.capabilities.introHeading}</h2>
            </div>
            <div className="editorial-copy" data-reveal>
              <p className="lead">{t.capabilities.introLead}</p>
              <p>{t.capabilities.introBody}</p>
            </div>
          </div>
        </section>

        <section className="capability-list-section">
          <div className="site-shell">
            <div className="interior-heading" data-reveal>
              <p>{t.capabilities.pillarsKicker}</p>
              <h2>{t.capabilities.pillarsHeading}</h2>
            </div>
            <div className="capability-list-grid">
              {t.capabilities.items.map((item, i) => (
                <article key={item.title} data-reveal data-reveal-delay={(i % 3) + 1}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="network-section">
          <div className="network-image" />
          <div className="network-copy" data-reveal>
            <p className="interior-kicker light">{t.capabilities.networkKicker}</p>
            <h2>{t.capabilities.networkHeading}</h2>
            <p>{t.capabilities.networkBody}</p>
            <ul>
              {t.capabilities.networkPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <Link href={localePath(locale, "/contact")}>
              {t.capabilities.networkCta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="page-cta">
          <div className="site-shell page-cta-inner">
            <div>
              <p>{t.capabilities.ctaKicker}</p>
              <h2>{t.capabilities.ctaHeading}</h2>
            </div>
            <Link href={localePath(locale, "/contact")}>
              {t.capabilities.ctaButton} <span aria-hidden="true">→</span>
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
