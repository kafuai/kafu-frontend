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

  const nodes = [
    {
      icon: Building2,
      title: companyName,
      subtitle:
        locale === "ar"
          ? "المؤسسة"
          : "Organization",
      className:
        "bg-[var(--text-primary)] text-[var(--surface)]",
    },
    {
      icon: FileText,
      title:
        locale === "ar"
          ? "السياسات"
          : "Policies",
      subtitle:
        locale === "ar"
          ? "10 مصادر"
          : "10 sources",
      className:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: Target,
      title:
        locale === "ar"
          ? "الأهداف"
          : "Objectives",
      subtitle:
        locale === "ar"
          ? "6 أهداف"
          : "6 objectives",
      className:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: ShieldAlert,
      title:
        locale === "ar"
          ? "المخاطر"
          : "Risks",
      subtitle:
        locale === "ar"
          ? "4 مخاطر"
          : "4 risks",
      className:
        "bg-[var(--critical-background)] text-[var(--critical)]",
    },
    {
      icon: UsersRound,
      title:
        locale === "ar"
          ? "فرق التنفيذ"
          : "Execution Teams",
      subtitle:
        locale === "ar"
          ? "3 فرق"
          : "3 teams",
      className:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Network size={20} />
          </span>

          <div>
            <h2 className="text-base font-black text-[var(--text-primary)]">
              {locale === "ar"
                ? "الرسم المعرفي للمؤسسة"
                : "Enterprise Knowledge Graph"}
            </h2>

            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
              {locale === "ar"
                ? "تصور مبسط للعلاقات بين المعرفة والأهداف والمخاطر والتنفيذ."
                : "A simplified map of relationships across knowledge, objectives, risks, and execution."}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-3 py-2 text-[10px] font-black text-[var(--brand-primary)]">
          <BrainCircuit size={13} />
          {locale === "ar"
            ? "18 علاقة"
            : "18 Connections"}
        </span>
      </div>

      <div className="relative mt-7 min-h-[340px] overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--brand-primary)_12%,transparent),transparent_58%)]" />

        <div className="relative grid min-h-[290px] place-items-center">
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--border-strong)]" />

          <div className="absolute left-1/2 top-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border-default)]" />

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className={`flex h-28 w-28 flex-col items-center justify-center rounded-full p-4 text-center shadow-[var(--shadow-large)] ${nodes[0].className}`}>
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

            const positions = [
              "start-4 top-4 md:start-16 md:top-8",
              "end-4 top-4 md:end-16 md:top-8",
              "start-4 bottom-4 md:start-16 md:bottom-8",
              "end-4 bottom-4 md:end-16 md:bottom-8",
            ];

            return (
              <div
                key={node.title}
                className={`absolute ${positions[index]}`}
              >
                <div className={`flex min-w-28 flex-col items-center rounded-2xl border border-[var(--border-default)] p-4 text-center shadow-[var(--shadow-small)] ${node.className}`}>
                  <Icon size={19} />

                  <strong className="mt-2 text-[11px]">
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
    </section>
  );
}