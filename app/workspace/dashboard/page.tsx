import AICommandCenter from "@/components/workspace/dashboard/AICommandCenter";
import AIInsightsFeed from "@/components/workspace/dashboard/AIInsightsFeed";
import DashboardHeader from "@/components/workspace/dashboard/DashboardHeader";
import ExecutiveDecisionBar from "@/components/workspace/dashboard/ExecutiveDecisionBar";
import ExecutiveKPI from "@/components/workspace/dashboard/ExecutiveKPI";
import ExecutiveMetricsGrid from "@/components/workspace/dashboard/ExecutiveMetricsGrid";
import ExecutiveProfile from "@/components/workspace/dashboard/ExecutiveProfile";
import Notifications from "@/components/workspace/dashboard/Notifications";
import ProgressCard from "@/components/workspace/dashboard/ProgressCard";
import QuickActions from "@/components/workspace/dashboard/QuickActions";
import Recommendations from "@/components/workspace/dashboard/Recommendations";
import RiskOpportunitiesRadar from "@/components/workspace/dashboard/RiskOpportunitiesRadar";
import SystemStatus from "@/components/workspace/dashboard/SystemStatus";

export default function WorkspaceDashboardPage() {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-[1700px] space-y-6 px-4 lg:px-8">
        <DashboardHeader />

        <div className="grid gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <AICommandCenter />
            <ExecutiveDecisionBar />
          </div>

          <div className="space-y-6 xl:col-span-4">
            <ExecutiveProfile />
            <SystemStatus />
          </div>
        </div>

        <ExecutiveKPI />
        <ExecutiveMetricsGrid />
        <RiskOpportunitiesRadar />

        <div className="grid gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <AIInsightsFeed />
            <Recommendations />
          </div>

          <div className="space-y-6 xl:col-span-4">
            <ProgressCard />
            <Notifications />
            <QuickActions />
          </div>
        </div>
      </div>
    </main>
  );
}