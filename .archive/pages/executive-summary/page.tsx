"use client";

import { useEffect, useState } from "react";

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
  LineChart,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import {
  ExecutiveButton,
  StatusBadge,
} from "../../src/product/executive-design-system";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useExecutiveSummary } from "@/hooks/useExecutiveSummary";
import { useExecutiveInsights } from "@/hooks/useExecutiveInsights";

const content = {
  en: {
    eyebrow: "Executive Briefing",
    reviewTime: "Data Status",
    healthLabel: "Enterprise Readiness",
    prioritiesLabel: "Executive Priorities",
    snapshotLabel: "Enterprise Snapshot",
    aiTitle: "KAFU AI Executive Insight",
    primaryAction: "Continue to Company Health",
    secondaryAction: "Return to Welcome",
    nextHref: "/company-dashboard",
    backHref: "/welcome",
  },

  ar: {
    eyebrow: "الإحاطة التنفيذية",
    reviewTime: "حالة البيانات",
    healthLabel: "جاهزية المؤسسة",
    prioritiesLabel: "الأولويات التنفيذية",
    snapshotLabel: "ملخص المؤسسة",
    aiTitle: "الرؤية التنفيذية من KAFU AI",
    primaryAction: "الانتقال إلى صحة المؤسسة",
    secondaryAction: "العودة إلى الترحيب",
    nextHref: "/company-dashboard",
    backHref: "/welcome",
  },
} as const;

export default function ExecutiveSummaryPage() {
  const { locale } = useLocalization();
  const language = locale === "ar" ? "ar" : "en";
  const copy = content[language];
  const isArabic = language === "ar";
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;

  const {
    company,
    answers,
    loading,
    message,
  } = useExecutiveSummary();

  const {
    insights,
    executiveMetrics,
  } = useExecutiveInsights(
    company,
    answers,
  );

  const [
    aiInsight,
    setAIInsight,
  ] = useState("");

  const [
    aiSource,
    setAISource,
  ] = useState("");

  const companyName =
    company?.name
    ?? (
      isArabic
        ? "المؤسسة الحالية"
        : "Current organization"
    );

  const pageTitle =
    isArabic
      ? `الإحاطة التنفيذية لـ ${companyName}`
      : `${companyName} Executive Briefing`;

  const pageSubtitle =
    isArabic
      ? "الإحاطة مبنية على بيانات المؤسسة النشطة ومدخلات Discovery الحالية. لا يتم عرض مؤشرات مالية أو تشغيلية غير متوفرة في مصادر البيانات."
      : "This briefing is based on the active company profile and current Discovery evidence. Financial or operational metrics without a verified source are not presented.";

  const healthValue =
    `${insights.score} / 100`;

  const healthStatus =
    insights.score >= 75
      ? (
          isArabic
            ? "جاهزية جيدة"
            : "Ready"
        )
      : insights.score >= 50
        ? (
            isArabic
              ? "يحتاج متابعة"
              : "Needs Attention"
          )
        : (
            isArabic
              ? "قيد البناء"
              : "Building"
          );

  const dataStatus =
    loading
      ? (
          isArabic
            ? "جاري التحميل"
            : "Loading"
        )
      : message
        ? (
            isArabic
              ? "غير متاح"
              : "Unavailable"
          )
        : (
            isArabic
              ? `${answers.length} إجابات Discovery`
              : `${answers.length} Discovery answers`
          );

  const livePriorities =
    insights.priorities
      .slice(0, 3)
      .map(
        (
          priority,
          index,
        ) => ({
          title:
            priority.title,

          insight:
            priority.description,

          impact:
            isArabic
              ? `التوقيت المقترح: ${priority.timeline}`
              : `Recommended timing: ${priority.timeline}`,

          action:
            isArabic
              ? "مراجعة الأولوية"
              : "Review priority",

          status:
            priority.timeline
              .toLowerCase()
              .includes("immediate")
              ? "critical"
              : "attention",

          icon:
            index === 0
              ? TrendingUp
              : index === 1
                ? Clock3
                : Target,
        }),
      );

  const liveMetrics =
    executiveMetrics.map(
      (
        metric,
        index,
      ) => ({
        label:
          metric.label,

        value:
          metric.value,

        trend:
          metric.note,

        helper:
          isArabic
            ? "محسوب من البيانات الحالية"
            : "Calculated from current data",

        icon:
          index === 0
            ? Target
            : index === 1
              ? Sparkles
              : index === 2
                ? LineChart
                : UsersRound,
      }),
    );

  useEffect(() => {
    if (
      loading
      || !company
    ) {
      return;
    }

    const controller =
      new AbortController();

    setAIInsight(
      insights.summary,
    );

    setAISource(
      isArabic
        ? "تحليل حتمي مبني على البيانات الحالية"
        : "Deterministic analysis based on current data",
    );

    const generateGroundedInsight =
      async () => {
        try {
          const response =
            await fetch(
              "/api/ai/grounded",
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                signal:
                  controller.signal,

                body:
                  JSON.stringify({
                    task:
                      "Generate a concise executive briefing insight using only the supplied enterprise evidence.",

                    question:
                      isArabic
                        ? "ما أهم ملاحظة تنفيذية يجب أن يعرفها المدير التنفيذي الآن بناءً على الأدلة المتاحة فقط؟"
                        : "What is the most important executive observation right now based only on the available evidence?",

                    evidence: [
                      {
                        id:
                          "COMPANY",

                        source:
                          "supabase.companies",

                        label:
                          "Active company",

                        value: {
                          name:
                            company.name,

                          industry:
                            company.industry,

                          country:
                            company.country,

                          employeeCount:
                            company.employee_count,
                        },
                      },

                      {
                        id:
                          "DISCOVERY",

                        source:
                          "supabase.discovery_answers",

                        label:
                          "Discovery evidence",

                        value: {
                          answersCount:
                            answers.length,

                          discoveryCompletion:
                            insights.discoveryCompletion,

                          dataQualityScore:
                            insights.dataQualityScore,
                        },
                      },

                      {
                        id:
                          "EXECUTIVE-READINESS",

                        source:
                          "kafu.executive-report-engine",

                        label:
                          "Executive readiness",

                        value: {
                          score:
                            insights.score,

                          status:
                            insights.status,

                          maturityLevel:
                            insights.maturityLevel,

                          analysisConfidence:
                            insights.aiConfidence,

                          priorities:
                            insights.priorities
                              .slice(0, 3)
                              .map(
                                (priority) => ({
                                  title:
                                    priority.title,

                                  timeline:
                                    priority.timeline,
                                }),
                              ),
                        },
                      },
                    ],

                    context: {
                      tenantId:
                        company.id,

                      companyId:
                        company.id,

                      locale:
                        language,

                      metadata: {
                        surface:
                          "executive-summary",
                      },
                    },

                    instructions:
                      "Use only supplied evidence. Do not invent revenue, cash position, forecasts, pipeline value, approval cycle duration, employee engagement, agent activity, business risks, financial health, or other unavailable metrics. Keep the response concise and executive-ready. Cite material claims using evidence IDs in square brackets.",
                  }),
              },
            );

          if (!response.ok) {
            throw new Error(
              `Grounded AI request failed with status ${response.status}.`,
            );
          }

          const payload =
            await response.json() as {
              text?: unknown;

              citations?:
                unknown[];

              result?: {
                text?: unknown;

                citations?:
                  unknown[];
              };
            };

          const text =
            typeof payload.text
              === "string"
              ? payload.text
              : typeof payload.result?.text
                  === "string"
                ? payload.result.text
                : "";

          if (
            text.trim()
          ) {
            const citations =
              Array.isArray(
                payload.citations,
              )
                ? payload.citations
                : Array.isArray(
                    payload.result
                      ?.citations,
                  )
                  ? payload.result
                      ?.citations
                  : [];

            setAIInsight(
              text.trim(),
            );

            setAISource(
              isArabic
                ? `Grounded AI • ${citations.length} مصادر مستشهد بها`
                : `Grounded AI • ${citations.length} cited evidence sources`,
            );
          }
        } catch (error) {
          if (
            error instanceof DOMException
            && error.name
              === "AbortError"
          ) {
            return;
          }

          console.error(
            "Executive Summary Grounded AI generation failed:",
            error,
          );
        }
      };

    void generateGroundedInsight();

    return () => {
      controller.abort();
    };
  }, [
    loading,
    company,
    answers.length,
    insights,
    language,
    isArabic,
  ]);

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[var(--background)] text-[var(--text-primary)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--brand-primary)_8%,transparent),transparent_32%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--brand-primary)_5%,transparent),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border-default)_1px,transparent_1px),linear-gradient(90deg,var(--border-default)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <section className="relative mx-auto max-w-[1580px] space-y-6 px-5 py-5 md:px-7 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/welcome" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[color-mix(in_srgb,var(--brand-primary)_18%,var(--border-default))] bg-[var(--brand-subtle)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.2em] text-[var(--text-primary)]">
                KAFU AI
              </p>

              <p className="text-xs text-[var(--text-muted)]">
                Enterprise Operating Intelligence
              </p>
            </div>
          </Link>
        </header>

        <section className="overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className={isArabic ? "text-right" : "text-left"}><StatusBadge
                status="good"
                label={copy.eyebrow}
                className="border-[color-mix(in_srgb,var(--brand-primary)_20%,var(--border-default))] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] tracking-wide text-[var(--brand-primary)]"
              />

              <h1 className="mt-5 max-w-4xl text-[2.2rem] font-black leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2.8rem] lg:text-[3.4rem]">
                {pageTitle}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-secondary)] md:text-lg md:leading-8">
                {pageSubtitle}
              </p>
            </div>

            <div className={["grid gap-3 sm:grid-cols-2", isArabic ? "lg:justify-self-start" : "lg:justify-self-end"].join(" ")}>
              <article className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-[var(--brand-primary)]" />

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {copy.reviewTime}
                    </p>

                    <p className="mt-1 font-black text-[var(--text-primary)]">
                      {dataStatus}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[16px] border border-[color-mix(in_srgb,var(--success)_18%,var(--border-default))] bg-[var(--success-background)] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--success)]">
                  {copy.healthLabel}
                </p>

                <div className="mt-1.5 flex items-center gap-3">
                  <p className="text-xl font-black text-[var(--text-primary)]">
                    {healthValue}
                  </p>

                  <StatusBadge
                    status="healthy"
                    label={healthStatus}
                    className="border-[color-mix(in_srgb,var(--success)_22%,var(--border-default))] bg-[var(--surface)] text-[var(--success)]"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-[var(--brand-primary)]" />

            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              {copy.prioritiesLabel}
            </h2>
          </div>

          <div className="grid items-stretch gap-4 lg:grid-cols-3">
            {livePriorities.map((priority, index) => {
              const Icon = priority.icon;
              const isCritical = priority.status === "critical";

              return (
                <article
                  key={priority.title}
                  className="group flex h-full flex-col rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-[14px]",
                        isCritical
                          ? "bg-[var(--critical-background)] text-[var(--critical)]"
                          : "bg-[var(--warning-background)] text-[var(--warning)]",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-black text-[var(--text-muted)]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[var(--text-primary)]">
                    {priority.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    {priority.insight}
                  </p>

                  <div className="mt-5 flex items-start gap-2 rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                    {isCritical ? (
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--critical)]" />
                    ) : (
                      <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warning)]" />
                    )}

                    <p className="text-xs leading-5 text-[var(--text-secondary)]">
                      {priority.impact}
                    </p>
                  </div>

                  <div className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black text-[var(--brand-primary)]">
                    {priority.action}
                    <DirectionIcon
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-[var(--brand-primary)]" />

            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              {copy.snapshotLabel}
            </h2>
          </div>

          <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {liveMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.label}
                  className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">
                        {metric.label}
                      </p>

                      <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">
                        {metric.value}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[var(--border-default)] pt-4">
                    <p className="text-sm font-black text-[var(--success)]">
                      {metric.trend}
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {metric.helper}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[20px] border border-[color-mix(in_srgb,var(--brand-primary)_18%,var(--border-default))] bg-[var(--brand-subtle)] p-6 shadow-[var(--shadow-small)] sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-4xl items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[var(--text-primary)]">
                  {copy.aiTitle}
                </h2>

                <p className="mt-2 leading-7 text-[var(--text-secondary)]">
                  {aiInsight}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 text-xs font-black text-[var(--brand-primary)]">
                  <CheckCircle2 className="h-4 w-4" />
                  {aiSource}
                </div>
              </div>
            </div>

            <Link href={copy.nextHref}>
              <ExecutiveButton
                size="large"
                rightIcon={<DirectionIcon className="h-5 w-5" />}
                className="min-w-72 border-0 bg-[var(--brand-primary)] text-white shadow-[var(--shadow-medium)] hover:opacity-90"
              >
                {copy.primaryAction}
              </ExecutiveButton>
            </Link>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-[var(--border-default)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={copy.backHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            {isArabic ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}

            {copy.secondaryAction}
          </Link>

          <p className="text-xs text-[var(--text-muted)]">
            KAFU AI آ· Enterprise Operating Intelligence
          </p>
        </footer>
      </section>
    </main>
  );
}






