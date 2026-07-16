import { FileText } from "lucide-react";

type ExecutiveSummaryCardProps = {
  summary: string;
};

export default function ExecutiveSummaryCard({
  summary,
}: ExecutiveSummaryCardProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] lg:col-span-2 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <FileText size={20} />
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
            Executive Summary
          </p>

          <h2 className="mt-1 text-2xl font-black text-[var(--text-primary)]">
            الملخص التنفيذي
          </h2>
        </div>
      </div>

      <p className="mt-6 max-w-5xl text-base leading-8 text-[var(--text-secondary)]">
        {summary}
      </p>
    </section>
  );
}