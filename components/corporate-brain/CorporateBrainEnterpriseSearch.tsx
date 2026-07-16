"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainEnterpriseSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export default function CorporateBrainEnterpriseSearch({
  value,
  onChange,
  resultCount,
}: CorporateBrainEnterpriseSearchProps) {
  const { locale } = useLocalization();

  return (
    <section className="rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />

          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={
              locale === "ar"
                ? "ابحث في السياسات والبيانات ونتائج الاستكشاف..."
                : "Search policies, company data, and discovery insights..."
            }
            className="h-12 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] ps-12 pe-11 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)]"
          />

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute inset-inline-end-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              aria-label={
                locale === "ar"
                  ? "مسح البحث"
                  : "Clear search"
              }
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-xs font-black text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
        >
          <SlidersHorizontal size={16} />
          {locale === "ar" ? "تصفية" : "Filter"}
        </button>
      </div>

      <p className="mt-3 px-1 text-[11px] font-semibold text-[var(--text-muted)]">
        {locale === "ar"
          ? `${resultCount} نتيجة معرفية متاحة`
          : `${resultCount} knowledge results available`}
      </p>
    </section>
  );
}