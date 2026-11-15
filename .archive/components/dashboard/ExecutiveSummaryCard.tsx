import { FileText } from "lucide-react";

type ExecutiveSummaryCardProps = {
  summary: string;
};

export default function ExecutiveSummaryCard({
  summary,
}: ExecutiveSummaryCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] lg:col-span-2">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <FileText size={18} />
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
            Executive Summary
          </p>

          <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
            الملخص التنفيذي
          </h2>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border-default)] pt-5">
        <p className="max-w-5xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
          {summary}
        </p>
      </div>
    </section>
  );
}
