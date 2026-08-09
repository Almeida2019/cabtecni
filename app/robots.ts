import type { MetadataRoute } from "next";
import { resolveOrigin } from "./site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await resolveOrigin();

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
