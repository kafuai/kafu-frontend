"use client";

import { useLocalization } from "@/components/localization/LocalizationContext";
import {
  BrainCircuit,
  CalendarDays,
  ClipboardCheck,
  MessageCircle,
  Network,
  Wallet,
  Users,
} from "lucide-react";

const CONTENT = {
  ar: {
    eyebrow: "منصة مترابطة، وليست أدوات منفصلة",
    title: "كل جزء من رحلة الموظف في مكانه الصحيح",
    description:
      "تجمع KAFU AI الوظائف الأساسية للموارد البشرية وتجربة الموظف، وتربطها بطبقة من الذكاء المؤسسي والمساعدات الذكية.",
    items: [
      { title: "إدارة الموظفين", description: "ملفات الموظفين وبياناتهم الوظيفية وإدارة الأقسام.", icon: Users },
      { title: "الحضور والورديات", description: "سجلات الحضور والانصراف، الورديات، المواقع، والتصحيحات.", icon: CalendarDays },
      { title: "الرواتب", description: "بيانات الرواتب ومسيراتها وتجهيز مخرجات الرواتب.", icon: Wallet },
      { title: "طلبات وتجربة الموظف", description: "طلبات الإجازات والخدمات ومتابعة الموافقات.", icon: MessageCircle },
      { title: "سير الموافقات", description: "تنظيم مراجعة الطلبات والقرارات حسب الصلاحيات.", icon: ClipboardCheck },
      { title: "العقل المؤسسي والقوى الرقمية", description: "معرفة مؤسسية ومساعدات ذكية لدعم العمل والقرار.", icon: BrainCircuit },
    ],
    note: "تُفعّل الصلاحيات ومساحات العمل بحسب دور المستخدم وبيانات المؤسسة.",
  },
  en: {
    eyebrow: "One connected platform, not disconnected tools",
    title: "Every part of the employee journey, in its place",
    description:
      "KAFU AI brings core HR operations and employee experience together, connected to enterprise intelligence and AI assistance.",
    items: [
      { title: "Employee management", description: "Employee profiles, employment data and departments.", icon: Users },
      { title: "Attendance & shifts", description: "Time records, shifts, work locations and corrections.", icon: CalendarDays },
      { title: "Payroll", description: "Salary data, payroll runs and payroll outputs.", icon: Wallet },
      { title: "Employee experience", description: "Leave and service requests with status tracking.", icon: MessageCircle },
      { title: "Approval workflows", description: "Structured request and decision reviews based on permissions.", icon: ClipboardCheck },
      { title: "Corporate brain & digital workforce", description: "Enterprise knowledge and AI assistance for work and decisions.", icon: Network },
    ],
    note: "Access and workspaces are governed by user roles and organization data.",
  },
} as const;

export function LandingProductShowcase() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const content = isArabic ? CONTENT.ar : CONTENT.en;

  return (
    <section id="platform" dir={isArabic ? "rtl" : "ltr"} className="border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.14em] text-[var(--brand-primary)] sm:text-sm">{content.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">{content.title}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">{content.description}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {content.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-1 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] transition group-hover:bg-[var(--brand-primary)] group-hover:text-white"><Icon size={22} /></span>
                  <span className="text-xs font-bold text-[var(--text-muted)]" dir="ltr">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.description}</p>
                <div className="absolute inset-x-6 bottom-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs leading-6 text-[var(--text-muted)]">{content.note}</p>
      </div>
    </section>
  );
}
