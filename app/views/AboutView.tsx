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

export function AboutView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <main>
      <SiteHeader locale={locale} active="about" path="/about" />
      <div id="main-content">
        <InteriorHero
          eyebrow={t.about.heroKicker}
          title={t.about.heroTitle}
          description={t.about.heroDescription}
          image="/images/cabtecni/about-hero-user-supplied.webp"
          mobileImage="/images/cabtecni/about-hero-user-supplied.webp"
        />

        <ProofBand locale={locale} />

        <section className="interior-section">
          <div className="site-shell editorial-grid">
            <div data-reveal>
              <p className="interior-kicker">{t.about.whoKicker}</p>
              <h2>{t.about.whoHeading}</h2>
            </div>
            <div className="editorial-copy" data-reveal>
              <p className="lead">{t.about.lead}</p>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>
          </div>
        </section>

        <section className="ownership-section">
          <div className="site-shell ownership-grid">
            <div className="ownership-image">
              {/* Portrait crop on phones; see the 560px block in globals.css. */}
              <picture>
                <source
                  media="(max-width: 560px)"
                  srcSet="/images/cabtecni/wellcome-mobile-branded.webp"
                />
                <img src="/images/cabtecni/wellcome-branded.webp" alt="" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div className="ownership-copy" data-reveal>
              <p className="interior-kicker light">{t.about.foundationKicker}</p>
              <h2>{t.about.foundationHeading}</h2>
              <p>{t.about.foundationBody}</p>
              <div className="stat-grid">
                <div><strong data-countup>100%</strong><span>{t.about.statAngolan}</span></div>
                <div><strong data-countup>7</strong><span>{t.about.statSectors}</span></div>
                <div><strong data-countup>8</strong><span>{t.about.statServiceLines}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="interior-section">
          <div className="site-shell">
            <div className="interior-heading" data-reveal>
              <p>{t.about.principlesKicker}</p>
              <h2>{t.about.principlesHeading}</h2>
            </div>
            <div className="principle-grid">
              {t.about.principles.map((principle, i) => (
                <article key={principle.title} data-reveal data-reveal-delay={i + 1}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="values-band" aria-label={t.about.valuesHeading}>
          <div className="site-shell values-inner">
            <div className="values-copy" data-reveal>
              <p className="interior-kicker light">{t.about.valuesKicker}</p>
              <h2>{t.about.valuesHeading}</h2>
              <p>{t.about.valuesBody}</p>
            </div>
            <ul className="values-list">
              {t.about.values.map((value, i) => (
                <li key={value.title} data-reveal data-reveal-delay={i + 1}>
                  <span aria-hidden="true">◆</span>
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="page-cta">
          <div className="site-shell page-cta-inner">
            <div>
              <p>{t.about.ctaKicker}</p>
              <h2>{t.about.ctaHeading}</h2>
            </div>
            <Link href={localePath(locale, "/contact")}>
              {t.about.ctaButton} <span aria-hidden="true">→</span>
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
