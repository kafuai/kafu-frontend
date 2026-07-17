import { BrainCircuit } from "lucide-react";

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
        : "Highly Ready"
      : safeScore >= 50
        ? locale === "ar"
          ? "جاهزية متوسطة"
          : "Moderately Ready"
        : locale === "ar"
          ? "يحتاج إلى استكمال"
          : "Needs Completion";

  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-background)] text-[var(--success)]">
            <BrainCircuit size={25} />
          </span>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
              {locale === "ar"
                ? "صحة الذكاء المؤسسي"
                : "AI Health"}
            </p>

            <h3 className="mt-2 text-3xl font-black text-[var(--text-primary)]">
              {safeScore}% {status}
            </h3>

            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {locale === "ar"
                ? "مؤشر الجاهزية محسوب بناءً على إجابات الاستكشاف المكتملة."
                : "Readiness is calculated from completed discovery answers."}
            </p>
          </div>
        </div>

        <div className="w-full md:w-72">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span>
              {locale === "ar" ? "التقدم" : "Progress"}
            </span>

            <span>{safeScore}%</span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
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