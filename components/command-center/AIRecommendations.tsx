import { Lightbulb } from "lucide-react";

type AIRecommendationsProps = {
  locale: "ar" | "en";
  recommendations: string[];
};

export default function AIRecommendations({
  locale,
  recommendations,
}: AIRecommendationsProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Lightbulb size={20} />
        </span>

        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "توصيات KAFU AI"
              : "KAFU AI Recommendations"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "الإجراءات المقترحة ذات الأولوية"
              : "Recommended priority actions"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {recommendations.map((recommendation, index) => (
          <article
            key={`${recommendation}-${index}`}
            className="flex items-start gap-4 rounded-2xl bg-[var(--success-background)] p-4"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-sm font-black text-white">
              {index + 1}
            </span>

            <p className="text-xs font-bold leading-6 text-[var(--text-secondary)]">
              {recommendation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}