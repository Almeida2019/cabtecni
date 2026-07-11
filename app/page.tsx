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
    number: "01",
    title: "Procurement Services",
    description:
      "End-to-end sourcing, ordering and monitoring through a versatile network of OEM brands.",
    image: "/images/cabtecni/procurement_service.jpg",
  },
  {
    number: "02",
    title: "Logistics",
    description:
      "Coordinated delivery backed by Incoterms knowledge and multiple modes of transport.",
    image: "/images/cabtecni/logistics.jpg",
  },
  {
    number: "03",
    title: "Bolt Torquing & Tensioning",
    description:
      "Specialist bolting support for controlled, reliable industrial assembly and maintenance.",
    image: "/images/cabtecni/bort_torquing.jpg",
  },
  {
    number: "04",
    title: "Equipment Rental",
    description:
      "Practical access to industrial equipment for planned projects and operational needs.",
    image: "/images/cabtecni/rental_equipament.jpg",
  },
  {
    number: "05",
    title: "Labour Supply",
    description:
      "Responsive workforce support aligned to industrial requirements and project schedules.",
    image: "/images/cabtecni/labour_suplly.jpg",
  },
  {
    number: "06",
    title: "Electric Motor Services",
    description:
      "Electric motor maintenance and rewinding to support dependable plant performance.",
    image: "/images/cabtecni/electric_motor.jpg",
  },
  {
    number: "07",
    title: "Valve Services",
    description:
      "Valve service support for industrial flow control, maintenance and operational continuity.",
    image: "/images/cabtecni/valves_service-1.jpg",
  },
  {
    number: "08",
    title: "Piping Manufacturing",
    description:
      "Piping manufacturing services shaped around demanding industrial applications.",
    image: "/images/cabtecni/piping.jpg",
  },
];

const values = [
  {
    marker: "01",
    title: "Customer first",
    text: "We listen closely, understand the requirement and shape every response around the client’s real operating need.",
  },
  {
    marker: "02",
    title: "Cost-effective execution",
    text: "Our procurement and service teams combine best practice with commercial discipline and transparent coordination.",
  },
  {
    marker: "03",
    title: "Delivery confidence",
    text: "We monitor each order and coordinate safe, timely delivery through the most appropriate transport model.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="utility-bar">
          <div className="shell utility-inner">
            <p>100% Angolan owned &amp; managed</p>
            <div className="utility-contacts">
              <a href="mailto:sales@cabtecni.com">sales@cabtecni.com</a>
              <span aria-hidden="true" />
              <a href="tel:+244935625151">+244 935 62 51 51</a>
            </div>
          </div>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          <div className="shell nav-inner">
            <a className="brand" href="#top" aria-label="Cabtecni home">
              <img
                src="/images/cabtecni/cropped-Artboard-1.png"
                alt="Cabtecni — Engineering and Procurement Solutions"
              />
            </a>

            <div className="desktop-nav">
              <a href="#about">About</a>
              <a href="#industries">Industries</a>
              <a href="#services">Services</a>
              <a href="#process">How we work</a>
              <a className="nav-cta" href="#contact">
                Request support <span aria-hidden="true">↗</span>
              </a>
            </div>

            <details className="mobile-nav">
              <summary aria-label="Open navigation">Menu</summary>
              <div className="mobile-menu">
                <a href="#about">About</a>
                <a href="#industries">Industries</a>
                <a href="#services">Services</a>
                <a href="#process">How we work</a>
                <a href="#contact">Request support</a>
              </div>
            </details>
          </div>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Engineering &amp; Procurement Solutions</p>
            <h1>Industrial support.<br />Delivered with confidence.</h1>
            <p className="hero-lead">
              From sourcing and logistics to specialist engineering services,
              Cabtecni connects Angolan industry with dependable solutions,
              responsive teams and global OEM access.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#services">
                Explore our services <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href="mailto:sales@cabtecni.com">
                Talk to our team <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Cabtecni locations and capabilities">
            <p className="hero-card-kicker">Built for industry</p>
            <strong>Angola-based.<br />Globally connected.</strong>
            <div className="hero-card-rule" />
            <ul>
              <li><span>01</span> Luanda operations</li>
              <li><span>02</span> Multi-brand OEM access</li>
              <li><span>03</span> International logistics</li>
            </ul>
          </aside>
        </div>

        <div className="sector-rail" id="industries">
          <div className="shell sector-inner">
            <p>Industries we serve</p>
            <div className="sector-list">
              {industries.map((industry) => (
                <span key={industry}>{industry}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="shell about-grid">
          <div className="about-visual">
            <img
              src="/images/cabtecni/wellcome.jpg"
              alt="Industrial equipment and engineering operations"
            />
            <div className="ownership-badge">
              <strong>100%</strong>
              <span>Angolan owned<br />and managed</span>
            </div>
          </div>

          <div className="about-copy">
            <p className="section-kicker">Welcome to Cabtecni</p>
            <h2>A local partner with an international reach.</h2>
            <p className="large-copy">
              CABTECNI, Lda is an Angolan sourcing, engineering procurement and
              industrial services company built around one priority: complete
              customer satisfaction.
            </p>
            <p>
              Based in Luanda, we support clients with procurement, ordering,
              monitoring and delivery. Our relationship with NAS GLOBAL (Pty)
              Ltd in South Africa, access to multiple OEM brands and practical
              Incoterms knowledge give us the versatility to respond across
              industries and destinations.
            </p>
            <div className="about-metrics" aria-label="Cabtecni capabilities">
              <div><strong>7</strong><span>Industries served</span></div>
              <div><strong>8</strong><span>Core service lines</span></div>
              <div><strong>1</strong><span>Integrated partner</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="section-kicker light">Our capabilities</p>
              <h2>Solutions that keep<br />industry moving.</h2>
            </div>
            <p>
              One responsive partner for sourcing, logistics, workforce and
              specialist engineering support across demanding industrial environments.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-image">
                  <img src={service.image} alt="" loading="lazy" />
                  <span>{service.number}</span>
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#contact" aria-label={`Enquire about ${service.title}`}>
                    Enquire <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process section" id="process">
        <div className="shell process-grid">
          <div className="process-intro">
            <p className="section-kicker">How we work</p>
            <h2>From requirement<br />to reliable delivery.</h2>
            <p>
              Cabtecni brings the sourcing, coordination and follow-through
              needed to make complex industrial requirements feel straightforward.
            </p>
            <a className="button button-dark" href="#contact">
              Start a conversation <span aria-hidden="true">→</span>
            </a>
          </div>

          <ol className="process-list">
            <li>
              <span>01</span>
              <div><h3>Understand the need</h3><p>We clarify the specification, schedule, destination and commercial priorities.</p></div>
            </li>
            <li>
              <span>02</span>
              <div><h3>Source and coordinate</h3><p>We identify the right supply or service route, place orders and monitor progress.</p></div>
            </li>
            <li>
              <span>03</span>
              <div><h3>Deliver and support</h3><p>We coordinate safe arrival within the agreed timeframe and stay close through completion.</p></div>
            </li>
          </ol>
        </div>
      </section>

      <section className="values section">
        <div className="shell">
          <div className="values-heading">
            <p className="section-kicker">Why Cabtecni</p>
            <h2>Built on clarity, commitment<br />and customer satisfaction.</h2>
          </div>
          <div className="values-grid">
            {values.map((value) => (
              <article key={value.title}>
                <span>{value.marker}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-image" aria-hidden="true" />
        <div className="shell contact-inner">
          <div className="contact-copy">
            <p className="section-kicker light">Let&apos;s work together</p>
            <h2>What can we help you source, solve or deliver?</h2>
            <p>
              Tell us what your operation needs. Our team will review the
              requirement and respond with a practical next step.
            </p>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:sales@cabtecni.com">
                Email our team <span aria-hidden="true">→</span>
              </a>
              <a className="phone-link" href="tel:+244935625151">+244 935 62 51 51</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <a href="#top" aria-label="Back to top">
              <img src="/images/cabtecni/cropped-Artboard-1.png" alt="Cabtecni" />
            </a>
            <p>
              Engineering procurement, logistics and industrial services for
              clients in Angola and beyond.
            </p>
            <a className="linkedin" href="https://www.linkedin.com/company/cabtecni/" target="_blank" rel="noreferrer">
              Follow Cabtecni on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#about">About us</a>
            <a href="#industries">Industries</a>
            <a href="#services">Services</a>
            <a href="#process">How we work</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:sales@cabtecni.com">sales@cabtecni.com</a>
            <a href="tel:+244935625151">+244 935 62 51 51</a>
            <p>Luanda, Município de Belas,<br />Distrito do Kilamba, Angola</p>
          </div>
          <div>
            <h3>Opening hours</h3>
            <p>Monday – Friday<br /><strong>08:00 – 17:00</strong></p>
            <p>Saturday – Sunday<br /><strong>Closed</strong></p>
          </div>
        </div>
        <div className="shell footer-bottom">
          <p>© {new Date().getFullYear()} CABTECNI, Lda. All rights reserved.</p>
          <p>Engineering &amp; Procurement Solutions</p>
        </div>
      </footer>
    </main>
  );
}
