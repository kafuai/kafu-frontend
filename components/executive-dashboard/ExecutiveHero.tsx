"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function ExecutiveHero() {
  const { locale } = useLocalization();
  const DirectionIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="border-b border-[var(--border-default)] bg-[var(--surface)] px-5 py-7 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <Sparkles size={14} />
            Executive Dashboard
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            {locale === "ar"
              ? "لوحة القيادة التنفيذية"
              : "Executive Dashboard"}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            {locale === "ar"
              ? "ملخص تنفيذي موحد يجمع أداء المؤسسة، وتوصيات الذكاء الاصطناعي، وحالة القوى العاملة الرقمية، والقرارات ذات الأولوية."
              : "A unified executive summary combining enterprise performance, AI recommendations, digital workforce status, and strategic priorities."}
          </p>
        </div>

        <Link
          href="/command-center"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
        >
          {locale === "ar"
            ? "فتح مركز القيادة"
            : "Open Command Center"}

          <DirectionIcon size={17} />
        </Link>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
        <BrainCircuit
          className="mt-0.5 shrink-0 text-blue-600"
          size={20}
        />

        <p className="text-sm font-semibold leading-7 text-slate-700">
          {locale === "ar"
            ? "جميع الوحدات الأساسية مترابطة الآن: Corporate DNA ← Corporate Brain ← Digital Workforce ← AI Command Center."
            : "All core modules are connected: Corporate DNA → Corporate Brain → Digital Workforce → AI Command Center."}
        </p>
      </div>
    </section>
  );
}

