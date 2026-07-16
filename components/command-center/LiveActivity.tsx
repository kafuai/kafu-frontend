import { Activity } from "lucide-react";

export type CommandCenterActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
};

type LiveActivityProps = {
  locale: "ar" | "en";
  activities: CommandCenterActivity[];
};

export default function LiveActivity({
  locale,
  activities,
}: LiveActivityProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Activity size={20} />
        </span>

        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)]">
            {locale === "ar" ? "النشاط المباشر" : "Live Activity"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "آخر العمليات داخل مركز القيادة"
              : "Latest command center operations"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {activities.map((activity) => (
          <article
            key={activity.id}
            className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-black text-[var(--text-primary)]">
                {activity.title}
              </h3>

              <span className="text-[10px] font-black text-[var(--success)]">
                {activity.time}
              </span>
            </div>

            <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
              {activity.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}