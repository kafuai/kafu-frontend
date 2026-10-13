import {
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";

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
  const isArabic = locale === "ar";

  return (
    <section className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] px-5 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Activity size={18} />
          </span>

          <div>
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
              {isArabic ? "النشاط المباشر" : "Live Activity"}
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {isArabic
                ? "أحدث العمليات داخل مركز القيادة"
                : "Latest command center operations"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>

          <span className="text-[10px] font-black text-emerald-700">
            {isArabic ? "مباشر" : "Live"}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {activities.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-10 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-muted)] shadow-sm">
              <Activity size={24} />
            </span>

            <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
              {isArabic ? "لا يوجد نشاط حديث" : "No Recent Activity"}
            </h3>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {isArabic
                ? "ستظهر آخر العمليات هنا عند توفرها."
                : "Latest operations will appear here when available."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="group flex items-start gap-3 rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition hover:border-[var(--brand-primary)] hover:bg-[var(--surface)]"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                  <CheckCircle2 size={15} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-xs font-black leading-5 text-[var(--text-primary)]">
                      {activity.title}
                    </h3>

                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)]">
                      <Clock3 size={11} />
                      {activity.time}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                    {activity.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
