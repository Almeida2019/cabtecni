export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div className="footer-about">
          <a href="/"><img src="/images/cabtecni/cropped-Artboard-1.png" alt="Cabtecni" /></a>
          <p>CABTECNI provides engineering procurement, logistics and industrial services with a focus on quality, efficiency and customer satisfaction.</p>
          <span>Oil &amp; Gas • Mining • Logistics • Industry</span>
        </div>
        <div>
          <h3>Company</h3>
          <a href="/about">About Us</a>
          <a href="/capabilities">Capabilities</a>
          <a href="/industries">Industries</a>
          <a href="/contact">Contact</a>
        </div>
        <div>
          <h3>Services</h3>
          <a href="/services">Procurement Services</a>
          <a href="/services">Logistics</a>
          <a href="/services">Equipment Rental</a>
          <a href="/services">Technical Services</a>
        </div>
        <div>
          <h3>Contact</h3>
          <p><i>✉</i> Email<br /><a href="mailto:sales@cabtecni.com">sales@cabtecni.com</a></p>
          <p><i>◆</i> Telephone<br /><a href="tel:+244935625151">+244 935 62 51 51</a></p>
          <a className="footer-linkedin" href="https://www.linkedin.com/company/cabtecni/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <span>© {new Date().getFullYear()} CABTECNI, Lda. All rights reserved.</span>
        <span>Engineering &amp; Procurement Solutions</span>
      </div>
    </footer>
  );
}
