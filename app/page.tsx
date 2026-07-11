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
  {
    title: "Procurement Services",
    description:
      "End-to-end sourcing, ordering and monitoring through a versatile network of OEM brands.",
    image: "/images/cabtecni/procurement_service.jpg",
  },
  {
    title: "Logistics",
    description:
      "Coordinated delivery backed by Incoterms knowledge and multiple modes of transport.",
    image: "/images/cabtecni/logistics.jpg",
  },
  {
    title: "Bolt Torquing & Tensioning",
    description:
      "Specialist bolting support for controlled, reliable industrial assembly and maintenance.",
    image: "/images/cabtecni/bort_torquing.jpg",
  },
  {
    title: "Equipment Rental",
    description:
      "Practical access to industrial equipment for planned projects and operational needs.",
    image: "/images/cabtecni/rental_equipament.jpg",
  },
  {
    title: "Labour Supply",
    description:
      "Responsive workforce support aligned to industrial requirements and project schedules.",
    image: "/images/cabtecni/labour_suplly.jpg",
  },
  {
    title: "Electric Motor Services",
    description:
      "Electric motor maintenance and rewinding to support dependable plant performance.",
    image: "/images/cabtecni/electric_motor.jpg",
  },
  {
    title: "Valve Services",
    description:
      "Valve support for industrial flow control, maintenance and operational continuity.",
    image: "/images/cabtecni/valves_service-1.jpg",
  },
  {
    title: "Piping Manufacturing",
    description:
      "Piping manufacturing services shaped around demanding industrial applications.",
    image: "/images/cabtecni/piping.jpg",
  },
];

const focusAreas = [
  {
    icon: "01",
    title: "Equipment & Materials",
    description:
      "Supply and support in the management of equipment and materials for technical operations.",
  },
  {
    icon: "02",
    title: "Specialised Engineering",
    description:
      "Technical know-how applied to industrial, energy and operational projects.",
  },
  {
    icon: "03",
    title: "Industrial Operations",
    description:
      "Support for industrial work requiring careful planning, coordination and control.",
  },
  {
    icon: "04",
    title: "Commitment to Safety",
    description:
      "Responsible execution focused on prevention, quality and dependable delivery.",
  },
];

const processSteps = [
  {
    icon: "DISCOVER",
    number: "01",
    title: "Requirement analysis",
    description:
      "We evaluate the scope, technical requirements, destination and objectives to define the right approach.",
  },
  {
    icon: "PLAN",
    number: "02",
    title: "Technical planning",
    description:
      "We structure the suppliers, people, materials, equipment, timing and transport needed for execution.",
  },
  {
    icon: "DELIVER",
    number: "03",
    title: "Delivery & follow-through",
    description:
      "We monitor progress with a focus on transparency, safe arrival, technical quality and customer satisfaction.",
  },
];

const trustPoints = [
  {
    title: "Quality & transparency",
    description:
      "Clear communication and commercial discipline guide every procurement and service engagement.",
  },
  {
    title: "Operational confidence",
    description:
      "Our work is coordinated around safety, dependable delivery and the client’s real operating need.",
  },
  {
    title: "Partnership with trust",
    description:
      "We build durable relationships with clients, suppliers and collaborators through commitment and follow-through.",
  },
];

const featureCards = [
  {
    image: "/images/cabtecni/oil_and_gas.jpg",
    title: "Technical experience",
    text: "A versatile team and supplier network supporting multiple areas of industrial activity.",
  },
  {
    image: "/images/cabtecni/logistics.jpg",
    title: "Integrated solutions",
    text: "Procurement, logistics, labour and specialist engineering support from one responsive partner.",
  },
  {
    image: "/images/cabtecni/construction.jpg",
    title: "Strong relationships",
    text: "Close collaboration with clients and partners built on dedication, clarity and confidence.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header" id="top">
        <div className="topbar">
          <div className="site-shell topbar-inner">
            <div className="language-list" aria-label="Languages">
              <span>EN</span>
              <span>PT</span>
              <span>AO</span>
            </div>
            <div className="top-contact-list">
              <a href="mailto:sales@cabtecni.com">
                <i aria-hidden="true">✉</i> sales@cabtecni.com
              </a>
              <a href="tel:+244935625151">
                <i aria-hidden="true">◆</i> +244 935 62 51 51
              </a>
              <a href="mailto:sales@nas-global.co.za">
                <i aria-hidden="true">◆</i> NAS GLOBAL support
              </a>
            </div>
            <div className="top-socials">
              <a href="mailto:sales@cabtecni.com" aria-label="Email Cabtecni">@</a>
              <a
                href="https://www.linkedin.com/company/cabtecni/"
                target="_blank"
                rel="noreferrer"
                aria-label="Cabtecni on LinkedIn"
              >
                in
              </a>
            </div>
          </div>
        </div>

        <nav className="main-navigation" aria-label="Primary navigation">
          <div className="site-shell navigation-inner">
            <a className="site-logo" href="#top" aria-label="Cabtecni home">
              <img src="/images/cabtecni/cropped-Artboard-1.png" alt="Cabtecni" />
            </a>
            <div className="desktop-menu">
              <a className="active" href="#top">Home</a>
              <a href="#about">About Us <b aria-hidden="true">⌄</b></a>
              <a href="#services">Services</a>
              <a href="#capabilities">Capabilities</a>
              <a href="#industries">Industries</a>
              <a href="#contact">Contacts</a>
              <a className="search-icon" href="#services" aria-label="Explore services">⌕</a>
            </div>
            <details className="mobile-menu">
              <summary aria-label="Open navigation">☰</summary>
              <div>
                <a href="#top">Home</a>
                <a href="#about">About Us</a>
                <a href="#services">Services</a>
                <a href="#process">Our Process</a>
                <a href="#projects">Projects</a>
                <a href="#capabilities">Capabilities</a>
                <a href="#contact">Contacts</a>
              </div>
            </details>
          </div>
        </nav>
      </header>

      <section className="hero-carousel" aria-label="Cabtecni highlights">
        <article className="carousel-slide slide-one">
          <div className="slide-shade" />
          <div className="site-shell slide-inner">
            <div className="slide-copy">
              <p className="hero-kicker">Engineering &amp; Procurement Solutions</p>
              <h1>Built for industry.<br />Connected to the world.</h1>
              <p>
                Reliable sourcing, industrial services and logistics support
                for clients in Angola and beyond.
              </p>
              <a className="outline-button" href="#services">Our services <span>→</span></a>
            </div>
          </div>
        </article>
        <article className="carousel-slide slide-two">
          <div className="slide-shade" />
          <div className="site-shell slide-inner">
            <div className="slide-copy">
              <p className="hero-kicker">Global sourcing. Local execution.</p>
              <h2>Procurement<br />without borders.</h2>
              <p>
                We coordinate supply chains, equipment and materials to support
                efficient, continuous operations.
              </p>
              <a className="outline-button" href="#services">Our services <span>→</span></a>
            </div>
          </div>
        </article>
        <article className="carousel-slide slide-three">
          <div className="slide-shade" />
          <div className="site-shell slide-inner">
            <div className="slide-copy">
              <p className="hero-kicker">Technical capability. Dependable delivery.</p>
              <h2>Engineering<br />with purpose.</h2>
              <p>
                Practical engineering support shaped around demanding projects,
                schedules and operating environments.
              </p>
              <a className="outline-button" href="#contact">Talk to us <span>→</span></a>
            </div>
          </div>
        </article>
        <div className="carousel-arrows" aria-hidden="true"><span>‹</span><span>›</span></div>
      </section>

      <section className="about-section" id="about">
        <div className="site-shell about-grid">
          <div className="about-copy">
            <h2>Growth sustained with <strong>quality, efficiency and commitment.</strong></h2>
            <p>
              CABTECNI, Lda is a private company, 100% Angolan owned and managed.
              Based in Luanda, we work with OEMs across multiple brands, giving
              us the versatility to respond to varied client requirements.
            </p>
            <p>
              Our procurement and service team supports ordering, monitoring
              and delivery through a cost-effective approach, comprehensive
              Incoterms knowledge and multiple transport models.
            </p>
            <div className="commitment-panel">
              <span className="commitment-symbol" aria-hidden="true">100%</span>
              <div>
                <h3>CABTECNI — <strong>INSTITUTIONAL COMMITMENT</strong></h3>
                <p>
                  Integrated solutions for industry with a focus on efficiency,
                  customer satisfaction and operational confidence.
                </p>
                <div className="chip-row"><span>Oil &amp; Gas</span><span>Mining</span><span>Logistics</span></div>
              </div>
            </div>
          </div>
          <div className="focus-grid">
            {focusAreas.map((area) => (
              <article key={area.title}>
                <span className="line-icon" aria-hidden="true">{area.icon}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="site-shell">
          <div className="section-heading centered">
            <p>Solutions for industry</p>
            <h2>SOLUTIONS &amp; SERVICES</h2>
            <span />
          </div>
          <div className="service-card-grid">
            {services.map((service, index) => (
              <article key={service.title}>
                <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="card-accent" aria-hidden="true" />
              </article>
            ))}
          </div>
          <a className="accent-button" href="#projects">Service portfolio <span>→</span></a>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="site-shell">
          <div className="section-heading centered">
            <p>Cabtecni project delivery</p>
            <h2>INDUSTRIAL PROJECT MANAGEMENT</h2>
            <span />
          </div>
          <ol className="process-timeline">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span className="process-icon" aria-hidden="true">{step.icon}</span>
                <i aria-hidden="true" />
                <strong>{step.number}</strong>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-shade" />
        <div className="site-shell trust-inner">
          <div className="section-heading centered light-heading">
            <p>Built for demanding operations</p>
            <h2>INDUSTRIAL SOLUTIONS YOU CAN TRUST</h2>
            <span />
          </div>
          <div className="trust-grid">
            {trustPoints.map((point) => (
              <article key={point.title}>
                <span aria-hidden="true">,,</span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="site-shell">
          <div className="section-heading centered">
            <p>Our service portfolio</p>
            <h2>SOLUTIONS WE DELIVER</h2>
            <span />
          </div>
          <div className="project-grid">
            {services.slice(0, 4).map((service) => (
              <article key={service.title}>
                <div className="project-image">
                  <img src={service.image} alt="" loading="lazy" />
                  <div><a href="#contact" aria-label={`Enquire about ${service.title}`}>↗</a></div>
                </div>
                <h3>{service.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="capability-section" id="capabilities">
        <div className="capability-image" aria-hidden="true" />
        <div className="capability-copy">
          <p>Projects &amp; capabilities</p>
          <div className="capability-tabs" aria-label="Capability areas">
            <span>Oil &amp; Gas</span><span>Manpower</span><span>Technical Support</span>
          </div>
          <span className="capability-symbol" aria-hidden="true">⌁</span>
          <h2>Industrial Operations &amp; Procurement</h2>
          <p className="capability-text">
            We provide technical and operational support to industrial projects,
            with a focus on planning, logistics, equipment supply, specialised
            services and dependable execution.
          </p>
          <a className="outline-button" href="#services">View services</a>
        </div>
      </section>

      <section className="feature-section">
        <div className="site-shell feature-grid">
          {featureCards.map((feature) => (
            <article key={feature.title}>
              <img src={feature.image} alt="" loading="lazy" />
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <a href="#contact">Learn more <span>→</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="industry-section" id="industries">
        <div className="site-shell">
          <div className="section-heading centered">
            <p>Versatile industrial support</p>
            <h2>INDUSTRIES WE SERVE</h2>
            <span />
          </div>
          <div className="industry-strip">
            {industries.map((industry) => <span key={industry}>{industry}</span>)}
          </div>
        </div>
      </section>

      <section className="contact-strip" id="contact">
        <div className="site-shell contact-grid">
          <div>
            <p>Let&apos;s work together</p>
            <h2>Tell us what your operation needs.</h2>
          </div>
          <div>
            <p>
              Our Luanda-based team will review your requirement and respond
              with a practical next step.
            </p>
            <a href="mailto:sales@cabtecni.com">sales@cabtecni.com <span>→</span></a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-shell footer-grid">
          <div className="footer-about">
            <img src="/images/cabtecni/cropped-Artboard-1.png" alt="Cabtecni" />
            <p>
              CABTECNI provides engineering procurement, logistics and
              industrial services with a focus on quality, efficiency and
              customer satisfaction.
            </p>
            <span>Oil &amp; Gas • Mining • Logistics • Industry</span>
          </div>
          <div>
            <h3>Services</h3>
            <a href="#services">Procurement Services</a>
            <a href="#services">Logistics</a>
            <a href="#services">Equipment Rental</a>
            <a href="#services">Labour Supply</a>
            <a href="#services">Technical Services</a>
          </div>
          <div>
            <h3>Contacts / Email</h3>
            <p><i>✉</i> Email<br /><a href="mailto:sales@cabtecni.com">sales@cabtecni.com</a></p>
            <p><i>◆</i> Telephone<br /><a href="tel:+244935625151">+244 935 62 51 51</a></p>
            <p><i>◷</i> Hours<br />Mon. to Fri. 08:00–17:00</p>
          </div>
          <div>
            <h3>Location</h3>
            <p>Luanda, Município de Belas,<br />Distrito do Kilamba, Angola</p>
            <a className="footer-linkedin" href="https://www.linkedin.com/company/cabtecni/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </div>
        <div className="site-shell footer-bottom">
          <span>© {new Date().getFullYear()} CABTECNI, Lda. All rights reserved.</span>
          <span>Engineering &amp; Procurement Solutions</span>
        </div>
      </footer>
    </main>
  );
}
