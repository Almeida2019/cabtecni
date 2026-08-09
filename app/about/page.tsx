import type { Metadata } from "next";
import { AboutView } from "../views/AboutView";
import { DEFAULT_LOCALE } from "../i18n/config";
import { getDictionary } from "../i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(DEFAULT_LOCALE);
  return {
    title: t.about.title,
    description: t.about.description,
    alternates: { canonical: "/about" },
  };
}

export default function Page() {
  return <AboutView locale={DEFAULT_LOCALE} />;
}
