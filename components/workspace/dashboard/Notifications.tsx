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
          ? "توجد ثلاثة طلبات موظفين بانتظار قرار إداري."
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
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Bell size={20} />
          </span>

          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)]">
              {locale === "ar" ? "التنبيهات" : "Notifications"}
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {locale === "ar"
                ? "آخر التنبيهات المهمة للإدارة التنفيذية."
                : "Latest important executive notifications."}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-black text-[var(--text-secondary)]">
          {notifications.length}{" "}
          {locale === "ar" ? "جديدة" : "New"}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {notifications.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5 transition hover:border-[var(--brand-primary)]"
          >
            <div className="flex items-start gap-4">
              <span
                className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${item.indicatorClass}`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-black text-[var(--text-primary)]">
                    {item.title}
                  </h3>

                  <span className="shrink-0 text-xs font-bold text-[var(--text-muted)]">
                    {item.time}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {item.description}
                </p>

                <span className="mt-4 inline-flex rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-black text-[var(--text-secondary)]">
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