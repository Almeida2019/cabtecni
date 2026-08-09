import type { Metadata } from "next";
import { CapabilitiesView } from "../../views/CapabilitiesView";
import { getDictionary, resolveLocale } from "../../i18n";
import { localePath } from "../../i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const t = getDictionary(resolved);
  return {
    title: t.capabilities.title,
    description: t.capabilities.description,
    alternates: { canonical: localePath(resolved, "/capabilities") },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <CapabilitiesView locale={resolveLocale(locale)} />;
}
