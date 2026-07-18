"use client";

import {
  FileCheck2,
  Lightbulb,
  SearchCheck,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainSuggestedActionsProps {
  onSelect: (prompt: string) => void;
}

export default function CorporateBrainSuggestedActions({
  onSelect,
}: CorporateBrainSuggestedActionsProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const actions = [
    {
      icon: TrendingUp,
      title: isArabic
        ? "تحليل أداء المؤسسة"
        : "Analyze company performance",
      prompt: isArabic
        ? "حلّل أداء المؤسسة وحدد أهم ثلاث فرص للتحسين."
        : "Analyze company performance and identify the top three improvement opportunities.",
    },
    {
      icon: ShieldAlert,
      title: isArabic
        ? "مراجعة مخاطر المؤسسة"
        : "Review enterprise risks",
      prompt: isArabic
        ? "ما أهم المخاطر المؤسسية التي تتطلب تدخلًا تنفيذيًا؟"
        : "What enterprise risks currently require executive intervention?",
    },
    {
      icon: FileCheck2,
      title: isArabic
        ? "مراجعة السياسات الداخلية"
        : "Review internal policies",
      prompt: isArabic
        ? "راجع جاهزية السياسات الداخلية وحدد الفجوات المعرفية."
        : "Review internal policy readiness and identify knowledge gaps.",
    },
    {
      icon: Lightbulb,
      title: isArabic
        ? "اقتراح قرار تنفيذي"
        : "Recommend a decision",
      prompt: isArabic
        ? "اقترح القرار التنفيذي الأعلى أولوية بناءً على بيانات المؤسسة."
        : "Recommend the highest-priority executive decision based on enterprise data.",
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <SearchCheck size={19} />
          </span>

          <div className="min-w-0">
            <h2 className="text-sm font-black text-[var(--text-primary)]">
              {isArabic
                ? "استفسارات تنفيذية مقترحة"
                : "Suggested Executive Queries"}
            </h2>

            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
              {isArabic
                ? "ابدأ بتحليل جاهز أو اكتب سؤالك الخاص."
                : "Start with a ready analysis or ask your own question."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => onSelect(action.prompt)}
              className="group flex min-h-[72px] w-full items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-3.5 text-start transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Icon size={17} />
              </span>

              <span className="min-w-0 flex-1 text-xs font-extrabold leading-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {action.title}
              </span>

              <span className="shrink-0 text-[10px] font-black text-[var(--text-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}