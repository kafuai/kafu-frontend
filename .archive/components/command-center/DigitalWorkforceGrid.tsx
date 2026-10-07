import {
  Activity,
  Bot,
  Gauge,
  Sparkles,
} from "lucide-react";

export type CommandCenterAgent = {
  id: string;
  name: string;
  title: string;
  description: string;
  status: string;
  load: number;
  priority: string;
};

type DigitalWorkforceGridProps = {
  locale: "ar" | "en";
  companyName: string;
  agents: CommandCenterAgent[];
};

function getLoadWidth(load: number) {
  return `${Math.min(Math.max(load, 0), 100)}%`;
}

function getStatusStyles(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus.includes("online") ||
    normalizedStatus.includes("متصل")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    normalizedStatus.includes("processing") ||
    normalizedStatus.includes("معالجة")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--text-secondary)]";
}

export default function DigitalWorkforceGrid({
  locale,
  companyName,
  agents,
}: DigitalWorkforceGridProps) {
  const isArabic = locale === "ar";

  return (
    <section className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="flex flex-col gap-4 border-b border-[var(--border-default)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Bot size={18} />
          </span>

          <div>
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
              {isArabic
                ? "حالة القوى العاملة الرقمية"
                : "Digital Workforce Status"}
            </h2>

            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
              {isArabic
                ? `مراقبة الوكلاء المقترحين لمؤسسة ${companyName}.`
                : `Monitoring recommended agents for ${companyName}.`}
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>

          <span className="text-[10px] font-black text-emerald-700">
            {agents.length} {isArabic ? "وكلاء" : "Agents"}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {agents.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-10 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-muted)] shadow-sm">
              <Bot size={24} />
            </span>

            <h3 className="mt-4 font-black text-[var(--text-primary)]">
              {isArabic
                ? "لا يوجد وكلاء رقميون"
                : "No Digital Agents Available"}
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[var(--text-muted)]">
              {isArabic
                ? "سيظهر الوكلاء المقترحون هنا عند توفر بيانات المؤسسة."
                : "Recommended agents will appear when organization data is available."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <article
                key={agent.id}
                className="group rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:bg-[var(--surface)] hover:shadow-[var(--shadow-medium)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-sm">
                    <Bot size={18} />
                  </span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${getStatusStyles(
                      agent.status,
                    )}`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-black leading-6 text-[var(--text-primary)]">
                    {agent.title}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-[10px] font-black text-[var(--brand-primary)]">
                    <Sparkles size={11} />
                    <span>{agent.name}</span>
                  </p>
                </div>

                <p className="mt-3 min-h-12 text-xs leading-6 text-[var(--text-muted)]">
                  {agent.description}
                </p>

                <div className="mt-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Gauge
                        size={14}
                        className="text-[var(--brand-primary)]"
                      />

                      <span className="text-xs font-bold text-[var(--text-secondary)]">
                        {isArabic ? "الحمل الحالي" : "Current Load"}
                      </span>
                    </div>

                    <span
                      className="text-xs font-black text-[var(--text-primary)]"
                      dir="ltr"
                    >
                      {agent.load}%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-500"
                      style={{ width: getLoadWidth(agent.load) }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[var(--brand-subtle)] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Activity
                      size={13}
                      className="text-[var(--brand-primary)]"
                    />

                    <span className="text-xs font-bold text-[var(--text-secondary)]">
                      {isArabic ? "الأولوية" : "Priority"}
                    </span>
                  </div>

                  <span className="text-xs font-black text-[var(--text-primary)]">
                    {agent.priority}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
