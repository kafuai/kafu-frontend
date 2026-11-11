import { BarChart3 } from "lucide-react";

type ExecutiveCard = {
  title: string;
  value: string;
  note: string;
};

type ExecutiveCardsProps = {
  cards: ExecutiveCard[];
};

export default function ExecutiveCards({
  cards,
}: ExecutiveCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-muted)]">
                {card.title}
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {card.value}
              </p>
            </div>

            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <BarChart3 size={18} />
            </span>
          </div>

          <div className="mt-5 border-t border-[var(--border-default)] pt-4">
            <p className="text-xs font-semibold leading-6 text-[var(--success)]">
              {card.note}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
