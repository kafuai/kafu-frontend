"use client";

import {
  ArrowUpRight,
  BarChart3,
  FileCheck2,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function CorporateBrainRelatedInsights() {
  const { locale } = useLocalization();

  const insights = [
    {
      icon: ShieldAlert,
      category:
        locale === "ar"
          ? "مخاطر"
          : "Risk",
      title:
        locale === "ar"
          ? "تكرار الأخطاء بسبب عدم توحيد السياسات"
          : "Repeated errors caused by inconsistent policy execution",
      description:
        locale === "ar"
          ? "عدم وجود مصدر موحد للسياسات يزيد احتمالية اختلاف التنفيذ بين الفرق."
          : "The absence of a unified policy source increases inconsistent execution across teams.",
      tone:
        "bg-[var(--critical-background)] text-[var(--critical)]",
    },
    {
      icon: BarChart3,
      category:
        locale === "ar"
          ? "أداء"
          : "Performance",
      title:
        locale === "ar"
          ? "فرصة لربط القرارات بمؤشرات قابلة للقياس"
          : "Opportunity to connect decisions to measurable indicators",
      description:
        locale === "ar"
          ? "ربط التوصيات بمؤشرات الأداء سيحسن المتابعة والمساءلة التنفيذية."
          : "Connecting recommendations to KPIs will improve executive monitoring and accountability.",
      tone:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: FileCheck2,
      category:
        locale === "ar"
          ? "معرفة"
          : "Knowledge",
      title:
        locale === "ar"
          ? "السياسات الأكثر استخدامًا يجب أن تكون أولوية"
          : "Frequently used policies should be prioritized",
      description:
        locale === "ar"
          ? "رفع أول عشر سياسات سيعطي أسرع تحسن في جاهزية Corporate Brain."
          : "Uploading the ten most-used policies will produce the fastest readiness improvement.",
      tone:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
  ];

  return (
    <section className="rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Lightbulb size={20} />
        </span>

        <div>
          <h2 className="text-base font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "رؤى مرتبطة"
              : "Related Enterprise Insights"}
          </h2>

          <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
            {locale === "ar"
              ? "رؤى إضافية اكتشفها Corporate Brain من العلاقات بين البيانات."
              : "Additional insights discovered from relationships across enterprise data."}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <article
              key={insight.title}
              className="group rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition hover:border-[var(--brand-primary)]"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${insight.tone}`}
                >
                  <Icon size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                    {insight.category}
                  </span>

                  <h3 className="mt-1 text-xs font-black leading-5 text-[var(--text-primary)]">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                    {insight.description}
                  </p>
                </div>

                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-[var(--text-muted)] transition group-hover:text-[var(--brand-primary)]"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
