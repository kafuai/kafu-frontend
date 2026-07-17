import { CalendarCheck } from "lucide-react";

type UpcomingTasksProps = {
  locale?: "ar" | "en";
};

export default function UpcomingTasks({
  locale = "en",
}: UpcomingTasksProps = {}) {

  const tasks = [
    {
      task:
        locale === "ar"
          ? "مراجعة تقرير الجاهزية"
          : "Review readiness report",
      due: locale === "ar" ? "اليوم" : "Today",
      status: locale === "ar" ? "عاجل" : "Urgent",
    },
    {
      task:
        locale === "ar"
          ? "اعتماد توصيات الموارد البشرية"
          : "Approve HR recommendations",
      due: locale === "ar" ? "غدًا" : "Tomorrow",
      status: locale === "ar" ? "مراجعة" : "Review",
    },
    {
      task:
        locale === "ar"
          ? "تحديث خطة المخاطر"
          : "Update risk plan",
      due:
        locale === "ar"
          ? "هذا الأسبوع"
          : "This week",
      status: locale === "ar" ? "مخطط" : "Planned",
    },
  ];

  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <CalendarCheck size={20} />
          </span>

          <h2 className="text-xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "المهام القادمة"
              : "Upcoming Tasks"}
          </h2>
        </div>

        <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
          {locale === "ar" ? "هذا الأسبوع" : "This Week"}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map((item) => (
          <article
            key={item.task}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
          >
            <div>
              <p className="font-bold text-[var(--text-primary)]">
                {item.task}
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {item.due}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
              {item.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}