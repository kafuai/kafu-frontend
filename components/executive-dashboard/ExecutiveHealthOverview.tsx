"use client";

import { HeartPulse } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveHealthOverview() {
  const { locale } = useLocalization();

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <HeartPulse
          className="text-[var(--success)]"
          size={20}
        />

        <h2 className="text-lg font-black">
          {locale === "ar"
            ? "الصحة العامة للمؤسسة"
            : "Enterprise Health"}
        </h2>
      </div>

      <div className="mt-6 rounded-2xl bg-[var(--success-background)] p-6">
        <div className="text-5xl font-black text-[var(--success)]">
          84%
        </div>

        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {locale === "ar"
            ? "المؤسسة في حالة مستقرة مع فرص واضحة للتحسين والنمو."
            : "The enterprise is stable with clear opportunities for optimization and growth."}
        </p>
      </div>
    </section>
  );
}