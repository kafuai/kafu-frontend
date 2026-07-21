import Link from "next/link";

type SectionHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function SectionHero({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: SectionHeroProps) {
  return (
    <section className="section-hero">
      <div className="site-container section-hero__inner">
        <span className="section-eyebrow">{eyebrow}</span>

        <h1>{title}</h1>

        <p>{description}</p>

        {(primaryLabel || secondaryLabel) && (
          <div className="section-actions">
            {primaryLabel && primaryHref && (
              <Link className="website-button website-button--primary" href={primaryHref}>
                {primaryLabel}
              </Link>
            )}

            {secondaryLabel && secondaryHref && (
              <Link className="website-button website-button--secondary" href={secondaryHref}>
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}