"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";


const ARABIC_CONTENT = {
  badge: "الأسئلة الشائعة",
  title: "إجابات عن KAFU AI واستخدامه",
  faqs: [
    {
      question: "ما هو KAFU AI؟",
      answer:
        "KAFU AI منصة لإدارة عمليات الموارد البشرية وتجربة الموظف. تجمع إدارة الموظفين والحضور والورديات والإجازات والطلبات والرواتب ومسارات الموافقات في منصة واحدة.",
    },
    {
      question: "هل يستطيع الموظف تقديم طلباته بنفسه؟",
      answer:
        "نعم. يستطيع الموظف الوصول إلى الخدمات المتاحة له، وتقديم الطلبات مثل الإجازات، ومتابعة حالتها من خلال المنصة.",
    },
    {
      question: "كيف تتم مراجعة الطلبات والموافقات؟",
      answer:
        "تُدار الطلبات من خلال مسارات موافقات، بحيث تتم مراجعتها واتخاذ القرار من المستخدمين المسؤولين وفق الأدوار والصلاحيات المحددة.",
    },
    {
      question: "هل يدعم KAFU AI الحضور والورديات؟",
      answer:
        "نعم. تتضمن المنصة إعداد مواقع العمل وساعات الدوام والورديات، ومتابعة سجلات الحضور والتأخير والغياب.",
    },
    {
      question: "هل تتضمن المنصة إدارة الرواتب؟",
      answer:
        "تتضمن إدارة بيانات الرواتب وتجهيز مسيرات الرواتب ومراجعتها واعتمادها. أما التحويلات البنكية فتتم عبر القنوات والأنظمة المالية المعتمدة لدى المنشأة.",
    },
    {
      question: "هل تختلف الصلاحيات حسب المستخدم؟",
      answer:
        "نعم. تُحدد صلاحيات المستخدم بحسب دوره ومسؤولياته، حتى يصل كل مستخدم إلى الوظائف والإجراءات المسموح بها له.",
    },
  ],
} as const;

const ENGLISH_CONTENT = {
  badge: "Frequently Asked Questions",
  title: "What to know about KAFU AI",
  faqs: [
    {
      question: "What is KAFU AI?",
      answer:
        "KAFU AI is an HR operations and employee experience platform. It brings employee management, attendance, shifts, leave, requests, payroll, and approval workflows together in one platform.",
    },
    {
      question: "Can employees submit their own requests?",
      answer:
        "Yes. Employees can access the services available to them, submit requests such as leave, and track their status through the platform.",
    },
    {
      question: "How are requests and approvals handled?",
      answer:
        "Requests move through approval workflows, where designated users review them and make decisions according to their assigned roles and permissions.",
    },
    {
      question: "Does KAFU AI support attendance and shifts?",
      answer:
        "Yes. The platform includes work location, working hour, and shift configuration, along with attendance, lateness, and absence tracking.",
    },
    {
      question: "Does the platform include payroll management?",
      answer:
        "It includes salary data management and the preparation, review, and approval of payroll runs. Bank transfers are handled through the organization's approved financial channels and systems.",
    },
    {
      question: "Can access differ by user?",
      answer:
        "Yes. User access is assigned according to each person's role and responsibilities, so users can access the functions and actions permitted to them.",
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