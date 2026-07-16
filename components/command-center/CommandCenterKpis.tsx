import {
  Bot,
  BrainCircuit,
  Building2,
  Gauge,
} from "lucide-react";

type CommandCenterKpisProps = {
  locale: "ar" | "en";
  companyName: string;
  discoveryAnswersCount: number;
};

export default function CommandCenterKpis({
  locale,
  companyName,
  discoveryAnswersCount,
}: CommandCenterKpisProps) {
  const kpis = [
    {
      icon: Building2,
      label:
        locale === "ar"
          ? "مساحة العمل"
          : "Active Workspace",
      value: companyName,
      note:
        locale === "ar"
          ? "المؤسسة الحالية"
          : "Current organization",
    },
    {
      icon: Bot,
      label:
        locale === "ar"
          ? "الوكلاء المقترحون"
          : "Recommended Agents",
      value: "6",
      note:
        locale === "ar"
          ? "القوى العاملة الرقمية"
          : "Digital workforce",
    },
    {
      icon: BrainCircuit,
      label:
        locale === "ar"
          ? "إشارات الاستكشاف"
          : "Discovery Signals",
      value: discoveryAnswersCount.toLocaleString(),
      note:
        locale === "ar"
          ? "مدخلات تنفيذية"
          : "Executive inputs",
    },
    {
      icon: Gauge,
      label:
        locale === "ar"
          ? "صحة المنصة"
          : "Platform Health",
      value: "99%",
      note:
        locale === "ar"
          ? "الأنظمة الأساسية متصلة"
          : "Core systems operational",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)]"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Icon size={20} />
              </span>

              <span
                className="h-2 w-2 rounded-full bg-[var(--success)]"
                aria-label={
                  locale === "ar"
                    ? "النظام يعمل"
                    : "System operational"
                }
              />
            </div>

            <p className="mt-5 text-xs font-bold text-[var(--text-muted)]">
              {item.label}
            </p>

            <h2
              className="mt-2 truncate text-3xl font-black text-[var(--text-primary)]"
              title={item.value}
            >
              {item.value}
            </h2>

            <p className="mt-2 text-xs font-bold text-[var(--brand-primary)]">
              {item.note}
            </p>
          </article>
        );
      })}
    </section>
  );
}