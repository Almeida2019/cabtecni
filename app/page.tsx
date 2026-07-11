const industries = [
  "Oil & Gas",
  "Petrochemical",
  "Mining",
  "Power Generation",
  "Cement Industry",
  "Construction",
  "Agriculture",
];

const services = [
  { title: "Procurement Services", description: "End-to-end sourcing, ordering and monitoring through a versatile network of OEM brands." },
  { title: "Logistics", description: "Coordinated delivery backed by Incoterms knowledge and multiple modes of transport." },
  { title: "Bolt Torquing & Tensioning", description: "Specialist bolting support for controlled, reliable industrial assembly and maintenance." },
  { title: "Equipment Rental", description: "Practical access to industrial equipment for planned projects and operational needs." },
  { title: "Labour Supply", description: "Responsive workforce support aligned to industrial requirements and project schedules." },
  { title: "Electric Motor Services", description: "Electric motor maintenance and rewinding to support dependable plant performance." },
  { title: "Valve Services", description: "Valve service support for industrial flow control, maintenance and operational continuity." },
  { title: "Piping Manufacturing", description: "Piping manufacturing services shaped around demanding industrial applications." },
];

const focusAreas = [
  { icon: "✦", title: "Equipment & Materials", description: "Supply and support for the equipment and materials required by technical operations." },
  { icon: "⚙", title: "Engineering Support", description: "Practical engineering procurement and technical know-how for industrial projects." },
  { icon: "▥", title: "Industrial Operations", description: "Responsive support for work that demands planning, coordination and control." },
  { icon: "◈", title: "Operational Confidence", description: "Responsible execution focused on quality, efficiency and dependable delivery." },
];

const processSteps = [
  { number: "01", title: "Understand the requirement", description: "We clarify the specification, schedule, destination and commercial priorities." },
  { number: "02", title: "Plan the right route", description: "We identify the supply, service, people and transport needed to execute well." },
  { number: "03", title: "Deliver and follow through", description: "We monitor progress, coordinate safe arrival and stay close through completion." },
];

const proofPoints = [
  { title: "Customer satisfaction", text: "We listen closely, understand the requirement and shape every response around the client’s real operating need." },
  { title: "Quality and transparency", text: "Our procurement and service teams combine best practice with commercial discipline and clear communication." },
  { title: "Partnership with confidence", text: "We build durable relationships with clients, suppliers and collaborators through dedication and commitment." },
];

export default function Home() {
  return (
    <main className="aipi-layout">
      <header className="site-header" id="top">
        <div className="reference-topbar">
          <div className="wide-shell topbar-inner">
            <div className="language-switcher" aria-label="Language options">
              <span>EN</span><span>PT</span><span>AO</span>
            </div>
            <div className="topbar-contact">
              <a href="mailto:sales@cabtecni.com"><span aria-hidden="true">✉</span> sales@cabtecni.com</a>
              <a href="tel:+244935625151"><span aria-hidden="true">⌕</span> +244 935 62 51 51</a>
              <a href="mailto:sales@nas-global.co.za"><span aria-hidden="true">⌕</span> NAS GLOBAL support</a>
            </div>
            <div className="social-block" aria-label="Social links">
              <a href="https://www.linkedin.com/company/cabtecni/" target="_blank" rel="noreferrer">in</a>
              <a href="mailto:sales@cabtecni.com">✉</a>
              <a href="tel:+244935625151">⌕</a>
            </div>
          </div>
        </div>

        <nav className="reference-nav" aria-label="Primary navigation">
          <div className="wide-shell nav-inner">
            <a className="reference-brand" href="#top" aria-label="Cabtecni home">
              <img src="/images/cabtecni/cropped-Artboard-1.png" alt="Cabtecni" />
            </a>
            <div className="reference-links">
              <a className="active" href="#top">Home</a>
              <a href="#about">About Us <span aria-hidden="true">⌄</span></a>
              <a href="#services">Services</a>
              <a href="#certifications">Certifications</a>
              <a href="#consultancy">Consultancy</a>
              <a href="#equipment">Equipment &amp; Materials</a>
              <a href="#about">Info <span aria-hidden="true">⌄</span></a>
              <a href="#contact">Contacts</a>
              <a className="search-link" href="#contact" aria-label="Search">⌕</a>
            </div>
            <details className="mobile-reference-nav">
              <summary aria-label="Open menu">☰</summary>
              <div>
                <a href="#top">Home</a><a href="#about">About Us</a><a href="#services">Services</a>
                <a href="#consultancy">Consultancy</a><a href="#equipment">Equipment &amp; Materials</a><a href="#contact">Contacts</a>
              </div>
            </details>
          </div>
        </nav>
      </header>

      <section className="reference-hero" aria-label="Cabtecni introduction">
        <div className="hero-slide hero-slide-one" />
        <div className="hero-slide hero-slide-two" />
        <div className="hero-slide hero-slide-three" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>CABTECNI</h1>
          <p>Engineering procurement, logistics and industrial services for clients in Angola and beyond.</p>
          <a className="reference-button" href="#services">Our services <span aria-hidden="true">→</span></a>
        </div>
        <div className="hero-controls" aria-hidden="true"><span>‹</span><span>›</span></div>
      </section>

      <section className="reference-about" id="about">
        <div className="wide-shell about-layout">
          <div className="about-intro">
            <h2>Growth sustained with <strong>quality, efficiency and commitment.</strong></h2>
            <p>CABTECNI, Lda is a private company, 100% Angolan owned and managed. We are based in Luanda with access to OEMs of different brands, giving us the versatility to assist with whatever our clients require.</p>
            <p>Our procurement and service team supports ordering, monitoring and delivery with a cost-effective approach, comprehensive Incoterms knowledge and the ability to operate across destinations using different transport models.</p>
            <div className="commitment-card">
              <div className="commitment-icon" aria-hidden="true">▥</div>
              <div>
                <h3>Cabtecni — <strong>commitment</strong></h3>
                <p>Integrated solutions for industry with a focus on efficiency, customer satisfaction and operational confidence.</p>
                <div className="tag-row"><span>Oil &amp; Gas</span><span>Mining</span><span>Logistics</span></div>
              </div>
            </div>
          </div>
          <div className="focus-grid" id="equipment">
            {focusAreas.map((area) => (
              <article className="focus-card" key={area.title}>
                <span className="focus-icon" aria-hidden="true">{area.icon}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reference-services" id="services">
        <div className="wide-shell">
          <div className="center-heading">
            <p className="orange-kicker">What we deliver</p>
            <h2>SOLUTIONS &amp; SERVICES</h2>
            <p>We support projects across oil and gas, mining, power generation, construction, agriculture and industrial operations.</p>
          </div>
          <div className="reference-service-grid">
            {services.map((service) => (
              <article className="reference-service-card" key={service.title}>
                <h3><a href="#contact">{service.title}</a></h3>
                <p>{service.description}</p>
                <span className="orange-rule" aria-hidden="true" />
              </article>
            ))}
          </div>
          <a className="orange-pill" href="#contact">Service portfolio <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="reference-process" id="consultancy">
        <div className="wide-shell process-layout">
          <div className="process-heading">
            <p className="orange-kicker">Project delivery</p>
            <h2>ENGINEERING<br />WITH PURPOSE</h2>
            <p>From requirement to delivery, our work is structured to protect the client’s priorities and keep execution moving.</p>
          </div>
          <ol className="reference-process-list">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span className="process-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="reference-proof" id="certifications">
        <div className="wide-shell proof-layout">
          <div className="proof-copy">
            <p className="orange-kicker">Trusted industrial solutions</p>
            <h2>QUALITY, SAFETY<br />AND TRANSPARENCY</h2>
            <p>We act with focus on quality, efficiency, efficacy and transparency, safeguarding the interests of clients and partners.</p>
          </div>
          <div className="proof-grid">
            {proofPoints.map((point) => (
              <article key={point.title}><span className="quote-mark">,,</span><h3>{point.title}</h3><p>{point.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="reference-field" id="industries">
        <div className="wide-shell field-layout">
          <div className="field-copy">
            <p className="orange-kicker">Field experience</p>
            <h2>INDUSTRIAL SUPPORT<br />THAT TRAVELS</h2>
            <p>We support projects in logistics, procurement, manpower, engineering, industrial maintenance and specialist services across multiple sectors.</p>
            <a className="reference-button dark-button" href="#contact">Talk to Cabtecni <span aria-hidden="true">→</span></a>
          </div>
          <div className="field-mosaic">
            <div className="mosaic-card mosaic-large"><img src="/images/cabtecni/slide1.jpg" alt="Industrial field operations" /><span>Industrial operations</span></div>
            <div className="mosaic-card"><img src="/images/cabtecni/logistics.jpg" alt="Cabtecni logistics support" /><span>Logistics</span></div>
            <div className="mosaic-card"><img src="/images/cabtecni/bort_torquing.jpg" alt="Bolt torquing and tensioning" /><span>Technical services</span></div>
          </div>
        </div>
      </section>

      <section className="reference-partners">
        <div className="wide-shell">
          <div className="center-heading">
            <p className="orange-kicker">Our operating landscape</p>
            <h2>INDUSTRIES WE SUPPORT</h2>
            <p>Versatile support across the sectors where dependable sourcing and service matter most.</p>
          </div>
          <div className="partner-strip">
            {industries.map((industry) => <span key={industry}>{industry}</span>)}
          </div>
        </div>
      </section>

      <section className="reference-contact" id="contact">
        <div className="wide-shell contact-layout">
          <div><p className="orange-kicker">Let&apos;s work together</p><h2>Tell us what your operation needs.</h2></div>
          <div><p>Our Luanda-based team will review your requirement and respond with a practical next step.</p><a className="orange-pill" href="mailto:sales@cabtecni.com">sales@cabtecni.com <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <footer className="reference-footer">
        <div className="wide-shell footer-grid">
          <div className="footer-about"><img src="/images/cabtecni/cropped-Artboard-1.png" alt="Cabtecni" /><p>Engineering procurement, logistics and industrial services for Angola and beyond.</p><span>Luanda • Angola • Industrial support</span></div>
          <div><h3>Services</h3><a href="#services">Procurement Services</a><a href="#services">Logistics</a><a href="#services">Equipment Rental</a><a href="#services">Labour Supply</a><a href="#services">Technical Services</a></div>
          <div><h3>Contactos / Email</h3><p><span aria-hidden="true">✉</span> Email<br /><a href="mailto:sales@cabtecni.com">sales@cabtecni.com</a></p><p><span aria-hidden="true">⌕</span> Telefone<br /><a href="tel:+244935625151">+244 935 62 51 51</a></p><p><span aria-hidden="true">◷</span> Horário<br />Seg. à Sex. 08h–17h</p></div>
          <div><h3>Visit us</h3><p>Luanda, Município de Belas,<br />Distrito do Kilamba, Angola</p><a className="footer-social" href="https://www.linkedin.com/company/cabtecni/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
        </div>
        <div className="wide-shell footer-bottom"><span>© {new Date().getFullYear()} CABTECNI, Lda. All rights reserved.</span><span>Engineering &amp; Procurement Solutions</span></div>
      </footer>
    </main>
  );
}
