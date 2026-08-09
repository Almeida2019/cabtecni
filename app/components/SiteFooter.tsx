import Link from "next/link";
import { getDictionary } from "../i18n";
import { localePath, type Locale } from "../i18n/config";
import { navItems } from "../navigation";
import { SITE } from "../site-config";

/** Renders "a\nb" as two lines without dangerouslySetInnerHTML. */
function MultiLine({ value }: { value: string }) {
  const lines = value.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = navItems(t);
  const companyLinks = items.filter((i) => i.key !== "home" && i.key !== "services");

  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div className="footer-about">
          {/* White artwork, so it sits directly on the dark footer without the
              white plate the old colour logo needed. */}
          <Link href={localePath(locale, "/")} aria-label={t.nav.homeAria}>
            <img src="/brand/logos/cabtecni-white.png" alt="Cabtecni" width={230} height={95} />
          </Link>
          <p>{t.footer.about}</p>
          <span>{t.footer.sectors}</span>
        </div>
        <div>
          <h3>{t.footer.company}</h3>
          {companyLinks.map((item) => (
            <Link key={item.key} href={localePath(locale, item.path)}>{item.label}</Link>
          ))}
        </div>
        <div>
          <h3>{t.footer.services}</h3>
          {t.footer.footerServices.map((label) => (
            <Link key={label} href={localePath(locale, "/services")}>{label}</Link>
          ))}
        </div>
        <div>
          <h3>{t.footer.contact}</h3>
          <p>
            <i aria-hidden="true">✉</i> {t.footer.email}<br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p>
            <i aria-hidden="true">◆</i> {t.footer.telephone}<br />
            <a href={`tel:${SITE.telephone}`}>{SITE.telephoneDisplay}</a>
          </p>
          <p><i aria-hidden="true">◷</i> {t.footer.hours}<br />{t.footer.hoursValue}</p>
        </div>
        <div>
          <h3>{t.footer.location}</h3>
          <p><MultiLine value={t.footer.address} /></p>
          <a className="footer-linkedin" href={SITE.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>

      <div className="site-shell footer-partner">
        <p>{t.footer.partnerLabel}</p>
        <a href={`mailto:${SITE.partnerEmail}`} aria-label={t.footer.partnerAria}>
          <img src="/brand/logos/nas-global-colour.png" alt="NAS GLOBAL (Pty) Ltd" width={208} height={107} />
        </a>
        <span>{t.footer.partnerNote}</span>
      </div>

      <div className="site-shell footer-bottom">
        <span>© {new Date().getFullYear()} {SITE.name}. {t.footer.rights}</span>
        <span>{SITE.tagline}</span>
      </div>
    </footer>
  );
}
