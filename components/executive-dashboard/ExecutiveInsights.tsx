"use client";

import {
  AlertTriangle,
  BrainCircuit,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveInsights() {
  const { locale } = useLocalization();

  const insights = [
    {
      icon: TrendingUp,
      title:
        locale === "ar"
          ? "أولوية تحسين تجربة الموظف"
          : "Employee experience is the top improvement priority",
      description:
        locale === "ar"
          ? "الطلبات اليدوية والاستفسارات المتكررة تستهلك وقتًا إداريًا كبيرًا."
          : "Manual requests and repeated inquiries are consuming significant administrative time.",
      tone:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: AlertTriangle,
      title:
        locale === "ar"
          ? "فجوة في مصادر المعرفة"
          : "Knowledge source gap detected",
      description:
        locale === "ar"
          ? "رفع السياسات والإجراءات الأكثر استخدامًا سيحسن دقة Corporate Brain."
          : "Uploading the most-used policies and procedures will improve Corporate Brain accuracy.",
      tone:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
    {
      icon: BrainCircuit,
      title:
        locale === "ar"
          ? "جاهزية جيدة للتشغيل الذكي"
          : "Strong readiness for intelligent execution",
      description:
        locale === "ar"
          ? "البنية الحالية تدعم بدء تشغيل أول مجموعة من الوكلاء الرقميين."
          : "The current foundation supports activating the first group of digital agents.",
      tone:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
  ];

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Lightbulb size={20} />
        </span>

        <div>
          <h2 className="text-lg font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "الرؤى التنفيذية"
              : "Executive Insights"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "أهم ما اكتشفه KAFU AI حاليًا"
              : "What KAFU AI has identified right now"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <article
              key={insight.title}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${insight.tone}`}
                >
                  <Icon size={17} />
                </span>

                <div>
                  <h3 className="text-sm font-black text-[var(--text-primary)]">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                    {insight.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}