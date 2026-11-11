// ManagerStats.tsx
import { Activity, Bot, CheckCircle2, CircleAlert, Inbox } from "lucide-react";
import { KpiCard } from "./SharedUI";

export default function ManagerStats({ copy, isArabic, stats }: { copy: any; isArabic: boolean; stats: { pending: number; approved: number; rejected: number } }) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,1fr)]">
      <article className="relative overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6">
        <div className="pointer-events-none absolute -end-20 -top-24 h-56 w-56 rounded-full bg-[var(--brand-subtle)] opacity-70 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)]">
            <Bot size={27} strokeWidth={1.9} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] sm:text-xl">
                {copy.manager}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-background)] px-2.5 py-1 text-[11px] font-bold text-[var(--success)]">
                <Activity size={12} />
                {isArabic ? "يعمل بشكل طبيعي" : "Operational"}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
              {copy.managerDescription}
            </p>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard icon={<Inbox size={19} />} value={stats.pending.toString()} label={copy.pending} tone="warning" />
        <KpiCard icon={<CheckCircle2 size={19} />} value={stats.approved.toString()} label={copy.approved} tone="success" />
        <KpiCard icon={<CircleAlert size={19} />} value={stats.rejected.toString()} label={copy.rejected} tone="critical" />
      </div>
    </section>
  );
}