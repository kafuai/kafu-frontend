import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

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

function getAlertLevelStyles(level: string) {
  const normalizedLevel = level.toLowerCase();

  if (
    normalizedLevel.includes("critical") ||
    normalizedLevel.includes("حرج")
  ) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (
    normalizedLevel.includes("high") ||
    normalizedLevel.includes("عالي")
  ) {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function ExecutiveAlerts({
  locale,
  alerts,
}: ExecutiveAlertsProps) {
  const isArabic = locale === "ar";

  return (
    <aside className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangle size={18} />
          </span>

          <div>
            <h2 className="text-base font-black text-[var(--text-primary)]">
              {isArabic
                ? "التنبيهات التنفيذية"
                : "Executive Alerts"}
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {isArabic
                ? "المخاطر والإشارات التي تتطلب الانتباه"
                : "Risks and signals requiring attention"}
            </p>
          </div>
        </div>

        <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
          {alerts.length}
        </span>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition hover:border-amber-300 hover:bg-[var(--surface)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                    <AlertTriangle size={14} />
                  </span>

                  <h3 className="pt-1 text-xs font-black leading-5 text-[var(--text-primary)]">
                    {alert.title}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-black ${getAlertLevelStyles(
                    alert.level,
                  )}`}
                >
                  {alert.level}
                </span>
              </div>

              <p className="mt-3 ps-11 text-[11px] leading-5 text-[var(--text-secondary)]">
                {alert.description}
              </p>
            </article>
          ))}

          {alerts.length === 0 && (
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <ShieldCheck size={17} />
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-950">
                      {isArabic
                        ? "الوضع التنفيذي مستقر"
                        : "Executive Status Stable"}
                    </h3>

                    <CheckCircle2 size={14} className="text-emerald-700" />
                  </div>

                  <p className="mt-1.5 text-xs leading-6 text-slate-600">
                    {isArabic
                      ? "لا توجد تنبيهات تنفيذية نشطة حاليًا."
                      : "No active executive alerts right now."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
