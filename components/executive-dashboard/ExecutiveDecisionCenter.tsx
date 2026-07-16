"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveDecisionCenter() {
  const { locale } = useLocalization();
  const DirectionIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  const decisions = [
    locale === "ar"
      ? "اعتماد تشغيل أول AI Agent لخدمة الموظفين."
      : "Approve deployment of the first Employee AI Agent.",
    locale === "ar"
      ? "رفع السياسات الداخلية إلى Corporate Brain."
      : "Upload internal policies into Corporate Brain.",
    locale === "ar"
      ? "تفعيل الملخص التنفيذي الأسبوعي."
      : "Enable the weekly executive brief.",
  ];

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "مركز القرارات"
              : "Decision Center"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "القرارات التنفيذية ذات الأولوية"
              : "Priority executive decisions"}
          </p>
        </div>

        <Clock3
          className="text-[var(--brand-primary)]"
          size={20}
        />
      </div>

      <div className="mt-6 space-y-3">
        {decisions.map((decision) => (
          <article
            key={decision}
            className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-[var(--success)]"
              />

              <p className="text-sm font-bold leading-6 text-[var(--text-secondary)]">
                {decision}
              </p>
            </div>

            <DirectionIcon
              size={16}
              className="shrink-0 text-[var(--brand-primary)]"
            />
          </article>
        ))}
      </div>
    </section>
  );
}