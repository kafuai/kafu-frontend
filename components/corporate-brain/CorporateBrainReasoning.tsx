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

  const reasoningSteps = [
    {
      icon: Database,
      title:
        locale === "ar"
          ? "جمع بيانات المؤسسة"
          : "Collect enterprise data",
      description:
        locale === "ar"
          ? "بيانات الشركة والقطاع والدولة وحجم القوى العاملة."
          : "Company profile, industry, country, and workforce data.",
    },
    {
      icon: FileSearch,
      title:
        locale === "ar"
          ? "تحليل إشارات الاستكشاف"
          : "Analyze discovery signals",
      description:
        locale === "ar"
          ? "استخراج التحديات والأولويات والفجوات المتكررة."
          : "Extract recurring challenges, priorities, and knowledge gaps.",
    },
    {
      icon: BrainCircuit,
      title:
        locale === "ar"
          ? "ربط المعرفة بالقرار"
          : "Connect knowledge to decisions",
      description:
        locale === "ar"
          ? "مقارنة الأدلة وتحديد التأثير والمخاطر والأولوية."
          : "Compare evidence and assess impact, risk, and priority.",
    },
    {
      icon: Lightbulb,
      title:
        locale === "ar"
          ? "إنتاج التوصية التنفيذية"
          : "Generate executive recommendation",
      description:
        locale === "ar"
          ? "تقديم قرار قابل للتنفيذ مع نتيجة متوقعة ومستوى ثقة."
          : "Produce an actionable decision with expected outcome and confidence.",
    },
  ];

  return (
    <section className="rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <BrainCircuit size={20} />
          </span>

          <div>
            <h2 className="text-base font-black text-[var(--text-primary)]">
              {locale === "ar"
                ? "كيف وصل Corporate Brain إلى القرار؟"
                : "How Corporate Brain reached the decision"}
            </h2>

            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
              {locale === "ar"
                ? "مسار مبسط يوضح مصادر التحليل ومنطق التوصية."
                : "A simplified reasoning path showing the evidence and recommendation logic."}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--success-background)] px-3 py-2 text-[10px] font-black text-[var(--success)]">
          <ShieldCheck size={13} />
          {locale === "ar" ? "قابل للتتبع" : "Traceable"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-4">
        {reasoningSteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === reasoningSteps.length - 1;

          return (
            <div
              key={step.title}
              className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                  <Icon size={17} />
                </span>

                <span className="text-[10px] font-black text-[var(--text-muted)]">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mt-4 text-xs font-black text-[var(--text-primary)]">
                {step.title}
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                {step.description}
              </p>

              {!isLast && (
                <ArrowDown className="mx-auto mt-4 text-[var(--brand-primary)] lg:absolute lg:-inset-inline-end-5 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:-rotate-90" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}