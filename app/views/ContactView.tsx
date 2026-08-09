import { EnquiryForm } from "../components/EnquiryForm";
import { InteriorHero } from "../components/InteriorHero";
import { SeoJsonLd } from "../components/SeoJsonLd";
import { ChatWidget } from "../components/ChatWidget";
import { ScrollReveal } from "../components/ScrollReveal";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getDictionary } from "../i18n";
import type { Locale } from "../i18n/config";
import { SITE } from "../site-config";

/** Renders "a\nb" as two lines without dangerouslySetInnerHTML. */
function MultiLine({ value }: { value: string }) {
  const lines = value.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

export function ContactView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [beforeEmail, afterEmail] = t.contact.enquiryBody2.split("{email}");

  return (
    <main>
      <SiteHeader locale={locale} active="contact" path="/contact" />
      <div id="main-content">
        <InteriorHero
          eyebrow={t.contact.heroKicker}
          title={t.contact.heroTitle}
          description={t.contact.heroDescription}
          image="/images/cabtecni/contact-hero.webp"
          mobileImage="/images/cabtecni/contact-hero-mobile.webp"
        />

        <section className="contact-page-section">
          <div className="site-shell contact-page-grid">
            <div className="contact-page-intro" data-reveal>
              <p className="interior-kicker">{t.contact.introKicker}</p>
              <h2>{t.contact.introHeading}</h2>
              <p>{t.contact.introBody}</p>
              <a href="#enquiry">{t.contact.introCta} <span aria-hidden="true">→</span></a>
            </div>
            <div className="contact-card-grid">
              <article data-reveal data-reveal-delay={1}>
                <span>01</span>
                <h3>{t.contact.cards.email}</h3>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <p>{t.contact.cards.emailNote}</p>
              </article>
              <article data-reveal data-reveal-delay={2}>
                <span>02</span>
                <h3>{t.contact.cards.telephone}</h3>
                <a href={`tel:${SITE.telephone}`}>{SITE.telephoneDisplay}</a>
                <p>{t.contact.cards.telephoneNote}</p>
              </article>
              <article data-reveal data-reveal-delay={3}>
                <span>03</span>
                <h3>{t.contact.cards.location}</h3>
                <p><MultiLine value={t.contact.cards.locationValue} /></p>
              </article>
              <article data-reveal data-reveal-delay={4}>
                <span>04</span>
                <h3>{t.contact.cards.hours}</h3>
                <p><MultiLine value={t.contact.cards.hoursValue} /></p>
              </article>
            </div>
          </div>
        </section>

        <section className="enquiry-section" id="enquiry">
          <div className="site-shell enquiry-grid">
            <div className="enquiry-aside" data-reveal>
              <p className="interior-kicker">{t.contact.enquiryKicker}</p>
              <h2>{t.contact.enquiryHeading}</h2>
              <p>{t.contact.enquiryBody1}</p>
              <p>
                {beforeEmail}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                {afterEmail}
              </p>
            </div>
            <EnquiryForm copy={t.form} />
          </div>
        </section>

        <section className="contact-brief-section">
          <div className="site-shell contact-brief-grid">
            <div data-reveal>
              <p className="interior-kicker light">{t.contact.briefKicker}</p>
              <h2>{t.contact.briefHeading}</h2>
            </div>
            <ol>
              {t.contact.briefSteps.map((step, i) => (
                <li key={step}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-cta">
          <div className="site-shell page-cta-inner">
            <div>
              <p>{t.contact.ctaKicker}</p>
              <h2>{t.contact.ctaHeading}</h2>
            </div>
            <a href={`mailto:${SITE.partnerEmail}`}>
              {SITE.partnerEmail} <span aria-hidden="true">→</span>
            </a>
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
