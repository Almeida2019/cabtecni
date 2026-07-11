import type { Metadata } from "next";
import { InteriorHero } from "../components/InteriorHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Industrial Capabilities | Cabtecni",
  description: "Discover Cabtecni's sourcing, logistics, technical services and industrial delivery capabilities.",
};

const capabilities = [
  ["01", "Worldwide sourcing", "Access to multiple OEM brands and supplier channels for varied industrial requirements."],
  ["02", "Procurement coordination", "Ordering, supplier communication and progress monitoring from request through delivery."],
  ["03", "Multimodal logistics", "Incoterms knowledge and practical coordination across road, air and sea transport."],
  ["04", "Technical service support", "Specialist industrial services for bolting, motors, valves, piping and equipment needs."],
  ["05", "Workforce mobilisation", "Responsive labour supply aligned to role requirements and project schedules."],
  ["06", "Cross-border reach", "Local Angolan accountability supported by a South African sourcing relationship."],
];

export default function CapabilitiesPage() {
  return (
    <main>
      <SiteHeader active="capabilities" />
      <InteriorHero
        eyebrow="Our capabilities"
        title="The network and discipline to deliver."
        description="Connecting industrial requirements with the right suppliers, services, people and transport routes."
        image="/images/cabtecni/oil_and_gas.jpg"
      />

      <section className="interior-section">
        <div className="site-shell editorial-grid">
          <div><p className="interior-kicker">Integrated capability</p><h2>More than sourcing. Complete coordination.</h2></div>
          <div className="editorial-copy"><p className="lead">Our value lies in connecting the technical and commercial requirement with a practical route to completion.</p><p>Cabtecni combines local market understanding, an international sourcing network, Incoterms knowledge and service coordination. This allows clients to simplify supplier relationships while maintaining visibility over delivery.</p></div>
        </div>
      </section>

      <section className="capability-list-section">
        <div className="site-shell capability-list-grid">
          {capabilities.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="network-section">
        <div className="network-image" />
        <div className="network-copy"><p className="interior-kicker light">Operating reach</p><h2>Angola at the centre. A wider network behind it.</h2><p>Cabtecni's Luanda base keeps client communication close, while OEM relationships and NAS GLOBAL support in South Africa extend sourcing and delivery options.</p><ul><li>Multi-brand OEM access</li><li>International sourcing support</li><li>Incoterms-informed delivery planning</li><li>Multiple transport models</li></ul><a href="/contact">Discuss your requirement <span>→</span></a></div>
      </section>

      <section className="page-cta"><div className="site-shell page-cta-inner"><div><p>Put our network to work</p><h2>Build the right delivery route with Cabtecni.</h2></div><a href="/contact">Contact our team <span>→</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
