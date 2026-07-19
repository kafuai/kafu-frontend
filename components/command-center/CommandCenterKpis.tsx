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
  const isArabic = locale === "ar";

  const kpis = [
    {
      icon: Building2,
      label: isArabic ? "مساحة العمل النشطة" : "Active Workspace",
      value: companyName,
      note: isArabic ? "المؤسسة الحالية" : "Current organization",
      compact: true,
    },
    {
      icon: Bot,
      label: isArabic ? "الوكلاء المقترحون" : "Recommended Agents",
      value: "6",
      note: isArabic ? "القوى العاملة الرقمية" : "Digital workforce",
      compact: false,
    },
    {
      icon: BrainCircuit,
      label: isArabic ? "إشارات الاستكشاف" : "Discovery Signals",
      value: discoveryAnswersCount.toLocaleString(
        isArabic ? "ar-SA" : "en-US",
      ),
      note: isArabic ? "مدخلات تنفيذية" : "Executive inputs",
      compact: false,
    },
    {
      icon: Gauge,
      label: isArabic ? "صحة المنصة" : "Platform Health",
      value: "99%",
      note: isArabic
        ? "الأنظمة الأساسية تعمل"
        : "Core systems operational",
      compact: false,
    },
  ];

  return (
    <section
      aria-label={isArabic ? "مؤشرات مركز القيادة" : "Command center metrics"}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {kpis.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="group rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Icon size={18} />
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {isArabic ? "نشط" : "Live"}
              </span>
            </div>

            <p className="mt-4 text-xs font-bold text-[var(--text-muted)]">
              {item.label}
            </p>

            <h2
              className={`mt-1 truncate font-black tracking-tight text-[var(--text-primary)] ${
                item.compact ? "text-lg" : "text-3xl"
              }`}
              title={item.value}
              dir={item.compact ? undefined : "ltr"}
            >
              {item.value}
            </h2>

            <div className="mt-3 border-t border-[var(--border-default)] pt-3">
              <p className="text-xs font-bold text-[var(--brand-primary)]">
                {item.note}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
