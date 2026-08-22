import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // www duplicates every page at a second URL. The canonical tags already
        // point at the apex, but a 301 is a stronger signal than a canonical
        // hint and consolidates any links pointing at the www variant.
        // Vercel serves both hostnames, so this is matched on Host rather than
        // path. `missing` on x-forwarded-host is not needed — Vercel always
        // sets `host` to the requested hostname.
        source: "/:path*",
        has: [{ type: "host", value: "www.cabtecni.com" }],
        destination: "https://cabtecni.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
