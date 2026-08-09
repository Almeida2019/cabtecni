import Link from "next/link";
import { getDictionary } from "../i18n";
import { localePath, type Locale } from "../i18n/config";
import { navItems, type NavKey } from "../navigation";
import { SITE } from "../site-config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  locale: Locale;
  active?: NavKey;
  /** Path without locale prefix, used by the language switcher to stay put. */
  path?: string;
};

export function SiteHeader({ locale, active, path = "/" }: Props) {
  const t = getDictionary(locale);
  const items = navItems(t);

  return (
    <>
      <a className="skip-link" href="#main-content">{t.nav.skipToContent}</a>
      <header className="site-header">
        <div className="topbar">
          <div className="site-shell topbar-inner">
            <div className="top-contact-list">
              <a href={`mailto:${SITE.email}`}><i aria-hidden="true">✉</i> {SITE.email}</a>
              <a href={`tel:${SITE.telephone}`}><i aria-hidden="true">◆</i> {SITE.telephoneDisplay}</a>
              <a href={`mailto:${SITE.partnerEmail}`}><i aria-hidden="true">◆</i> {t.topbar.partnerSupport}</a>
            </div>
            <div className="top-actions">
              <div className="top-socials">
                <a href={`mailto:${SITE.email}`} aria-label={t.topbar.emailAria}>@</a>
                <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label={t.topbar.linkedinAria}>in</a>
              </div>
            </div>
          </div>
        </div>

        <nav className="main-navigation" aria-label={t.nav.primaryNav}>
          <div className="site-shell navigation-inner">
            <Link className="site-logo" href={localePath(locale, "/")} aria-label={t.nav.homeAria}>
              {/* Two files rather than a CSS filter: the colour mark has to stay
                  exact in light mode, and the dark-mode art is a real white
                  lockup from the client, not a recolour. */}
              <img className="logo-light" src="/brand/logos/cabtecni-colour.png" alt="Cabtecni" width={186} height={77} />
              <img className="logo-dark" src="/brand/logos/cabtecni-white.png" alt="Cabtecni" width={186} height={77} />
            </Link>

            <div className="desktop-menu">
              {items.map((item) => (
                <Link
                  key={item.key}
                  className={active === item.key ? "active" : undefined}
                  aria-current={active === item.key ? "page" : undefined}
                  href={localePath(locale, item.path)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="nav-utilities">
              <LanguageSwitcher
                locale={locale}
                path={path}
                label={t.nav.languageLabel}
                chooseLabel={t.nav.chooseLanguage}
              />
              <ThemeToggle label={t.nav.toggleTheme} />
              <MobileMenu
                locale={locale}
                active={active}
                items={items}
                openLabel={t.nav.openMenu}
                closeLabel={t.nav.closeMenu}
              />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
