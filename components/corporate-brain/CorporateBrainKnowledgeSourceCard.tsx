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

  const statusConfig = {
    ready: {
      icon: CheckCircle2,
      label: locale === "ar" ? "جاهز" : "Ready",
      className:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    processing: {
      icon: Clock3,
      label: locale === "ar" ? "قيد المعالجة" : "Processing",
      className:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
    missing: {
      icon: FileText,
      label: locale === "ar" ? "يحتاج مصادر" : "Sources Needed",
      className:
        "bg-[var(--critical-background)] text-[var(--critical)]",
    },
  } as const;

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <article className="rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <Icon size={20} />
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${currentStatus.className}`}
        >
          <StatusIcon size={13} />
          {currentStatus.label}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-black text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="mt-2 min-h-12 text-xs leading-6 text-[var(--text-muted)]">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-[var(--text-secondary)]">
          {sourceCount}{" "}
          {locale === "ar" ? "مصادر" : "sources"}
        </span>

        <strong className="text-[var(--text-primary)]">
          {readiness}%
        </strong>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-300"
          style={{ width: `${readiness}%` }}
        />
      </div>
    </article>
  );
}