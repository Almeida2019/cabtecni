import type { Metadata } from "next";
import { ServicesView } from "../views/ServicesView";
import { DEFAULT_LOCALE } from "../i18n/config";
import { getDictionary } from "../i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(DEFAULT_LOCALE);
  return {
    title: t.services.title,
    description: t.services.description,
    alternates: { canonical: "/services" },
  };
}

export default function Page() {
  return <ServicesView locale={DEFAULT_LOCALE} />;
}
