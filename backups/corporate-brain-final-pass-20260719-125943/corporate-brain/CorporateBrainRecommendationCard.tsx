"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export type RecommendationPriority =
  | "critical"
  | "high"
  | "medium";

interface CorporateBrainRecommendationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  priority: RecommendationPriority;
  impact: string;
  confidence: number;
  expectedOutcome: string;
}

export default function CorporateBrainRecommendationCard({
  icon: Icon,
  title,
  description,
  priority,
  impact,
  confidence,
  expectedOutcome,
}: CorporateBrainRecommendationCardProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const safeConfidence = Math.min(100, Math.max(0, confidence));

  const priorityConfig = {
    critical: {
      label: isArabic ? "حرجة" : "Critical",
      icon: ShieldAlert,
      className:
        "border-[var(--critical)]/20 bg-[var(--critical-background)] text-[var(--critical)]",
    },
    high: {
      label: isArabic ? "عالية" : "High",
      icon: TrendingUp,
      className:
        "border-[var(--warning)]/20 bg-[var(--warning-background)] text-[var(--warning)]",
    },
    medium: {
      label: isArabic ? "متوسطة" : "Medium",
      icon: Clock3,
      className:
        "border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
  } as const;

  const currentPriority = priorityConfig[priority];
  const PriorityIcon = currentPriority.icon;

  return (
    <article className="group flex min-h-[480px] flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] transition group-hover:scale-[1.03]">
          <Icon size={20} />
        </span>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-black ${currentPriority.className}`}
        >
          <PriorityIcon size={13} />
          {currentPriority.label}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-base font-black leading-7 text-[var(--text-primary)]">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
          {description}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
          <div className="flex items-center gap-2 text-[var(--brand-primary)]">
            <Target size={15} />

            <span className="text-[10px] font-black uppercase tracking-wider">
              {isArabic ? "الأثر المتوقع" : "Business Impact"}
            </span>
          </div>

          <p className="mt-2 text-xs font-bold leading-5 text-[var(--text-secondary)]">
            {impact}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
          <div className="flex items-center gap-2 text-[var(--success)]">
            <CheckCircle2 size={15} />

            <span className="text-[10px] font-black uppercase tracking-wider">
              {isArabic ? "مستوى الثقة" : "Confidence"}
            </span>
          </div>

          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-lg font-black text-[var(--text-primary)]">
              {safeConfidence}%
            </p>

            <span className="text-[10px] font-bold text-[var(--text-muted)]">
              {isArabic ? "موثوقية التحليل" : "Analysis reliability"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
          {isArabic ? "النتيجة المتوقعة" : "Expected Outcome"}
        </p>

        <p className="mt-2 text-xs font-semibold leading-6 text-[var(--text-secondary)]">
          {expectedOutcome}
        </p>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg text-xs font-black text-[var(--brand-primary)] transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
      >
        {isArabic ? "عرض خطة التنفيذ" : "View execution plan"}
        <ArrowUpRight size={15} />
      </button>
    </article>
  );
}