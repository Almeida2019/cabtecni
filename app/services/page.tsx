import type { Metadata } from "next";
import { InteriorHero } from "../components/InteriorHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { serviceData } from "../site-data";

export const metadata: Metadata = {
  title: "Industrial Services | Cabtecni",
  description: "Explore Cabtecni procurement, logistics, equipment rental, labour supply and specialised industrial services.",
};

export default function ServicesPage() {
  return (
    <main>
      <SiteHeader active="services" />
      <InteriorHero
        eyebrow="Our services"
        title="Integrated support for demanding operations."
        description="One responsive partner for sourcing, logistics, workforce and specialist industrial services."
        image="/images/cabtecni/slide1.jpg"
      />

      <section className="interior-section service-intro">
        <div className="site-shell editorial-grid">
          <div><p className="interior-kicker">What we deliver</p><h2>Services shaped around the requirement.</h2></div>
          <div className="editorial-copy"><p className="lead">Cabtecni combines procurement discipline with practical service coordination, allowing clients to manage multiple operating needs through one dependable relationship.</p><p>Each engagement begins with the specification, destination, timing and operating context. We then define the most appropriate supply, service or delivery route.</p></div>
        </div>
      </section>

      <section className="service-detail-section">
        <div className="site-shell service-detail-list">
          {serviceData.map((service, index) => (
            <article key={service.title}>
              <div className="service-detail-image"><img src={service.image} alt="" loading="lazy" /></div>
              <div className="service-detail-copy"><span>{String(index + 1).padStart(2, "0")}</span><h2>{service.title}</h2><p>{service.description}</p><p>{service.detail}</p><a href="/contact">Discuss this service <b>→</b></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="delivery-band">
        <div className="site-shell">
          <div className="interior-heading light"><p>Our delivery model</p><h2>Clear steps from request to completion.</h2></div>
          <div className="delivery-grid">
            <article><span>01</span><h3>Define</h3><p>Clarify the technical requirement, commercial priority and destination.</p></article>
            <article><span>02</span><h3>Coordinate</h3><p>Source suppliers, services, equipment, people and transport.</p></article>
            <article><span>03</span><h3>Monitor</h3><p>Maintain visibility across ordering, progress and delivery.</p></article>
            <article><span>04</span><h3>Complete</h3><p>Support safe arrival, handover and follow-through.</p></article>
          </div>
        </div>
      </section>

      <section className="page-cta"><div className="site-shell page-cta-inner"><div><p>Need a specific service?</p><h2>Tell us what your operation requires.</h2></div><a href="/contact">Request support <span>→</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
