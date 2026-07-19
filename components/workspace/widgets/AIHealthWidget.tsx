import { BrainCircuit, CheckCircle2 } from "lucide-react";

type AIHealthWidgetProps = {
  locale: "ar" | "en";
  score: number;
};

export default function AIHealthWidget({
  locale,
  score,
}: AIHealthWidgetProps) {
  const safeScore = Math.min(Math.max(score, 0), 100);

  const status =
    safeScore >= 80
      ? locale === "ar"
        ? "جاهزية عالية"
        : "Highly ready"
      : safeScore >= 50
        ? locale === "ar"
          ? "جاهزية متوسطة"
          : "Moderately ready"
        : locale === "ar"
          ? "يحتاج إلى استكمال"
          : "Needs completion";

  return (
    <section className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[color-mix(in_srgb,var(--success)_12%,transparent)] bg-[var(--success-background)] text-[var(--success)]">
            <BrainCircuit size={20} />
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {locale === "ar"
                ? "صحة الذكاء المؤسسي"
                : "Enterprise AI Health"}
            </p>

            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <strong className="text-[34px] font-extrabold leading-none tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                {safeScore}%
              </strong>

              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--success)]">
                <CheckCircle2 size={15} />
                {status}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              {locale === "ar"
                ? "يتم احتساب المؤشر من إجابات الاستكشاف المكتملة لتقديم قراءة تنفيذية واضحة عن مستوى الجاهزية."
                : "The score is calculated from completed discovery answers to provide a clear executive view of readiness."}
            </p>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-4">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span>
              {locale === "ar"
                ? "اكتمال الاستكشاف"
                : "Discovery completion"}
            </span>

            <span className="text-[var(--text-primary)]">{safeScore}%</span>
          </div>

          <div
            className="mt-2.5 h-2 overflow-hidden rounded-full bg-[var(--surface)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeScore}
          >
            <div
              className="h-full rounded-full bg-[var(--success)] transition-all duration-500"
              style={{ width: `${safeScore}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

