type InteriorHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

export function InteriorHero({ eyebrow, title, description, image }: InteriorHeroProps) {
  return (
    <section className="interior-hero" style={{ backgroundImage: `url(${image})` }}>
      <div className="interior-hero-shade" />
      <div className="site-shell interior-hero-inner">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
    </section>
  );
}
