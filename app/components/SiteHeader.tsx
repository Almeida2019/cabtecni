type SiteHeaderProps = {
  active?: "home" | "about" | "services" | "capabilities" | "industries" | "contact";
};

const navigation = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "services", label: "Services", href: "/services" },
  { key: "capabilities", label: "Capabilities", href: "/capabilities" },
  { key: "industries", label: "Industries", href: "/industries" },
  { key: "contact", label: "Contacts", href: "/contact" },
] as const;

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="site-shell topbar-inner">
          <div className="language-list" aria-label="Languages"><span>EN</span><span>PT</span><span>AO</span></div>
          <div className="top-contact-list">
            <a href="mailto:sales@cabtecni.com"><i aria-hidden="true">✉</i> sales@cabtecni.com</a>
            <a href="tel:+244935625151"><i aria-hidden="true">◆</i> +244 935 62 51 51</a>
            <a href="mailto:sales@nas-global.co.za"><i aria-hidden="true">◆</i> NAS GLOBAL support</a>
          </div>
          <div className="top-socials">
            <a href="mailto:sales@cabtecni.com" aria-label="Email Cabtecni">@</a>
            <a href="https://www.linkedin.com/company/cabtecni/" target="_blank" rel="noreferrer" aria-label="Cabtecni on LinkedIn">in</a>
          </div>
        </div>
      </div>
      <nav className="main-navigation" aria-label="Primary navigation">
        <div className="site-shell navigation-inner">
          <a className="site-logo" href="/" aria-label="Cabtecni home">
            <img src="/images/cabtecni/cropped-Artboard-1.png" alt="Cabtecni" />
          </a>
          <div className="desktop-menu">
            {navigation.map((item) => (
              <a className={active === item.key ? "active" : undefined} href={item.href} key={item.key}>{item.label}</a>
            ))}
          </div>
          <details className="mobile-menu">
            <summary aria-label="Open navigation">☰</summary>
            <div>{navigation.map((item) => <a href={item.href} key={item.key}>{item.label}</a>)}</div>
          </details>
        </div>
      </nav>
    </header>
  );
}
