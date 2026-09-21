"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";

// --- المحتوى العربي ---
const ARABIC_CONTENT = {
  badge: "منصة واحدة متصلة",
  title: "من فهم المؤسسة إلى تنفيذ القرار",
  description:
    "يربط KAFU AI دورة العمل كاملة بدلًا من ترك كل مرحلة في أداة أو ملف أو إدارة منفصلة.",
  loopBadge: "دورة الذكاء المتصلة",
  loopSequence: "الاكتشاف ← التقييم ← الفهم ← التوصية ← التنفيذ ← التعلم",
  capabilities: [
    {
      label: "اكتشاف",
      title: "الاكتشاف المؤسسي",
      description:
        "التقاط السياق الحقيقي للمؤسسة من خلال أسئلة موجهة، بيانات تشغيلية، ومدخلات أصحاب العلاقة.",
    },
    {
      label: "تقييم",
      title: "التقييم والجاهزية",
      description:
        "قياس الجاهزية المؤسسية، القدرات، فجوات الأداء، والمخاطر التي تعيق التقدم.",
    },
    {
      label: "فهم",
      title: "العقل المؤسسي",
      description:
        "بناء ذاكرة مترابطة للمعرفة والقرارات والأولويات والتجارب السابقة داخل المؤسسة.",
    },
    {
      label: "توصية",
      title: "التوصيات الذكية",
      description:
        "تحويل المعطيات إلى توصيات تنفيذية مرتبة حسب الأولوية، الأثر، والثقة.",
    },
    {
      label: "تنفيذ",
      title: "مركز القيادة",
      description:
        "إدارة القرارات، المبادرات، المسؤوليات، المواعيد، والتنبيهات من مساحة موحدة.",
    },
    {
      label: "توسع",
      title: "القوى العاملة الرقمية",
      description:
        "توظيف وكلاء ذكاء اصطناعي لدعم الفرق في التحليل، المتابعة، والتنسيق المؤسسي.",
    },
  ],
} as const;

// --- المحتوى الإنجليزي ---
const ENGLISH_CONTENT = {
  badge: "One Connected Platform",
  title: "From understanding the enterprise to executing decisions",
  description:
    "KAFU AI connects the entire workflow instead of leaving each phase in a separate tool, file, or department.",
  loopBadge: "Connected Intelligence Loop",
  loopSequence: "Discover → Assess → Understand → Recommend → Execute → Learn",
  capabilities: [
    {
      label: "Discover",
      title: "Enterprise Discovery",
      description:
        "Capture true enterprise context through guided questions, operational data, and stakeholder inputs.",
    },
    {
      label: "Assess",
      title: "Assessment & Readiness",
      description:
        "Measure enterprise readiness, capabilities, performance gaps, and risks hindering progress.",
    },
    {
      label: "Understand",
      title: "Enterprise Mind",
      description:
        "Build an interconnected memory of knowledge, decisions, priorities, and past experiences within the organization.",
    },
    {
      label: "Recommend",
      title: "Smart Recommendations",
      description:
        "Transform inputs into actionable recommendations ranked by priority, impact, and confidence.",
    },
    {
      label: "Execute",
      title: "Command Center",
      description:
        "Manage decisions, initiatives, responsibilities, deadlines, and alerts from a unified space.",
    },
    {
      label: "Scale",
      title: "Digital Workforce",
      description:
        "Employ AI agents to support teams in analysis, tracking, and enterprise coordination.",
    },
  ],
} as const;

export function LandingPlatform() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"}
      className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-secondary)] px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start text-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
              {content.badge}
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
              {content.title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
              {content.description}
            </p>

            <div className="mt-7 rounded-2xl border border-[var(--landing-accent-border)] bg-[var(--landing-accent-soft)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--landing-accent-strong)]">
                {content.loopBadge}
              </p>

              <p
                // إزالة dir="ltr" الثابتة لتعتمد على اتجاه الصفحة (حتى تظهر الأسهم بشكل سليم في العربية)
                className="mt-3 text-start text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base"
              >
                {content.loopSequence}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {content.capabilities.map((capability, index) => (
              <article
                key={capability.label}
                className="group flex min-h-56 flex-col rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 text-start transition duration-200 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--landing-accent)]">
                    {capability.label}
                  </p>

                  <span 
                    dir="ltr"
                    className="text-xs font-medium text-[var(--landing-text-muted)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                  {capability.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}