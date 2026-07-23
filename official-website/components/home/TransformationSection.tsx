"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { useWebsiteLanguage } from "@/components/localization";

const content = {
  en: {
    eyebrow: "Enterprise Transformation Journey",
    title: "Move from executive priorities to governed execution.",
    description:
      "KAFU AI provides a structured path for understanding the organization, clarifying decisions and turning approved priorities into measurable progress.",
    adoptionTitle: "A controlled path to enterprise value",
    adoptionPoints: [
      "Begin with one high-value business priority",
      "Define ownership, governance and measurable outcomes",
      "Expand only after value has been demonstrated",
    ],
    followedBy: "Followed by",
    steps: [
      {
        number: "01",
        title: "Discover",
        description:
          "Capture executive priorities, operating challenges and the organizational context behind them.",
      },
      {
        number: "02",
        title: "Understand",
        description:
          "Structure relevant knowledge and identify the decision areas with the greatest business impact.",
      },
      {
        number: "03",
        title: "Decide",
        description:
          "Turn business context into clear priorities, risks, recommendations and executive choices.",
      },
      {
        number: "04",
        title: "Execute",
        description:
          "Connect approved decisions with accountable owners, required actions and visible progress.",
      },
      {
        number: "05",
        title: "Govern",
        description:
          "Maintain oversight, accountability and continuous reporting as adoption expands.",
      },
    ],
  },
  ar: {
    eyebrow: "رحلة التحول المؤسسي",
    title: "انتقل من الأولويات التنفيذية إلى تنفيذ محكوم.",
    description:
      "توفر KAFU AI مسارًا منظمًا لفهم المؤسسة وتوضيح القرارات وتحويل الأولويات المعتمدة إلى تقدم قابل للقياس.",
    adoptionTitle: "مسار مضبوط لتحقيق قيمة مؤسسية",
    adoptionPoints: [
      "ابدأ بأولوية أعمال واحدة عالية القيمة",
      "حدد المسؤوليات والحوكمة والنتائج القابلة للقياس",
      "توسع فقط بعد إثبات القيمة",
    ],
    followedBy: "تليها",
    steps: [
      {
        number: "01",
        title: "الاكتشاف",
        description:
          "حدد الأولويات التنفيذية والتحديات التشغيلية والسياق التنظيمي المرتبط بها.",
      },
      {
        number: "02",
        title: "الفهم",
        description:
          "نظّم المعرفة ذات الصلة وحدد مجالات القرار ذات الأثر الأكبر على الأعمال.",
      },
      {
        number: "03",
        title: "اتخاذ القرار",
        description:
          "حوّل سياق الأعمال إلى أولويات ومخاطر وتوصيات وخيارات تنفيذية واضحة.",
      },
      {
        number: "04",
        title: "التنفيذ",
        description:
          "اربط القرارات المعتمدة بالمسؤولين والإجراءات المطلوبة والتقدم القابل للمتابعة.",
      },
      {
        number: "05",
        title: "الحوكمة",
        description:
          "حافظ على الإشراف والمساءلة والتقارير المستمرة مع توسع الاستخدام.",
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