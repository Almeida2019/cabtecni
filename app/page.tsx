import { HomeView } from "./views/HomeView";
import { DEFAULT_LOCALE } from "./i18n/config";

export default function Page() {
  return <HomeView locale={DEFAULT_LOCALE} />;
}
