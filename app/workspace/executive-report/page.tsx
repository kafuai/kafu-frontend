"use client";

import Link from "next/link";
import { ArrowRight, Download, Printer, Share2 } from "lucide-react";

export default function ExecutiveReportPage() {
  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    const reportUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "KAFU AI Executive Report",
        text: "التقرير التنفيذي من KAFU AI",
        url: reportUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(reportUrl);
    alert("تم نسخ رابط التقرير");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 print:bg-white" dir="rtl">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <header className="border-b border-slate-200 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-600">
                KAFU AI Executive Report
              </p>

              <h1 className="mt-2 text-4xl font-black text-slate-950">
                التقرير التنفيذي
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                تقرير مختصر قابل للطباعة والمشاركة والتنزيل
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 print:hidden">
              <Link
                href="/workspace/dashboard"
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowRight size={18} />
                <span>العودة للوحة</span>
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                <Printer size={18} />
                <span>طباعة</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Share2 size={18} />
                <span>مشاركة</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                <Download size={18} />
                <span>تنزيل PDF</span>
              </button>
            </div>
          </div>
        </header>

        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              ملخص المؤشرات
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              هذا التقرير يعرض أهم مؤشرات الجاهزية، المخاطر، القرارات، وفرص
              التحسين بشكل قابل للطباعة والمشاركة.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 print:grid-cols-4">
            {[
              { label: "الجاهزية", value: "82%" },
              { label: "المخاطر", value: "3" },
              { label: "الفرص", value: "11" },
              { label: "AI", value: "96%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 print:bg-white"
              >
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-4xl font-black text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}