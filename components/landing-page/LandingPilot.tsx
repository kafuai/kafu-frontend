"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";

// --- المحتوى العربي ---
const ARABIC_CONTENT = {
  badge: "تجربة مؤسسية موجهة (Pilot)",
  title: "ابدأ بتجربة تنفيذية واضحة خلال 3–6 أسابيع",
  description:
    "يبدأ Pilot بنطاق محدد ومؤشرات نجاح متفق عليها، حتى تتمكن القيادة من تقييم القيمة قبل التوسع.",
  successBox: {
    title: "معايير نجاح التجربة (Pilot)",
    description:
      "وضوح أعلى، قرار أسرع، مسؤوليات محددة، ومتابعة تنفيذية قابلة للقياس.",
  },
  steps: [
    {
      step: "01",
      title: "تحديد التحدي",
      description: "نختار تحديًا مؤسسيًا واضحًا له أثر تنفيذي ويمكن قياس نتائجه.",
    },
    {
      step: "02",
      title: "جمع السياق",
      description: "نربط أصحاب العلاقة والبيانات والأولويات اللازمة لفهم الوضع الحالي.",
    },
    {
      step: "03",
      title: "تشغيل KAFU AI",
      description: "نحوّل المعطيات إلى تقييمات وتوصيات وخطة تنفيذية قابلة للمتابعة.",
    },
    {
      step: "04",
      title: "قياس الأثر",
      description: "نراجع النتائج مع القيادة ونحدد قرار التوسع أو المرحلة التالية.",
    },
  ],
} as const;

// --- المحتوى الإنجليزي ---
const ENGLISH_CONTENT = {
  badge: "Controlled Enterprise Pilot",
  title: "Start with a clear executive pilot in 3–6 weeks",
  description:
    "The Pilot begins with a defined scope and agreed-upon success metrics, enabling leadership to evaluate value before scaling.",
  successBox: {
    title: "Pilot Success Criteria",
    description:
      "Higher clarity, faster decisions, defined responsibilities, and measurable executive tracking.",
  },
  steps: [
    {
      step: "01",
      title: "Identify the Challenge",
      description: "We select a clear enterprise challenge with an executive impact and measurable results.",
    },
    {
      step: "02",
      title: "Gather Context",
      description: "We connect stakeholders, data, and priorities needed to understand the current situation.",
    },
    {
      step: "03",
      title: "Run KAFU AI",
      description: "We transform inputs into assessments, recommendations, and a trackable execution plan.",
    },
    {
      step: "04",
      title: "Measure Impact",
      description: "We review results with leadership and determine the decision to scale or the next phase.",
    },
  ],
} as const;

export function LandingPilot() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="text-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
              {content.badge}
            </p>

            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-5xl">
              {content.title}
            </h2>

            <p className="mt-6 text-lg leading-8 text-[var(--landing-text-secondary)]">
              {content.description}
            </p>

            <div className="mt-8 rounded-3xl border border-[var(--landing-accent-border)] bg-[var(--landing-accent-soft)] p-6">
              <p className="text-sm font-semibold text-[var(--landing-accent-strong)]">
                {content.successBox.title}
              </p>

              <p className="mt-3 leading-7 text-[var(--landing-text-secondary)]">
                {content.successBox.description}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {content.steps.map((item) => (
              <article
                key={item.step}
                className="group flex gap-5 rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 text-start transition duration-200 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
              >
                {/* تم وضع dir="ltr" للأرقام لكي تحافظ على شكلها 01 و 02 دائماً بدون أن تنعكس */}
                <div 
                  dir="ltr"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-muted)] text-sm font-semibold text-[var(--landing-accent-strong)] transition-colors group-hover:border-[var(--landing-accent-border)]"
                >
                  {item.step}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[var(--landing-text-primary)]">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[var(--landing-text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}