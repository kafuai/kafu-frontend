"use client";

import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Database,
  ShieldCheck,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainMemoryProps {
  companyName: string;
  discoveryAnswerCount: number;
}

export default function CorporateBrainMemory({
  companyName,
  discoveryAnswerCount,
}: CorporateBrainMemoryProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const memoryItems = [
    {
      icon: Database,
      title: isArabic
        ? "سياق المؤسسة"
        : "Enterprise Context",
      description: isArabic
        ? `يتذكر Corporate Brain بيانات ${companyName} والقطاع والدولة وحجم القوى العاملة.`
        : `Corporate Brain retains ${companyName} profile, industry, country, and workforce context.`,
      status: isArabic
        ? "متصل"
        : "Connected",
      tone:
        "border-[var(--success)]/20 bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: BrainCircuit,
      title: isArabic
        ? "ذاكرة الاستكشاف"
        : "Discovery Memory",
      description: isArabic
        ? `تم حفظ ${discoveryAnswerCount} إشارة استكشافية لاستخدامها في التحليل ودعم القرارات.`
        : `${discoveryAnswerCount} discovery signals are retained for analysis and decision support.`,
      status: isArabic
        ? "نشطة"
        : "Active",
      tone:
        "border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: Clock3,
      title: isArabic
        ? "ذاكرة القرارات"
        : "Decision Memory",
      description: isArabic
        ? "يحتفظ النظام بالتوصيات السابقة ومسؤولي التنفيذ والنتائج المتوقعة."
        : "The system retains previous recommendations, execution owners, and expected outcomes.",
      status: isArabic
        ? "قيد التوسع"
        : "Expanding",
      tone:
        "border-[var(--warning)]/20 bg-[var(--warning-background)] text-[var(--warning)]",
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <BrainCircuit size={20} />
            </span>

            <div className="min-w-0">
              <h2 className="text-base font-black text-[var(--text-primary)]">
                {isArabic
                  ? "ذاكرة المؤسسة الذكية"
                  : "Enterprise AI Memory"}
              </h2>

              <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
                {isArabic
                  ? "السياق المؤسسي الذي يحتفظ به Corporate Brain عبر التفاعلات."
                  : "Organizational context retained by Corporate Brain across interactions."}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--success)]/20 bg-[var(--success-background)] px-3 py-1.5 text-[10px] font-black text-[var(--success)]">
            <ShieldCheck size={13} />

            {isArabic
              ? "ذاكرة آمنة"
              : "Secure Memory"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-5 md:p-6 lg:grid-cols-3">
        {memoryItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex min-h-[210px] flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                  <Icon size={18} />
                </span>

                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${item.tone}`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-black leading-6 text-[var(--text-primary)]">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                {item.description}
              </p>

              <div className="mt-auto flex items-center gap-2 border-t border-[var(--border-default)] pt-4 text-[10px] font-bold text-[var(--success)]">
                <CheckCircle2 size={14} />

                {isArabic
                  ? "متاح للتحليل"
                  : "Available for analysis"}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}