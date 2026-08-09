import type { Metadata } from "next";
import { CapabilitiesView } from "../views/CapabilitiesView";
import { DEFAULT_LOCALE } from "../i18n/config";
import { getDictionary } from "../i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(DEFAULT_LOCALE);
  return {
    title: t.capabilities.title,
    description: t.capabilities.description,
    alternates: { canonical: "/capabilities" },
  };
}

export default function Page() {
  return <CapabilitiesView locale={DEFAULT_LOCALE} />;
}
