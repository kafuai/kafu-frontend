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
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl"
        >
          <p className="font-semibold text-slate-500">
            {card.title}
          </p>

          <h2 className="mt-3 text-4xl font-black">
            {card.value}
          </h2>

          <p className="mt-3 text-sm font-bold text-emerald-700">
            {card.note}
          </p>
        </div>
      ))}
    </section>
  );
}