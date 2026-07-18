"use client";

import {
  ArrowDown,
  BrainCircuit,
  Database,
  FileSearch,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function CorporateBrainReasoning() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const reasoningSteps = [
    {
      icon: Database,
      title: isArabic
        ? "جمع بيانات المؤسسة"
        : "Collect enterprise data",
      description: isArabic
        ? "بيانات الشركة والقطاع والدولة وحجم القوى العاملة."
        : "Company profile, industry, country, and workforce data.",
    },
    {
      icon: FileSearch,
      title: isArabic
        ? "تحليل إشارات الاستكشاف"
        : "Analyze discovery signals",
      description: isArabic
        ? "استخراج التحديات والأولويات والفجوات المتكررة."
        : "Extract recurring challenges, priorities, and knowledge gaps.",
    },
    {
      icon: BrainCircuit,
      title: isArabic
        ? "ربط المعرفة بالقرار"
        : "Connect knowledge to decisions",
      description: isArabic
        ? "مقارنة الأدلة وتحديد التأثير والمخاطر والأولوية."
        : "Compare evidence and assess impact, risk, and priority.",
    },
    {
      icon: Lightbulb,
      title: isArabic
        ? "إنتاج التوصية التنفيذية"
        : "Generate executive recommendation",
      description: isArabic
        ? "تقديم قرار قابل للتنفيذ مع نتيجة متوقعة ومستوى ثقة."
        : "Produce an actionable decision with expected outcome and confidence.",
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <BrainCircuit size={20} />
            </span>

            <div className="min-w-0">
              <h2 className="text-base font-black text-[var(--text-primary)]">
                {isArabic
                  ? "كيف وصل Corporate Brain إلى القرار؟"
                  : "How Corporate Brain reached the decision"}
              </h2>

              <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
                {isArabic
                  ? "مسار مبسط يوضح مصادر التحليل ومنطق التوصية."
                  : "A simplified reasoning path showing the evidence and recommendation logic."}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--success)]/20 bg-[var(--success-background)] px-3 py-1.5 text-[10px] font-black text-[var(--success)]">
            <ShieldCheck size={13} />
            {isArabic ? "قابل للتتبع" : "Traceable"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-5 md:p-6 lg:grid-cols-4">
        {reasoningSteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === reasoningSteps.length - 1;

          return (
            <div
              key={step.title}
              className="relative min-h-[178px] rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                  <Icon size={17} />
                </span>

                <span className="text-[10px] font-black tracking-wider text-[var(--text-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-4 text-xs font-black leading-5 text-[var(--text-primary)]">
                {step.title}
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                {step.description}
              </p>

              {!isLast && (
                <ArrowDown
                  size={18}
                  className="mx-auto mt-4 text-[var(--brand-primary)] lg:absolute lg:-inset-inline-end-[22px] lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:-rotate-90"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}