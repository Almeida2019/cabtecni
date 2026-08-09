import type { Metadata } from "next";
import { ServicesView } from "../../views/ServicesView";
import { getDictionary, resolveLocale } from "../../i18n";
import { localePath } from "../../i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const t = getDictionary(resolved);
  return {
    title: t.services.title,
    description: t.services.description,
    alternates: { canonical: localePath(resolved, "/services") },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <ServicesView locale={resolveLocale(locale)} />;
}
