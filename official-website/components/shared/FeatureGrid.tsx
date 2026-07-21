type FeatureItem = {
  label?: string;
  title: string;
  description: string;
};

type FeatureGridProps = {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
};

export default function FeatureGrid({
  items,
  columns = 3,
}: FeatureGridProps) {
  return (
    <div className={`feature-grid feature-grid--${columns}`}>
      {items.map((item) => (
        <article className="feature-card" key={item.title}>
          {item.label && <span className="feature-card__label">{item.label}</span>}

          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}