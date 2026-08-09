import type { Metadata } from "next";
import { AboutView } from "../../views/AboutView";
import { getDictionary, resolveLocale } from "../../i18n";
import { localePath } from "../../i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const t = getDictionary(resolved);
  return {
    title: t.about.title,
    description: t.about.description,
    alternates: { canonical: localePath(resolved, "/about") },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <AboutView locale={resolveLocale(locale)} />;
}
