"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { useWebsiteLanguage } from "@/components/localization";

const content = {
  en: {
    eyebrow: "Enterprise Transformation Journey",
    title: "Move from organizational understanding to governed execution.",
    description:
      "KAFU AI creates one connected journey from executive discovery to institutional intelligence, decisions and measurable action.",
    adoptionTitle: "Designed for controlled enterprise adoption",
    adoptionPoints: [
      "Start with one high-value use case",
      "Define governance and measurable outcomes",
      "Expand according to demonstrated value",
    ],
    followedBy: "Followed by",
    steps: [
      {
        number: "01",
        title: "Discover",
        description:
          "Capture executive priorities, operating challenges and organizational context.",
      },
      {
        number: "02",
        title: "Understand",
        description:
          "Structure enterprise knowledge and identify the highest-value decision areas.",
      },
      {
        number: "03",
        title: "Decide",
        description:
          "Translate context into recommendations, risks, priorities and clear executive choices.",
      },
      {
        number: "04",
        title: "Execute",
        description:
          "Connect approved priorities with responsible teams, workflows and digital workers.",
      },
      {
        number: "05",
        title: "Govern",
        description:
          "Maintain visibility, accountability and continuous executive reporting.",
      },
    ],
  },
  ar: {
    eyebrow: "رحلة التحول المؤسسي",
    title: "انتقل من فهم المؤسسة إلى تنفيذ محكوم.",
    description:
      "تنشئ كفو رحلة مترابطة تبدأ بالاكتشاف التنفيذي، ثم الذكاء المؤسسي والقرارات، وصولًا إلى إجراءات قابلة للقياس.",
    adoptionTitle: "مصممة لتبنٍ مؤسسي مضبوط",
    adoptionPoints: [
      "ابدأ بحالة استخدام واحدة عالية القيمة",
      "حدد الحوكمة والنتائج القابلة للقياس",
      "توسع وفقًا للقيمة المثبتة",
    ],
    followedBy: "تليها",
    steps: [
      {
        number: "01",
        title: "الاكتشاف",
        description:
          "حدد الأولويات التنفيذية والتحديات التشغيلية والسياق التنظيمي.",
      },
      {
        number: "02",
        title: "الفهم",
        description:
          "نظّم المعرفة المؤسسية وحدد مجالات القرار الأعلى قيمة.",
      },
      {
        number: "03",
        title: "اتخاذ القرار",
        description:
          "حوّل السياق إلى توصيات ومخاطر وأولويات وخيارات تنفيذية واضحة.",
      },
      {
        number: "04",
        title: "التنفيذ",
        description:
          "اربط الأولويات المعتمدة بالفرق المسؤولة ومسارات العمل والقوى العاملة الرقمية.",
      },
      {
        number: "05",
        title: "الحوكمة",
        description:
          "حافظ على الرؤية والمساءلة والتقارير التنفيذية المستمرة.",
      },
    ],
  },
};

export default function TransformationSection() {
  const { language, isArabic } = useWebsiteLanguage();
  const copy = content[language];

  return (
    <section className="section-spacing bg-[var(--surface-soft)]">
      <div className="website-shell">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              {copy.eyebrow}
            </p>

            <h2 className="text-balance mt-5 text-3xl font-semibold tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
              {copy.title}
            </h2>

            <p className="mt-6 text-base leading-8 text-[var(--text-secondary)]">
              {copy.description}
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--border-default)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {copy.adoptionTitle}
              </p>

              <div className="mt-4 space-y-3">
                {copy.adoptionPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-[var(--text-secondary)]"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-1 shrink-0 text-[var(--brand-primary)]"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {copy.steps.map((step, index) => (
              <article
                key={step.number}
                className="group grid gap-4 rounded-2xl border border-[var(--border-default)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] md:grid-cols-[64px_1fr_32px] md:items-center"
              >
                <span className="text-sm font-bold tracking-[0.12em] text-[var(--brand-primary)]">
                  {step.number}
                </span>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className={`hidden text-[var(--text-muted)] transition group-hover:text-[var(--brand-primary)] md:block ${
                    isArabic
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />

                {index < copy.steps.length - 1 && (
                  <span className="sr-only">
                    {copy.followedBy} {copy.steps[index + 1].title}
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
