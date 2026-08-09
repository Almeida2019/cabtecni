"use client";

import { useEffect } from "react";

/**
 * Site-wide interaction chrome, all progressive enhancement:
 *   - scroll progress bar across the top
 *   - header condenses once you leave the hero
 *   - cursor-following spotlight on cards (pointer devices only)
 *
 * Everything is driven by CSS custom properties / classes, so if this never
 * runs the site just looks like its static self. Respects reduced motion.
 */
export function SiteChrome() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- scroll progress + condensed header -------------------------------
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        root.style.setProperty("--scroll-progress", String(progress));
        root.classList.toggle("is-scrolled", window.scrollY > 120);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // rAF is suspended while the tab is hidden, so a page restored from a
    // background tab can hold a stale header/progress state until the next
    // scroll. Re-sync on the way back in.
    const onVisibility = () => { if (!document.hidden) { ticking = false; onScroll(); } };
    document.addEventListener("visibilitychange", onVisibility);

    // ---- cursor spotlight on cards ---------------------------------------
    // Only on real pointers: on touch this would fire on every tap and the
    // glow would stick where the finger last was.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const spotlightSelector = [
      ".capability-list-grid article",
      ".principle-grid article",
      ".delivery-grid article",
      ".contact-card-grid article",
      ".values-list li",
      ".stat-grid div",
    ].join(", ");

    const onPointerMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.(spotlightSelector) as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    };

    if (finePointer && !reduced) {
      root.classList.add("has-spotlight");
      document.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("pointermove", onPointerMove);
      root.classList.remove("has-spotlight", "is-scrolled");
    };
  }, []);

  return null;
}
