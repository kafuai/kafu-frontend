"use client";

import { Search, X } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";

interface EnterpriseSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export default function EnterpriseSearch({ value, onChange, resultCount }: EnterpriseSearchProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale).search;

  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={18} className="pointer-events-none absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search" value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={copy.placeholder} aria-label={copy.ariaLabel}
            className="h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface)] ps-11 pe-11 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)]"
          />
          {value.length > 0 && (
            <button type="button" onClick={() => onChange("")} aria-label={copy.clear} className="absolute inset-inline-end-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]">
              <X size={15} />
            </button>
          )}
        </div>
        <div className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-xs font-black text-[var(--text-secondary)]" aria-live="polite">
          {copy.results(resultCount)}
        </div>
      </div>
      <p className="mt-2 px-1 text-[11px] font-semibold text-[var(--text-muted)]">{copy.available(resultCount)}</p>
    </section>
  );
}