import { en, type Dictionary } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { pt } from "./pt";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, pt, es, fr };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/** Narrow an unknown route segment to a Locale, falling back to English. */
export function resolveLocale(segment: string | undefined): Locale {
  return segment && isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** Replace {placeholders} in a translated string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
export * from "./config";
