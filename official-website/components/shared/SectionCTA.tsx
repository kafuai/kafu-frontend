import Link from "next/link";

type SectionCTAProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function SectionCTA({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: SectionCTAProps) {
  return (
    <section className="section-cta">
      <div className="site-container section-cta__inner">
        <div>
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="section-actions">
          <Link className="website-button website-button--light" href={primaryHref}>
            {primaryLabel}
          </Link>

          {secondaryLabel && secondaryHref && (
            <Link className="website-button website-button--ghost" href={secondaryHref}>
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}