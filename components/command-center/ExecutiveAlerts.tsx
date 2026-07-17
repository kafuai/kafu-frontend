import { AlertTriangle, ShieldCheck } from "lucide-react";

export type CommandCenterAlert = {
  id: string;
  title: string;
  description: string;
  level: string;
};

type ExecutiveAlertsProps = {
  locale: "ar" | "en";
  alerts: CommandCenterAlert[];
};

export default function ExecutiveAlerts({
  locale,
  alerts,
}: ExecutiveAlertsProps) {
  return (
    <aside className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--warning-background)] text-[var(--warning)]">
          <AlertTriangle size={20} />
        </span>

        <div>
          <h2 className="text-base font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "التنبيهات التنفيذية"
              : "Executive Alerts"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {alerts.length}{" "}
            {locale === "ar"
              ? "تنبيهات نشطة"
              : "Active Alerts"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className="rounded-2xl bg-[var(--warning-background)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xs font-black text-[var(--text-primary)]">
                {alert.title}
              </h3>

              <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[9px] font-black text-[var(--warning)]">
                {alert.level}
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">
              {alert.description}
            </p>
          </article>
        ))}

        {alerts.length === 0 && (
          <div className="flex items-start gap-3 rounded-2xl bg-[var(--success-background)] p-4">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-[var(--success)]"
            />

            <p className="text-xs font-bold leading-6 text-[var(--text-secondary)]">
              {locale === "ar"
                ? "لا توجد تنبيهات تنفيذية نشطة حاليًا."
                : "No active executive alerts right now."}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
