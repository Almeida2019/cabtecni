"use client";

import { useEffect } from "react";

export type Theme = "light" | "dark";

/** Must stay in sync with the inline anti-flash script in app/theme-script.ts. */
export const THEME_STORAGE_KEY = "cabtecni-theme-v2";

/**
 * Deliberately holds no React state.
 *
 * The theme lives in one place: the `data-theme` attribute on <html>, written
 * before first paint by the anti-flash script. Mirroring it into React state
 * would mean a synchronous setState in an effect (cascading render) and a
 * hydration mismatch, for no benefit: the icon swap is pure CSS, and the
 * accessible name describes the action rather than the current state, so it
 * is correct in both themes.
 */
export function ThemeToggle({ label }: { label: string }) {
  useEffect(() => {
    // Allow colour transitions only after first paint, so the initial theme
    // doesn't visibly fade in.
    document.documentElement.classList.add("theme-ready");

    // The public site intentionally defaults to light mode instead of
    // following the operating-system setting. The visitor can still opt in
    // to dark mode with the control below.
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* private mode */ }
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
