"use client";

import { HeartPulse, TrendingUp } from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveHealthOverview() {
  const { locale } = useLocalization();

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--success-background)] text-[var(--success)]">
          <HeartPulse size={20} />
        </span>

        <div>
          <h2 className="text-lg font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "الصحة العامة للمؤسسة"
              : "Enterprise Health"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "مؤشر موحد للاستقرار والجاهزية المؤسسية"
              : "Unified indicator for enterprise stability and readiness"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[var(--success-background)] p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[var(--success)]">
              {locale === "ar" ? "المؤشر الحالي" : "Current score"}
            </p>

            <div className="mt-2 text-5xl font-black text-[var(--success)]">
              84%
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-black text-[var(--success)]">
            <TrendingUp size={15} />
            {locale === "ar" ? "يتحسن" : "Improving"}
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
          <div
            className="h-full rounded-full bg-[var(--success)]"
            style={{ width: "84%" }}
          />
        </div>

        <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
          {locale === "ar"
            ? "المؤسسة في حالة مستقرة مع فرص واضحة لتحسين الكفاءة، وربط المعرفة، وتوسيع التشغيل الذكي."
            : "The enterprise is stable with clear opportunities to improve efficiency, connect knowledge, and expand intelligent operations."}
        </p>
      </div>
    </section>
  );
}