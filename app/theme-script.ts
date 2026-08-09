/**
 * Runs before first paint to set data-theme on <html>, so the page never
 * flashes the wrong theme. Kept as a plain string (not a module) because it
 * has to be inlined into <head> ahead of any bundle.
 *
 * The storage key must match THEME_STORAGE_KEY in components/ThemeToggle.tsx.
 * Wrapped in try/catch because localStorage throws in Safari private mode.
 */
export const THEME_SCRIPT = `
(function(){
  try {
    // The versioned key intentionally ignores the former dark-by-default
    // preference so returning visitors receive the client's new light default.
    var stored = localStorage.getItem('cabtecni-theme-v2');
    // Cabtecni's public experience opens in light mode. A visitor can still
    // explicitly choose dark mode with the site control, which is remembered.
    var theme = stored || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`.trim();
