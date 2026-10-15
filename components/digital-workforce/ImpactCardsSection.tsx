export default function ImpactCardsSection({ impactCards }: { impactCards: any[] }) {
  return (
    <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {impactCards.map((card) => (
        <article
          key={card.code}
          className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black text-[var(--text-muted)]">{card.label}</p>
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <h2 className="break-words text-2xl font-black tracking-tight md:text-3xl">{card.value}</h2>
                {card.suffix && (
                  <span className="pb-1 text-xs font-black text-[var(--brand-primary)]">{card.suffix}</span>
                )}
              </div>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] text-[10px] font-black text-[var(--brand-primary)]">
              {card.code}
            </span>
          </div>
          <div className="mt-4 border-t border-[var(--border-default)] pt-3">
            <p className="text-[11px] font-bold text-[var(--text-secondary)]">{card.note}</p>
          </div>
        </article>
      ))}
    </section>
  );
}