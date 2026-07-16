"use client";

import { Activity } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveActivityFeed() {
  const { locale } = useLocalization();

  const items = [
    locale === "ar"
      ? "Corporate Brain قام بتحليل 12 مستندًا."
      : "Corporate Brain analyzed 12 documents.",
    locale === "ar"
      ? "تم اقتراح 3 قرارات جديدة."
      : "3 new executive decisions generated.",
    locale === "ar"
      ? "AI Agent أكمل مهمة الموارد البشرية."
      : "HR AI Agent completed a workflow.",
  ];

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <Activity className="text-[var(--brand-primary)]" size={20} />

        <h2 className="text-lg font-black">
          {locale === "ar" ? "آخر النشاطات" : "Recent Activity"}
        </h2>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl bg-[var(--surface-muted)] p-4 text-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}