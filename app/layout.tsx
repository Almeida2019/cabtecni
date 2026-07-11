import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : "https://cabtecni.com";

  return {
    metadataBase: new URL(origin),
    title: "Cabtecni | Engineering & Procurement Solutions",
    description:
      "Angolan-owned engineering procurement, logistics and industrial services for oil and gas, mining, power, construction and more.",
    icons: {
      icon: "/brand/logos/apple-touch-icon.png",
      shortcut: "/brand/logos/apple-touch-icon.png",
      apple: "/brand/logos/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      url: origin,
      title: "Cabtecni | Engineering & Procurement Solutions",
      description: "Engineering procurement, logistics and industrial services for Angola and beyond.",
      images: [{ url: `${origin}/og.png`, width: 1693, height: 929, alt: "Cabtecni Engineering & Procurement Solutions" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Cabtecni | Engineering & Procurement Solutions",
      description: "Engineering procurement, logistics and industrial services for Angola and beyond.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
