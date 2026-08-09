import { HomeView } from "../views/HomeView";
import { getDictionary, resolveLocale } from "../i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <HomeView locale={resolveLocale(locale)} />;
}
