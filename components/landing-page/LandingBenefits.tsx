"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";

// --- المحتوى العربي ---
const ARABIC_CONTENT = {
  badge: "الفوائد التنفيذية",
  title: "قيمة مباشرة للقيادة والمؤسسة",
  description:
    "لا يقاس نجاح KAFU AI بعدد التقارير التي ينتجها، بل بقدرته على تحسين سرعة القرار وجودة التنفيذ والنتائج المؤسسية.",
  benefits: [
    {
      metric: "01",
      title: "وضوح تنفيذي أكبر",
      description:
        "صورة موحدة تربط التحديات والقرارات والمبادرات والنتائج أمام القيادة.",
    },
    {
      metric: "02",
      title: "قرارات أسرع وأكثر ثقة",
      description:
        "توصيات مبنية على السياق المؤسسي والأدلة والأولويات بدل الاجتهادات المنفصلة.",
    },
    {
      metric: "03",
      title: "مساءلة واضحة",
      description:
        "كل قرار يرتبط بمالك، موعد، حالة، ومؤشرات متابعة قابلة للقياس.",
    },
    {
      metric: "04",
      title: "تنسيق أفضل بين الإدارات",
      description:
        "توحيد اللغة والمعلومات والمسؤوليات عبر الفرق والمستويات الإدارية.",
    },
    {
      metric: "05",
      title: "حفظ المعرفة المؤسسية",
      description:
        "تقليل ضياع الخبرة والسياق عند انتقال الموظفين أو تغير الفرق.",
    },
    {
      metric: "06",
      title: "قدرة أكبر على التوسع",
      description:
        "إدخال الذكاء الاصطناعي إلى العمل المؤسسي ضمن إطار منظم وقابل للحوكمة.",
    },
  ],
} as const;

// --- المحتوى الإنجليزي ---
const ENGLISH_CONTENT = {
  badge: "Executive Benefits",
  title: "Direct value for leadership and the enterprise",
  description:
    "KAFU AI's success is not measured by the number of reports it generates, but by its ability to improve decision speed, execution quality, and enterprise outcomes.",
  benefits: [
    {
      metric: "01",
      title: "Greater executive clarity",
      description:
        "A unified view connecting challenges, decisions, initiatives, and outcomes for leadership.",
    },
    {
      metric: "02",
      title: "Faster and more confident decisions",
      description:
        "Recommendations based on enterprise context, evidence, and priorities rather than isolated guesswork.",
    },
    {
      metric: "03",
      title: "Clear accountability",
      description:
        "Every decision is linked to an owner, deadline, status, and measurable tracking indicators.",
    },
    {
      metric: "04",
      title: "Better cross-departmental coordination",
      description:
        "Unifying language, information, and responsibilities across teams and management levels.",
    },
    {
      metric: "05",
      title: "Preserving enterprise knowledge",
      description:
        "Reducing the loss of expertise and context when employees transition or teams change.",
    },
    {
      metric: "06",
      title: "Greater scalability",
      description:
        "Introducing AI into enterprise workflows within a structured and governable framework.",
    },
  ],
} as const;

export function LandingBenefits() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"}
      className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)] px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl text-start">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
            {content.badge}
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
            {content.title}
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-grid-divider)] md:grid-cols-2 lg:grid-cols-3">
          {content.benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="min-h-52 bg-[var(--landing-bg-primary)] p-6 text-start transition duration-200 hover:bg-[var(--landing-bg-secondary)]"
            >
              {/* إضافة dir="ltr" للأرقام لضمان عرضها بشكل سليم (01, 02...) */}
              <p 
                dir="ltr"
                className="text-xs font-semibold text-[var(--landing-accent)] inline-block"
              >
                {benefit.metric}
              </p>

              <h3 className="mt-4 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}