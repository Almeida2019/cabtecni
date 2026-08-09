"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

export type TrustSlide = {
  image: string;
  focus?: string;
  kicker: string;
  heading: string;
  points: { title: string; description: string }[];
};

type TrustCarouselProps = {
  slides: TrustSlide[];
  label: string;
  previousLabel: string;
  nextLabel: string;
};

const AUTOPLAY_MS = 6500;

export function TrustCarousel({
  slides,
  label,
  previousLabel,
  nextLabel,
}: TrustCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [slides.length, index, paused, reducedMotion]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <section
      className="trust-section"
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!sectionRef.current?.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(index - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(index + 1);
        }
      }}
    >
      <link rel="preload" as="image" href={slides[0].image} />

      <div className="trust-slides" aria-hidden="true">
        {slides.map((slide, slideIndex) => (
          <div
            className={`trust-slide${slideIndex === index ? " is-active" : ""}`}
            key={slide.image}
            style={{
              "--trust-image": `url("${slide.image}")`,
              "--trust-focus": slide.focus ?? "center",
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="trust-shade" />

      <div className="site-shell trust-inner trust-content" key={slides[index].heading}>
        <div className="section-heading centered light-heading">
          <p>{slides[index].kicker}</p>
          <h2>{slides[index].heading}</h2>
          <span />
        </div>
        <div className="trust-grid">
          {slides[index].points.map((point) => (
            <article key={point.title}>
              <span aria-hidden="true">&ldquo;</span>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="trust-carousel-controls">
        <button type="button" onClick={() => goTo(index - 1)} aria-label={previousLabel}>
          <span aria-hidden="true">‹</span>
        </button>
        <div className="trust-carousel-dots" role="tablist" aria-label={label}>
          {slides.map((slide, slideIndex) => (
            <button
              type="button"
              key={slide.heading}
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={slide.heading}
              className={slideIndex === index ? "is-active" : undefined}
              onClick={() => goTo(slideIndex)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => goTo(index + 1)} aria-label={nextLabel}>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}
