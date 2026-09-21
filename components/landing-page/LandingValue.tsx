"use client";

import { useLocalization } from "@/components/localization/LocalizationContext";

// --- المحتوى العربي ---
const ARABIC_CONTENT = {
  badge: "لماذا KAFU AI",
  title: "نظام تشغيل ذكي للمعرفة والقرار والتنفيذ",
  description:
    "KAFU AI لا يقدم لوحة معلومات إضافية، بل يبني طبقة ذكاء مؤسسي تساعد القيادة والفرق على فهم الواقع، تحديد الأولويات، وتنفيذ القرارات بثقة.",
  pillars: [
    {
      eyebrow: "الفهم",
      title: "افهم مؤسستك بعمق",
      description:
        "اجمع السياق المؤسسي، التحديات، القدرات، الأولويات، والمخاطر في صورة واحدة مترابطة.",
    },
    {
      eyebrow: "القرار",
      title: "اتخذ قرارات أوضح",
      description:
        "حوّل البيانات والتقييمات إلى توصيات تنفيذية مرتبة حسب الأولوية والأثر والثقة.",
    },
    {
      eyebrow: "التنفيذ",
      title: "اربط القرار بالتنفيذ",
      description:
        "حوّل التوصيات إلى مبادرات ومسؤوليات ومواعيد ومتابعة مستمرة من مركز قيادة موحد.",
    },
  ],
} as const;

// --- المحتوى الإنجليزي ---
const ENGLISH_CONTENT = {
  badge: "Why KAFU AI",
  title: "An intelligent operating system for knowledge, decisions, and execution",
  description:
    "KAFU AI doesn't just provide another dashboard; it builds an enterprise intelligence layer that helps leadership and teams understand reality, set priorities, and execute decisions with confidence.",
  pillars: [
    {
      eyebrow: "Understand",
      title: "Understand your organization deeply",
      description:
        "Gather enterprise context, challenges, capabilities, priorities, and risks into a single, cohesive picture.",
    },
    {
      eyebrow: "Decide",
      title: "Make clearer decisions",
      description:
        "Transform data and assessments into actionable recommendations ranked by priority, impact, and confidence.",
    },
    {
      eyebrow: "Execute",
      title: "Link decisions to execution",
      description:
        "Convert recommendations into initiatives, responsibilities, deadlines, and continuous tracking from a unified command center.",
    },
  ],
} as const;

export function LandingValue() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"}
      className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-secondary)] px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
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

          <div className="space-y-4">
            {content.pillars.map((pillar, index) => (
              <article
                key={pillar.eyebrow}
                className="group rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 text-start transition duration-200 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
              >
                {/* flex-row-reverse أو flex العادي سيتعامل معها بشكل تلقائي بفضل dir */}
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-accent)]">
                    {pillar.eyebrow}
                  </p>

                  <span 
                    dir="ltr" 
                    className="text-xs font-medium text-[var(--landing-text-muted)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold leading-7 text-[var(--landing-text-primary)]">
                  {pillar.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}