"use client";

import {
  BrainCircuit,
  Building2,
  FileText,
  Network,
  ShieldAlert,
  Target,
  UsersRound,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainKnowledgeGraphProps {
  companyName: string;
}

export default function CorporateBrainKnowledgeGraph({
  companyName,
}: CorporateBrainKnowledgeGraphProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const nodes = [
    {
      icon: Building2,
      title: companyName,
      subtitle: isArabic
        ? "المؤسسة"
        : "Organization",
      className:
        "bg-[var(--text-primary)] text-[var(--surface)]",
    },
    {
      icon: FileText,
      title: isArabic
        ? "السياسات"
        : "Policies",
      subtitle: isArabic
        ? "10 مصادر"
        : "10 sources",
      className:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: Target,
      title: isArabic
        ? "الأهداف"
        : "Objectives",
      subtitle: isArabic
        ? "6 أهداف"
        : "6 objectives",
      className:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: ShieldAlert,
      title: isArabic
        ? "المخاطر"
        : "Risks",
      subtitle: isArabic
        ? "4 مخاطر"
        : "4 risks",
      className:
        "bg-[var(--critical-background)] text-[var(--critical)]",
    },
    {
      icon: UsersRound,
      title: isArabic
        ? "فرق التنفيذ"
        : "Execution Teams",
      subtitle: isArabic
        ? "3 فرق"
        : "3 teams",
      className:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
  ];

  const positions = [
    "start-3 top-3 md:start-14 md:top-8",
    "end-3 top-3 md:end-14 md:top-8",
    "start-3 bottom-3 md:start-14 md:bottom-8",
    "end-3 bottom-3 md:end-14 md:bottom-8",
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <Network size={20} />
            </span>

            <div className="min-w-0">
              <h2 className="text-base font-black text-[var(--text-primary)]">
                {isArabic
                  ? "الرسم المعرفي للمؤسسة"
                  : "Enterprise Knowledge Graph"}
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">
                {isArabic
                  ? "تصور مبسط للعلاقات بين المعرفة والأهداف والمخاطر وفرق التنفيذ."
                  : "A simplified map of relationships across knowledge, objectives, risks, and execution."}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] px-3 py-1.5 text-[10px] font-black text-[var(--brand-primary)]">
            <BrainCircuit size={13} />
            {isArabic
              ? "18 علاقة"
              : "18 Connections"}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="relative min-h-[340px] overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--brand-primary)_10%,transparent),transparent_58%)]" />

          <div className="relative grid min-h-[300px] place-items-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--border-strong)]" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border-default)]" />

            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <div
                className={`flex h-28 w-28 flex-col items-center justify-center rounded-full p-4 text-center shadow-[var(--shadow-large)] ${nodes[0].className}`}
              >
                <Building2 size={24} />

                <strong className="mt-2 max-w-20 truncate text-xs">
                  {nodes[0].title}
                </strong>

                <span className="mt-1 text-[9px] opacity-75">
                  {nodes[0].subtitle}
                </span>
              </div>
            </div>

            {nodes.slice(1).map((node, index) => {
              const Icon = node.icon;

              return (
                <div
                  key={node.title}
                  className={`absolute ${positions[index]}`}
                >
                  <div
                    className={`flex min-w-28 flex-col items-center rounded-2xl border border-[var(--border-default)] p-4 text-center shadow-[var(--shadow-small)] ${node.className}`}
                  >
                    <Icon size={19} />

                    <strong className="mt-2 text-[11px] leading-5">
                      {node.title}
                    </strong>

                    <span className="mt-1 text-[9px] opacity-75">
                      {node.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}