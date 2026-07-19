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
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="h-1 bg-[var(--brand-primary)]" />

      <div className="relative px-6 py-7 md:px-8 lg:px-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand-primary)_12%,transparent),transparent_44%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="min-w-0 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--brand-primary)]">
              <Sparkles size={14} />

              {isArabic
                ? "الذكاء التنفيذي للمؤسسة"
                : "Enterprise Executive Intelligence"}
            </div>

            <div className="mt-5 flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--text-primary)] text-[var(--surface)] shadow-[var(--shadow-medium)]">
                <BrainCircuit size={25} strokeWidth={2} />
              </span>

              <div className="min-w-0">
                <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">
                  Corporate Brain
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                  {isArabic
                    ? `العقل المؤسسي لـ ${companyName}، يجمع المعرفة والبيانات والقرارات في مساحة موحدة للذكاء التنفيذي.`
                    : `The enterprise brain for ${companyName}, connecting organizational knowledge, data, and decisions in one executive intelligence workspace.`}
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex w-fit min-w-[250px] items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--success-background)] px-4 py-3 text-[var(--success)]">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-30" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-current" />
            </span>

            <div>
              <p className="text-xs font-black">
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

      <div className="grid border-t border-[var(--border-default)] md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="flex items-center gap-4 border-b border-[var(--border-default)] px-6 py-4 last:border-b-0 md:border-b-0 md:border-e md:last:border-e-0"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Icon size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex items-end gap-2">
                  <p className="text-xl font-black text-[var(--text-primary)]">
                    {metric.value}
                  </p>

                  <span className="pb-0.5 text-[10px] font-black text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-0.5 truncate text-xs font-semibold text-[var(--text-muted)]">
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