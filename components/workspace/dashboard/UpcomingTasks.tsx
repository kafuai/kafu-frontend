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
    <section className="flex h-full min-h-[420px] flex-col rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6">
      <div className="flex min-h-12 items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <CalendarCheck size={18} />
          </span>

          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
              {locale === "ar"
                ? "المهام القادمة"
                : "Upcoming Tasks"}
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">
              {locale === "ar"
                ? "الإجراءات المطلوب متابعتها خلال الفترة الحالية."
                : "Actions requiring follow-up during the current period."}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--text-secondary)]">
          {locale === "ar" ? "هذا الأسبوع" : "This week"}
        </span>
      </div>

      <div className="mt-5 flex-1 divide-y divide-[var(--border-default)]">
        {tasks.map((item) => (
          <article
            key={item.task}
            className="flex min-h-[104px] items-center justify-between gap-4 py-4 first:pt-0 last:min-h-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[var(--text-primary)]">
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

            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--text-muted)] transition duration-150 hover:border-[color-mix(in_srgb,var(--brand-primary)_20%,var(--border-default))] hover:text-[var(--brand-primary)]">
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

