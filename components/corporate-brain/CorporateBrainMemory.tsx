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

  const memoryItems = [
    {
      icon: Database,
      title:
        locale === "ar"
          ? "سياق المؤسسة"
          : "Enterprise Context",
      description:
        locale === "ar"
          ? `يتذكر Corporate Brain بيانات ${companyName} والقطاع والدولة وحجم القوى العاملة.`
          : `Corporate Brain retains ${companyName} profile, industry, country, and workforce context.`,
      status:
        locale === "ar"
          ? "متصل"
          : "Connected",
      tone:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: BrainCircuit,
      title:
        locale === "ar"
          ? "ذاكرة الاستكشاف"
          : "Discovery Memory",
      description:
        locale === "ar"
          ? `تم حفظ ${discoveryAnswerCount} إشارة استكشافية لاستخدامها في التحليل ودعم القرارات.`
          : `${discoveryAnswerCount} discovery signals are retained for analysis and decision support.`,
      status:
        locale === "ar"
          ? "نشطة"
          : "Active",
      tone:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: Clock3,
      title:
        locale === "ar"
          ? "ذاكرة القرارات"
          : "Decision Memory",
      description:
        locale === "ar"
          ? "يحتفظ النظام بالتوصيات السابقة ومسؤولي التنفيذ والنتائج المتوقعة."
          : "The system retains previous recommendations, execution owners, and expected outcomes.",
      status:
        locale === "ar"
          ? "قيد التوسع"
          : "Expanding",
      tone:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
  ];

  return (
    <section className="rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <BrainCircuit size={20} />
          </span>

          <div>
            <h2 className="text-base font-black text-[var(--text-primary)]">
              {locale === "ar"
                ? "ذاكرة المؤسسة الذكية"
                : "Enterprise AI Memory"}
            </h2>

            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
              {locale === "ar"
                ? "السياق المؤسسي الذي يحتفظ به Corporate Brain عبر التفاعلات."
                : "Organizational context retained by Corporate Brain across interactions."}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--success-background)] px-3 py-2 text-[10px] font-black text-[var(--success)]">
          <ShieldCheck size={13} />

          {locale === "ar"
            ? "ذاكرة آمنة"
            : "Secure Memory"}
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {memoryItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                  <Icon size={18} />
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black ${item.tone}`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                {item.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[var(--success)]">
                <CheckCircle2 size={14} />

                {locale === "ar"
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
