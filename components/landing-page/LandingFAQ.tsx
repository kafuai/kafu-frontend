"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";

// --- المحتوى العربي ---
const ARABIC_CONTENT = {
  badge: "الأسئلة الشائعة",
  title: "كل ما تحتاج معرفته",
  faqs: [
    {
      question: "ما هو KAFU AI؟",
      answer:
        "منصة ذكاء مؤسسي وتنفيذ تساعد القيادة على فهم المؤسسة، اتخاذ قرارات أوضح، وربط التوصيات بالتنفيذ والمتابعة.",
    },
    {
      question: "هل KAFU AI نظام موارد بشرية؟",
      answer:
        "لا. يمكنه دعم تحديات الموارد البشرية والتوطين، لكنه مصمم كمنصة أوسع للمعرفة والقرار والتنفيذ المؤسسي.",
    },
    {
      question: "كيف تبدأ المؤسسة؟",
      answer:
        "نبدأ عادةً بـ Pilot محدود النطاق يركز على تحدٍ حقيقي ومؤشرات نجاح واضحة خلال مدة تتراوح غالبًا بين 3 و6 أسابيع.",
    },
    {
      question: "هل يمكن ربطه بأنظمة المؤسسة؟",
      answer:
        "نعم. يتم تحديد التكاملات المطلوبة بناءً على نطاق الاستخدام والبيانات والأنظمة الحالية داخل المؤسسة.",
    },
    {
      question: "هل يمكن استخدامه من أكثر من إدارة؟",
      answer:
        "نعم. تم تصميمه ليجمع القيادة وفرق التحول والموارد البشرية والإدارات التشغيلية حول سياق مؤسسي موحد.",
    },
  ],
} as const;

// --- المحتوى الإنجليزي ---
const ENGLISH_CONTENT = {
  badge: "FAQ",
  title: "Frequently Asked Questions",
  faqs: [
    {
      question: "What is KAFU AI?",
      answer:
        "An enterprise intelligence and execution platform that helps leadership understand the organization, make clearer decisions, and link recommendations to execution and tracking.",
    },
    {
      question: "Is KAFU AI an HR system?",
      answer:
        "No. It can support HR and localization challenges, but it is designed as a broader platform for enterprise knowledge, decision-making, and execution.",
    },
    {
      question: "How does an organization get started?",
      answer:
        "We typically start with a limited-scope Pilot focusing on a real challenge and clear success metrics, usually taking between 3 to 6 weeks.",
    },
    {
      question: "Can it be integrated with enterprise systems?",
      answer:
        "Yes. Required integrations are determined based on the scope of use, data, and existing systems within the organization.",
    },
    {
      question: "Can it be used by multiple departments?",
      answer:
        "Yes. It is designed to unite leadership, transformation teams, HR, and operational departments around a unified enterprise context.",
    },
  ],
} as const;

export function LandingFAQ() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl text-start">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
            {content.badge}
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
            {content.title}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-[var(--landing-border)] rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface-muted)] px-6 sm:px-8">
          {content.faqs.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-[var(--landing-text-primary)]">
                <span className="text-start">{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--landing-surface)] text-xl font-medium text-[var(--landing-accent)] transition-transform duration-200 group-open:rotate-45 border border-[var(--landing-border)]">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-[var(--landing-text-secondary)] text-start">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}