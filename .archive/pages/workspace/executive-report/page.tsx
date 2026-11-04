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
  TrendingUp,
} from "lucide-react";

const executiveMetrics = [
  {
    label: "الجاهزية العامة",
    value: "82%",
    note: "جاهزية مرتفعة",
    tone: "bg-[var(--success-background)] text-[var(--success)]",
    indicator: "bg-[var(--success)]",
  },
  {
    label: "المخاطر النشطة",
    value: "3",
    note: "تحتاج متابعة",
    tone: "bg-[var(--critical-background)] text-[var(--critical)]",
    indicator: "bg-[var(--critical)]",
  },
  {
    label: "فرص التحسين",
    value: "11",
    note: "قابلة للتنفيذ",
    tone: "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    indicator: "bg-[var(--brand-primary)]",
  },
  {
    label: "ثقة KAFU AI",
    value: "96%",
    note: "تحليل موثوق",
    tone: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
    indicator: "bg-[var(--text-muted)]",
  },
];

const priorities = [
  {
    title: "تسريع دورة الموافقات",
    description:
      "تقليل الوقت بين رفع الطلب واعتماده من خلال مسار تنفيذي واضح، مع تحديد المسؤوليات ومراحل التصعيد ومواعيد الاستجابة.",
    impact: "أثر مرتفع",
  },
  {
    title: "توحيد بيانات الموظفين",
    description:
      "اعتماد مصدر بيانات مركزي يرفع دقة التقارير ويقلل الاعتماد على المعالجة اليدوية المتكررة بين الإدارات.",
    impact: "أثر متوسط",
  },
  {
    title: "تفعيل التقرير التنفيذي الأسبوعي",
    description:
      "توفير ملخص دوري للإدارة يعرض القرارات والمخاطر وفرص التحسين والإجراءات ذات الأولوية بصورة موحدة.",
    impact: "إنجاز سريع",
  },
];

const risks = [
  {
    title: "بطء دورة الموافقات التنفيذية",
    level: "مرتفع",
  },
  {
    title: "الاعتماد على المعالجة اليدوية",
    level: "متوسط",
  },
  {
    title: "تشتت بيانات الموظفين",
    level: "متوسط",
  },
];

export default function ExecutiveReportPage() {
  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    const reportUrl = window.location.href;

    try {
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
    } catch {
      // تم إلغاء المشاركة أو تعذر الوصول إلى الحافظة.
    }
  }

  return (
    <main
      className="min-h-screen bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8 lg:py-6 print:bg-white print:p-0"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)] print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <header className="border-b border-[var(--border-default)] bg-[var(--surface)] px-6 py-4 sm:px-8 lg:px-10 lg:py-5 print:px-0 print:py-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
            <div className="min-w-0 max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                  <Sparkles size={19} strokeWidth={1.9} />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[var(--brand-primary)]">
                    KAFU AI Executive Report
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-[var(--text-muted)]">
                    منصة الذكاء التنفيذي المؤسسي
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl">
                  التقرير التنفيذي للشركة
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                  قراءة تنفيذية مركزة توضح مستوى الجاهزية، والمخاطر الحالية،
                  والقرارات ذات الأولوية، وفرص التحسين المقترحة بواسطة KAFU AI.
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                  حالة المؤسسة مستقرة
                </span>

                <span className="inline-flex rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)]">
                  آخر تحديث: اليوم
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 print:hidden xl:flex-nowrap xl:justify-end xl:pt-1">
              <Link
                href="/workspace/dashboard"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-3.5 text-sm font-extrabold text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              >
                <ArrowRight aria-hidden="true" size={16} />
                العودة للوحة
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-3.5 text-sm font-extrabold text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              >
                <Printer aria-hidden="true" size={16} />
                طباعة
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-3.5 text-sm font-extrabold text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              >
                <Share2 aria-hidden="true" size={16} />
                مشاركة
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-xl border border-[var(--brand-primary)] bg-[var(--brand-primary)] px-3.5 text-sm font-extrabold text-white shadow-[var(--shadow-small)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              >
                <Download aria-hidden="true" size={16} />
                حفظ PDF
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-5 px-6 py-5 sm:px-8 lg:px-10 lg:py-6 print:px-0 print:py-6">
          <section>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-primary)]">
                  Executive Snapshot
                </p>

                <h2 className="mt-1.5 text-2xl font-black text-[var(--text-primary)]">
                  ملخص المؤشرات الرئيسية
                </h2>

                <p className="mt-1.5 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                  أهم المؤشرات التي يحتاجها صانع القرار لفهم الوضع الحالي قبل
                  الانتقال إلى الإجراءات التنفيذية.
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)]">
                بيانات تنفيذية موحدة
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4">
              {executiveMetrics.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)] print:bg-white print:shadow-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                      {item.label}
                    </p>

                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.indicator}`}
                    />
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-5xl font-black tracking-tight text-[var(--text-primary)]">
                      {item.value}
                    </p>

                    <TrendingUp
                      size={18}
                      className="mb-1 text-[var(--text-muted)]"
                    />
                  </div>

                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black ${item.tone}`}
                  >
                    {item.note}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-12">
            <article className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-6 lg:col-span-7 print:bg-white">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-background)] text-[var(--success)]">
                  <CheckCircle2 size={21} />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--success)]">
                    Executive Summary
                  </p>

                  <h2 className="mt-1.5 text-2xl font-black leading-snug text-[var(--text-primary)]">
                    الشركة تتحرك باتجاه جاهزية تشغيلية أعلى
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
                تظهر المؤشرات الحالية تقدمًا واضحًا في جاهزية الموارد البشرية
                وجودة تجربة الموظف، مع مستوى مرتفع من الثقة في التحليل التنفيذي.
                وتتمثل الأولوية الرئيسية في تسريع الموافقات وتقليل الاعتماد على
                الإجراءات اليدوية.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-bold text-[var(--text-muted)]">
                    الوضع العام
                  </p>
                  <p className="mt-2 font-black text-[var(--success)]">مستقر</p>
                </div>

                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-bold text-[var(--text-muted)]">
                    اتجاه الأداء
                  </p>
                  <p className="mt-2 font-black text-[var(--brand-primary)]">
                    صاعد
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-bold text-[var(--text-muted)]">
                    مستوى التدخل
                  </p>
                  <p className="mt-2 font-black text-[var(--warning)]">متوسط</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] lg:col-span-5 print:bg-white print:shadow-none">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--critical-background)] text-[var(--critical)]">
                  <TriangleAlert size={21} />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--critical)]">
                    Risk Overview
                  </p>

                  <h2 className="mt-1.5 text-2xl font-black text-[var(--text-primary)]">
                    أهم المخاطر الحالية
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {risks.map((risk, index) => (
                  <div
                    key={risk.title}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-xs font-black text-[var(--text-muted)]">
                        {index + 1}
                      </span>

                      <span className="text-sm font-bold leading-6 text-[var(--text-secondary)]">
                        {risk.title}
                      </span>
                    </div>

                    <span
                      className={
                        risk.level === "مرتفع"
                          ? "shrink-0 rounded-full bg-[var(--critical-background)] px-3 py-1 text-xs font-black text-[var(--critical)]"
                          : "shrink-0 rounded-full bg-[var(--warning-background)] px-3 py-1 text-xs font-black text-[var(--warning)]"
                      }
                    >
                      {risk.level}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Target size={21} />
              </span>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                  Recommended Priorities
                </p>

                <h2 className="mt-1.5 text-2xl font-black text-[var(--text-primary)]">
                  الأولويات التنفيذية المقترحة
                </h2>

                <p className="mt-1.5 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                  إجراءات عملية مرتبة حسب الأولوية والأثر المتوقع على الأداء
                  المؤسسي.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {priorities.map((priority, index) => (
                <article
                  key={priority.title}
                  className="flex min-h-full flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)] print:shadow-none"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-subtle)] text-sm font-black text-[var(--brand-primary)]">
                      {index + 1}
                    </span>

                    <span className="rounded-full bg-[var(--success-background)] px-3 py-1 text-xs font-black text-[var(--success)]">
                      {priority.impact}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black leading-snug text-[var(--text-primary)]">
                    {priority.title}
                  </h3>

                  <p className="mt-2.5 flex-1 text-sm leading-7 text-[var(--text-secondary)]">
                    {priority.description}
                  </p>

                  <div className="mt-4 border-t border-[var(--border-default)] pt-3.5">
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                      أولوية تنفيذية رقم {index + 1}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <footer className="flex flex-col gap-2 border-t border-[var(--border-default)] pt-5 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>تم إنشاء هذا التقرير بواسطة KAFU AI.</p>

            <p className="font-bold text-[var(--text-secondary)]">
              Executive Intelligence Platform
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}