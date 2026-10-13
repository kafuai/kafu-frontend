"use client";

import { BrainCircuit, RefreshCw } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";

export default function PageLoading() {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale).page.loading;
  const isArabic = locale === "ar";

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8" dir={isArabic ? "rtl" : "ltr"}>
      <section className="relative w-full max-w-md overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-medium)]" role="status" aria-live="polite">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-primary)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -start-20 -top-20 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_6%,transparent)]" />
        
        <div className="relative">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_16%,var(--border-default))] bg-[var(--brand-subtle)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
            <RefreshCw aria-hidden="true" className="animate-spin" size={25} />
          </span>
          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            Corporate Brain
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
            {copy.title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
            {copy.description}
          </p>
          <div className="mt-7 flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-muted)]">
            <BrainCircuit size={15} />
            <span>{copy.status}</span>
          </div>
        </div>
      </section>
    </main>
  );
}