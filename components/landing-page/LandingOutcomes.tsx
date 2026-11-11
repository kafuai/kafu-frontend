"use client";

import { useLocalization } from "@/components/localization/LocalizationContext";


const ARABIC_CONTENT = {
  badge: "نتائج الأعمال",
  title: "نتائج يمكن للقيادة رؤيتها وقياسها",
  description:
    "يبدأ كل تطبيق لـ KAFU AI بتحدٍ مؤسسي واضح ومؤشرات نجاح متفق عليها، ثم يقاس الأثر طوال رحلة التنفيذ.",
  outcomes: [
    {
      value: "أسرع",
      title: "دورة القرار",
      description:
        "تقليل الوقت المستغرق في جمع المعلومات وتوحيدها وتحويلها إلى اتجاه تنفيذي.",
    },
    {
      value: "أوضح",
      title: "المساءلة والتنفيذ",
      description:
        "تحديد من يملك القرار، وما المطلوب، ومتى يجب التنفيذ، وكيف تقاس النتيجة.",
    },
    {
      value: "أذكى",
      title: "استخدام المعرفة",
      description:
        "الاستفادة من سياق المؤسسة وقراراتها وتجاربها السابقة بدل البدء من الصفر.",
    },
    {
      value: "أقوى",
      title: "جاهزية المؤسسة",
      description:
        "كشف الفجوات والمخاطر مبكرًا وبناء خطط تحول أكثر واقعية واستدامة.",
    },
  ],
} as const;


const ENGLISH_CONTENT = {
  badge: "Business Outcomes",
  title: "Outcomes leadership can see and measure",
  description:
    "Every KAFU AI implementation begins with a clear enterprise challenge and agreed-upon success metrics, with impact measured throughout the execution journey.",
  outcomes: [
    {
      value: "Faster",
      title: "Decision Cycle",
      description:
        "Reducing the time spent gathering and consolidating information and turning it into executive direction.",
    },
    {
      value: "Clearer",
      title: "Accountability & Execution",
      description:
        "Defining who owns the decision, what is required, when it must be executed, and how the outcome is measured.",
    },
    {
      value: "Smarter",
      title: "Knowledge Utilization",
      description:
        "Leveraging enterprise context, decisions, and past experiences instead of starting from scratch.",
    },
    {
      value: "Stronger",
      title: "Enterprise Readiness",
      description:
        "Detecting gaps and risks early and building more realistic and sustainable transformation plans.",
    },
  ],
} as const;

export function LandingOutcomes() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"}
      className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-secondary)] px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-bg-primary)] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
            <div className="max-w-xl text-start">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
                {content.badge}
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
                {content.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
                {content.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.outcomes.map((outcome) => (
                <article
                  key={outcome.title}
                  className="group min-h-52 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 text-start transition duration-200 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
                >
                  <p className="text-2xl font-semibold tracking-tight text-[var(--landing-accent-strong)]">
                    {outcome.value}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                    {outcome.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                    {outcome.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}