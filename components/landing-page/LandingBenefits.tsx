"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";

const ARABIC_CONTENT = {
  badge: "قيمة عملية في العمل اليومي",
  title: "إجراءات أوضح ومتابعة أسهل لفريقك",
  description:
    "يساعد KAFU AI على تنظيم عمليات الموارد البشرية وتقليل تشتت الطلبات والبيانات بين الملفات والقنوات المختلفة.",
  benefits: [
    {
      metric: "01",
      title: "بيانات موظفين منظمة",
      description:
        "ملف موحد لكل موظف يسهل الرجوع إلى بياناته الوظيفية ومعلوماته ذات الصلة.",
    },
    {
      metric: "02",
      title: "متابعة الحضور والورديات",
      description:
        "إدارة مواقع العمل وساعات الدوام والورديات ومراجعة حالات الحضور والتأخير والغياب.",
    },
    {
      metric: "03",
      title: "طلبات واضحة الحالة",
      description:
        "يعرف الموظف أين وصل طلبه، ويستطيع المسؤول مراجعته واتخاذ الإجراء المطلوب.",
    },
    {
      metric: "04",
      title: "موافقات منظمة",
      description:
        "تحديد المسؤولين عن المراجعة والاعتماد بحسب مسار العمل والصلاحيات.",
    },
    {
      metric: "05",
      title: "إدارة رواتب مترابطة",
      description:
        "تجهيز مسيرات الرواتب ومراجعتها واعتمادها ضمن إجراءات واضحة.",
    },
    {
      metric: "06",
      title: "خدمة ذاتية للموظف",
      description:
        "تمكين الموظفين من الوصول إلى الخدمات وطرح الاستفسارات وتقديم الطلبات ومتابعتها.",
    },
  ],
} as const;

// --- المحتوى الإنجليزي ---
const ENGLISH_CONTENT = {
  badge: "Practical Value for Everyday Work",
  title: "Clearer processes and easier follow-up for your team",
  description:
    "KAFU AI helps organize HR operations and reduces the fragmentation of employee requests and information across files and channels.",
  benefits: [
    {
      metric: "01",
      title: "Organized Employee Records",
      description:
        "A structured profile for each employee, making relevant employment information easier to access.",
    },
    {
      metric: "02",
      title: "Attendance & Shift Tracking",
      description:
        "Configure work locations, working hours, and shifts while reviewing attendance, lateness, and absence.",
    },
    {
      metric: "03",
      title: "Visible Request Status",
      description:
        "Employees can see where requests stand, while responsible users review and process them.",
    },
    {
      metric: "04",
      title: "Structured Approvals",
      description:
        "Assign reviewers and approvers according to workflow steps and user permissions.",
    },
    {
      metric: "05",
      title: "Connected Payroll Management",
      description:
        "Prepare, review, and approve payroll runs through clear processes.",
    },
    {
      metric: "06",
      title: "Employee Self-Service",
      description:
        "Help employees access services, ask questions, submit requests, and follow their progress.",
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