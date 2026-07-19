"use client";

import Link from "next/link";
import { Download, FileText, Printer, Share2 } from "lucide-react";

const actionClassName =
  "inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export default function DashboardHeader() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-6 text-right shadow-sm sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-emerald-100/40 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">
            Executive Command Center
          </p>

          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
            مركز القيادة التنفيذي
          </h1>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-[15px]">
            مؤشرات مختصرة، وقرارات تحتاج إلى المتابعة، وتنبيهات تنفيذية واضحة
            تساعد القيادة على الانتقال من الرؤية إلى الإجراء.
          </p>
        </div>

        <div
          dir="ltr"
          className="flex shrink-0 items-center gap-1 self-start rounded-2xl border border-slate-200 bg-slate-50/90 p-1 lg:self-center"
        >
          <Link
            href="/workspace/executive-report"
            title="فتح التقرير التنفيذي"
            aria-label="فتح التقرير التنفيذي"
            className={actionClassName}
          >
            <FileText size={18} strokeWidth={1.9} />
          </Link>

          <button
            type="button"
            title="طباعة التقرير"
            aria-label="طباعة التقرير"
            className={actionClassName}
          >
            <Printer size={18} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            title="مشاركة التقرير"
            aria-label="مشاركة التقرير"
            className={actionClassName}
          >
            <Share2 size={18} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            title="تنزيل التقرير بصيغة PDF"
            aria-label="تنزيل التقرير بصيغة PDF"
            className={actionClassName}
          >
            <Download size={18} strokeWidth={1.9} />
          </button>
        </div>
      </div>
    </section>
  );
}
