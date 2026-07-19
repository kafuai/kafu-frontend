import { CalendarCheck, ChevronRight } from "lucide-react";

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
    <section className="h-full rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <CalendarCheck size={19} />
          </span>

          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
              {locale === "ar"
                ? "المهام القادمة"
                : "Upcoming Tasks"}
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              {locale === "ar"
                ? "الإجراءات المطلوب متابعتها خلال الفترة الحالية."
                : "Actions requiring follow-up during the current period."}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--text-secondary)]">
          {locale === "ar" ? "هذا الأسبوع" : "This week"}
        </span>
      </div>

      <div className="mt-5 divide-y divide-[var(--border-default)]">
        {tasks.map((item) => (
          <article
            key={item.task}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-[var(--text-primary)]">
                {item.task}
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">
                  {item.due}
                </span>

                <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />

                <span className="text-xs font-bold text-[var(--brand-primary)]">
                  {item.status}
                </span>
              </div>
            </div>

            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--text-muted)]">
              <ChevronRight
                size={15}
                className="rtl:rotate-180"
              />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
