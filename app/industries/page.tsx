import type { Metadata } from "next";
import { IndustriesView } from "../views/IndustriesView";
import { DEFAULT_LOCALE } from "../i18n/config";
import { getDictionary } from "../i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(DEFAULT_LOCALE);
  return {
    title: t.industries.title,
    description: t.industries.description,
    alternates: { canonical: "/industries" },
  };
}

export default function Page() {
  return <IndustriesView locale={DEFAULT_LOCALE} />;
}
