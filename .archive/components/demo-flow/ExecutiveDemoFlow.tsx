"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Command,
  Dna,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

const steps = [
  {
    id: "assessment",
    href: "/assessment",
    icon: ClipboardCheck,
    title: {
      ar: "التقييم المؤسسي",
      en: "Enterprise Assessment",
    },
    description: {
      ar: "جمع بيانات المؤسسة وتحديد التحديات والأولويات.",
      en: "Capture enterprise data, challenges, and priorities.",
    },
  },
  {
    id: "workspace",
    href: "/company-workspace",
    icon: Building2,
    title: {
      ar: "مساحة عمل المؤسسة",
      en: "Company Workspace",
    },
    description: {
      ar: "تجميع الملف المؤسسي والبيانات التشغيلية في مساحة موحدة.",
      en: "Unify the company profile and operating context.",
    },
  },
  {
    id: "dna",
    href: "/corporate-dna",
    icon: Dna,
    title: {
      ar: "الحمض المؤسسي",
      en: "Corporate DNA",
    },
    description: {
      ar: "فهم هوية المؤسسة ونموذج تشغيلها وفرص التحسين.",
      en: "Understand identity, operating model, and improvement opportunities.",
    },
  },
  {
    id: "brain",
    href: "/corporate-brain",
    icon: BrainCircuit,
    title: {
      ar: "العقل المؤسسي",
      en: "Corporate Brain",
    },
    description: {
      ar: "تحويل المعرفة والبيانات إلى رؤى وتوصيات تنفيذية.",
      en: "Turn enterprise knowledge into insights and recommendations.",
    },
  },
  {
    id: "workforce",
    href: "/digital-workforce",
    icon: UsersRound,
    title: {
      ar: "القوى العاملة الرقمية",
      en: "Digital Workforce",
    },
    description: {
      ar: "تحديد الوكلاء الرقميين المناسبين والمهام التي سينفذونها.",
      en: "Deploy the right digital agents for enterprise execution.",
    },
  },
  {
    id: "command-center",
    href: "/command-center",
    icon: Command,
    title: {
      ar: "مركز القيادة",
      en: "AI Command Center",
    },
    description: {
      ar: "مراقبة الوكلاء والتنبيهات والقرارات والأنشطة.",
      en: "Monitor agents, alerts, decisions, and live activity.",
    },
  },
  {
    id: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    title: {
      ar: "لوحة القيادة التنفيذية",
      en: "Executive Dashboard",
    },
    description: {
      ar: "عرض القيمة والأداء والأولويات للإدارة العليا.",
      en: "Present value, performance, and priorities to executives.",
    },
  },
];

export default function ExecutiveDemoFlow() {
  const { locale } = useLocalization();
  const DirectionIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-xs font-black text-[var(--brand-primary)]">
            <CheckCircle2 size={15} />
            {locale === "ar"
              ? "رحلة العرض التنفيذي"
              : "Executive Demo Journey"}
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)] md:text-3xl">
            {locale === "ar"
              ? "من اكتشاف المؤسسة إلى القرار والتنفيذ"
              : "From enterprise discovery to decision and execution"}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
            {locale === "ar"
              ? "رحلة مترابطة توضح كيف تفهم KAFU AI المؤسسة، وتبني عقلها المؤسسي، ثم تشغّل القوى العاملة الرقمية وتعرض النتائج للإدارة."
              : "A connected journey showing how KAFU AI understands the organization, builds its intelligence, activates digital workers, and presents executive outcomes."}
          </p>
        </div>

        <Link
          href="/assessment"
          className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
        >
          {locale === "ar"
            ? "ابدأ العرض"
            : "Start Demo"}

          <DirectionIcon size={17} />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Link
              key={step.id}
              href={step.href}
              className="group relative rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition hover:-translate-y-1 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] hover:shadow-[var(--shadow-medium)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                  <Icon size={18} />
                </span>

                <span className="text-[10px] font-black text-[var(--text-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
                {step.title[locale]}
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                {step.description[locale]}
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-[var(--brand-primary)]">
                {locale === "ar"
                  ? "فتح المرحلة"
                  : "Open Stage"}

                <DirectionIcon
                  size={13}
                  className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}