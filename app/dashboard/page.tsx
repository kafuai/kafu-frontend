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
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function getPipelineStatusClasses(status: string | null) {
  switch (status) {
    case "Won":
      return "bg-emerald-50 text-emerald-700";
    case "Lost":
      return "bg-rose-50 text-rose-700";
    case "Proposal":
      return "bg-violet-50 text-violet-700";
    case "Meeting":
      return "bg-amber-50 text-amber-700";
    case "Contacted":
      return "bg-sky-50 text-sky-700";
    default:
      return "bg-blue-50 text-blue-700";
  }
}

function DashboardLoadingState() {
  return (
    <section
      className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="animate-pulse space-y-5">
        <div className="h-6 w-48 rounded-full bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 rounded-2xl bg-slate-800" />
          <div className="h-28 rounded-2xl bg-slate-800" />
          <div className="h-28 rounded-2xl bg-slate-800" />
        </div>
        <div className="h-52 rounded-2xl bg-slate-800" />
      </div>

      <p className="mt-6 text-center font-semibold text-slate-300">
        جاري تجهيز لوحة القيادة التنفيذية...
      </p>
    </section>
  );
}

function DashboardErrorState({ message }: { message: string }) {
  return (
    <section
      className="mt-8 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8 text-center"
      role="alert"
    >
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
        يتطلب الإعداد
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        تعذر تحميل لوحة القيادة
      </h2>

      <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
        {message}
      </p>

      <Link
        href="/assessment"
        className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-slate-100"
      >
        الانتقال إلى التقييم
      </Link>
    </section>
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
            `تعذر تحميل إجابات Discovery: ${answersResult.error.message}`,
          );
        }

        if (!isMounted) {
          return;
        }
        
        const normalizedPipeline: PipelineItem[] = (
  pipelineResult.data ?? []
).map((item) => ({
  id: item.id,
  status: item.status,
  sales_rep: item.sales_rep,
  opportunity_value: item.opportunity_value,
  response_deadline: item.response_deadline,
  companies: Array.isArray(item.companies)
    ? item.companies[0] ?? null
    : item.companies ?? null,
}));

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
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <ExecutiveHero />

        <div className="mt-8">
          <ExecutiveKpiGrid />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <ExecutiveInsights />
          <ExecutiveDecisionCenter />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <ExecutiveHealthOverview />
          <ExecutiveActivityFeed />
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-bold text-emerald-300">
                KAFU Executive Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                لوحة القيادة التنفيذية
              </h1>

              <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
                رؤية موحدة لأداء الشركة، جاهزيتها المؤسسية، ذكائها التنفيذي،
                ومسار الفرص التجارية المبني على البيانات الفعلية.
              </p>
            </div>

            {company && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 lg:min-w-64">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  الشركة الحالية
                </p>

                <p className="mt-2 text-lg font-black text-white">
                  {company.name || "شركة غير مسماة"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {[company.industry, company.country]
                    .filter(Boolean)
                    .join(" · ") || "بيانات التعريف قيد الاستكمال"}
                </p>
              </div>
            )}
          </div>
        </section>

        {loading && <DashboardLoadingState />}

        {!loading && message && <DashboardErrorState message={message} />}

        {!loading && !message && company && (
          <>
            <ExecutiveCards cards={executiveCards} />

            {enterpriseIntelligence && (
              <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-white p-6 text-slate-950 shadow-xl sm:p-8">
                <div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Enterprise Intelligence
                  </p>

                  <h2 className="text-2xl font-black">
                    التوجيه التنفيذي المقترح
                  </h2>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      التحليل
                    </p>
                    <p className="mt-2 font-bold leading-7">
                      {enterpriseIntelligence.reasoningSummary}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      القرار التنفيذي
                    </p>
                    <p className="mt-2 font-bold leading-7">
                      {enterpriseIntelligence.decisionTitle}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-sm font-semibold text-emerald-700">
                      التوصية
                    </p>
                    <p className="mt-2 font-bold leading-7 text-emerald-950">
                      {enterpriseIntelligence.recommendationSummary}
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <ExecutiveSummaryCard summary={executiveSummary} />
              <ExecutiveSignals signals={signals} />
            </section>

            <section className="mt-8 rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-xl sm:p-8">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  Executive Priorities
                </p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  الأولويات التنفيذية
                </h2>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {priorities.map((item, index) => (
                  <article
                    key={`${item}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 font-black text-white">
                      {index + 1}
                    </div>

                    <p className="mt-4 font-bold leading-7 text-slate-800">
                      {item}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <RiskWatch risks={risks} />

              <PipelineSnapshot
                totalCompanies={pipelineMetrics.totalCompanies}
                totalLeads={pipelineMetrics.totalLeads}
                pipelineValue={pipelineMetrics.pipelineValue}
                conversionRate={pipelineMetrics.conversionRate}
              />
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {stageCounts.map((stage) => (
                <article
                  key={stage.stage}
                  className="rounded-3xl border border-white/10 bg-white p-5 text-center text-slate-950 shadow-lg"
                >
                  <p className="text-sm font-bold text-slate-500">
                    {stage.stage}
                  </p>
                  <p className="mt-2 text-4xl font-black">{stage.count}</p>
                </article>
              ))}
            </section>

            <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-950 shadow-xl">
              <div className="border-b border-slate-200 p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  Sales Pipeline
                </p>

                <h2 className="mt-2 text-2xl font-black">مسار المبيعات</h2>

                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  متابعة الفرص من التسجيل والتواصل وحتى الاجتماع والعرض
                  والإغلاق، مع مراقبة الالتزام بزمن الاستجابة.
                </p>
              </div>

              {pipeline.length === 0 ? (
                <div className="p-10 text-center">
                  <h3 className="text-xl font-black">
                    لا توجد فرص مسجلة حاليًا
                  </h3>

                  <p className="mt-3 text-slate-600">
                    ستظهر بيانات مسار المبيعات هنا بمجرد تسجيل أول فرصة.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[1100px] w-full text-right">
                    <thead className="bg-slate-50">
                      <tr className="text-sm text-slate-500">
                        <th className="px-6 py-4 font-bold">الشركة</th>
                        <th className="px-6 py-4 font-bold">المندوب</th>
                        <th className="px-6 py-4 font-bold">الحالة</th>
                        <th className="px-6 py-4 font-bold">تحديث الحالة</th>
                        <th className="px-6 py-4 font-bold">قيمة الفرصة</th>
                        <th className="px-6 py-4 font-bold">SLA</th>
                        <th className="px-6 py-4 font-bold">جهة الاتصال</th>
                        <th className="px-6 py-4 font-bold">الجوال</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {pipeline.map((item) => {
                        const isOverdue =
                          Boolean(item.response_deadline) &&
                          !CLOSED_PIPELINE_STATUSES.has(item.status ?? "") &&
                          new Date(item.response_deadline as string).getTime() <
                            // eslint-disable-next-line react-hooks/purity
                            Date.now();

                        return (
                          <tr
                            key={item.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-5 font-bold">
                              {item.companies?.name || "غير محدد"}
                            </td>

                            <td className="px-6 py-5 text-slate-600">
                              {item.sales_rep || "غير معين"}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getPipelineStatusClasses(
                                  item.status,
                                )}`}
                              >
                                {item.status || "New Lead"}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <LeadStageButtons pipelineId={item.id} />
                            </td>

                            <td className="px-6 py-5 font-semibold text-slate-700">
                              {formatCurrency(item.opportunity_value)}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                                  isOverdue
                                    ? "bg-red-50 text-red-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {isOverdue ? "متأخر" : "ضمن المسار"}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-slate-600">
                              {item.companies?.contact_name || "غير محدد"}
                            </td>

                            <td className="px-6 py-5 text-slate-600" dir="ltr">
                              {item.companies?.contact_phone || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="mt-8 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 sm:p-8 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">
                  Executive Intelligence
                </p>

                <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                  طبقة الذكاء التنفيذي جاهزة للعمل
                </h3>

                <p className="mt-4 max-w-3xl leading-8 text-slate-300">
                  تم تحويل بيانات الشركة إلى مؤشرات تنفيذية وقرارات وتوصيات
                  قابلة للمراجعة ضمن رحلة مؤسسية موحدة.
                </p>
              </div>

              <Link
                href="/journey"
                className="shrink-0 rounded-2xl bg-emerald-500 px-7 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                مراجعة الرحلة الكاملة
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}