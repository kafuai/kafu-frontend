type ExecutiveProgressProps = {
  locale: "ar" | "en";
  completed: number;
  total: number;
};

export default function ExecutiveProgress({
  locale,
  completed,
  total,
}: ExecutiveProgressProps) {
  const safeCompleted = Math.min(Math.max(completed, 0), total);
  const percentage =
    total > 0 ? Math.round((safeCompleted / total) * 100) : 0;

  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <p className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
        {locale === "ar"
          ? "الرحلة التنفيذية"
          : "Executive Journey"}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-[var(--text-primary)]">
            {safeCompleted} / {total}
          </h3>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {locale === "ar"
              ? "أسئلة الاستكشاف المكتملة."
              : "Discovery questions completed."}
          </p>
        </div>

        <p className="text-2xl font-black text-[var(--success)]">
          {percentage}%
        </p>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full rounded-full bg-[var(--success)] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}