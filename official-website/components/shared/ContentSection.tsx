import type { ReactNode } from "react";

type ContentSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: "default" | "muted" | "dark";
};

export default function ContentSection({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: ContentSectionProps) {
  return (
    <section className={`content-section content-section--${tone}`}>
      <div className="site-container">
        <div className="content-section__heading">
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}

          <h2>{title}</h2>

          {description && <p>{description}</p>}
        </div>

        {children}
      </div>
    </section>
  );
}