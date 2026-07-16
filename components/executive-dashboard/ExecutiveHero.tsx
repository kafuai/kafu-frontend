"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveHero() {
  const { locale } = useLocalization();

  return (
    <section className="rounded-[32px] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-medium)]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-xs font-black text-[var(--brand-primary)]">
            <Sparkles size={15} />
            Executive Dashboard
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
            {locale === "ar"
              ? "لوحة القيادة التنفيذية"
              : "Executive Dashboard"}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
            {locale === "ar"
              ? "ملخص تنفيذي موحد يجمع أداء المؤسسة، توصيات الذكاء الاصطناعي، حالة القوى العاملة الرقمية، والقرارات ذات الأولوية."
              : "A unified executive summary combining enterprise performance, AI recommendations, digital workforce status, and strategic priorities."}
          </p>
        </div>

        <Link
          href="/command-center"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 font-black text-[var(--surface)]"
        >
          {locale === "ar"
            ? "فتح مركز القيادة"
            : "Open Command Center"}

          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[var(--brand-subtle)] p-5">
        <BrainCircuit
          className="text-[var(--brand-primary)]"
          size={22}
        />

        <p className="text-sm font-bold text-[var(--text-secondary)]">
          {locale === "ar"
            ? "جميع الوحدات مرتبطة الآن: Corporate DNA → Corporate Brain → Digital Workforce → AI Command Center."
            : "All core modules are connected: Corporate DNA → Corporate Brain → Digital Workforce → AI Command Center."}
        </p>
      </div>
    </section>
  );
}