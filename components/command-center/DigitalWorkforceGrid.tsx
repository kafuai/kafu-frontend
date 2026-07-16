import { Bot } from "lucide-react";

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
    return "bg-[var(--success-background)] text-[var(--success)]";
  }

  if (
    normalizedStatus.includes("processing") ||
    normalizedStatus.includes("معالجة")
  ) {
    return "bg-[var(--warning-background)] text-[var(--warning)]";
  }

  return "bg-[var(--surface)] text-[var(--text-secondary)]";
}

export default function DigitalWorkforceGrid({
  locale,
  companyName,
  agents,
}: DigitalWorkforceGridProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "حالة القوى العاملة الرقمية"
              : "Digital Workforce Status"}
          </h2>

          <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
            {locale === "ar"
              ? `مراقبة الوكلاء المقترحين لمؤسسة ${companyName}.`
              : `Monitoring recommended agents for ${companyName}.`}
          </p>
        </div>

        <span className="w-fit rounded-full bg-[var(--success-background)] px-4 py-2 text-xs font-black text-[var(--success)]">
          {agents.length} {locale === "ar" ? "وكلاء" : "Agents"}
        </span>
      </div>

      {agents.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--surface-muted)] p-8 text-center">
          <Bot
            className="mx-auto text-[var(--text-muted)]"
            size={28}
          />

          <h3 className="mt-4 font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "لا توجد وكلاء رقمية"
              : "No digital agents available"}
          </h3>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {locale === "ar"
              ? "ستظهر الوكلاء المقترحة هنا عند توفر بيانات المؤسسة."
              : "Recommended agents will appear when organization data is available."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {agents.map((agent) => (
            <article
              key={agent.id}
              className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5 transition hover:border-[var(--brand-primary)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                  <Bot size={18} />
                </span>

                <span
                  className={`rounded-full px-3 py-2 text-[10px] font-black ${getStatusStyles(
                    agent.status,
                  )}`}
                >
                  {agent.status}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
                {agent.title}
              </h3>

              <p className="mt-1 text-[10px] font-bold text-[var(--brand-primary)]">
                {agent.name}
              </p>

              <p className="mt-3 text-xs leading-6 text-[var(--text-muted)]">
                {agent.description}
              </p>

              <div className="mt-5 flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
                <span>
                  {locale === "ar"
                    ? "الحمل الحالي"
                    : "Current Load"}
                </span>

                <span>{agent.load}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                <div
                  className="h-full rounded-full bg-[var(--brand-primary)]"
                  style={{
                    width: getLoadWidth(agent.load),
                  }}
                />
              </div>

              <div className="mt-4 rounded-xl bg-[var(--surface)] px-4 py-3 text-xs font-bold text-[var(--text-secondary)]">
                {locale === "ar" ? "الأولوية" : "Priority"}:{" "}
                <span className="text-[var(--text-primary)]">
                  {agent.priority}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}