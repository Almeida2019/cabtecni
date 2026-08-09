import Link from "next/link";
import { Fragment } from "react";
import { HeroCarousel, type HeroSlide } from "../components/HeroCarousel";
import { TrustCarousel, type TrustSlide } from "../components/TrustCarousel";
import { ProofBand } from "../components/ProofBand";
import { SeoJsonLd } from "../components/SeoJsonLd";
import { ChatWidget } from "../components/ChatWidget";
import { ScrollReveal } from "../components/ScrollReveal";
import { ServiceIcon } from "../components/ServiceIcons";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getDictionary } from "../i18n";
import { localePath, type Locale } from "../i18n/config";
import { SERVICE_IMAGES, INDUSTRY_IMAGES } from "../site-data";

/**
 * Slide 1 must be oil & gas: the client asked twice, in two separate voice
 * notes, that the very first thing a visitor sees is an FPSO / platform /
 * drill rig rather than containers or logistics. The team photo that used to
 * open the carousel now runs second.
 */
const HERO_IMAGES = [
  "/images/cabtecni/hero-oilgas-fpso.webp",
  "/images/cabtecni/hero-engineering-procurement-branded-user-selected.webp",
  "/images/cabtecni/hero-engineering-branded-v2.webp",
];

/**
 * Portrait frames for the 375x660 phone band, index-aligned with HERO_IMAGES.
 *
 * Slides 2 and 3 are CROPPED from the landscape art above, not regenerated.
 * Generated portrait versions were tried and rejected: against the originals
 * they read as obviously synthetic and cheapened the page. Cropping keeps the
 * photography the client already approved, at the cost of resolution — slide 3
 * only crops to 432x768, so do not expect it to look crisp on a 3x screen.
 *
 * Slide 1 is the exception and IS generated: its two subjects sit at opposite
 * edges, so a portrait crop lands in the empty water between them.
 */
const HERO_IMAGES_MOBILE = [
  "/images/cabtecni/hero-oilgas-fpso-mobile.webp",
  "/images/cabtecni/hero-engineering-procurement-mobile-branded-user-selected.webp",
  "/images/cabtecni/hero-engineering-mobile-branded-v2.webp",
];

/**
 * The home page lists the first four services in full and hands the remaining
 * four to the projects grid below, so all eight still appear but none appears
 * twice. Previously the list carried all eight AND the projects grid repeated
 * the first four, which made the section 2560px tall on a phone — the single
 * longest stretch on the page — for content that already lives on /services.
 */
const HOME_SERVICE_COUNT = 4;

const FEATURE_IMAGES = [
  "/images/cabtecni/technical-experience-angola-cleaned.webp",
  SERVICE_IMAGES[1],
  INDUSTRY_IMAGES[5],
];

const TRUST_VISUALS = [
  { image: "/images/cabtecni/trust-offshore.webp", focus: "center 53%" },
  { image: "/images/cabtecni/trust-logistics.webp", focus: "center 55%" },
  { image: "/images/cabtecni/trust-refinery.webp", focus: "center 52%" },
];

export function HomeView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const heroSlides: HeroSlide[] = t.hero.slides.map((slide, i) => ({
    kicker: slide.kicker,
    headline: [slide.line1, slide.line2],
    body: slide.body,
    cta: { label: slide.cta, href: localePath(locale, i === 2 ? "/contact" : "/services") },
    image: HERO_IMAGES[i],
    mobileImage: HERO_IMAGES_MOBILE[i],
  }));

  const trustSlides: TrustSlide[] = t.home.trustSlides.map((slide, i) => ({
    ...slide,
    ...TRUST_VISUALS[i],
  }));

  return (
    <main>
      <SiteHeader locale={locale} active="home" path="/" />

      <div id="main-content">
        <HeroCarousel
          slides={heroSlides}
          labels={{
            region: t.hero.ariaLabel,
            prev: t.hero.prev,
            next: t.hero.next,
            chooseHighlight: t.hero.chooseHighlight,
            slideOf: t.hero.slideOf,
          }}
        />

        <section className="brand-teamwork-band" aria-label={t.home.teamworkAria}>
          <div className="site-shell">
            <p>{t.home.teamwork}</p>
            <span>{t.home.teamworkSub}</span>
          </div>
        </section>

        <ProofBand locale={locale} />

        <section className="about-section" id="about">
          <div className="site-shell about-grid">
            <div className="about-copy" data-reveal>
              <h2>{t.home.aboutHeading} <strong>{t.home.aboutHeadingStrong}</strong></h2>
              <p>{t.home.aboutP1}</p>
              <figure className="about-mobile-visual" aria-hidden="true">
                <img src="/images/cabtecni/about-banner.webp" alt="" />
              </figure>
              <p>{t.home.aboutP2}</p>
              <div className="commitment-panel">
                <span className="commitment-symbol" aria-hidden="true">100%</span>
                <div>
                  <h3>CABTECNI · <strong>{t.home.commitmentTitle}</strong></h3>
                  <p>{t.home.commitmentBody}</p>
                  <div className="chip-row">
                    {t.home.capabilityTabs.map((tab) => <span key={tab}>{tab}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="focus-grid">
              {t.home.focusAreas.map((area, i) => (
                <Fragment key={area.title}>
                  <article data-reveal data-reveal-delay={i + 1}>
                    <span className="line-icon" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </article>
                  {i === 1 && (
                    <figure className="mobile-section-visual" aria-hidden="true">
                      <img src="/images/cabtecni/strip-offshore.webp" alt="" loading="lazy" decoding="async" />
                    </figure>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="site-shell">
            <div className="section-heading centered" data-reveal>
              <p>{t.home.servicesKicker}</p>
              <h2>{t.home.servicesHeading}</h2>
              <span />
            </div>
            <div className="service-card-grid">
              {t.serviceData.slice(0, HOME_SERVICE_COUNT).map((service, index) => (
                <Fragment key={service.title}>
                  <article data-reveal>
                    <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                    <ServiceIcon index={index} />
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="card-accent" aria-hidden="true" />
                  </article>
                  {index === 1 && (
                    <figure className="service-mobile-image-break" aria-hidden="true">
                      <img src={SERVICE_IMAGES[index]} alt="" loading="lazy" decoding="async" />
                    </figure>
                  )}
                </Fragment>
              ))}
            </div>
            <Link className="accent-button" href={localePath(locale, "/services")}>
              {t.home.servicePortfolio} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Deliberately the one section that breaks the page's card-stack
            rhythm: a dark photographic band rather than another light panel of
            text tiles. The repetition, more than the image count, was what made
            the page read as monotonous. */}
        <section className="process-section process-band" id="process">
          <div className="process-band-shade" aria-hidden="true" />
          <div className="site-shell">
            <div className="section-heading centered" data-reveal>
              <p>{t.home.processKicker}</p>
              <h2>{t.home.processHeading}</h2>
              <span />
            </div>
            <ol className="process-timeline">
              {t.home.processSteps.map((step, i) => (
                <li key={step.title} data-reveal data-reveal-delay={i + 1}>
                  <span className="process-icon" aria-hidden="true">{step.icon}</span>
                  <i aria-hidden="true" />
                  <strong>{String(i + 1).padStart(2, "0")}</strong>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <TrustCarousel
          slides={trustSlides}
          label={t.home.trustHeading}
          previousLabel={t.hero.prev}
          nextLabel={t.hero.next}
        />

        <section className="projects-section" id="projects">
          <div className="site-shell">
            <div className="section-heading centered" data-reveal>
              <p>{t.home.projectsKicker}</p>
              <h2>{t.home.projectsHeading}</h2>
              <span />
            </div>
            <div className="project-grid">
              {/* The four the list above does not cover, so the page shows all
                  eight services without repeating any of them. */}
              {t.serviceData.slice(HOME_SERVICE_COUNT, HOME_SERVICE_COUNT + 4).map((service, i) => (
                <article key={service.title} data-reveal>
                  <div className="project-image">
                    <img src={SERVICE_IMAGES[i + HOME_SERVICE_COUNT]} alt="" loading="lazy" decoding="async" />
                    <div>
                      <Link
                        href={localePath(locale, "/contact")}
                        aria-label={t.home.enquireAbout.replace("{name}", service.title)}
                      >
                        ↗
                      </Link>
                    </div>
                  </div>
                  <h3>{service.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="capability-section" id="capabilities">
          <div className="capability-image" aria-hidden="true" />
          <div className="capability-copy" data-reveal>
            <p>{t.home.capabilityKicker}</p>
            <div className="capability-tabs" aria-hidden="true">
              {t.home.capabilityTabs.map((tab) => <span key={tab}>{tab}</span>)}
            </div>
            <span className="capability-symbol" aria-hidden="true">⌁</span>
            <h2>{t.home.capabilityHeading}</h2>
            <p className="capability-text">{t.home.capabilityBody}</p>
            <Link className="outline-button" href={localePath(locale, "/capabilities")}>
              {t.home.capabilityCta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="feature-section">
          <div className="site-shell feature-grid">
            {t.home.features.map((feature, i) => (
              <article key={feature.title} data-reveal data-reveal-delay={i + 1}>
                <img src={FEATURE_IMAGES[i]} alt="" loading="lazy" decoding="async" />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <Link href={localePath(locale, "/contact")}>
                    {t.home.learnMore} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="industry-section" id="industries">
          <div className="site-shell">
            <div className="section-heading centered" data-reveal>
              <p>{t.home.industriesKicker}</p>
              <h2>{t.home.industriesHeading}</h2>
              <span />
            </div>
            <figure className="mobile-section-visual" aria-hidden="true">
              <img src="/images/cabtecni/strip-power.webp" alt="" loading="lazy" decoding="async" />
            </figure>
          </div>
          {/* Deliberately outside .site-shell so the ticker runs edge to edge. */}
          <div className="industry-marquee">
            <div className="marquee-track">
              {t.industryData.map((industry) => (
                <Link key={industry.title} href={localePath(locale, "/industries")}>{industry.title}</Link>
              ))}
              {/* Duplicate pass so the loop is seamless. Hidden from AT and the
                  tab order so the sector list isn't announced twice. */}
              {t.industryData.map((industry) => (
                <Link key={`${industry.title}-loop`} href={localePath(locale, "/industries")} aria-hidden="true" tabIndex={-1}>
                  {industry.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-strip" id="contact">
          <div className="site-shell contact-grid">
            <div>
              <p>{t.home.contactKicker}</p>
              <h2>{t.home.contactHeading}</h2>
            </div>
            <figure className="mobile-section-visual" aria-hidden="true">
              <img src="/images/cabtecni/strip-cta.webp" alt="" loading="lazy" decoding="async" />
            </figure>
            <div>
              <p>{t.home.contactBody}</p>
              <Link href={localePath(locale, "/contact")}>
                {t.home.contactCta} <span aria-hidden="true">→</span>
              </Link>
            </div>
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
