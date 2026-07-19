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
    <section className="flex h-full flex-col rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {locale === "ar"
          ? "الرحلة التنفيذية"
          : "Executive Journey"}
      </p>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--text-primary)]">
            {safeCompleted}
            <span className="mx-1 text-lg text-[var(--text-muted)]">
              /
            </span>
            {total}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {locale === "ar"
              ? "إجابة مكتملة ضمن مرحلة الاستكشاف."
              : "Completed answers in the discovery stage."}
          </p>
        </div>

        <p className="text-2xl font-extrabold text-[var(--success)]">
          {percentage}%
        </p>
      </div>

      <div
        className="mt-6 h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="h-full rounded-full bg-[var(--success)] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-auto pt-6 text-xs leading-6 text-[var(--text-muted)]">
        {locale === "ar"
          ? "استكمال الإجابات يرفع دقة التوصيات والقرارات المقترحة."
          : "Completing the answers improves the accuracy of recommendations and proposed decisions."}
      </p>
    </section>
  );
}
