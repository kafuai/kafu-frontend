import {
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

type AIRecommendationsProps = {
  locale: "ar" | "en";
  recommendations: string[];
};

export default function AIRecommendations({
  locale,
  recommendations,
}: AIRecommendationsProps) {
  const isArabic = locale === "ar";

  return (
    <section className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] px-5 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Lightbulb size={18} />
          </span>

          <div>
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
              {isArabic
                ? "توصيات KAFU AI"
                : "KAFU AI Recommendations"}
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {isArabic
                ? "الإجراءات المقترحة ذات الأولوية"
                : "Recommended priority actions"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-3 py-1.5">
          <Sparkles size={12} className="text-[var(--brand-primary)]" />

          <span className="text-[10px] font-black text-[var(--brand-primary)]">
            {recommendations.length}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {recommendations.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-10 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-muted)] shadow-sm">
              <Lightbulb size={24} />
            </span>

            <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
              {isArabic
                ? "لا توجد توصيات حالية"
                : "No Current Recommendations"}
            </h3>

            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              {isArabic
                ? "ستظهر التوصيات ذات الأولوية هنا عند توفرها."
                : "Priority recommendations will appear here when available."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <article
                key={`${recommendation}-${index}`}
                className="group flex items-start gap-3 rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition hover:border-[var(--brand-primary)] hover:bg-[var(--surface)]"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold leading-6 text-[var(--text-secondary)]">
                      {recommendation}
                    </p>

                    <CheckCircle2
                      size={16}
                      className="mt-1 shrink-0 text-emerald-700"
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-[var(--brand-primary)]">
                    <Sparkles size={11} />

                    <span>
                      {isArabic
                        ? "توصية مدعومة بالذكاء الاصطناعي"
                        : "AI-supported recommendation"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
