"use client";

import Link from "next/link";
import { FileText, Share2, Printer, Download } from "lucide-react";

export default function DashboardHeader() {
  return (
    <section className="relative rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
      <div
        style={{ direction: "ltr", left: "48px", top: "48px" }}
        className="absolute flex items-center gap-4"
      >
        <Link
          href="/workspace/executive-report"
          title="التقرير التنفيذي"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <FileText size={22} strokeWidth={2} />
        </Link>

        <button
          type="button"
          title="طباعة التقرير"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <Printer size={22} strokeWidth={2} />
        </button>

        <button
          type="button"
          title="مشاركة التقرير"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <Share2 size={22} strokeWidth={2} />
        </button>

        <button
          type="button"
          title="تنزيل PDF"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <Download size={22} strokeWidth={2} />
        </button>
      </div>

      <div className="flex min-h-[240px] items-center justify-end">
        <div dir="rtl" className="max-w-[760px] text-right">
          <h1 className="text-5xl font-black tracking-tight text-slate-950">
            مركز القيادة التنفيذي
          </h1>

          <p className="mt-5 text-lg leading-9 text-slate-600">
            مؤشرات مختصرة، قرارات تحتاج متابعة، وتنبيهات تنفيذية واضحة.
          </p>
        </div>
      </div>
    </section>
  );
}