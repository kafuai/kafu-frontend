"use client";

import React from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";


const ARABIC_CONTENT = {
  badge: "البدء مع KAFU AI",
  title: "تهيئة المنصة بما يناسب طريقة عمل منشأتك",
  description:
    "تبدأ رحلة الاستخدام بفهم احتياج فريقك، ثم إعداد بيانات المنشأة والعمليات التي ستستخدمها، وتجربة الإجراءات مع المستخدمين المعنيين.",
  successBox: {
    title: "الهدف من مرحلة التهيئة",
    description:
      "أن تكون بيانات المنشأة ومستخدميها وصلاحياتهم وإجراءات الموارد البشرية الأساسية جاهزة للاستخدام والمراجعة.",
  },
  steps: [
    {
      step: "01",
      title: "تحديد الاحتياج",
      description: "نتعرف على طريقة إدارة الموظفين والحضور والإجازات والطلبات والرواتب في منشأتك.",
    },
    {
      step: "02",
      title: "تهيئة المنشأة والمستخدمين",
      description: "إعداد مساحة المنشأة وإضافة المستخدمين وتحديد الأدوار والصلاحيات المناسبة لهم.",
    },
    {
      step: "03",
      title: "إعداد عمليات الموارد البشرية",
      description: "تهيئة البيانات والإعدادات المطلوبة مثل الأقسام والورديات ومواقع العمل ومسارات الموافقات.",
    },
    {
      step: "04",
      title: "التجربة والمراجعة",
      description: "تجربة الإجراءات مع فريقك، ومراجعة النتائج، ومعالجة الملاحظات قبل التوسع في الاستخدام.",
    },
  ],
} as const;


const ENGLISH_CONTENT = {
  badge: "Getting Started with KAFU AI",
  title: "Set up the platform around the way your organization works",
  description:
    "Getting started begins with understanding your team's needs, configuring your organization and the workflows you plan to use, and testing those processes with the people involved.",
  successBox: {
    title: "The goal of onboarding",
    description:
      "Have your organization, users, permissions, and core HR workflows configured and ready for use and review.",
  },
  steps: [
    {
      step: "01",
      title: "Understand Your Needs",
      description: "Review how your organization manages employees, attendance, leave, requests, and payroll.",
    },
    {
      step: "02",
      title: "Set Up Your Organization & Users",
      description: "Configure your organization workspace, add users, and assign appropriate roles and permissions.",
    },
    {
      step: "03",
      title: "Configure HR Operations",
      description: "Set up the required information and settings, such as departments, shifts, work locations, and approval workflows.",
    },
    {
      step: "04",
      title: "Test & Review",
      description: "Run the workflows with your team, review the results, and address feedback before expanding usage.",
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