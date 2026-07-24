"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";

import ExecutiveHero from "@/components/executive-dashboard/ExecutiveHero";
import ExecutiveKpiGrid from "@/components/executive-dashboard/ExecutiveKpiGrid";
import ExecutiveInsights from "@/components/executive-dashboard/ExecutiveInsights";
import ExecutiveDecisionCenter from "@/components/executive-dashboard/ExecutiveDecisionCenter";
import ExecutiveActivityFeed from "@/components/executive-dashboard/ExecutiveActivityFeed";
import ExecutiveHealthOverview from "@/components/executive-dashboard/ExecutiveHealthOverview";

import ExecutiveCards from "@/components/dashboard/ExecutiveCards";
import ExecutiveSignals from "@/components/dashboard/ExecutiveSignals";
import ExecutiveSummaryCard from "@/components/dashboard/ExecutiveSummaryCard";
import RiskWatch from "@/components/dashboard/RiskWatch";
import PipelineSnapshot from "@/components/dashboard/PipelineSnapshot";

import LeadStageButtons from "./LeadStageButtons";

import {
  DIGITAL_WORKFORCE_BASELINE,
  buildExecutiveCards,
  buildStageCounts,
  calculateCorporateBrainScore,
  calculatePipelineMetrics,
  calculateReadinessScore,
} from "@/lib/executive-dashboard";

import {
  buildExecutivePriorities,
  buildExecutiveRisks,
  generateExecutiveSignals,
} from "@/lib/executive-intelligence";

import { buildExecutiveSummary } from "@/lib/executive-summary";
import { buildDashboardEnterpriseIntelligence } from "../../src/product/dashboard";

type Company = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
  contact_name?: string | null;
  contact_phone?: string | null;
};

type DiscoveryAnswer = {
  id: string;
  question: string;
  answer: string;
  question_order: number;
};

type PipelineItem = {
  id: string;
  status: string | null;
  sales_rep: string | null;
  opportunity_value: number | null;
  response_deadline: string | null;
  is_overdue: boolean;
  companies?: {
    name: string | null;
    contact_name: string | null;
    contact_phone: string | null;
  } | null;
};

type DashboardData = {
  company: Company;
  companies: Company[];
  answers: DiscoveryAnswer[];
  pipeline: PipelineItem[];
};

const CLOSED_PIPELINE_STATUSES = new Set(["Won", "Lost"]);

function formatCurrency(value: number | null) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function getPipelineStatusClasses(status: string | null) {
  switch (status) {
    case "Won":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Lost":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Proposal":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "Meeting":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Contacted":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-blue-200 bg-blue-50 text-blue-700";
  }
}

function getPipelineStatusLabel(status: string | null) {
  switch (status) {
    case "Won":
      return "مكتملة";
    case "Lost":
      return "مغلقة";
    case "Proposal":
      return "عرض مقدم";
    case "Meeting":
      return "اجتماع";
    case "Contacted":
      return "تم التواصل";
    default:
      return "فرصة جديدة";
  }
}

function DashboardLoadingState() {
  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="animate-pulse p-6 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-3 w-28 rounded-full bg-slate-200" />
            <div className="h-7 w-64 max-w-full rounded-lg bg-slate-200" />
          </div>

          <div className="h-10 w-10 rounded-xl bg-slate-100" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="h-28 rounded-xl bg-slate-100" />
          <div className="h-28 rounded-xl bg-slate-100" />
          <div className="h-28 rounded-xl bg-slate-100" />
        </div>

        <div className="mt-5 h-48 rounded-xl bg-slate-100" />

        <p className="mt-6 text-center text-sm font-semibold text-slate-500">
          جارٍ تجهيز لوحة القيادة التنفيذية...
        </p>
      </div>
    </section>
  );
}

function DashboardErrorState({ message }: { message: string }) {
  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50"
      role="alert"
    >
      <div className="flex flex-col items-start justify-between gap-6 p-6 sm:p-6 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-800">
              يتطلب استكمال الإعداد
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-950 sm:text-2xl">
            تعذر تحميل بيانات لوحة القيادة
          </h2>

          <p className="mt-3 leading-7 text-slate-600">{message}</p>
        </div>

        <Link
          href="/assessment"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
          الانتقال إلى التقييم
        </Link>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {eyebrow}
      </p>

      <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
        {title}
      </h2>

      {description && (
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      setMessage("");

      try {
        const companyId = getCurrentCompanyId();

        if (!companyId) {
          throw new Error(
            "لم يتم العثور على شركة حالية. ابدأ من التقييم لاختيار الشركة وتجهيز بياناتها.",
          );
        }

        const [
          companiesResult,
          pipelineResult,
          companyResult,
          answersResult,
        ] = await Promise.all([
          supabase
            .from("companies")
            .select(
              "id, name, industry, country, employee_count, contact_name, contact_phone",
            )
            .order("created_at", { ascending: false }),

          supabase
            .from("sales_pipeline")
            .select(`
              id,
              status,
              sales_rep,
              opportunity_value,
              response_deadline,
              companies (
                name,
                contact_name,
                contact_phone
              )
            `)
            .order("created_at", { ascending: false }),

          supabase
            .from("companies")
            .select(
              "id, name, industry, country, employee_count, contact_name, contact_phone",
            )
            .eq("id", companyId)
            .single(),

          supabase
            .from("discovery_answers")
            .select("id, question, answer, question_order")
            .eq("company_id", companyId)
            .order("question_order", { ascending: true }),
        ]);

        if (companiesResult.error) {
          throw new Error(
            `تعذر تحميل قائمة الشركات: ${companiesResult.error.message}`,
          );
        }

        if (pipelineResult.error) {
          throw new Error(
            `تعذر تحميل مسار المبيعات: ${pipelineResult.error.message}`,
          );
        }

        if (companyResult.error || !companyResult.data) {
          throw new Error(
            `تعذر تحميل بيانات الشركة: ${
              companyResult.error?.message ?? "الشركة غير موجودة"
            }`,
          );
        }

        if (answersResult.error) {
          throw new Error(
            `تعذر تحميل إجابات الاستكشاف: ${answersResult.error.message}`,
          );
        }

        if (!isMounted) {
          return;
        }

        const currentTimestamp = Date.now();

        const normalizedPipeline: PipelineItem[] = (
          pipelineResult.data ?? []
        ).map((item) => {
          const companyRecord = Array.isArray(item.companies)
            ? item.companies[0] ?? null
            : item.companies ?? null;

          const deadlineTimestamp = item.response_deadline
            ? new Date(item.response_deadline).getTime()
            : null;

          const isOverdue =
            deadlineTimestamp !== null &&
            !CLOSED_PIPELINE_STATUSES.has(item.status ?? "") &&
            deadlineTimestamp < currentTimestamp;

          return {
            id: item.id,
            status: item.status,
            sales_rep: item.sales_rep,
            opportunity_value: item.opportunity_value,
            response_deadline: item.response_deadline,
            is_overdue: isOverdue,
            companies: companyRecord,
          };
        });

        const dashboardData: DashboardData = {
          company: companyResult.data,
          companies: companiesResult.data ?? [],
          answers: answersResult.data ?? [],
          pipeline: normalizedPipeline,
        };

        setCompany(dashboardData.company);
        setCompanies(dashboardData.companies);
        setAnswers(dashboardData.answers);
        setPipeline(dashboardData.pipeline);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMessage(
          error instanceof Error
            ? error.message
            : "حدث خطأ غير متوقع أثناء تحميل لوحة القيادة.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const pipelineMetrics = useMemo(
    () => calculatePipelineMetrics(companies, pipeline),
    [companies, pipeline],
  );

  const readinessNumber = useMemo(
    () => calculateReadinessScore(answers.length, company),
    [answers.length, company],
  );

  const corporateBrainNumber = useMemo(
    () => calculateCorporateBrainScore(answers.length),
    [answers.length],
  );

  const executiveSummary = useMemo(
    () =>
      buildExecutiveSummary({
        companyName: company?.name,
        industry: company?.industry,
        country: company?.country,
        employeeCount: company?.employee_count,
        discoveryAnswersCount: answers.length,
        readinessScore: readinessNumber,
        corporateBrainScore: corporateBrainNumber,
        overdueLeads: pipelineMetrics.overdueLeads,
      }),
    [
      company,
      answers.length,
      readinessNumber,
      corporateBrainNumber,
      pipelineMetrics.overdueLeads,
    ],
  );

  const enterpriseIntelligence = useMemo(
    () =>
      company
        ? buildDashboardEnterpriseIntelligence({
            organizationId: company.id,
            companyName: company.name,
            industry: company.industry,
            country: company.country,
            employeeCount: company.employee_count,
            discoveryAnswersCount: answers.length,
            readinessScore: readinessNumber,
            corporateBrainScore: corporateBrainNumber,
            overdueLeads: pipelineMetrics.overdueLeads,
          })
        : null,
    [
      company,
      answers.length,
      readinessNumber,
      corporateBrainNumber,
      pipelineMetrics.overdueLeads,
    ],
  );

  const executiveCards = useMemo(
    () =>
      buildExecutiveCards({
        company,
        answersCount: answers.length,
        readinessNumber,
        corporateBrainNumber,
        digitalWorkforceBaseline: DIGITAL_WORKFORCE_BASELINE,
        overdueLeads: pipelineMetrics.overdueLeads,
      }),
    [
      company,
      answers.length,
      readinessNumber,
      corporateBrainNumber,
      pipelineMetrics.overdueLeads,
    ],
  );

  const signals = useMemo(
    () =>
      generateExecutiveSignals({
        companyName: company?.name,
        industry: company?.industry,
        employeeCount: company?.employee_count,
        discoveryAnswersCount: answers.length,
        overdueLeads: pipelineMetrics.overdueLeads,
      }),
    [company, answers.length, pipelineMetrics.overdueLeads],
  );

  const priorities = useMemo(() => buildExecutivePriorities(), []);

  const risks = useMemo(
    () =>
      buildExecutiveRisks({
        company,
        answersCount: answers.length,
        overdueLeads: pipelineMetrics.overdueLeads,
      }),
    [company, answers.length, pipelineMetrics.overdueLeads],
  );

  const stageCounts = useMemo(() => buildStageCounts(pipeline), [pipeline]);

  return (
    <main
      className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-5 lg:px-8 lg:py-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1440px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ExecutiveHero />

          <div className="border-t border-slate-200 px-4 py-5 sm:px-5 lg:px-8">
            <ExecutiveKpiGrid />
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <ExecutiveInsights />
          <ExecutiveDecisionCenter />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <ExecutiveHealthOverview />
          <ExecutiveActivityFeed />
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-center">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  KAFU Executive Dashboard
                </span>

                <span className="text-xs font-medium text-slate-400">
                  آخر عرض تشغيلي موحد
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                لوحة القيادة التنفيذية
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                رؤية موحدة لأداء الشركة وجاهزيتها المؤسسية وذكائها التنفيذي
                ومسار الفرص التجارية المبني على البيانات الفعلية.
              </p>
            </div>

            {company && (
              <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 lg:min-w-72">
                <p className="text-xs font-bold text-slate-500">
                  الشركة الحالية
                </p>

                <p className="mt-2 truncate text-base font-bold text-slate-950">
                  {company.name || "شركة غير مسماة"}
                </p>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {[company.industry, company.country]
                    .filter(Boolean)
                    .join(" • ") || "بيانات التعريف قيد الاستكمال"}
                </p>
              </div>
            )}
          </div>
        </section>

        {loading && <DashboardLoadingState />}

        {!loading && message && <DashboardErrorState message={message} />}

        {!loading && !message && company && (
          <>
            <div className="mt-6">
              <ExecutiveCards cards={executiveCards} />
            </div>

            {enterpriseIntelligence && (
              <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
                  <SectionHeading
                    eyebrow="Enterprise Intelligence"
                    title="التوجيه التنفيذي المقترح"
                    description="ملخص موحد للتحليل والقرار والتوصية المستخلصة من بيانات المؤسسة الحالية."
                  />
                </div>

                <div className="grid gap-px bg-slate-200 lg:grid-cols-3">
                  <article className="bg-white p-6 sm:p-7">
                    <p className="text-xs font-bold text-slate-500">التحليل</p>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-800">
                      {enterpriseIntelligence.reasoningSummary}
                    </p>
                  </article>

                  <article className="bg-white p-6 sm:p-7">
                    <p className="text-xs font-bold text-slate-500">
                      القرار التنفيذي
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-800">
                      {enterpriseIntelligence.decisionTitle}
                    </p>
                  </article>

                  <article className="bg-emerald-50 p-6 sm:p-7">
                    <p className="text-xs font-bold text-emerald-700">
                      التوصية
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-7 text-emerald-950">
                      {enterpriseIntelligence.recommendationSummary}
                    </p>
                  </article>
                </div>
              </section>
            )}

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <ExecutiveSummaryCard summary={executiveSummary} />
              <ExecutiveSignals signals={signals} />
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
                <SectionHeading
                  eyebrow="Executive Priorities"
                  title="الأولويات التنفيذية"
                  description="المحاور الأعلى أولوية للحفاظ على تقدم المؤسسة وتقليل المخاطر التشغيلية."
                />
              </div>

              <div className="grid gap-px bg-slate-200 md:grid-cols-2 xl:grid-cols-4">
                {priorities.map((item, index) => (
                  <article
                    key={`${item}-${index}`}
                    className="flex min-h-40 flex-col bg-white p-6"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="mt-5 text-sm font-semibold leading-7 text-slate-800">
                      {item}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
  <RiskWatch risks={risks} />

  <Link
    href="/sales-intelligence"
    aria-label="فتح مركز ذكاء المبيعات"
    className="group block rounded-2xl outline-none transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 lg:col-span-2"
  >
    <div className="h-full rounded-2xl transition duration-200 group-hover:shadow-lg">
      <PipelineSnapshot
        totalCompanies={pipelineMetrics.totalCompanies}
        totalLeads={pipelineMetrics.totalLeads}
        pipelineValue={pipelineMetrics.pipelineValue}
        conversionRate={pipelineMetrics.conversionRate}
      />
    </div>

    <div className="pointer-events-none mt-3 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition group-hover:border-blue-300 group-hover:bg-blue-100">
      <span>عرض التحليل الكامل والتوقعات والتوصيات</span>
      <span dir="ltr">Open Sales Intelligence →</span>
    </div>
  </Link>
</section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
                <SectionHeading
                  eyebrow="Pipeline Distribution"
                  title="توزيع مراحل الفرص"
                />
              </div>

              <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
                {stageCounts.map((stage) => (
                  <article
                    key={stage.stage}
                    className="flex items-center justify-between gap-4 bg-white px-5 py-5"
                  >
                    <p className="text-sm font-semibold text-slate-600">
                      {stage.stage}
                    </p>

                    <p className="text-2xl font-bold tracking-tight text-slate-950">
                      {stage.count}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
                <SectionHeading
                  eyebrow="Sales Pipeline"
                  title="مسار المبيعات"
                  description="متابعة الفرص من التسجيل والتواصل وحتى الاجتماع والعرض والإغلاق، مع مراقبة الالتزام بزمن الاستجابة."
                />
              </div>

              {pipeline.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-lg font-bold text-slate-400">0</span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    لا توجد فرص مسجلة حاليًا
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
                    ستظهر بيانات مسار المبيعات هنا بمجرد تسجيل أول فرصة
                    تجارية.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-right">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-xs text-slate-500">
                        <th className="px-5 py-4 font-bold">الشركة</th>
                        <th className="px-5 py-4 font-bold">المندوب</th>
                        <th className="px-5 py-4 font-bold">الحالة</th>
                        <th className="px-5 py-4 font-bold">تحديث الحالة</th>
                        <th className="px-5 py-4 font-bold">قيمة الفرصة</th>
                        <th className="px-5 py-4 font-bold">SLA</th>
                        <th className="px-5 py-4 font-bold">جهة الاتصال</th>
                        <th className="px-5 py-4 font-bold">الجوال</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {pipeline.map((item) => (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <td className="px-5 py-5 text-sm font-bold text-slate-950">
                            {item.companies?.name || "غير محدد"}
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-600">
                            {item.sales_rep || "غير معين"}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getPipelineStatusClasses(
                                item.status,
                              )}`}
                            >
                              {getPipelineStatusLabel(item.status)}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <LeadStageButtons pipelineId={item.id} />
                          </td>

                          <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                            {formatCurrency(item.opportunity_value)}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                                item.is_overdue
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {item.is_overdue ? "متأخر" : "ضمن المسار"}
                            </span>
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-600">
                            {item.companies?.contact_name || "غير محدد"}
                          </td>

                          <td
                            className="px-5 py-5 text-sm text-slate-600"
                            dir="ltr"
                          >
                            {item.companies?.contact_phone || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
              <div className="flex flex-col justify-between gap-6 px-5 py-6 sm:px-8 md:flex-row md:items-center">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Executive Intelligence
                  </p>

                  <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                    طبقة الذكاء التنفيذي جاهزة للعمل
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    تم تحويل بيانات الشركة إلى مؤشرات تنفيذية وقرارات
                    وتوصيات قابلة للمراجعة ضمن رحلة مؤسسية موحدة.
                  </p>
                </div>

                <Link
                  href="/journey"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                >
                  مراجعة الرحلة الكاملة
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}


