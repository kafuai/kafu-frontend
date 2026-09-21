"use client";

import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CommunicationChannelCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: "ready" | "planned";
}

export default function CommunicationChannelCard({
  icon: Icon,
  title,
  description,
  status = "ready",
}: CommunicationChannelCardProps) {
  const { locale } = useLocalization();

  const isReady = status === "ready";

  return (
    <article className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
          <Icon size={20} />
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${
            isReady
              ? "bg-[var(--success-background)] text-[var(--success)]"
              : "bg-[var(--warning-background)] text-[var(--warning)]"
          }`}
        >
          <CheckCircle2 size={12} />

          {isReady
            ? locale === "ar"
              ? "جاهز للتكامل"
              : "Integration Ready"
            : locale === "ar"
              ? "مخطط"
              : "Planned"}
        </span>
      </div>

      <h3 className="mt-5 text-base font-black text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
        {description}
      </p>
    </article>
  );
}