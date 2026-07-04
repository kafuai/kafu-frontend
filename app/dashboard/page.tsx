"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";

import LeadStageButtons from "./LeadStageButtons";
import ExecutiveCards from "@/components/dashboard/ExecutiveCards";
import ExecutiveSignals from "@/components/dashboard/ExecutiveSignals";
import ExecutiveSummaryCard from "@/components/dashboard/ExecutiveSummaryCard";
import RiskWatch from "@/components/dashboard/RiskWatch";
import PipelineSnapshot from "@/components/dashboard/PipelineSnapshot";

import {
  DIGITAL_WORKFORCE_BASELINE,
  calculateCorporateBrainScore,
  calculateReadinessScore,
  buildExecutiveCards,
  buildStageCounts,
  calculatePipelineMetrics,
} from "@/lib/executive-dashboard";

import {
  buildExecutivePriorities,
  buildExecutiveRisks,
  generateExecutiveSignals,
} from "@/lib/executive-intelligence";

import { buildExecutiveSummary } from "@/lib/executive-summary";

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

export default function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setMessage("");

      const companyId = getCurrentCompanyId();

      const { data: companiesData } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: pipelineData } = await supabase
        .from("sales_pipeline")
        .select(`
          *,
          companies (
            name,
            contact_name,
            contact_phone
          )
        `)
        .order("created_at", { ascending: false });

      setCompanies(companiesData || []);
      setPipeline(pipelineData || []);

      if (!companyId) {
        setMessage("لم يتم العثور على الشركة الحالية. يرجى البدء من Assessment.");
        setLoading(false);
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (companyError) {
        setMessage("حدث خطأ أثناء تحميل بيانات الشركة: " + companyError.message);
        setLoading(false);
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("discovery_answers")
        .select("id, question, answer, question_order")
        .eq("company_id", companyId)
        .order("question_order", { ascending: true });

      if (answersError) {
        setMessage("حدث خطأ أثناء تحميل إجابات Discovery: " + answersError.message);
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const pipelineMetrics = useMemo(
    () => calculatePipelineMetrics(companies, pipeline),
    [companies, pipeline]
  );

  const readinessNumber = useMemo(
    () => calculateReadinessScore(answers.length, company),
    [answers.length, company]
  );

  const corporateBrainNumber = useMemo(
    () => calculateCorporateBrainScore(answers.length),
    [answers.length]
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
    ]
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
    ]
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
    [company, answers.length, pipelineMetrics.overdueLeads]
  );

  const priorities = useMemo(() => buildExecutivePriorities(), []);

  const risks = useMemo(
    () =>
      buildExecutiveRisks({
        company,
        answersCount: answers.length,
        overdueLeads: pipelineMetrics.overdueLeads,
      }),
    [company, answers.length, pipelineMetrics.overdueLeads]
  );

  const stageCounts = useMemo(() => buildStageCounts(pipeline), [pipeline]);

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">KAFU Executive Dashboard</p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            لوحة القيادة التنفيذية
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
            هذه الصفحة تلخص للإدارة قيمة KAFU AI بناءً على بيانات الشركة
            الحالية، إجابات Discovery، جاهزية Corporate Brain، والفريق الرقمي
            المقترح.
          </p>
        </section>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">جاري تحميل Executive Dashboard...</p>
          </section>
        )}

        {!loading && message && (
          <section className="mt-10 rounded-3xl border border-amber-300 bg-amber-50 p-10 text-center text-amber-900 shadow-xl">
            <p className="text-xl font-bold">{message}</p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white"
            >
              العودة إلى Assessment
            </Link>
          </section>
        )}

        {!loading && !message && (
          <>
            <ExecutiveCards cards={executiveCards} />

            <section className="mt-10 grid gap-6 lg:grid-cols-3">
              <ExecutiveSummaryCard summary={executiveSummary} />
              <ExecutiveSignals signals={signals} />
            </section>

            <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
              <h2 className="text-3xl font-bold">Executive Priorities</h2>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {priorities.map((item, index) => (
                  <div key={item} className="rounded-2xl bg-slate-100 p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="font-bold leading-7 text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-3">
              <RiskWatch risks={risks} />

              <PipelineSnapshot
                totalCompanies={pipelineMetrics.totalCompanies}
                totalLeads={pipelineMetrics.totalLeads}
                pipelineValue={pipelineMetrics.pipelineValue}
                conversionRate={pipelineMetrics.conversionRate}
              />
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-5">
              {stageCounts.map((stage) => (
                <div
                  key={stage.stage}
                  className="rounded-3xl border border-slate-700 bg-white p-6 text-center text-slate-900 shadow-xl"
                >
                  <p className="text-sm font-bold text-slate-500">{stage.stage}</p>
                  <h3 className="mt-3 text-4xl font-black">{stage.count}</h3>
                </div>
              ))}
            </section>

            <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl">
              <h2 className="text-2xl font-bold">Sales Pipeline</h2>

              <p className="mt-2 text-slate-600">
                متابعة العملاء من التسجيل حتى التواصل، الاجتماع، العرض، والإغلاق.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-3">الشركة</th>
                      <th className="py-3">المندوب</th>
                      <th className="py-3">الحالة</th>
                      <th className="py-3">تغيير الحالة</th>
                      <th className="py-3">قيمة الفرصة</th>
                      <th className="py-3">SLA</th>
                      <th className="py-3">الشخص المسؤول</th>
                      <th className="py-3">الجوال</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pipeline.map((item) => {
                      const isOverdue =
                        item.response_deadline &&
                        item.status !== "Won" &&
                        item.status !== "Lost" &&
                        new Date(item.response_deadline) < new Date();

                      return (
                        <tr key={item.id} className="border-b">
                          <td className="py-4 font-bold">
                            {item.companies?.name || "-"}
                          </td>

                          <td className="py-4 text-slate-600">
                            {item.sales_rep || "-"}
                          </td>

                          <td className="py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                              {item.status || "New Lead"}
                            </span>
                          </td>

                          <td className="py-4">
                            <LeadStageButtons pipelineId={item.id} />
                          </td>

                          <td className="py-4 text-slate-600">
                            {(item.opportunity_value || 0).toLocaleString()} SAR
                          </td>

                          <td className="py-4">
                            {isOverdue ? (
                              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
                                Overdue
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                                On Track
                              </span>
                            )}
                          </td>

                          <td className="py-4 text-slate-600">
                            {item.companies?.contact_name || "-"}
                          </td>

                          <td className="py-4 text-slate-600">
                            {item.companies?.contact_phone || "-"}
                          </td>
                        </tr>
                      );
                    })}

                    {pipeline.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          لا توجد Leads في Sales Pipeline بعد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10 md:flex-row md:items-center">
              <div>
                <h3 className="text-3xl font-bold">
                  Executive Intelligence Layer جاهز للتفعيل
                </h3>

                <p className="mt-4 max-w-3xl text-lg leading-9 text-slate-300">
                  تم تحويل البيانات الأساسية إلى مؤشرات تنفيذية مباشرة، والمرحلة
                  التالية ستكون تجهيز مولد التقرير التنفيذي.
                </p>
              </div>

              <Link
                href="/journey"
                className="rounded-2xl bg-emerald-600 px-8 py-5 text-center font-bold text-white transition hover:bg-emerald-700"
              >
                Review Full Journey
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}