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
    languageLabel: "ط§ظ„ط¹ط±ط¨ظٹط©",
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
        title: "Whatâ€™s Going Well",
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
    eyebrow: "طµط­ط© ط§ظ„ظ…ط¤ط³ط³ط©",
    title: "ظ…ط¤ط³ط³طھظƒ ظپظٹ ظˆط¶ط¹ طµط­ظٹ ط¬ظٹط¯.",
    subtitle:
      "ظ„ط§ ظٹط²ط§ظ„ ط§ظ„ط£ط¯ط§ط، ط§ظ„ظ…ط§ظ„ظٹ ظ‚ظˆظٹظ‹ط§طŒ ط¨ظٹظ†ظ…ط§ ظٹطھظ…ط«ظ„ ط§ظ„طھط­ط¯ظٹ ط§ظ„ط±ط¦ظٹط³ظٹ ظپظٹ ط³ط±ط¹ط© طھظ†ظپظٹط° ط§ظ„ط§ط¹طھظ…ط§ط¯ط§طھ ظˆط§ظ„ظ…ط¨ط§ط¯ط±ط§طھ ط§ظ„ط§ط³طھط±ط§طھظٹط¬ظٹط©.",
    scoreLabel: "ظ…ط¤ط´ط± طµط­ط© ط§ظ„ظ…ط¤ط³ط³ط©",
    scoreValue: "86",
    scoreStatus: "ط¬ظٹط¯ط©",
    dimensionsTitle: "ط£ط¨ط¹ط§ط¯ طµط­ط© ط§ظ„ظ…ط¤ط³ط³ط©",
    dimensionsHelper:
      "ط±ط¤ظٹط© ظ…ظˆط­ط¯ط© ظ„ظ„طµط­ط© ط§ظ„ظ…ط§ظ„ظٹط© ظˆط§ظ„طھط¬ط§ط±ظٹط© ظˆط§ظ„طھط´ط؛ظٹظ„ظٹط© ظˆط±ط£ط³ ط§ظ„ظ…ط§ظ„ ط§ظ„ط¨ط´ط±ظٹ ظˆط§ظ„ط¬ط§ظ‡ط²ظٹط© ظ„ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ.",
    dimensions: [
      {
        title: "ط§ظ„طµط­ط© ط§ظ„ظ…ط§ظ„ظٹط©",
        score: 92,
        status: "ظ…ظ…طھط§ط²ط©",
        insight:
          "ظ„ط§ طھط²ط§ظ„ ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ظˆط§ظ„ط±ط¨ط­ظٹط© ظˆط§ظ„ط³ظٹظˆظ„ط© ط§ظ„ظ†ظ‚ط¯ظٹط© ظپظٹ ظˆط¶ط¹ ظ‚ظˆظٹ.",
        metric: "ظ…ط¯ط© ط§ظ„طھط؛ط·ظٹط© ط§ظ„ظ†ظ‚ط¯ظٹط©: 14.6 ط´ظ‡ط±ظ‹ط§",
        icon: Banknote,
        tone: "success",
      },
      {
        title: "ط§ظ„طµط­ط© ط§ظ„طھط¬ط§ط±ظٹط©",
        score: 78,
        status: "ط¬ظٹط¯ط©",
        insight:
          "ظ…ط³ط§ط± ط§ظ„ظپط±طµ طµط­ظٹطŒ ظ„ظƒظ† طھط­ظˆظٹظ„ ظپط±طµ ظ‚ط·ط§ط¹ ط§ظ„ظ…ط¤ط³ط³ط§طھ طھط¨ط§ط·ط£.",
        metric: "ظپط±طµ ظ…ط¹ط±ط¶ط© ظ„ظ„ط®ط·ط±: 2.8 ظ…ظ„ظٹظˆظ† ط¯ظˆظ„ط§ط±",
        icon: TrendingUp,
        tone: "attention",
      },
      {
        title: "ط§ظ„طµط­ط© ط§ظ„طھط´ط؛ظٹظ„ظٹط©",
        score: 74,
        status: "طھط­طھط§ط¬ ط¥ظ„ظ‰ ط§ظ‡طھظ…ط§ظ…",
        insight:
          "طھط£ط®ط± ط§ظ„ط§ط¹طھظ…ط§ط¯ط§طھ ظٹط­ط¯ ظ…ظ† ط³ط±ط¹ط© ط§ظ„طھظ†ظپظٹط°.",
        metric: "ظ…طھظˆط³ط· ط¯ظˆط±ط© ط§ظ„ط§ط¹طھظ…ط§ط¯: 11 ظٹظˆظ…ظ‹ط§",
        icon: Workflow,
        tone: "critical",
      },
      {
        title: "طµط­ط© ط±ط£ط³ ط§ظ„ظ…ط§ظ„ ط§ظ„ط¨ط´ط±ظٹ",
        score: 91,
        status: "ظ…ظ…طھط§ط²ط©",
        insight:
          "ظ…ط³طھظˆظٹط§طھ ط§ظ„طھظپط§ط¹ظ„ ظˆط§ظ„ط¥ظ†طھط§ط¬ظٹط© ط£ط¹ظ„ظ‰ ظ…ظ† ط§ظ„ظ…ط³طھظ‡ط¯ظپ.",
        metric: "ط§ظ„طھظپط§ط¹ظ„ ط§ظ„ظˆط¸ظٹظپظٹ: 94%",
        icon: UsersRound,
        tone: "success",
      },
      {
        title: "ط§ظ„ط¬ط§ظ‡ط²ظٹط© ظ„ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ",
        score: 88,
        status: "ظ‚ظˆظٹط©",
        insight:
          "ط¬ظˆط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆظ…ط³طھظˆظ‰ ط§ظ„طھط¨ظ†ظٹ ظٹط¯ط¹ظ…ط§ظ† ط§ظ„ظ…ط²ظٹط¯ ظ…ظ† ط§ظ„ط£طھظ…طھط©.",
        metric: "ظ†ط³ط¨ط© طھط¨ظ†ظٹ ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ: 81%",
        icon: BrainCircuit,
        tone: "good",
      },
    ],
    timelineTitle: "ط§ظ„ظ…ط³ط§ط± ط§ظ„ط²ظ…ظ†ظٹ ظ„طµط­ط© ط§ظ„ظ…ط¤ط³ط³ط©",
    timelineHelper: "ط¢ط®ط± 30 ظٹظˆظ…ظ‹ط§",
    timelineValues: [72, 75, 78, 80, 82, 84, 86],
    timelineLabels: [
      "ط§ظ„ظٹظˆظ… 1",
      "ط§ظ„ظٹظˆظ… 5",
      "ط§ظ„ظٹظˆظ… 10",
      "ط§ظ„ظٹظˆظ… 15",
      "ط§ظ„ظٹظˆظ… 20",
      "ط§ظ„ظٹظˆظ… 25",
      "ط§ظ„ظٹظˆظ…",
    ],
    summaryTitle: "ط§ظ„ظ…ظ„ط®طµ ط§ظ„طھظ†ظپظٹط°ظٹ",
    summaries: [
      {
        title: "ظ…ط§ ظٹط³ظٹط± ط¨ط´ظƒظ„ ط¬ظٹط¯",
        text:
          "ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ط£ط¹ظ„ظ‰ ظ…ظ† ط§ظ„ط±ط¨ط¹ ط§ظ„ط³ط§ط¨ظ‚طŒ ظˆط§ظ„ط³ظٹظˆظ„ط© ظ…ط³طھظ‚ط±ط©طŒ ظˆطھظپط§ط¹ظ„ ط§ظ„ظ…ظˆط¸ظپظٹظ† ظ‚ظˆظٹ.",
        tone: "success",
        icon: CheckCircle2,
      },
      {
        title: "ظ…ط§ ظٹط­طھط§ط¬ ط¥ظ„ظ‰ ط§ظ‡طھظ…ط§ظ…",
        text:
          "ط¯ظˆط±ط§طھ ط§ظ„ط§ط¹طھظ…ط§ط¯ ظˆطھط£ط®ط± ط§ظ„ظ…ط¨ط§ط¯ط±ط§طھ ط§ظ„ط§ط³طھط±ط§طھظٹط¬ظٹط© ظٹط­ط¯ط§ظ† ظ…ظ† ط§ظ„ظ†ظ…ظˆ.",
        tone: "attention",
        icon: CircleAlert,
      },
      {
        title: "ط§ظ„ط¥ط¬ط±ط§ط، ط§ظ„طھظ†ظپظٹط°ظٹ ط§ظ„ظ…ظ‚طھط±ط­",
        text:
          "ط£طھظ…طھط© ط§ط¹طھظ…ط§ط¯ ط§ظ„ط¹ط±ظˆط¶ ظˆطھط¹ظٹظٹظ† ظ…ط³ط¤ظˆظ„ طھظ†ظپظٹط°ظٹ ظˆط§ط­ط¯ ظ„ظ„ظ…ط¨ط§ط¯ط±ط§طھ ط§ظ„ظ…طھط£ط®ط±ط©.",
        tone: "good",
        icon: Target,
      },
    ],
    aiTitle: "طھظˆطµظٹط© KAFU AI",
    aiText:
      "ظٹظ…ظƒظ† ظ„طھظ‚ظ„ظٹظ„ ط®ط·ظˆط§طھ ط§ظ„ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹط¯ظˆظٹط© ط®ظپط¶ ظ…طھظˆط³ط· ط§ظ„ط¯ظˆط±ط© ظ…ظ† 11 ظٹظˆظ…ظ‹ط§ ط¥ظ„ظ‰ ظ†ط­ظˆ 7 ط£ظٹط§ظ…طŒ ظ…ظ…ط§ ظٹط­ط³ظ† ط³ط±ط¹ط© ط§ظ„ظ…ط¨ظٹط¹ط§طھ ظˆط¯ظ‚ط© ط§ظ„طھظˆظ‚ط¹ط§طھ.",
    aiConfidence: "ط¯ط±ط¬ط© ط«ظ‚ط© ط§ظ„طھط­ظ„ظٹظ„: 96%",
    impactLabel: "ط§ظ„ط£ط«ط± ط§ظ„ظ…طھظˆظ‚ط¹",
    impactValue: "+12%",
    impactText: "ظپظٹ ط³ط±ط¹ط© ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ",
    primaryAction: "طھط­ظ„ظٹظ„ ط§ظ„ط£ط³ط¨ط§ط¨ ط§ظ„ط¬ط°ط±ظٹط©",
    secondaryAction: "ط§ظ„ط¹ظˆط¯ط© ط¥ظ„ظ‰ ط§ظ„ط¥ط­ط§ط·ط© ط§ظ„طھظ†ظپظٹط°ظٹط©",
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
        <div className="flex justify-end">
          <ExecutiveButton
            variant="ghost"
            size="small"
            onClick={() =>
              setLanguage((current) =>
                current === "en" ? "ar" : "en",
              )
            }
            leftIcon={<Languages className="h-4 w-4" />}
            className="border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] shadow-[var(--shadow-small)] hover:border-[var(--brand-primary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
          >
            {copy.languageLabel}
          </ExecutiveButton>
        </div>

        <section className="relative overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 end-0 w-1 bg-[var(--brand-primary)]" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-24 -top-28 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_6%,transparent)]"
          />

          <div className="relative grid items-center gap-4 px-6 py-5 md:px-7 lg:grid-cols-[minmax(0,1fr)_250px] lg:px-8">
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

            <article className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3.5">
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
                  className="group flex h-full min-h-[188px] flex-col rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]"
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

                  <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
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

            <div className="mt-5 flex h-32 items-end gap-2 sm:gap-3">
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

        <footer className="mt-4 flex flex-col gap-3 border-t border-[var(--border-default)] pt-4 sm:flex-row sm:items-center sm:justify-between">
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
            KAFU AI آ· Enterprise Operating Intelligence
          </p>
        </footer>
      </section>
    </main>
  );
}
