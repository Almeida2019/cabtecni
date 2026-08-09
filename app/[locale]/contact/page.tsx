import type { Metadata } from "next";
import { ContactView } from "../../views/ContactView";
import { getDictionary, resolveLocale } from "../../i18n";
import { localePath } from "../../i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const t = getDictionary(resolved);
  return {
    title: t.contact.title,
    description: t.contact.description,
    alternates: { canonical: localePath(resolved, "/contact") },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <ContactView locale={resolveLocale(locale)} />;
}
