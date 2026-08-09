import type { CSSProperties } from "react";

type InteriorHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  /**
   * Optional portrait crop for phone widths. The wide `image` is already cropped
   * to 16:9, so letting `cover` crop it a second time in a 375x520 band leaves
   * only about a sixth of the original frame. Pages that have a mobile crop pass
   * it here; the rest fall back to `image` in CSS.
   */
  mobileImage?: string;
};

export function InteriorHero({ eyebrow, title, description, image, mobileImage }: InteriorHeroProps) {
  return (
    <section
      className="interior-hero"
      style={
        {
          "--hero-image": `url(${image})`,
          ...(mobileImage ? { "--hero-image-mobile": `url(${mobileImage})` } : {}),
        } as CSSProperties
      }
    >
      <div className="interior-hero-shade" />
      <div className="site-shell interior-hero-inner">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
    </section>
  );
}
