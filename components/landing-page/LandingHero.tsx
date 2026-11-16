"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

const COPY = {
  ar: {
    eyebrow: "منصة KAFU AI لإدارة الموارد البشرية",
    title: " عمليات الموارد البشرية.\nتجربة أذكى للجميع.",
    description:
      "من إدارة الموظفين والحضور والورديات إلى الرواتب وطلبات الموظفين؛ KAFU AI يجمع عمليات الموارد البشرية في منصة واحدة، مع مساعد ذكي يدعم الموظف وفريق الموارد البشرية.",
    primary: "اطلب عرضًا توضيحيًا",
    secondary: "اكتشف إمكانيات المنصة",
    points: ["مساحة عمل موحدة", "خدمة ذاتية للموظفين", "متابعة وموافقات منظمة"],
    previewLabel: "مساحة عمل الموارد البشرية",
    previewTitle: "نظرة موحدة على عملياتك",
    modules: [
      { label: "الموظفون", detail: "الملفات والبيانات الوظيفية", icon: Users },
      { label: "الحضور والورديات", detail: "الحضور والانصراف وإدارة الورديات", icon: Clock3 },
      { label: "الرواتب", detail: "إدارة بيانات الرواتب والمسيرات", icon: Wallet },
      { label: "طلبات الموظفين", detail: "الإجازات والطلبات والموافقات", icon: ClipboardList },
    ],
    assistant: "مساعد KAFU الذكي",
    assistantText: "اسأل عن سياسة الإجازات أو تابع حالة طلبك من مكان واحد.",
    assistantAction: "اسأل المساعد",
  },
  en: {
    eyebrow: "KAFU AI · Human Resources Platform",
    title: "HR operation.\nA smarter employee experience.",
    description:
      "From employee records, attendance and shifts to payroll and employee requests, KAFU AI brings HR operations together in one platform, with an intelligent assistant for employees and HR teams.",
    primary: "Request a demo",
    secondary: "Explore the platform",
    points: ["One connected workspace", "Employee self-service", "Structured approvals and tracking"],
    previewLabel: "HR Workspace",
    previewTitle: "A unified view of your operations",
    modules: [
      { label: "Employees", detail: "Profiles and employment data", icon: Users },
      { label: "Attendance & shifts", detail: "Time, attendance and shift management", icon: Clock3 },
      { label: "Payroll", detail: "Salary data and payroll runs", icon: Wallet },
      { label: "Employee requests", detail: "Leave, requests and approvals", icon: ClipboardList },
    ],
    assistant: "KAFU AI Assistant",
    assistantText: "Ask about leave policies or check a request from one place.",
    assistantAction: "Ask assistant",
  },
} as const;

export function LandingHero() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? COPY.ar : COPY.en;
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative isolate overflow-hidden border-b border-[var(--border-default)] bg-[var(--background)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_8%,color-mix(in_srgb,var(--brand-primary)_10%,transparent),transparent_38%),radial-gradient(ellipse_at_90%_90%,color-mix(in_srgb,var(--brand-primary)_7%,transparent),transparent_36%)]"
      />
      <div className="mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:py-24">
        <div className="max-w-2xl text-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--brand-primary)] shadow-[var(--shadow-small)] sm:text-sm">
            <Sparkles size={15} />
            <span>{content.eyebrow}</span>
          </div>
          <h1 className="mt-7 whitespace-pre-line text-[2.65rem] font-bold leading-[1.18] tracking-[-0.045em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.65rem]">
            {content.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg sm:leading-9">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book-demo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-medium)] transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              {content.primary}
              <Arrow size={17} />
            </Link>
            <a
              href="#platform"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-6 py-3 text-sm font-bold text-[var(--text-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--surface-muted)]"
            >
              {content.secondary}
              {isArabic ? <ArrowUpLeft size={16} /> : <ArrowRight size={16} />}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[var(--text-secondary)]">
            {content.points.map((point) => (
              <li key={point} className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[var(--brand-primary)]" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[650px] text-start">
          <div className="absolute -inset-5 -z-10 rounded-[36px] bg-[color-mix(in_srgb,var(--brand-primary)_7%,transparent)] blur-2xl" />
          <div className="overflow-hidden rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-large)]">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                  <Users size={19} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">{content.previewLabel}</p>
                  <h2 className="mt-0.5 text-sm font-bold text-[var(--text-primary)] sm:text-base">{content.previewTitle}</h2>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3">
                {content.modules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <article key={module.label} className="group rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]"><Icon size={19} /></span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)]" dir="ltr">0{index + 1}</span>
                      </div>
                      <h3 className="mt-4 text-sm font-bold text-[var(--text-primary)] sm:text-base">{module.label}</h3>
                      <p className="mt-1.5 text-xs leading-6 text-[var(--text-secondary)] sm:text-sm">{module.detail}</p>
                    </article>
                  );
                })}
              </div>
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_22%,var(--border-default))] bg-[var(--brand-subtle)] p-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)]"><Bot size={20} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--text-primary)]">{content.assistant}</p>
                  <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)] sm:text-sm">{content.assistantText}</p>
                </div>
                <span className="hidden shrink-0 items-center gap-1 text-xs font-bold text-[var(--brand-primary)] sm:inline-flex">{content.assistantAction}<Arrow size={14} /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
