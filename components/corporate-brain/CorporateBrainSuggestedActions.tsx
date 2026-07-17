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

  const actions = [
    {
      icon: TrendingUp,
      title:
        locale === "ar"
          ? "تحليل أداء الشركة"
          : "Analyze company performance",
      prompt:
        locale === "ar"
          ? "حلل أداء الشركة وحدد أهم ثلاث فرص للتحسين."
          : "Analyze company performance and identify the top three improvement opportunities.",
    },
    {
      icon: ShieldAlert,
      title:
        locale === "ar"
          ? "مراجعة مخاطر المؤسسة"
          : "Review enterprise risks",
      prompt:
        locale === "ar"
          ? "ما أهم المخاطر المؤسسية التي تتطلب تدخلًا تنفيذيًا؟"
          : "What enterprise risks currently require executive intervention?",
    },
    {
      icon: FileCheck2,
      title:
        locale === "ar"
          ? "مراجعة السياسات الداخلية"
          : "Review internal policies",
      prompt:
        locale === "ar"
          ? "راجع جاهزية السياسات الداخلية وحدد الفجوات المعرفية."
          : "Review internal policy readiness and identify knowledge gaps.",
    },
    {
      icon: Lightbulb,
      title:
        locale === "ar"
          ? "اقتراح قرار تنفيذي"
          : "Recommend a decision",
      prompt:
        locale === "ar"
          ? "اقترح القرار التنفيذي الأعلى أولوية بناءً على بيانات المؤسسة."
          : "Recommend the highest-priority executive decision based on enterprise data.",
    },
  ];

  return (
    <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <SearchCheck size={19} />
        </span>

        <div>
          <h2 className="text-sm font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "استفسارات تنفيذية مقترحة"
              : "Suggested Executive Queries"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "ابدأ بتحليل جاهز أو اكتب سؤالك الخاص."
              : "Start with a ready analysis or ask your own question."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => onSelect(action.prompt)}
              className="group flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 text-start transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Icon size={17} />
              </span>

              <span className="text-xs font-extrabold leading-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
