import { headers } from "next/headers";

export const SITE = {
  name: "CABTECNI, Lda",
  shortName: "Cabtecni",
  tagline: "Engineering & Procurement Solutions",
  email: "sales@cabtecni.com",
  partnerEmail: "sales@nas-global.co.za",
  telephone: "+244935625151",
  telephoneDisplay: "+244 935 62 51 51",
  linkedin: "https://www.linkedin.com/company/cabtecni/",
  address: {
    locality: "Luanda",
    region: "Município de Belas, Distrito do Kilamba",
    country: "AO",
  },
  openingHours: "Mo-Fr 08:00-17:00",
  fallbackOrigin: "https://cabtecni.com",
} as const;

/**
 * Resolves the origin used for canonical URLs, hreflang, the sitemap, robots
 * and the JSON-LD graph.
 *
 * In PRODUCTION this is pinned to the real domain rather than the request host.
 * The app answers on three hostnames — cabtecni.com, www.cabtecni.com and the
 * cabtecni-industrial.vercel.app alias — and deriving the origin per request
 * made each one declare itself canonical, i.e. three indexable copies of the
 * same site competing with each other. Pinning it means the vercel.app and www
 * copies both point search engines at the one real domain.
 *
 * Preview deploys keep the request-derived origin, so their canonicals and OG
 * images still resolve against the deployment being previewed.
 */
export async function resolveOrigin() {
  if (process.env.VERCEL_ENV === "production") return SITE.fallbackOrigin;

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) return SITE.fallbackOrigin;
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export const routes = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/capabilities", priority: 0.8, changeFrequency: "yearly" },
  { path: "/industries", priority: 0.8, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
] as const;
