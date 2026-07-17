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
          ? "طلبات مفتوحة تحتاج إلى متابعة تنفيذية."
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
          ? "مخاطر تحتاج إلى قرار إداري ومتابعة."
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
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <article
            key={kpi.title}
            className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${kpi.iconClass}`}
              >
                <Icon size={21} />
              </span>

              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-black text-[var(--text-secondary)]">
                {kpi.trend}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-[var(--text-muted)]">
                {kpi.title}
              </p>

              <h3 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">
                {kpi.value}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                {kpi.subtitle}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--surface-muted)] p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                {locale === "ar"
                  ? "المؤشر التنفيذي"
                  : "Executive Indicator"}
              </p>

              <p className="mt-2 text-xs font-black leading-6 text-[var(--text-secondary)]">
                {kpi.trendLabel}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}