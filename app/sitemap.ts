import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_META, localePath } from "./i18n/config";
import { NAV_PATHS } from "./navigation";
import { resolveOrigin } from "./site-config";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/services": 0.9,
  "/about": 0.8,
  "/capabilities": 0.8,
  "/industries": 0.8,
  "/contact": 0.7,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await resolveOrigin();
  const lastModified = new Date();

  return LOCALES.flatMap((locale) =>
    NAV_PATHS.map(({ path }) => ({
      url: `${origin}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: (path === "/" || path === "/services" ? "monthly" : "yearly") as "monthly" | "yearly",
      priority: PRIORITY[path] ?? 0.7,
      // Tell crawlers about the sibling translations of each page.
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [LOCALE_META[l].htmlLang, `${origin}${localePath(l, path)}`]),
        ),
      },
    })),
  );
}
