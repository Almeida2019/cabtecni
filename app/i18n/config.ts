export const LOCALES = ["en", "pt", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { label: string; native: string; htmlLang: string; short: string }> = {
  // `pt` is European Portuguese (pt-PT), not Brazilian. Vocabulary and
  // spelling below follow Portugal usage throughout.
  en: { label: "English", native: "English", htmlLang: "en", short: "EN" },
  pt: { label: "Portuguese", native: "Português", htmlLang: "pt-PT", short: "PT" },
  es: { label: "Spanish", native: "Español", htmlLang: "es", short: "ES" },
  fr: { label: "French", native: "Français", htmlLang: "fr", short: "FR" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefix a path with the locale. English stays at the root for clean URLs. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === DEFAULT_LOCALE ? (clean || "/") : `/${locale}${clean}`;
}
