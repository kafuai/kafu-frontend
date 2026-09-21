"use client";

import {
  ArrowDown,
  Bot,
  BrainCircuit,
  CheckCircle2,
  MessageSquareText,
  Network,
  UserRoundCheck,
  Workflow,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function CommunicationFlow() {
  const { locale } = useLocalization();

  const steps = [
    {
      icon: MessageSquareText,
      title:
        locale === "ar"
          ? "استقبال الرسالة"
          : "Receive Message",
      description:
        locale === "ar"
          ? "واتساب أو بريد أو صوت أو محادثة داخل المنصة."
          : "WhatsApp, email, voice, or in-platform chat.",
    },
    {
      icon: UserRoundCheck,
      title:
        locale === "ar"
          ? "التعرف على الهوية"
          : "Resolve Identity",
      description:
        locale === "ar"
          ? "تحديد الموظف والشركة والصلاحيات والسياق."
          : "Identify employee, company, permissions, and context.",
    },
    {
      icon: BrainCircuit,
      title: "Corporate Brain",
      description:
        locale === "ar"
          ? "فهم الطلب والرجوع إلى المعرفة والسياسات."
          : "Understand the request and retrieve knowledge and policies.",
    },
    {
      icon: Workflow,
      title:
        locale === "ar"
          ? "اتخاذ الإجراء"
          : "Execute Action",
      description:
        locale === "ar"
          ? "إجابة أو مهمة أو موافقة أو مسار عمل."
          : "Reply, task, approval, or workflow.",
    },
    {
      icon: Network,
      title:
        locale === "ar"
          ? "التسجيل والمتابعة"
          : "Track & Monitor",
      description:
        locale === "ar"
          ? "تسجيل العملية داخل AI Command Center."
          : "Record the activity inside AI Command Center.",
    },
  ];

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] md:p-8">
      <div className="flex items-start justify-between gap-5">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-xs font-black text-[var(--brand-primary)]">
            <Bot size={15} />

            {locale === "ar"
              ? "مسار معالجة موحد"
              : "Unified Processing Flow"}
          </span>

          <h2 className="mt-4 text-2xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "من الرسالة إلى الاستجابة والتنفيذ"
              : "From message to response and execution"}
          </h2>
        </div>

        <CheckCircle2
          className="shrink-0 text-[var(--success)]"
          size={24}
        />
      </div>

      <div className="mt-7 grid gap-3 xl:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.title}
              className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                  <Icon size={18} />
                </span>

                <span className="text-[10px] font-black text-[var(--text-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
                {step.title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                {step.description}
              </p>

              {!isLast && (
                <ArrowDown className="mx-auto mt-4 text-[var(--brand-primary)] xl:absolute xl:-inset-inline-end-5 xl:top-1/2 xl:mt-0 xl:-translate-y-1/2 xl:-rotate-90" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}