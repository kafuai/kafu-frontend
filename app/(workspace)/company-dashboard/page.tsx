"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  CircleAlert,
  Languages,
  LineChart,
  Target,
  TrendingUp,
  UsersRound,
  Workflow,
} from "lucide-react";
import { useState } from "react";

import {
  ExecutiveButton,
  StatusBadge,
} from "../../../src/product/executive-design-system";

type Language = "en" | "ar";

const content = {
  en: {
    languageLabel: "العربية",
    eyebrow: "Company Health",
    title: "Your organization is healthy.",
    subtitle:
      "Financial performance remains strong. The main constraint is execution speed across approvals and strategic initiatives.",
    scoreLabel: "Enterprise Health Score",
    scoreValue: "86",
    scoreStatus: "Healthy",
    dimensionsTitle: "Health Dimensions",
    dimensionsHelper:
      "A consolidated view of financial, commercial, operational, people, and AI readiness.",
    dimensions: [
      {
        title: "Financial Health",
        score: 92,
        status: "Excellent",
        insight:
          "Revenue, profitability, and cash position remain strong.",
        metric: "Cash runway: 14.6 months",
        icon: Banknote,
        tone: "success",
      },
      {
        title: "Commercial Health",
        score: 78,
        status: "Good",
        insight:
          "Pipeline remains healthy, but enterprise conversion has slowed.",
        metric: "Pipeline at risk: $2.8M",
        icon: TrendingUp,
        tone: "attention",
      },
      {
        title: "Operational Health",
        score: 74,
        status: "Needs Attention",
        insight:
          "Approval delays are reducing execution speed.",
        metric: "Average approval cycle: 11 days",
        icon: Workflow,
        tone: "critical",
      },
      {
        title: "People Health",
        score: 91,
        status: "Excellent",
        insight:
          "Engagement and productivity remain above target.",
        metric: "Engagement: 94%",
        icon: UsersRound,
        tone: "success",
      },
      {
        title: "AI Readiness",
        score: 88,
        status: "Strong",
        insight:
          "Data quality and AI adoption support further automation.",
        metric: "AI adoption: 81%",
        icon: BrainCircuit,
        tone: "good",
      },
    ],
    timelineTitle: "Executive Health Timeline",
    timelineHelper: "Last 30 days",
    timelineValues: [72, 75, 78, 80, 82, 84, 86],
    timelineLabels: ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Today"],
    summaryTitle: "Executive Summary",
    summaries: [
      {
        title: "What’s Going Well",
        text:
          "Revenue is above the previous quarter, cash remains stable, and employee engagement is strong.",
        tone: "success",
        icon: CheckCircle2,
      },
      {
        title: "Needs Attention",
        text:
          "Approval cycles and delayed strategic initiatives are limiting growth.",
        tone: "attention",
        icon: CircleAlert,
      },
      {
        title: "Recommended Executive Action",
        text:
          "Automate proposal approvals and assign one executive owner to delayed initiatives.",
        tone: "good",
        icon: Target,
      },
    ],
    aiTitle: "KAFU AI Recommendation",
    aiText:
      "Reducing manual approval steps can lower the average cycle from 11 days to about 7 days, improving sales velocity and forecast confidence.",
    aiConfidence: "AI confidence: 96%",
    impactLabel: "Estimated Impact",
    impactValue: "+12%",
    impactText: "Revenue velocity",
    primaryAction: "Analyze Root Causes",
    secondaryAction: "Back to Executive Briefing",
    nextHref: "/corporate-brain",
    backHref: "/executive-summary",
  },
  ar: {
    languageLabel: "English",
    eyebrow: "صحة المؤسسة",
    title: "مؤسستك في وضع صحي جيد.",
    subtitle:
      "لا يزال الأداء المالي قويًا، بينما يتمثل التحدي الرئيسي في سرعة تنفيذ الاعتمادات والمبادرات الاستراتيجية.",
    scoreLabel: "مؤشر صحة المؤسسة",
    scoreValue: "86",
    scoreStatus: "جيدة",
    dimensionsTitle: "أبعاد صحة المؤسسة",
    dimensionsHelper:
      "رؤية موحدة للصحة المالية والتجارية والتشغيلية ورأس المال البشري والجاهزية للذكاء الاصطناعي.",
    dimensions: [
      {
        title: "الصحة المالية",
        score: 92,
        status: "ممتازة",
        insight:
          "لا تزال الإيرادات والربحية والسيولة النقدية في وضع قوي.",
        metric: "مدة التغطية النقدية: 14.6 شهرًا",
        icon: Banknote,
        tone: "success",
      },
      {
        title: "الصحة التجارية",
        score: 78,
        status: "جيدة",
        insight:
          "مسار الفرص صحي، لكن تحويل فرص قطاع المؤسسات تباطأ.",
        metric: "فرص معرضة للخطر: 2.8 مليون دولار",
        icon: TrendingUp,
        tone: "attention",
      },
      {
        title: "الصحة التشغيلية",
        score: 74,
        status: "تحتاج إلى اهتمام",
        insight:
          "تأخر الاعتمادات يحد من سرعة التنفيذ.",
        metric: "متوسط دورة الاعتماد: 11 يومًا",
        icon: Workflow,
        tone: "critical",
      },
      {
        title: "صحة رأس المال البشري",
        score: 91,
        status: "ممتازة",
        insight:
          "مستويات التفاعل والإنتاجية أعلى من المستهدف.",
        metric: "التفاعل الوظيفي: 94%",
        icon: UsersRound,
        tone: "success",
      },
      {
        title: "الجاهزية للذكاء الاصطناعي",
        score: 88,
        status: "قوية",
        insight:
          "جودة البيانات ومستوى التبني يدعمان المزيد من الأتمتة.",
        metric: "نسبة تبني الذكاء الاصطناعي: 81%",
        icon: BrainCircuit,
        tone: "good",
      },
    ],
    timelineTitle: "المسار الزمني لصحة المؤسسة",
    timelineHelper: "آخر 30 يومًا",
    timelineValues: [72, 75, 78, 80, 82, 84, 86],
    timelineLabels: [
      "اليوم 1",
      "اليوم 5",
      "اليوم 10",
      "اليوم 15",
      "اليوم 20",
      "اليوم 25",
      "اليوم",
    ],
    summaryTitle: "الملخص التنفيذي",
    summaries: [
      {
        title: "ما يسير بشكل جيد",
        text:
          "الإيرادات أعلى من الربع السابق، والسيولة مستقرة، وتفاعل الموظفين قوي.",
        tone: "success",
        icon: CheckCircle2,
      },
      {
        title: "ما يحتاج إلى اهتمام",
        text:
          "دورات الاعتماد وتأخر المبادرات الاستراتيجية يحدان من النمو.",
        tone: "attention",
        icon: CircleAlert,
      },
      {
        title: "الإجراء التنفيذي المقترح",
        text:
          "أتمتة اعتماد العروض وتعيين مسؤول تنفيذي واحد للمبادرات المتأخرة.",
        tone: "good",
        icon: Target,
      },
    ],
    aiTitle: "توصية KAFU AI",
    aiText:
      "يمكن لتقليل خطوات الاعتماد اليدوية خفض متوسط الدورة من 11 يومًا إلى نحو 7 أيام، مما يحسن سرعة المبيعات ودقة التوقعات.",
    aiConfidence: "درجة ثقة التحليل: 96%",
    impactLabel: "الأثر المتوقع",
    impactValue: "+12%",
    impactText: "في سرعة الإيرادات",
    primaryAction: "تحليل الأسباب الجذرية",
    secondaryAction: "العودة إلى الإحاطة التنفيذية",
    nextHref: "/corporate-brain",
    backHref: "/executive-summary",
  },
} as const;

const toneClasses = {
  success: {
    bar: "bg-emerald-500",
    icon: "bg-emerald-100 text-emerald-700",
    text: "text-emerald-700",
    surface: "border-emerald-200/80 bg-emerald-50/45",
  },
  attention: {
    bar: "bg-amber-500",
    icon: "bg-amber-100 text-amber-700",
    text: "text-amber-700",
    surface: "border-amber-200/80 bg-amber-50/45",
  },
  critical: {
    bar: "bg-rose-500",
    icon: "bg-rose-100 text-rose-700",
    text: "text-rose-700",
    surface: "border-rose-200/80 bg-rose-50/45",
  },
  good: {
    bar: "bg-blue-500",
    icon: "bg-blue-100 text-blue-700",
    text: "text-blue-700",
    surface: "border-blue-200/80 bg-blue-50/45",
  },
} as const;

export default function CompanyDashboardPage() {
  const [language, setLanguage] = useState<Language>("ar");

  const copy = content[language];
  const isArabic = language === "ar";
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[var(--background)] text-[var(--text-primary)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand-primary)_5%,transparent),transparent_34%)]"
      />

      <section className="relative mx-auto max-w-[1580px] space-y-5 px-5 py-5 md:px-7 lg:px-8">

        <section className="relative overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 end-0 w-1 bg-[var(--brand-primary)]" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-24 -top-28 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_6%,transparent)]"
          />

          <div className="relative grid items-center gap-5 px-6 py-6 md:px-7 lg:grid-cols-[minmax(0,1fr)_250px] lg:px-8">
            <div className="min-w-0">
              <StatusBadge
                status="healthy"
                label={copy.eyebrow}
                className="border-[color-mix(in_srgb,var(--success)_18%,var(--border-default))] bg-[var(--success-background)] px-3 py-1.5 text-[11px] tracking-wide text-[var(--success)]"
              />

              <div className="mt-4 flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--text-primary)] text-[var(--surface)] shadow-[var(--shadow-medium)]">
                  <Building2 className="h-6 w-6" />
                </span>

                <div className="min-w-0">
                  <h1 className="max-w-4xl text-[2rem] font-black leading-tight tracking-[-0.035em] text-[var(--text-primary)] md:text-[2.35rem]">
                    {copy.title}
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                    {copy.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <article className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {copy.scoreLabel}
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-[2.75rem] font-black tracking-[-0.04em] text-[var(--text-primary)]">
                  {copy.scoreValue}
                </span>

                <span className="pb-1.5 text-sm text-[var(--text-muted)]">
                  / 100
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                <div className="h-full w-[86%] rounded-full bg-[var(--success)]" />
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm font-black text-[var(--success)]">
                <CheckCircle2 className="h-4 w-4" />
                {copy.scoreStatus}
              </div>
            </article>
          </div>

          <div className="grid border-t border-[var(--border-default)] sm:grid-cols-3">
            <div className="flex items-center gap-3 border-b border-[var(--border-default)] px-5 py-3.5 sm:border-b-0 sm:border-e">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Banknote className="h-[17px] w-[17px]" />
              </span>

              <div>
                <p className="text-lg font-black text-[var(--text-primary)]">
                  92
                </p>

                <p className="text-xs font-semibold text-[var(--text-muted)]">
                  {copy.dimensions[0].title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-[var(--border-default)] px-5 py-3.5 sm:border-b-0 sm:border-e">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <UsersRound className="h-[17px] w-[17px]" />
              </span>

              <div>
                <p className="text-lg font-black text-[var(--text-primary)]">
                  91
                </p>

                <p className="text-xs font-semibold text-[var(--text-muted)]">
                  {copy.dimensions[3].title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <BrainCircuit className="h-[17px] w-[17px]" />
              </span>

              <div>
                <p className="text-lg font-black text-[var(--text-primary)]">
                  88
                </p>

                <p className="text-xs font-semibold text-[var(--text-muted)]">
                  {copy.dimensions[4].title}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />

                <h2 className="text-lg font-extrabold tracking-[-0.015em] text-slate-950">
                  {copy.dimensionsTitle}
                </h2>
              </div>

              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
                {copy.dimensionsHelper}
              </p>
            </div>
          </div>

          <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {copy.dimensions.map((dimension) => {
              const Icon = dimension.icon;
              const tone = toneClasses[dimension.tone];

              return (
                <article
                  key={dimension.title}
                  className="group flex h-full min-h-[205px] flex-col rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.icon}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`text-xs font-semibold ${tone.text}`}
                    >
                      {dimension.status}
                    </span>
                  </div>

                  <h3 className="mt-3 min-h-10 text-[15px] font-extrabold leading-5.5 text-[var(--text-primary)]">
                    {dimension.title}
                  </h3>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-[1.8rem] font-extrabold tracking-[-0.035em] text-slate-950">
                      {dimension.score}
                    </span>

                    <span className="pb-1 text-xs text-slate-500">
                      / 100
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${tone.bar}`}
                      style={{ width: `${dimension.score}%` }}
                    />
                  </div>

                  <p className="mt-2.5 flex-1 text-sm leading-5.5 text-[var(--text-secondary)]">
                    {dimension.insight}
                  </p>

                  <p className="mt-4 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
                    {dimension.metric}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid items-stretch gap-3 xl:grid-cols-[1.45fr_0.55fr]">
          <article className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <LineChart className="h-5 w-5 text-blue-600" />

                <h2 className="text-lg font-black text-slate-950">
                  {copy.timelineTitle}
                </h2>
              </div>

              <span className="text-xs text-slate-500">
                {copy.timelineHelper}
              </span>
            </div>

            <div className="mt-5 flex h-36 items-end gap-2 sm:gap-3">
              {copy.timelineValues.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="flex h-full flex-1 flex-col justify-end gap-3"
                >
                  <div className="flex flex-1 items-end">
                    <div
                      className="relative w-full rounded-t-lg border border-blue-300/20 bg-gradient-to-t from-blue-600 to-blue-400 transition hover:from-blue-500 hover:to-blue-300"
                      style={{ height: `${value}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] font-black text-slate-500">
                        {value}
                      </span>
                    </div>
                  </div>

                  <span className="truncate text-center text-[10px] text-slate-500 sm:text-xs">
                    {copy.timelineLabels[index]}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="flex h-full flex-col rounded-[18px] border border-[color-mix(in_srgb,var(--brand-primary)_18%,var(--border-default))] bg-[var(--brand-subtle)] p-5 shadow-[var(--shadow-small)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Bot className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-black text-slate-950">
                {copy.aiTitle}
              </h2>
            </div>

            <p className="mt-4 flex-1 text-sm leading-6.5 text-slate-600">
              {copy.aiText}
            </p>

            <div className="mt-4 text-xs font-black text-blue-700">
              {copy.aiConfidence}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                {copy.impactLabel}
              </p>

              <div className="mt-2 flex items-end gap-3">
                <span className="text-4xl font-black tracking-tight text-emerald-600">
                  {copy.impactValue}
                </span>

                <span className="pb-1 text-sm text-slate-600">
                  {copy.impactText}
                </span>
              </div>
            </div>

            <Link href={copy.nextHref} className="mt-6">
              <ExecutiveButton
                size="large"
                rightIcon={
                  <DirectionIcon className="h-5 w-5" />
                }
                className="w-full border-0 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_12px_30px_rgba(37,99,235,0.22)] hover:from-blue-500 hover:to-cyan-400"
              >
                {copy.primaryAction}
              </ExecutiveButton>
            </Link>
          </article>
        </section>

        <section className="mt-5">
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-black text-slate-950">
              {copy.summaryTitle}
            </h2>
          </div>

          <div className="grid items-stretch gap-3 lg:grid-cols-3">
            {copy.summaries.map((item) => {
              const Icon = item.icon;
              const tone = toneClasses[item.tone];

              return (
                <article
                  key={item.title}
                  className={`flex h-full flex-col rounded-[18px] border p-4 shadow-[var(--shadow-small)] ${tone.surface}`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-base font-extrabold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 flex-1 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="mt-5 flex flex-col gap-3 border-t border-[var(--border-default)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={copy.backHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
          >
            {isArabic ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}

            {copy.secondaryAction}
          </Link>

          <p className="text-xs text-slate-600">
            KAFU AI · Enterprise Operating Intelligence
          </p>
        </footer>
      </section>
    </main>
  );
}
