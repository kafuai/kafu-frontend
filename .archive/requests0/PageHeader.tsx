// PageHeader.tsx
import { Sparkles } from "lucide-react";

export default function PageHeader({ copy }: { copy: any }) {
  return (
    <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)] shadow-[var(--shadow-small)]">
            <Sparkles size={14} className="text-[var(--brand-primary)]" />
            {copy.pageEyebrow}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--success-background)] px-3 py-1.5 text-xs font-bold text-[var(--success)]">
            <span className="h-2 w-2 rounded-full bg-current" />
            {copy.live}
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl lg:text-[34px]">
          {copy.pageTitle}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px]">
          {copy.pageDescription}
        </p>
      </div>
    </header>
  );
}