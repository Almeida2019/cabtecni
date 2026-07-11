import type { Metadata } from "next";
import { InteriorHero } from "../components/InteriorHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact Cabtecni | Luanda, Angola",
  description: "Contact Cabtecni for engineering procurement, logistics and industrial service requirements.",
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader active="contact" />
      <InteriorHero
        eyebrow="Contact Cabtecni"
        title="Bring us your next requirement."
        description="Our Luanda-based team is ready to review your sourcing, logistics or industrial service need."
        image="/images/cabtecni/contactos.jpg"
      />

      <section className="contact-page-section">
        <div className="site-shell contact-page-grid">
          <div className="contact-page-intro"><p className="interior-kicker">Talk to our team</p><h2>Clear communication starts here.</h2><p>Share the equipment, material, service or workforce requirement, together with the destination and required timeline. Our team will review the request and respond with a practical next step.</p><a href="mailto:sales@cabtecni.com">Email sales@cabtecni.com <span>→</span></a></div>
          <div className="contact-card-grid">
            <article><span>01</span><h3>Email</h3><a href="mailto:sales@cabtecni.com">sales@cabtecni.com</a><p>For procurement, services and general enquiries.</p></article>
            <article><span>02</span><h3>Telephone</h3><a href="tel:+244935625151">+244 935 62 51 51</a><p>Speak directly with the Cabtecni team.</p></article>
            <article><span>03</span><h3>Location</h3><p>Luanda, Município de Belas,<br />Distrito do Kilamba, Angola</p></article>
            <article><span>04</span><h3>Working hours</h3><p>Monday – Friday: 08:00–17:00<br />Saturday – Sunday: Closed</p></article>
          </div>
        </div>
      </section>

      <section className="contact-brief-section">
        <div className="site-shell contact-brief-grid"><div><p className="interior-kicker light">A useful first message</p><h2>Help us understand the requirement quickly.</h2></div><ol><li><span>01</span>Describe the product, service or technical need.</li><li><span>02</span>Include quantities, specifications or relevant documents.</li><li><span>03</span>Confirm the destination and required delivery date.</li><li><span>04</span>Add your preferred contact details for follow-up.</li></ol></div>
      </section>

      <section className="page-cta"><div className="site-shell page-cta-inner"><div><p>South Africa support</p><h2>NAS GLOBAL service enquiries.</h2></div><a href="mailto:sales@nas-global.co.za">sales@nas-global.co.za <span>→</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
