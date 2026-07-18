"use client";

import {
  CheckCircle2,
  Clock3,
  FileText,
  type LucideIcon,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export type KnowledgeSourceStatus =
  | "ready"
  | "processing"
  | "missing";

interface CorporateBrainKnowledgeSourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  sourceCount: number;
  readiness: number;
  status: KnowledgeSourceStatus;
}

export default function CorporateBrainKnowledgeSourceCard({
  icon: Icon,
  title,
  description,
  sourceCount,
  readiness,
  status,
}: CorporateBrainKnowledgeSourceCardProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const statusConfig = {
    ready: {
      icon: CheckCircle2,
      label: isArabic ? "جاهز" : "Ready",
      className:
        "border-[var(--success)]/20 bg-[var(--success-background)] text-[var(--success)]",
    },
    processing: {
      icon: Clock3,
      label: isArabic ? "قيد المعالجة" : "Processing",
      className:
        "border-[var(--warning)]/20 bg-[var(--warning-background)] text-[var(--warning)]",
    },
    missing: {
      icon: FileText,
      label: isArabic ? "يحتاج إلى مصادر" : "Sources Needed",
      className:
        "border-[var(--critical)]/20 bg-[var(--critical-background)] text-[var(--critical)]",
    },
  } as const;

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;
  const safeReadiness = Math.min(100, Math.max(0, readiness));

  return (
    <article className="group flex min-h-[260px] flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] transition group-hover:scale-[1.03]">
          <Icon size={20} />
        </span>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-black ${currentStatus.className}`}
        >
          <StatusIcon size={13} />
          {currentStatus.label}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-sm font-black leading-6 text-[var(--text-primary)]">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
          {description}
        </p>
      </div>

      <div className="mt-5 border-t border-[var(--border-default)] pt-4">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-bold text-[var(--text-secondary)]">
            {sourceCount} {isArabic ? "مصادر" : "sources"}
          </span>

          <strong className="font-black text-[var(--text-primary)]">
            {safeReadiness}%
          </strong>
        </div>

        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeReadiness}
          aria-label={isArabic ? "نسبة جاهزية المصدر" : "Source readiness"}
        >
          <div
            className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-300"
            style={{ width: `${safeReadiness}%` }}
          />
        </div>
      </div>
    </article>
  );
}