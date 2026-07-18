"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Printer,
  Share2,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";

const executiveMetrics = [
  {
    label: "الجاهزية العامة",
    value: "82%",
    note: "جاهزية مرتفعة",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "المخاطر النشطة",
    value: "3",
    note: "تحتاج متابعة",
    tone: "bg-rose-50 text-rose-700",
  },
  {
    label: "فرص التحسين",
    value: "11",
    note: "فرص قابلة للتنفيذ",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    label: "ثقة KAFU AI",
    value: "96%",
    note: "تحليل موثوق",
    tone: "bg-violet-50 text-violet-700",
  },
];

const priorities = [
  {
    title: "تسريع دورة الموافقات",
    description:
      "تقليل الوقت بين رفع الطلب واعتماده من خلال مسار موافقات تنفيذي واضح.",
    impact: "أثر مرتفع",
  },
  {
    title: "توحيد بيانات الموظفين",
    description:
      "اعتماد مصدر بيانات مركزي يرفع دقة التقارير ويقلل المعالجة اليدوية.",
    impact: "أثر متوسط",
  },
  {
    title: "تفعيل التقرير التنفيذي الأسبوعي",
    description:
      "توفير ملخص دوري للإدارة يعرض القرارات والمخاطر وفرص التحسين.",
    impact: "Quick Win",
  },
];

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
    <main
      className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 lg:py-10 print:bg-white print:p-0"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <header className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-12 lg:py-12 print:bg-white print:px-0 print:py-8 print:text-slate-950">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl print:hidden" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl print:hidden" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 print:bg-slate-100">
                  <Sparkles
                    size={22}
                    className="text-emerald-400 print:text-emerald-600"
                  />
                </span>

                <div>
                  <p className="text-sm font-black text-emerald-400 print:text-emerald-600">
                    KAFU AI Executive Report
                  </p>

                  <p className="mt-1 text-xs text-slate-400 print:text-slate-500">
                    تقرير الإدارة التنفيذية
                  </p>
                </div>
              </div>

              <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl">
                التقرير التنفيذي للشركة
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base print:text-slate-600">
                قراءة تنفيذية مختصرة تلخص مستوى الجاهزية، المخاطر، القرارات
                ذات الأولوية، وفرص التحسين المقترحة بواسطة KAFU AI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 print:hidden">
              <Link
                href="/workspace/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                <ArrowRight size={18} />
                العودة للوحة
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                <Printer size={18} />
                طباعة
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                <Share2 size={18} />
                مشاركة
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400"
              >
                <Download size={18} />
                تنزيل PDF
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-10 px-6 py-8 sm:px-10 lg:px-12 lg:py-12 print:px-0 print:py-8">
          <section>
            <div>
              <p className="text-sm font-black text-emerald-600">
                Executive Snapshot
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                ملخص المؤشرات الرئيسية
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                نظرة موحدة على أهم الأرقام التي يحتاجها صانع القرار قبل
                الانتقال إلى الخطوات التنفيذية التالية.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
              {executiveMetrics.map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 print:bg-white"
                >
                  <p className="text-sm font-bold text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                    {item.value}
                  </p>

                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black ${item.tone}`}
                  >
                    {item.note}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 lg:col-span-7 print:bg-white">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={24} />
                </span>

                <div>
                  <p className="text-sm font-black text-emerald-600">
                    Executive Summary
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    الشركة تتحرك باتجاه جاهزية تشغيلية أعلى
                  </h2>
                </div>
              </div>

              <p className="mt-6 text-sm leading-8 text-slate-600">
                تظهر المؤشرات الحالية تقدمًا واضحًا في جاهزية الموارد البشرية
                وجودة تجربة الموظف، مع مستوى مرتفع من الثقة في التحليل
                التنفيذي. وتتمثل الأولوية الرئيسية في تسريع الموافقات وتقليل
                الاعتماد على الإجراءات اليدوية.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-xs font-bold text-slate-400">
                    الوضع العام
                  </p>
                  <p className="mt-2 font-black text-emerald-700">مستقر</p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="text-xs font-bold text-slate-400">
                    اتجاه الأداء
                  </p>
                  <p className="mt-2 font-black text-sky-700">صاعد</p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="text-xs font-bold text-slate-400">
                    مستوى التدخل
                  </p>
                  <p className="mt-2 font-black text-amber-700">متوسط</p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] bg-slate-950 p-7 text-white lg:col-span-5 print:border print:border-slate-200 print:bg-white print:text-slate-950">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 print:bg-rose-50 print:text-rose-600">
                  <TriangleAlert size={24} />
                </span>

                <div>
                  <p className="text-sm font-black text-rose-400 print:text-rose-600">
                    Risk Overview
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    أهم المخاطر الحالية
                  </h2>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {[
                  "بطء دورة الموافقات التنفيذية",
                  "الاعتماد على المعالجة اليدوية",
                  "تشتت بيانات الموظفين",
                ].map((risk, index) => (
                  <div
                    key={risk}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4 print:bg-slate-50"
                  >
                    <span className="text-sm font-bold">{risk}</span>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-rose-300 print:bg-rose-50 print:text-rose-600">
                      {index === 0 ? "مرتفع" : "متوسط"}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Target size={24} />
              </span>

              <div>
                <p className="text-sm font-black text-sky-600">
                  Recommended Priorities
                </p>

                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  الأولويات التنفيذية المقترحة
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-5 lg:grid-cols-3">
              {priorities.map((priority, index) => (
                <article
                  key={priority.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                      {index + 1}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {priority.impact}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-950">
                    {priority.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {priority.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <footer className="flex flex-col gap-4 border-t border-slate-200 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>تم إنشاء هذا التقرير بواسطة KAFU AI.</p>

            <p className="font-bold text-slate-700">
              Executive Intelligence Platform
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}