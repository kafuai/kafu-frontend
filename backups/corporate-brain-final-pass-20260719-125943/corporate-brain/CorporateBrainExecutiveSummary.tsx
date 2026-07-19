"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainExecutiveSummaryProps {
  companyName: string;
  discoveryAnswerCount: number;
}

export default function CorporateBrainExecutiveSummary({
  companyName,
  discoveryAnswerCount,
}: CorporateBrainExecutiveSummaryProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const summaryItems = [
    {
      icon: CheckCircle2,
      value: "3",
      label: isArabic
        ? "أولويات تنفيذية"
        : "Executive Priorities",
      tone:
        "border-[var(--success)]/20 bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: AlertTriangle,
      value: "2",
      label: isArabic
        ? "مخاطر تتطلب تدخلًا"
        : "Risks Requiring Action",
      tone:
        "border-[var(--warning)]/20 bg-[var(--warning-background)] text-[var(--warning)]",
    },
    {
      icon: Activity,
      value: `${discoveryAnswerCount}`,
      label: isArabic
        ? "إشارات استكشافية"
        : "Discovery Signals",
      tone:
        "border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--brand-primary)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--brand-primary)_10%,transparent),transparent_42%)]" />

      <div className="relative p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] px-3 py-1.5 text-[10px] font-black text-[var(--brand-primary)]">
              <Sparkles size={14} />
              {isArabic
                ? "الملخص التنفيذي الذكي"
                : "AI Executive Summary"}
            </div>

            <h2 className="mt-4 text-xl font-black tracking-tight text-[var(--text-primary)] md:text-2xl">
              {isArabic
                ? `ما الذي تحتاجه ${companyName} الآن؟`
                : `What ${companyName} needs now`}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {isArabic
                ? "يشير التحليل الحالي إلى أن أكبر فرصة للتحسين تتمثل في توحيد المعرفة المؤسسية وربطها بقرارات واضحة، ومسؤولي تنفيذ محددين، ومؤشرات أداء قابلة للقياس."
                : "Current analysis indicates that the strongest improvement opportunity is to unify enterprise knowledge and connect it to clear decisions, accountable owners, and measurable performance indicators."}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex min-h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl !bg-slate-900 px-4 text-xs font-black !text-white transition hover:!bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            {isArabic
              ? "فتح التقرير التنفيذي"
              : "Open executive report"}

            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4"
              >
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.tone}`}
                >
                  <Icon size={17} />
                </span>

                <div className="min-w-0">
                  <p className="text-xl font-black text-[var(--text-primary)]">
                    {item.value}
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold leading-5 text-[var(--text-muted)]">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}