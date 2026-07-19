import {
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Users,
} from "lucide-react";

type ExecutiveKPIProps = {
  locale?: "ar" | "en";
  readinessScore?: number;
};

export default function ExecutiveKPI({
  locale = "en",
  readinessScore = 82,
}: ExecutiveKPIProps = {}) {
  const kpis = [
    {
      title:
        locale === "ar"
          ? "مؤشر الجاهزية"
          : "Readiness Score",
      value: `${readinessScore}%`,
      subtitle:
        locale === "ar"
          ? "مستوى جاهزية المؤسسة الحالي للتحول الذكي."
          : "Current enterprise readiness for intelligent transformation.",
      trend: "+18%",
      trendLabel:
        locale === "ar"
          ? "تحسن متوقع بعد استكمال الاستكشاف"
          : "Expected improvement after discovery completion",
      icon: TrendingUp,
      iconClass:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      title:
        locale === "ar"
          ? "طلبات الموظفين"
          : "Employee Requests",
      value: "24",
      subtitle:
        locale === "ar"
          ? "طلبات مفتوحة تحتاج إلى متابعة تشغيلية."
          : "Open requests requiring operational follow-up.",
      trend: "+6",
      trendLabel:
        locale === "ar"
          ? "طلبات جديدة هذا الأسبوع"
          : "New requests this week",
      icon: Users,
      iconClass:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      title:
        locale === "ar"
          ? "المخاطر التشغيلية"
          : "Operational Risks",
      value: "6",
      subtitle:
        locale === "ar"
          ? "مخاطر تحتاج إلى قرارات ومتابعة إدارية."
          : "Risks requiring management decisions and follow-up.",
      trend: "-2",
      trendLabel:
        locale === "ar"
          ? "انخفاض في المخاطر الحرجة"
          : "Reduction in critical risks",
      icon: AlertTriangle,
      iconClass:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
    {
      title:
        locale === "ar"
          ? "فرص التحسين"
          : "Improvement Opportunities",
      value: "11",
      subtitle:
        locale === "ar"
          ? "فرص قابلة للتنفيذ خلال الثلاثين يومًا القادمة."
          : "Opportunities actionable within the next 30 days.",
      trend: "+4",
      trendLabel:
        locale === "ar"
          ? "فرص جديدة قابلة للتنفيذ"
          : "New actionable opportunities",
      icon: Lightbulb,
      iconClass:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <article
            key={kpi.title}
            className="group flex min-h-[210px] flex-col rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--brand-primary)_20%,var(--border-default))] hover:shadow-[var(--shadow-medium)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[color-mix(in_srgb,currentColor_10%,transparent)] ${kpi.iconClass}`}
              >
                <Icon size={18} />
              </span>

              <span
                className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--text-secondary)]"
                dir="ltr"
              >
                {kpi.trend}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold text-[var(--text-muted)]">
                {kpi.title}
              </p>

              <h3
                className="mt-1.5 text-3xl font-extrabold leading-none tracking-[-0.04em] text-[var(--text-primary)]"
                dir="ltr"
              >
                {kpi.value}
              </h3>

              <p className="mt-2.5 text-sm leading-6 text-[var(--text-secondary)]">
                {kpi.subtitle}
              </p>
            </div>

            <div className="mt-auto border-t border-[var(--border-default)] pt-3.5">
              <p className="text-[11px] font-bold leading-5 text-[var(--text-muted)]">
                {kpi.trendLabel}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

