"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

export type HeroSlide = {
  kicker: string;
  headline: [string, string];
  body: string;
  cta: { label: string; href: string };
  image: string;
  /** CSS background-position for the slide photograph. */
  focus?: string;
  /**
   * Optional 9:16 crop for phones. The mobile band is 375x660, so a 16:9 slide
   * shows barely a third of its width there. See the 560px block in globals.css.
   */
  mobileImage?: string;
};

export type CarouselLabels = {
  region: string;
  prev: string;
  next: string;
  chooseHighlight: string;
  /** Template containing {n} and {total}. */
  slideOf: string;
};

const AUTOPLAY_MS = 7000;

export function HeroCarousel({ slides, labels }: { slides: HeroSlide[]; labels: CarouselLabels }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const regionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  // Autoplay stops while the visitor is hovering, tabbing through the controls,
  // on another tab, or has asked the OS to reduce motion.
  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length, index]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  };

  return (
    <section
      className="hero-carousel"
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label={labels.region}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!regionRef.current?.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={onKeyDown}
    >
      {/* React hoists this into <head>, so the first photograph starts downloading early. */}
      <link rel="preload" as="image" href={slides[0].image} fetchPriority="high" />

      {slides.map((slide, slideIndex) => {
        const active = slideIndex === index;
        const Heading = slideIndex === 0 ? "h1" : "h2";
        return (
          <article
            className={`carousel-slide${active ? " is-active" : ""}`}
            key={slide.kicker}
            style={
              {
                "--slide-image": `url("${slide.image}")`,
                ...(slide.mobileImage ? { "--slide-image-mobile": `url("${slide.mobileImage}")` } : {}),
                backgroundPosition: slide.focus ?? "center",
              } as CSSProperties
            }
            role="group"
            aria-roledescription="slide"
            aria-label={labels.slideOf.replace("{n}", String(slideIndex + 1)).replace("{total}", String(slides.length))}
            aria-hidden={!active}
            inert={!active}
          >
            <div className="slide-shade" />
            <div className="site-shell slide-inner">
              <div className="slide-copy">
                <p className="hero-kicker">{slide.kicker}</p>
                <Heading>
                  {slide.headline[0]}
                  <br />
                  {slide.headline[1]}
                </Heading>
                <p>{slide.body}</p>
                <a className="outline-button" href={slide.cta.href}>
                  {slide.cta.label} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </article>
        );
      })}

      <div className="carousel-controls">
        <div className="carousel-dots" role="tablist" aria-label={labels.chooseHighlight}>
          {slides.map((slide, slideIndex) => (
            <button
              type="button"
              key={slide.kicker}
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={slide.headline.join(" ")}
              className={slideIndex === index ? "is-active" : undefined}
              onClick={() => goTo(slideIndex)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="carousel-arrows">
          <button type="button" onClick={() => goTo(index - 1)} aria-label={labels.prev}>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" onClick={() => goTo(index + 1)} aria-label={labels.next}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div
        className={`carousel-progress${paused || reducedMotion ? " is-paused" : ""}`}
        key={`progress-${index}`}
        style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
        aria-hidden="true"
      />
    </section>
  );
}
