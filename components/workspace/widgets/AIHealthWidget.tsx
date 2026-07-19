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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--success-background)] text-[var(--success)]">
            <BrainCircuit size={22} />
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {locale === "ar"
                ? "صحة الذكاء المؤسسي"
                : "Enterprise AI Health"}
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <strong className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--text-primary)]">
                {safeScore}%
              </strong>

              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--success)]">
                <CheckCircle2 size={15} />
                {status}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              {locale === "ar"
                ? "يتم احتساب المؤشر من إجابات الاستكشاف المكتملة لتقديم قراءة تنفيذية واضحة عن مستوى الجاهزية."
                : "The score is calculated from completed discovery answers to provide a clear executive view of readiness."}
            </p>
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span>
              {locale === "ar"
                ? "اكتمال الاستكشاف"
                : "Discovery completion"}
            </span>

            <span>{safeScore}%</span>
          </div>

          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--surface)]"
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
