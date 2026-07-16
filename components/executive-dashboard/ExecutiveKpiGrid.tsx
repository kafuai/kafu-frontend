"use client";

import {
  Activity,
  Bot,
  BrainCircuit,
  Gauge,
  TrendingUp,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveKpiGrid() {
  const { locale } = useLocalization();

  const kpis = [
    {
      icon: Gauge,
      label:
        locale === "ar"
          ? "صحة المؤسسة"
          : "Enterprise Health",
      value: "84%",
      note:
        locale === "ar"
          ? "مستقرة وتتحسن"
          : "Stable and improving",
    },
    {
      icon: BrainCircuit,
      label:
        locale === "ar"
          ? "جاهزية Corporate Brain"
          : "Corporate Brain Readiness",
      value: "78%",
      note:
        locale === "ar"
          ? "المعرفة مترابطة"
          : "Knowledge connected",
    },
    {
      icon: Bot,
      label:
        locale === "ar"
          ? "الوكلاء النشطون"
          : "Active AI Agents",
      value: "6",
      note:
        locale === "ar"
          ? "تحت المراقبة حاليًا"
          : "Currently monitored",
    },
    {
      icon: TrendingUp,
      label:
        locale === "ar"
          ? "فرص التحسين"
          : "Improvement Opportunities",
      value: "12",
      note:
        locale === "ar"
          ? "3 ذات أولوية عالية"
          : "3 high priority",
    },
    {
      icon: Activity,
      label:
        locale === "ar"
          ? "نشاط اليوم"
          : "Today's Activity",
      value: "27",
      note:
        locale === "ar"
          ? "إجراءات وتحليلات"
          : "Actions and analyses",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpis.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)]"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <Icon size={20} />
            </span>

            <p className="mt-5 text-xs font-bold text-[var(--text-muted)]">
              {item.label}
            </p>

            <h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">
              {item.value}
            </h2>

            <p className="mt-2 text-xs font-bold text-[var(--brand-primary)]">
              {item.note}
            </p>
          </article>
        );
      })}
    </section>
  );
}