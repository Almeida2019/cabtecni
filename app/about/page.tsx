import type { Metadata } from "next";
import { InteriorHero } from "../components/InteriorHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About Cabtecni | Angolan Engineering Procurement Company",
  description: "Learn about Cabtecni's Angolan ownership, customer commitment, procurement expertise and international reach.",
};

const principles = [
  ["01", "Customer understanding", "We begin by clarifying the operating requirement, commercial priority and delivery expectation."],
  ["02", "Best-practice execution", "Our team works with discipline, transparency and a cost-effective mindset throughout each engagement."],
  ["03", "Reliable follow-through", "From ordering and monitoring to delivery, we stay close to the requirement until completion."],
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader active="about" />
      <InteriorHero
        eyebrow="About Cabtecni"
        title="Angolan roots. Global industrial reach."
        description="A customer-focused engineering procurement and industrial services company based in Luanda."
        image="/images/cabtecni/about-us.jpg"
      />

      <section className="interior-section">
        <div className="site-shell editorial-grid">
          <div>
            <p className="interior-kicker">Who we are</p>
            <h2>Built around customer satisfaction.</h2>
          </div>
          <div className="editorial-copy">
            <p className="lead">CABTECNI, Lda is a private company, 100% Angolan owned and managed. We provide worldwide sourcing, engineering procurement, ordering, monitoring and delivery support.</p>
            <p>Our company is based in Luanda, with access to OEMs across multiple brands. That network gives us the versatility to respond to clients in oil and gas, mining, construction, power generation and other industrial sectors.</p>
            <p>Cabtecni works toward one-stop engineering procurement and service-provider status. Comprehensive Incoterms knowledge and multimodal transport capability allow us to support delivery across destinations and operating environments.</p>
          </div>
        </div>
      </section>

      <section className="ownership-section">
        <div className="site-shell ownership-grid">
          <div className="ownership-image"><img src="/images/cabtecni/wellcome.jpg" alt="Cabtecni industrial operations" /></div>
          <div className="ownership-copy">
            <p className="interior-kicker light">Our foundation</p>
            <h2>Local accountability, supported internationally.</h2>
            <p>Cabtecni's Angolan presence is supported by its relationship with NAS GLOBAL (Pty) Ltd in South Africa. This creates a practical bridge between local client needs and a broader sourcing and service network.</p>
            <div className="stat-grid">
              <div><strong>100%</strong><span>Angolan owned and managed</span></div>
              <div><strong>7</strong><span>Industrial sectors served</span></div>
              <div><strong>8</strong><span>Core service lines</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="interior-section">
        <div className="site-shell">
          <div className="interior-heading"><p>How we show up</p><h2>The principles behind every engagement.</h2></div>
          <div className="principle-grid">
            {principles.map(([number, title, text]) => (
              <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-cta">
        <div className="site-shell page-cta-inner"><div><p>Start a conversation</p><h2>Bring us your next industrial requirement.</h2></div><a href="/contact">Contact Cabtecni <span>→</span></a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
