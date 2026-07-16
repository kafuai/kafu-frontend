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

  const priorityConfig = {
    critical: {
      label: locale === "ar" ? "حرجة" : "Critical",
      icon: ShieldAlert,
      className:
        "bg-[var(--critical-background)] text-[var(--critical)]",
    },
    high: {
      label: locale === "ar" ? "عالية" : "High",
      icon: TrendingUp,
      className:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
    medium: {
      label: locale === "ar" ? "متوسطة" : "Medium",
      icon: Clock3,
      className:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
  } as const;

  const currentPriority = priorityConfig[priority];
  const PriorityIcon = currentPriority.icon;

  return (
    <article className="group rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Icon size={20} />
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${currentPriority.className}`}
        >
          <PriorityIcon size={13} />
          {currentPriority.label}
        </span>
      </div>

      <h3 className="mt-5 text-base font-black text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
        {description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
          <div className="flex items-center gap-2 text-[var(--brand-primary)]">
            <Target size={15} />

            <span className="text-[10px] font-black uppercase tracking-wider">
              {locale === "ar"
                ? "الأثر المتوقع"
                : "Business Impact"}
            </span>
          </div>

          <p className="mt-2 text-xs font-bold leading-5 text-[var(--text-secondary)]">
            {impact}
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
          <div className="flex items-center gap-2 text-[var(--success)]">
            <CheckCircle2 size={15} />

            <span className="text-[10px] font-black uppercase tracking-wider">
              {locale === "ar"
                ? "مستوى الثقة"
                : "Confidence"}
            </span>
          </div>

          <p className="mt-2 text-lg font-black text-[var(--text-primary)]">
            {confidence}%
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
          {locale === "ar"
            ? "النتيجة المتوقعة"
            : "Expected Outcome"}
        </p>

        <p className="mt-2 text-xs font-semibold leading-6 text-[var(--text-secondary)]">
          {expectedOutcome}
        </p>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[var(--brand-primary)] transition group-hover:gap-3"
      >
        {locale === "ar"
          ? "عرض خطة التنفيذ"
          : "View execution plan"}

        <ArrowUpRight size={15} />
      </button>
    </article>
  );
}