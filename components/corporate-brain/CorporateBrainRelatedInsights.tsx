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
  const isArabic = locale === "ar";

  const insights = [
    {
      icon: ShieldAlert,
      category: isArabic
        ? "مخاطر"
        : "Risk",
      title: isArabic
        ? "تكرار الأخطاء بسبب عدم توحيد السياسات"
        : "Repeated errors caused by inconsistent policy execution",
      description: isArabic
        ? "عدم وجود مصدر موحد للسياسات يزيد احتمالية اختلاف التنفيذ بين الفرق."
        : "The absence of a unified policy source increases inconsistent execution across teams.",
      tone:
        "border-[var(--critical)]/20 bg-[var(--critical-background)] text-[var(--critical)]",
    },
    {
      icon: BarChart3,
      category: isArabic
        ? "أداء"
        : "Performance",
      title: isArabic
        ? "فرصة لربط القرارات بمؤشرات قابلة للقياس"
        : "Opportunity to connect decisions to measurable indicators",
      description: isArabic
        ? "ربط التوصيات بمؤشرات الأداء سيحسن المتابعة والمساءلة التنفيذية."
        : "Connecting recommendations to KPIs will improve executive monitoring and accountability.",
      tone:
        "border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: FileCheck2,
      category: isArabic
        ? "معرفة"
        : "Knowledge",
      title: isArabic
        ? "السياسات الأكثر استخدامًا يجب أن تكون أولوية"
        : "Frequently used policies should be prioritized",
      description: isArabic
        ? "رفع أول عشر سياسات سيعطي أسرع تحسن في جاهزية Corporate Brain."
        : "Uploading the ten most-used policies will produce the fastest readiness improvement.",
      tone:
        "border-[var(--success)]/20 bg-[var(--success-background)] text-[var(--success)]",
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Lightbulb size={20} />
          </span>

          <div className="min-w-0">
            <h2 className="text-base font-black text-[var(--text-primary)]">
              {isArabic
                ? "رؤى مرتبطة"
                : "Related Enterprise Insights"}
            </h2>

            <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">
              {isArabic
                ? "رؤى إضافية اكتشفها Corporate Brain من العلاقات بين البيانات."
                : "Additional insights discovered from relationships across enterprise data."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 md:p-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;

          return (
            <article
              key={insight.title}
              className="group rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 transition hover:border-[var(--brand-primary)] hover:bg-[var(--surface)]"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${insight.tone}`}
                >
                  <Icon size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                      {insight.category}
                    </span>

                    <span className="text-[9px] font-black tracking-wider text-[var(--text-muted)]/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-1 text-xs font-black leading-5 text-[var(--text-primary)]">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                    {insight.description}
                  </p>
                </div>

                <ArrowUpRight
                  size={16}
                  className="mt-1 shrink-0 text-[var(--text-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]"
                  aria-hidden="true"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}