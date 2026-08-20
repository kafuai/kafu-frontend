"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";

import {
  calculateCorporateBrainScore,
  calculatePipelineMetrics,
  calculateReadinessScore,
  type ExecutiveCompany,
} from "@/lib/executive-dashboard";

import {
  buildDashboardEnterpriseIntelligence,
} from "../../../src/product/dashboard";

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


import {
  ExecutiveButton,
  StatusBadge,
} from "../../../src/product/executive-design-system";

type Language = "en" | "ar";

const content = {
  en: {
    languageLabel: "العربية",
    eyebrow: "Company Intelligence",
    scoreLabel: "Enterprise Health Score",

    dimensionsTitle:
      "Current Enterprise Signals",

    dimensionsHelper:
      "Readiness and execution indicators calculated from the active company profile, discovery evidence, and current sales pipeline.",

    chartTitle:
      "Current Signal Snapshot",

    chartHelper:
      "Live calculated indicators",

    summaryTitle:
      "Executive Summary",

    aiTitle:
      "KAFU AI Recommendation",

    primaryAction:
      "Analyze Root Causes",

    secondaryAction:
      "Back to Executive Briefing",

    nextHref:
      "/corporate-brain",

    backHref:
      "/executive-summary",
  },

  ar: {
    languageLabel: "English",
    eyebrow: "ذكاء المؤسسة",
    scoreLabel: "مؤشر صحة المؤسسة",

    dimensionsTitle:
      "المؤشرات الحالية للمؤسسة",

    dimensionsHelper:
      "مؤشرات جاهزية وتنفيذ محسوبة من ملف المؤسسة النشط وبيانات الاستكشاف ومسار المبيعات الحالي.",

    chartTitle:
      "لقطة المؤشرات الحالية",

    chartHelper:
      "مؤشرات محسوبة من البيانات الحالية",

    summaryTitle:
      "الملخص التنفيذي",

    aiTitle:
      "توصية KAFU AI",

    primaryAction:
      "تحليل الأسباب الجذرية",

    secondaryAction:
      "العودة إلى الملخص التنفيذي",

    nextHref:
      "/corporate-brain",

    backHref:
      "/executive-summary",
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


type CompanyDashboardPipelineItem = {
  id: string;
  status: string | null;
  opportunity_value: number | null;
  response_deadline: string | null;
};

type CompanyDashboardData = {
  company: ExecutiveCompany | null;
  answersCount: number;
  pipeline: CompanyDashboardPipelineItem[];
};

const EMPTY_COMPANY_DASHBOARD_DATA:
  CompanyDashboardData = {
    company: null,
    answersCount: 0,
    pipeline: [],
  };
export default function CompanyDashboardPage() {
  const [dashboardData, setDashboardData] =
    useState<CompanyDashboardData>(
      EMPTY_COMPANY_DASHBOARD_DATA,
    );

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [dashboardError, setDashboardError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError(null);

      try {
        const companyId =
          getCurrentCompanyId();

        if (!companyId) {
          if (active) {
            setDashboardData(
              EMPTY_COMPANY_DASHBOARD_DATA,
            );

            setDashboardError(
              "No active company is selected.",
            );
          }

          return;
        }

        const [
          companyResult,
          answersResult,
          pipelineResult,
        ] = await Promise.all([
          supabase
            .from("companies")
            .select(
              "id,name,industry,country,employee_count,contact_name,contact_email,contact_phone,created_at",
            )
            .eq("id", companyId)
            .maybeSingle(),

          supabase
            .from("discovery_answers")
            .select("id")
            .eq("company_id", companyId),

          supabase
            .from("sales_pipeline")
            .select(
              "id,status,opportunity_value,response_deadline",
            )
            .eq("company_id", companyId),
        ]);

        if (companyResult.error) {
          throw companyResult.error;
        }

        if (answersResult.error) {
          throw answersResult.error;
        }

        if (pipelineResult.error) {
          throw pipelineResult.error;
        }

        if (!active) {
          return;
        }

        setDashboardData({
          company:
            companyResult.data
            ?? null,

          answersCount:
            answersResult.data?.length
            ?? 0,

          pipeline:
            pipelineResult.data
            ?? [],
        });
      } catch (error) {
        if (!active) {
          return;
        }

        console.error(
          "Company Dashboard data loading failed:",
          error,
        );

        setDashboardData(
          EMPTY_COMPANY_DASHBOARD_DATA,
        );

        setDashboardError(
          error instanceof Error
            ? error.message
            : "Unable to load company dashboard data.",
        );
      } finally {
        if (active) {
          setDashboardLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const readinessScore =
    useMemo(
      () =>
        calculateReadinessScore(
          dashboardData.answersCount,
          dashboardData.company,
        ),
      [
        dashboardData.answersCount,
        dashboardData.company,
      ],
    );

  const corporateBrainScore =
    useMemo(
      () =>
        calculateCorporateBrainScore(
          dashboardData.answersCount,
        ),
      [dashboardData.answersCount],
    );

  const pipelineMetrics =
    useMemo(
      () =>
        calculatePipelineMetrics(
          dashboardData.company
            ? [dashboardData.company]
            : [],
          dashboardData.pipeline,
        ),
      [
        dashboardData.company,
        dashboardData.pipeline,
      ],
    );

  const enterpriseIntelligence =
    useMemo(
      () =>
        dashboardData.company
          ? buildDashboardEnterpriseIntelligence({
              organizationId:
                dashboardData.company.id,

              companyName:
                dashboardData.company.name,

              industry:
                dashboardData.company.industry,

              country:
                dashboardData.company.country,

              employeeCount:
                dashboardData.company.employee_count,

              discoveryAnswersCount:
                dashboardData.answersCount,

              readinessScore,

              corporateBrainScore,

              overdueLeads:
                pipelineMetrics.overdueLeads,
            })
          : null,
      [
        dashboardData.company,
        dashboardData.answersCount,
        readinessScore,
        corporateBrainScore,
        pipelineMetrics.overdueLeads,
      ],
    );
  const [language, setLanguage] = useState<Language>("ar");

  const copy = content[language];
  const isArabic = language === "ar";
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;

  const [aiRecommendation, setAIRecommendation] =
    useState("");

  const [aiSourceLabel, setAISourceLabel] =
    useState("");

  const companyName =
    dashboardData.company?.name
    ?? (
      isArabic
        ? "المؤسسة الحالية"
        : "Current organization"
    );

  const enterpriseHealthScore =
    enterpriseIntelligence
      ?.enterpriseHealthScore
    ?? readinessScore;

  const healthStatusLabel =
    enterpriseHealthScore >= 75
      ? (
          isArabic
            ? "جاهزية جيدة"
            : "Ready"
        )
      : enterpriseHealthScore >= 50
        ? (
            isArabic
              ? "يحتاج إلى اهتمام"
              : "Needs Attention"
          )
        : (
            isArabic
              ? "قيد البناء"
              : "Building"
          );

  const pageTitle =
    isArabic
      ? `نظرة تنفيذية على ${companyName}`
      : `${companyName} enterprise health overview`;

  const pageSubtitle =
    isArabic
      ? "هذه القراءة مبنية على بيانات المؤسسة الحالية ونتائج الاستكشاف ومسار المبيعات، ولا تعرض أرقام أداء غير متوفرة في مصادر البيانات."
      : "This view is calculated from current company data, discovery evidence, and the sales pipeline. Metrics without a verified production source are not presented as measured performance.";

  const profileFieldCount =
    [
      dashboardData.company?.name,
      dashboardData.company?.industry,
      dashboardData.company?.country,
      dashboardData.company?.employee_count,
    ].filter(
      (value) =>
        value !== null
        && value !== undefined
        && value !== "",
    ).length;

  const profileCompletenessScore =
    Math.round(
      (
        profileFieldCount
        / 4
      ) * 100,
    );

  const discoveryCoverageScore =
    Math.min(
      100,
      dashboardData.answersCount
      * 10,
    );

  const commercialExecutionScore =
    pipelineMetrics.totalLeads > 0
      ? pipelineMetrics.conversionRate
      : 0;

  const executionAttentionScore =
    pipelineMetrics.totalLeads > 0
      ? Math.max(
          0,
          100
          - pipelineMetrics.overdueLeads
            * 15,
        )
      : 0;

  const getTone = (
    score: number,
  ): keyof typeof toneClasses =>
    score >= 75
      ? "success"
      : score >= 50
        ? "good"
        : "attention";

  const getStatus = (
    score: number,
  ): string =>
    score >= 75
      ? (
          isArabic
            ? "جاهز"
            : "Ready"
        )
      : score >= 50
        ? (
            isArabic
              ? "متابعة"
              : "Attention"
          )
        : (
            isArabic
              ? "قيد البناء"
              : "Building"
          );

  const liveDimensions = [
    {
      title:
        isArabic
          ? "جاهزية المؤسسة"
          : "Enterprise Readiness",

      score:
        readinessScore,

      status:
        getStatus(
          readinessScore,
        ),

      insight:
        isArabic
          ? "مؤشر مشتق من اكتمال ملف المؤسسة ومدخلات الاستكشاف الحالية."
          : "Derived from the active company profile and current discovery inputs.",

      metric:
        isArabic
          ? `${dashboardData.answersCount} إجابة استكشاف محفوظة`
          : `${dashboardData.answersCount} discovery answers saved`,

      icon:
        Building2,

      tone:
        getTone(
          readinessScore,
        ),
    },

    {
      title:
        isArabic
          ? "التنفيذ التجاري"
          : "Commercial Execution",

      score:
        commercialExecutionScore,

      status:
        getStatus(
          commercialExecutionScore,
        ),

      insight:
        isArabic
          ? "مؤشر يعتمد على التحويل الفعلي داخل مسار المبيعات الحالي."
          : "Based on actual conversion activity in the current sales pipeline.",

      metric:
        isArabic
          ? `${pipelineMetrics.totalLeads} فرصة، معدل التحويل ${pipelineMetrics.conversionRate}%`
          : `${pipelineMetrics.totalLeads} opportunities, ${pipelineMetrics.conversionRate}% conversion`,

      icon:
        TrendingUp,

      tone:
        getTone(
          commercialExecutionScore,
        ),
    },

    {
      title:
        isArabic
          ? "الانضباط التنفيذي"
          : "Execution Discipline",

      score:
        executionAttentionScore,

      status:
        getStatus(
          executionAttentionScore,
        ),

      insight:
        pipelineMetrics.overdueLeads > 0
          ? (
              isArabic
                ? "توجد عناصر متأخرة في مسار التنفيذ تحتاج إلى مراجعة."
                : "Current pipeline data contains overdue execution items requiring review."
            )
          : (
              isArabic
                ? "لا تظهر بيانات المسار الحالية عناصر متأخرة."
                : "No overdue execution items are currently detected in the pipeline."
            ),

      metric:
        isArabic
          ? `${pipelineMetrics.overdueLeads} عناصر متأخرة`
          : `${pipelineMetrics.overdueLeads} overdue items`,

      icon:
        CircleAlert,

      tone:
        getTone(
          executionAttentionScore,
        ),
    },

    {
      title:
        isArabic
          ? "تغطية الاستكشاف"
          : "Discovery Coverage",

      score:
        discoveryCoverageScore,

      status:
        getStatus(
          discoveryCoverageScore,
        ),

      insight:
        isArabic
          ? "تعكس مقدار السياق المؤسسي المتوفر حاليًا للتحليل والتوصيات."
          : "Reflects the amount of current enterprise context available for analysis and recommendations.",

      metric:
        isArabic
          ? `${dashboardData.answersCount} إشارات مؤسسية`
          : `${dashboardData.answersCount} enterprise signals`,

      icon:
        UsersRound,

      tone:
        getTone(
          discoveryCoverageScore,
        ),
    },

    {
      title:
        isArabic
          ? "جاهزية المعرفة"
          : "Knowledge Readiness",

      score:
        corporateBrainScore,

      status:
        getStatus(
          corporateBrainScore,
        ),

      insight:
        isArabic
          ? "مؤشر جاهزية Corporate Brain بناءً على السياق المؤسسي المتوفر حاليًا."
          : "Corporate Brain knowledge-readiness indicator based on currently available enterprise context.",

      metric:
        isArabic
          ? `جاهزية المعرفة ${corporateBrainScore}%`
          : `Knowledge readiness ${corporateBrainScore}%`,

      icon:
        BrainCircuit,

      tone:
        getTone(
          corporateBrainScore,
        ),
    },
  ];

  const signalValues =
    liveDimensions.map(
      (dimension) =>
        dimension.score,
    );

  const signalLabels =
    liveDimensions.map(
      (dimension) =>
        dimension.title,
    );

  const liveSummaries = [
    {
      title:
        isArabic
          ? "الوضع الحالي"
          : "Current Position",

      text:
        isArabic
          ? `مؤشر صحة المؤسسة الحالي هو ${enterpriseHealthScore} من 100، بناءً على البيانات المتوفرة للمؤسسة النشطة.`
          : `Current enterprise health is ${enterpriseHealthScore}/100 based on the active organization's available data.`,

      tone:
        "success" as const,

      icon:
        CheckCircle2,
    },

    {
      title:
        isArabic
          ? "ما يحتاج إلى اهتمام"
          : "Needs Attention",

      text:
        pipelineMetrics.overdueLeads > 0
          ? (
              isArabic
                ? `هناك ${pipelineMetrics.overdueLeads} عناصر متأخرة في مسار المبيعات تتطلب مراجعة تنفيذية.`
                : `${pipelineMetrics.overdueLeads} overdue sales-pipeline items require executive review.`
            )
          : corporateBrainScore < 70
            ? (
                isArabic
                  ? "رفع جاهزية المعرفة سيحسن جودة التحليل والتوصيات التنفيذية."
                  : "Increasing knowledge readiness will improve the quality of executive analysis and recommendations."
              )
            : (
                isArabic
                  ? "لا تظهر المؤشرات الحالية عناصر تنفيذية متأخرة، مع استمرار الحاجة إلى متابعة البيانات."
                  : "Current signals show no overdue execution items; continued data monitoring remains appropriate."
              ),

      tone:
        "attention" as const,

      icon:
        CircleAlert,
    },

    {
      title:
        isArabic
          ? "الإجراء التنفيذي التالي"
          : "Recommended Executive Action",

      text:
        enterpriseIntelligence
          ?.nextExecutionStep
        ?? (
          isArabic
            ? "استكمال بيانات المؤسسة قبل اتخاذ قرار تنفيذي."
            : "Complete enterprise context before taking the next executive action."
        ),

      tone:
        "good" as const,

      icon:
        Target,
    },
  ];

  const liveImpactLabel =
    isArabic
      ? "المؤشر التشغيلي الحالي"
      : "Current Operational Signal";

  const liveImpactValue =
    pipelineMetrics.overdueLeads > 0
      ? `${pipelineMetrics.overdueLeads}`
      : `${pipelineMetrics.conversionRate}%`;

  const liveImpactText =
    pipelineMetrics.overdueLeads > 0
      ? (
          isArabic
            ? "عناصر تنفيذية متأخرة"
            : "overdue execution items"
        )
      : (
          isArabic
            ? "معدل التحويل الحالي"
            : "current pipeline conversion"
        );

  useEffect(() => {
    if (
      dashboardLoading
      || !dashboardData.company
      || !enterpriseIntelligence
    ) {
      return;
    }

    const company =
      dashboardData.company;

    const controller =
      new AbortController();

    const deterministicFallback =
      enterpriseIntelligence
        .recommendationSummary;

    setAIRecommendation(
      deterministicFallback,
    );

    setAISourceLabel(
      isArabic
        ? "ذكاء مؤسسي حتمي مبني على البيانات الحالية"
        : "Deterministic enterprise intelligence based on current data",
    );

    const generateGroundedRecommendation =
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
                      "Generate a concise executive recommendation for the active company using only the supplied evidence.",

                    question:
                      isArabic
                        ? "ما الإجراء التنفيذي الأعلى أولوية بناءً على الأدلة الحالية فقط؟"
                        : "What is the highest-priority executive action based only on the current evidence?",

                    evidence: [
                      {
                        id:
                          "COMPANY-PROFILE",

                        source:
                          "supabase.companies",

                        label:
                          "Active company profile",

                        value: {
                          companyName:
                            dashboardData.company?.name,

                          industry:
                            dashboardData.company?.industry,

                          country:
                            dashboardData.company?.country,

                          employeeCount:
                            dashboardData.company?.employee_count,

                          profileCompletenessScore,
                        },
                      },

                      {
                        id:
                          "DISCOVERY",

                        source:
                          "supabase.discovery_answers",

                        label:
                          "Discovery evidence coverage",

                        value: {
                          answersCount:
                            dashboardData.answersCount,

                          readinessScore,

                          discoveryCoverageScore,

                          corporateBrainScore,
                        },
                      },

                      {
                        id:
                          "PIPELINE",

                        source:
                          "supabase.sales_pipeline",

                        label:
                          "Current sales pipeline",

                        value: {
                          totalLeads:
                            pipelineMetrics.totalLeads,

                          wonLeads:
                            pipelineMetrics.wonLeads,

                          pipelineValue:
                            pipelineMetrics.pipelineValue,

                          conversionRate:
                            pipelineMetrics.conversionRate,

                          overdueLeads:
                            pipelineMetrics.overdueLeads,
                        },
                      },

                      {
                        id:
                          "ENTERPRISE-HEALTH",

                        source:
                          "kafu.dashboard-enterprise-intelligence",

                        label:
                          "Deterministic enterprise health",

                        value: {
                          enterpriseHealthScore,

                          executionPriority:
                            enterpriseIntelligence.executionPriority,

                          nextExecutionStep:
                            enterpriseIntelligence.nextExecutionStep,
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
                          "company-dashboard",
                      },
                    },

                    instructions:
                      "Use only supplied evidence. Do not invent revenue growth, cash runway, approval-cycle duration, employee engagement, financial health, AI adoption, estimated impact, forecasts, or other unavailable metrics. Keep the answer concise and executive-ready. Cite material claims using the supplied evidence IDs in square brackets.",
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

          const groundedText =
            typeof payload.text
              === "string"
              ? payload.text
              : typeof payload.result?.text
                  === "string"
                ? payload.result.text
                : "";

          if (
            groundedText.trim()
          ) {
            setAIRecommendation(
              groundedText.trim(),
            );

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

            setAISourceLabel(
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
            "Company Dashboard Grounded AI generation failed:",
            error,
          );

          /*
           * Keep deterministic enterprise intelligence
           * as the safe fallback. Never replace failure
           * with a predefined AI claim.
           */
        }
      };

    void generateGroundedRecommendation();

    return () => {
      controller.abort();
    };
  }, [
    dashboardLoading,
    dashboardData.company,
    dashboardData.answersCount,
    readinessScore,
    corporateBrainScore,
    profileCompletenessScore,
    discoveryCoverageScore,
    pipelineMetrics.totalLeads,
    pipelineMetrics.wonLeads,
    pipelineMetrics.pipelineValue,
    pipelineMetrics.conversionRate,
    pipelineMetrics.overdueLeads,
    enterpriseIntelligence,
    enterpriseHealthScore,
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
                    {pageTitle}
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                    {pageSubtitle}
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
                  {enterpriseHealthScore}
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
                {healthStatusLabel}
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
                  {liveDimensions[0].score}
                </p>

                <p className="text-xs font-semibold text-[var(--text-muted)]">
                  {liveDimensions[0].title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-[var(--border-default)] px-5 py-3.5 sm:border-b-0 sm:border-e">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <UsersRound className="h-[17px] w-[17px]" />
              </span>

              <div>
                <p className="text-lg font-black text-[var(--text-primary)]">
                  {liveDimensions[3].score}
                </p>

                <p className="text-xs font-semibold text-[var(--text-muted)]">
                  {liveDimensions[3].title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <BrainCircuit className="h-[17px] w-[17px]" />
              </span>

              <div>
                <p className="text-lg font-black text-[var(--text-primary)]">
                  {liveDimensions[4].score}
                </p>

                <p className="text-xs font-semibold text-[var(--text-muted)]">
                  {liveDimensions[4].title}
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
            {liveDimensions.map((dimension) => {
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
                  {copy.chartTitle}
                </h2>
              </div>

              <span className="text-xs text-slate-500">
                {copy.chartHelper}
              </span>
            </div>

            <div className="mt-5 flex h-36 items-end gap-2 sm:gap-3">
              {signalValues.map((value, index) => (
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
                    {signalLabels[index]}
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
              {aiRecommendation || enterpriseIntelligence?.recommendationSummary || "No recommendation available yet."}
            </p>

            <div className="mt-4 text-xs font-black text-blue-700">
              {aiSourceLabel}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                {liveImpactLabel}
              </p>

              <div className="mt-2 flex items-end gap-3">
                <span className="text-4xl font-black tracking-tight text-emerald-600">
                  {liveImpactValue}
                </span>

                <span className="pb-1 text-sm text-slate-600">
                  {liveImpactText}
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
            {liveSummaries.map((item) => {
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
            KAFU AI آ· Enterprise Operating Intelligence
          </p>
        </footer>
      </section>
    </main>
  );
}




