import { Bell } from "lucide-react";

type NotificationsProps = {
  locale?: "ar" | "en";
};

export default function Notifications({
  locale = "en",
}: NotificationsProps = {}) {
  const notifications = [
    {
      title:
        locale === "ar"
          ? "طلبات تحتاج إلى مراجعة"
          : "Requests require review",
      description:
        locale === "ar"
          ? "ثلاثة طلبات موظفين بانتظار قرار إداري."
          : "Three employee requests are awaiting a management decision.",
      level: locale === "ar" ? "عاجل" : "Urgent",
      time: locale === "ar" ? "منذ 5 دقائق" : "5 minutes ago",
      indicatorClass: "bg-[var(--warning)]",
    },
    {
      title:
        locale === "ar"
          ? "تحديث مؤشر الجاهزية"
          : "Readiness score updated",
      description:
        locale === "ar"
          ? "تم تحديث مؤشر الجاهزية بعد تحليل بيانات الاستكشاف."
          : "The readiness score was updated after analyzing discovery data.",
      level: locale === "ar" ? "معلومة" : "Information",
      time: locale === "ar" ? "منذ 20 دقيقة" : "20 minutes ago",
      indicatorClass: "bg-[var(--brand-primary)]",
    },
    {
      title:
        locale === "ar"
          ? "توصية ذكية جديدة"
          : "New AI recommendation",
      description:
        locale === "ar"
          ? "تقترح KAFU AI تحسين مسار الموافقات الداخلية."
          : "KAFU AI recommends improving the internal approval workflow.",
      level: "AI",
      time: locale === "ar" ? "الآن" : "Now",
      indicatorClass: "bg-[var(--success)]",
    },
  ];

  return (
    <section className="h-full rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Bell size={19} />
          </span>

          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
              {locale === "ar" ? "التنبيهات" : "Notifications"}
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              {locale === "ar"
                ? "آخر التنبيهات التنفيذية ذات الأولوية."
                : "Latest priority executive notifications."}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--text-secondary)]">
          {notifications.length}{" "}
          {locale === "ar" ? "جديدة" : "New"}
        </span>
      </div>

      <div className="mt-5 divide-y divide-[var(--border-default)]">
        {notifications.map((item) => (
          <article
            key={item.title}
            className="py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${item.indicatorClass}`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                    {item.title}
                  </h3>

                  <span className="shrink-0 text-[11px] font-bold text-[var(--text-muted)]">
                    {item.time}
                  </span>
                </div>

                <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.description}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--text-secondary)]">
                  {item.level}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
