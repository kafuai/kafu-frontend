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
  Sparkles,
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
    dimensions: [
      { title: "Financial Health", score: 92, status: "Excellent", insight: "Revenue, profitability, and cash position remain strong.", metric: "Cash runway: 14.6 months", icon: Banknote, tone: "success" },
      { title: "Commercial Health", score: 78, status: "Good", insight: "Pipeline remains healthy, but enterprise conversion has slowed.", metric: "Pipeline at risk: $2.8M", icon: TrendingUp, tone: "attention" },
      { title: "Operational Health", score: 74, status: "Needs Attention", insight: "Approval delays are reducing execution speed.", metric: "Average approval cycle: 11 days", icon: Workflow, tone: "critical" },
      { title: "People Health", score: 91, status: "Excellent", insight: "Engagement and productivity remain above target.", metric: "Engagement: 94%", icon: UsersRound, tone: "success" },
      { title: "AI Readiness", score: 88, status: "Strong", insight: "Data quality and AI adoption support further automation.", metric: "AI adoption: 81%", icon: BrainCircuit, tone: "good" },
    ],
    timelineTitle: "Executive Health Timeline",
    timelineHelper: "Last 30 days",
    timelineValues: [72, 75, 78, 80, 82, 84, 86],
    summaryTitle: "Executive Summary",
    summaries: [
      { title: "What’s Going Well", text: "Revenue is above the previous quarter, cash remains stable, and employee engagement is strong.", tone: "success", icon: CheckCircle2 },
      { title: "Needs Attention", text: "Approval cycles and delayed strategic initiatives are limiting growth.", tone: "attention", icon: CircleAlert },
      { title: "Recommended Executive Action", text: "Automate proposal approvals and assign one executive owner to delayed initiatives.", tone: "good", icon: Target },
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
      "لا يزال الأداء المالي قويًا، بينما يتمثل العائق الرئيسي في سرعة التنفيذ ضمن الاعتمادات والمبادرات الاستراتيجية.",
    scoreLabel: "مؤشر صحة المؤسسة",
    scoreValue: "86",
    scoreStatus: "جيدة",
    dimensionsTitle: "أبعاد صحة المؤسسة",
    dimensions: [
      { title: "الصحة المالية", score: 92, status: "ممتازة", insight: "الإيرادات والربحية والوضع النقدي لا تزال قوية.", metric: "المدة التشغيلية النقدية: 14.6 شهرًا", icon: Banknote, tone: "success" },
      { title: "الصحة التجارية", score: 78, status: "جيدة", insight: "مسار الفرص صحي، لكن تحويل قطاع الشركات تباطأ.", metric: "فرص معرضة للخطر: 2.8 مليون دولار", icon: TrendingUp, tone: "attention" },
      { title: "الصحة التشغيلية", score: 74, status: "تحتاج اهتمامًا", insight: "تأخر الاعتمادات يحد من سرعة التنفيذ.", metric: "متوسط دورة الاعتماد: 11 يومًا", icon: Workflow, tone: "critical" },
      { title: "صحة رأس المال البشري", score: 91, status: "ممتازة", insight: "مستويات التفاعل والإنتاجية أعلى من المستهدف.", metric: "التفاعل الوظيفي: 94%", icon: UsersRound, tone: "success" },
      { title: "الجاهزية للذكاء الاصطناعي", score: 88, status: "قوية", insight: "جودة البيانات والتبني يدعمان مزيدًا من الأتمتة.", metric: "نسبة التبني: 81%", icon: BrainCircuit, tone: "good" },
    ],
    timelineTitle: "المسار الزمني لصحة المؤسسة",
    timelineHelper: "آخر 30 يومًا",
    timelineValues: [72, 75, 78, 80, 82, 84, 86],
    summaryTitle: "الملخص التنفيذي",
    summaries: [
      { title: "ما يسير بشكل جيد", text: "الإيرادات أعلى من الربع السابق، والوضع النقدي مستقر، وتفاعل الموظفين قوي.", tone: "success", icon: CheckCircle2 },
      { title: "ما يحتاج إلى اهتمام", text: "دورات الاعتماد وتأخر المبادرات الاستراتيجية يحدان من النمو.", tone: "attention", icon: CircleAlert },
      { title: "الإجراء التنفيذي المقترح", text: "أتمتة اعتماد العروض وتحديد مسؤول تنفيذي واحد للمبادرات المتأخرة.", tone: "good", icon: Target },
    ],
    aiTitle: "توصية KAFU AI",
    aiText:
      "خفض خطوات الاعتماد اليدوية يمكن أن يقلل متوسط الدورة من 11 يومًا إلى نحو 7 أيام، ويحسن سرعة المبيعات ودقة التوقعات.",
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
  success: { bar: "bg-emerald-400", icon: "bg-emerald-500/10 text-emerald-300", text: "text-emerald-300", border: "border-emerald-400/15 bg-emerald-400/[0.06]" },
  attention: { bar: "bg-amber-400", icon: "bg-amber-500/10 text-amber-300", text: "text-amber-300", border: "border-amber-400/15 bg-amber-400/[0.06]" },
  critical: { bar: "bg-red-400", icon: "bg-red-500/10 text-red-300", text: "text-red-300", border: "border-red-400/15 bg-red-400/[0.06]" },
  good: { bar: "bg-blue-400", icon: "bg-blue-500/10 text-blue-300", text: "text-blue-300", border: "border-blue-400/15 bg-blue-400/[0.06]" },
} as const;

export default function CompanyDashboardPage() {
  const [language, setLanguage] = useState<Language>("en");
  const copy = content[language];
  const isArabic = language === "ar";
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="relative min-h-screen overflow-hidden bg-[#06101f] text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.09),transparent_30%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/welcome" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,0.22)]">
              <Sparkles className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.20em]">KAFU AI</p>
              <p className="text-xs text-slate-400">Enterprise Operating Intelligence</p>
            </div>
          </Link>

          <ExecutiveButton variant="ghost" size="small" onClick={() => setLanguage((current) => (current === "en" ? "ar" : "en"))} leftIcon={<Languages className="h-4 w-4" />} className="border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white">
            {copy.languageLabel}
          </ExecutiveButton>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <StatusBadge status="healthy" label={copy.eyebrow} className="border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] tracking-wide text-emerald-200" />
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">{copy.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{copy.subtitle}</p>
          </div>

          <div className="min-w-72 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.07] p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300/70">{copy.scoreLabel}</p>
            <div className="mt-3 flex items-end gap-2"><span className="text-5xl font-bold">{copy.scoreValue}</span><span className="pb-1 text-xl text-slate-500">/ 100</span></div>
            <div className="mt-4 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /><span className="text-sm font-semibold text-emerald-300">{copy.scoreStatus}</span></div>
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3"><Building2 className="h-5 w-5 text-blue-300" /><h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">{copy.dimensionsTitle}</h2></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {copy.dimensions.map((dimension) => {
              const Icon = dimension.icon;
              const tone = toneClasses[dimension.tone];
              return (
                <article key={dimension.title} className="rounded-3xl border border-white/[0.08] bg-white/[0.045] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.07]">
                  <div className="flex items-start justify-between gap-4"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.icon}`}><Icon className="h-5 w-5" /></div><span className={`text-sm font-semibold ${tone.text}`}>{dimension.status}</span></div>
                  <h3 className="mt-5 text-lg font-semibold">{dimension.title}</h3>
                  <div className="mt-4 flex items-end gap-2"><span className="text-3xl font-bold">{dimension.score}</span><span className="pb-1 text-sm text-slate-600">/100</span></div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${dimension.score}%` }} /></div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{dimension.insight}</p>
                  <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs text-slate-500">{dimension.metric}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-3xl border border-white/[0.08] bg-white/[0.045] p-6 backdrop-blur sm:p-8">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><LineChart className="h-5 w-5 text-blue-300" /><h2 className="text-lg font-semibold">{copy.timelineTitle}</h2></div><span className="text-xs text-slate-500">{copy.timelineHelper}</span></div>
            <div className="mt-8 flex h-48 items-end gap-3">
              {copy.timelineValues.map((value, index) => <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-3"><span className="text-xs font-semibold text-slate-500">{value}</span><div className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 opacity-80 transition hover:opacity-100" style={{ height: `${value}%` }} /></div>)}
            </div>
          </article>

          <article className="rounded-3xl border border-blue-400/15 bg-blue-500/[0.07] p-6 backdrop-blur sm:p-8">
            <div className="flex items-center gap-3"><Bot className="h-5 w-5 text-blue-300" /><h2 className="text-lg font-semibold">{copy.aiTitle}</h2></div>
            <p className="mt-5 text-sm leading-7 text-slate-300">{copy.aiText}</p>
            <div className="mt-5 text-xs text-blue-300">{copy.aiConfidence}</div>
            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-black/10 p-5"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">{copy.impactLabel}</p><div className="mt-2 flex items-end gap-3"><span className="text-4xl font-bold text-emerald-300">{copy.impactValue}</span><span className="pb-1 text-sm text-slate-400">{copy.impactText}</span></div></div>
          </article>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3"><Activity className="h-5 w-5 text-blue-300" /><h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">{copy.summaryTitle}</h2></div>
          <div className="grid gap-4 lg:grid-cols-3">
            {copy.summaries.map((item) => {
              const Icon = item.icon;
              const tone = toneClasses[item.tone];
              return <article key={item.title} className={`rounded-3xl border p-6 ${tone.border}`}><div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.icon}`}><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-lg font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p></article>;
            })}
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.045] p-6 backdrop-blur sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300"><Activity className="h-5 w-5" /></div><div><h2 className="text-xl font-semibold">{copy.aiTitle}</h2><p className="mt-2 leading-7 text-slate-400">{copy.aiText}</p></div></div>
          <Link href={copy.nextHref}><ExecutiveButton size="large" rightIcon={<DirectionIcon className="h-5 w-5" />} className="min-w-64 border-0 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_12px_32px_rgba(37,99,235,0.28)] hover:from-blue-500 hover:to-cyan-400">{copy.primaryAction}</ExecutiveButton></Link>
        </section>

        <footer className="mt-8 flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={copy.backHref} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">{isArabic ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}{copy.secondaryAction}</Link>
          <p className="text-xs text-slate-600">KAFU AI · Enterprise Operating Intelligence</p>
        </footer>
      </section>
    </main>
  );
}