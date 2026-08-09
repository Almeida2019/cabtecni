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
 * Resolves the origin the current request arrived on, so canonical URLs, the
 * sitemap and OG images are correct on preview deploys as well as production.
 */
export async function resolveOrigin() {
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
