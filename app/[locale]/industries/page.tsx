import type { Metadata } from "next";
import { IndustriesView } from "../../views/IndustriesView";
import { getDictionary, resolveLocale } from "../../i18n";
import { localePath } from "../../i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const t = getDictionary(resolved);
  return {
    title: t.industries.title,
    description: t.industries.description,
    alternates: { canonical: localePath(resolved, "/industries") },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <IndustriesView locale={resolveLocale(locale)} />;
}
