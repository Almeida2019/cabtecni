"use client";

import { useEffect } from "react";

const COUNT_MS = 1200;

function animateCount(el: HTMLElement) {
  const final = el.textContent ?? "";
  const match = final.match(/^(\d+)(.*)$/);
  // Don't animate when the tab isn't visible — rAF gets throttled to ~1Hz
  // and the number can freeze at an intermediate value if the visitor
  // switches away mid-count. Non-numeric labels also skip the animation.
  if (!match || document.hidden) return;

  const target = Number(match[1]);
  const suffix = match[2];
  let start = 0;

  const finish = () => {
    el.textContent = final;
    document.removeEventListener("visibilitychange", finish);
  };

  const tick = (now: number) => {
    if (start === 0) start = now;
    if (document.hidden) { finish(); return; }
    const progress = Math.min((now - start) / COUNT_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
    else finish();
  };

  // If the visitor tabs away partway through, jump straight to the final value.
  document.addEventListener("visibilitychange", finish);
  requestAnimationFrame(tick);
}

/**
 * Adds `.is-revealed` to `[data-reveal]` elements as they scroll into view,
 * and counts up `[data-countup]` numbers.
 *
 * Every element is FULLY VISIBLE in CSS by default. The `.is-revealed` class
 * only *layers* an entrance animation on top. So if this script never runs,
 * or the observer never fires, or the tab is backgrounded, nothing is hidden.
 * Reveal is a nicety, not a load-bearing effect.
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-countup]"));
    if (targets.length === 0) return;

    if (typeof IntersectionObserver !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No observer or reduced motion: just count up on load and skip the animation.
      targets.forEach((el) => { if (el.hasAttribute("data-countup")) animateCount(el); });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-revealed");
          if (el.hasAttribute("data-countup")) animateCount(el);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
