import AIRecommendationCard from "@/components/workspace/dashboard/AIRecommendationCard";
import AICommandCenter from "@/components/workspace/dashboard/AICommandCenter";
import AIInsightsFeed from "@/components/workspace/dashboard/AIInsightsFeed";
import CompanyHealthCard from "@/components/workspace/dashboard/CompanyHealthCard";
import DashboardHeader from "@/components/workspace/dashboard/DashboardHeader";
import ExecutiveAlertPanel from "@/components/workspace/dashboard/ExecutiveAlertPanel";
import ExecutiveBrief from "@/components/workspace/dashboard/ExecutiveBrief";
import ExecutiveDecisionBar from "@/components/workspace/dashboard/ExecutiveDecisionBar";
import ExecutiveKPI from "@/components/workspace/dashboard/ExecutiveKPI";
import ExecutiveMetricsGrid from "@/components/workspace/dashboard/ExecutiveMetricsGrid";
import ExecutiveProfile from "@/components/workspace/dashboard/ExecutiveProfile";
import Notifications from "@/components/workspace/dashboard/Notifications";
import PayrollReadinessCard from "@/components/workspace/dashboard/PayrollReadinessCard";
import ProgressCard from "@/components/workspace/dashboard/ProgressCard";
import QuickActions from "@/components/workspace/dashboard/QuickActions";
import Recommendations from "@/components/workspace/dashboard/Recommendations";
import RiskOpportunitiesRadar from "@/components/workspace/dashboard/RiskOpportunitiesRadar";
import StrategicKPICards from "@/components/workspace/dashboard/StrategicKPICards";
import SystemStatus from "@/components/workspace/dashboard/SystemStatus";

export default function WorkspaceDashboardPage() {
  return (
    <main
      className="min-h-screen bg-slate-100/80 py-4 lg:py-6"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-[1580px] space-y-5 px-4 sm:px-6 lg:px-8">
        <section className="space-y-3.5">
          <DashboardHeader />
          <ExecutiveBrief />
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/60 p-3.5 shadow-sm backdrop-blur sm:p-4">
          <div className="grid items-start gap-3.5 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <AICommandCenter />
            </div>

            <div className="xl:col-span-4">
              <ExecutiveProfile />
            </div>

            <div className="xl:col-span-12">
              <ExecutiveDecisionBar />
            </div>

            <div className="xl:col-span-12">
              <SystemStatus />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="px-1">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-600">
              Executive Performance
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              مؤشرات الأداء والجاهزية
            </h2>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
              قراءة تنفيذية موحدة لأهم مؤشرات الأداء وصحة الشركة والجاهزية الاستراتيجية.
            </p>
          </div>

          <ExecutiveKPI />
          <ExecutiveMetricsGrid />
          <CompanyHealthCard />
          <StrategicKPICards />
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/60 p-3.5 shadow-sm backdrop-blur sm:p-4">
          <RiskOpportunitiesRadar />
        </section>

        <section className="space-y-5">
          <div className="px-1">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-sky-600">
              Intelligence &amp; Actions
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              الرؤى والتوصيات التنفيذية
            </h2>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
              توصيات وتنبيهات وإجراءات عملية تساعد الإدارة على الانتقال من الرؤية إلى التنفيذ.
            </p>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-12">
            <div className="space-y-5 xl:col-span-8">
              <AIInsightsFeed />
              <Recommendations />
            </div>

            <div className="space-y-5 xl:col-span-4">
              <PayrollReadinessCard />
              <AIRecommendationCard />
              <ExecutiveAlertPanel />
              <ProgressCard />
              <Notifications />
              <QuickActions />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}