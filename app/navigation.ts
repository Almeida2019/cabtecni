import type { Dictionary } from "./i18n/en";

export type NavKey = "home" | "about" | "services" | "capabilities" | "industries" | "contact";

/** Route paths are locale-independent; only the labels translate. */
export const NAV_PATHS: { key: NavKey; path: string }[] = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "capabilities", path: "/capabilities" },
  { key: "industries", path: "/industries" },
  { key: "contact", path: "/contact" },
];

export function navItems(t: Dictionary) {
  return NAV_PATHS.map((item) => ({ ...item, label: t.nav[item.key] }));
}
