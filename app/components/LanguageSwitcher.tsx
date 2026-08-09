"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_META, localePath, type Locale } from "../i18n/config";

type Props = {
  locale: Locale;
  /** Current page path without the locale prefix, e.g. "/about". */
  path: string;
  label: string;
  chooseLabel: string;
};

export function LanguageSwitcher({ locale, path, label, chooseLabel }: Props) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lang-switch" ref={wrapper}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={`${label}: ${LOCALE_META[locale].native}`}
        onClick={() => setOpen((value) => !value)}
      >
        {LOCALE_META[locale].short}
      </button>
      <div className="lang-menu" id="language-menu" hidden={!open} role="group" aria-label={chooseLabel}>
        {LOCALES.map((code) => (
          // Full page navigation, not client-side: the whole document is
          // re-rendered in the new language, including <html lang>.
          <a
            key={code}
            href={localePath(code, path)}
            hrefLang={LOCALE_META[code].htmlLang}
            aria-current={code === locale ? "true" : undefined}
            onClick={() => setOpen(false)}
          >
            {LOCALE_META[code].native}
            <small>{LOCALE_META[code].short}</small>
          </a>
        ))}
      </div>
    </div>
  );
}
