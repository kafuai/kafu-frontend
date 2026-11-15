"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";


const ARABIC_CONTENT = {
  badge: "إدارة الموارد البشرية في منصة واحدة",
  title: "كل ما يحتاجه فريق الموارد البشرية لتسيير العمل اليومي",
  description:
    "يجمع KAFU AI بيانات الموظفين وعمليات الحضور والإجازات والطلبات والرواتب في مساحة عمل واحدة، مع أدوات تساعد الموظف والمدير وفريق الموارد البشرية على متابعة الإجراءات بوضوح.",
  loopBadge: "من طلب الموظف إلى الإجراء المعتمد",
  loopSequence: "تقديم الطلب ← مراجعة المدير ← إجراء الموارد البشرية ← تحديث الحالة",
  capabilities: [
    {
      label: "الموظفون",
      title: "إدارة بيانات الموظفين",
      description:
        "ملفات منظمة للموظفين تشمل البيانات الوظيفية ومعلومات العمل والبيانات المرتبطة بالرواتب.",
    },
    {
      label: "الحضور",
      title: "الحضور والانصراف",
      description:
        "متابعة سجلات الحضور والتأخير والغياب، مع إعداد مواقع العمل وساعات الدوام والورديات.",
    },
    {
      label: "الإجازات",
      title: "الإجازات وطلبات الموظفين",
      description:
        "تقديم الطلبات ومتابعة حالتها وإدارتها من خلال مسارات المراجعة والاعتماد.",
    },
    {
      label: "الرواتب",
      title: "إدارة مسيرات الرواتب",
      description:
        "تنظيم بيانات الرواتب وتجهيز المسيرات ومراجعتها واعتمادها وفق صلاحيات المستخدمين.",
    },
    {
      label: "الموافقات",
      title: "مسارات الموافقات",
      description:
        "تنظيم انتقال الطلبات بين المسؤولين وتوثيق قرارات الموافقة أو الرفض ومتابعة حالة كل طلب.",
    },
    {
      label: "المساعد الذكي",
      title: "تجربة موظف أسهل",
      description:
        "مساعد ذكي يسهّل على الموظفين الوصول إلى المعلومات والخدمات وتقديم الطلبات ومتابعتها.",
    },
  ],
} as const;


const ENGLISH_CONTENT = {
  badge: "HR Operations in One Platform",
  title: "The tools HR teams need to manage everyday work",
  description:
    "KAFU AI brings employee records, attendance, leave, requests, and payroll workflows into one workspace, helping employees, managers, and HR teams follow each process clearly.",
  loopBadge: "From employee request to completed action",
  loopSequence: "Employee submits → Manager reviews → HR processes → Status is updated",
  capabilities: [
    {
      label: "People",
      title: "Employee Management",
      description:
        "Organized employee profiles covering employment details, work information, and payroll-related data.",
    },
    {
      label: "Attendance",
      title: "Time & Attendance",
      description:
        "Track attendance, lateness, and absence while configuring work locations, working hours, and shifts.",
    },
    {
      label: "Leave",
      title: "Leave & Employee Requests",
      description:
        "Submit requests, follow their status, and process them through review and approval workflows.",
    },
    {
      label: "Payroll",
      title: "Payroll Runs",
      description:
        "Organize salary data and prepare, review, and approve payroll runs according to user permissions.",
    },
    {
      label: "Approvals",
      title: "Approval Workflows",
      description:
        "Route requests to the right people, record approval or rejection decisions, and track each request.",
    },
    {
      label: "AI Assistant",
      title: "A Better Employee Experience",
      description:
        "An AI assistant that helps employees find information and services, submit requests, and follow up.",
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