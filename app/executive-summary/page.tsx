"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Languages,
  LineChart,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import {
  ExecutiveButton,
  StatusBadge,
} from "../../src/product/executive-design-system";

type Language = "en" | "ar";

const content = {
  en: {
    languageLabel: "العربية",
    eyebrow: "Today’s Executive Briefing",
    title: "Three priorities require your attention.",
    subtitle:
      "Your organization is operating within normal parameters. The following items have the greatest impact on growth and execution today.",
    reviewTime: "Estimated review time",
    reviewValue: "4 minutes",
    healthLabel: "Enterprise Health",
    healthValue: "86 / 100",
    healthStatus: "Healthy",
    prioritiesLabel: "Executive Priorities",
    priorities: [
      {
        title: "Revenue Growth",
        insight: "Enterprise sales growth is 8% below forecast.",
        impact: "$2.8M pipeline value requires action.",
        action: "Review opportunities",
        status: "attention",
        icon: TrendingUp,
      },
      {
        title: "Operational Efficiency",
        insight: "Proposal approvals now average 11 days.",
        impact: "Approval delays are slowing conversion.",
        action: "Remove bottlenecks",
        status: "critical",
        icon: Clock3,
      },
      {
        title: "Strategic Execution",
        insight: "Two strategic initiatives are behind schedule.",
        impact: "Execution confidence has declined to 73%.",
        action: "Reprioritize execution",
        status: "attention",
        icon: Target,
      },
    ],
    snapshotLabel: "Business Snapshot",
    metrics: [
      {
        label: "Revenue",
        value: "$12.4M",
        trend: "+8.2%",
        helper: "vs. previous quarter",
        icon: Banknote,
      },
      {
        label: "Cash Position",
        value: "Stable",
        trend: "14.6 months",
        helper: "estimated runway",
        icon: LineChart,
      },
      {
        label: "AI Workforce",
        value: "23 Active",
        trend: "91%",
        helper: "task completion rate",
        icon: UsersRound,
      },
      {
        label: "Critical Risks",
        value: "3",
        trend: "1 new",
        helper: "since yesterday",
        icon: ShieldAlert,
      },
    ],
    aiTitle: "KAFU AI Executive Insight",
    aiText:
      "The company remains financially healthy. Current growth constraints are operational rather than financial.",
    aiConfidence: "AI confidence: 96%",
    primaryAction: "Continue to Company Health",
    secondaryAction: "Return to Welcome",
    nextHref: "/company-dashboard",
    backHref: "/welcome",
  },
  ar: {
    languageLabel: "English",
    eyebrow: "الإحاطة التنفيذية لليوم",
    title: "ثلاث أولويات تتطلب انتباهك.",
    subtitle:
      "تعمل المؤسسة ضمن مستويات الأداء الطبيعية، وتمثل العناصر التالية أكبر أثر مباشر على النمو والتنفيذ اليوم.",
    reviewTime: "الوقت المتوقع للمراجعة",
    reviewValue: "4 دقائق",
    healthLabel: "صحة المؤسسة",
    healthValue: "86 / 100",
    healthStatus: "جيدة",
    prioritiesLabel: "الأولويات التنفيذية",
    priorities: [
      {
        title: "نمو الإيرادات",
        insight: "نمو مبيعات قطاع الشركات أقل من التوقعات بنسبة 8%.",
        impact: "فرص بقيمة 2.8 مليون دولار تتطلب إجراءً.",
        action: "مراجعة الفرص",
        status: "attention",
        icon: TrendingUp,
      },
      {
        title: "الكفاءة التشغيلية",
        insight: "متوسط اعتماد العروض أصبح 11 يومًا.",
        impact: "تأخر الاعتمادات يبطئ تحويل الفرص.",
        action: "إزالة نقاط التعطيل",
        status: "critical",
        icon: Clock3,
      },
      {
        title: "التنفيذ الاستراتيجي",
        insight: "هناك مبادرتان استراتيجيتان متأخرتان.",
        impact: "انخفضت موثوقية التنفيذ إلى 73%.",
        action: "إعادة ترتيب التنفيذ",
        status: "attention",
        icon: Target,
      },
    ],
    snapshotLabel: "ملخص الأعمال",
    metrics: [
      {
        label: "الإيرادات",
        value: "12.4 مليون $",
        trend: "+8.2%",
        helper: "مقارنة بالربع السابق",
        icon: Banknote,
      },
      {
        label: "الوضع النقدي",
        value: "مستقر",
        trend: "14.6 شهرًا",
        helper: "المدة التشغيلية التقديرية",
        icon: LineChart,
      },
      {
        label: "القوى العاملة الذكية",
        value: "23 نشطًا",
        trend: "91%",
        helper: "معدل إكمال المهام",
        icon: UsersRound,
      },
      {
        label: "المخاطر الحرجة",
        value: "3",
        trend: "1 جديد",
        helper: "منذ الأمس",
        icon: ShieldAlert,
      },
    ],
    aiTitle: "الرؤية التنفيذية من KAFU AI",
    aiText:
      "لا تزال المؤسسة في وضع مالي جيد، بينما ترتبط قيود النمو الحالية بكفاءة التنفيذ أكثر من الوضع المالي.",
    aiConfidence: "درجة ثقة التحليل: 96%",
    primaryAction: "الانتقال إلى صحة المؤسسة",
    secondaryAction: "العودة إلى الترحيب",
    nextHref: "/company-dashboard",
    backHref: "/welcome",
  },
} as const;

export default function ExecutiveSummaryPage() {
  const [language, setLanguage] = useState<Language>("en");

  const copy = content[language];
  const isArabic = language === "ar";
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden bg-[#06101f] text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <section className="relative mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/welcome" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,0.22)]">
              <Sparkles className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.20em]">KAFU AI</p>
              <p className="text-xs text-slate-400">
                Enterprise Operating Intelligence
              </p>
            </div>
          </Link>

          <ExecutiveButton
            variant="ghost"
            size="small"
            onClick={() =>
              setLanguage((current) => (current === "en" ? "ar" : "en"))
            }
            leftIcon={<Languages className="h-4 w-4" />}
            className="border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white"
          >
            {copy.languageLabel}
          </ExecutiveButton>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <StatusBadge
              status="good"
              label={copy.eyebrow}
              className="border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-[11px] tracking-wide text-blue-200"
            />
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
              {copy.subtitle}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                    {copy.reviewTime}
                  </p>
                  <p className="mt-1 font-semibold">{copy.reviewValue}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-emerald-300/70">
                {copy.healthLabel}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-xl font-bold">{copy.healthValue}</p>
                <StatusBadge
                  status="healthy"
                  label={copy.healthStatus}
                  className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-blue-300" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
              {copy.prioritiesLabel}
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {copy.priorities.map((priority, index) => {
              const Icon = priority.icon;
              const isCritical = priority.status === "critical";

              return (
                <article
                  key={priority.title}
                  className="group rounded-3xl border border-white/[0.08] bg-white/[0.045] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.07] hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)]"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-2xl",
                        isCritical
                          ? "bg-red-500/10 text-red-300"
                          : "bg-amber-500/10 text-amber-300",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-semibold text-slate-600">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">{priority.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {priority.insight}
                  </p>

                  <div className="mt-5 flex items-start gap-2 rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                    {isCritical ? (
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                    ) : (
                      <Activity className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    )}
                    <p className="text-xs leading-5 text-slate-400">
                      {priority.impact}
                    </p>
                  </div>

                  <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200">
                    {priority.action}
                    <DirectionIcon className="h-4 w-4" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-300" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
              {copy.snapshotLabel}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {copy.metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.label}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.065]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{metric.label}</p>
                      <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <p className="text-sm font-semibold text-emerald-300">
                      {metric.trend}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {metric.helper}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-400/15 bg-blue-500/[0.07] p-6 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-4xl items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">{copy.aiTitle}</h2>
                <p className="mt-2 leading-7 text-slate-300">{copy.aiText}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-blue-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {copy.aiConfidence}
                </div>
              </div>
            </div>

            <Link href={copy.nextHref}>
              <ExecutiveButton
                size="large"
                rightIcon={<DirectionIcon className="h-5 w-5" />}
                className="min-w-72 border-0 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_12px_32px_rgba(37,99,235,0.28)] hover:from-blue-500 hover:to-cyan-400"
              >
                {copy.primaryAction}
              </ExecutiveButton>
            </Link>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={copy.backHref}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
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