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

  const summaryItems = [
    {
      icon: CheckCircle2,
      value: "3",
      label:
        locale === "ar"
          ? "أولويات تنفيذية"
          : "Executive Priorities",
      tone:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: AlertTriangle,
      value: "2",
      label:
        locale === "ar"
          ? "مخاطر تتطلب تدخلًا"
          : "Risks Requiring Action",
      tone:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
    {
      icon: Activity,
      value: `${discoveryAnswerCount}`,
      label:
        locale === "ar"
          ? "إشارة استكشافية"
          : "Discovery Signals",
      tone:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="relative p-6 md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--brand-primary)_12%,transparent),transparent_46%)]" />

        <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-3 py-2 text-[10px] font-black text-[var(--brand-primary)]">
                <Sparkles size={14} />
                {locale === "ar"
                  ? "الملخص التنفيذي الذكي"
                  : "AI Executive Summary"}
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight text-[var(--text-primary)]">
                {locale === "ar"
                  ? `ما يحتاجه ${companyName} الآن`
                  : `What ${companyName} needs now`}
              </h2>

              <p className="mt-3 text-sm leading-8 text-[var(--text-secondary)]">
                {locale === "ar"
                  ? "يشير التحليل الحالي إلى أن أكبر فرصة للتحسين هي توحيد المعرفة المؤسسية وربطها بقرارات واضحة ومسؤولي تنفيذ ومؤشرات أداء قابلة للقياس."
                  : "Current analysis indicates that the strongest improvement opportunity is to unify enterprise knowledge and connect it to clear decisions, accountable owners, and measurable performance indicators."}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-black text-[var(--surface)] transition hover:opacity-90"
            >
              {locale === "ar"
                ? "فتح التقرير التنفيذي"
                : "Open executive report"}

              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {summaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4"
                >
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}
                  >
                    <Icon size={17} />
                  </span>

                  <div>
                    <p className="text-xl font-black text-[var(--text-primary)]">
                      {item.value}
                    </p>

                    <p className="text-[10px] font-bold text-[var(--text-muted)]">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}