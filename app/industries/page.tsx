import type { Metadata } from "next";
import { InteriorHero } from "../components/InteriorHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { industryData } from "../site-data";

export const metadata: Metadata = {
  title: "Industries We Serve | Cabtecni",
  description: "Cabtecni supports oil and gas, petrochemical, mining, power, cement, construction and agriculture clients.",
};

export default function IndustriesPage() {
  return (
    <main>
      <SiteHeader active="industries" />
      <InteriorHero
        eyebrow="Industries we serve"
        title="Versatile support across critical sectors."
        description="Industrial procurement and services adapted to different operating environments and project priorities."
        image="/images/cabtecni/power_generation.jpg"
      />

      <section className="interior-section">
        <div className="site-shell editorial-grid">
          <div><p className="interior-kicker">Sector experience</p><h2>One delivery discipline. Multiple industries.</h2></div>
          <div className="editorial-copy"><p className="lead">Every sector has different equipment, service, timing and compliance pressures. Cabtecni responds by starting with the operating requirement.</p><p>Our supplier access and flexible service portfolio allow us to support both recurring operational needs and project-specific requirements.</p></div>
        </div>
      </section>

      <section className="industry-detail-section">
        <div className="site-shell industry-detail-grid">
          {industryData.map((industry, index) => (
            <article key={industry.title}>
              <img src={industry.image} alt="" loading="lazy" />
              <div><span>{String(index + 1).padStart(2, "0")}</span><h2>{industry.title}</h2><p>{industry.description}</p><a href="/contact">Discuss your sector <b>→</b></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="sector-approach-section">
        <div className="site-shell sector-approach-grid"><div><p className="interior-kicker light">Our cross-sector approach</p><h2>Understand first. Source precisely. Deliver confidently.</h2></div><div><p>We do not treat every industry requirement the same. The team considers the application, environment, specification, delivery route and client schedule before recommending an approach.</p><a href="/capabilities">Explore our capabilities <span>→</span></a></div></div>
      </section>

      <section className="page-cta"><div className="site-shell page-cta-inner"><div><p>Your sector. Your requirement.</p><h2>Let us help define the right response.</h2></div><a href="/contact">Contact Cabtecni <span>→</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
