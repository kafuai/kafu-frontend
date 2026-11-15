"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Languages,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import {
  ExecutiveButton,
  ExecutiveCard,
  StatusBadge,
} from "../../src/product/executive-design-system";

type Language = "en" | "ar";

const content = {
  en: {
    languageLabel: "العربية",
    badge: "Executive Operating Intelligence",
    greeting: "Good morning.",
    welcomeLineOne: "Welcome back,",
    welcomeLineTwo: "Executive.",
    analysis: "Today's executive analysis is complete.",
    attention: "Three strategic decisions are waiting for your review.",
    briefingLabel: "Estimated briefing time",
    briefingTime: "4 minutes",
    connectionTitle: "Enterprise systems connected",
    connections: [
      "Financial Systems",
      "Human Resources",
      "Sales & CRM",
      "Operations",
      "Executive Workspace",
    ],
    primaryAction: "Start Executive Briefing",
    secondaryAction: "Review Yesterday's Summary",
    footerTitle: "KAFU AI",
    footerText: "Enterprise Operating Intelligence",
    trustTitle: "Executive-ready",
    trustText:
      "Your organization has already been analyzed. You begin with decisions, not dashboards.",
    snapshotTitle: "Executive Snapshot",
    metrics: [
      {
        title: "Revenue",
        value: "+8.2%",
        description: "Compared with forecast",
        type: "positive",
      },
      {
        title: "AI Workforce",
        value: "23 Active",
        description: "Across key business functions",
        type: "workforce",
      },
      {
        title: "Critical Risks",
        value: "3",
        description: "Require executive attention",
        type: "risk",
      },
    ],
    nextHref: "/executive-summary",
  },
  ar: {
    languageLabel: "English",
    badge: "الذكاء التشغيلي التنفيذي",
    greeting: "صباح الخير.",
    welcomeLineOne: "مرحبًا بعودتك،",
    welcomeLineTwo: "أيها القائد.",
    analysis: "اكتمل التحليل التنفيذي لمؤسستك اليوم.",
    attention: "هناك ثلاثة قرارات استراتيجية بانتظار مراجعتك.",
    briefingLabel: "الوقت المتوقع للإحاطة",
    briefingTime: "4 دقائق",
    connectionTitle: "تم الاتصال بأنظمة المؤسسة",
    connections: [
      "الأنظمة المالية",
      "الموارد البشرية",
      "المبيعات وإدارة العملاء",
      "العمليات",
      "مساحة العمل التنفيذية",
    ],
    primaryAction: "ابدأ الإحاطة التنفيذية",
    secondaryAction: "مراجعة ملخص الأمس",
    footerTitle: "KAFU AI",
    footerText: "منصة الذكاء التشغيلي التنفيذي للمؤسسات",
    trustTitle: "جاهز للقيادة",
    trustText:
      "تم تحليل مؤسستك مسبقًا، لتبدأ يومك بالقرارات لا بالبحث داخل لوحات المعلومات.",
    snapshotTitle: "الملخص التنفيذي",
    metrics: [
      {
        title: "الإيرادات",
        value: "+8.2%",
        description: "مقارنة بالتوقعات",
        type: "positive",
      },
      {
        title: "القوى العاملة الذكية",
        value: "23 نشطًا",
        description: "عبر الوظائف الأساسية",
        type: "workforce",
      },
      {
        title: "المخاطر الحرجة",
        value: "3",
        description: "تتطلب اهتمامًا تنفيذيًا",
        type: "risk",
      },
    ],
    nextHref: "/executive-summary",
  },
} as const;

export default function WelcomePage() {
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
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.20),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_32%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,0.25)]">
              <Sparkles className="h-5 w-5 text-blue-300" />
            </div>

            <div>
              <p className="text-sm font-bold tracking-[0.20em] text-white">
                KAFU AI
              </p>
              <p className="text-xs text-slate-400">{copy.footerText}</p>
            </div>
          </div>

          <ExecutiveButton
            variant="ghost"
            size="small"
            onClick={() =>
              setLanguage((current) => (current === "en" ? "ar" : "en"))
            }
            leftIcon={<Languages className="h-4 w-4" />}
            className="border border-white/10 text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
          >
            {copy.languageLabel}
          </ExecutiveButton>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div className="max-w-3xl">
            <StatusBadge
              status="good"
              label={copy.badge}
              className="border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-[11px] tracking-wide text-blue-200"
            />

            <div className="mt-7">
              <p className="text-lg font-medium text-blue-300">
                {copy.greeting}
              </p>

              <h1 className="mt-3 text-5xl font-bold tracking-[-0.045em] text-white sm:text-6xl xl:text-7xl">
                <span className="block">{copy.welcomeLineOne}</span>
                <span className="block">{copy.welcomeLineTwo}</span>
              </h1>
            </div>

            <div className="mt-7 max-w-2xl space-y-2">
              <p className="text-xl font-normal leading-9 text-slate-200 sm:text-2xl">
                {copy.analysis}
              </p>

              <p className="text-lg font-light leading-8 text-slate-400">
                {copy.attention}
              </p>
            </div>

            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur">
              <Clock3 className="h-5 w-5 text-blue-300" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {copy.briefingLabel}
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  {copy.briefingTime}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={copy.nextHref}>
                <ExecutiveButton
                  size="large"
                  rightIcon={<DirectionIcon className="h-5 w-5" />}
                  className="min-w-64 border-0 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_12px_32px_rgba(37,99,235,0.30)] transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-cyan-400"
                >
                  {copy.primaryAction}
                </ExecutiveButton>
              </Link>

              <ExecutiveButton
                variant="ghost"
                size="large"
                className="border border-white/10 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
              >
                {copy.secondaryAction}
              </ExecutiveButton>
            </div>

            <div className="mt-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {copy.snapshotTitle}
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {copy.metrics.map((metric) => {
                  const Icon =
                    metric.type === "positive"
                      ? TrendingUp
                      : metric.type === "workforce"
                        ? UsersRound
                        : TriangleAlert;

                  return (
                    <div
                      key={metric.title}
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-400">
                            {metric.title}
                          </p>
                          <p className="mt-2 text-2xl font-bold text-white">
                            {metric.value}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        {metric.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <ExecutiveCard
              elevated
              eyebrow={copy.footerTitle}
              title={copy.connectionTitle}
              icon={<Building2 className="h-5 w-5" />}
              className="w-full max-w-lg border-white/10 bg-white/[0.055] text-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)]"
            >
              <div className="space-y-3">
                {copy.connections.map((connection) => (
                  <div
                    key={connection}
                    className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/20 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-medium text-slate-200">
                        {connection}
                      </span>
                    </div>

                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />

                  <div>
                    <p className="font-semibold text-white">{copy.trustTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {copy.trustText}
                    </p>
                  </div>
                </div>
              </div>
            </ExecutiveCard>
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-white/[0.07] pt-5 text-xs text-slate-500">
          <span>{copy.footerTitle}</span>
          <span>{copy.footerText}</span>
        </footer>
      </section>
    </main>
  );
}