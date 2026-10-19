"use client";

import Link from "next/link";
import { AlertTriangle, Building2 } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";

interface PageErrorProps {
  message: string;
}

export default function PageError({ message }: PageErrorProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale).page.error;
  const isArabic = locale === "ar";

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8" dir={isArabic ? "rtl" : "ltr"}>
      <section className="relative w-full max-w-xl overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-medium)] md:px-10" role="alert">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[var(--warning)]" />
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warning-background)] text-[var(--warning)]">
          <AlertTriangle size={26} />
        </span>
        <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
          Corporate Brain
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
          {copy.title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg break-words text-sm leading-7 text-[var(--text-secondary)]">
          {message || copy.defaultMessage}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/assessment" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 text-sm font-extrabold text-white shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2">
            <Building2 aria-hidden="true" size={17} />
            {copy.backBtn}
          </Link>
          <Link href="/company-workspace" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-6 text-sm font-extrabold text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2">
            {copy.workspaceBtn}
          </Link>
        </div>
      </section>
    </main>
  );
}