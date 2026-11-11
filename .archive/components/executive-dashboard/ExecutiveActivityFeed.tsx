"use client";

import {
  Activity,
  Bot,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveActivityFeed() {
  const { locale } = useLocalization();

  const items = [
    {
      icon: BrainCircuit,
      title:
        locale === "ar"
          ? "تم تحليل 12 مستندًا"
          : "12 documents analyzed",
      description:
        locale === "ar"
          ? "قام Corporate Brain بتحديث قاعدة المعرفة المؤسسية."
          : "Corporate Brain updated the enterprise knowledge base.",
    },
    {
      icon: CheckCircle2,
      title:
        locale === "ar"
          ? "تم إنشاء 3 قرارات تنفيذية"
          : "3 executive decisions generated",
      description:
        locale === "ar"
          ? "تم ترتيب القرارات وفق الأولوية والتأثير المتوقع."
          : "Decisions were ranked by priority and expected impact.",
    },
    {
      icon: Bot,
      title:
        locale === "ar"
          ? "اكتملت مهمة الموارد البشرية"
          : "HR workflow completed",
      description:
        locale === "ar"
          ? "أنهى وكيل الذكاء الاصطناعي المهمة بنجاح."
          : "The AI agent completed the assigned workflow successfully.",
    },
  ];

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Activity size={20} />
        </span>

        <div>
          <h2 className="text-lg font-black text-[var(--text-primary)]">
            {locale === "ar" ? "آخر النشاطات" : "Recent Activity"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "أحدث العمليات والتحديثات داخل KAFU AI"
              : "Latest operations and updates across KAFU AI"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Icon size={17} />
              </span>

              <div>
                <h3 className="text-sm font-black text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}