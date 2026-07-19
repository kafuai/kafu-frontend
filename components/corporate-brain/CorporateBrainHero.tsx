"use client";

import {
  BrainCircuit,
  Database,
  FileSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainHeroProps {
  companyName: string;
  knowledgeSources: number;
  discoveryAnswers: number;
}

export default function CorporateBrainHero({
  companyName,
  knowledgeSources,
  discoveryAnswers,
}: CorporateBrainHeroProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const metrics = [
    {
      icon: Database,
      value: knowledgeSources,
      label: isArabic ? "مصادر المعرفة" : "Knowledge Sources",
    },
    {
      icon: FileSearch,
      value: discoveryAnswers,
      label: isArabic ? "إجابات الاستكشاف" : "Discovery Answers",
    },
    {
      icon: ShieldCheck,
      value: "92%",
      label: isArabic ? "مستوى الثقة" : "Confidence Level",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-28 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_6%,transparent)]"
      />

      <div className="relative px-5 py-6 sm:px-6 lg:px-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand-primary)_16%,var(--border-default))] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--brand-primary)]">
              <Sparkles size={14} />

              {isArabic
                ? "الذكاء التنفيذي للمؤسسة"
                : "Enterprise Executive Intelligence"}
            </div>

            <div className="mt-4 flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--text-primary)] text-[var(--surface)] shadow-[var(--shadow-medium)]">
                <BrainCircuit size={23} strokeWidth={2} />
              </span>

              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[var(--text-primary)] md:text-3xl">
                  {isArabic ? "العقل المؤسسي" : "Corporate Brain"}
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                  {isArabic
                    ? `العقل المؤسسي لـ ${companyName}، يجمع المعرفة والبيانات والقرارات في مساحة موحدة للذكاء التنفيذي.`
                    : `The enterprise brain for ${companyName}, connecting organizational knowledge, data, and decisions in one executive intelligence workspace.`}
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex w-fit min-w-[230px] items-center gap-3 rounded-[16px] border border-[color-mix(in_srgb,var(--success)_18%,var(--border-default))] bg-[var(--success-background)] px-4 py-3 text-[var(--success)]">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-30" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
            </span>

            <div>
              <p className="text-xs font-extrabold">
                {isArabic
                  ? "العقل المؤسسي متصل"
                  : "Corporate Brain Connected"}
              </p>

              <p className="mt-0.5 text-[11px] opacity-80">
                {isArabic
                  ? "جاهز للتحليل والاستجابة"
                  : "Ready to analyze and respond"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid border-t border-[var(--border-default)] sm:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="flex items-center gap-3 border-b border-[var(--border-default)] px-5 py-3.5 last:border-b-0 sm:border-b-0 sm:border-e sm:last:border-e-0"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Icon size={17} />
              </span>

              <div className="min-w-0">
                <div className="flex items-end gap-2">
                  <p className="text-lg font-extrabold text-[var(--text-primary)]">
                    {metric.value}
                  </p>

                  <span className="pb-0.5 text-[10px] font-extrabold text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="truncate text-xs font-semibold text-[var(--text-muted)]">
                  {metric.label}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
