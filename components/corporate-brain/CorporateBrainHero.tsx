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

  const metrics = [
    {
      icon: Database,
      value: knowledgeSources,
      label:
        locale === "ar"
          ? "مصدرًا معرفيًا"
          : "Knowledge Sources",
    },
    {
      icon: FileSearch,
      value: discoveryAnswers,
      label:
        locale === "ar"
          ? "إجابة استكشافية"
          : "Discovery Answers",
    },
    {
      icon: ShieldCheck,
      value: "92%",
      label:
        locale === "ar"
          ? "مستوى الثقة"
          : "Confidence Level",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="relative px-7 py-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand-primary)_16%,transparent),transparent_42%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-4 py-2 text-xs font-extrabold text-[var(--brand-primary)]">
              <Sparkles size={15} />
              {locale === "ar"
                ? "العقل التنفيذي للمؤسسة"
                : "Enterprise Executive Intelligence"}
            </div>

            <div className="mt-6 flex items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--text-primary)] text-[var(--surface)] shadow-[var(--shadow-medium)]">
                <BrainCircuit size={29} strokeWidth={2} />
              </span>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
                  Corporate Brain
                </h1>

                <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">
                  {locale === "ar"
                    ? `العقل المؤسسي لـ ${companyName}، يجمع المعرفة والبيانات والقرارات في مساحة ذكاء تنفيذية موحدة.`
                    : `The enterprise brain for ${companyName}, connecting organizational knowledge, data, and decisions in one executive intelligence workspace.`}
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--success-background)] px-4 py-3 text-[var(--success)]">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-30" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-current" />
            </span>

            <div>
              <p className="text-xs font-black">
                {locale === "ar"
                  ? "العقل المؤسسي متصل"
                  : "Corporate Brain Connected"}
              </p>

              <p className="mt-0.5 text-[11px] opacity-80">
                {locale === "ar"
                  ? "جاهز للتحليل والاستجابة"
                  : "Ready to analyze and respond"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid border-t border-[var(--border-default)] md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="flex items-center gap-4 border-b border-[var(--border-default)] px-7 py-5 last:border-b-0 md:border-b-0 md:border-e"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                <Icon size={20} />
              </span>

              <div>
                <p className="text-2xl font-black text-[var(--text-primary)]">
                  {metric.value}
                </p>

                <p className="text-xs font-semibold text-[var(--text-muted)]">
                  {metric.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}