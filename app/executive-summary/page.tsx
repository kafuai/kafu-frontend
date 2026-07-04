"use client";

import Link from "next/link";
import { useExecutiveSummary } from "@/hooks/useExecutiveSummary";
import { useExecutiveInsights } from "@/hooks/useExecutiveInsights";
import ExecutiveHero from "@/components/executive-report/ExecutiveHero";
import ExecutiveMetrics from "@/components/executive-report/ExecutiveMetrics";
import ExecutiveNarrative from "@/components/executive-report/ExecutiveNarrative";
import ExecutiveFooter from "@/components/executive-report/ExecutiveFooter";
import ExecutiveOverviewSection from "@/components/executive-report/sections/ExecutiveOverviewSection";
import CorporateIntelligenceSection from "@/components/executive-report/sections/CorporateIntelligenceSection";
import DecisionIntelligenceSection from "@/components/executive-report/sections/DecisionIntelligenceSection";
import StrategicInsightsSection from "@/components/executive-report/sections/StrategicInsightsSection";
import DiscoveryAppendixSection from "@/components/executive-report/sections/DiscoveryAppendixSection";

export default function ExecutiveSummaryPage() {
  const { company, answers, loading, message } = useExecutiveSummary();

  const {
    insights,
    corporateDNA,
    corporateBrain,
    opportunities,
    executiveMetrics,
  } = useExecutiveInsights(company, answers);

  return (
    <main
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_28%),radial-gradient(circle_at_top_right,#dcfce7,transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_45%,#f8fafc_100%)] px-4 py-6 text-slate-950 sm:px-6 sm:py-8 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="rounded-[2.75rem] border border-white/80 bg-white/75 p-2 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-3">
          <div className="rounded-[2.35rem] border border-slate-200/80 bg-white/85 p-3 shadow-inner shadow-white sm:p-5 lg:p-7">
            <div className="pt-6 sm:pt-8 lg:pt-10">
              <ExecutiveHero companyName={company?.name} />

              {loading && (
                <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <p className="text-xl font-black text-slate-900">
                    جاري تحميل التقرير التنفيذي...
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-500">
                    يقوم KAFU AI بتجهيز القراءة التنفيذية للشركة.
                  </p>
                </section>
              )}

              {!loading && message && (
                <section className="mt-10 rounded-[2rem] border border-amber-300 bg-amber-50 p-10 text-center text-amber-900 shadow-sm">
                  <p className="text-xl font-black">{message}</p>

                  <Link
                    href="/assessment"
                    className="mt-6 inline-block rounded-2xl bg-slate-950 px-8 py-4 font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    العودة إلى Assessment
                  </Link>
                </section>
              )}

              {!loading && !message && (
                <div className="space-y-12 lg:space-y-14">
                  <ExecutiveMetrics metrics={executiveMetrics} />

                  <ExecutiveNarrative
                    score={insights.score}
                    status={insights.status}
                    maturityLevel={insights.maturityLevel}
                    summary={insights.summary}
                  />

                  <ExecutiveOverviewSection
                    score={insights.score}
                    status={insights.status}
                    maturityLevel={insights.maturityLevel}
                    summary={insights.summary}
                    aiConfidence={insights.aiConfidence}
                    dataQualityScore={insights.dataQualityScore}
                    discoveryCompletion={insights.discoveryCompletion}
                    companyName={company?.name ?? null}
                    industry={company?.industry ?? null}
                    country={company?.country ?? null}
                    employeeCount={company?.employee_count ?? null}
                  />

                  <CorporateIntelligenceSection
                    corporateDNA={corporateDNA}
                    corporateBrain={corporateBrain}
                    score={insights.score}
                    status={insights.status}
                    maturityLevel={insights.maturityLevel}
                    aiConfidence={insights.aiConfidence}
                    dataQualityScore={insights.dataQualityScore}
                    discoveryCompletion={insights.discoveryCompletion}
                    readinessMatrix={insights.readinessMatrix}
                  />

                  <DecisionIntelligenceSection
                    overallScore={insights.score}
                    aiConfidence={insights.aiConfidence}
                    dataQualityScore={insights.dataQualityScore}
                    discoveryCompletion={insights.discoveryCompletion}
                    readinessMatrix={insights.readinessMatrix}
                  />

                  <StrategicInsightsSection
                    findings={insights.findings}
                    priorities={insights.priorities}
                    risks={insights.risks}
                    quickWins={insights.quickWins}
                    crossAnalysis={insights.crossAnalysis}
                    roadmap={insights.roadmap}
                  />

                  <DiscoveryAppendixSection
                    answers={answers}
                    opportunities={opportunities}
                  />

                  <ExecutiveFooter />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}