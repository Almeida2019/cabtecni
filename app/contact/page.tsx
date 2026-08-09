import type { Metadata } from "next";
import { ContactView } from "../views/ContactView";
import { DEFAULT_LOCALE } from "../i18n/config";
import { getDictionary } from "../i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(DEFAULT_LOCALE);
  return {
    title: t.contact.title,
    description: t.contact.description,
    alternates: { canonical: "/contact" },
  };
}

export default function Page() {
  return <ContactView locale={DEFAULT_LOCALE} />;
}
